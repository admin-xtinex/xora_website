// Writes the voiceover recording plan for every video lesson.
//
//   node tools/futures-edge-lessons/voiceover-plan.mjs
//
// Reads content/futures-edge/<id>/modules/{scenes,narration}.json and writes
//   docs/futures-edge/voiceover/README.md      how to record and drop the files in (all lessons)
//   docs/futures-edge/voiceover/<id>.md        the script for one lesson, line by line
//   docs/futures-edge/voiceover/<id>.json      the same, for a TTS script: [{file, t, slot, text, say, scene}]
//
// "say" is the text to send to the voice engine: symbols and numbers written out the way the tutor
// should speak them (BTC → "B-T-C", 60,000 → "sixty thousand", 0.05% → "zero point zero five percent").
// Re-run after changing a narration line. Lines it could not fully spell out are marked for a check.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const contentDir = join(root, "content/futures-edge");
const outDir = join(root, "docs/futures-edge/voiceover");

// ── Numbers to words ─────────────────────────────────────────────────────────
const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function under1000(n) {
  const h = Math.floor(n / 100), r = n % 100;
  const rest = r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? "-" + ONES[r % 10] : "");
  return h ? ONES[h] + " hundred" + (r ? " " + rest : "") : rest;
}
function intWords(n) {
  if (n === 0) return "zero";
  const parts = [];
  for (const [v, w] of [[1e9, "billion"], [1e6, "million"], [1e3, "thousand"]]) {
    if (n >= v) { parts.push(under1000(Math.floor(n / v)) + " " + w); n %= v; }
  }
  if (n) parts.push(under1000(n));
  return parts.join(" ");
}
// "60,000" "0.05" "1.5" "2009" → words. Digits after the point are read one by one.
function numWords(s) {
  const [i, d0] = s.replace(/,/g, "").split(".");
  const d = d0 && d0.replace(/0+$/, ""); // 0.010 → "zero point zero one", 600.00 → "six hundred"
  let w = i === "" ? "zero" : intWords(Number(i));
  if (d) w += " point " + [...d].map((c) => ONES[Number(c)]).join(" ");
  return w;
}

