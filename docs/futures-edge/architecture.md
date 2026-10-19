# XORA Futures Edge — Architecture (EDGE-00 Mission Control, Wave 0)

- Audit date: **Mon 19 Oct 2026, ~07:05–07:40 IST (UTC+5:30)**
- Auditor: EDGE-00 (read-only; nothing was written to GitHub)
- Repo: `https://github.com/admin-xtinex/xora_website` (public)
- Audited commit: `ad7b3b01d5ec17cf977c9c72a3470fc5a10e7435` (`main` and `feature/futures-edge` both point here)
- Target repo location of this file: `docs/futures-edge/architecture.md` (staged on the box at `/workspace/futures-edge/docs/`)

> **Updated after audit v2 (19 Oct 2026, ~07:56 IST).** `main` is now at `30af249b` and holds a real site:
> **Vite 8.3.4 + React 19.3.1 + TypeScript 7.0.2 (strict, `noUnusedLocals`) + Tailwind v4.3.3 + Motion 14 + lucide-react**, a single-page
> landing (no router), deployed manually to Azure Static Web Apps (Free), with a Docker/nginx alternative. `feature/futures-edge` is still at
> `ad7b3b01` and **must be fast-forwarded to `main` before any bot branches**. Full evidence: `audit-v2.md`. Sections §1, §3, §5, §6, §9, §10
> and §11 below carry "Updated after audit v2" notes. Where a v2 note conflicts with v1 text, the v2 note wins.

---

## 1. Verdict

> **Updated after audit v2:** the v1 verdict below is **superseded**. The repo now holds the XORA landing page (see `audit-v2.md` §2).
> The module is **integrated into the existing app** at `src/features/futures-edge/`, mounted at `/learn/futures-edge` behind the flag.
> EDGE-01 does **not** build a host scaffold. The v1 text is kept for history.

**The repository is effectively empty. It is not an existing website app.** It holds a single 15-byte `README.md`
(`# xora_website`) and one commit. No framework, router, auth, styles, components, packages, tests, CI or deploy
config exist to integrate with.

So we use the master prompt's fallback (§1 step 3): **build a standalone, integration-ready learning module** in
an isolated namespace (`features/futures-edge/`), with adapter interfaces for routing, persistence, auth and
theming. EDGE-01 also adds a minimal host app so the module can be built, tested and previewed. Nothing here claims
to integrate with the live xora.xtinex.com site.

## 2. Verified facts (observed, with source)

| # | Fact | How verified |
|---|---|---|
| F1 | Repo `admin-xtinex/xora_website` is public, `language: null`, `size: 0`, default branch `main`, created 2026-10-19 06:07 IST | GitHub `get_repository` |
| F2 | Branches: `main` and `feature/futures-edge`, both at `ad7b3b01…`, neither protected | GitHub `list_branches` |
| F3 | One commit: `ad7b3b01` "Create README.md" by admin-xtinex, 2026-10-19 06:07 IST, no parents | GitHub `list_commits` |
| F4 | Full recursive tree = **1 file**: `README.md` (15 bytes, content `# xora_website\n`); `truncated: false` | GitHub `get_git_tree recursive` + raw fetch |
| F5 | No `package.json`, `CNAME`, `vercel.json`, `netlify.toml` (raw URLs return 404); no `.github/` workflows (not in tree) | raw.githubusercontent.com probes + tree |
| F6 | So there is **no** framework, TypeScript config, package manager lockfile, router, auth, styling/theme, UI lib, chart lib, i18n, storage, test framework, lint config, CI or deploy method **in this repo** | follows from F4 |
| F7 | No trading / Binance / WebSocket / execution / decision-engine code exists in this repo | follows from F4 |
| F8 | `https://xora.xtinex.com` could not be inspected from the audit box: `curl` failed with a TLS EOF, and the fetch service returned HTTP 500 | curl + WebFetch, 19 Oct 2026 ~07:10 IST |
| F9 | The same owner has a **private** repo `admin-xtinex/xora` (TypeScript, ~112 MB): an **Expo 49 / React Native 0.72 / React 18.2 / TypeScript ^5.6** app (`zustand`, `@tanstack/react-query`, `axios`, `react-native-web`) with a `build:web` script that exports to the `/app` base path. Its root has trading audits (`TRADING_PIPELINE_AUDIT.md`, `PREDICTION_ENGINE_ENTRY_AUDIT.md`, `LIVE_READINESS_AUDIT.md`, …) and an `src/` tree | read-only `get_git_tree` (top level, not recursive) + `package.json` of `xora` |
| F10 | Other trading-related repos of the same owner: `trading_bot` (private, JS), `trading_bot_app` (private, JS), `trading_bot_old_tbd` (private), `xora_trade_ai` (public, Python), `xora_chart_ai` (public, Python), `xora_intelligence_ai` (public) | GitHub `search_repositories user:admin-xtinex` |
| F11 | Box toolchain: Node v20.19.2, npm 11.21.0, TypeScript 5.9.3 (via npx), tsx 4.23.15 (via npx) | shell |
| F12 | The contracts in `contracts/` typecheck under `--strict` and pass 23/23 self-tests (commands in §11) | ran on the box |

