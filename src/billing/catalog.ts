// The single source of every price, plan, feature and campaign setting on the site.
// Components read prices only through src/billing/pricing.ts; never type a price anywhere else.
import type { AppPlanId, BillingPeriod, Campaign, PlanProduct, OneTimeProduct, FeatureRow } from "./types";

/** Paymentless Preview Mode: Buy Now grants a preview entitlement without any payment. Real billing replaces this later. */
export const BILLING_MODE: "paymentless_preview" | "payments" = "paymentless_preview";

/** Lock course lessons beyond the free introduction behind the course entitlement. */
export const COURSE_PAYWALL_ENABLED = true;

/** Days of access per billing period. Monthly is 30 days during preview (documented in docs/PRICING_ARCHITECTURE.md). */
export const PERIOD_DAYS: Record<BillingPeriod, number> = { weekly: 7, monthly: 30 };

/** Full-course access length in days; null = no automatic expiry (the preview policy). */
export const COURSE_ACCESS_DAYS: number | null = null;

export const FOUNDERS_CAMPAIGN: Campaign = {
  id: "founders-launch",
  name: "XORA FOUNDERS LAUNCH OFFER",
  headline: "Trade Smarter. Learn Better. Launch for Less.",
  label: "Founders launch price",
  description: "Launch prices for the first period of any plan, the complete course and the Starter Pack.",
  enabled: true,
  // No launch date has been fixed yet: leave both null until it is. A countdown appears only when endsAt is set.
  startsAt: null,
  endsAt: null,
  // Intended: 30 days or the first 100 paying customers. Only real, verified payments may count toward the cap,
  // so it stays inactive while the site runs in Paymentless Preview Mode.
  customerCap: 100,
  customerCapActive: false,
  firstPeriodOnly: true,
};

/** Shown in the app plans; plan tiers are not tied to the app's strategy modes. */
export const APP_PLANS: PlanProduct[] = [
  {
    planId: "starter",
    planName: "XORA Starter",
    productType: "app_subscription",
    tagline: "For beginners and lighter use.",
    rank: 1,
    prices: { weekly: { regular: 449, launch: 299 }, monthly: { regular: 1499, launch: 999 } },
    concurrentTrades: 2,
    displayOrder: 1,
    enabled: true,
    campaignId: "founders-launch",
  },
  {
    planId: "trader",
    planName: "XORA Trader",
    productType: "app_subscription",
    tagline: "For active individual traders.",
    rank: 2,
    prices: { weekly: { regular: 849, launch: 599 }, monthly: { regular: 2999, launch: 1999 } },
    concurrentTrades: 5,
    displayOrder: 2,
    enabled: true,
    campaignId: "founders-launch",
    recommended: true,
  },
  {
    planId: "pro",
    planName: "XORA Pro",
    productType: "app_subscription",
    tagline: "For higher-capacity users.",
    rank: 3,
    prices: { weekly: { regular: 1299, launch: 899 }, monthly: { regular: 4499, launch: 2999 } },
    concurrentTrades: 10,
    displayOrder: 3,
    enabled: true,
    campaignId: "founders-launch",
  },
];

export const COURSE_PRODUCT: OneTimeProduct = {
  productId: "course",
  name: "Complete XORA Futures Edge",
  productType: "course",
  regular: 1999,
  launch: 999,
  enabled: true,
  campaignId: "founders-launch",
};

export const BUNDLE_PRODUCT: OneTimeProduct & { includes: { course: true; plan: AppPlanId; period: BillingPeriod } } = {
  productId: "bundle",
  name: "XORA Complete Starter Pack",
  productType: "bundle",
  // Course regular ₹1,999 + Trader monthly regular ₹2,999.
  regular: 4998,
  launch: 2499,
  enabled: true,
  campaignId: "founders-launch",
  includes: { course: true, plan: "trader", period: "monthly" },
};

/** Lessons open to every signed-in learner (the Free Introduction); everything else needs the course entitlement. */
export const FREE_LESSONS = ["V00", "T01", "T02"] as const;

/**
 * Feature rows for the plan cards and the comparison table. `status` keeps the page honest:
 * "available" works today; "app_rollout" depends on the XORA app, which enables it when it is ready;
 * "proposed" is a planned allowance the trading engine does not enforce yet.
 */
export const PLAN_FEATURES: FeatureRow[] = [
  { id: "autotrade", label: "Binance API auto-trading eligibility", values: { starter: true, trader: true, pro: true }, status: "app_rollout",
    note: "Every paid plan. Turns on only when the XORA app supports and authorises it; activating a plan never starts a trade." },
  { id: "safety", label: "Stop-loss, emergency stop and account security", values: { starter: true, trader: true, pro: true }, status: "app_rollout",
    note: "Essential protections are in every plan, never removed from a lower tier." },
  { id: "concurrent", label: "Concurrent trades", values: { starter: "Up to 2", trader: "Up to 5", pro: "Up to 10" }, status: "proposed",
    note: "Proposed limits; the trading engine does not enforce them yet." },
  { id: "analysis", label: "AI market analysis allowance", values: { starter: "Standard", trader: "Higher", pro: "Highest" }, status: "app_rollout" },
  { id: "monitoring", label: "Market monitoring capacity", values: { starter: "Standard", trader: "Extended", pro: "Maximum" }, status: "app_rollout" },
  { id: "demo", label: "Guided demo trading and learning features", values: { starter: true, trader: true, pro: true }, status: "available" },
  { id: "support", label: "Support", values: { starter: "Email", trader: "Priority email", pro: "Priority email + onboarding call" }, status: "available" },
];

/** What the course products contain (drawn from the real course: see courseData.ts). */
export const COURSE_FEATURES = {
  free: ["Welcome video and the first lessons (V00, T01, T02)", "Glossary of trading terms", "Progress saved to your account"],
  full: [
    "All animated video lessons and checkpoints, including Phase 6 · XORA Intelligence",
    "Voiceover on the welcome video, lessons T01–T23 and CP1; English and Malayalam subtitles throughout",
    "Slides, notes, hands-on practice and quizzes for every lesson",
    "Checkpoints A and B with explained answers",
    "Lifetime access during preview (no automatic expiry)",
  ],
};

export const PLAN_ORDER: AppPlanId[] = ["starter", "trader", "pro"];