// ── Spoken form ──────────────────────────────────────────────────────────────
const SPELL = (s) => [...s].join("-");
const TERMS = [
  [/\bBTC\/USDT\b/g, "B-T-C U-S-D-T"],
  [/\bETH\/USDT\b/g, "E-T-H U-S-D-T"],
  [/\bETH\/BTC\b/g, "E-T-H B-T-C"],
  [/\bBTCUSDT\b/g, "B-T-C U-S-D-T"],
  [/\bETHUSDT\b/g, "E-T-H U-S-D-T"],
  [/\b[Rr]isk\/reward\b/g, (m) => m[0] + "isk-to-reward"],
  [/\b([A-Z]{2,5})\/USDT\b/g, (m, a) => SPELL(a) + " U-S-D-T"],
  [/\bNO_TRADE\b/g, "no trade"],
  [/\bPnL\b/g, "P and L"],
  [/\b2FA\b/g, "two-factor"],
  [/\bDEMO\b/g, "demo"],
  [/\bWAIT\b/g, "wait"],
  [/\bBUY\b/g, "buy"],
  [/\bSELL\b/g, "sell"],
  [/\bXORA\b/g, "Zora"],
  [/\bXTINEX\b/g, "Ex-tin-ex"],
  [/\bHH\b/g, "higher high"], [/\bHL\b/g, "higher low"], [/\bLH\b/g, "lower high"], [/\bLL\b/g, "lower low"],
  [/\b(BTC|USDT|ETH|OTP|API|USD|XYZ|SL|TP)\b/g, (m) => SPELL(m)],
  [/\b(CP1|CPA|CPB)\b/g, (m) => ({ CP1: "checkpoint one", CPA: "checkpoint A", CPB: "checkpoint B" })[m]],
  [/\b([TV])(\d\d)\b/g, (m, a, n) => (a === "T" ? "T " : "V ") + intWords(Number(n))],
];
function spoken(text) {
  let s = text;
  for (const [re, to] of TERMS) s = s.replace(re, to);
  s = s.replace(/₹\s?([\d,]+(?:\.\d+)?)/g, (m, n) => numWords(n) + " rupees");
  // 10:10–10:14 clock times; 1:2 ratios.
  s = s.replace(/\b1\s?:\s?(\d+(?:\.\d+)?)\b/g, (m, b) => "one to " + numWords(b));
  s = s.replace(/\b(\d{1,2}):(\d\d)\b/g, (m, a, b) => intWords(Number(a)) + " " + (b === "00" ? "o'clock" : Number(b) < 10 ? "oh " + ONES[Number(b)] : intWords(Number(b))));
  // Ranges and maths symbols.
  s = s.replace(/(\d)\s?[–—]\s?(?=\d)/g, "$1 to ");
  s = s.replace(/\s?×\s?/g, " times ").replace(/\s?÷\s?/g, " divided by ").replace(/\s=\s/g, " equals ");
  s = s.replace(/≈\s?/g, "about ").replace(/\s?\/\s?(?=\d)/g, " out of ");
  s = s.replace(/(^|[\s(])[−-](?=\d)/g, "$1minus ").replace(/(^|[\s(])\+(?=\d)/g, "$1plus ");
  s = s.replace(/(\d)\s?[−]\s?(?=\d)/g, "$1 minus ").replace(/(\d)\s\+\s(?=\d)/g, "$1 plus ");
  // Leverage and timeframes: 10x, 5m, 15m, 1h.
  s = s.replace(/\b(\d+)x\b/g, (m, n) => numWords(n) + " ex");
  s = s.replace(/\b(\d+)m\b/g, (m, n) => numWords(n) + "-minute");
  s = s.replace(/\b(\d+)h\b/g, (m, n) => numWords(n) + "-hour");
  // Numbers, with percent.
  s = s.replace(/(\d[\d,]*(?:\.\d+)?|\.\d+)\s?%/g, (m, n) => numWords(n) + " percent");
  s = s.replace(/(^|\s)%(?=[\s.,]|$)/g, "$1percent");
  s = s.replace(/\d[\d,]*(?:\.\d+)?/g, (m) => {
    // A trailing comma or full stop belongs to the sentence.
    const t = m.match(/^(.*?)([.,]?)$/);
    return numWords(t[1]) + t[2];
  });
  // A sentence that now starts with a spelled-out number or a lower-cased word gets its capital back.
  s = s.replace(/(^|[.?!]\s+)([a-z])/g, (m, a, c) => a + c.toUpperCase());
  return s.replace(/\s{2,}/g, " ").trim();
}
// Anything still worth a human look in the spoken form.
const leftovers = (say) => [...new Set(say.match(/[0-9%×÷=≈<>|/_~^@#$₹€£]|\b[A-Z]{2,}\b(?<!\bA)/g) || [])]
  .filter((x) => !["I", "OK", "US", "AI"].includes(x));

// Lines whose meaning depends on how something is written; spoken by hand.
const SAY = {
  T03: { 9: "B-T-C slash U-S-D-T, and B-T-C U-S-D-T written as one word, are the same pair. E-T-H U-S-D-T is E-T-H priced in U-S-D-T." },
};

// ── Per-lesson plan ──────────────────────────────────────────────────────────
const TONE = {
  intro: "Welcoming and upbeat, like greeting a new student. Smile in the voice.",
  lesson: "Warm, clear and patient, like a good teacher explaining to a friend. Brighter on examples and 'try it'; slower and firmer on risks and warnings.",
  checkpoint: "Encouraging quiz host. After each question, a natural pause; read the answer with a little satisfaction, never as a test.",
};
const kindOf = (id) => (id === "V00" ? "intro" : id.startsWith("CP") ? "checkpoint" : "lesson");
const fmtT = (t) => Math.floor(t / 60) + ":" + (t % 60).toFixed(1).padStart(4, "0");
const RISKY = /risk|safety|mistake|warn|liquidat|leverage|not a bank|phish|security|never/i;

const ids = readdirSync(contentDir).filter((d) => existsSync(join(contentDir, d, "film.json"))).sort((a, b) => {
  const order = (x) => ["V00", "T01", "T02", "T03", "T04", "CP1", "T05", "T06", "T07", "T08", "T09", "T10", "T11", "T12", "T13", "CPA",
    "T14", "T15", "T16", "T17", "T18", "T19", "T20", "T21", "T22", "T23", "CPB"].indexOf(x);
  return order(a) - order(b);
});
mkdirSync(outDir, { recursive: true });
const summary = [];
for (const id of ids) {
  const mod = (n) => JSON.parse(readFileSync(join(contentDir, id, "modules", n), "utf8"));
  const film = JSON.parse(readFileSync(join(contentDir, id, "film.json"), "utf8"));
  const scenes = mod("scenes.json").scenes;
  const lines = mod("narration.json").lines;
  const ml = existsSync(join(contentDir, id, "modules/narration.ml.json")) ? mod("narration.ml.json").lines : null;
  let acc = 0;
  const sc = scenes.map((s) => { const o = { ...s, start: acc }; acc += s.dur; return o; });
  const total = acc;
  const sceneOf = (t) => [...sc].reverse().find((s) => t >= s.start) || sc[0];
  const rows = lines.map((l, i) => {
    const s = sceneOf(l.t);
    const next = i + 1 < lines.length ? lines[i + 1].t : total;
    const slot = Math.min(next, s.start + s.dur) - l.t;
    const say = l.say || (SAY[id] && SAY[id][i]) || spoken(l.text);
    const words = say.split(/\s+/).length;
    return {
      file: `voice/${String(i).padStart(2, "0")}.mp3`, n: i, t: l.t, slot: Math.round(slot * 10) / 10, scene: s.id,
      text: l.text, say, words, estSec: Math.round((words / 2.6) * 10) / 10, check: leftovers(say), ml: ml ? ml[i].text : undefined,
      note: RISKY.test(s.id + " " + (s.name || "") + " " + l.text) ? "firmer, slower" : "",
    };
  });
  const recorded = existsSync(join(contentDir, id, "voice"));
  const estTotal = rows.reduce((a, r) => a + r.estSec, 0);
  summary.push({ id, title: film.title, lines: rows.length, words: rows.reduce((a, r) => a + r.words, 0), chars: rows.reduce((a, r) => a + r.say.length, 0), total, estTotal, recorded });
  writeFileSync(join(outDir, id + ".json"), JSON.stringify({ id, title: film.title, voice: "see README.md", lines: rows.map(({ file, t, slot, scene, text, say, note }) => ({ file, t, slot, scene, text, say, note })) }, null, 2) + "\n");

  let md = `# ${film.title}: voiceover script\n\n`;
  md += `Lesson \`${id}\` · ${rows.length} lines · about ${rows.reduce((a, r) => a + r.words, 0)} words · film ${fmtT(total)} as written` +
    (recorded ? " · **already recorded** (voice/ exists; re-record only to change the voice)" : "") + "\n\n";
  md += `**Tone:** ${TONE[kindOf(id)]}\n\n`;
  md += `Record each line as its own file, \`content/futures-edge/${id}/${"voice/NN.mp3"}\`, using the **Say** text. ` +
    `The **Slot** is the time from this line to the next one in the film as written; a line may run longer (the build slows that scene to fit), ` +
    `but a line much longer than its slot stretches the animation, so keep the pace natural rather than rushed. ` +
    `"Firmer, slower" marks risk and warning lines. Malayalam is the on-screen subtitle, for reference only.\n\n`;
  md += `See [README.md](README.md) for the voice, file format and how to build.\n\n`;
  for (const s of sc) {
    const rs = rows.filter((r) => r.scene === s.id);
    if (!rs.length) continue;
    md += `## Scene ${s.id}: ${s.name || ""} (${fmtT(s.start)}, ${s.dur} s)\n\n`;
    if (s.desc) md += `_${s.desc}_\n\n`;
    for (const r of rs) {
      md += `**${r.file.slice(6)}** · at ${fmtT(r.t)} · slot ${r.slot} s · ≈${r.estSec} s${r.note ? " · " + r.note : ""}\n\n`;
      md += `- Text: ${r.text}\n`;
      if (r.say !== r.text) md += `- Say: ${r.say}\n`;
      if (r.check.length) md += `- ⚠ Check the spoken form of: ${r.check.map((c) => "`" + c + "`").join(", ")}\n`;
      if (r.ml) md += `- Malayalam subtitle: ${r.ml}\n`;
      md += "\n";
    }
  }
  writeFileSync(join(outDir, id + ".md"), md);
  const flagged = rows.filter((r) => r.check.length);
  if (flagged.length) console.log(id, "lines to check:", flagged.map((r) => r.n + " " + JSON.stringify(r.check)).join("; "));
}

// ── README ───────────────────────────────────────────────────────────────────
const tot = summary.reduce((a, s) => ({ lines: a.lines + s.lines, words: a.words + s.words, chars: a.chars + s.chars }), { lines: 0, words: 0, chars: 0 });
let rd = `# Futures Edge voiceover plan

Generated by \`node tools/futures-edge-lessons/voiceover-plan.mjs\` from each lesson's narration
(\`content/futures-edge/<id>/modules/narration.json\`). One script per video: [${summary.map((s) => s.id).join("], [")}] below.

## The voice

One voice for the whole course, so the tutor sounds like the same person in every video.

- **Who:** a warm, friendly female tutor in her late twenties to thirties; clear, neutral English that Indian
  learners find easy (light Indian or neutral international accent both work). Not salesy, not dramatic.
- **Pace:** about 150 words a minute, a little slower than conversation. Short natural pauses at commas and
  full stops; a longer pause before an answer in "try it" and checkpoint questions.
- **Delivery:** smile in the voice on welcomes and examples; calmer, slower and firmer on lines marked
  "firmer, slower" (risks, warnings, mistakes). Never excited about profits.
- **Consistency:** same voice, settings and loudness for every line and every lesson. If the tool supports
  context, give it the previous and next line (as the V00/T01 recordings did) so sentences join smoothly.
- **Pronunciation** (already written into the **Say** text): BTC "B-T-C", USDT "U-S-D-T", ETH "E-T-H",
  XORA "Zora", XTINEX "Ex-tin-ex", PnL "P and L", NO_TRADE "no trade", OTP "O-T-P", API "A-P-I",
  10x "ten ex", 5m "five-minute", 1:2 "one to two", numbers in full words.
  Check the brand names once with the team and change the rule in the script if they say them differently.

V00 and T01 were recorded with ElevenLabs (voice "Alice"). If the new voice differs, re-record those two
as well so the course sounds like one tutor (their scripts are here too).

## Files

- One file per line: \`content/futures-edge/<id>/voice/00.mp3\`, \`01.mp3\`, … in the order of the script
  (the **NN** number of each line). Every line needs its file; a missing file stops the build.
- MP3 (or WAV converted to MP3), 44.1 kHz or 48 kHz, mono or stereo, 128 kbps or better.
- Trim silence: no more than about 0.2 s before and after the speech. No music or effects.
- Loudness does not need to match exactly: the build normalises the whole track to -16 LUFS.
- The JSON next to each script (\`<id>.json\`) lists \`file\`, \`say\` and timing for every line, for a
  script that calls the voice API in a loop.

## Timing

Each line has the time it starts in the film as written (**at**) and its **slot**, the time until the next
line. The voice sets the pace: the build plays the clips 6% faster (pitch kept), places them one after
another near their moments, and slows down any scene whose lines do not fit, together with its animation
and sound. So there is no need to rush; aim for a natural read. The ≈ seconds next to each line is an
estimate at 150 words a minute.

## Prompt for an AI coding agent (for example Grok Build)

\`\`\`text
In the xora_website repo, record the voiceover for Futures Edge lesson <ID>.
Read docs/futures-edge/voiceover/README.md (voice, files, timing) and docs/futures-edge/voiceover/<ID>.json.
For every line, generate speech from its "say" text (never "text") with our chosen voice and the same settings
for every line, passing the previous and next line as context if the voice API supports it. Save each clip to
content/futures-edge/<ID>/<file> (voice/00.mp3, voice/01.mp3, ... exactly as listed), trimmed to at most 0.2 s of
silence at each end. Do not change narration.json. Then run node tools/futures-edge-lessons/build-lesson.mjs <ID>,
open public/futures-edge/lessons/<ID>.html, and check the voice plays in order with the subtitles.
Keep API keys out of the repo (environment variable only).
\`\`\`

Do V00 first as a test, listen to it, then run the rest one lesson at a time.

## Build and check

\`\`\`bash
# needs ffmpeg and ffprobe
node tools/futures-edge-lessons/build-lesson.mjs <id>
npm run build && npm run preview     # open /futures-edge/lessons/<id>.html
\`\`\`

The page then plays the voice, the music dips under it, and the subtitles follow the voice (Malayalam by
default, English in the CC menu). Commit \`content/futures-edge/<id>/voice/\` and the rebuilt
\`public/futures-edge/lessons/<id>*\`. Make sure the voice service's plan allows commercial use.

## All videos

| Video | Title | Lines | Words | Characters (Say) | Film as written | Speech ≈ | Recorded |
|---|---|---|---|---|---|---|---|
${summary.map((s) => `| [${s.id}](${s.id}.md) | ${s.title.replace(/^[A-Z0-9]+\s+/, "")} | ${s.lines} | ${s.words} | ${s.chars.toLocaleString("en-US")} | ${fmtT(s.total)} | ${fmtT(s.estTotal)} | ${s.recorded ? "yes" : "—"} |`).join("\n")}
| **All** | | **${tot.lines}** | **${tot.words.toLocaleString("en-US")}** | **${tot.chars.toLocaleString("en-US")}** | | | |

Characters are what most text-to-speech plans bill by.
`;
writeFileSync(join(outDir, "README.md"), rd);
console.log(`${summary.length} scripts, ${tot.lines} lines, ${tot.chars} characters -> docs/futures-edge/voiceover/`);
