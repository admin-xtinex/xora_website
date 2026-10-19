/**
 * EDGE-00 probe: validates every staged draft lesson against the CURRENT box contracts (read-only).
 * Run (box only; reads /workspace/futures-edge/drafts): cd docs/futures-edge/tools && npx -y tsx probe-drafts.ts
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { validateLesson, validateCourse, validateFixture, SCHEMA_VERSION, type Lesson, type Fixture, type FixtureId } from '@futures-edge/contracts';

async function main(): Promise<void> {
const D = '/workspace/futures-edge/drafts';
const tsLessons: Array<{ bot: string; path: string; lesson: Lesson; fixtures: Fixture[] }> = [];
const ROOTS = [
  ['EDGE-02', `${D}/edge-02/features/futures-edge/content/phase-01`],
  ['EDGE-03', `${D}/edge-03/features/futures-edge/content/phase-02`],
  ['EDGE-04', `${D}/edge-04/features/futures-edge/content/phase-03`],
  ['EDGE-05', `${D}/edge-05/content/phase-04`],
] as const;
for (const [bot, root] of ROOTS) {
  if (!existsSync(root)) continue;
  for (const dir of readdirSync(root).filter((d) => /^T\d\d$/.test(d)).sort()) {
    if (!existsSync(`${root}/${dir}/lesson.ts`)) { console.log(`(skip ${bot} ${dir}: no lesson.ts yet)`); continue; }
    const lesson = (await import(`${root}/${dir}/lesson.ts`)).default as Lesson;
    const fx = existsSync(`${root}/${dir}/fixtures.ts`) ? ((await import(`${root}/${dir}/fixtures.ts`)).fixtures as Fixture[]) : [];
    tsLessons.push({ bot, path: `${root}/${dir}/lesson.ts`, lesson, fixtures: fx });
  }
}
const fxIds = new Set(tsLessons.flatMap((l) => l.fixtures.map((f) => f.id)));
const fixtureProvider = { has: (id: FixtureId) => fxIds.has(id) };
console.log(`contracts ${SCHEMA_VERSION}`);
for (const { bot, lesson } of tsLessons) {
  const r = validateLesson(lesson, { fixtureProvider });
  const errs = r.ok ? [] : r.errors;
  const codes = (xs: { code: string }[]) => [...xs.reduce((m, x) => m.set(x.code, (m.get(x.code) ?? 0) + 1), new Map<string, number>())].map(([k, v]) => `${k}×${v}`).join(' ') || '-';
  console.log(`${bot} ${lesson.id}: ${r.ok ? 'PASS' : 'FAIL'} errors=${errs.length} [${codes(errs)}] warnings=${r.warnings.length} [${codes(r.warnings)}]`);
  for (const e of errs.slice(0, 8)) console.log(`    ERROR ${e.path} [${e.code}] ${e.message}`);
}
const c = validateCourse(tsLessons.map((l) => l.lesson), [], { fixtureProvider, partial: true });
const pend = c.warnings.filter((w) => w.code === 'GLOSSARY_PENDING_OWNER').map((w) => w.message.match(/"([^"]+)" will be defined by (T\d\d)/)).filter(Boolean).map((m) => `${m![1]}→${m![2]}`);
console.log(`\npartial validateCourse(${tsLessons.map((l) => l.lesson.id).join(',')}): ${c.ok ? 'OK' : 'ERRORS'}; errors=${c.ok ? 0 : c.errors.length}; pending-owner refs: ${[...new Set(pend)].sort().join(', ') || 'none'}`);
if (!c.ok) for (const e of c.errors.slice(0, 15)) console.log(`    ERROR ${e.path} [${e.code}] ${e.message}`);

// v1.3.0 (D-43): standard fixture shapes, informational (ohlc-series / price-path get a data-shape check)
console.log('\nvalidateFixture (v1.3.0 standard shapes; informational):');
for (const { bot, lesson, fixtures } of tsLessons) {
  if (!fixtures.length) continue;
  const bad = fixtures.map((f) => ({ f, r: validateFixture(f) })).filter((x) => !x.r.ok || x.r.warnings.length);
  const summ = bad.map(({ f, r }) => `${f.id}(${f.kind}): ${[...new Set([...(r.ok ? [] : r.errors), ...r.warnings].map((i) => i.code))].join(',')}`);
  console.log(`  ${bot} ${lesson.id}: ${fixtures.length} fixtures, ${fixtures.length - bad.length} clean${summ.length ? ' | ' + summ.join(' | ') : ''}`);
}

// EDGE-06 JSON drafts (written against the blueprint sketch, not these contracts): migration gap report
const p5 = `${D}/phase-05`;
if (existsSync(p5)) {
  console.log('\nEDGE-06 phase-05 JSON vs contracts (migration gap, informational):');
  for (const f of readdirSync(p5).filter((x) => /^T\d\d\.json$/.test(x)).sort()) {
    const j = JSON.parse(readFileSync(`${p5}/${f}`, 'utf8'));
    const r = validateLesson(j);
    const errs = r.ok ? [] : r.errors;
    const m = new Map<string, number>(); for (const e of errs) m.set(e.code, (m.get(e.code) ?? 0) + 1);
    console.log(`  ${f}: errors=${errs.length} top: ${[...m].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k}×${v}`).join(' ')}`);
  }
}
}
main().catch((e) => { console.error(e); process.exit(2); });
