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
| `public/futures-edge/lessons/<id>.html` | The lesson animations: each one a self-contained HTML page. Built from `content/`, do not edit by hand. |
| `public/futures-edge/lessons/<id>/` | That lesson's images, fonts and voice track (`voice.mp3`), loaded by the page with relative paths. |
| `content/futures-edge/<id>/` | Each lesson's source: scene code, styles, tutor setup, music, narration script and recorded voice lines (see its README). |
| `tools/futures-edge-lessons/` | The lesson player (`runtime.js`) and the build script that makes the pages from `content/`. |
| `tools/futures-edge-cards/` | The title-card renderer, with the tutor poses and fonts it uses. |

`src/App.tsx` renders it as the `/course` page (client routing in `src/lib/router.ts`; Azure serves
`/course` through the `navigationFallback` rewrite). **Course** is in the header navigation (`NAV` in
`src/lib/content.ts`), and every Get Started / Start Futures Edge button links to it.
`public/staticwebapp.config.json` serves `/futures-edge/*` as files instead of rewriting them to
`index.html`.

## Video lessons and the interactive course

The course has two parts that work together:

- **Video lessons, `/course`** (this document): short animated lessons with the brain tutor, captions and
  music. They are the first thing a beginner sees. CP1, CPA and CPB here are short *video recaps*.
- **Interactive course, `/learn/futures-edge`** (`src/features/futures-edge/`, `docs/futures-edge/`): slides,
  notes, exercises, glossary and the graded checkpoint quizzes (CP1 8, CPA 22, CPB 25 questions), with progress
  saved on the device. Each lesson's "Watch animation" tab shows that lesson's video first (any lesson marked
  `available` in `courseData.ts`), then the interactive step-by-step animation.

`/course` links to the interactive course ("Open the interactive lessons"). The interactive course is included
when the build has `VITE_FUTURES_EDGE_ENABLED=true`, which `.env.production` sets for `npm run build`.

## Release a lesson

1. Add the lesson's source as `content/futures-edge/<id>/` (same layout as `V00` and `T01`).
2. Build its page:
   ```bash
   node tools/futures-edge-lessons/build-lesson.mjs <id>   # or no id to rebuild every lesson
   ```
   This writes `public/futures-edge/lessons/<id>.html` and `public/futures-edge/lessons/<id>/`.
   With a `voice/` folder it also mixes the voice track, which needs `ffmpeg` and `ffprobe`.
3. In `courseData.ts`, set that lesson's `status` to `"available"`.
4. Build and deploy (README, "Azure Static Web Apps").

To change a lesson that is already out, edit its files in `content/futures-edge/<id>/` and run step 2
again. The dialog checks the page exists before loading it; if it is missing it says "This lesson
is not available yet."

All 27 are available. V00, T01 (ElevenLabs "Alice") and T09 (Grok "luna") have a voiceover; the rest have subtitles only (no voiceover yet). Every lesson has English and Malayalam subtitles.

### Voiceover

Each line of `modules/narration.json` is recorded as its own file, `content/futures-edge/<id>/voice/NN.mp3`
(`00.mp3` is the first line). V00 and T01 use the ElevenLabs voice **Alice** (`Xb7hH8MSUJpSbSDYk0k2`,
model `eleven_multilingual_v2`, stability 0.5, similarity 0.75, style 0.15). To change a line, edit its
text in `narration.json`, record that one line again with the same voice and settings, save it over its
`NN.mp3`, and rebuild. A new line needs a new number, so add it at the end of its scene or renumber the
files after it.

The build lets the voice set the pace: the lines play 6% faster than recorded, one after another, and
any scene they do not fit in is slowed down until they do (its animation and sound effects stretch by
the same factor; the music is laid out again for the new length). V00 runs about 2:42 and T01 about
5:09 with the voice. The ElevenLabs plan must include commercial use before these recordings go on
the public site.

### How a lesson page behaves

- It starts playing as soon as it loads, scaled to fill a 16:9 frame (letterboxed in other shapes).
- Browsers block sound until the viewer interacts, so the page shows "Click anywhere for sound".
  The first click turns the voice and music on. After that a click pauses or resumes, and Space does too.
  Soft background music plays throughout and dips while the tutor speaks; `S.master({ music })` in
  `score.js` sets its level in dB (V00 +12, T01 +20, which puts it about 15 dB under the voice).
- The control bar has play/pause (replay at the end), a seek bar (arrow keys move 5 s), CC (captions
  of the voiceover, on by default, so the lesson can be followed with the sound off), a sound toggle
  and full screen (F key). It fades out while the lesson plays and the pointer is still.
- Full screen uses the browser's Fullscreen API (desktop, Android, iPad) and turns a phone to
  landscape where the browser allows it. iPhone Safari has no Fullscreen API for pages, so there the
  lesson asks the course page to grow its dialog to fill the screen (`futures-edge:fullscreen`
  message); turning the phone sideways then gives the full-width picture. Escape or the same button
  goes back.
- Subtitles: Malayalam by default when the lesson has `modules/narration.ml.json` (one translation per narration
  line, same order), otherwise English. The CC button opens a menu: മലയാളം / English / Off; the choice is
  remembered on the device. The Malayalam font (Noto Sans Malayalam, OFL) ships with each lesson. The Malayalam
  is a draft for native-speaker review.
- Speed: the 1× button opens 1× / 1.25× / 1.5× / 1.75× / 2× (also the < and > keys). The picture, music and sound
  effects speed up together; the voice keeps its normal pitch. The choice is remembered on the device.
- Voice language: a lesson with `content/futures-edge/<id>/voice-ml/` (the same lines spoken in Malayalam, same
  numbering) gets an EN / മ button that switches the voice in place. The build times both tracks together.
  Today only V00 has a Malayalam voice; other lessons have English voice with Malayalam subtitles.
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
  folder (mostly the tutor poses) and 2–4 MB of voice. All 27 lessons come to roughly 120–150 MB. Check this against the
  Azure Static Web Apps plan's app-size limit as lessons are added; the tutor images could later be
  shared between lessons instead of copied into each folder.
- **Safety.** The section is static: no trading endpoints, no API keys, no account data. It always
  shows "Education and demo practice only. No live trading, no real money."
