// SubscriptionService and EntitlementService rules, as pure functions of (state, request, now).
// The same rules run for the local preview store and inside a Firestore transaction, so a click
// always gives one deterministic result and repeated clicks cannot create duplicates.
//
// Policy (see docs/PRICING_ARCHITECTURE.md):
//  - Upgrade (higher tier, or the same tier from weekly to monthly): starts now with a fresh full period.
//  - Downgrade (lower tier, or the same tier from monthly to weekly): scheduled for the end of the period.
//  - Cancel: no next period; access continues until the period ends.
//  - Renew: only after the period has ended; uses a scheduled change if there is one; regular price
//    once the launch discount has been used. Nothing renews automatically and nothing is ever charged.
//  - The course is independent of app plans and does not expire during preview.
//  - The Starter Pack grants the course and one month of Trader together, or nothing.
import { BUNDLE_PRODUCT, COURSE_ACCESS_DAYS, COURSE_PRODUCT, FREE_LESSONS, PERIOD_DAYS } from "./catalog";
import { bundleQuote, courseQuote, getPlan, planQuote } from "./pricing";
import {
  PREVIEW_MARKERS,
  type ActivationOutcome,
  type ActivationRequest,
  type AppEntitlement,
  type AppPlanId,
  type BillingPeriod,
  type CourseEntitlement,
  type EntitlementState,
  type SubscriptionEvent,
  type SubscriptionRecord,
} from "./types";

const DAY = 86400000;

export type Change = {
  outcome: ActivationOutcome;
  message: string;
  state: EntitlementState;
  /** New activation records to store. */
  records: SubscriptionRecord[];
  /** Existing records whose status changes (superseded, cancelled). */
  updates: { subscriptionId: string; status: SubscriptionRecord["status"] }[];
  events: SubscriptionEvent[];
};

export type Ctx = { userId: string; now: number; newId: () => string };

// ── Reading state ────────────────────────────────────────────────────────────
/** The app plan's status right now (expiry is worked out on read: nothing runs in the background). */
export function appStatus(app: AppEntitlement | null, now: number): AppEntitlement["status"] | "none" {
  if (!app) return "none";
  if (app.status === "superseded") return "superseded";
  if (now >= app.expiresAt) return "expired";
  if (app.cancelAtPeriodEnd) return "cancelled";
  if (app.scheduledChange) return "scheduled_change";
  return "active_preview";
}

/** The plan whose features the learner has now, or null. */
export function activePlan(s: EntitlementState, now: number): AppPlanId | null {
  const st = appStatus(s.app, now);
  return st === "active_preview" || st === "cancelled" || st === "scheduled_change" ? s.app!.planId : null;
}

export function hasCourse(s: EntitlementState, now: number): boolean {
  return !!s.course && (s.course.expiresAt == null || now < s.course.expiresAt);
}

export const isFreeLesson = (id: string) => (FREE_LESSONS as readonly string[]).includes(id.toUpperCase());
export const canOpenLesson = (s: EntitlementState, id: string, now: number) => isFreeLesson(id) || hasCourse(s, now);

export const daysLeft = (expiresAt: number | null, now: number) => (expiresAt == null ? null : Math.max(0, Math.ceil((expiresAt - now) / DAY)));

// ── Building records ─────────────────────────────────────────────────────────
function planRecord(ctx: Ctx, planId: AppPlanId, period: BillingPeriod, launchUsed: boolean, bundleId: string | null, offer?: number): SubscriptionRecord {
  const q = planQuote(planId, period, { now: ctx.now, launchUsed });
  return {
    ...PREVIEW_MARKERS,
    subscriptionId: ctx.newId(),
    userId: ctx.userId,
    planId,
    productType: "app_subscription",
    purchasedProductId: bundleId ? "bundle" : planId,
    bundleId,
    billingPeriod: period,
    status: "active_preview",
    activatedAt: ctx.now,
    expiresAt: ctx.now + PERIOD_DAYS[period] * DAY,
    regularPriceINR: q.regular,
    displayedOfferPriceINR: offer ?? q.price,
    campaignId: q.launchApplied ? getPlan(planId).campaignId : null,
    createdAt: ctx.now,
    updatedAt: ctx.now,
  };
}

