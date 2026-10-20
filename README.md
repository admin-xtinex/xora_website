# xora_website

Landing page for **xora.xtinex.com** — the destination of "Explore XORA" on xtinex.com.

Vite + React 19 + TypeScript + Tailwind v4 + Motion. Static output, no backend.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # typecheck + production build to dist/
```

## Structure

- `src/lib/content.ts` — all page copy and link targets (edit wording here)
- `src/components/` — one file per section: `Header`, `HeroSection`, `ValueSection`,
  `FuturesEdgeSection`, `JourneySection`, `IntelligenceShowcaseSection`, `DifferenceSection`,
  `TrustNoticeSection`, `FinalCTASection`, `Footer`; shared pieces in `components/ui/`
- `src/styles.css` — brand tokens (same palette/fonts as xtinex.com) and section styles
- `src/components/futures-edge/` — the Futures Edge course page (`/course`): title cards, locked lessons,
  lesson dialog. Routing: `src/lib/router.ts`; scroll reveals: `src/lib/seen.ts`. How to add videos and release lessons: `docs/futures-edge-course.md`
- `public/brand/` — reused XTINEX/XORA brand media; the hero plays `xora-flow.mp4` (market-flow brain video, reversed, crossfaded loop)

Charts and tickers on the page are illustrative (seeded data), not live market data.
Animations respect `prefers-reduced-motion`; the hero video stays paused for reduced motion and Save-Data.

## Deploy

`Dockerfile` builds the site and serves `dist/` with nginx on port 80 (`/health` for probes),
the same contract as the xtinex.com website image.

### Automatic deploy (GitHub Actions)

Every push to `main` builds, tests and deploys the site (`.github/workflows/deploy.yml`); it can also be
started from the Actions tab ("Deploy" → "Run workflow"). One-time setup, on a Windows computer signed in to
Azure: run `powershell -ExecutionPolicy Bypass -File .\scripts\setup-deploy-secret.ps1`. It reads the Static
Web App's deployment token with `az` and saves it as the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN`
(with `gh`, or via the clipboard and the GitHub settings page). Until the secret exists, runs build and test
but skip the deploy.

### Azure Static Web Apps (current preview)

Live on the **Free** plan: `xora-website` in resource group `rg-xora-web` (East Asia),
https://gentle-stone-0d854db00.2.azurestaticapps.net. `public/staticwebapp.config.json` sets SPA fallback,
cache headers and MIME types. `.env.production` turns on the interactive course (`/learn/futures-edge`).
Redeploy from this folder:

```bash
npm run build
npx @azure/static-web-apps-cli@2 deploy ./dist --env production \
  --deployment-token "$(az staticwebapp secrets list -n xora-website -g rg-xora-web --query properties.apiKey -o tsv)"
```
