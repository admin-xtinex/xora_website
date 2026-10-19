# XORA Futures Edge course section

The course is its own page, **/course** (xora.xtinex.com/course). It lists all 27 Futures Edge lessons as
title cards, grouped by phase. Lessons marked `available` run their web animation in a dialog (no MP4 files); lessons
marked `locked` are dimmed, show a "Coming soon" badge and cannot be opened.

| Path | What it is |
|---|---|
| `src/components/futures-edge/courseData.ts` | All 27 lessons: id, phase, title, one-line summary, minutes, `available` / `locked`. The single source of truth. |
| `src/components/futures-edge/CourseCatalog.tsx` | The section: phase groups, lesson cards, lock state, progress bar, lesson dialog that runs the animation in a frame. |
| `src/components/futures-edge/course.css` | Its styles. Every class is prefixed `fe-`; colours come from the `@theme` tokens in `src/styles.css`. |
| `public/futures-edge/cards/<id>.webp` | The title cards, 1280×720. |
| `public/futures-edge/lessons/<id>.html` | The lesson animations: each one a self-contained HTML page (add them as they are ready). |
| `tools/futures-edge-cards/` | The title-card renderer, with the tutor poses and fonts it uses. |

`src/App.tsx` renders it as the `/course` page (client routing in `src/lib/router.ts`; Azure serves
`/course` through the `navigationFallback` rewrite). **Course** is in the header navigation (`NAV` in
`src/lib/content.ts`), and every Get Started / Start Futures Edge button links to it.
`public/staticwebapp.config.json` serves `/futures-edge/*` as files instead of rewriting them to
`index.html`.

## Release a lesson

1. Save the lesson's animation as one self-contained HTML page (its scripts and styles inline, or
   loaded from a CDN) at `public/futures-edge/lessons/<id>.html`, for example `T01.html`.
2. In `courseData.ts`, set that lesson's `status` to `"available"`.
3. Build and deploy (README, "Azure Static Web Apps").

The dialog checks the page exists before loading it; if it is missing it says "This lesson is not
available yet." All lessons are `locked` until their animation page is added.

| Lesson | Animation source |
|---|---|
| V00 Welcome to XORA Futures Edge | https://claude.ai/artifact/DUwD6iYhioTmvCSUkkVbZy |
| T01 What Is Cryptocurrency? | https://claude.ai/artifact/VARq1etaN7gjD1XSvZWbgk |

## Re-render the title cards

After changing a title or summary in `courseData.ts`:

```bash
node tools/futures-edge-cards/render-cards.mts            # all 27
node tools/futures-edge-cards/render-cards.mts --only T02  # just one
```

Needs Node 22.18+ (it runs TypeScript directly) and Playwright with Chromium. If the
`playwright` package is not installed, set `PLAYWRIGHT_PATH` to it, for example
`npx playwright install chromium` in a scratch folder.

## Notes

- **Hosting size.** Animation pages are small (tens of KB each), so all 27 fit easily within the
  Azure Static Web Apps Free plan's app-size limit.
- **Safety.** The section is static: no trading endpoints, no API keys, no account data. It always
  shows "Education and demo practice only. No live trading, no real money."