function courseRecord(ctx: Ctx, launchUsed: boolean, bundleId: string | null, offer?: number): SubscriptionRecord {
  const q = courseQuote({ now: ctx.now, launchUsed });
  return {
    ...PREVIEW_MARKERS,
    subscriptionId: ctx.newId(),
    userId: ctx.userId,
    planId: "course",
    productType: "course",
    purchasedProductId: bundleId ? "bundle" : "course",
    bundleId,
    billingPeriod: null,
    status: "active_preview",
    activatedAt: ctx.now,
    expiresAt: COURSE_ACCESS_DAYS == null ? null : ctx.now + COURSE_ACCESS_DAYS * DAY,
    regularPriceINR: q.regular,
    displayedOfferPriceINR: offer ?? q.price,
    campaignId: q.launchApplied ? "founders-launch" : null,
    createdAt: ctx.now,
    updatedAt: ctx.now,
  };
}

const toApp = (r: SubscriptionRecord, viaBundle: boolean): AppEntitlement => ({
  ...PREVIEW_MARKERS,
  subscriptionId: r.subscriptionId,
  planId: r.planId as AppPlanId,
  billingPeriod: r.billingPeriod!,
  status: "active_preview",
  activatedAt: r.activatedAt,
  expiresAt: r.expiresAt!,
  regularPriceINR: r.regularPriceINR,
  displayedOfferPriceINR: r.displayedOfferPriceINR,
  campaignId: r.campaignId,
  viaBundle,
  scheduledChange: null,
  cancelAtPeriodEnd: false,
});

const toCourse = (r: SubscriptionRecord, viaBundle: boolean): CourseEntitlement => ({
  ...PREVIEW_MARKERS,
  subscriptionId: r.subscriptionId,
  activatedAt: r.activatedAt,
  expiresAt: r.expiresAt,
  regularPriceINR: r.regularPriceINR,
  displayedOfferPriceINR: r.displayedOfferPriceINR,
  campaignId: r.campaignId,
  viaBundle,
});

const nothing = (s: EntitlementState, outcome: ActivationOutcome, message: string): Change => ({ outcome, message, state: s, records: [], updates: [], events: [] });

// Weekly → monthly counts as an upgrade; monthly → weekly as a downgrade.
function compare(a: { planId: AppPlanId; billingPeriod: BillingPeriod }, b: { planId: AppPlanId; billingPeriod: BillingPeriod }) {
  const ra = getPlan(a.planId).rank, rb = getPlan(b.planId).rank;
  if (rb !== ra) return rb > ra ? 1 : -1;
  if (a.billingPeriod === b.billingPeriod) return 0;
  return b.billingPeriod === "monthly" ? 1 : -1;
}

