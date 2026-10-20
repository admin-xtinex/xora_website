# Pricing and subscriptions: test results

Run on 20–21 Oct 2026 in the development container. Commands and real output summaries.

## Automated (Vitest, `npm test`)

`npx vitest run` → **9 files, 238 tests passed** (204 existing course tests + 34 new), stable over 3 consecutive runs.
`npx tsc --noEmit` → no errors. `npm run build` (production `.env.production`) → builds.

New tests:

| File | Covers |
|---|---|
| `src/billing/__tests__/pricing.test.ts` (10) | Approved regular and launch prices for all plans, periods, course and bundle; bundle = course + Trader monthly; Trader is the only "Recommended"; 7 / 30 day periods; savings and percentages; weekly ↔ monthly prices; first-period rule; campaign off / not started / ended; countdown only with an end date; cap inactive; ₹ formatting. |
| `src/billing/__tests__/subscriptions.test.ts` (15) | Activation and exact expiry dates; preview markers on every record (`amountCollected 0`, `isRealPurchase false`); repeated click → no duplicate; upgrade now + superseded; weekly→monthly upgrade, monthly→weekly scheduled; downgrade scheduled then applied at renewal with regular price; cancel keeps access to expiry; undo cancel; no automatic renewal; course unlock once and independent of plan changes; free lessons V00–T02 only; bundle grants both parts atomically with matching bundleId and ₹2,499 split; bundle refused for Pro (no change); Starter→bundle upgrade; analytics for Starter / Trader / Pro / course-only / bundle users with **actual revenue ₹0** and labelled potential value. |
| `src/billing/__tests__/flows.test.tsx` (9, jsdom + React Testing Library) | Pricing page prices and the Weekly/Monthly toggle without reload; Buy Now clicked three times → one activation, preview toast, redirect to My Subscription; bundle then a "page refresh" (new provider) keeps both entitlements; free account state; Cancel Preview and Keep current plan; Buy Now remembered across sign-in and run once; stale/invalid requests dropped; same-site return paths only (`//host`, `/\host`, `https:`, `javascript:` rejected); admin access only for listed confirmed emails; lesson address parsing for the course gate. |

## End to end against the Firebase emulators (Auth + Firestore with `firebase/firestore.rules`)

Production build pointed at the emulators, driven with Playwright/Chromium:

| Step | Result |
|---|---|
| Signed out, Weekly, Trader → Buy Now | Sent to `/signin?next=/account/subscription` ✓ |
| Create account | Returned to My Subscription, toast "Your XORA plan is activated — Preview Mode.", XORA Trader weekly active ✓ |
| Reload | Plan still shown ✓ |
| Open T07 (locked) | "Part of the complete course" page ✓ → Unlock → T07 opens, course strip gone ✓; free T01 opens ✓ |
| Pricing → Pro (monthly) | Upgraded immediately ✓ |
| Pricing → Starter | Downgrade scheduled for period end ✓ |
| Second learner → Starter Pack | Course unlocked + Trader monthly, both shown ✓ |
| Admin (verified email) → `/admin` | 4 preview activations, 2 active plans, 1 course, 1 bundle, 3 Founders; **actual revenue ₹0**; potential value ₹8,596 (= 599 + 999 + 4,499 + 2,499, checked by hand) ✓ |
| Console errors | none ✓ |

Security rules (client SDK as a signed-in learner): 15 / 15 as expected. Allowed: read own entitlements, list own
records, write a valid preview record. Refused: list everyone's records, read others' entitlements, record marked as
a real purchase, record with money collected, 1-year expiry, record for another user, extending own expiry, turning
own plan into a real purchase, removing own course grant, writing without a version bump, changing a record's price,
deleting a record. Earlier learner/admin rules (13 checks) still pass.

## Responsive and accessibility

Horizontal overflow measured with Playwright at 320, 375, 390, 430, 768, 1024 and 1440 px for `/pricing` and
`/account/subscription`, and the home page at 320 / 375 / 1440: **0 px everywhere** (two issues found and fixed:
the pricing hero grew to fit the comparison table on phones; the header's new Sign in button pushed the header past
the screen; the header now uses an icon button below 1180 px, hides "Get Started" below 1080 px and moves account
links into the phone menu below 480 px). Mobile menu has Pricing; back/forward works. Reduced motion removes the
Trader card lift. Billing toggle is a labelled radio group; tables have row/column headers; FAQ uses
`<details>`; buttons are 44–50 px tall.

Screenshots: `docs/pricing-screenshots/` (desktop 1440 and phone 390 full pages, My Subscription, locked lesson,
admin).

## Not tested here

Real Google sign-in and real confirmation emails (need the live project; the emulator covers email/password),
Safari/iOS (Chromium only), and screen-reader runs.
