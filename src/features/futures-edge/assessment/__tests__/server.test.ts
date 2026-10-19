import { describe, it, assert } from './harness';
import { serverGradeSubmission, ServerBackedProgressAdapter, type ServerAssessmentTransport } from '../progress/server-adapter';
import { buildManifest, type QuestionSetManifest } from '../question-sets/manifest';
import { SAMPLE_SET, ALL_CORRECT } from './fixtures/sample';

const m = buildManifest({ scope: { kind: 'checkpoint', checkpointId: 'CPB' }, contentVersion: '0.1.0', questions: SAMPLE_SET, policy: { passThreshold: 0.8, safetyCriticalMustBeCorrect: true } });
const registry = new Map<string, QuestionSetManifest>([[m.questionSetVersion, m]]);
const now = '2026-10-19T03:00:00.000Z';
const sub = (over: Record<string, unknown> = {}) => ({ scope: m.scope, questionSetVersion: m.questionSetVersion, attemptId: 'a1', kind: 'full', startedAt: now, responses: {}, ...over });

describe('server-side grading reference (production migration path)', () => {
  it('ignores client-supplied score/passed/correct fields: an empty submission claiming 100% fails', () => {
    const r = serverGradeSubmission(registry, sub({ score: 1, passed: true, correctCount: 8, results: [{ correct: true }] }), now);
    assert.ok(r.ok);
    if (r.ok) { assert.equal(r.graded.result.passed, false); assert.equal(r.graded.result.correctCount, 0); assert.equal(r.graded.gradedBy, 'server'); }
  });
  it('grades real responses from the registered manifest', () => {
    const r = serverGradeSubmission(registry, sub({ responses: ALL_CORRECT }), now);
    assert.ok(r.ok && r.graded.result.passed && r.graded.result.authorizesLiveTrading === false);
  });
  it('rejects unknown question-set versions, scope mismatch and malformed bodies', () => {
    const forged = serverGradeSubmission(registry, sub({ questionSetVersion: '0.1.0+c.000000000000.g.000000000000' }), now);
    assert.deepEqual(forged, { ok: false, code: 'UNKNOWN_QUESTION_SET' });
    assert.deepEqual(serverGradeSubmission(registry, sub({ scope: { kind: 'checkpoint', checkpointId: 'CPA' } }), now), { ok: false, code: 'SCOPE_MISMATCH' });
    assert.deepEqual(serverGradeSubmission(registry, 'nope', now), { ok: false, code: 'BAD_SUBMISSION' });
    assert.deepEqual(serverGradeSubmission(registry, sub({ kind: 'practice' }), now), { ok: false, code: 'BAD_SUBMISSION' });
  });
  it('drops malformed responses instead of trusting them', () => {
    const r = serverGradeSubmission(registry, sub({ responses: { 'CPB-Q01': { choiceIds: 'wait' }, 'CPB-Q99': { choiceIds: ['x'] } } }), now);
    assert.ok(r.ok && r.graded.result.results.find((x) => x.questionId === 'CPB-Q01')?.status === 'unanswered');
  });
  it('remediation: only the base attempt\'s missed safety items, combined verdict computed by the server', () => {
    const base = serverGradeSubmission(registry, sub({ responses: { ...ALL_CORRECT, 'CPB-Q03': { choiceIds: ['true'] } } }), now);
    assert.ok(base.ok);
    if (!base.ok) return;
    assert.equal(base.graded.result.passed, false);
    assert.deepEqual(serverGradeSubmission(registry, sub({ kind: 'remediation', attemptId: 'a1~rem1', remediatesAttemptId: 'zzz' }), now, () => undefined), { ok: false, code: 'REMEDIATION_BASE_MISSING' });
    const rem = serverGradeSubmission(registry, sub({ kind: 'remediation', attemptId: 'a1~rem1', remediatesAttemptId: 'a1', responses: { 'CPB-Q03': { choiceIds: ['false'] } } }), now, () => base.graded.result);
    assert.ok(rem.ok);
    if (rem.ok) { assert.deepEqual(rem.graded.result.results.map((x) => x.questionId), ['CPB-Q03']); assert.equal(rem.graded.combinedPassed, true); }
  });
  it('ServerBackedProgressAdapter refuses client-graded attempts and sends only activity fields', async () => {
    const sent: unknown[] = [];
    const t: ServerAssessmentTransport = {
      getLessonProgress: async () => null, listLessonProgress: async () => [], putLessonActivity: async (u) => { sent.push(u); },
      listLessonAttempts: async () => [], getCheckpointProgress: async () => null,
      submitAttempt: async () => { throw new Error('not used'); }, clearMyProgress: async () => {},
    };
    const a = new ServerBackedProgressAdapter(t);
    await assert.rejects(() => a.appendLessonAttempt(), /CLIENT_ATTEMPTS_NOT_ACCEPTED/);
    await a.saveLesson({ schemaVersion: '1.1.0', userId: 'x', lessonId: 'T12', contentVersion: '1.0.0', lastStepId: null, viewed: [], practiced: [], assessed: { attempted: 1, bestScore: 1, passed: true }, completed: true, completedAt: now } as never);
    assert.deepEqual(Object.keys(sent[0] as object).sort(), ['contentVersion', 'lastStepId', 'lessonId', 'practiced', 'viewed']);
  });
});
