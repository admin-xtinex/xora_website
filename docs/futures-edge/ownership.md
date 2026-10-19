# XORA Futures Edge — Ownership map and branches (EDGE-00, v1.0, 19 Oct 2026 IST)

Repo: `admin-xtinex/xora_website` · Integration branch: `feature/futures-edge` (from `main` @ `ad7b3b01`).
The repo is empty (see architecture.md §1), so every path below is **new**, and no existing file has an owner except `README.md` (do not touch).
**Branches below EXIST (created 19 Oct 2026, ~08:25 IST).** `feature/futures-edge` was fast-forwarded from `ad7b3b01` to `main` @ `58ca3fc6` (main had moved past `30af249b` with two user Hero commits), then EDGE-00's Wave 0 commit (`futures-edge: Wave 0 docs and contracts v1.3.0`, parent `58ca3fc6`, the commit that adds this file) was merged into it. Every `futures-edge/edge-XX-*` branch below is cut from that `feature/futures-edge` tip; run `git log -1 origin/feature/futures-edge` for the exact SHA. **Repo paths are live:** contracts at `src/features/futures-edge/contracts/` (import via that path), docs at `docs/futures-edge/`, specs at `docs/futures-edge/specs/`.

> **Updated after audit v2 (19 Oct 2026 IST):** `main` is now `30af249b` (real Vite 8 + React 19 + TS 7 landing site). The repo is **not** empty.
> 1. **`feature/futures-edge` must first be fast-forwarded from `ad7b3b01` to `main` @ `30af249b`** (user-approved GitHub write). Only then are bot branches cut.
> 2. **All module paths move under `src/`:** read every `features/futures-edge/…` below as **`src/features/futures-edge/…`** (`tsconfig.include` is `["src"]`). `tests/e2e/futures-edge/**` and `docs/futures-edge/**` stay at the repo root.
> 3. **EDGE-01 no longer owns a host scaffold.** The host files already exist and are owned by the user. EDGE-01 owns `src/features/futures-edge/platform/**`, `src/features/futures-edge/index.ts`, `src/features/futures-edge/content/index.ts`, the new `src/vite-env.d.ts`, plus **only these small, listed host diffs**: `src/App.tsx` (flag-gated lazy mount at `/learn/futures-edge`), `src/lib/content.ts` (add `LINKS.futuresEdgeCourse`), `src/components/FuturesEdgeSection.tsx` (CTA href), `tsconfig.json` + `vite.config.ts` (`@futures-edge/*` alias), and `package.json`/`package-lock.json` scripts/devDependencies **only after user approval** (D-v2-3). EDGE-01 does not touch `.gitignore`, `.nvmrc`, `index.html` or `public/**`.
> 4. **Host-owned, forbidden to every bot** (EDGE-11 minimal logged wiring fixes only): `src/main.tsx`, `src/styles.css`, `src/lib/utils.ts`, `src/lib/series.ts`, all other `src/components/**`, `index.html`, `public/**`, `Dockerfile`, `nginx.conf`, `README.md`, `.gitignore`.
> 5. EDGE-00's contracts path becomes `src/features/futures-edge/contracts/**`. Patch v1.0.1 is required before import (unused `type Slide` import in `src/validation.ts` fails the repo's `noUnusedLocals`).
> 6. EDGE-10 also owns any test configs it adds (`vitest.config.ts`, `playwright.config.ts`, `tests/tsconfig.json`), **only if** the devDependencies are approved. EDGE-01 owns the matching `package.json` script entries.

