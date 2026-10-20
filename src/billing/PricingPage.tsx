import { useEffect, useState } from "react";
import { Check, Clock, GraduationCap, Info, Minus, Package, ShieldAlert, Sparkles } from "lucide-react";
import { linkClick } from "@/lib/router";
import { APP_PLANS, BUNDLE_PRODUCT, COURSE_FEATURES, COURSE_PRODUCT, FOUNDERS_CAMPAIGN, PLAN_FEATURES, PLAN_ORDER } from "./catalog";
import { useEntitlements } from "./EntitlementProvider";
import { activePlan, hasCourse } from "./subscriptions";
import { bundleQuote, campaignActive, campaignRemainingMs, courseQuote, getPlan, inr, periodLabel, planQuote } from "./pricing";
import type { ActivationRequest, BillingPeriod, FeatureRow, Quote } from "./types";
import "./pricing.css";

const STATUS_NOTE: Record<FeatureRow["status"], string> = {
  available: "",
  app_rollout: "Rolling out in the XORA app",
  proposed: "Proposed limit, not enforced yet",
};

function Price({ q, period }: { q: Quote; period?: BillingPeriod }) {
  return (
    <div className="pr-price">
      {q.launchApplied ? <s aria-label={`Regular price ${inr(q.regular)}`}>{inr(q.regular)}</s> : null}
      <b>{inr(q.price)}</b>
      {period ? <span>/ {periodLabel(period)}</span> : <span>one-time</span>}
      {q.launchApplied && q.savings > 0 ? <em>Save {inr(q.savings)} ({q.savingsPct}%)</em> : null}
    </div>
  );
}

function Countdown({ ms }: { ms: number }) {
  const d = Math.floor(ms / 86400000), h = Math.floor((ms % 86400000) / 3600000);
  return <span className="pr-countdown"><Clock size={14} aria-hidden /> Ends in {d} d {h} h</span>;
}

