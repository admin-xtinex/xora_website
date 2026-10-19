/**
 * Resolve a CheckpointPlan against the question bank (EDGE-09).
 * Output: a contract CheckpointConfig of the RESOLVED items, a manifest, an explicit gap list and coverage stats.
 * An incomplete build is a PREVIEW: it can be practised but can never record a checkpoint pass (see progress/service).
 */
import {
  validateCheckpoint, type CheckpointConfig, type CheckpointQuestionId, type LessonId, type Question, type QuestionId,
  type SafetyTopic, type ValidationIssue,
} from '../../contracts';
import { buildManifest, type QuestionSetManifest } from '../question-sets/manifest';
import type { QuestionBank } from '../question-sets/bank';
import { bestAnswerIsAbstain, numericRoundingIssues, validateAssessmentQuestion, type AssessmentReport } from '../question-sets/validator';
import type { AuthorBot, CheckpointPlan } from './plan';

export interface CheckpointGap {
  slotIndex: number;
  kind: 'lesson-not-authored' | 'lesson-staged-items-not-picked' | 'question-not-in-bank' | 'checkpoint-item-not-authored';
  lessonId?: LessonId;
  questionId?: QuestionId;
  count: number;
  owner: AuthorBot;
  note: string;
  draftSource?: string;
}

export interface CheckpointBuild {
  plan: CheckpointPlan;
  status: 'ready' | 'incomplete';
  config: CheckpointConfig;
  manifest: QuestionSetManifest;
  resolvedQuestions: Question[];
  plannedCount: number;
  resolvedCount: number;
  gaps: CheckpointGap[];
  coverage: {
    byLesson: Partial<Record<LessonId, { planned: number; resolved: number }>>;
    safetyTopics: Partial<Record<SafetyTopic, number>>;
    abstainItems: number;
  };
  report: AssessmentReport;
}

const OWNER_BY_LESSON = (l: LessonId): AuthorBot => {
  const n = Number(l.slice(1));
  return n <= 4 ? 'EDGE-02' : n <= 9 ? 'EDGE-03' : n <= 13 ? 'EDGE-04' : n <= 18 ? 'EDGE-05' : 'EDGE-06';
};

