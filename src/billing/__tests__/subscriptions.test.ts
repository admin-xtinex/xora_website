import { describe, expect, it } from "vitest";
import { subscriptionAnalytics } from "../analytics";
import { activate, activePlan, appStatus, canOpenLesson, cancel, daysLeft, hasCourse, keepCurrent, renew, type Change } from "../subscriptions";
import { EMPTY_STATE, PREVIEW_MARKERS, type EntitlementState, type SubscriptionRecord } from "../types";

const DAY = 86400000;
const T0 = Date.parse("2026-10-21T10:00:00Z");
let n = 0;
const ctx = (now = T0) => ({ userId: "u1", now, newId: () => `id${++n}` });

/** Applies a sequence of changes like a store would, collecting every record. */
function runAll(steps: ((s: EntitlementState) => Change)[]) {
  let s = EMPTY_STATE;
  const records: SubscriptionRecord[] = [];
  const outcomes: string[] = [];
  for (const step of steps) {
    const c = step(s);
    s = c.state;
    outcomes.push(c.outcome);
    for (const r of c.records) records.push(r);
    for (const u of c.updates) { const r = records.find((x) => x.subscriptionId === u.subscriptionId); if (r) r.status = u.status; }
  }
  return { s, records, outcomes };
}

describe("activation", () => {
  it("activates a weekly plan for exactly 7 days at the launch price, marked as a preview", () => {
    const c = activate(EMPTY_STATE, { productId: "starter", billingPeriod: "weekly" }, ctx());
    expect(c.outcome).toBe("activated");
    expect(c.state.app).toMatchObject({ planId: "starter", billingPeriod: "weekly", activatedAt: T0, expiresAt: T0 + 7 * DAY, displayedOfferPriceINR: 299, regularPriceINR: 449 });
    expect(c.records[0]).toMatchObject({ ...PREVIEW_MARKERS, status: "active_preview", amountCollected: 0, isRealPurchase: false, campaignId: "founders-launch" });
    expect(appStatus(c.state.app, T0)).toBe("active_preview");
    expect(daysLeft(c.state.app!.expiresAt, T0)).toBe(7);
  });
  it("activates a monthly plan for 30 days", () => {
    const c = activate(EMPTY_STATE, { productId: "pro", billingPeriod: "monthly" }, ctx());
    expect(c.state.app!.expiresAt - c.state.app!.activatedAt).toBe(30 * DAY);
  });
  it("does nothing on a repeated click for the same plan (no duplicate)", () => {
    const { records, outcomes } = runAll([
      (s) => activate(s, { productId: "trader", billingPeriod: "monthly" }, ctx()),
      (s) => activate(s, { productId: "trader", billingPeriod: "monthly" }, ctx(T0 + 1000)),
    ]);
    expect(outcomes).toEqual(["activated", "already_active"]);
    expect(records).toHaveLength(1);
  });
});

describe("upgrade, downgrade, cancel, renew", () => {
  it("upgrades immediately and supersedes the old period", () => {
    const { s, records, outcomes } = runAll([
      (s) => activate(s, { productId: "starter", billingPeriod: "monthly" }, ctx()),
      (s) => activate(s, { productId: "pro", billingPeriod: "monthly" }, ctx(T0 + 5 * DAY)),
    ]);
    expect(outcomes).toEqual(["activated", "upgraded"]);
    expect(s.app).toMatchObject({ planId: "pro", activatedAt: T0 + 5 * DAY, expiresAt: T0 + 35 * DAY });
    expect(records.map((r) => r.status)).toEqual(["superseded", "active_preview"]);
    // Second period of an app plan: regular price.
    expect(records[1].displayedOfferPriceINR).toBe(4499);
  });
  it("treats weekly to monthly as an upgrade and monthly to weekly as a scheduled change", () => {
    const up = runAll([(s) => activate(s, { productId: "trader", billingPeriod: "weekly" }, ctx()), (s) => activate(s, { productId: "trader", billingPeriod: "monthly" }, ctx(T0 + DAY))]);
    expect(up.outcomes[1]).toBe("upgraded");
    const down = runAll([(s) => activate(s, { productId: "trader", billingPeriod: "monthly" }, ctx()), (s) => activate(s, { productId: "trader", billingPeriod: "weekly" }, ctx(T0 + DAY))]);
    expect(down.outcomes[1]).toBe("scheduled_downgrade");
  });
  it("schedules a downgrade for the end of the period and applies it on renewal", () => {
    const end = T0 + 30 * DAY;
    const { s, records, outcomes } = runAll([
      (s) => activate(s, { productId: "pro", billingPeriod: "monthly" }, ctx()),
      (s) => activate(s, { productId: "starter", billingPeriod: "weekly" }, ctx(T0 + DAY)),
      (s) => renew(s, ctx(T0 + 2 * DAY)),
      (s) => renew(s, ctx(end + 1)),
    ]);
    expect(outcomes).toEqual(["activated", "scheduled_downgrade", "blocked", "renewed"]);
    expect(s.app).toMatchObject({ planId: "starter", billingPeriod: "weekly", expiresAt: end + 1 + 7 * DAY, displayedOfferPriceINR: 449 });
    expect(records.map((r) => [r.planId, r.status])).toEqual([["pro", "expired"], ["starter", "active_preview"]]);
  });
  it("keeps access after cancelling until expiry, then there is no plan", () => {
    const { s, outcomes } = runAll([
      (s) => activate(s, { productId: "trader", billingPeriod: "weekly" }, ctx()),
      (s) => cancel(s, ctx(T0 + DAY)),
    ]);
    expect(outcomes).toEqual(["activated", "cancelled"]);
    expect(activePlan(s, T0 + 6 * DAY)).toBe("trader");
    expect(appStatus(s.app, T0 + 6 * DAY)).toBe("cancelled");
    expect(activePlan(s, T0 + 7 * DAY)).toBeNull();
    expect(appStatus(s.app, T0 + 7 * DAY)).toBe("expired");
  });
  it("can undo a cancellation or a scheduled change", () => {
    const { s, outcomes } = runAll([
      (s) => activate(s, { productId: "trader", billingPeriod: "monthly" }, ctx()),
      (s) => cancel(s, ctx(T0 + DAY)),
      (s) => keepCurrent(s, ctx(T0 + 2 * DAY)),
    ]);
    expect(outcomes[2]).toBe("change_cleared");
    expect(appStatus(s.app, T0 + 3 * DAY)).toBe("active_preview");
  });
  it("never renews automatically: an expired plan stays expired until the learner renews", () => {
    const c = activate(EMPTY_STATE, { productId: "starter", billingPeriod: "weekly" }, ctx());
    expect(appStatus(c.state.app, T0 + 100 * DAY)).toBe("expired");
    expect(activePlan(c.state, T0 + 100 * DAY)).toBeNull();
  });
});

