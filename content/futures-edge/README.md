# Futures Edge lesson sources

Each folder here is one lesson's full source. `tools/futures-edge-lessons/build-lesson.mjs` turns it
into the runnable page `public/futures-edge/lessons/<id>.html` (see `docs/futures-edge-course.md`).

```
<id>/
  film.json            id, title, and where the lesson was first authored
  modules/
    scenes.json        the scene list in order (id, name, seconds), stage size, colours, fonts
    base.css           shared styles; colours are the --ground / --main / --second / --accent variables
    shared.js          helpers every scene uses: the lesson header, price walks, and the brain tutor
    scene-<id>.js      one file per scene, in the order of scenes.json
    tutor.json         tutor pose table: size, brain centre (ax), feet line and brain width of each image
    score.js           the music and sound effects, written as notes and cues against scene start times
    narration.json     the voiceover script: each line with the time it was written to start
  assets/
    assets.json        every image the lesson uses, with its size
    tutor-*.webp       tutor poses (wv* is the waving loop, wk* the walk cycle)
    xtinex-x.png       the XTINEX mark
  voice/
    NN.mp3             line NN of narration.json, recorded (00.mp3 is the first line)
```

With `voice/`, the build lengthens any scene whose lines do not fit and the player slows that scene
down to match; scene code always sees the authored times, so nothing here needs changing for it.

## How a scene is written

Everything on screen is a pure function of time, so the player can pause, seek and replay anywhere.
A scene module registers itself:

```js
const { seg, eo, lerp, TextFx } = kit;
kit.scene("money", {
  init(kit) {   // build the scene's DOM once inside kit.stage
    kit.stage.append(kit.h('<div class="ground"><h2 class="line mn-t">Money is value</h2></div>'));
    this.t = kit.stage.querySelector(".mn-t");
  },
  render(t) {   // t = seconds since the scene began; set every changing style from t alone
    TextFx.fadeFromRight(this.t, t, 0.1);
  },
});
```

The kit gives each scene `stage` (its 1920×1080 box), `start` and `dur`, easing and timing helpers
(`seg`, `lerp`, `eo`, `ei`, `eio`, `eob`, `clamp01`, `breathe`, `rng`), `TextFx.fadeFromRight` /
`fadeOutLeft`, `h` (HTML string to element), `esc`, `assets.url(name)` and `json(name)`. No CSS
transitions, timers or `Math.random`: use `t` and `kit.rng(seed)`.

`score.js` calls `kit.score((S, T) => { ... })`. `T` holds each scene's start time by id and `T.END`;
`S` records `tempo`, `program`, `note`, `chord`, `pattern`, `drums`, `run`, `ticks`, `fx` and
`master`, which the player synthesises with WebAudio.

## Editing

1. Change files under `modules/` (or add images to `assets/` and list them in `assets.json`).
2. Rebuild: `node tools/futures-edge-lessons/build-lesson.mjs <id>` (needs `ffmpeg` when `voice/` exists).
3. Check it: `npm run build && npm run preview`, open `http://localhost:5181/futures-edge/lessons/<id>.html`.

All prices and names shown in the lessons are fictional and labelled as such.
