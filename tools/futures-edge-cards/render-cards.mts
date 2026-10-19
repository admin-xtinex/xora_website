// Renders one 1280x720 title card per lesson from courseData.ts into
// public/futures-edge/cards/<id>.webp.
//
//   node tools/futures-edge-cards/render-cards.mts [--only T01,T02]
//
// Needs Node 22.18+ (runs TypeScript directly) and Playwright with Chromium
// (set PLAYWRIGHT_PATH if the package is not resolvable from here).
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LESSONS, PHASES, type Lesson, type TutorPose } from "../../src/components/futures-edge/courseData.ts";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "../../public/futures-edge/cards");
const require = createRequire(import.meta.url);

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(process.env.PLAYWRIGHT_PATH || "/opt/node-tools/node_modules/playwright");
  }
}

const dataUri = (file: string, mime: string) => `data:${mime};base64,${readFileSync(join(here, file)).toString("base64")}`;

// Tutor anchors, measured on each image: brain width, brain centre x, feet y (px).
const POSES: Record<TutorPose, { w: number; h: number; ax: number; feet: number; bw: number }> = {
  present: { w: 546, h: 612, ax: 218, feet: 605, bw: 421 },
  explain: { w: 502, h: 602, ax: 275, feet: 594, bw: 394 },
  think: { w: 465, h: 656, ax: 229, feet: 648, bw: 452 },
  point: { w: 547, h: 568, ax: 210, feet: 561, bw: 415 },
  hi: { w: 518, h: 594, ax: 298, feet: 587, bw: 408 },
  wave: { w: 374, h: 448, ax: 165, feet: 436, bw: 305 },
  walk: { w: 365, h: 460, ax: 164, feet: 446, bw: 310 },
  idle: { w: 331, h: 446, ax: 164.5, feet: 432, bw: 305 },
};

// One quiet background motif per phase, drawn behind the tutor.
function motif(phase: number): string {
  const s = 'fill="none" stroke-width="3"';
  switch (phase) {
    case 1:
      return [0, 1, 2, 3].map((i) => `<circle cx="1010" cy="330" r="${120 + i * 70}" ${s} style="stroke:rgba(62,203,255,${0.22 - i * 0.04})"/>`).join("") +
        `<text x="1010" y="352" text-anchor="middle" style="font:500 64px 'DM Mono',ui-monospace,monospace;fill:rgba(238,241,247,.09)">BTC</text>`;
    case 2:
      return `<path d="M860 520 L1010 300 L1160 520" ${s} style="stroke:rgba(62,203,255,.25)"/><path d="M900 180 L1050 400 L1200 180" ${s} style="stroke:rgba(168,85,247,.25)"/>`;
    case 3: {
      let g = "";
      for (let x = 820; x <= 1220; x += 50) g += `<line x1="${x}" y1="120" x2="${x}" y2="560" style="stroke:rgba(238,241,247,.06)"/>`;
      for (let y = 120; y <= 560; y += 50) g += `<line x1="820" y1="${y}" x2="1220" y2="${y}" style="stroke:rgba(238,241,247,.06)"/>`;
      return g + `<rect x="850" y="150" width="340" height="380" rx="22" ${s} style="stroke:rgba(62,203,255,.22)"/>`;
    }
    case 4: {
      const c = [[0, 300, 380, 260, 420], [1, 380, 330, 300, 360], [2, 330, 250, 220, 350], [3, 250, 290, 230, 320], [4, 290, 200, 170, 310], [5, 200, 240, 180, 260]];
      return c.map(([i, o, cl, hi, lo]) => {
        const x = 840 + i * 64, up = cl < o, top = Math.min(o, cl), h = Math.max(8, Math.abs(cl - o));
        const col = up ? "rgba(62,203,255,.32)" : "rgba(168,85,247,.32)";
        return `<line x1="${x + 16}" y1="${hi}" x2="${x + 16}" y2="${lo}" style="stroke:${col};stroke-width:3"/><rect x="${x}" y="${top}" width="32" height="${h}" rx="4" style="fill:${col}"/>`;
      }).join("");
    }
    case 5:
      return [0, 1, 2].map((i) => `<circle cx="1010" cy="330" r="${90 + i * 90}" ${s} style="stroke:rgba(62,203,255,${0.24 - i * 0.06})"/>`).join("") +
        `<line x1="1010" y1="160" x2="1010" y2="500" style="stroke:rgba(168,85,247,.25);stroke-width:3"/><line x1="840" y1="330" x2="1180" y2="330" style="stroke:rgba(168,85,247,.25);stroke-width:3"/>`;
    default:
      return `<path d="M760 520 C 860 380 940 470 1020 340 S 1180 240 1260 180" ${s} style="stroke:rgba(62,203,255,.28)"/>`;
  }
}

function cardHtml(l: Lesson, fonts: { outfit: string; manrope: string }, tutor: string): string {
  const phase = PHASES.find((p) => p.id === l.phase)!;
  const p = POSES[l.pose];
  const brain = 270, k = brain / p.bw, w = p.w * k, h = p.h * k, ax = 1030, feet = 690;
  const left = l.flip ? ax - (p.w - p.ax) * k : ax - p.ax * k;
  const cp = l.kind === "checkpoint";
  const label = l.kind === "intro" ? "Start here" : cp ? "Checkpoint" : `Phase ${l.phase} · ${phase.name}`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Outfit; src: url(${fonts.outfit}) format("woff2"); font-weight: 400 700; }