// ── Activation (Buy Now) ─────────────────────────────────────────────────────
export function activate(s: EntitlementState, req: ActivationRequest, ctx: Ctx): Change {
  if (req.productId === "course") return activateCourse(s, ctx);
  if (req.productId === "bundle") return activateBundle(s, ctx);
  const planId = req.productId;
  const period: BillingPeriod = req.billingPeriod ?? "monthly";
  const name = getPlan(planId).planName;
  const status = appStatus(s.app, ctx.now);
  const live = status === "active_preview" || status === "cancelled" || status === "scheduled_change";

  if (live) {
    const cur = s.app!;
    const dir = compare(cur, { planId, billingPeriod: period });
    if (dir === 0) {
      // Same plan and period. If it was cancelled or had a scheduled change, buying it again keeps it.
      if (cur.cancelAtPeriodEnd || cur.scheduledChange) {
        const app: AppEntitlement = { ...cur, cancelAtPeriodEnd: false, scheduledChange: null, status: "active_preview" };
        return {
          outcome: "change_cleared", message: `${name} (${period}) continues. The pending change was removed.`,
          state: { ...s, app, version: s.version + 1 }, records: [], updates: [], events: [{ type: "sub_change_cleared", product: planId, detail: period }],
        };
      }
      return nothing(s, "already_active", `${name} (${period}) is already active.`);
    }
    if (dir < 0) {
      const app: AppEntitlement = { ...cur, scheduledChange: { planId, billingPeriod: period }, cancelAtPeriodEnd: false, status: "scheduled_change" };
      return {
        outcome: "scheduled_downgrade",
        message: `${name} (${period}) is scheduled. Your current plan stays until ${new Date(cur.expiresAt).toLocaleDateString("en-IN")}.`,
        state: { ...s, app, version: s.version + 1 }, records: [], updates: [],
        events: [{ type: "sub_downgrade_scheduled", product: planId, detail: `${cur.planId} ${cur.billingPeriod} -> ${planId} ${period}` }],
      };
    }
    // Upgrade: starts now; the old period is superseded.
    const rec = planRecord(ctx, planId, period, s.launchUsed.app, null);
    return {
      outcome: "upgraded", message: `Upgraded to ${name} (${period}).`,
      state: { ...s, app: toApp(rec, false), launchUsed: { ...s.launchUsed, app: true }, version: s.version + 1 },
      records: [rec], updates: [{ subscriptionId: cur.subscriptionId, status: "superseded" }],
      events: [{ type: "sub_upgraded", product: planId, detail: `${cur.planId} ${cur.billingPeriod} -> ${planId} ${period}` }],
    };
  }

  const rec = planRecord(ctx, planId, period, s.launchUsed.app, null);
  const prev = s.app && status === "expired" ? [{ subscriptionId: s.app.subscriptionId, status: "expired" as const }] : [];
  return {
    outcome: "activated", message: `${name} (${period}) is active.`,
    state: { ...s, app: toApp(rec, false), launchUsed: { ...s.launchUsed, app: true }, version: s.version + 1 },
    records: [rec], updates: prev,
    events: [{ type: "sub_activated", product: planId, detail: `${period}, shown ${rec.displayedOfferPriceINR} INR${rec.campaignId ? " launch" : ""}` }],
  };
}

function activateCourse(s: EntitlementState, ctx: Ctx): Change {
  if (hasCourse(s, ctx.now)) return nothing(s, "already_owned", "You already have the complete Futures Edge course.");
  const rec = courseRecord(ctx, s.launchUsed.course, null);
  return {
    outcome: "course_activated", message: "The complete Futures Edge course is unlocked.",
    state: { ...s, course: toCourse(rec, false), launchUsed: { ...s.launchUsed, course: true }, version: s.version + 1 },
    records: [rec], updates: [], events: [{ type: "course_activated", product: "course", detail: `shown ${rec.displayedOfferPriceINR} INR` }],
  };
}

function activateBundle(s: EntitlementState, ctx: Ctx): Change {
  const { plan, period } = BUNDLE_PRODUCT.includes;
  const live = activePlan(s, ctx.now);
  if (live && getPlan(live).rank > getPlan(plan).rank) {
    return nothing(s, "blocked", `You already have ${getPlan(live).planName}. Get the course on its own instead, so your plan is not replaced.`);
  }
  if (live === plan && s.app!.billingPeriod === period) {
    return nothing(s, "blocked", hasCourse(s, ctx.now)
      ? "You already have everything in the Starter Pack."
      : `You already have ${getPlan(plan).planName} (monthly). Get the course on its own instead.`);
  }

  const bundleId = ctx.newId();
  const q = bundleQuote({ now: ctx.now });
  // Split the bundle price between its two parts in proportion to their regular prices (for records only; nothing is charged).
  const courseShare = Math.round((q.price * COURSE_PRODUCT.regular) / BUNDLE_PRODUCT.regular);
  const records: SubscriptionRecord[] = [];
  const updates: Change["updates"] = [];
  let course = s.course;
  if (!hasCourse(s, ctx.now)) {
    const c = courseRecord(ctx, s.launchUsed.course, bundleId, courseShare);
    c.regularPriceINR = COURSE_PRODUCT.regular;
    records.push(c);
    course = toCourse(c, true);
  }
  const p = planRecord(ctx, plan, period, s.launchUsed.app, bundleId, q.price - courseShare);
  p.regularPriceINR = getPlan(plan).prices[period].regular;
  records.push(p);
  if (s.app) updates.push({ subscriptionId: s.app.subscriptionId, status: live ? "superseded" : "expired" });
  return {
    outcome: "bundle_activated", message: "The Complete Starter Pack is active: the full course and one month of XORA Trader.",
    state: { ...s, course, app: toApp(p, true), launchUsed: { app: true, course: true }, version: s.version + 1 },
    records, updates, events: [{ type: "bundle_activated", product: "bundle", detail: `shown ${q.price} INR` }],
  };
}

