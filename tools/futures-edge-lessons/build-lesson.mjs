// Builds the runnable lesson pages from their source.
//
//   node tools/futures-edge-lessons/build-lesson.mjs          # every lesson in content/futures-edge
//   node tools/futures-edge-lessons/build-lesson.mjs T01      # just one
//
// Reads content/futures-edge/<id>/ (modules/, assets/, voice/, film.json) and writes
//   public/futures-edge/lessons/<id>.html   one page: player, scene code and styles inline
//   public/futures-edge/lessons/<id>/       its images, fonts and voice track, loaded by relative path
//
// Voiceover: voice/NN.mp3 is line NN of modules/narration.json. The voice sets the pace: each
// scene is lengthened (never shortened) just enough for its lines to play one after another
// near the moments they were written for, and the player slows that scene's animation and
// sound effects by the same factor. Needs ffmpeg and ffprobe on the PATH when voice/ exists.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const contentDir = join(root, "content/futures-edge");
const outDir = join(root, "public/futures-edge/lessons");

const FONTS = [
  { file: "outfit.woff2", from: join(root, "public/fonts/outfit.woff2"), face: 'font-family:"Outfit";font-weight:400 700' },
  { file: "manrope.woff2", from: join(root, "public/fonts/manrope.woff2"), face: 'font-family:"Manrope";font-weight:400 800' },
  { file: "dm-mono-400.woff2", from: join(here, "fonts/dm-mono-400.woff2"), face: 'font-family:"DM Mono";font-weight:400' },
  { file: "dm-mono-500.woff2", from: join(here, "fonts/dm-mono-500.woff2"), face: 'font-family:"DM Mono";font-weight:500' },
];
const FONT_CHECKS = ['400 40px "Manrope"', '700 40px "Outfit"', '600 40px "Outfit"', '400 40px "DM Mono"', '500 40px "DM Mono"'];

const PLAYER_CSS = `
html, body { margin: 0; height: 100%; background: #02030a; overflow: hidden; color: #eef1f7;
  font-family: "Manrope", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
#stage { position: absolute; left: 50%; top: 50%; width: WIDTHpx; height: HEIGHTpx; overflow: hidden;
  background: BG; transform-origin: 50% 50%;
  --display: "Outfit", "Manrope", system-ui, sans-serif;
  --sans: "Manrope", system-ui, sans-serif;
  --mono: "DM Mono", ui-monospace, monospace; }
#stage .fe-scene { position: absolute; inset: 0; overflow: hidden; }
body:not(.fe-ready) #stage { visibility: hidden; }
.fe-loading { position: fixed; inset: 0; display: grid; place-items: center; margin: 0; font-size: 15px; color: #6b7489; }
body.fe-ready .fe-loading { display: none; }
.fe-ui { position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 10; display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border-radius: 14px; background: rgba(7, 8, 20, 0.8); border: 1px solid rgba(130, 160, 255, 0.18);
  backdrop-filter: blur(8px); transition: opacity 0.4s; }
body.fe-idle .fe-ui { opacity: 0; }
body:not(.fe-ready) .fe-ui, body:not(.fe-ready) .fe-hint { display: none; }
.fe-btn { flex: none; display: grid; place-items: center; width: 40px; height: 40px; padding: 0; border: 0; border-radius: 10px;
  background: rgba(238, 241, 247, 0.08); color: #eef1f7; cursor: pointer; }
.fe-btn svg { width: 20px; height: 20px; }
.fe-cc { font: 700 12px/1 "Manrope", system-ui, sans-serif; letter-spacing: 0.04em; color: #6b7489; }
.fe-cc[aria-pressed="true"] { color: #eef1f7; box-shadow: inset 0 -2px 0 #3ecbff; }
.fe-cap { position: fixed; left: 50%; bottom: 76px; z-index: 9; transform: translateX(-50%); width: max-content;
  max-width: min(78vw, 980px); margin: 0; padding: 8px 16px; border-radius: 10px; background: rgba(2, 3, 10, 0.78);
  color: #eef1f7; font: 600 clamp(13px, 2.1vw, 22px)/1.4 "Manrope", system-ui, sans-serif; text-align: center;
  transition: bottom 0.4s; pointer-events: none; }
body.fe-idle .fe-cap { bottom: 20px; }
.fe-cap[hidden], body:not(.fe-ready) .fe-cap { display: none; }
.fe-track { position: relative; flex: 1; height: 6px; border-radius: 6px; background: rgba(238, 241, 247, 0.14);
  cursor: pointer; touch-action: none; }
.fe-track::before { content: ""; position: absolute; inset: -12px 0; }
.fe-track i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 6px; background: linear-gradient(90deg, #3ecbff, #a855f7); }
.fe-time { flex: none; font: 500 13px/1 "DM Mono", ui-monospace, monospace; color: #b4bccb; font-variant-numeric: tabular-nums; }
.fe-hint { position: fixed; top: 12px; right: 12px; z-index: 10; padding: 10px 16px; border-radius: 999px; cursor: pointer;
  border: 1px solid rgba(62, 203, 255, 0.45); background: rgba(7, 8, 20, 0.82); color: #eef1f7;
  font: 600 14px/1 "Manrope", system-ui, sans-serif; }
.fe-btn:focus-visible, .fe-track:focus-visible, .fe-hint:focus-visible { outline: 2px solid #3ecbff; outline-offset: 2px; }
@media (max-width: 520px) { .fe-time { display: none; } }
@media (max-height: 420px) {
  .fe-ui { left: 6px; right: 6px; bottom: 6px; gap: 6px; padding: 4px 6px; border-radius: 10px; }
  .fe-btn { width: 34px; height: 34px; }
  .fe-btn svg { width: 18px; height: 18px; }
  .fe-cap { bottom: 50px; padding: 4px 10px; font-size: clamp(11px, 3.4vh, 18px); }
  body.fe-idle .fe-cap { bottom: 8px; }
  .fe-hint { top: 6px; right: 6px; padding: 7px 12px; font-size: 12px; }
}
`;

