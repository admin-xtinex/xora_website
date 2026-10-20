import { useEffect, useState } from "react";
import { BookOpen, CreditCard, GraduationCap, RefreshCw } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { linkClick, navigate } from "@/lib/router";
import { showToast } from "@/components/ui/Toast";
import { COURSE_PRODUCT, PLAN_FEATURES } from "./catalog";
import { useEntitlements } from "./EntitlementProvider";
import { getPlan, inr, periodLabel, planQuote } from "./pricing";
import { appStatus, cancel, daysLeft, hasCourse, keepCurrent, renew, type Change } from "./subscriptions";
import type { EntitlementState, SubscriptionRecord } from "./types";
import "./pricing.css";

const fmt = (n: number | null) => (n == null ? "No expiry" : new Date(n).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }));

const STATUS_TEXT = {
  active_preview: ["Active · Preview", "ok"],
  scheduled_change: ["Active · change scheduled", "ok"],
  cancelled: ["Cancelled · access until expiry", "warn"],
  expired: ["Expired", "off"],
  superseded: ["Replaced", "off"],
  none: ["No plan", "off"],
} as const;

export function AccountPage() {
  const { enabled, ready: authReady, user } = useAuth();
  const { ready, state, error, busy, run, mode, store, reload } = useEntitlements();
  const [history, setHistory] = useState<SubscriptionRecord[] | null>(null);
  const now = Date.now();

  useEffect(() => { document.title = "My Subscription | XORA"; }, []);
  // Signed-out visitors sign in first and come back here.
  useEffect(() => {
    if (enabled && authReady && !user) navigate("/signin?next=" + encodeURIComponent("/account/subscription"), true);
  }, [enabled, authReady, user]);
  useEffect(() => {
    if (!store) return;
    store.history().then(setHistory).catch(() => setHistory([]));
  }, [store, state.version]);

  const act = async (fn: (s: EntitlementState, ctx: Parameters<Parameters<typeof run>[0]>[1]) => Change) => {
    const c = await run(fn);
    if (c) showToast(c.message, c.outcome === "blocked" ? "info" : "ok");
  };

  if (!ready || (enabled && !user)) {
    return <main className="acc container"><p role="status" className="acc-who">Loading your subscription…</p></main>;
  }

  const app = state.app;
  const st = appStatus(app, now);
  const [statusText, tone] = STATUS_TEXT[st];
  const plan = app ? getPlan(app.planId) : null;
  const next = app?.scheduledChange ?? (app ? { planId: app.planId, billingPeriod: app.billingPeriod } : null);
  const renewQuote = next ? planQuote(next.planId, next.billingPeriod, { launchUsed: state.launchUsed.app }) : null;
  const left = app ? daysLeft(app.expiresAt, now) : null;
  const course = hasCourse(state, now);

  return (
    <main className="acc container" id="main">
      <div className="acc-inner">
        <div>
          <h1>My Subscription</h1>
          <p className="acc-who">
            {user ? <>{user.name} · {user.email}</> : "Local preview (this browser only; sign-in is not configured here)"}
          </p>
        </div>
        <p className="pr-preview" role="note">
          <span>
            <b>Preview Mode.</b> Plans here were activated without payment and are recorded as previews, not purchases. Nothing renews
            automatically and nothing is ever charged.
            {mode === "local" ? " This local preview is not linked to an account and is not a verified entitlement." : ""}
          </span>
        </p>
        {error ? (
          <p className="acc-msg" role="alert">
            {error} <button type="button" className="pr-buy pr-buy-ghost" style={{ width: "auto", minHeight: 36, marginLeft: 8 }} onClick={reload}><RefreshCw size={14} aria-hidden /> Retry</button>
          </p>
        ) : null}

        <section className="acc-card" aria-labelledby="acc-plan">
          <h2 id="acc-plan">
            <CreditCard size={20} aria-hidden /> {plan ? plan.planName : "XORA app plan"}
            <span className={`acc-pill ${tone}`}>{statusText}</span>
            {app ? <span className="acc-pill preview">Preview Mode</span> : null}
          </h2>
          {!app || st === "superseded" ? (
            <>
              <p className="acc-who">You are on a free account. Choose Starter, Trader or Pro to activate a plan in Preview Mode.</p>
              <div className="acc-actions">
                <a className="pr-buy" href="/pricing" onClick={linkClick("/pricing")}>View pricing</a>
              </div>
            </>
          ) : (
            <>
              <dl className="acc-grid">
                <div><dt>Billing period</dt><dd>{app.billingPeriod === "weekly" ? "Weekly (7 days)" : "Monthly (30 days)"}</dd></div>
                <div><dt>Activated</dt><dd>{fmt(app.activatedAt)}</dd></div>
                <div><dt>{st === "expired" ? "Expired" : "Expires"}</dt><dd>{fmt(app.expiresAt)}</dd></div>
                <div><dt>Days remaining</dt><dd>{st === "expired" ? 0 : left}</dd></div>
                <div><dt>Regular price</dt><dd>{inr(app.regularPriceINR)} / {periodLabel(app.billingPeriod)}</dd></div>
                <div><dt>Offer price shown</dt><dd>{inr(app.displayedOfferPriceINR)}{app.viaBundle ? " (in Starter Pack)" : ""}</dd></div>
                <div><dt>Amount paid</dt><dd>{inr(0)} · Preview</dd></div>
                <div><dt>Concurrent trades (proposed)</dt><dd>Up to {plan!.concurrentTrades}</dd></div>
              </dl>
              {app.scheduledChange ? (
                <p className="acc-msg">
                  {getPlan(app.scheduledChange.planId).planName} ({app.scheduledChange.billingPeriod}) is scheduled for when this period ends on {fmt(app.expiresAt)}.
                </p>
              ) : null}
              {app.cancelAtPeriodEnd && st !== "expired" ? <p className="acc-msg">Cancelled: there will be no next period. You keep {plan!.planName} until {fmt(app.expiresAt)}.</p> : null}
              {st === "expired" && renewQuote && next ? (
                <p className="acc-msg">
                  This preview period has ended. Renewing starts a new {next.billingPeriod} period of {getPlan(next.planId).planName}
                  {" "}(shown at {inr(renewQuote.price)}{renewQuote.launchApplied ? " launch price" : ", the regular price after your first period"}; nothing is charged).
                </p>
              ) : null}
              <ul className="pr-feats">
                {PLAN_FEATURES.map((f) => {
                  const v = f.values[app.planId];
                  return v ? <li key={f.id}><BookOpen size={16} aria-hidden /><span>{v === true ? f.label : `${f.label}: ${v}`}</span></li> : null;
                })}
              </ul>
              <div className="acc-actions">
                {st === "expired" ? (
                  <button type="button" className="pr-buy" disabled={busy} onClick={() => act(renew)}>Renew Preview</button>
                ) : (
                  <>
                    {app.planId !== "pro" ? <a className="pr-buy" href="/pricing" onClick={linkClick("/pricing")}>Upgrade Plan</a> : null}
                    <a className="pr-buy pr-buy-ghost" href="/pricing" onClick={linkClick("/pricing")}>Change Plan</a>
                    {app.cancelAtPeriodEnd || app.scheduledChange ? (
                      <button type="button" className="pr-buy pr-buy-ghost" disabled={busy} onClick={() => act(keepCurrent)}>Keep current plan</button>
                    ) : (
                      <button type="button" className="pr-buy pr-buy-ghost" disabled={busy} onClick={() => act(cancel)}>Cancel Preview</button>
                    )}
                  </>
                )}
                <a className="pr-buy pr-buy-ghost" href="/pricing" onClick={linkClick("/pricing")}>View Pricing</a>
              </div>
              <p className="pr-note">The XORA app link appears here once the app's sign-up address is confirmed. Activating a plan never starts a trade.</p>
            </>
          )}
        </section>

        <section className="acc-card" aria-labelledby="acc-course">
          <h2 id="acc-course">
            <GraduationCap size={20} aria-hidden /> {COURSE_PRODUCT.name}
            <span className={`acc-pill ${course ? "ok" : "off"}`}>{course ? "Unlocked" : "Free introduction only"}</span>
            {course ? <span className="acc-pill preview">Preview Mode</span> : null}
          </h2>
          {course && state.course ? (
            <dl className="acc-grid">
              <div><dt>Activated</dt><dd>{fmt(state.course.activatedAt)}</dd></div>
              <div><dt>Access</dt><dd>{state.course.expiresAt == null ? "No automatic expiry" : `Until ${fmt(state.course.expiresAt)}`}</dd></div>
              <div><dt>From</dt><dd>{state.course.viaBundle ? "Complete Starter Pack" : "Course"}</dd></div>
              <div><dt>Amount paid</dt><dd>{inr(0)} · Preview</dd></div>
            </dl>
          ) : (
            <p className="acc-who">You can watch the welcome video and the first two lessons. Unlock all 27 lessons and checkpoints from the pricing page.</p>
          )}
          <div className="acc-actions">
            <a className="pr-buy" href="/learn/futures-edge" onClick={linkClick("/learn/futures-edge")}>Go to Course</a>
            {!course ? <a className="pr-buy pr-buy-ghost" href="/pricing#pr-course" onClick={linkClick("/pricing")}>Unlock the full course</a> : null}
          </div>
          <p className="pr-note">Your course progress stays with you whatever plan you choose.</p>
        </section>

        <section className="acc-card" aria-labelledby="acc-hist">
          <h2 id="acc-hist">Activation history</h2>
          {history == null ? <p className="acc-who">Loading…</p> : history.length === 0 ? <p className="acc-who">No activations yet.</p> : (
            <ul className="acc-hist">
              {history.slice(0, 20).map((r) => (
                <li key={r.subscriptionId}>
                  {fmt(r.createdAt || r.activatedAt)} · {r.planId === "course" ? "Course" : `${getPlan(r.planId).planName} (${r.billingPeriod})`}
                  {r.bundleId ? " · Starter Pack" : ""} · {r.status.replace("_", " ")} · shown {inr(r.displayedOfferPriceINR)} · paid {inr(0)}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