// ── Account actions ──────────────────────────────────────────────────────────
export function cancel(s: EntitlementState, ctx: Ctx): Change {
  const st = appStatus(s.app, ctx.now);
  if (st === "none" || st === "expired" || st === "superseded") return nothing(s, "blocked", "There is no active plan to cancel.");
  if (s.app!.cancelAtPeriodEnd) return nothing(s, "cancelled", "Your plan is already cancelled.");
  const app: AppEntitlement = { ...s.app!, cancelAtPeriodEnd: true, scheduledChange: null, status: "cancelled" };
  return {
    outcome: "cancelled", message: `Cancelled. You keep access until ${new Date(app.expiresAt).toLocaleDateString("en-IN")}.`,
    state: { ...s, app, version: s.version + 1 }, records: [], updates: [{ subscriptionId: app.subscriptionId, status: "cancelled" }],
    events: [{ type: "sub_cancelled", product: app.planId, detail: app.billingPeriod }],
  };
}

/** Undo a cancellation or a scheduled change while the period is still running. */
export function keepCurrent(s: EntitlementState, ctx: Ctx): Change {
  const st = appStatus(s.app, ctx.now);
  if (st !== "cancelled" && st !== "scheduled_change") return nothing(s, "blocked", "There is nothing to undo.");
  const app: AppEntitlement = { ...s.app!, cancelAtPeriodEnd: false, scheduledChange: null, status: "active_preview" };
  return {
    outcome: "change_cleared", message: "Your current plan continues as before.",
    state: { ...s, app, version: s.version + 1 }, records: [], updates: [{ subscriptionId: app.subscriptionId, status: "active_preview" }],
    events: [{ type: "sub_change_cleared", product: app.planId, detail: app.billingPeriod }],
  };
}

/** Start the next preview period after the current one has ended (manual: nothing renews by itself). */
export function renew(s: EntitlementState, ctx: Ctx): Change {
  const st = appStatus(s.app, ctx.now);
  if (st === "none" || st === "superseded") return nothing(s, "blocked", "There is no plan to renew. Choose one on the pricing page.");
  if (st !== "expired") return nothing(s, "blocked", "Your plan is still active. You can renew it when the current period ends.");
  const cur = s.app!;
  const next = cur.scheduledChange ?? { planId: cur.planId, billingPeriod: cur.billingPeriod };
  const rec = planRecord(ctx, next.planId, next.billingPeriod, s.launchUsed.app, null);
  return {
    outcome: "renewed", message: `${getPlan(next.planId).planName} (${next.billingPeriod}) renewed for another preview period.`,
    state: { ...s, app: toApp(rec, false), launchUsed: { ...s.launchUsed, app: true }, version: s.version + 1 },
    records: [rec], updates: [{ subscriptionId: cur.subscriptionId, status: "expired" }],
    events: [{ type: "sub_renewed", product: next.planId, detail: `${next.billingPeriod}, shown ${rec.displayedOfferPriceINR} INR` }],
  };
}
