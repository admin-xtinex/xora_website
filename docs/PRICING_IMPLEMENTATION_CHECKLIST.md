# Pricing implementation checklist

Status: ✅ Complete (with evidence) · ⚠️ Complete with a documented limit · ⏳ Not started / out of scope now

## Phase 1 — Read-only audit ✅
- ✅ Stack: React 19, TypeScript, Vite 8, Tailwind v4, Motion; custom router `src/lib/router.ts`; content in `src/lib/content.ts`.
- ✅ Auth: Firebase (email/password + Google) in `src/auth/`, live config in `.env.production`, admins tisan@ and info@xtinex.com.
- ✅ Firestore: `users`, `events`, rules in `firebase/firestore.rules`; admin portal `/admin`.
- ✅ Course: `/learn/futures-edge` (course app in `src/features/futures-edge`, its own router event `fe:navigate`); 27 video lessons; voiceover on 25 (CPA, CPB subtitles only).
- ✅ Deploy: GitHub Action on push to `main` → Azure Static Web Apps.
- ✅ Trading repos (`xora`, `trading_bot`) not touched.

## Phase 2 — Pricing foundation ✅
- ✅ Central typed catalogue `src/billing/catalog.ts` (plans, course, bundle, features with honest status, free lessons). Evidence: `pricing.test.ts`.
- ✅ Campaign config `FOUNDERS_CAMPAIGN` (enabled, dates, cap inactive, first-period rule, label, description). Evidence: campaign tests.
- ✅ PricingService / CampaignService `src/billing/pricing.ts`.

## Phase 3 — Premium UI ✅
- ✅ `/pricing`: hero + offer + preview note, Weekly/Monthly toggle, 3 plan cards (Trader "Recommended", highlighted), course (free + complete), Starter Pack, comparison table, FAQ, risk notice. Evidence: screenshots, `flows.test.tsx`.
- ✅ No countdown without an end date; no purchase counts or scarcity.
- ✅ Responsive 320–1440 px, 0 px overflow; reduced motion. Evidence: `PRICING_TEST_RESULTS.md`.

## Phase 4 — Paymentless Preview activation ✅
- ✅ Buy Now on every product; signed-out → sign-in with remembered request → resumes once → activation → toast → `/account/subscription`. Evidence: e2e (emulator), `flows.test.tsx`.
- ✅ No gateway, forms, payment screens, transaction ids, invoices or receipts.
- ✅ Records marked `paymentless_preview` / `not_applicable` / `0` / `false`. Evidence: tests + rules.
- ✅ Feature flag `BILLING_MODE`.
- ✅ Cloud store (Firestore transactions, server timestamps) and labelled local-only fallback when Firebase is not configured.
- ✅ Duplicate protection (state-based + one action at a time). Evidence: triple-click test, transaction.

## Phase 5 — Entitlement integration ✅ / ⚠️
- ✅ Account state shared site-wide (`EntitlementProvider`), reloads on focus (cross-device).
- ✅ Expiry computed on read; 7 / 30 days.
- ✅ Course gate: free V00–T02; others locked with instant preview unlock; progress kept. Evidence: e2e T07 unlock.
- ⚠️ Lesson video files are public static files (direct links work). Documented in `FUTURE_PAYMENT_INTEGRATION.md`.

## Phase 6 — My Subscription ✅
- ✅ `/account/subscription`: account, plan, period, activated, expiry, days left, Preview Mode, regular and shown prices, amount paid ₹0, course access, features, Upgrade / Change / Renew / Cancel / Keep current / View Pricing / Go to Course; empty, loading and error (retry) states; activation history.
- ✅ Upgrade now, downgrade scheduled, cancel to period end, renew after expiry (regular price after first period). Evidence: `subscriptions.test.ts`, e2e.
- ⏳ "Go to XORA App": hidden until a verified app address exists (none in this repo).

## Phase 7 — Admin ✅
- ✅ "Subscriptions · Preview Mode" in `/admin` (learner analytics kept): activations, active, expired, per plan, weekly vs monthly, course, bundle, Founders, per-learner table, recent events, subscriptions CSV.
- ✅ Actual revenue ₹0; "Potential value at displayed prices" labelled not revenue. Evidence: e2e (₹8,596 checked by hand).
- ✅ Rules: admins read all; learners only their own. Evidence: 15 rules checks.

## Phase 8 — QA ✅
- ✅ `tsc`, `vitest` (238 passed), production build.
- ✅ Emulator end-to-end and security rules.
- ✅ Responsive and reduced-motion checks; mobile menu and back/forward.
- ✅ No regression: existing 204 course tests pass; home page, sign-in, course and admin flows exercised.

## Phase 9 — Release ✅ / ⏳
- ✅ Docs: `PRICING_ARCHITECTURE.md`, `FUTURE_PAYMENT_INTEGRATION.md`, `PRICING_TEST_RESULTS.md`, this checklist.
- ✅ Pushed to `main` → automatic deploy.
- ⏳ **Publish the updated `firebase/firestore.rules` in the Firebase console** (owner step; until then cloud activations are refused and learners see "could not be updated").
- ⏳ Real payments, secure content delivery, app-side plan enforcement — future work.