## 3. Assumptions and decisions (NOT verified — each needs user confirmation or later verification)

| # | Assumption / decision | Why | Who confirms |
|---|---|---|---|
| A1 | **Stack: Vite + React 18 + TypeScript (strict) + npm.** EDGE-01 creates this scaffold. | The repo has nothing. React 18.2 + TS 5 matches the sibling `xora` app (F9), so later reuse or porting stays cheap. Vite gives a static `dist/` that any static host can serve. | **User (open decision D1)** |
| A2 | Tests: **Vitest** (unit/integration) + **@testing-library/react** + **Playwright** (E2E) + **axe-core** (`@axe-core/playwright`) for a11y; lint: **ESLint (flat config) + typescript-eslint**; format: Prettier | Common defaults for Vite + React + TS; nothing to reuse | EDGE-01 lands, EDGE-10 uses |
| A3 | Routing: **react-router v6** (`createBrowserRouter`), base `ROUTE_BASE = /learn/futures-edge`, lesson routes `/learn/futures-edge/t01…t23`, checkpoints `/learn/futures-edge/checkpoint/cp1|cpa|cpb` | No router exists; `/learn/...` keeps the area separate from any future `/app` path (F9) | EDGE-01; user may rename |
| A4 | Auth: **none.** Learners are anonymous (`ANONYMOUS_USER_ID`). An `AuthAdapter` interface (EDGE-01) returns `null` user in v1 | There is no auth to reuse; the master prompt forbids inventing it | Future integration |
| A5 | Persistence: **local-only demo adapter** (localStorage, key prefix `xora.futuresEdge.v1.progress.`), labelled "saved on this device only". A server adapter can be added later behind `ProgressStorageAdapter` | No backend exists | EDGE-09 |
| A6 | Styling: **CSS Modules + CSS custom properties (design tokens)** in `features/futures-edge/platform/theme/`, cyan/violet-on-dark default, WCAG AA. Tokens are scoped under `.fe-root` so they never restyle a future host site | No existing XORA web theme to derive tokens from (F6, F8). Brand colours unverified | EDGE-01; user to supply brand tokens (D4) |
| A7 | UI libraries: none added beyond React. Charts: **local SVG/Canvas only** (no chart package) | Nothing to reuse; keeps the bundle small and avoids any coupling to trading chart code | EDGE-07 / EDGE-08 |
| A8 | i18n: **no library in v1.** English source strings in content; keys derived by `l10nKey()`; `ml`/`hi` hooks only | Nothing to reuse; avoids unreviewed machine translation | EDGE-01 |
| A9 | Deploy: **unknown.** v1 output is a static build (`dist/`). No CNAME and no host config exist; the live site is unreachable from the box (F8). We do not deploy, and do not add a CNAME, without explicit user authorization | F5, F8 | **User (D3)** |
| A10 | Validation library: plain TS validators (no zod) | Repo has no dependencies; zod is not in use (F6) | Frozen |

### 3.1 Updated after audit v2: status of each assumption
- **A1** partly holds: the stack exists as Vite 8 + **React 19** + **TS 7.0.2** + npm. No scaffold. Integrate into it.
- **A2** absent: there are no test, lint or format tools in the repo. Vitest/Testing Library/Playwright/axe/ESLint remain a **proposal** needing approval. Compatibility with TS 7 / Vite 8 is unverified.
- **A3** must change: there is **no router** (hash-anchor single page). Mount by pathname in `src/App.tsx` + a small in-module History-API route adapter. react-router only if the user approves a dependency. `ROUTE_BASE` unchanged. SWA `navigationFallback` and nginx `try_files` already serve `/learn/*`.
- **A4, A5, A8, A10** hold (no auth, storage or i18n in the host).
- **A6** tokens must change: alias the real host tokens (`--color-void/ink/fg/muted/faint/cyan/blue/violet/magenta/line`, `--font-sans` Manrope, `--font-display` Outfit, `--ease`, `--grad-brand`, `--glass-*`) under `.fe-root`. Do not invent a palette. Do not edit `src/styles.css`. CSS Modules stay allowed (built into Vite).
- **A7** holds. `lucide-react` and `motion` are already installed and may be used (no new deps).
- **A9** now known: Azure SWA Free, manual `swa deploy ./dist`. The build is local, so the flag is fixed at build time. No CI.

