// Types for pricing, campaigns, subscriptions and entitlements.

export type BillingPeriod = "weekly" | "monthly";
export type AppPlanId = "starter" | "trader" | "pro";
export type ProductId = AppPlanId | "course" | "bundle";
export type ProductType = "app_subscription" | "course" | "bundle";

export type PricePair = { regular: number; launch: number };

export type PlanProduct = {
  planId: AppPlanId;
  planName: string;
  productType: "app_subscription";
  tagline: string;
  /** Higher rank = higher tier (used for upgrade vs downgrade). */
  rank: number;
  prices: Record<BillingPeriod, PricePair>;
  /** Proposed, not enforced by the trading engine yet. */
  concurrentTrades: number;
  displayOrder: number;
  enabled: boolean;
  campaignId: string;
  recommended?: boolean;
};

export type OneTimeProduct = {
  productId: "course" | "bundle";
  name: string;
  productType: "course" | "bundle";
  regular: number;
  launch: number;
  enabled: boolean;
  campaignId: string;
};

export type Campaign = {
  id: string;
  name: string;
  headline: string;
  label: string;
  description: string;
  enabled: boolean;
  /** ISO dates; null = not set. */
  startsAt: string | null;
  endsAt: string | null;
  customerCap: number | null;
  /** Only real, verified payments may count; stays false in Paymentless Preview Mode. */
  customerCapActive: boolean;
  firstPeriodOnly: boolean;
};

export type FeatureValue = boolean | string;
export type FeatureRow = {
  id: string;
  label: string;
  values: Record<AppPlanId, FeatureValue>;
  status: "available" | "app_rollout" | "proposed";
  note?: string;
};

export type Quote = {
  regular: number;
  /** What the buyer would pay for this period (launch price when it applies, otherwise regular). */
  price: number;
  launchApplied: boolean;
  savings: number;
  savingsPct: number;
};

// ── Subscriptions and entitlements ───────────────────────────────────────────

export type SubscriptionStatus = "active_preview" | "expired" | "cancelled" | "scheduled_change" | "superseded";

/** Fixed markers on every preview grant, so it can never be mistaken for a paid record. */
export type PreviewMarkers = {
  activationSource: "paymentless_preview";
  paymentStatus: "not_applicable";
  amountCollected: 0;
  isRealPurchase: false;
};

export const PREVIEW_MARKERS: PreviewMarkers = {
  activationSource: "paymentless_preview",
  paymentStatus: "not_applicable",
  amountCollected: 0,
  isRealPurchase: false,
};

/** One activation record (subscriptions collection), kept as history. Dates are epoch milliseconds. */
export type SubscriptionRecord = PreviewMarkers & {
  subscriptionId: string;
  userId: string;
  planId: AppPlanId | "course";
  productType: ProductType;
  /** The product the buyer chose (bundle grants a course record and a plan record with the same bundleId). */
  purchasedProductId: ProductId;
  bundleId: string | null;
  billingPeriod: BillingPeriod | null;
  status: SubscriptionStatus;
  activatedAt: number;
  expiresAt: number | null;
  regularPriceINR: number;
  displayedOfferPriceINR: number;
  campaignId: string | null;
  createdAt: number;
  updatedAt: number;
};

/** The learner's current app plan. */
export type AppEntitlement = PreviewMarkers & {
  subscriptionId: string;
  planId: AppPlanId;
  billingPeriod: BillingPeriod;
  status: SubscriptionStatus;
  activatedAt: number;
  expiresAt: number;
  regularPriceINR: number;
  displayedOfferPriceINR: number;
  campaignId: string | null;
  viaBundle: boolean;
  /** Downgrade (or period change) that takes effect when this period ends. */
  scheduledChange: { planId: AppPlanId; billingPeriod: BillingPeriod } | null;
  /** Cancelled: no next preview period; access continues until expiresAt. */
  cancelAtPeriodEnd: boolean;
};

export type CourseEntitlement = PreviewMarkers & {
  subscriptionId: string;
  activatedAt: number;
  expiresAt: number | null;
  regularPriceINR: number;
  displayedOfferPriceINR: number;
  campaignId: string | null;
  viaBundle: boolean;
};

/** Everything a learner is entitled to (entitlements/{uid}); one document so a bundle updates atomically. */
export type EntitlementState = {
  app: AppEntitlement | null;
  course: CourseEntitlement | null;
  /** First-period launch discounts already used. */
  launchUsed: { app: boolean; course: boolean };
  /** Increments on every change; used to reject stale writes. */
  version: number;
};

export const EMPTY_STATE: EntitlementState = { app: null, course: null, launchUsed: { app: false, course: false }, version: 0 };

export type ActivationRequest = { productId: ProductId; billingPeriod?: BillingPeriod };

export type ActivationOutcome =
  | "activated"
  | "upgraded"
  | "renewed"
  | "scheduled_downgrade"
  | "already_active"
  | "course_activated"
  | "already_owned"
  | "bundle_activated"
  | "cancelled"
  | "change_cleared"
  | "blocked";

export type SubscriptionEvent = { type: string; product: string; detail: string };