const scriptSafe = (s) => s.replace(/<\/(script)/gi, "<\\/$1");

// Voice timing: the clips play 6% faster (pitch kept), a gap of GAP s between lines, and a line may
// start at most MAX_DRIFT s after the moment it was written for; a scene ends TAIL s after its last line.
const VOICE_TEMPO = 1.06;
const GAP = 0.3;
const TAIL = 0.4;
const MAX_DRIFT = 1.5;

const probe = (file) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim());

// Returns each scene's stretch factor k and each line's start in the stretched timeline.
function planVoice(scenes, lines, durs) {
  const plan = { scenes: [], lines: [] };
  let oldStart = 0;
  let newStart = 0;
  for (const sc of scenes) {
    const idx = lines.map((l, i) => i).filter((i) => lines[i].t >= oldStart && lines[i].t < oldStart + sc.dur);
    let k = 1;
    let starts = [];
    for (;;) {
      starts = [];
      let prevEnd = -Infinity;
      let drift = 0;
      for (const i of idx) {
        const want = (lines[i].t - oldStart) * k;
        const at = Math.max(want, prevEnd + GAP);
        drift = Math.max(drift, at - want);
        starts.push(at);
        prevEnd = at + durs[i];
      }
      if (idx.length && (prevEnd > sc.dur * k - TAIL || drift > MAX_DRIFT)) k += 0.01;
      else break;
    }
    k = Math.round(k * 100) / 100;
    const dur = Math.round(sc.dur * k * 100) / 100;
    plan.scenes.push({ id: sc.id, name: sc.name, dur, k, oldStart, oldDur: sc.dur });
    idx.forEach((i, j) => plan.lines.push({ i, t: Math.round((newStart + starts[j]) * 1000) / 1000, d: durs[i], text: lines[i].text }));
    oldStart += sc.dur;
    newStart += dur;
  }
  return plan;
}

// Mixes every line into one track at its planned time (mono MP3, loudness-normalised).
function mixVoice(src, plan, total, out) {
  const args = ["-v", "error", "-y"];
  for (const l of plan.lines) args.push("-i", join(src, "voice", String(l.i).padStart(2, "0") + ".mp3"));
  const chains = plan.lines.map((l, j) => `[${j}:a]atempo=${VOICE_TEMPO},adelay=${Math.round(l.t * 1000)}:all=1[v${j}]`);
  const mix = plan.lines.map((l, j) => `[v${j}]`).join("") + `amix=inputs=${plan.lines.length}:normalize=0:dropout_transition=0,apad,atrim=0:${total},loudnorm=I=-16:TP=-1.5:LRA=11[out]`;
  args.push("-filter_complex", chains.join(";") + ";" + mix, "-map", "[out]", "-ac", "1", "-ar", "44100", "-b:a", "96k", out);
  execFileSync("ffmpeg", args);
}

