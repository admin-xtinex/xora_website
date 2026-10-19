/**
 * Engine + validators over REAL lesson banks (read-only). Sources: in-repo content (none on this branch until the
 * author PRs merge) plus FE_BANK_ROOTS (e.g. the staged drafts on the box). Assertions that need specific lessons
 * only run when those lessons are loaded; otherwise the test says so in its name instead of passing vacuously.
 */
import { describe, it, assert, skip } from './harness';
import { loadLessons, loadLessonFixtures } from '../tools/load-banks';
import { validateLessonQuestionSet, validatePhase5Abstention, bestAnswerIsAbstain } from '../question-sets/validator';
import { buildLessonManifest, verifyManifest } from '../question-sets/manifest';
import { buildQuestionBank } from '../question-sets/bank';
import { buildCheckpoint } from '../checkpoints/build';
import { CP1_PLAN } from '../checkpoints/cp1';
import { CPA_PLAN } from '../checkpoints/cpa';
import { CPB_PLAN } from '../checkpoints/cpb';
import { CPB_ITEMS } from '../checkpoints/cpb-items';
import { anchorIndexFromLessons, resolveRemediationTarget } from '../engine/remediation';
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
  it('CPB: every referenced id whose lesson is loaded resolves; resolved + gaps = planned; never READY while Q03/Q04 await confirmation', () => {
    const b = buildCheckpoint(CPB_PLAN, bank, CPB_ITEMS);
    assert.deepEqual(b.report.errors, [], JSON.stringify(b.report.errors));
    for (const s of CPB_PLAN.slots) if (s.kind === 'lesson-question' && ids.has(s.lessonId as LessonId)) assert.ok(bank.byId.has(s.questionId), `${s.questionId} missing from loaded ${s.lessonId}`);
    assert.equal(b.resolvedCount + b.gaps.reduce((n, g) => n + g.count, 0), b.plannedCount);
    assert.notEqual(b.status, 'ready', 'CPB-Q03/Q04 are pending confirmation of the v1.3.1 simulator ids');
    assert.ok(!bank.byId.has('T17-Q02') || !ids.has('T17'), 'T17-Q02 is retired by EDGE-05');
  });
});

describe('CPB with the real T14–T23 banks', () => {
  if (has(14, 23)) {
    it('CPB 26/26 resolved, 0 errors, all mandatory topics, ≥3 abstain items, status provisional (Q03/Q04 pending)', () => {
      const b = buildCheckpoint(CPB_PLAN, bank, CPB_ITEMS);
      assert.deepEqual(b.report.errors, [], JSON.stringify(b.report.errors));
      assert.equal(b.resolvedCount, 26); assert.deepEqual(b.gaps, []); assert.equal(b.status, 'provisional');
      for (const t of CPB_PLAN.mandatorySafetyTopics) assert.ok((b.coverage.safetyTopics[t] ?? 0) > 0, t);
      assert.ok(b.coverage.abstainItems >= 3);
      const q6 = bank.byId.get('T17-Q06');
      assert.ok(q6?.safetyCritical && q6.safetyTopic === 'leverage'); assert.deepEqual(q6.remediationRef, { lessonId: 'T12', anchorId: 'T12-S03' });
    });
    it('every CPB remediation link (lesson items + CPB items) resolves to an anchor that exists in the loaded lessons', () => {
      const idx = anchorIndexFromLessons(lessons);
      const b = buildCheckpoint(CPB_PLAN, bank, CPB_ITEMS);
      for (const q of b.resolvedQuestions) if (q.remediationRef?.anchorId) {
        const t = resolveRemediationTarget(q, { anchorExists: idx });
        assert.equal(t.anchorId, q.remediationRef.anchorId, `${q.id} → ${q.remediationRef.anchorId}: ${t.fallbackReason ?? ''}`);
      }
    });
  } else skip('CPB full real-bank check', 'T14–T23 not all loaded');
  const t16 = loaded.find((l) => l.lesson.id === 'T16'); const t17 = loaded.find((l) => l.lesson.id === 'T17');
  if (t16 && t17) {
    it('CPB-Q01/Q02/Q05 numbers match EDGE-05 fixtures FX-T16-CHART-C-01 and FX-T17-BRANCHES-01 (recomputed, read-only)', async () => {
      type C = { h: number; l: number; c: number };
      const fx = [...(await loadLessonFixtures(t16)), ...(await loadLessonFixtures(t17))];
      const chartC = fx.find((f) => f.id === 'FX-T16-CHART-C-01'); const br = fx.find((f) => f.id === 'FX-T17-BRANCHES-01');
      assert.ok(chartC?.fictional && br?.fictional, 'fixtures present and fictional');
      const cs = (chartC.data as { candles: C[] }).candles;
      const swing = (k: 'h' | 'l') => cs.flatMap((x, i) => i >= 2 && i < cs.length - 2 && [-2, -1, 1, 2].every((d) => k === 'h' ? x.h > cs[i + d]!.h : x.l < cs[i + d]!.l) ? [[i + 1, x[k]] as const] : []);
      assert.deepEqual(swing('h'), [[3, 2022], [9, 2021], [15, 2022]]);
      assert.deepEqual(swing('l'), [[6, 2000], [12, 2001]]);
      const paths = (br.data as { paths: Array<{ id: string; candles: C[] }> }).paths;
      const fake = paths.find((p) => p.id === 'fakeout')!.candles; const up = paths.find((p) => p.id === 'breakout')!.candles;
      assert.deepEqual([fake[0]!.h, fake[0]!.c, fake[1]!.c, fake[2]!.c], [2061, 2049, 2038, 2030]);
      assert.ok(fake.every((x) => x.c <= 2051), 'no fakeout candle closes above the zone top');
      assert.equal(up[0]!.c, 2058); assert.ok(up[1]!.l <= 2051 && up[1]!.c > 2051, 'breakout retest dips into the zone and closes above it');
    });
  } else skip('CPB-Q01/Q02/Q05 fixture cross-check', 'T16/T17 not loaded');
});
