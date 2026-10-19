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
- `public/brand/` — reused XTINEX/XORA brand media; `xora-hero.webp` is the hero artwork that
  `HeroScene` animates with a WebGL shader (red trades → XORA brain → green), falling back to the still image

Charts and tickers on the page are illustrative (seeded data), not live market data.
Animations respect `prefers-reduced-motion`; the hero shader stays off for reduced motion.

## Deploy

`Dockerfile` builds the site and serves `dist/` with nginx on port 80 (`/health` for probes),
the same contract as the xtinex.com website image.
