# XORA Futures Edge: learning system build plan (single-session build)

Updated Mon 19 Oct 2026 IST. Branch: `futures-edge/learning-system` (local worktree `xora_website-edge`, cut from `origin/feature/futures-edge` @ `b062268`).
Status keys: Not started / In progress / Complete / Blocked. **All rows Complete as of 19 Oct 2026 — see release-report.md and content-inventory.md.**

## Audit summary (read-only, 19 Oct 2026)

| Item | Finding | Evidence |
|---|---|---|
| Host of xora.xtinex.com | `admin-xtinex/xora_website`, Vite 8.3 + React 19.3 + TS 7.0 strict + Tailwind 4 + Motion 14 + lucide-react. One page, no router. Deployed by hand to Azure SWA Free (`rg-xora-web`). | `package.json`, `README.md`, `public/staticwebapp.config.json` |
| Routing | None (hash anchors). SWA `navigationFallback` and nginx `try_files` already serve deep links such as `/learn/...`. | `src/App.tsx`, `nginx.conf` |
| Auth / storage / i18n / tests / lint / CI | None. | `rg` over `src/`; no test script |
| Theme | Tokens in `src/styles.css` `@theme` (void/ink/fg/muted/faint/cyan/blue/violet/magenta/line, Manrope + Outfit). | `src/styles.css` |
| Trading code in this repo | None. No fetch, WebSocket, exchange client or env usage. | `rg` |
| Existing Futures Edge work | Contracts v1.3.0 (types + validator, 2.3k lines) and planning docs on `feature/futures-edge`. The staged lesson drafts the task board mentions were on a remote build box and are **not** in the repo or on this machine, so all lesson content is written fresh here. | `docs/futures-edge/task-board.md`, `tools/probe-drafts.ts` (`/workspace/...`) |

## Safety boundaries

- Every new file lives under `src/features/futures-edge/**`, `docs/futures-edge/**` or test config. The module never imports `fetch`, `WebSocket`, `XMLHttpRequest`, `axios` or any exchange client; a test greps for this.
- No order, API key, auth, schema or bot code is touched (none exists in this repo; the trading repos are not opened for writing).
- All prices are fictional `DEMO/USDT`-style data, labelled on every scene and exercise.
- The course is behind `VITE_FUTURES_EDGE_ENABLED` (default OFF). A normal `npm run build` ships the landing page unchanged except for a lazy, unreachable chunk.
- No deploy without the owner's go-ahead.

## Host diffs (the only existing files that change)

| File | Change |
|---|---|
| `src/App.tsx` | If the flag is on and `location.pathname` starts with `/learn/futures-edge`, lazy-load the course instead of the landing sections. |
| `tsconfig.json` | `paths` alias `@futures-edge/*`. |
| `vite.config.ts` | Same alias + Vitest `test` block. |
| `package.json` / `package-lock.json` | `test` script; devDependencies `vitest`, `jsdom`, `@testing-library/react` (dev-only; not in the production bundle). |

## Module layout (all new)

| Path | Contents | Status |
|---|---|---|
| `src/features/futures-edge/contracts/**` | Existing v1.3.0 contracts (unchanged) | Complete |
| `simulation/constants.ts` | `EDUCATIONAL_CONSTANTS` (D-12 baseline values) | Not started |
| `simulation/math.ts` | Pure simulators for all 16 `SIMULATOR_IDS` with `SimResult` errors for zero, negative, wrong-side, divide-by-zero, overflow | Not started |
| `simulation/fixtures.ts` | Fixture provider built from lesson-local fixtures | Not started |
| `motion/registry.ts` | 25 scene definitions (`validateParameters`, default durations, reduced-motion modes) | Not started |
| `motion/scenes/*.tsx` | Scene renderers: pure functions of scene progress `p ∈ [0,1]` (seek/replay are deterministic) | Not started |
| `motion/StoryboardTimeline.tsx` | Play / Pause / Replay / Skip / speed 0.75–1.25×, step list, captions, aria-live, "Read as text", reduced motion, rAF only while visible | Not started |
| `exercises/*.tsx` | Widgets for the 15 `EXERCISE_TYPES`, keyboard-complete, Reset + hints + feedback | Not started |
| `assessment/grader.ts` | Grades lesson quizzes and checkpoints; safety-critical tracking | Not started |
| `assessment/progress.ts` | Local-only `ProgressStorageAdapter` (localStorage, "saved on this device only"), version migration | Not started |
| `assessment/checkpoints/{cp1,cpa,cpb}.ts` | CP1 8 items (non-gating), CPA 20–25, CPB 20–25 + 5 applied items | Not started |
| `platform/FuturesEdgeApp.tsx` + `router.ts` | History-API router: home, `t01…t23`, `checkpoint/cp1|cpa|cpb`, `glossary` | Not started |
| `platform/*.tsx` | CourseHome, PhaseRoadmap, LessonCard, LessonPlayer, SlideDeck, NotesReader, RichText + DefinitionTooltip, GlossaryDrawer, QuizRunner, CheckpointExam, RemediationPanel, ReviewCard, ProgressTracker | Not started |
| `platform/fe.css` | Styles scoped under `.fe-root`, aliasing host tokens; up/down/warning tokens (D-33) | Not started |
| `content/index.ts` | Lazy lesson registry (one chunk per lesson) + light catalog for the home page | Not started |
| `content/phase-0N/Tnn/{lesson,fixtures}.ts` | 23 authored lessons | T14 first |
| `__tests__/*.test.ts(x)` | simulators + edge cases, OHLC aggregation, full-course `validateCourse`, fixtures, formula goldens recomputed, scene params, grader, progress migration, boundary grep, T01/T14/T23 player integration | Not started |

## Order of work
1. Engine (simulation, motion, exercises, assessment, platform) + T14 end-to-end. Verify in the browser.
2. T01–T13, T15–T23 on the same engine.
3. Checkpoints, full validation, tests, build, inventory + safety report.
