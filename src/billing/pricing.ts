// PricingService and CampaignService: every displayed or recorded price comes from here.
import { APP_PLANS, BUNDLE_PRODUCT, COURSE_PRODUCT, FOUNDERS_CAMPAIGN } from "./catalog";
import type { AppPlanId, BillingPeriod, Campaign, PlanProduct, PricePair, ProductId, Quote } from "./types";

// ── CampaignService ──────────────────────────────────────────────────────────
export function campaignActive(c: Campaign = FOUNDERS_CAMPAIGN, now = Date.now()): boolean {
  if (!c.enabled) return false;
  if (c.startsAt && now < Date.parse(c.startsAt)) return false;
  if (c.endsAt && now >= Date.parse(c.endsAt)) return false;
  // The customer cap counts verified paid customers only; it is inactive in Paymentless Preview Mode.
  return true;
}

/** Milliseconds left in the campaign, or null when it has no configured end date (then no countdown is shown). */
export function campaignRemainingMs(c: Campaign = FOUNDERS_CAMPAIGN, now = Date.now()): number | null {
  if (!campaignActive(c, now) || !c.endsAt) return null;
  return Math.max(0, Date.parse(c.endsAt) - now);
}

// ── PricingService ───────────────────────────────────────────────────────────
export const getPlan = (id: AppPlanId): PlanProduct => {
  const p = APP_PLANS.find((x) => x.planId === id);
  if (!p) throw new Error(`Unknown plan ${id}`);
  return p;
};

export function quote(pair: PricePair, opts: { campaign?: Campaign; now?: number; launchUsed?: boolean } = {}): Quote {
  const c = opts.campaign ?? FOUNDERS_CAMPAIGN;
  // First-period discount: once a launch price has been used for this kind of product, later periods are regular.
  const launchApplied = campaignActive(c, opts.now) && !(c.firstPeriodOnly && opts.launchUsed) && pair.launch < pair.regular;
  const price = launchApplied ? pair.launch : pair.regular;
  const savings = pair.regular - price;
  return { regular: pair.regular, price, launchApplied, savings, savingsPct: pair.regular ? Math.round((savings / pair.regular) * 100) : 0 };
}

export const planQuote = (id: AppPlanId, period: BillingPeriod, opts?: Parameters<typeof quote>[1]) => quote(getPlan(id).prices[period], opts);
export const courseQuote = (opts?: Parameters<typeof quote>[1]) => quote(COURSE_PRODUCT, opts);
export const bundleQuote = (opts?: Parameters<typeof quote>[1]) => quote(BUNDLE_PRODUCT, opts);

export function productName(id: ProductId): string {
  if (id === "course") return COURSE_PRODUCT.name;
  if (id === "bundle") return BUNDLE_PRODUCT.name;
  return getPlan(id).planName;
}

/** ₹1,999 (Indian digit grouping). */
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const periodLabel = (p: BillingPeriod) => (p === "weekly" ? "week" : "month");