export function buildCheckpoint(
  plan: CheckpointPlan, bank: QuestionBank,
  authoredItems: ReadonlyArray<Question & { id: CheckpointQuestionId }> = [],
  opts: { requireReady?: boolean } = {},
): CheckpointBuild {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const P = `[${plan.id}]`;
  const err = (path: string, code: string, message: string) => errors.push({ path, code, message, severity: 'error' });
  const warn = (path: string, code: string, message: string) => warnings.push({ path, code, message, severity: 'warning' });
  const gapIssue = opts.requireReady ? err : warn;

  const gaps: CheckpointGap[] = [];
  const questionIds: QuestionId[] = [];
  const items: Array<Question & { id: CheckpointQuestionId }> = [];
  const resolved: Question[] = [];
  const byLesson: CheckpointBuild['coverage']['byLesson'] = {};
  const tally = (l: LessonId, planned: number, res: number) => {
    const t = (byLesson[l] ??= { planned: 0, resolved: 0 });
    t.planned += planned; t.resolved += res;
  };
  const authored = new Map(authoredItems.map((q) => [q.id, q]));
  const plannedTopics = new Set<SafetyTopic>();
  const seen = new Set<string>();
  let plannedCount = 0;

  plan.slots.forEach((s, i) => {
    const sp = `${P}.slots[${i}]`;
    if (s.kind === 'lesson-question') {
      plannedCount += 1;
      if (seen.has(s.questionId)) err(sp, 'CP_DUPLICATE_REF', `${s.questionId} referenced twice`);
      seen.add(s.questionId);
      if (!plan.coversLessonIds.includes(s.lessonId)) err(sp, 'CP_SLOT_OUTSIDE_COVERAGE', `${s.questionId} is from ${s.lessonId}, outside this checkpoint`);
      if (s.expect?.safetyTopic) plannedTopics.add(s.expect.safetyTopic);
      const q = bank.byId.get(s.questionId);
      if (!q) {
        tally(s.lessonId, 1, 0);
        gaps.push({
          slotIndex: i, kind: 'question-not-in-bank', lessonId: s.lessonId, questionId: s.questionId, count: 1, owner: OWNER_BY_LESSON(s.lessonId),
          note: s.draftSource ? `listed at ${s.draftSource} but not in the loaded bank (lesson not staged, renumbered, or not yet in contract shape)` : 'question id not found in any loaded lesson',
          ...(s.draftSource ? { draftSource: s.draftSource } : {}),
        });
        gapIssue(sp, 'CP_GAP', `${s.questionId} not in bank`);
        return;
      }
      tally(s.lessonId, 1, 1);
      if (q.linkedLessonId !== s.lessonId) err(sp, 'CP_EXPECT_MISMATCH', `${q.id} is linked to ${q.linkedLessonId}, plan says ${s.lessonId}`);
      if (s.expect?.safetyTopic && !(q.safetyCritical && q.safetyTopic === s.expect.safetyTopic)) {
        err(sp, 'CP_EXPECT_MISMATCH', `${q.id} expected safety-critical topic ${s.expect.safetyTopic}, got ${q.safetyCritical ? q.safetyTopic : 'not safety-critical'}`);
      }
      if (s.expect?.abstain !== undefined && bestAnswerIsAbstain(q) !== s.expect.abstain) {
        err(sp, 'CP_EXPECT_MISMATCH', `${q.id} expected best answer abstain=${s.expect.abstain} (Choice.decision tag)`);
      }
      // D-37: a referenced lesson numeric item must carry rounding + a half-step..one-step tolerance. The fix belongs
      // to the lesson author, so this is a warning while staging and an error in integration mode (requireReady).
      const d37 = numericRoundingIssues(q);
      if (d37.length) (opts.requireReady ? err : warn)(sp, 'CP_NUMERIC_D37', `${q.id} (fix: ${OWNER_BY_LESSON(s.lessonId)}): ${d37.map((n) => `${n.code} ${n.message}`).join('; ')}`);
      questionIds.push(q.id); resolved.push(q);
    } else if (s.kind === 'lesson-pending') {
      plannedCount += s.count;
      tally(s.lessonId, s.count, 0);
      if (!plan.coversLessonIds.includes(s.lessonId)) err(sp, 'CP_SLOT_OUTSIDE_COVERAGE', `${s.lessonId} outside this checkpoint`);
      s.wants?.forEach((t) => plannedTopics.add(t));
      const staged = bank.lessonIds.has(s.lessonId);
      gaps.push({
        slotIndex: i, kind: staged ? 'lesson-staged-items-not-picked' : 'lesson-not-authored', lessonId: s.lessonId, count: s.count,
        owner: staged ? 'EDGE-09' : s.owner, note: staged ? `${s.note}; lesson is now staged by ${s.owner}, EDGE-09 picks ${s.count} item id(s)` : s.note,
      });
      gapIssue(sp, 'CP_GAP', staged ? `${s.lessonId}: lesson staged, ${s.count} item(s) still to be referenced (EDGE-09)` : `${s.lessonId}: ${s.count} item(s) pending (${s.owner})`);
    } else {
      plannedCount += 1;
      s.wants?.forEach((t) => plannedTopics.add(t));
      const q = authored.get(s.id);
      if (!q) {
        gaps.push({ slotIndex: i, kind: 'checkpoint-item-not-authored', questionId: s.id, count: 1, owner: 'EDGE-09', note: `${s.purpose}: ${s.note}; depends on ${s.dependsOn}` });
        gapIssue(sp, 'CP_GAP', `${s.id} (${s.purpose}) not authored yet`);
        return;
      }
      const r = validateAssessmentQuestion(q, `${sp}.item`, { checkpointId: plan.id });
      errors.push(...r.errors); warnings.push(...r.warnings);
      if (!plan.coversLessonIds.includes(q.linkedLessonId)) err(sp, 'CP_SLOT_OUTSIDE_COVERAGE', `${q.id} linked to ${q.linkedLessonId}`);
      items.push(q); resolved.push(q);
    }
  });

  // Plan-level rules
  if (plannedCount < plan.questionCount.min || plannedCount > plan.questionCount.max) err(`${P}.slots`, 'CP_PLAN_COUNT', `plan has ${plannedCount} items; expected ${plan.questionCount.min}–${plan.questionCount.max}`);
  for (const l of plan.coversLessonIds) {
    if (!byLesson[l]?.planned) err(`${P}.coversLessonIds`, 'CP_COVERAGE', `${l} has no planned item`);
  }
  for (const t of plan.mandatorySafetyTopics) if (!plannedTopics.has(t)) err(`${P}.mandatorySafetyTopics`, 'CP_MANDATORY_TOPIC', `no slot plans a safety-critical ${t} item`);
  if (plan.id === 'CP1' && plan.gating) err(`${P}.gating`, 'CP_GATING', 'CP1 is non-gating');
  if (plan.id !== 'CP1' && !plan.gating) err(`${P}.gating`, 'CP_GATING', `${plan.id} must be gating`);
  if (!plan.safetyCriticalMustBeCorrect) err(`${P}.safetyCriticalMustBeCorrect`, 'CP_SAFETY_GATE', 'safety-critical items must gate (D-06)');
  if (!/education/i.test(plan.disclaimer) || !/not .*permission|never permission/i.test(plan.disclaimer)) err(`${P}.disclaimer`, 'CP_DISCLAIMER', 'disclaimer must say education only and not permission to trade');

  // Coverage of what actually resolved
  const safetyTopics: CheckpointBuild['coverage']['safetyTopics'] = {};
  for (const q of resolved) if (q.safetyCritical && q.safetyTopic) safetyTopics[q.safetyTopic] = (safetyTopics[q.safetyTopic] ?? 0) + 1;
  const abstainItems = resolved.filter(bestAnswerIsAbstain).length;
  const status: CheckpointBuild['status'] = gaps.length === 0 ? 'ready' : 'incomplete';
  const coverageIssue = status === 'ready' ? err : warn;
  for (const t of plan.mandatorySafetyTopics) if (!safetyTopics[t]) coverageIssue(`${P}`, 'CP_MANDATORY_TOPIC_UNRESOLVED', `no resolved safety-critical ${t} item yet`);
  if (abstainItems < plan.minAbstainItems) coverageIssue(`${P}`, 'CP_ABSTAIN_MIN', `${abstainItems} resolved abstain items; need ≥${plan.minAbstainItems}`);

  const config: CheckpointConfig = {
    id: plan.id, title: plan.title, afterLessonId: plan.afterLessonId, coversLessonIds: [...plan.coversLessonIds],
    questionIds, items, passThreshold: plan.passThreshold, safetyCriticalMustBeCorrect: plan.safetyCriticalMustBeCorrect,
    gating: plan.gating, questionCount: { ...plan.questionCount }, disclaimer: plan.disclaimer, version: plan.version,
  };
  const contract = validateCheckpoint(config);
  if (!contract.ok) for (const e of contract.errors) {
    // While incomplete, the contract's count check is expected to fail; everything else is a real error.
    if (status === 'incomplete' && e.code === 'COUNT' && e.path.endsWith('questionCount')) warn(e.path, 'CP_COUNT_PENDING', e.message);
    else err(e.path, e.code, e.message);
  }
  const manifest = buildManifest({
    scope: { kind: 'checkpoint', checkpointId: plan.id }, contentVersion: plan.version, questions: resolved,
    policy: { passThreshold: plan.passThreshold, safetyCriticalMustBeCorrect: plan.safetyCriticalMustBeCorrect },
  });
  return {
    plan, status, config, manifest, resolvedQuestions: resolved, plannedCount, resolvedCount: resolved.length, gaps,
    coverage: { byLesson, safetyTopics, abstainItems },
    report: { ok: errors.length === 0, errors, warnings },
  };
}
