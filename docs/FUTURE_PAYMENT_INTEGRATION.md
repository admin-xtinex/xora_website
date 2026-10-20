# Future payment integration

Today the site runs in **Paymentless Preview Mode** (`BILLING_MODE` in `src/billing/catalog.ts`). No gateway,
no checkout, no payment records. This is how to add real payments later without rewriting the pricing UI.

## Principles

1. **The browser never grants paid access.** A paid entitlement is written only by a trusted server after the
   payment provider confirms payment (verified webhook signature or server-side order verification).
2. **Same entitlement model.** Paid grants use the same `entitlements/{uid}` and `subscriptions/{id}` shapes with
   different markers: `activationSource: "payment"`, `paymentStatus: "paid"`, `amountCollected: <verified amount>`,
   `isRealPurchase: true`, plus provider order and payment ids.
3. **Server-side prices.** The server computes the amount from its own copy of the catalogue (shared JSON or a
   package built from `catalog.ts`) and the campaign rules, never from the client.
4. **Preview stays separate.** Existing preview records keep `isRealPurchase: false` and are never counted as revenue.

## Steps

1. **Backend.** Add a small trusted API (e.g. Azure Functions in the Static Web App, or Firebase Cloud Functions on
   the Blaze plan) with the Firebase Admin SDK:
   - `POST /api/checkout` — authenticated (Firebase ID token); input `{productId, billingPeriod}`; computes the price
     server-side; creates a provider order (Razorpay / Stripe); returns the order id and public key.
   - `POST /api/payments/webhook` — verifies the provider signature; idempotent on the provider payment id; in one
     Firestore transaction applies the same rules as `src/billing/subscriptions.ts` (shared module) and writes the
     paid entitlement and record.
2. **Rules.** Keep the client-side preview rules only while `BILLING_MODE` is preview. When payments go live:
   - remove client `create/update` on `entitlements` and `subscriptions` (Admin SDK bypasses rules);
   - keep learner read of their own data and admin read of all.
3. **Client.** Add a `PaymentActivationService` next to the preview `buy()` in `EntitlementProvider.tsx`:
   - `BILLING_MODE = "payments"` → `buy()` calls `/api/checkout`, opens the provider's checkout, and on success waits
     for the entitlement document to change (the webhook writes it) before showing My Subscription.
   - Pricing, My Subscription, course gate and admin need no structural changes; add receipts/invoices from the
     provider's real data only.
4. **Renewals.** Use the provider's subscription feature (or explicit renew checkout). Never auto-charge without the
   provider's mandate and the customer's consent; show the next charge date and amount.
5. **Founders cap.** Count verified paid customers on the server; set `customerCapActive: true` only then.
6. **Admin.** `analytics.ts` already counts revenue only from `isRealPurchase && paymentStatus === "paid"`; add
   refunds and failed payments from provider data.
7. **Compliance.** Invoices with GST where required, refund and cancellation policy pages, privacy policy updates,
   and a legal review of trading-related claims before charging.

## Protecting paid course content

Lesson videos are static files under `public/futures-edge/lessons/`. Before charging for the course:

- Move premium lesson files out of `public/` into protected storage (Firebase Storage with rules, Azure Blob with
  short-lived SAS URLs, or an API that streams them after checking the entitlement), **or**
- Use Azure Static Web Apps (Standard plan) route rules with custom authentication roles, assigned by the backend
  from the entitlement.

Until then the website gate only controls navigation and cannot stop direct links.

## XORA app (trading application) contract

The trading app (`admin-xtinex/xora`, `admin-xtinex/trading_bot`) is **not modified** by this work. When it is ready
to honour plans, it should read entitlements from a trusted source, never from the browser:

- Read `entitlements/{uid}.app` via the Admin SDK (or a backend endpoint) — fields `planId`, `status`, `expiresAt`,
  `isRealPurchase`.
- Decide in the app which features a plan allows (auto-trading eligibility for all paid plans, proposed concurrent
  limits 2 / 5 / 10 once verified with the engine). Keep stop-loss, emergency stop and account security in every tier.
- Activation of a plan on the website must never start, modify or stop a live trade.
- Until payments exist, treat preview entitlements as preview (e.g. demo-only or explicit preview flags in the app).
