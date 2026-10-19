# XORA Futures Edge course section

The `#course` section lists every Futures Edge video (27 in total) as a title card, grouped by
phase. Lessons marked `available` open in a video dialog; lessons marked `locked` are dimmed,
show a "Coming soon" badge and cannot be opened.

| Path | What it is |
|---|---|
| `src/components/futures-edge/courseData.ts` | All 27 lessons: id, phase, title, one-line summary, minutes, `available` / `locked`. The single source of truth. |
| `src/components/futures-edge/CourseCatalog.tsx` | The section: phase groups, lesson cards, lock state, progress bar, video dialog. |
| `src/components/futures-edge/course.css` | Its styles. Every class is prefixed `fe-`; colours come from the `@theme` tokens in `src/styles.css`. |
| `public/futures-edge/cards/<id>.webp` | The title cards, 1280×720. |
| `public/futures-edge/videos/<id>.mp4` | The lesson videos (add them as they are exported). |
| `tools/futures-edge-cards/` | The title-card renderer, with the tutor poses and fonts it uses. |

The section is wired in by `src/App.tsx` (after `FuturesEdgeSection`). It also adds **Course** to
the header navigation (`NAV` in `src/lib/content.ts`), and points "Start Futures Edge" at it.
`public/staticwebapp.config.json` serves `/futures-edge/*` as files instead of rewriting them to
`index.html`.

## Add a video or release a lesson

1. Open the lesson's animation and use **Export** to save an MP4.
2. Save it as `public/futures-edge/videos/<id>.mp4`, for example `T01.mp4`.
3. In `courseData.ts`, set that lesson's `status` to `"available"`.

V00 and T01 are already marked available. Until their MP4 files are added, their dialog says
"This video has not been uploaded yet."

| Video | Animation (Export button) |
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

- **Video hosting size.** 27 MP4s can reach several hundred MB. Check the hosting plan's app-size
  limit (Azure Static Web Apps limits it on the Free plan). If needed, host the videos on blob
  storage or a CDN and change `videoSrc` in `courseData.ts`.
- **Safety.** The section is static: no trading endpoints, no API keys, no account data. It always
  shows "Education and demo practice only. No live trading, no real money."
