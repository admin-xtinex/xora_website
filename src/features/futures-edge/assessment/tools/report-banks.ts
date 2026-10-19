/**
 * TOOL-ONLY. Question-bank coverage report (EDGE-09). READ-ONLY over lesson banks; writes only
 * src/features/futures-edge/assessment/reports/question-bank-coverage.md. Run from the repo root (see README).
 */
import { LESSON_WORKING_TITLES, SCHEMA_VERSION, type LessonId } from '../../contracts';
import { loadLessons } from './load-banks';
import { nodeFs, nodeProcess } from './node-builtins';
import { validateLessonQuestionSet, bestAnswerIsAbstain, numericRoundingIssues, remediationRefIssues, REQUIRED_SAFETY_TOPICS_BY_LESSON, PHASE5_LESSON_IDS } from '../question-sets/validator';
import { buildLessonManifest } from '../question-sets/manifest';
import { buildQuestionBank } from '../question-sets/bank';
import { buildCheckpoint } from '../checkpoints/build';
import { CP1_PLAN } from '../checkpoints/cp1';
import { CPA_PLAN } from '../checkpoints/cpa';
import { CPB_PLAN } from '../checkpoints/cpb';
import { CPB_ITEMS, CPB_ITEM_PROVENANCE } from '../checkpoints/cpb-items';
import { anchorIndexFromLessons, resolveRemediationTarget } from '../engine/remediation';

const OUT = `${nodeProcess().cwd()}/src/features/futures-edge/assessment/reports/question-bank-coverage.md`;
const ALL: LessonId[] = Array.from({ length: 23 }, (_, i) => `T${String(i + 1).padStart(2, '0')}` as LessonId);
const OWNER = (l: LessonId) => { const n = Number(l.slice(1)); return n <= 4 ? 'EDGE-02' : n <= 9 ? 'EDGE-03' : n <= 13 ? 'EDGE-04' : n <= 18 ? 'EDGE-05' : 'EDGE-06'; };

