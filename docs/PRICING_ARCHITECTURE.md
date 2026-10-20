# Pricing and subscriptions: architecture (Paymentless Preview Mode)

XORA's pricing, launch offer, plan selection, subscriptions and course access work end to end **without
payments**. Buy Now grants a *preview entitlement*; nothing is charged and nothing is recorded as a sale.
Real billing can replace the activation step later without rewriting the UI (see `FUTURE_PAYMENT_INTEGRATION.md`).

## Where things live

| File | Role |
|---|---|
| `src/billing/catalog.ts` | **The only place prices live.** Plans, course, bundle, Founders campaign, free lessons, feature rows (each marked available / rolling out in the app / proposed), billing mode flag, period lengths, course-access policy. |
| `src/billing/types.ts` | Types for products, quotes, subscription records, entitlements; `PREVIEW_MARKERS`. |
| `src/billing/pricing.ts` | **PricingService + CampaignService**: `quote()`, `planQuote()`, `courseQuote()`, `bundleQuote()`, `campaignActive()`, `campaignRemainingMs()`, `inr()`. |
| `src/billing/subscriptions.ts` | **SubscriptionService / EntitlementService rules**, pure functions of `(state, request, now)`: `activate`, `cancel`, `keepCurrent`, `renew`, `appStatus`, `activePlan`, `hasCourse`, `canOpenLesson`. |
| `src/billing/store.ts`, `localStore.ts`, `firestoreStore.ts` | `EntitlementStore` interface and its two implementations (below). |
| `src/billing/EntitlementProvider.tsx` | **ActivationService** for the site: picks the store, runs actions once at a time, Buy Now (sign-in → activate → toast → `/account/subscription`), resumes a Buy Now after sign-in. |
| `src/billing/PricingPage.tsx` | `/pricing` |
| `src/billing/AccountPage.tsx` | `/account/subscription` (My Subscription) |
| `src/billing/CourseGate.tsx` | Free introduction vs complete course on `/learn/futures-edge/*`. |
| `src/billing/analytics.ts` | Admin subscription metrics (revenue stays ₹0 for previews). |
| `src/admin/AdminPage.tsx` | Adds "Subscriptions · Preview Mode" to `/admin`. |
| `firebase/firestore.rules` | Accepts only preview grants from clients. |

## Prices (from `catalog.ts`)

| Product | Weekly regular / launch | Monthly regular / launch |
|---|---|---|
| XORA Starter | ₹449 / ₹299 | ₹1,499 / ₹999 |
| XORA Trader (Recommended) | ₹849 / ₹599 | ₹2,999 / ₹1,999 |
| XORA Pro | ₹1,299 / ₹899 | ₹4,499 / ₹2,999 |
| Complete Futures Edge course | one-time ₹1,999 / ₹999 | |
| Complete Starter Pack (course + 1 month Trader) | one-time ₹4,998 / ₹2,499 | |
| Free Introduction (V00, T01, T02, glossary) | ₹0 | |

All paid plans include auto-trading **eligibility** (turns on only when the XORA app supports and authorises it).
Tiers differ by allowances, proposed concurrent trades (2 / 5 / 10, not enforced by the engine yet), monitoring
and support. Safety features are in every tier. Plans are not tied to the app's strategy modes.

## Founders Launch Offer (`FOUNDERS_CAMPAIGN`)

Enabled; no start or end date is set yet, so **no countdown** is shown (one appears automatically when `endsAt`
is set). The 100-customer cap is configured but `customerCapActive: false`: only verified payments may count, and
preview activations never do. Launch prices apply to the **first period** of an app plan (`launchUsed.app`), and
once to the course and the bundle; later periods show regular prices. To end the offer, set `enabled: false` or
`endsAt`.

## Data

**`entitlements/{uid}`** (one document per learner, so a bundle changes both parts in one write):
`app` (current plan: planId, billingPeriod, status, activatedAt, expiresAt, prices shown, scheduledChange,
cancelAtPeriodEnd, viaBundle, preview markers), `course` (activatedAt, expiresAt = null, viaBundle, markers),
`launchUsed {app, course}`, `version` (+1 on every change), `updatedAt`.

**`subscriptions/{subscriptionId}`** (history; one record per granted product): subscriptionId, userId, planId
(`starter`/`trader`/`pro`/`course`), productType, purchasedProductId, bundleId, billingPeriod, status,
activationSource, activatedAt, expiresAt, regularPriceINR, displayedOfferPriceINR, amountCollected,
paymentStatus, isRealPurchase, campaignId, createdAt, updatedAt.

