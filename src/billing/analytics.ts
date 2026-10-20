// Subscription analytics for the admin portal. Preview activations are never revenue: actual revenue only
// counts records that are real purchases with a verified payment, which do not exist in Paymentless Preview Mode.
export type SubLike = {
  subscriptionId: string; userId: string; planId: string; bundleId: string | null; billingPeriod: string | null;
  status: string; activationSource: string; paymentStatus: string; amountCollected: number; isRealPurchase: boolean;
  displayedOfferPriceINR: number; campaignId: string | null; createdAt: number | null;
};
export type EntLike = { uid: string; app: { planId: string; billingPeriod: string; expiresAt: number | null } | null; course: unknown | null };

export function subscriptionAnalytics(subs: SubLike[], ents: EntLike[], now = Date.now()) {
  const bundles = new Set(subs.filter((s) => s.bundleId).map((s) => s.bundleId!));
  // One "activation" per Buy Now: a bundle's course and plan records count once together.
  const actions = subs.filter((s) => !s.bundleId).length + bundles.size;
  const live = ents.filter((e) => e.app && e.app.expiresAt != null && e.app.expiresAt > now);
  const expired = ents.filter((e) => e.app && e.app.expiresAt != null && e.app.expiresAt <= now);
  const plans = { starter: 0, trader: 0, pro: 0 } as Record<string, number>;
  for (const e of live) plans[e.app!.planId] = (plans[e.app!.planId] ?? 0) + 1;
  const appRecords = subs.filter((s) => s.planId !== "course");
  const periods = { weekly: appRecords.filter((s) => s.billingPeriod === "weekly").length, monthly: appRecords.filter((s) => s.billingPeriod === "monthly").length };
  const founders = new Set(subs.filter((s) => s.campaignId).map((s) => s.bundleId ?? s.subscriptionId)).size;
  const real = subs.filter((s) => s.isRealPurchase === true && s.paymentStatus === "paid");
  return {
    previewActivations: actions,
    activePlans: live.length,
    expiredPlans: expired.length,
    plans,
    periods,
    courseActivations: subs.filter((s) => s.planId === "course" && !s.bundleId).length,
    courseOwners: ents.filter((e) => e.course).length,
    bundleActivations: bundles.size,
    foundersAdoption: founders,
    actualRevenueINR: real.reduce((a, s) => a + (s.amountCollected || 0), 0),
    /** What the preview activations would have cost at the prices shown. Not revenue. */
    potentialValueINR: subs.reduce((a, s) => a + (s.displayedOfferPriceINR || 0), 0),
    nonPreviewRecords: subs.filter((s) => s.activationSource !== "paymentless_preview").length,
  };
}