@font-face { font-family: Manrope; src: url(${fonts.manrope}) format("woff2"); font-weight: 400 700; }
html, body { margin: 0; width: 1280px; height: 720px; overflow: hidden; background: #02030a; }
.card { position: relative; width: 1280px; height: 720px; overflow: hidden; color: #eef1f7; font-family: Manrope, system-ui, sans-serif;
  background: radial-gradient(60% 70% at 85% 30%, rgba(${cp ? "168,85,247" : "62,203,255"},.20), transparent 70%),
              radial-gradient(50% 60% at 0% 100%, rgba(${cp ? "62,203,255" : "168,85,247"},.16), transparent 70%), #02030a; }
.edge { position: absolute; inset: 0; border: 2px solid rgba(130,160,255,.16); border-radius: 0; }
svg { position: absolute; inset: 0; }
.brand { position: absolute; left: 64px; top: 56px; font: 600 20px/1 Outfit, sans-serif; letter-spacing: .28em; color: #3ecbff; }
.phase { position: absolute; left: 64px; top: 92px; font: 500 18px/1 Manrope, sans-serif; letter-spacing: .2em; text-transform: uppercase; color: rgba(238,241,247,.62); }
.id { position: absolute; left: 58px; top: 150px; font: 700 132px/1 Outfit, sans-serif; letter-spacing: -.02em;
  background: linear-gradient(90deg, #3ecbff, #4f8ef7 45%, #a855f7); -webkit-background-clip: text; background-clip: text; color: transparent; }
.text { position: absolute; left: 64px; top: 306px; width: 700px; display: flex; flex-direction: column; gap: 22px; }
.title { margin: 0; font: 700 ${l.title.length > 30 ? 56 : 64}px/1.08 Outfit, sans-serif; letter-spacing: -.01em; text-wrap: balance; }
.line { margin: 0; width: 600px; font: 500 26px/1.45 Manrope, sans-serif; color: rgba(238,241,247,.66); }
.meta { position: absolute; left: 64px; bottom: 56px; display: flex; gap: 14px; }
.chip { padding: 10px 20px; border-radius: 999px; font: 600 20px/1 Manrope, sans-serif; background: rgba(62,203,255,.10); border: 1.5px solid rgba(62,203,255,.35); }
.chip.cp { background: rgba(168,85,247,.14); border-color: rgba(168,85,247,.5); }
.glow { position: absolute; left: ${ax - 230}px; top: 210px; width: 460px; height: 460px; border-radius: 50%; background: radial-gradient(closest-side, rgba(62,203,255,.22), transparent); }
.shadow { position: absolute; left: ${ax - 150}px; top: ${feet - 16}px; width: 300px; height: 34px; border-radius: 50%; background: radial-gradient(closest-side, rgba(62,203,255,.45), transparent); }
.tutor { position: absolute; left: ${left.toFixed(1)}px; top: ${(feet - p.feet * k).toFixed(1)}px; width: ${w.toFixed(1)}px; height: ${h.toFixed(1)}px; ${l.flip ? "transform: scaleX(-1);" : ""} }
</style></head><body><div class="card">
<svg viewBox="0 0 1280 720">${motif(l.phase)}</svg>
<div class="glow"></div><div class="shadow"></div><img class="tutor" src="${tutor}">
<div class="brand">XORA FUTURES EDGE</div><div class="phase">${label}</div>
<div class="id">${l.id}</div><div class="text"><h1 class="title">${l.title}</h1><p class="line">${l.line}</p></div>
<div class="meta"><span class="chip${cp ? " cp" : ""}">${l.minutes} min</span><span class="chip${cp ? " cp" : ""}">${cp ? "Review" : l.kind === "intro" ? "Welcome" : "Video lesson"}</span></div>
<div class="edge"></div></div></body></html>`;
}

const only = (() => {
  const i = process.argv.indexOf("--only");
  return i > -1 ? new Set(process.argv[i + 1].split(",")) : null;
})();

const fonts = { outfit: dataUri("fonts/outfit.woff2", "font/woff2"), manrope: dataUri("fonts/manrope.woff2", "font/woff2") };
const tutorUris = new Map<TutorPose, string>();
const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
mkdirSync(out, { recursive: true });
for (const l of LESSONS) {
  if (only && !only.has(l.id)) continue;
  if (!tutorUris.has(l.pose)) tutorUris.set(l.pose, dataUri(`tutor/${l.pose}.webp`, "image/webp"));
  await page.setContent(cardHtml(l, fonts, tutorUris.get(l.pose)!), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: "png" });
  // Chromium screenshots only PNG/JPEG, so encode WebP in the page itself.
  const webp: string = await page.evaluate(async (b64: string) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    c.getContext("2d")!.drawImage(img, 0, 0);
    return c.toDataURL("image/webp", 0.86).split(",")[1];
  }, png.toString("base64"));
  writeFileSync(join(out, `${l.id}.webp`), Buffer.from(webp, "base64"));
  console.log(`card ${l.id}`);
}
await browser.close();