Every preview grant carries `activationSource: "paymentless_preview"`, `paymentStatus: "not_applicable"`,
`amountCollected: 0`, `isRealPurchase: false`. `activatedAt`, `createdAt` and `updatedAt` are server timestamps;
`expiresAt` is checked by the rules against the server clock (period ± 10 minutes).

**`events`** (existing): `sub_activated`, `sub_upgraded`, `sub_downgrade_scheduled`, `sub_cancelled`,
`sub_renewed`, `sub_change_cleared`, `course_activated`, `bundle_activated`.

Statuses: `active_preview`, `expired`, `cancelled`, `scheduled_change`, `superseded`. Expiry is worked out when
read (no background jobs): an entitlement past `expiresAt` is expired.

## Stores

- **Cloud** (Firebase configured, learner signed in): `firestoreStore` runs each action as one Firestore
  transaction: read `entitlements/{uid}`, apply the rule, write the new state, new records and status updates
  together. Concurrent clicks retry against the newest state, so the second click sees "already active".
  Cross-device: state reloads on sign-in and whenever the tab regains focus.
- **Local** (Firebase not configured, e.g. a development build): `localStore` keeps state in this browser only,
  labelled "Local preview … not a verified entitlement" on every page. Never used when Firebase is configured.

## Policies

| Action | Result |
|---|---|
| Buy a plan with no active plan (or an expired one) | Starts now for 7 or 30 days. |
| Same plan and period again | "Already active" (no new record). If it was cancelled or had a scheduled change, that is undone. |
| Higher tier, or the same tier weekly → monthly | **Upgrade now**: new full period from now; the old one is `superseded`. |
| Lower tier, or the same tier monthly → weekly | **Scheduled** for the end of the period; current plan continues. |
| Cancel | `cancelled`: no next period; access until `expiresAt`. "Keep current plan" undoes it. |
| Renew | Only after expiry, by the learner (nothing renews by itself, nothing is charged). Uses a scheduled change if set; regular price after the first period. |
| Course | Independent of app plans; no automatic expiry during preview (`COURSE_ACCESS_DAYS = null`). |
| Starter Pack | Course (if not owned) + 1 month Trader, atomically. Refused (nothing changes) if the learner already has Pro or Trader monthly; upgrades Starter. |

Monthly = 30 days in preview. Course progress is kept by the course app and is never touched by plan changes.

## Buy Now

1. The page knows the product, period and the quote from `pricing.ts`.
2. Signed out (Firebase on): the request is kept in `sessionStorage` (30 minutes, validated) with a same-site
   return path, and the learner goes to `/signin?next=…`. After sign-in or sign-up, `EntitlementProvider` takes the
   request (removing it, so it runs once) and continues.
3. Signed in: one transaction applies `activate()`. Success → toast "Your XORA plan is activated — Preview Mode." →
   `/account/subscription`. Nothing about payments is shown.

Buttons are disabled while an action runs and the provider ignores overlapping actions.

## Course access

`/learn/futures-edge` needs sign-in (existing). `CourseGate` opens V00, T01, T02, the course home and glossary to
everyone signed in; any other lesson or checkpoint shows a "Part of the complete course" page with an instant
preview unlock. A strip on the course pages links to pricing for learners without the course.
**Limit:** lesson video files (`/futures-edge/lessons/*.html`) are static and reachable by direct URL; this gate is
not content protection. See `FUTURE_PAYMENT_INTEGRATION.md`.

## Admin

`/admin` keeps the learner analytics and adds: preview activations, active and expired plans, Starter / Trader /
Pro, weekly vs monthly, course and bundle activations, Founders offer use, a per-learner subscription table,
recent subscription events and a subscriptions CSV. **Actual revenue = ₹0** (only `isRealPurchase` records with a
verified payment would count). "Potential value at displayed prices" is labelled as not revenue.

## Feature flags

- `BILLING_MODE = "paymentless_preview"` — `buy()` refuses to run in any other mode until a payment provider is wired up.
- `COURSE_PAYWALL_ENABLED = true` — set false to open every lesson to signed-in learners again.
- `FOUNDERS_CAMPAIGN.enabled / startsAt / endsAt` — the offer.

## Known limits

- Preview grants are written by the learner's browser (allowed by the rules only with preview markers, correct
  expiry and their own user id). That is fine for previews; **paid** access must come from a trusted server.
- A learner could create extra preview records directly against the database; they would inflate preview counts
  and "potential value", never revenue.
- Displayed prices stored on a record come from the client and are informational only.
