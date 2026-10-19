// Builds the runnable lesson pages from their source.
//
//   node tools/futures-edge-lessons/build-lesson.mjs          # every lesson in content/futures-edge
//   node tools/futures-edge-lessons/build-lesson.mjs T01      # just one
//
// Reads content/futures-edge/<id>/ (modules/, assets/, film.json) and writes
//   public/futures-edge/lessons/<id>.html   one page: player, scene code and styles inline
//   public/futures-edge/lessons/<id>/       its images and fonts, loaded by relative path
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
`;

const scriptSafe = (s) => s.replace(/<\/(script)/gi, "<\\/$1");

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

  const FILM = {
    id,
    width: cut.width,
    height: cut.height,
    scenes: cut.scenes.map(({ id: sid, name, dur }) => ({ id: sid, name, dur })),
    assetBase: `${id}/assets/`,
    assets: manifest,
    fontChecks: FONT_CHECKS,
    modules,
  };
  const fontFaces = FONTS.map((f) => `@font-face { ${f.face}; src: url("${id}/fonts/${f.file}") format("woff2"); font-display: block; }`).join("\n");
  const css = PLAYER_CSS.replace("WIDTH", cut.width).replace("HEIGHT", cut.height).replace("BG", cut.background || "#02030a");
  const runtime = readFileSync(join(here, "runtime.js"), "utf8");
  const total = cut.scenes.reduce((s, x) => s + x.dur, 0);
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
  console.log(`lesson ${id}: ${cut.scenes.length} scenes, ${total}s, ${Object.keys(manifest).length} images -> public/futures-edge/lessons/${id}.html`);
}

const ids = process.argv.slice(2);
const all = readdirSync(contentDir).filter((d) => existsSync(join(contentDir, d, "film.json"))).sort();
for (const id of ids.length ? ids : all) build(id);
