# XORA Futures Edge course section

The `#course` section lists every Futures Edge video (27 in total) as a title card, grouped by
phase. Lessons marked `available` run their web animation in a dialog (no MP4 files); lessons
marked `locked` are dimmed, show a "Coming soon" badge and cannot be opened.

| Path | What it is |
|---|---|
| `src/components/futures-edge/courseData.ts` | All 27 lessons: id, phase, title, one-line summary, minutes, `available` / `locked`. The single source of truth. |
| `src/components/futures-edge/CourseCatalog.tsx` | The section: phase groups, lesson cards, lock state, progress bar, lesson dialog that runs the animation in a frame. |
| `src/components/futures-edge/course.css` | Its styles. Every class is prefixed `fe-`; colours come from the `@theme` tokens in `src/styles.css`. |
| `public/futures-edge/cards/<id>.webp` | The title cards, 1280×720. |
| `public/futures-edge/lessons/<id>.html` | The lesson animations: each one a self-contained HTML page. Built from `content/`, do not edit by hand. |
| `public/futures-edge/lessons/<id>/` | That lesson's images and fonts, loaded by the page with relative paths. |
| `content/futures-edge/<id>/` | Each lesson's source: scene code, styles, tutor setup, music and narration script (see its README). |
| `tools/futures-edge-lessons/` | The lesson player (`runtime.js`) and the build script that makes the pages from `content/`. |
| `tools/futures-edge-cards/` | The title-card renderer, with the tutor poses and fonts it uses. |

The section is wired in by `src/App.tsx` (after `FuturesEdgeSection`). It also adds **Course** to
the header navigation (`NAV` in `src/lib/content.ts`), and points "Start Futures Edge" at it.
`public/staticwebapp.config.json` serves `/futures-edge/*` as files instead of rewriting them to
`index.html`.

## Release a lesson

1. Add the lesson's source as `content/futures-edge/<id>/` (same layout as `V00` and `T01`).
2. Build its page:
   ```bash
   node tools/futures-edge-lessons/build-lesson.mjs <id>   # or no id to rebuild every lesson
   ```
   This writes `public/futures-edge/lessons/<id>.html` and `public/futures-edge/lessons/<id>/`.
3. In `courseData.ts`, set that lesson's `status` to `"available"`.
4. Build and deploy (README, "Azure Static Web Apps").

To change a lesson that is already out, edit its files in `content/futures-edge/<id>/` and run step 2
again. The dialog checks the page exists before loading it; if it is missing it says "This lesson
is not available yet."

V00 and T01 are available.

### How a lesson page behaves

- It starts playing as soon as it loads, scaled to fill a 16:9 frame (letterboxed in other shapes).
- Browsers block sound until the viewer interacts, so the page shows "Click anywhere for sound".
  The first click turns the music on. After that a click pauses or resumes, and Space does too.
- The control bar has play/pause (replay at the end), a seek bar (arrow keys move 5 s) and a sound
  toggle. It fades out while the lesson plays and the pointer is still.
- It needs no network beyond its own files: no CDN, no fonts from Google, no claude.ai.

| Lesson | Where it was authored (the source of record is now `content/futures-edge/<id>/`) |
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

- **Hosting size.** A lesson page is about 100–120 KB, plus 1.5–2.5 MB of images and fonts in its
  folder (mostly the tutor poses). All 27 lessons come to roughly 50–60 MB. Check this against the
  Azure Static Web Apps plan's app-size limit as lessons are added; the tutor images could later be
  shared between lessons instead of copied into each folder.
- **Safety.** The section is static: no trading endpoints, no API keys, no account data. It always
  shows "Education and demo practice only. No live trading, no real money."