## 4. Feature flag

- **Name: `FUTURES_EDGE_ENABLED`**, read from the build-time env var **`VITE_FUTURES_EDGE_ENABLED`**.
- **Default: OFF.** Only the exact string `"true"` turns it on (`parseFeatureFlag` in `contracts/feature-flag.ts`).
- When OFF, the host app does not register `/learn/futures-edge/*` routes (direct hits show the host 404 / "not available"), and no lesson chunk is loaded.
- Local dev / tests enable it explicitly: `VITE_FUTURES_EDGE_ENABLED=true npm run dev`.
- Only EDGE-11 may change a deployment's flag value, and only with explicit user authorization.
- **Updated after audit v2:** the host has no env usage today. Azure SWA serves a prebuilt `dist/`, so **SWA app settings cannot set this flag**. It is set by the shell env at `npm run build` (`VITE_FUTURES_EDGE_ENABLED=true npm run build`). `.env*` is gitignored. The Dockerfile has no `ARG`, so Docker builds are always OFF. With the flag OFF, `/learn/futures-edge` renders the landing page (200), because the host has no 404 view. In the host, compare `import.meta.env.VITE_FUTURES_EDGE_ENABLED === "true"` inline so the lazy chunk can be dropped (EDGE-01 to verify in `dist/`).

## 5. Module layout (target repo paths)

> **Updated after audit v2:** the module moves under **`src/`** because `tsconfig.json` has `include: ["src"]` and `@` → `./src`.
> Every `features/futures-edge/…` path in this document and in ownership/bot-briefs now means **`src/features/futures-edge/…`**.
> There is no host scaffold. The real host files (`package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/App.tsx`, `src/main.tsx`,
> `src/components/**`, `src/lib/**`, `src/styles.css`, `public/**`, `Dockerfile`, `nginx.conf`) already exist. EDGE-01 may only make the small
> listed integration diffs (audit-v2 §5). D-10 alias target: `@futures-edge/<module>` → `src/features/futures-edge/<module>/index.ts`.
>
> ```
> xora_website/ (main @ 30af249b)
> ├─ package.json, package-lock.json, tsconfig.json, vite.config.ts, index.html   existing host (EDGE-01 small approved diffs only)
> ├─ src/main.tsx, src/App.tsx (mount point), src/styles.css (tokens; read-only), src/lib/content.ts (LINKS), src/components/** (host)
> ├─ src/features/futures-edge/{index.ts, contracts/, platform/, content/, motion/, simulation/, assessment/, qa/}
> ├─ public/ (host; staticwebapp.config.json needs no change)   Dockerfile, nginx.conf (host)
> ├─ tests/e2e/futures-edge/ (EDGE-10, if Playwright approved)
> └─ docs/futures-edge/ (EDGE-00/10/11)
> ```

**v1 layout (superseded paths, kept for history):**

```
xora_website/
├─ package.json, package-lock.json, tsconfig*.json, vite.config.ts, index.html,
│  eslint.config.js, .prettierrc, vitest.config.ts, playwright.config.ts      EDGE-01 (host scaffold)
├─ src/                          EDGE-01  minimal host app: main.tsx, App.tsx, router.tsx (mounts the module behind the flag)
├─ public/                       EDGE-01
├─ features/futures-edge/
│  ├─ contracts/                 EDGE-00  frozen types + validators (this package)
│  ├─ platform/                  EDGE-01  shell, routes, layout, content loader + lesson registry,
│  │                                       flag resolver, theme tokens, glossary UI, i18n runtime, adapters (auth/route)
│  ├─ content/
│  │  ├─ index.ts                EDGE-01  lazy lesson registry: T01..T23 -> dynamic import of phase-0N/Tnn/lesson.ts
│  │  ├─ phase-01/T01..T04/      EDGE-02
│  │  ├─ phase-02/T05..T09/      EDGE-03
│  │  ├─ phase-03/T10..T13/      EDGE-04
│  │  ├─ phase-04/T14..T18/      EDGE-05
│  │  └─ phase-05/T19..T23/      EDGE-06
│  ├─ motion/                    EDGE-07  scene registry + scene renderers + playback controls
│  ├─ simulation/                EDGE-08  math/ (pure), fixtures/ (shared), widgets/, fixture provider
│  ├─ assessment/                EDGE-09  quiz runner, grader, checkpoints/ (CP1, CPA, CPB), progress adapters
│  └─ qa/                        EDGE-10  content validation runner, boundary checks, a11y helpers
├─ tests/e2e/futures-edge/       EDGE-10  Playwright specs (T01, T14, T23, checkpoints)
└─ docs/futures-edge/            EDGE-00  architecture.md, task-board.md, ownership.md, bot-briefs.md, issue-log.md
   ├─ qa/                        EDGE-10  QA reports + screenshots
   └─ release/                   EDGE-11  release report, rollback plan, changed-file list
```

