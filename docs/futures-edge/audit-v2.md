# XORA Futures Edge: Repo audit v2 (EDGE-00 Mission Control)

- Audit date: **Mon 19 Oct 2026, ~07:48 to 07:56 IST (UTC+5:30)**. Read-only. Nothing was written to GitHub (no clone, push, branch, file, PR or comment).
- Repo: `admin-xtinex/xora_website` (public). Audited commit: **`main` @ `30af249b0b7bcb9faecd7942b5f211d7a531dc16`**
  ("Deploy config for Azure Static Web Apps (Free)", 07:36 IST).
- `feature/futures-edge` still points at `ad7b3b01` (README only). It has no commits of its own and is **8 commits behind `main`**.
  **It must be fast-forwarded to `main` (30af249b) before any bot cuts a branch.** That is a GitHub write, so it needs the user's approval (EDGE-11 or the user does it).
- Sources: `cursor-github` `list_branches`, `list_commits`, `get_git_tree` (recursive, `truncated: false`, 44 files), plus the codeload tarball of `main`
  unpacked to `/workspace/tmp/xora_website_audit`. **The tarball file list matched the git tree exactly (44/44).**
- This audit replaces audit v1 (architecture.md §1–§3). The v1 verdict "repo is empty" **no longer holds**.

## 1. Commit history on `main` (times in IST)

| SHA | Time (IST) | Message |
|---|---|---|
| `ad7b3b01` | 06:07 | Create README.md (the v1 audit base, still the tip of `feature/futures-edge`) |
| `ed1d197f` | 06:26 | Build XORA landing page for xora.xtinex.com (static Vite build, nginx, Dockerfile + /health) |
| `a4e59187` | 06:33 | Hero: losing trades flow through the XORA brain and leave green |
| `933217df` | 06:40 | Hero: animate the XORA artwork instead of the generated video |
| `ab73c1e8` | 06:46 | Hero: animate the artwork itself with a WebGL shader |
| `f06cc7a9` | 06:51 | Hero: more movement in the living artwork |
| `1e3cbd2f` | 07:12 | Hero: the brain loop video, regraded frame by frame |
| `edbba044` | 07:24 | Hero: play the original xora-loop.mp4 as is |
| `30af249b` | 07:36 | Deploy config for Azure Static Web Apps (Free) |

Branch protection: none on `main` or `feature/futures-edge`.

## 2. Verified stack facts (observed, with file paths)