| Bot | Branch | Owned paths (write access) | Must not touch |
|---|---|---|---|
| EDGE-00 Mission Control | `futures-edge/edge-00-mission-control` | `features/futures-edge/contracts/**`, `docs/futures-edge/architecture.md`, `docs/futures-edge/task-board.md`, `docs/futures-edge/ownership.md`, `docs/futures-edge/bot-briefs.md`, `docs/futures-edge/issue-log.md` | everything else |
| EDGE-01 Learning Platform | `futures-edge/edge-01-learning-platform` | Host scaffold: `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.*.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.js`, `.prettierrc`, `.gitignore`, `.nvmrc`, `index.html`, `src/**`, `public/**`; module: `features/futures-edge/platform/**`, `features/futures-edge/content/index.ts` (lazy lesson registry only), `features/futures-edge/index.ts` (module entry) | `content/phase-*/**`, contracts, other modules |
| EDGE-02 Crypto Foundations | `futures-edge/edge-02-crypto-foundations` | `features/futures-edge/content/phase-01/**` (T01, T02, T03, T04) | everything else |
| EDGE-03 Trading Fundamentals | `futures-edge/edge-03-trading-fundamentals` | `features/futures-edge/content/phase-02/**` (T05–T09) | everything else |
| EDGE-04 Binance & Futures | `futures-edge/edge-04-binance-futures` | `features/futures-edge/content/phase-03/**` (T10–T13) | everything else |
| EDGE-05 Market Analysis | `futures-edge/edge-05-market-analysis` | `features/futures-edge/content/phase-04/**` (T14 first, then T15–T18) | everything else |
| EDGE-06 Scalping & Risk | `futures-edge/edge-06-scalping-risk` | `features/futures-edge/content/phase-05/**` (T19–T23) | everything else |
| EDGE-07 Motion Studio | `futures-edge/edge-07-motion-studio` | `features/futures-edge/motion/**` (scene registry, renderers, playback controls, `motion/index.ts`) | contracts (request new scene types instead), content |
| EDGE-08 Simulation Lab | `futures-edge/edge-08-simulation-lab` | `features/futures-edge/simulation/**` (`math/`, `fixtures/` shared fixtures, `widgets/`, fixture provider, `simulation/index.ts`) | content (incl. lesson-local fixtures), any exchange/order client |
| EDGE-09 Assessment & Progress | `futures-edge/edge-09-assessment-progress` | `features/futures-edge/assessment/**` (quiz runner, grader, `checkpoints/cp1.ts`, `cpa.ts`, `cpb.ts`, progress adapters, `assessment/index.ts`) | lesson question text (ask the author for changes), any trading DB |
| EDGE-10 Accessibility & QA | `futures-edge/edge-10-a11y-qa` | `features/futures-edge/qa/**`, `tests/e2e/futures-edge/**`, `docs/futures-edge/qa/**` | product code: file owner-tagged defects instead |
| EDGE-11 Release Integrator | `futures-edge/edge-11-release-integrator` (merges into `feature/futures-edge`) | merge commits on `feature/futures-edge`; `docs/futures-edge/release/**`; minimal wiring/conflict fixes, each logged in the release report; `package.json` deps only on request | `main` (without authorization), production trading anything |

## Per-lesson file convention (content bots)
```
features/futures-edge/content/phase-0N/Tnn/
  lesson.ts        export default <Lesson>          (required)
  fixtures.ts      export const fixtures: Fixture[]  (optional; lesson-local synthetic data, ids FX-Tnn-*)
  *.ts             optional splits (slides.ts, notes.ts, quiz.ts, exercises.ts) imported by lesson.ts
  __tests__/       lesson-specific tests (e.g. golden answers, arithmetic checks)
```
Content files import **only** from `features/futures-edge/contracts`.

## Shared-resource rules
- Glossary: each term is defined once, in the lesson that **introduces** it (`introducedIn`). Later lessons reference it by id. Duplicate ids fail `validateCourse`. If two phases need the same new term, the earlier lesson defines it. Conflicts go to EDGE-00.
- Fixtures: lesson-specific data → the author's `fixtures.ts`; reusable data or new computation → request it from EDGE-08.
- Scene types: only the 25 `SCENE_TYPES`. Request new ones (EDGE-00 + EDGE-07 approve).
- Exercise types: only the 15 `EXERCISE_TYPES`. Request new ones (EDGE-00 + EDGE-08 approve).
- Requests and decisions are logged by EDGE-00 in `docs/futures-edge/issue-log.md`. (No GitHub issues are created unless the user approves.)
