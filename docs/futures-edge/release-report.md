# XORA Futures Edge — learning system: release and safety report

Branch `futures-edge/learning-system` (worktree `xora_website-edge`), merged with `origin/main` @ `57ad777` (the owner's `/course` page and the V00/T01 narrated video lessons are kept unchanged). **Not pushed, not deployed.**

## What ships

- `/learn/futures-edge` — interactive course: home (diagnostic, roadmap, continue, weak topics, FAQ, accessibility, feedback), 23 lessons, glossary, checkpoints CP1/CPA/CPB.
- Each lesson: Watch animation (plus the owner's narrated video when that lesson is released in `courseData.ts`, today V00/T01) · View slides · Read notes · Try it · Take quiz · Review. All six views come from one lesson data file.
- Behind the build flag `VITE_FUTURES_EDGE_ENABLED` (default **off**). A default `npm run build` produces one JS chunk with **no** course code (verified: 0 chunks contain course strings); the landing page and `/course` behave exactly as on `main`.
- Content inventory: [`content-inventory.md`](content-inventory.md) (generated from the data).

## Existing files changed (complete list)

| File | Change | Why |
|---|---|---|
| `src/App.tsx` | +18 lines: if the flag is on and the path is `/learn/futures-edge…`, lazy-load the course; otherwise the owner's pages render unchanged. With the flag off the import is constant-folded away. | Mount point |
| `src/components/futures-edge/CourseCatalog.tsx` | +5 lines: one "Open the interactive lessons" link, rendered only when the flag is on. | Cross-link from `/course` |
| `tsconfig.json` | `@futures-edge/*` path alias | Contract imports |
| `vite.config.ts` | same alias; Vitest `test` block (`fsModuleCache: false` so the content gate sees new lessons) | Tests |
| `src/vite-env.d.ts` (new) | typing for the flag | — |
| `package.json` / `package-lock.json` | `test` script; devDependencies `vitest`, `jsdom`, `@testing-library/react`, `@types/node` | Tests only; nothing added to runtime dependencies |

Everything else is new under `src/features/futures-edge/**` and `docs/futures-edge/**`. No file in `public/`, `content/futures-edge/` (the video lesson sources), `tools/`, styles, or any other component was modified. The course stylesheet uses a `fel-` class prefix scoped to `.fel-root`, so it cannot restyle the owner's `.fe-*` course catalog.

## Safety and non-regression

- **No live trading capability.** The module contains no `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `axios`, exchange hosts, `ws://` URLs, API-key/secret fields, `eval`/`new Function` or `dangerouslySetInnerHTML`. Enforced by `__tests__/safety-boundary.test.ts`, which scans every module file, and which also restricts imports to the module itself, React, and two read-only host files (`Header` for the logo, `courseData` for the video list).
- **No trading repo touched.** Bot, execution, auth and schema code (`trading_bot*`, `xora_v4`, `xora`) were not opened for writing; this repo has no such code.
- **Data.** Every price is fictional (`DEMO/USDT`-style symbols or BTC with "fictional/illustrative" labels); every fixture is `fictional: true` and validated. Rates are the documented illustrative constants (taker 0.05%, maker 0.02%, slippage 0.02%, funding +0.01%/8 h, MMR 0.5%).
- **Decisions are DEMO only.** BUY/SELL/WAIT/NO_TRADE choices are labelled "DEMO" and only update local progress. Every Phase 5 lesson has an item whose best answer is to abstain (checked by test).
- **Progress** is local to the browser ("saved on this device only"), validated on load, version-migrated, and never unlocks anything real.
- **Rendering.** Content is plain text; glossary links and bold are parsed, nothing is injected as HTML.

## Test results (run locally, 19 Oct 2026)

- `npx tsc --noEmit` → no errors.
- `npx vitest run` → **6 files, 204 tests passed**:
  - `content.test.ts` — per lesson: contract validator with 0 errors **and 0 warnings**, meta/glossary consistency, fixture validation, scene parameter specs + render at p = 0/0.5/1 (no NaN), exercise specs + widget render, every formula worked example recomputed by the simulators; full-course validation (all glossary references resolve, checkpoint references resolve).
  - `simulation.test.ts` — all 16 simulators incl. OHLC aggregation, PnL, net fees (gross winner → net loser), break-even, leverage, approximate liquidation, funding sign, position size (short, size step), lookback range, and edge cases (zero price, wrong-side stop, negative quantity, absurd leverage, divide by zero, overflow, NaN).
  - `assessment.test.ts` — grader, safety-critical tracking, deterministic shuffle, progress reducer (viewing alone never completes), version migration, storage corruption/quota, router.
  - `player.integration.test.tsx` (jsdom) — T01, T14, T23: every tab, every slide, quiz to 100%, progress saved, resume after refresh; course home; CPA pass and safety-item fail; CPB loads 25 items.
  - `safety-boundary.test.ts`, `inventory.test.ts` (all 23 lessons present and gate-clean).
- `npm run build` → passes with the flag off and on.
- Browser (Vite dev, flag on): T14 animation/slides/builder/quiz; T01 with the owner's narrated video playing inside the lesson; all 23 lessons × 6 tabs at **320 px** wide with no horizontal overflow and no console errors (two mobile layout bugs found and fixed: header and slide navigation); `/course` unchanged apart from the flag-on link.

## Known limitations

- **Human review pending.** "✓ gate" means machine checks only. Every lesson still needs subject-matter and India-facing legal/compliance review before public release; Binance is referenced only generically and is not verified against the current UI.
- **Localisation.** English only; Malayalam/Hindi keys are derivable (`l10nKey`) but no translations ship (by design: no unreviewed machine translation).
- **Engine gaps the authors worked around:** mark price is carried in data and text but never drawn; take-profit always fills at its target in scenes (unfilled TP is taught via a near-miss scene); the decision-widget checklist is not scored; the capstone replay mirrors a long plan for a SELL; `trade-lifecycle` truncates step labels at 30 characters.
- **Not run:** Playwright/axe automated accessibility scans (no browser test tooling in the repo). Keyboard, reduced-motion and screen-reader paths are implemented and covered by jsdom tests and manual checks, not by an automated a11y audit.
- Progress is per device only (no backend/auth exists to sync it).

## Follow-on backlog (not implemented): XORA-specific tutorials T24–T32

T24 Reading the XORA dashboard · T25 What XORA's trend and level analysis means · T26 Interpreting XORA scenarios and confidence (uncertain by design) · T27 Coin selection: Manual vs XORA AI lists · T28 Demo practice workflow in XORA · T29 Journaling and reviewing XORA demo trades · T30 Risk settings and loss limits in XORA · T31 When XORA says NO_TRADE · T32 From demo to real: readiness checklist and why many should not.

## Before any deploy

Deploying the course means building with `VITE_FUTURES_EDGE_ENABLED=true` and uploading `dist/` to the Azure Static Web App, which makes all of the above public. That needs the owner's explicit go-ahead (and ideally the human review above first).