Each lesson directory holds `lesson.ts` (`export default` a `Lesson`), optional split files (`slides.ts`, `notes.ts`,
`quiz.ts`, `exercises.ts`) and optional **lesson-local fixtures** `fixtures.ts` (`export const fixtures: Fixture[]`,
ids `FX-Tnn-…`). EDGE-08's fixture provider combines shared and lesson-local fixtures.

Dependency direction (an import lint rule enforces this; EDGE-10 checks it):
```
contracts  <-  content (data only; may import contracts ONLY)
contracts  <-  simulation, motion, assessment   (may import contracts; never import each other's private files,
                                                 only each module's documented index.ts)
contracts, motion, simulation, assessment, content/index  <-  platform  <-  src/ (host)
```
- `content/**` must not import React, UI, or any runtime module, only `contracts`.
- No module under `features/futures-edge/` may make network calls (`fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, axios) in v1.

## 6. Forbidden zone (must not be modified, imported or called)

> **Updated after audit v2:** at `main` @ `30af249b`, `rg` finds **no** trading, exchange, WebSocket or network code (no `fetch`, `axios`, `wss://`, `import.meta.env`, `localStorage`). "Binance" appears only as marketing copy in `src/lib/content.ts`. Charts are decorative seeded SVG (`src/lib/series.ts`). **New forbidden paths (host-owned; no bot edits them except EDGE-01's listed integration diffs and EDGE-11 wiring fixes):** `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/lib/**`, `src/components/**`, `index.html`, `public/**` (incl. `public/brand/**`, `public/fonts/**`, `public/staticwebapp.config.json`), `Dockerfile`, `nginx.conf`, `README.md`, `.gitignore`, `package.json`/lockfile/`tsconfig.json`/`vite.config.ts` (EDGE-01 approved changes + EDGE-11 only). Never run the SWA deploy or read its deployment token. The module must not import host internals except `BrandLockup` (via EDGE-01's platform layout). The boundary commands below now target `src/features/futures-edge` instead of `features/futures-edge`.

**Inside `xora_website`:** no trading, Binance, WebSocket, execution or decision-engine code exists at the audited commit (F7).
So the forbidden zone here is **preventive**:
- `README.md` (existing file): leave it alone unless the user asks for a change.
- Any path outside your own owned paths (see ownership.md).
- If a future merge from `main` brings in trading/exchange code, its paths become forbidden right away. EDGE-00 adds them here.

**Sibling repos: out of scope, never modify, never import, never call their endpoints:**
- `admin-xtinex/xora` (whole repo; the mobile/trading app, including its `src/`, `android/`, `scripts/`, `.github/`, trading/prediction/price-sync engines)
- `admin-xtinex/trading_bot`, `admin-xtinex/trading_bot_app`, `admin-xtinex/trading_bot_old_tbd`
- `admin-xtinex/xora_trade_ai`, `admin-xtinex/xora_chart_ai`, `admin-xtinex/xora_intelligence_ai`

**Forbidden capabilities anywhere in the module:** real exchange orders; Binance/exchange REST or WebSocket endpoints
(`*.binance.com`, `fapi.*`, `stream.binance.*`, `wss://`); exchange SDKs (`ccxt`, `@binance/*`, `binance-api-node`,
`node-binance-api`); fields that collect API keys/secrets, passwords, OTPs, deposits or wallet addresses; any network I/O in v1.

**Boundary check (run before every merge; expected result: no output, exit code 1):**
```bash
rg -n -i --glob '!**/content/**' -e 'binance\.com' -e 'binance\.(us|vision)' -e 'fapi\.' -e 'stream\.binance' \
   -e 'wss?://' -e 'ccxt' -e '@binance/' -e 'binance-api' -e 'node-binance' -e 'apiSecret' -e 'api[_-]?key' \
   -e 'secret[_-]?key' src          # Updated after audit v2: src/ covers src/features/futures-edge
rg -n -e '\bfetch\(' -e 'XMLHttpRequest' -e 'new WebSocket' -e 'EventSource' -e 'axios' src/features/futures-edge
rg -n -e 'https?://' src/features/futures-edge/content      # content must not embed live URLs (review any hit)
```
(Verified working on the contracts folder: both of the first two commands returned exit 1, no matches.)
Content may name "Binance" as an educational example. It may not link to or embed Binance assets/logos (rights unverified).

## 7. Shared contracts (frozen; current v1.3.0)

Location: `features/futures-edge/contracts/` (staged at `/workspace/futures-edge/docs/contracts/`), **v1.3.0**, imported via `@futures-edge/contracts` (D-10). See its README, CHANGELOG and `decisions.md`.
Deviations from the blueprint sketch, all deliberate:
- `Lesson.exercises: Exercise[]` is inlined. The blueprint's `exerciseRefs[]` are the exercise ids. One source of truth per lesson author.
- Lesson also has `schemaVersion`, `difficulty`, `reviewCard`, `completionRequirements`, `fictionalDataNotice`, `notesComplexity` (master prompt §3A/§3H).
- `Question` uses the blueprint fields (`rationale`, `misconceptionFeedback`, `safetyCritical`) plus `safetyTopic`, `learningOutcome`, `linkedLessonId`, `cognitiveTag`, `remediationRef`.
- `Progress` keeps the blueprint fields and tracks `viewed` / `practiced` / `assessed` separately, plus `educationOnly: true`.
- Checkpoints: **CP1** (after T04, 8 items, non-gating), **CPA** (after T13, 20–25 items), **CPB** (after T23, 20–25 + 5 applied).

## 8. Merge policy

1. **Integration branch:** `feature/futures-edge`. **`main` is never touched** without explicit user authorization (EDGE-11 handoff only).
2. One branch per bot: `futures-edge/edge-XX-<slug>`, created from `feature/futures-edge` (see ownership.md). No shared simultaneous writes.
3. Merge order:
   1. EDGE-00 contracts + docs (`futures-edge/edge-00-mission-control`) → first.
   2. EDGE-01 **scaffold-only PR** (package.json, configs, `src/`, empty `platform/` + `content/index.ts` registry) → second, as early as possible. Everyone then rebases onto it to get `npm run test` etc.
   3. Wave 1 PRs (EDGE-01 shell, 07, 08, 09, 05-T14) in any order once green.
   4. Wave 2 content PRs, one PR per phase (or per lesson).
   5. Wave 3 fixes by owners; EDGE-10 test PRs.
   6. EDGE-11 final integration + release report.
4. **Only EDGE-11 merges into `feature/futures-edge`.** Bots open PRs; they do not merge.
5. A PR is rejected if it: changes a path the bot does not own (`git diff --name-only feature/futures-edge...HEAD` must stay inside its owned paths); changes `features/futures-edge/contracts/` (unless it is EDGE-00's); fails any gate in §9; has placeholder content.
6. Rebase-then-merge (no force-push to `feature/futures-edge`). Conflicts are resolved by the owner of the conflicting path. EDGE-11 does only minimal wiring fixes.
7. Contract change requests follow `contracts/README.md` → "Change process".
8. `package.json` / lockfile: only EDGE-01 (scaffold) and EDGE-11 (integration) edit them. Other bots ask for dependencies in their handoff. Default answer: no new runtime dependencies.

## 9. Quality gates (per PR, and at integration)

| Gate | Command (after EDGE-01 scaffold) | Status now |
|---|---|---|
| Install | `npm ci` | not available yet (no package.json) |
| Typecheck | `npm run typecheck` → `tsc --noEmit -p tsconfig.json` (strict) | contracts only: verified (§11) |
| Lint | `npm run lint` → `eslint .` (includes import-boundary rules) | not available yet |
| Unit/integration | `npm run test` → `vitest run` | not available yet |
| Content validation | `npm run validate:content` → `tsx features/futures-edge/qa/validate-content.ts` (calls `validateCourse`) | contracts self-test verified (§11) |
| Boundary | the `rg` commands in §6 (no matches) | verified on contracts |
| E2E + a11y | `npm run test:e2e` → `playwright test tests/e2e/futures-edge` (T01, T14, T23, CP1/CPA/CPB, axe scan, 320 px + desktop) | not available yet |
| Build | `npm run build` → `vite build` (flag off) **and** `VITE_FUTURES_EDGE_ENABLED=true npm run build` | not available yet |
| Content gate | lesson accept/reject checklist (blueprint §7): slides, notes, definitions, captions, real animation, working interaction, quiz feedback, tested integration | per lesson, EDGE-10 |

Rule: nobody reports a gate as passed unless they ran it and attach the command plus output summary.

> **Updated after audit v2, real gate status on `main` @ `30af249b`:** `npm ci` exists and passed (exit 0, 0 vulnerabilities).
> `npm run typecheck` = `tsc --noEmit` (TS 7.0.2) exists. `npm run build` = `tsc --noEmit && vite build` exists and passed (exit 0).
> `npm run dev` (port 5180) and `npm run preview` (port 5181) exist. **`lint`, `test`, `test:e2e`, `validate:content` do not exist.** They need approved devDependencies (audit-v2 D-v2-3).
> **Known blocker:** the frozen contracts fail the repo's `noUnusedLocals` (`contracts/src/validation.ts:12` unused `type Slide`) → contract patch v1.0.1 needed before they are imported from `src/`.

## 10. Open decisions for the user

- **D1 Stack:** OK to build this as a new Vite + React 18 + TypeScript site in `xora_website` (A1)? Or should the learning area live inside the `admin-xtinex/xora` Expo app (served at `/app`?)? The contracts work either way, but the shell (EDGE-01) depends on this answer.
- **D2 Committing EDGE-00 output:** these docs and contracts are only on the box. Someone has to push them to `futures-edge/edge-00-mission-control` → `feature/futures-edge` (that needs your approval) before Wave 1 starts. Also: who creates the 12 bot branches (listed in ownership.md)?
- **D3 Hosting/deploy:** where is xora.xtinex.com hosted, and should this repo eventually serve it (CNAME)? The live site was unreachable from the audit box.
- **D4 Brand tokens:** colours/typography/logo for XORA web. Until then we use a provisional cyan/violet-on-dark token set, scoped to `.fe-root`.
- **D5 Animation length:** DECIDED (decisions.md D-05): warn outside 90–360 s, target 180–360 s.
- **D6 Pass threshold:** DECIDED (D-06): 0.8, configurable.
- Per-bot branches: APPROVED (D-02). All v1.1 contract decisions: see `decisions.md`.

> **Updated after audit v2, decisions:** D1 is largely answered (the site is a Vite/React 19 app in `xora_website`; confirm `/learn/futures-edge` there = D-v2-1). D3 is answered (Azure SWA Free, manual CLI deploy; Docker alternative). D4 is answered (host tokens; only semantic up/down/warn colours open = D-v2-5). New: D-v2-2 router, D-v2-3 test/lint devDeps, D-v2-4 preview copy, D-v2-6 preview deploys. Required action: fast-forward `feature/futures-edge` → `30af249b`. See `audit-v2.md` §8.

## 11. Verified commands (actually run on the box, 19 Oct 2026 IST)

```bash
cd /workspace/futures-edge/docs/contracts
npx -y -p typescript@5.9.3 tsc -p tsconfig.json                     # exit 0 (strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes; src + selftest)
npx -y -p typescript@5.9.3 tsc --noEmit --strict --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022 src/*.ts   # exit 0
npx -y tsx selftest/run.ts                                          # "23 passed, 0 failed", exit 0
```
No app build/lint/test/E2E commands exist yet, so none were run.

**Updated after audit v2:** run 19 Oct 2026 ~07:50 to 07:55 IST in `/workspace/tmp/xora_website_audit` (codeload tarball of `main` @ `30af249b`, Node v20.19.2):
```bash
npm ci              # exit 0, 47 packages added, 0 vulnerabilities
npm run build       # exit 0, vite 8.3.4, JS 406.80 kB (gzip 129.64), CSS 39.20 kB, built in 282 ms
npx vite preview --port 5181   # /, /learn/futures-edge, /learn/futures-edge/t14 -> 200 index.html
# contracts copied into src/features/futures-edge/contracts (temp), npx tsc --noEmit -> exit 1: validation.ts(12,52) TS6133 unused 'Slide'
# contracts/tsconfig.json with tsc 7.0.2 -> exit 0
```
