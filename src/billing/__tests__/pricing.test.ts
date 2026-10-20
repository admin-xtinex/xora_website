import { describe, expect, it } from "vitest";
import { APP_PLANS, BUNDLE_PRODUCT, COURSE_PRODUCT, FOUNDERS_CAMPAIGN, PERIOD_DAYS } from "../catalog";
import { bundleQuote, campaignActive, campaignRemainingMs, courseQuote, inr, planQuote, quote } from "../pricing";

const approved = {
  starter: { weekly: [449, 299], monthly: [1499, 999] },
  trader: { weekly: [849, 599], monthly: [2999, 1999] },
  pro: { weekly: [1299, 899], monthly: [4499, 2999] },
} as const;

describe("catalogue", () => {
  it("has the approved regular and launch prices for every plan and period", () => {
    for (const [id, periods] of Object.entries(approved)) {
      const plan = APP_PLANS.find((p) => p.planId === id)!;
      for (const [period, [regular, launch]] of Object.entries(periods)) {
        expect(plan.prices[period as "weekly"]).toEqual({ regular, launch });
      }
    }
  });
  it("has the course and bundle prices", () => {
    expect([COURSE_PRODUCT.regular, COURSE_PRODUCT.launch]).toEqual([1999, 999]);
    expect([BUNDLE_PRODUCT.regular, BUNDLE_PRODUCT.launch]).toEqual([4998, 2499]);
    expect(BUNDLE_PRODUCT.regular).toBe(COURSE_PRODUCT.regular + APP_PLANS.find((p) => p.planId === "trader")!.prices.monthly.regular);
  });
  it("recommends Trader only, and uses 7 / 30 day periods", () => {
    expect(APP_PLANS.filter((p) => p.recommended).map((p) => p.planId)).toEqual(["trader"]);
    expect(PERIOD_DAYS).toEqual({ weekly: 7, monthly: 30 });
  });
  it("starts with no launch dates and the customer cap inactive (no payments yet)", () => {
    expect(FOUNDERS_CAMPAIGN.startsAt).toBeNull();
    expect(FOUNDERS_CAMPAIGN.endsAt).toBeNull();
    expect(FOUNDERS_CAMPAIGN.customerCapActive).toBe(false);
  });
});

describe("quotes and savings", () => {
  it("shows the launch price with savings while the offer runs", () => {
    expect(planQuote("trader", "monthly")).toEqual({ regular: 2999, price: 1999, launchApplied: true, savings: 1000, savingsPct: 33 });
    expect(planQuote("starter", "weekly")).toMatchObject({ price: 299, savings: 150, savingsPct: 33 });
    expect(planQuote("pro", "weekly")).toMatchObject({ price: 899, savings: 400, savingsPct: 31 });
    expect(courseQuote()).toMatchObject({ price: 999, savings: 1000, savingsPct: 50 });
    expect(bundleQuote()).toMatchObject({ price: 2499, savings: 2499, savingsPct: 50 });
  });
  it("switches every price between weekly and monthly", () => {
    expect(["starter", "trader", "pro"].map((p) => planQuote(p as "pro", "weekly").price)).toEqual([299, 599, 899]);
    expect(["starter", "trader", "pro"].map((p) => planQuote(p as "pro", "monthly").price)).toEqual([999, 1999, 2999]);
  });
  it("uses the regular price after the first period", () => {
    expect(planQuote("trader", "monthly", { launchUsed: true })).toMatchObject({ price: 2999, launchApplied: false, savings: 0 });
  });
  it("uses regular prices when the campaign is off, not started or over", () => {
    const off = { ...FOUNDERS_CAMPAIGN, enabled: false };
    const later = { ...FOUNDERS_CAMPAIGN, startsAt: "2099-01-01T00:00:00Z" };
    const over = { ...FOUNDERS_CAMPAIGN, startsAt: "2020-01-01T00:00:00Z", endsAt: "2020-01-31T00:00:00Z" };
    for (const c of [off, later, over]) {
      expect(campaignActive(c)).toBe(false);
      expect(quote({ regular: 2999, launch: 1999 }, { campaign: c })).toMatchObject({ price: 2999, launchApplied: false });
    }
  });
  it("counts down only when an end date is configured", () => {
    expect(campaignRemainingMs(FOUNDERS_CAMPAIGN)).toBeNull();
    const now = Date.parse("2026-11-01T00:00:00Z");
    const dated = { ...FOUNDERS_CAMPAIGN, startsAt: "2026-10-25T00:00:00Z", endsAt: "2026-11-24T00:00:00Z" };
    expect(campaignRemainingMs(dated, now)).toBe(23 * 86400000);
    expect(campaignActive(dated, Date.parse("2026-11-24T00:00:00Z"))).toBe(false);
  });
  it("formats rupees with Indian grouping", () => {
    expect(inr(4998)).toBe("₹4,998");
    expect(inr(100000)).toBe("₹1,00,000");
  });
});