async function main(): Promise<void> {
const loaded = await loadLessons();
const byId = new Map(loaded.map((l) => [l.lesson.id, l]));
const bank = buildQuestionBank(loaded.map((l) => l.lesson));
const builds = [CP1_PLAN, CPA_PLAN, CPB_PLAN].map((p) => buildCheckpoint(p, bank, p.id === 'CPB' ? CPB_ITEMS : []));
const usedIn = new Map<string, string[]>();
for (const b of builds) for (const q of b.resolvedQuestions) usedIn.set(q.id, [...(usedIn.get(q.id) ?? []), b.plan.id]);

const L: string[] = [];
L.push('# EDGE-09 question-bank coverage report', '');
const ist = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
L.push(`Generated ${ist} IST by \`tools/report-banks.ts\` (contracts ${SCHEMA_VERSION}). Sources (read-only): ${[...new Set(loaded.map((l) => l.source.replace(/^.*?(src\/features|drafts)\//, '$1/')))].join(', ') || 'none'}.`, '');
L.push('## Per-lesson question banks', '');
L.push('| Lesson | Owner | Staged | Qs | Safety-critical (topics) | Abstain best answers | EDGE-09 validation | Gaps / notes |');
L.push('|---|---|---|---|---|---|---|---|');
let errTotal = 0;
for (const id of ALL) {
  const l = byId.get(id);
  if (!l) { L.push(`| ${id} ${LESSON_WORKING_TITLES[id] ?? ''} | ${OWNER(id)} | no | 0 | – | – | – | **No lesson staged: whole quiz bank missing** (needs ≥3 questions${PHASE5_LESSON_IDS.includes(id) ? ', ≥1 abstain item' : ''}${REQUIRED_SAFETY_TOPICS_BY_LESSON[id] ? `, a safety item on ${REQUIRED_SAFETY_TOPICS_BY_LESSON[id]!.join('/')}` : ''}) |`); continue; }
  const qs = l.lesson.quizQuestions;
  const v = validateLessonQuestionSet(l.lesson);
  errTotal += v.errors.length;
  const sc = qs.filter((q) => q.safetyCritical);
  const ab = qs.filter(bestAnswerIsAbstain);
  const notes: string[] = [];
  if (v.errors.length) notes.push(...v.errors.map((e) => `ERROR ${e.code}`));
  if (v.warnings.length) notes.push(...[...new Set(v.warnings.map((w) => w.code))].map((c) => `warn ${c}`));
  const untagged = qs.filter((q) => q.safetyCritical && !q.remediationRef).length;
  if (untagged) notes.push(`${untagged} safety item(s) without remediationRef`);
  L.push(`| ${id} ${l.lesson.title} v${l.lesson.version} | ${OWNER(id)} | yes | ${qs.length} | ${sc.length}${sc.length ? ` (${[...new Set(sc.map((q) => q.safetyTopic))].join(', ')})` : ''} | ${ab.length ? ab.map((q) => q.id).join(', ') : PHASE5_LESSON_IDS.includes(id) ? '**none**' : '–'} | ${v.errors.length ? `${v.errors.length} error(s)` : 'pass'}${v.warnings.length ? `, ${v.warnings.length} warning(s)` : ''} | ${notes.join('; ') || '–'} |`);
}
L.push('', `Lesson validation errors across staged banks: **${errTotal}**.`, '');
L.push('## Question-set versions (stale-attempt invalidation keys)', '', '| Lesson | questionSetVersion |', '|---|---|');
for (const { lesson } of loaded) L.push(`| ${lesson.id} | \`${buildLessonManifest(lesson).questionSetVersion}\` |`);
L.push('');
L.push('## Checkpoints', '');
for (const b of builds) {
  L.push(`### ${b.plan.id}: ${b.plan.title} (plan v${b.plan.version})`, '');
  L.push(`- Status: **${b.status === 'ready' ? 'READY' : b.status === 'provisional' ? 'PROVISIONAL (all items resolved; preview only until the pending confirmations clear)' : 'INCOMPLETE (preview only, cannot be passed)'}**; ${b.resolvedCount}/${b.plannedCount} items resolved; gating: ${b.plan.gating}; pass threshold ${b.plan.passThreshold}.`);
  L.push(`- Version: \`${b.manifest.questionSetVersion}\``);
  L.push(`- Safety topics present: ${Object.entries(b.coverage.safetyTopics).map(([t, n]) => `${t}×${n}`).join(', ') || 'none'}; mandatory: ${b.plan.mandatorySafetyTopics.join(', ') || 'none'}; abstain items ${b.coverage.abstainItems} (min ${b.plan.minAbstainItems}).`);
  L.push(`- Referenced: ${b.resolvedQuestions.map((q) => q.id).join(', ') || 'none'}`);
  const issues = [...b.report.errors.map((e) => `ERROR ${e.code}: ${e.message}`), ...b.report.warnings.filter((w) => w.code !== 'CP_GAP').map((w) => `warn ${w.code}: ${w.message}`)];
  if (issues.length) L.push(`- Issues: ${issues.join(' · ')}`);
  if (b.config.items.length) L.push(`- Checkpoint-only items (EDGE-09): ${b.config.items.map((q) => `${q.id} (${q.type}${q.safetyCritical ? `, safety ${q.safetyTopic}` : ''}${CPB_ITEM_PROVENANCE[q.id]?.simulator ? `, golden cross-checked vs ${CPB_ITEM_PROVENANCE[q.id]!.simulator!.id}` : ''})`).join(', ')}`);
  for (const p of b.pendingConfirmations) L.push(`- Pending confirmation: ${p.questionId}: ${p.note}`);
  if (b.gaps.length) {
    L.push('', '| Gap | Kind | Count | Owner | Note |', '|---|---|---|---|---|');
    for (const g of b.gaps) L.push(`| ${g.questionId ?? g.lessonId ?? ''} | ${g.kind} | ${g.count} | ${g.owner} | ${g.note} |`);
  } else L.push('- Gaps: none');
  L.push('');
}
L.push('## Items referenced by more than one checkpoint', '');
const multi = [...usedIn].filter(([, v]) => v.length > 1);
L.push(multi.length ? multi.map(([k, v]) => `- ${k}: ${v.join(', ')}`).join('\n') : '- none', '');
L.push('## D-37 numeric rounding/tolerance: lesson items to fix (owner = lesson author)', '');
L.push('Rule (EDGE-09 strict form): `rounding: { decimals: d }` present and `0.5·10^-d ≤ tolerance ≤ 10^-d`.', '');
const d37 = loaded.flatMap(({ lesson }) => lesson.quizQuestions.map((q) => ({ q, lesson, issues: numericRoundingIssues(q) })).filter((x) => x.issues.length));
const numericTotal = loaded.reduce((n, { lesson }) => n + lesson.quizQuestions.filter((q) => q.answer.kind === 'numeric').length, 0);
L.push(`${numericTotal} numeric lesson questions loaded; **${d37.length} fail**.`, '');
if (d37.length) {
  L.push('| Question | Owner | Answer | Issue | In checkpoint | Suggested fix |', '|---|---|---|---|---|---|');
  for (const { q, lesson, issues } of d37) {
    const a = q.answer.kind === 'numeric' ? q.answer : null;
    // Minimal fix: keep the author's tolerance and add the rounding it implies (tol ∈ [½·10^-d, 10^-d] ⇔ d = ⌊−log10 tol⌋).
    // Tolerance 0: use the value's own decimals and a half-step tolerance.
    const valueDp = a ? (String(a.value).split('.')[1]?.length ?? 0) : 0;
    const fix = !a ? '' : a.tolerance > 0
      ? `add rounding: { decimals: ${Math.max(0, Math.min(8, Math.floor(-Math.log10(a.tolerance) + 1e-9)))} } (tolerance ${a.tolerance} unchanged)`
      : `add rounding: { decimals: ${valueDp} }, tolerance ${0.5 * 10 ** -valueDp}`;
    L.push(`| ${q.id} | ${OWNER(lesson.id as LessonId)} | ${a ? `${a.value} ${a.unit}, tol ${a.tolerance}` : ''} | ${issues.map((i) => i.code).join(', ')} | ${usedIn.get(q.id)?.join(', ') ?? '–'} | ${fix} |`);
  }
}
L.push('', '## remediationRef gaps (D-67; owner = lesson author)', '');
L.push('Safety-critical items without a `remediationRef` fall back to the start of the linked lesson. Scene anchors (`Tnn-Ann`) are accepted in contracts 1.x with a warning; anchors are also checked to exist in the loaded lessons.', '');
const anchors = anchorIndexFromLessons(loaded.map((l) => l.lesson));
const remRows: string[] = [];
const missingByOwner = new Map<string, string[]>();
for (const { lesson } of loaded) for (const q of lesson.quizQuestions) {
  if (q.safetyCritical && !q.remediationRef) missingByOwner.set(OWNER(lesson.id as LessonId), [...(missingByOwner.get(OWNER(lesson.id as LessonId)) ?? []), q.id]);
  if (!q.remediationRef) continue;
  const issues = remediationRefIssues(q.remediationRef, anchors);
  if (issues.length) remRows.push(`| ${q.id} | ${OWNER(lesson.id as LessonId)} | ${q.remediationRef.lessonId}${q.remediationRef.anchorId ? ` / ${q.remediationRef.anchorId}` : ''} | ${issues.map((i) => i.code).join(', ')} | ${resolveRemediationTarget(q, { anchorExists: anchors }).label} | ${usedIn.get(q.id)?.join(', ') ?? '–'} |`);
}
const missingTotal = [...missingByOwner.values()].reduce((n, v) => n + v.length, 0);
L.push(`Safety-critical items without remediationRef: **${missingTotal}**${missingTotal ? ` (${[...missingByOwner].map(([o, v]) => `${o} ${v.length}: ${v.join(', ')}`).join('; ')})` : ''}.`, '');
L.push(remRows.length ? ['| Question | Owner | remediationRef | Issue | Link resolves to | In checkpoint |', '|---|---|---|---|---|---|', ...remRows].join('\n') : 'Anchor issues: none.', '');
L.push('', '_Education only. Coverage numbers describe staged drafts today and change as authors push; re-run the tool._', '');
nodeFs().writeFileSync(OUT, L.join('\n'), 'utf8');
console.log(`wrote ${OUT}: ${loaded.length} lessons staged, ${errTotal} lesson errors; ${builds.map((b) => `${b.plan.id} ${b.status} ${b.resolvedCount}/${b.plannedCount}`).join(', ')}`);
}

main().catch((e: unknown) => { console.error(e); nodeProcess().exitCode = 1; });
