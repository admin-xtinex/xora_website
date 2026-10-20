// @vitest-environment jsdom
// UI flows in the local preview store (Firebase is not configured in tests).
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AuthProvider, isAdminUser } from "@/auth/AuthProvider";
import { Toaster } from "@/components/ui/Toast";
import { EntitlementProvider, PREVIEW_TOAST, safePath, savePending, takePending, useEntitlements } from "../EntitlementProvider";
import { LOCAL_KEY } from "../localStore";
import { PricingPage } from "../PricingPage";
import { AccountPage } from "../AccountPage";
import { lessonFromPath } from "../CourseGate";

function Probe() {
  const { state, ready, mode } = useEntitlements();
  return <output data-testid="probe">{JSON.stringify({ ready, mode, plan: state.app?.planId ?? null, period: state.app?.billingPeriod ?? null, course: !!state.course })}</output>;
}
const probe = () => JSON.parse(screen.getByTestId("probe").textContent || "{}");

function mount(ui: React.ReactNode) {
  return render(
    <AuthProvider>
      <EntitlementProvider>
        {ui}
        <Probe />
        <Toaster />
      </EntitlementProvider>
    </AuthProvider>,
  );
}
const records = () => (JSON.parse(localStorage.getItem(LOCAL_KEY) || '{"records":[]}').records as { planId: string; amountCollected: number; isRealPurchase: boolean; activationSource: string }[]);

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  history.replaceState(null, "", "/pricing");
});
afterEach(cleanup);

describe("pricing page", () => {
  it("shows launch and regular prices and switches weekly / monthly without reloading", async () => {
    mount(<PricingPage />);
    await waitFor(() => expect(probe().ready).toBe(true));
    const trader = screen.getByRole("article", { name: "XORA Trader" });
    expect(within(trader).getByText("₹1,999")).toBeTruthy();
    expect(within(trader).getByText("₹2,999")).toBeTruthy();
    expect(within(trader).getByText("Recommended")).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Weekly" }));
    expect(within(trader).getByText("₹599")).toBeTruthy();
    expect(within(screen.getByRole("article", { name: "XORA Starter" })).getByText("₹299")).toBeTruthy();
    expect(within(screen.getByRole("article", { name: "XORA Pro" })).getByText("₹899")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Weekly" }).getAttribute("aria-checked")).toBe("true");
  });

  it("Buy Now activates the plan once, shows the preview message and opens My Subscription", async () => {
    mount(<PricingPage />);
    await waitFor(() => expect(probe().ready).toBe(true));
    const btn = within(screen.getByRole("article", { name: "XORA Trader" })).getByRole("button", { name: "Buy Now" });
    await act(async () => {
      fireEvent.click(btn);
      fireEvent.click(btn);
      fireEvent.click(btn);
    });
    await waitFor(() => expect(probe().plan).toBe("trader"));
    expect(probe().period).toBe("monthly");
    expect(records()).toHaveLength(1);
    expect(records()[0]).toMatchObject({ amountCollected: 0, isRealPurchase: false, activationSource: "paymentless_preview" });
    expect(await screen.findByText(PREVIEW_TOAST)).toBeTruthy();
    expect(location.pathname).toBe("/account/subscription");
  });

  it("the bundle grants the course and Trader, and both survive a page refresh", async () => {
    const first = mount(<PricingPage />);
    await waitFor(() => expect(probe().ready).toBe(true));
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Buy the Starter Pack" })));
    await waitFor(() => expect(probe()).toMatchObject({ plan: "trader", course: true }));
    first.unmount();
    // "Refresh": a fresh provider reads the saved state.
    mount(<AccountPage />);
    await waitFor(() => expect(probe()).toMatchObject({ ready: true, plan: "trader", course: true }));
    expect(await screen.findByText("XORA Trader")).toBeTruthy();
    expect(screen.getByText("Complete Starter Pack")).toBeTruthy();
  });
});

describe("my subscription", () => {
  it("shows the free state, then cancel and undo work", async () => {
    mount(<AccountPage />);
    await waitFor(() => expect(probe().ready).toBe(true));
    expect(screen.getByText(/You are on a free account/)).toBeTruthy();
    cleanup();
    localStorage.clear();
    mount(<PricingPage />);
    await waitFor(() => expect(probe().ready).toBe(true));
    await act(async () => fireEvent.click(within(screen.getByRole("article", { name: "XORA Starter" })).getByRole("button", { name: "Buy Now" })));
    await waitFor(() => expect(probe().plan).toBe("starter"));
    cleanup();
    mount(<AccountPage />);
    await waitFor(() => expect(probe().plan).toBe("starter"));
    await act(async () => fireEvent.click(await screen.findByRole("button", { name: "Cancel Preview" })));
    expect(await screen.findByText(/Cancelled: there will be no next period/)).toBeTruthy();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Keep current plan" })));
    await waitFor(() => expect(screen.queryByText(/Cancelled: there will be no next period/)).toBeNull());
  });
});

describe("sign-in return and safety", () => {
  it("remembers a Buy Now across sign-in and runs it only once", () => {
    savePending({ productId: "pro", billingPeriod: "weekly" }, "/account/subscription");
    expect(takePending()).toEqual({ productId: "pro", billingPeriod: "weekly", after: "/account/subscription" });
    expect(takePending()).toBeNull();
  });
  it("drops stale or invalid remembered requests", () => {
    savePending({ productId: "pro", billingPeriod: "weekly" });
    expect(takePending(Date.now() + 31 * 60 * 1000)).toBeNull();
    sessionStorage.setItem("xora.pendingActivation", JSON.stringify({ productId: "enterprise", at: Date.now() }));
    expect(takePending()).toBeNull();
  });
  it("only allows same-site return addresses", () => {
    expect(safePath("/learn/futures-edge/t05")).toBe("/learn/futures-edge/t05");
    for (const bad of ["//evil.example", "/\\evil.example", "https://evil.example", "javascript:alert(1)", 42]) {
      expect(safePath(bad)).toBe("/account/subscription");
    }
  });
  it("gives admin access only to listed, confirmed emails", () => {
    const admins = ["tisan@xtinex.com", "info@xtinex.com"];
    expect(isAdminUser({ email: "tisan@xtinex.com", emailVerified: true }, admins)).toBe(true);
    expect(isAdminUser({ email: "TISAN@xtinex.com", emailVerified: true }, admins)).toBe(true);
    expect(isAdminUser({ email: "tisan@xtinex.com", emailVerified: false }, admins)).toBe(false);
    expect(isAdminUser({ email: "someone@example.com", emailVerified: true }, admins)).toBe(false);
    expect(isAdminUser(null, admins)).toBe(false);
  });
  it("recognises lesson addresses for the course gate", () => {
    expect(lessonFromPath("/learn/futures-edge/t05")).toBe("T05");
    expect(lessonFromPath("/learn/futures-edge/checkpoint/cpa")).toBe("CPA");
    expect(lessonFromPath("/learn/futures-edge/glossary")).toBeNull();
    expect(lessonFromPath("/learn/futures-edge")).toBeNull();
  });
});