export function PricingPage() {
  const { buy, busy, state, mode } = useEntitlements();
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [pending, setPending] = useState<string | null>(null);
  const now = Date.now();
  const offer = campaignActive(FOUNDERS_CAMPAIGN, now);
  const remaining = campaignRemainingMs(FOUNDERS_CAMPAIGN, now);
  const current = activePlan(state, now);
  const ownsCourse = hasCourse(state, now);

  useEffect(() => {
    document.title = "Pricing | XORA by XTINEX";
  }, []);

  const go = async (key: string, req: ActivationRequest) => {
    if (busy || pending) return;
    setPending(key);
    try {
      await buy(req);
    } finally {
      setPending(null);
    }
  };
  const cta = (key: string, req: ActivationRequest, label = "Buy Now") => (
    <button type="button" className="pr-buy" disabled={!!pending || busy} aria-busy={pending === key} onClick={() => go(key, req)}>
      {pending === key ? "Activating…" : label}
    </button>
  );
  const launchUsed = state.launchUsed;
  const courseQ = courseQuote({ launchUsed: launchUsed.course });
  const bundleQ = bundleQuote();

  return (
    <div className="pr">
      {/* A. Hero */}
      <section className="pr-hero container">
        <p className="pr-kicker">XORA Pricing</p>
        <h1>Power Your Trading with XORA</h1>
        <p className="pr-sub">AI Trading Intelligence. Automated Execution. One Platform.</p>
        {offer ? (
          <div className="pr-offer" role="note">
            <Sparkles size={18} aria-hidden />
            <div>
              <b>{FOUNDERS_CAMPAIGN.name}</b>
              <span>{FOUNDERS_CAMPAIGN.headline} Launch prices apply to your first period.</span>
            </div>
            {remaining != null ? <Countdown ms={remaining} /> : null}
          </div>
        ) : null}
        <p className="pr-preview" role="note">
          <Info size={16} aria-hidden />
          <span>
            <b>Preview Mode:</b> Buy Now activates your plan instantly. No payment is taken and no card or UPI details are asked for.
            {mode === "local" ? " (Local preview on this browser only: sign-in is not configured here.)" : ""}
          </span>
        </p>
      </section>

      {/* B. Billing toggle + C. Plans */}
      <section className="container pr-plans-wrap" aria-labelledby="pr-plans">
        <div className="pr-plans-head">
          <h2 id="pr-plans">XORA app plans</h2>
          <div className="pr-toggle" role="radiogroup" aria-label="Billing period">
            {(["weekly", "monthly"] as BillingPeriod[]).map((p) => (
              <button key={p} type="button" role="radio" aria-checked={period === p} className={period === p ? "is-on" : ""} onClick={() => setPeriod(p)}>
                {p === "weekly" ? "Weekly" : "Monthly"}
              </button>
            ))}
          </div>
        </div>
        <div className="pr-plans">
          {[...APP_PLANS].filter((p) => p.enabled).sort((a, b) => a.displayOrder - b.displayOrder).map((plan) => {
            const q = planQuote(plan.planId, period, { launchUsed: launchUsed.app });
            const mine = current === plan.planId && state.app?.billingPeriod === period;
            return (
              <article key={plan.planId} className={`pr-card${plan.recommended ? " is-rec" : ""}`} aria-labelledby={`plan-${plan.planId}`}>
                {plan.recommended ? <span className="pr-badge">Recommended</span> : null}
                <h3 id={`plan-${plan.planId}`}>{plan.planName}</h3>
                <p className="pr-tag">{plan.tagline}</p>
                <Price q={q} period={period} />
                {q.launchApplied ? <p className="pr-note">{FOUNDERS_CAMPAIGN.label} for your first {periodLabel(period)}; then {inr(q.regular)} / {periodLabel(period)}.</p> : null}
                <ul className="pr-feats">
                  {PLAN_FEATURES.map((f) => {
                    const v = f.values[plan.planId];
                    if (v === false) return null;
                    return (
                      <li key={f.id}>
                        <Check size={16} aria-hidden />
                        <span>
                          {v === true ? f.label : `${f.label}: ${v}`}
                          {STATUS_NOTE[f.status] ? <small>{STATUS_NOTE[f.status]}</small> : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {mine ? <p className="pr-current">Your current plan</p> : cta(plan.planId + period, { productId: plan.planId, billingPeriod: period })}
              </article>
            );
          })}
        </div>
        <p className="pr-fine">
          Auto-trading is part of every paid plan and turns on only when the XORA app supports and authorises it. Activating a plan never starts a live trade.
        </p>
      </section>

      {/* D. Course */}
      <section className="container pr-course" aria-labelledby="pr-course">
        <h2 id="pr-course"><GraduationCap size={22} aria-hidden /> XORA Futures Edge course</h2>
        <div className="pr-course-grid">
          <article className="pr-card pr-card-flat">
            <h3>Free Introduction</h3>
            <div className="pr-price"><b>{inr(0)}</b><span>free with an account</span></div>
            <ul className="pr-feats">
              {COURSE_FEATURES.free.map((f) => <li key={f}><Check size={16} aria-hidden /><span>{f}</span></li>)}
            </ul>
            <a className="pr-buy pr-buy-ghost" href="/learn/futures-edge" onClick={linkClick("/learn/futures-edge")}>Start free</a>
          </article>
          <article className="pr-card pr-card-flat">
            <h3>Complete XORA Futures Edge</h3>
            <Price q={courseQ} />
            <ul className="pr-feats">
              {COURSE_FEATURES.full.map((f) => <li key={f}><Check size={16} aria-hidden /><span>{f}</span></li>)}
            </ul>
            {ownsCourse ? (
              <a className="pr-buy pr-buy-ghost" href="/learn/futures-edge" onClick={linkClick("/learn/futures-edge")}>You have the course · Open it</a>
            ) : cta("course", { productId: "course" })}
          </article>
        </div>
      </section>

      {/* E. Bundle */}
      <section className="container" aria-labelledby="pr-bundle">
        <article className="pr-bundle">
          <div>
            <span className="pr-badge pr-badge-inline"><Package size={14} aria-hidden /> Launch bundle</span>
            <h2 id="pr-bundle">{BUNDLE_PRODUCT.name}</h2>
            <ul className="pr-feats">
              <li><Check size={16} aria-hidden /><span>Complete XORA Futures Edge course</span></li>
              <li><Check size={16} aria-hidden /><span>One month of XORA Trader</span></li>
              <li><Check size={16} aria-hidden /><span>Auto-trading eligibility with Trader <small>Rolling out in the XORA app</small></span></li>
              <li><Check size={16} aria-hidden /><span>Guided demo trading and learning features</span></li>
            </ul>
          </div>
          <div className="pr-bundle-buy">
            <Price q={bundleQ} />
            <p className="pr-note">
              Course regular {inr(COURSE_PRODUCT.regular)} + Trader monthly regular {inr(getPlan("trader").prices.monthly.regular)} = {inr(BUNDLE_PRODUCT.regular)}.
            </p>
            {cta("bundle", { productId: "bundle" }, "Buy the Starter Pack")}
          </div>
        </article>
      </section>

      {/* F. Comparison */}
      <section className="container" aria-labelledby="pr-compare">
        <h2 id="pr-compare">Compare plans</h2>
        <div className="pr-table-wrap" tabIndex={0} role="region" aria-label="Plan comparison, scrolls sideways on small screens">
          <table className="pr-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {PLAN_ORDER.map((id) => <th key={id} scope="col">{APP_PLANS.find((p) => p.planId === id)!.planName.replace("XORA ", "")}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Price per {periodLabel(period)}</th>
                {PLAN_ORDER.map((id) => {
                  const q = planQuote(id, period, { launchUsed: launchUsed.app });
                  return <td key={id}>{inr(q.price)}{q.launchApplied ? <small> regular {inr(q.regular)}</small> : null}</td>;
                })}
              </tr>
              {PLAN_FEATURES.map((f) => (
                <tr key={f.id}>
                  <th scope="row">{f.label}{STATUS_NOTE[f.status] ? <small>{STATUS_NOTE[f.status]}</small> : null}</th>
                  {PLAN_ORDER.map((id) => {
                    const v = f.values[id];
                    return <td key={id}>{v === true ? <Check size={18} aria-label="Included" /> : v === false ? <Minus size={18} aria-label="Not included" /> : v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* G. FAQ */}
      <section className="container pr-faq" aria-labelledby="pr-faq">
        <h2 id="pr-faq">Questions</h2>
        {FAQ.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>

      {/* H. Risk */}
      <section className="container">
        <div className="pr-risk" role="note">
          <ShieldAlert size={22} aria-hidden />
          <p>
            <b>Trading risk.</b> Crypto futures are high risk. XORA does not guarantee profitable trades, and auto-trading can make losses,
            including fast losses with leverage. Plans and the course are tools and education, not financial advice or a promise of income.
            Only trade money you can afford to lose.
          </p>
        </div>
      </section>
    </div>
  );
}

const FAQ: [string, string][] = [
  ["How long does a plan last?", "Weekly plans give 7 days of access and monthly plans 30 days, starting when you activate. Nothing renews by itself: when a period ends you can renew it from My Subscription."],
  ["Which plans include auto-trading?", "All three: Starter, Trader and Pro. Auto-trading through your Binance API turns on only when the XORA app supports and authorises it, and you stay in control. Activating a plan here never starts a trade. Plans differ in usage allowances, concurrent trades, monitoring capacity and support, not in safety features."],
  ["What is Preview Mode?", "XORA is in its launch preview. Buy Now activates the plan, course or bundle immediately without any payment: no card, UPI or bank details are asked for and nothing is charged. Your activation is recorded as a preview, not as a purchase."],
  ["How long can I use the course?", "The complete Futures Edge course stays unlocked on your account during the preview, with no automatic expiry. The free introduction (welcome video and the first two lessons) is open to every signed-in learner. Your progress is kept whatever plan you choose."],
  ["Can I upgrade or downgrade?", "Yes. An upgrade (a higher plan, or weekly to monthly) starts straight away with a fresh period. A downgrade (a lower plan, or monthly to weekly) is scheduled for the end of your current period, so you keep what you have until then. Cancelling stops the next period; you keep access until the current one ends."],
  ["How does the Founders launch price work?", "Launch prices apply to your first period of an app plan, and once to the course and the Starter Pack. Later periods use the regular price unless the offer policy changes."],
  ["Is my money at risk?", "Trading always carries risk, and auto-trading can lose money. XORA gives analysis, education and tools; it does not guarantee results. Never share your exchange password, OTP or API secret with anyone."],
];