function build(id) {
  const src = join(contentDir, id);
  const film = JSON.parse(readFileSync(join(src, "film.json"), "utf8"));
  const modules = {};
  for (const name of readdirSync(join(src, "modules")).sort()) modules[name] = readFileSync(join(src, "modules", name), "utf8");
  const cut = JSON.parse(modules["scenes.json"]);
  const manifest = JSON.parse(readFileSync(join(src, "assets/assets.json"), "utf8"));

  const dest = join(outDir, id);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(join(dest, "assets"), { recursive: true });
  mkdirSync(join(dest, "fonts"), { recursive: true });
  for (const name of Object.keys(manifest)) copyFileSync(join(src, "assets", name), join(dest, "assets", name));
  for (const f of FONTS) copyFileSync(f.from, join(dest, "fonts", f.file));

  // With a voiceover, the voice sets each scene's length; without one, the authored lengths stand.
  let scenes = cut.scenes.map(({ id: sid, name, dur }, i, all) => ({
    id: sid, name, dur, k: 1, oldStart: all.slice(0, i).reduce((a, x) => a + x.dur, 0), oldDur: dur,
  }));
  let voice = null;
  const voiceDir = join(src, "voice");
  if (existsSync(voiceDir) && modules["narration.json"]) {
    const lines = JSON.parse(modules["narration.json"]).lines;
    const durs = lines.map((l, i) => probe(join(voiceDir, String(i).padStart(2, "0") + ".mp3")) / VOICE_TEMPO);
    const plan = planVoice(cut.scenes, lines, durs);
    scenes = plan.scenes;
    const total = scenes.reduce((a, x) => a + x.dur, 0);
    mixVoice(src, plan, total, join(dest, "voice.mp3"));
    voice = { src: `${id}/voice.mp3`, lines: plan.lines.map(({ t, d, text }) => ({ t, d: Math.round(d * 1000) / 1000, text })) };
  }

  const FILM = {
    id,
    width: cut.width,
    height: cut.height,
    scenes,
    voice,
    assetBase: `${id}/assets/`,
    assets: manifest,
    fontChecks: FONT_CHECKS,
    modules,
  };
  const fontFaces = FONTS.map((f) => `@font-face { ${f.face}; src: url("${id}/fonts/${f.file}") format("woff2"); font-display: block; }`).join("\n");
  const css = PLAYER_CSS.replace("WIDTH", cut.width).replace("HEIGHT", cut.height).replace("BG", cut.background || "#02030a");
  const runtime = readFileSync(join(here, "runtime.js"), "utf8");
  const total = scenes.reduce((s, x) => s + x.dur, 0);
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${id} · ${film.title.replace(/^[A-Z]\d+\s+/, "")} · XORA Futures Edge</title>
<meta name="description" content="XORA Futures Edge lesson ${id}, an animated lesson (${Math.round(total / 60)} min). Education only, not financial advice.">
<style>
${fontFaces}
${css}
</style>
</head>
<body>
<p class="fe-loading">Loading lesson…</p>
<div id="stage" aria-label="${film.title}" role="img"></div>
<!-- Built by tools/futures-edge-lessons/build-lesson.mjs from content/futures-edge/${id}/. Edit the source, not this file. -->
<script>window.FILM = ${scriptSafe(JSON.stringify(FILM))};</script>
<script>
${scriptSafe(runtime)}
</script>
</body>
</html>
`;
  writeFileSync(join(outDir, `${id}.html`), html);
  console.log(`lesson ${id}: ${scenes.length} scenes, ${total.toFixed(1)}s${voice ? `, ${voice.lines.length} voice lines` : ""}, ${Object.keys(manifest).length} images -> public/futures-edge/lessons/${id}.html`);
}

const ids = process.argv.slice(2);
const all = readdirSync(contentDir).filter((d) => existsSync(join(contentDir, d, "film.json"))).sort();
for (const id of ids.length ? ids : all) build(id);
