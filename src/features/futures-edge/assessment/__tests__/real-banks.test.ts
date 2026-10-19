/**
 * Engine + validators over REAL lesson banks (read-only). Sources: in-repo content (none on this branch until the
 * author PRs merge) plus FE_BANK_ROOTS (e.g. the staged drafts on the box). Assertions that need specific lessons
 * only run when those lessons are loaded; otherwise the test says so in its name instead of passing vacuously.
 */
import { describe, it, assert, skip } from './harness';
import { loadLessons } from '../tools/load-banks';
import { validateLessonQuestionSet, validatePhase5Abstention, bestAnswerIsAbstain } from '../question-sets/validator';
import { buildLessonManifest, verifyManifest } from '../question-sets/manifest';
import { buildQuestionBank } from '../question-sets/bank';
import { buildCheckpoint } from '../checkpoints/build';
import { CP1_PLAN } from '../checkpoints/cp1';
import { CPA_PLAN } from '../checkpoints/cpa';
import { CPB_PLAN } from '../checkpoints/cpb';
import { gradeAttempt, policyFromLesson } from '../engine/grader';
import { validateCheckpoint, type LessonId } from '../../contracts';

const loaded = await loadLessons();
const lessons = loaded.map((l) => l.lesson);
const ids = new Set<string>(lessons.map((l) => l.id));
const has = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => `T${String(from + i).padStart(2, '0')}`).every((id) => ids.has(id));
const bank = buildQuestionBank(lessons);

describe(`real lesson banks (${lessons.length} loaded: ${[...ids].join(' ') || 'none'})`, () => {
  it('no lesson id is loaded twice and the bank has no duplicate question ids', () => {
    assert.equal(ids.size, lessons.length);
    assert.deepEqual(bank.issues, []);
  });
  for (const { lesson, source } of loaded) {
    it(`${lesson.id} (${source.split('/').slice(-4).join('/')}): EDGE-09 validation 0 errors; keyed answers grade 100%; manifest verifies`, () => {
      const v = validateLessonQuestionSet(lesson);
      assert.deepEqual(v.errors, [], JSON.stringify(v.errors));
      const m = buildLessonManifest(lesson);
      assert.ok(verifyManifest(m));
      const responses = Object.fromEntries(m.questions.map((q) => [q.id, q.answer.kind === 'numeric' ? { numeric: q.answer.value } : { choiceIds: q.answer.kind === 'choice' ? [q.answer.choiceId] : [...q.answer.choiceIds] }]));
      const r = gradeAttempt({ scope: m.scope, questionSetVersion: m.questionSetVersion, questions: m.questions, responses, policy: policyFromLesson(lesson), attemptId: 'k', startedAt: 'x', finishedAt: 'x' });
      assert.equal(r.score, 1); assert.equal(r.passed, true); assert.equal(r.authorizesLiveTrading, false);
    });
  }
  const p5 = lessons.filter((l) => l.phaseId === 'P5');
  it(`Phase 5 abstention rule over the loaded P5 lessons (${p5.length}/5)`, () => {
    assert.deepEqual(validatePhase5Abstention(p5, { partial: p5.length < 5 }).errors, []);
    for (const l of p5) assert.ok(l.quizQuestions.some(bestAnswerIsAbstain), l.id);
  });
  if (has(1, 4)) {
    it('CP1: 8 referenced items resolve; T03-Q04 is safety-critical stablecoin-risk, T04-Q03 account-security; contract-valid; non-gating', () => {
      const b = buildCheckpoint(CP1_PLAN, bank);
      assert.deepEqual(b.report.errors, [], JSON.stringify(b.report.errors));
      assert.equal(b.status, 'ready'); assert.equal(b.resolvedCount, 8); assert.equal(b.config.gating, false);
      const t03 = bank.byId.get('T03-Q04'); const t04 = bank.byId.get('T04-Q03');
      assert.equal(t03?.safetyCritical, true); assert.equal(t03?.safetyTopic, 'stablecoin-risk');
      assert.equal(t04?.safetyCritical, true); assert.equal(t04?.safetyTopic, 'account-security');
      const cv = validateCheckpoint(b.config); assert.ok(cv.ok, cv.ok ? '' : JSON.stringify(cv.errors));
    });
  } else skip('CP1 real-bank check', 'T01–T04 not loaded');
  if (has(1, 13)) {
    it('CPA: 24 referenced items resolve (T01–T13), all mandatory topics, no expectation mismatches', () => {
      const b = buildCheckpoint(CPA_PLAN, bank);
      assert.deepEqual(b.report.errors, [], JSON.stringify(b.report.errors));
      assert.equal(b.status, 'ready'); assert.equal(b.resolvedCount, 24);
      for (const t of CPA_PLAN.mandatorySafetyTopics) assert.ok((b.coverage.safetyTopics[t] ?? 0) > 0, t);
    });
  } else skip('CPA real-bank check', 'T01–T13 not all loaded');
  it('CPB: every referenced id whose lesson is loaded resolves; resolved + gaps = planned; preview until complete', () => {
    const b = buildCheckpoint(CPB_PLAN, bank);
    assert.deepEqual(b.report.errors, [], JSON.stringify(b.report.errors));
    for (const s of CPB_PLAN.slots) if (s.kind === 'lesson-question' && ids.has(s.lessonId as LessonId)) assert.ok(bank.byId.has(s.questionId), `${s.questionId} missing from loaded ${s.lessonId}`);
    assert.equal(b.resolvedCount + b.gaps.reduce((n, g) => n + g.count, 0), b.plannedCount);
    assert.equal(b.status, 'incomplete', 'CPB-Q01..Q05 are not authored yet');
  });
});