| # | Fact | Evidence |
|---|---|---|
| V1 | **Vite 8 + React 19 + TypeScript 7 (strict) + Tailwind CSS v4 + Motion 14 + lucide-react.** npm with `package-lock.json`. ESM (`"type": "module"`). | `package.json`; installed versions from `node_modules`: vite 8.3.4, react/react-dom 19.3.1, typescript **7.0.2**, tailwindcss + @tailwindcss/vite 4.3.3, @vitejs/plugin-react 6.1.2, motion 14.3.0, lucide-react 1.59.0 |
| V2 | Scripts: `dev` = `vite --host 0.0.0.0 --port 5180`, `build` = `tsc --noEmit && vite build`, `preview` = `vite preview --port 5181`, `typecheck` = `tsc --noEmit`. **No `test`, `lint`, `format` or `e2e` script.** | `package.json` |
| V3 | Runtime deps: only `react`, `react-dom`, `motion`, `lucide-react`. **No router, no state lib, no chart lib, no i18n, no fetch/HTTP client, no test framework, no ESLint/Prettier.** | `package.json`, `node_modules` listing (47 packages) |
| V4 | `tsconfig.json`: target ES2022, lib ES2022+DOM, `moduleResolution: bundler`, `jsx: react-jsx`, `strict`, **`noUnusedLocals`, `noUnusedParameters`**, `isolatedModules`, `noEmit`, `types: ["vite/client"]`, `paths: {"@/*": ["./src/*"]}`, **`include: ["src"]`**. No `noUncheckedIndexedAccess` or `exactOptionalPropertyTypes`. One tsconfig, no project references. | `tsconfig.json` |
| V5 | `vite.config.ts`: plugins `react()`, `tailwindcss()`; alias `@` → `./src`. No `base`, no `define`, no `envPrefix` (default `VITE_`), no test config. | `vite.config.ts` |
| V6 | Layout: `index.html` → `src/main.tsx` (StrictMode + `<App/>`, imports `styles.css`) → `src/App.tsx`. Sections, one file each, in `src/components/`: `Header`, `HeroSection` (+`HeroScene`, `OverviewDialog`), `ValueSection`, `FuturesEdgeSection`, `JourneySection`, `IntelligenceShowcaseSection`, `DifferenceSection`, `TrustNoticeSection`, `FinalCTASection`, `Footer`. Shared UI in `src/components/ui/` (`Icon`, `MagneticButton`, `Reveal`, `SectionHeading`, `Sparkline`, `SpotlightCard`). All copy and links in `src/lib/content.ts`. Helpers `src/lib/utils.ts` (`cn`, `scrollToId`), `src/lib/series.ts` (seeded decorative data). | tree |
| V7 | **Routing: none. It is a single page.** `App.tsx` always renders every section and ignores `location.pathname`. Navigation is hash anchors (`#home`, `#what`, `#futures-edge`, `#journey`, `#intelligence`, `#about`, `#trust`, `#start`) via `scrollToId()` plus a scroll-spy in `Header.tsx`. `MagneticButton` smooth-scrolls only for `#…` hrefs. Any other href is a normal `<a>` navigation. | `src/App.tsx`, `src/components/Header.tsx`, `src/components/ui/MagneticButton.tsx`, `src/lib/utils.ts` |
| V8 | Styling: **one global stylesheet `src/styles.css` (2 094 lines)**: `@import "tailwindcss"`, an `@theme` token block, `:root` vars, `@font-face`, then semantic global classes (`.section`, `.container`, `.glass`, `.btn`, `.btn-primary`, `.edge-*`, `.kicker`, `.section-title`, `.text-gradient`, …). Tailwind utility classes are barely used. **No CSS Modules.** One `@media (prefers-reduced-motion: reduce)` block (line ~2083). Header height var `--header-h: 76px`. | `src/styles.css` |
| V9 | **Brand tokens** ("mirror the xtinex.com theme"), `@theme`: `--color-void #02030a`, `--color-ink #070814`, `--color-fg #eef1f7`, `--color-muted #b4bccb`, `--color-faint #6b7489`, `--color-cyan #3ecbff`, `--color-blue #4f8ef7`, `--color-violet #a855f7`, `--color-magenta #d946ef`, `--color-line rgba(238,241,247,.1)`; `:root`: `--ease cubic-bezier(.16,1,.3,1)`, `--grad-brand` (cyan→blue→violet→magenta), `--grad-btn` (#7c3aed→#6d4bff→#4f8ef7), `--glass-bg`, `--glass-border rgba(130,160,255,.14)`, `color-scheme: dark`. **Fonts:** `--font-display` "Outfit", `--font-sans` "Manrope", self-hosted `public/fonts/outfit.woff2`, `public/fonts/manrope.woff2` (weights 400–700, `font-display: swap`, preloaded in `index.html`). | `src/styles.css` l.1–40, `index.html` |
| V10 | **"Futures Edge learning preview"** = `src/components/FuturesEdgeSection.tsx`, `<section id="futures-edge">`. Copy is in `EDGE` in `src/lib/content.ts`: kicker/title/sub/body, 8 topic chips, flow `Learn → Understand → Practice → Qualify`, and a **mock progress card with 7 hard-coded modules** (1 "done", 1 "active", 5 "locked"; shows "14% · 1 of 7 modules completed"). This is static marketing data, not a course system. **Its CTA "Start Futures Edge" links to `LINKS.getStarted` = `"#start"`** (the final CTA section on the same page). `content.ts` says: *"In-page anchors until the Futures Edge app / sign-up routes are public."* Header NAV "Futures Edge" → `#futures-edge`. Footer group "Futures Edge" → `#futures-edge`, `#journey`, `#intelligence`, `#trust`. | `src/components/FuturesEdgeSection.tsx`, `src/lib/content.ts` (`LINKS`, `NAV`, `EDGE`, `FOOTER`) |
| V11 | **Env / feature flags: none.** No `import.meta.env` use anywhere in `src/`, no `.env*` file. **`.gitignore` ignores `.env*`**, so no committed `.env.production` is possible without changing `.gitignore`. | `rg import.meta.env src` (no hits), `.gitignore` |
| V12 | Auth: none. Storage: none (no `localStorage`/`sessionStorage`). i18n: none (`<html lang="en">`, English strings in `content.ts`). | `rg` over `src/` |
| V13 | **Azure SWA config** `public/staticwebapp.config.json` (copied into `dist/` by Vite; verified present in `dist/`): `navigationFallback.rewrite = "/index.html"`, `exclude = ["/assets/*", "/brand/*", "/fonts/*"]`; cache-header routes for those three; global headers `X-Content-Type-Options: nosniff` and `Referrer-Policy`; MIME types for webp/woff2/mp4. **`/learn/*` is not excluded, so deep links such as `/learn/futures-edge/t14` are rewritten to `index.html`. SPA deep links work on SWA with no config change** (by config reading; the live SWA was not requested). | `public/staticwebapp.config.json` |
| V14 | Deploy (README): SWA **Free** plan, `xora-website` in `rg-xora-web` (East Asia), `https://gentle-stone-0d854db00.2.azurestaticapps.net`. Manual deploy from a dev machine: `npm run build` then `npx @azure/static-web-apps-cli@2 deploy ./dist --env production --deployment-token …`. **The build runs locally, before upload.** | `README.md` |
| V15 | Alternative deploy: `Dockerfile` (node:22-alpine build with `npm ci` + `npm run build`, then nginx:1.27-alpine, port 80, HEALTHCHECK `/health`) and `nginx.conf` (`location /` → `try_files $uri $uri/ /index.html`, so SPA deep links work; `/health` returns 200 "OK"; long cache for `/assets/`). **No `ARG`/`ENV` for `VITE_*`, so Docker builds always have the flag OFF.** | `Dockerfile`, `nginx.conf` |
| V16 | **CI: none.** No `.github/` directory. No workflows, no SWA GitHub Action. | git tree |
| V17 | Assets: `public/brand/` (`favicon-64.png`, `logo.svg`, `xora-hero.webp`, `xora-loop-poster.webp`, `xora-loop.mp4`, `xora-plate.webp`, `xora-scene.webp`, `xtinex-x.png`), `public/fonts/` (2 woff2). `BrandLockup` is exported from `src/components/Header.tsx`. | tree |
| V18 | **Forbidden-zone scan: no trading, Binance API, WebSocket, exchange or network code.** `rg -i 'fetch\(|websocket|wss://|axios|XMLHttpRequest|sendBeacon|import\.meta\.env|localStorage'` over `src/` and `index.html` gives no hits. The only URLs are `https://www.xtinex.com…` links, `mailto:` and og/meta tags. "Binance" appears only as marketing copy in `content.ts` (`"Binance basics"`, module "Binance Futures Basics"). Charts and tickers are decorative and seeded (`src/lib/series.ts`: "Deterministic pseudo-market data … (no live data)"; `IntelligenceShowcaseSection.tsx`, `ui/Sparkline.tsx`). | `rg` |
| V19 | Accessibility patterns to reuse: skip link (`.skip-link` → `#what`), `MotionConfig reducedMotion="user"`, HeroScene stops for `prefers-reduced-motion` and Save-Data, `aria-labelledby` on sections. | `src/App.tsx`, `src/components/HeroScene.tsx` |
| V20 | Bundle today: one JS chunk `index-*.js` 406.80 kB (gzip 129.64 kB), CSS 39.20 kB (gzip 9.70 kB). No code splitting yet. | `npm run build` output (§6) |
| V21 | **Frozen contracts vs repo compiler settings:** dropped into `src/features/futures-edge/contracts/` (temp copy only), `npm run typecheck` (tsc 7.0.2) **fails with one error**: `contracts/src/validation.ts(12,52): error TS6133: 'Slide' is declared but its value is never read.` (repo has `noUnusedLocals`). The contracts' own `tsconfig.json` passes under TS 7.0.2 (exit 0). | §6 commands |

## 3. Earlier assumptions (architecture.md §3) vs verified reality

| v1 # | v1 assumption | Verdict | Change |
|---|---|---|---|
| A1 | Vite + React **18** + TS strict + npm; EDGE-01 creates the scaffold | **Partly holds, must change** | Stack exists: **Vite 8 + React 19 + TS 7.0.2** + npm. **EDGE-01 does NOT scaffold a host.** It integrates into the existing app. React 19 matters for libraries (e.g. Testing Library ≥16). TS 7 matters for tooling (typescript-eslint, tsx). D1 is mostly answered by the user's push: the learning area lives in `xora_website`. |
| A2 | Vitest + Testing Library + Playwright + axe; ESLint flat + typescript-eslint; Prettier | **Absent, still a proposal** | The repo has none of these. Adding them = new devDependencies + new scripts (EDGE-01, approval D-v2-3). **Compatibility of Vitest / typescript-eslint with Vite 8 + TS 7 is UNVERIFIED** and EDGE-01 must check it at install time. Fallback if typescript-eslint cannot run on TS 7: keep `tsc --noEmit` + the `rg` boundary script as the boundary gate. |
| A3 | react-router v6, base `/learn/futures-edge` | **Must change** | No router exists, and the site is a hash-anchor single page. Proposal: **no new router dependency for the host.** Mount by pathname in `src/App.tsx` (see §4.1). Inside the module, EDGE-01 uses a small History-API route adapter in `platform/` (routes: course home, `t01…t23`, `checkpoint/cp1|cpa|cpb`). react-router v7 stays an option only if the user approves a dependency. `ROUTE_BASE = /learn/futures-edge` holds. SWA and nginx fallbacks already serve it. |
| A4 | No auth; anonymous learner | **Holds** (verified: no auth in repo) | none |
| A5 | localStorage local-demo progress adapter | **Holds** (no storage exists to conflict with) | Key prefix `xora.futuresEdge.v1.progress.` is free. |
| A6 | CSS Modules + tokens under `.fe-root`, provisional cyan/violet palette (D4) | **Must change (tokens), CSS Modules optional** | Real brand tokens exist (V9). `.fe-root` tokens must **alias the host vars** (`--fe-bg: var(--color-void)`, `--fe-fg: var(--color-fg)`, `--fe-accent: var(--color-cyan)`, `--fe-accent-2: var(--color-violet)`, fonts `var(--font-sans)` / `var(--font-display)`, `--fe-ease: var(--ease)`). Do not copy hex values. Vite supports `*.module.css` with no new dependency, so CSS Modules stay allowed for the module. Tailwind v4 utilities are also available, but the host style is semantic classes. **Do not edit `src/styles.css`.** Do not use the host's global classes either (`.section`, `.btn`, …); they are host internals and can change. D4 is answered except for success/warning/danger colours for PnL/risk visuals (the host has none; D-v2-5). |
| A7 | No UI/chart libs; local SVG/Canvas | **Holds** (host also draws charts as SVG with no library) | `lucide-react` icons and `motion` are already installed. The module **may** use them (no new deps). EDGE-07 must still give every scene a `prefers-reduced-motion` path (motion's `MotionConfig reducedMotion="user"` already wraps the landing page, but **not** a separately mounted tree). |
| A8 | No i18n lib | **Holds** | none |
| A9 | Deploy unknown | **Now known** | Azure SWA Free, manual CLI deploy of a locally built `dist/` (V14). Docker/nginx image is an alternative (V15). No CI. |
| A10 | Plain TS validators | **Holds** | One contract fix needed for `noUnusedLocals` (V21, §8). |
| §4 flag | `VITE_FUTURES_EDGE_ENABLED`, default OFF | **Holds and fits** | Vite exposes `VITE_*` at build time. **SWA app settings do NOT reach a static front end.** The flag is fixed when `npm run build` runs on the deploying machine. See §4.3. |
| §5 layout | `features/futures-edge/` at repo root | **Must change** | `tsconfig.include` is `["src"]` and the `@` alias is `./src`. Put the module at **`src/features/futures-edge/`** (§5) so `npm run build`'s `tsc --noEmit` checks it and existing aliases apply. |
| §6 forbidden | Preventive only | **Holds, now with real host files** | See §7. |
| §9 gates | Commands proposed | **Partly real** | `npm ci`, `npm run typecheck`, `npm run build` now exist and were run (§6). `lint`, `test`, `test:e2e`, `validate:content` still do not exist. |
| decisions.md D-10 | Alias `@futures-edge/<module>` → `features/futures-edge/<module>/index.ts` | **Holds with a new target** | Target becomes `src/features/futures-edge/<module>/index.ts`. Wire it in both `tsconfig.json` `paths` and `vite.config.ts` `resolve.alias` (EDGE-01 edits both, host files). |

## 4. Recommended integration points

### 4.1 Route mounting (EDGE-01, smallest host diff)
`src/App.tsx` (host file, minimal edit) or `src/main.tsx`:
```tsx
// Flag is compared inline so Vite can statically replace it and drop the lazy import when OFF.
const FE_ON = import.meta.env.VITE_FUTURES_EDGE_ENABLED === "true";
const FuturesEdgeApp = FE_ON ? lazy(() => import("@/features/futures-edge")) : null;
const isLearn = (p: string) => p === "/learn/futures-edge" || p.startsWith("/learn/futures-edge/");
// if (FuturesEdgeApp && isLearn(location.pathname)) render <Suspense><FuturesEdgeApp/></Suspense>
// else render the existing landing tree unchanged.
```
- The module renders its own layout: a slim header that reuses `BrandLockup` (exported from `src/components/Header.tsx`) plus a "Back to XORA" link to `/#futures-edge`. **Do not reuse the landing `Header`.** Its links call `scrollToId()`, which silently does nothing when the sections are not on the page.
- Wrap the module tree in `<MotionConfig reducedMotion="user">` (the landing wrapper does not cover a separate tree).
- **Flag OFF behaviour, verified gap:** today, any unknown path (including `/learn/futures-edge`) returns 200 and renders the **landing page** (no 404 view exists; SWA and nginx rewrite to `index.html`). With the flag OFF the URL keeps rendering the landing page, which is acceptable and safe. Optionally, EDGE-01 can scroll to `#futures-edge`.
- Whether the lazy chunk is fully removed from `dist/` with the flag OFF is **not yet verified**. EDGE-01 must check `dist/assets` after an OFF build. The `parseFeatureFlag()` contract helper can be used inside the module. For dead-code elimination, the host should use the inline comparison shown above.
- Set `document.title` per lesson inside the module (`index.html` has one static title).
- Navigation between landing and course is a normal full-page `<a href>`. That is fine because both are the same `index.html`.

### 4.2 Link from the preview section (EDGE-01, flag-gated, host copy file)
- `src/lib/content.ts`: add `LINKS.futuresEdgeCourse = import.meta.env.VITE_FUTURES_EDGE_ENABLED === "true" ? "/learn/futures-edge" : "#start"`.
- `src/components/FuturesEdgeSection.tsx`: point the "Start Futures Edge" `MagneticButton` at `LINKS.futuresEdgeCourse`. `MagneticButton` already treats a non-`#` href as a normal link.
- Optional (user's call): footer "Futures Edge → Learning Path" to the course when the flag is ON.
- **Do not** change the mock 7-module progress card without the user's decision (D-v2-4). It currently shows fake progress and a module list that does not match the 23-lesson / 5-phase syllabus.

### 4.3 Feature flag compatible with Vite env + Azure SWA
- Name and default unchanged: `VITE_FUTURES_EDGE_ENABLED`, OFF unless exactly `"true"`.
- Dev: `VITE_FUTURES_EDGE_ENABLED=true npm run dev` or a local, uncommitted `.env.local` (`.env*` is gitignored).
- SWA deploy (current method): the flag is baked at build time on the deploying machine. Preview build: `VITE_FUTURES_EDGE_ENABLED=true npm run build`. A plain `npm run build` ships it OFF. **Do not use SWA application settings for this.** They only reach SWA managed Functions, and this site has no API.
- Docker: add `ARG VITE_FUTURES_EDGE_ENABLED=false` + `ENV …` before `RUN npm run build` only if the user wants Docker builds with the flag ON (EDGE-11, approval needed). Without it, Docker is always OFF (safe).
- Add `src/vite-env.d.ts` (or the module's own `env.d.ts`) declaring `ImportMetaEnv.VITE_FUTURES_EDGE_ENABLED?: string`. `types: ["vite/client"]` is already set.
- `staticwebapp.config.json`: **no change needed** for `/learn/*`. If the course later ships its own static assets under a public path, add that path to `navigationFallback.exclude` (EDGE-11).

## 5. Exact repo paths (under the real `src/` layout)

```
src/features/futures-edge/
├─ index.ts                      EDGE-01  module entry: default export <FuturesEdgeApp/> (lazy-loaded by src/App.tsx)
├─ contracts/                    EDGE-00  frozen v1.0.x (index.ts barrel, src/*, selftest/*, tsconfig.json, README.md)
├─ platform/                     EDGE-01  layout, route adapter (History API), flag resolver, theme (.fe-root tokens aliasing host vars), glossary UI, adapters
├─ content/index.ts              EDGE-01  lazy lesson registry
├─ content/phase-01/T01..T04/    EDGE-02
├─ content/phase-02/T05..T09/    EDGE-03
├─ content/phase-03/T10..T13/    EDGE-04
├─ content/phase-04/T14..T18/    EDGE-05
├─ content/phase-05/T19..T23/    EDGE-06
├─ motion/                       EDGE-07
├─ simulation/                   EDGE-08
├─ assessment/                   EDGE-09
└─ qa/                           EDGE-10
tests/e2e/futures-edge/          EDGE-10  (outside src; needs its own tsconfig if Playwright is approved)
docs/futures-edge/               EDGE-00 / EDGE-10 qa/ / EDGE-11 release/  (repo root; not built)
```
Host files the integration touches (EDGE-01 only, small and listed diffs): `src/App.tsx` (mount), `src/lib/content.ts` (`LINKS.futuresEdgeCourse`), `src/components/FuturesEdgeSection.tsx` (CTA href), `tsconfig.json` + `vite.config.ts` (`@futures-edge/*` alias), `src/vite-env.d.ts` (new), and `package.json`/lockfile **only** for approved devDependencies/scripts.
Import aliases: `@/…` (exists) → `src/…`; `@futures-edge/<module>` (D-10, to add) → `src/features/futures-edge/<module>/index.ts`.

## 6. Commands actually run (box: Node v20.19.2, npm 11.21.0; Vite 8 needs Node ^20.19.0 or >=22.12.0, OK)

All in `/workspace/tmp/xora_website_audit`, unpacked from `https://codeload.github.com/admin-xtinex/xora_website/tar.gz/refs/heads/main` (= tree of `30af249b`, verified 44/44 files).

| Command | Result |
|---|---|
| `npm ci` | **exit 0**. Added 47 packages, audited 48, **0 vulnerabilities**, ~2 s |
| `npm run build` (`tsc --noEmit && vite build`) | **exit 0**. vite v8.3.4, 2353 modules, `dist/index.html` 1.46 kB, `dist/assets/index-BCd7C-7A.css` 39.20 kB (gzip 9.70), `dist/assets/index-BDbfKet8.js` 406.80 kB (gzip 129.64), built in 282 ms. `dist/` contains `staticwebapp.config.json`, `brand/`, `fonts/` |
| `npx vite preview --port 5181` + `curl` | `/`, `/learn/futures-edge`, `/learn/futures-edge/t14` all **200 text/html (index.html)**. Note: vite preview also returns index.html for a missing `/brand/nope.png`. SWA excludes `/brand/*` from fallback, so SWA would 404 (config reading, not run). |
| contracts copied to `src/features/futures-edge/contracts` (temp copy), `npx tsc --noEmit` (TS 7.0.2, repo tsconfig) | **exit 1**: `src/validation.ts(12,52): error TS6133: 'Slide' is declared but its value is never read.` This is the only error. Temp copy removed afterwards. |
| contracts' own `tsconfig.json` with repo `tsc` 7.0.2 | **exit 0** |
| `rg` network/trading scan over `src/`, `index.html` | no hits besides xtinex.com links, mailto and og meta (V18) |

**Not run:** Docker build (no docker on the box), nginx, the live SWA site or xora.xtinex.com, any lint/test (none exist).

Verified commands for bots (today, on `main`):
```bash
npm ci
npm run dev                                   # http://localhost:5180 (flag OFF)
VITE_FUTURES_EDGE_ENABLED=true npm run dev    # flag ON (once EDGE-01 wires it)
npm run typecheck                             # tsc --noEmit (TS 7.0.2)
npm run build                                 # tsc --noEmit && vite build -> dist/
npm run preview                               # http://localhost:5181
```
Still proposals (need EDGE-01 + approval for devDependencies): `npm run test` (Vitest), `npm run lint`, `npm run validate:content`, `npm run test:e2e` (Playwright + axe).

## 7. Forbidden paths and zones

**Host landing files: no bot edits them, except the listed EDGE-01 integration diffs (§5) and EDGE-11 wiring fixes:**
- `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/lib/content.ts`, `src/lib/utils.ts`, `src/lib/series.ts`
- `src/components/**` (all sections incl. `HeroSection.tsx`, `HeroScene.tsx`, `OverviewDialog.tsx`, `IntelligenceShowcaseSection.tsx`, `FuturesEdgeSection.tsx`, `ui/**`)
- `index.html`, `public/**` (incl. `public/brand/**` brand media, `public/fonts/**`, `public/staticwebapp.config.json`)
- `Dockerfile`, `nginx.conf`, `README.md` (deploy notes), `.gitignore`
- `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`: EDGE-01 (approved changes only) and EDGE-11

**Never (anyone):** run the SWA deploy command, read or use the SWA deployment token (`az staticwebapp secrets list`), change Azure resources, add CI workflows that deploy, merge to `main`, or set the flag ON in a production build without explicit user authorization.

**Trading zone:** no trading, exchange, WebSocket or decision-engine code exists in `xora_website` @ `30af249b` (V18). The capability ban still applies: no `*.binance.com`, `fapi.*`, `stream.binance.*`, `wss://`, exchange SDKs (`ccxt`, `@binance/*`, …), API-key/secret/password/OTP/wallet inputs, and no network I/O in the module. The decorative seeded charts (`series.ts`, `IntelligenceShowcaseSection.tsx`, `ui/Sparkline.tsx`) are host-owned. The module must not import them; EDGE-08 keeps its own fixtures. Sibling repos (`xora`, `trading_bot*`, `xora_*_ai`) stay out of scope (architecture.md §6).

Boundary check paths change to `src/features/futures-edge` (see architecture.md §6, updated).

## 8. Actions and decisions needed

1. **Fast-forward `feature/futures-edge` to `main` @ `30af249b`** (GitHub write, approval). Bots must not branch from `ad7b3b01`. Their branches would miss the whole site.
2. **Contract patch v1.0.1 (EDGE-00, contracts owner):** remove the unused `type Slide` import in `contracts/src/validation.ts` line 12. Without it, `npm run build` fails as soon as the contracts are imported from `src/`. This audit did not edit `contracts/src` or `decisions.md`.
3. **D-v2-1 (replaces D1):** confirm the course lives in `xora_website` at `/learn/futures-edge` inside the existing Vite/React 19 app (recommended), not in the `xora` Expo app.
4. **D-v2-2 Router:** a pathname mount + small in-module History router, no new dependency (recommended), or add react-router v7?
5. **D-v2-3 Test/lint tooling:** approve the devDependencies Vitest, @testing-library/react (React 19 compatible version), Playwright + @axe-core/playwright, and optionally ESLint + typescript-eslint. Compatibility with TS 7 / Vite 8 must be verified at install time.
6. **D-v2-4 Preview copy:** keep the landing preview's mock 7-module list and fake "1 of 7 completed" progress, or align it to the 5 phases / 23 lessons once the course exists (copy edit in `content.ts`)?
7. **D-v2-5 Semantic colours:** the host has no success/warning/danger tokens. Approve the module defining `--fe-up`, `--fe-down`, `--fe-warn` (scoped under `.fe-root`) for PnL/risk visuals.
8. **D-v2-6 Preview deploys:** should a flag-ON preview ever go to the SWA (e.g. a SWA preview environment), and who runs it? Default: no deploy.