describe("course and bundle", () => {
  it("unlocks the course once and keeps it through plan changes", () => {
    const { s, outcomes } = runAll([
      (s) => activate(s, { productId: "course" }, ctx()),
      (s) => activate(s, { productId: "course" }, ctx(T0 + 1)),
      (s) => activate(s, { productId: "pro", billingPeriod: "weekly" }, ctx(T0 + 2)),
      (s) => cancel(s, ctx(T0 + 3)),
    ]);
    expect(outcomes).toEqual(["course_activated", "already_owned", "activated", "cancelled"]);
    expect(hasCourse(s, T0 + 400 * DAY)).toBe(true);
    expect(s.course).toMatchObject({ expiresAt: null, displayedOfferPriceINR: 999, regularPriceINR: 1999, amountCollected: 0 });
  });
  it("opens only the free introduction without the course", () => {
    expect(["V00", "T01", "T02"].every((id) => canOpenLesson(EMPTY_STATE, id, T0))).toBe(true);
    expect(["T03", "T23", "CPA", "CP1"].some((id) => canOpenLesson(EMPTY_STATE, id, T0))).toBe(false);
    const owned = activate(EMPTY_STATE, { productId: "course" }, ctx()).state;
    expect(["T03", "T23", "CPB"].every((id) => canOpenLesson(owned, id, T0))).toBe(true);
  });
  it("grants the course and one month of Trader together", () => {
    const c = activate(EMPTY_STATE, { productId: "bundle" }, ctx());
    expect(c.outcome).toBe("bundle_activated");
    expect(hasCourse(c.state, T0)).toBe(true);
    expect(c.state.app).toMatchObject({ planId: "trader", billingPeriod: "monthly", viaBundle: true, expiresAt: T0 + 30 * DAY });
    expect(c.records).toHaveLength(2);
    expect(new Set(c.records.map((r) => r.bundleId)).size).toBe(1);
    expect(c.records.reduce((a, r) => a + r.displayedOfferPriceINR, 0)).toBe(2499);
    expect(c.records.every((r) => r.amountCollected === 0 && !r.isRealPurchase && r.purchasedProductId === "bundle")).toBe(true);
  });
  it("refuses a bundle that would replace Pro, without changing anything", () => {
    const pro = activate(EMPTY_STATE, { productId: "pro", billingPeriod: "monthly" }, ctx()).state;
    const c = activate(pro, { productId: "bundle" }, ctx(T0 + 1));
    expect(c.outcome).toBe("blocked");
    expect(c.state).toBe(pro);
    expect(c.records).toHaveLength(0);
  });
  it("upgrades a Starter learner with the bundle", () => {
    const { s, outcomes } = runAll([(s) => activate(s, { productId: "starter", billingPeriod: "weekly" }, ctx()), (s) => activate(s, { productId: "bundle" }, ctx(T0 + 1))]);
    expect(outcomes[1]).toBe("bundle_activated");
    expect(s.app!.planId).toBe("trader");
  });
});

describe("analytics", () => {
  it("counts preview activations by type and keeps actual revenue at zero", () => {
    const users = ["starter", "trader", "pro", "course", "bundle"].map((p, i) => {
      const c = activate(EMPTY_STATE, { productId: p as "pro", billingPeriod: "monthly" }, { userId: `u${i}`, now: T0, newId: () => `x${++n}` });
      return { uid: `u${i}`, state: c.state, records: c.records };
    });
    const subs = users.flatMap((u) => u.records).map((r) => ({ ...r, createdAt: r.createdAt }));
    const ents = users.map((u) => ({ uid: u.uid, app: u.state.app, course: u.state.course }));
    const a = subscriptionAnalytics(subs, ents, T0 + DAY);
    expect(a.previewActivations).toBe(5);
    expect(a.plans).toEqual({ starter: 1, trader: 2, pro: 1 });
    expect(a.bundleActivations).toBe(1);
    expect(a.courseActivations).toBe(1);
    expect(a.courseOwners).toBe(2);
    expect(a.actualRevenueINR).toBe(0);
    expect(a.potentialValueINR).toBe(999 + 1999 + 2999 + 999 + 2499);
    expect(a.nonPreviewRecords).toBe(0);
    expect(subscriptionAnalytics(subs, ents, T0 + 31 * DAY).expiredPlans).toBe(4);
  });
});
