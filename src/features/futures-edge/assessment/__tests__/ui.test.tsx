import { describe, it, assert } from './harness';
import { renderToStaticMarkup } from 'react-dom/server';
import { QuizRunner } from '../ui/QuizRunner';
import { CheckpointGate } from '../ui/CheckpointGate';
import { ProgressDisplay } from '../ui/ProgressDisplay';
import { EducationOnlyNotice } from '../ui/EducationOnlyNotice';
import { initSession, sessionReducer, type SessionConfig, type SessionState } from '../engine/session';
import { planFirstAttempt } from '../engine/retry';
import { resolveScoringPolicy } from '../engine/grader';
import { buildManifest } from '../question-sets/manifest';
import { checkpointGate } from '../checkpoints/gate';
import { CPA_PLAN } from '../checkpoints/cpa';
import { ProgressService } from '../progress/service';
import { LocalOnlyDemoProgressAdapter } from '../progress/local-demo-adapter';
import { MemoryStorage } from '../progress/storage';
import { EDUCATION_ONLY_NOTICE, LOCAL_DEMO_LABEL } from '../engine/strings';
import { SAMPLE_SET, ALL_CORRECT } from './fixtures/sample';
import type { QuestionId } from '../../contracts';

const now = () => '2026-10-19T03:00:00.000Z';
const m = buildManifest({ scope: { kind: 'checkpoint', checkpointId: 'CPB' }, contentVersion: '0.1.0', questions: SAMPLE_SET, policy: { passThreshold: 0.8, safetyCriticalMustBeCorrect: true } });
const config = (feedbackMode: SessionConfig['feedbackMode']): SessionConfig => ({ scope: m.scope, questions: m.questions, plan: planFirstAttempt(m, 'seed-ui'), policy: resolveScoringPolicy({}), feedbackMode });
const render = (s: SessionState, title = 'Checkpoint B') => renderToStaticMarkup(<QuizRunner config={s.config} initialState={s} title={title} newAttemptId={() => 'a1'} now={now} onRetry={() => {}} onRemediate={() => {}} onOpenRemediation={() => {}} />);
const answerAll = (s: SessionState, resp: Record<string, { choiceIds?: string[]; numeric?: number }>) => {
  let st = s;
  for (const id of s.config.plan.questionOrder) {
    const r = resp[id]; if (!r) continue;
    st = { ...st, responses: { ...st.responses, [id as QuestionId]: r } };
  }
  return sessionReducer(st, { type: 'submit', attemptId: 'a1', nowIso: now() });
};

describe('UI render tests (renderToStaticMarkup)', () => {
  it('answering state: native fieldset/legend + radios, progress bar, education notice', () => {
    const html = render(initSession(config('end'), now()));
    assert.match(html, /<fieldset/); assert.match(html, /<legend/);
    assert.match(html, /type="radio"|type="checkbox"/);
    assert.match(html, /role="progressbar"/); assert.match(html, /aria-valuemax="8"/);
    assert.ok(html.includes(EDUCATION_ONLY_NOTICE.slice(0, 40)), 'education-only notice present');
  });
  it('every question type renders with an accessible control', () => {
    for (let i = 0; i < 8; i++) {
      const s = { ...initSession(config('end'), now()), index: i };
      const html = render(s);
      assert.ok(/type="radio"|type="checkbox"|inputMode="decimal"|inputmode="decimal"|aria-label="Move /.test(html), `question index ${i}`);
    }
  });
  it('ordering questions expose labelled Move up/down buttons', () => {
    const i = config('end').plan.questionOrder.indexOf('CPB-Q05');
    const html = render({ ...initSession(config('end'), now()), index: i });
    assert.match(html, /aria-label="Move [^"]+ up"/); assert.match(html, /aria-label="Move [^"]+ down"/);
  });
  it('immediate mode: checked answer shows per-choice feedback in a polite live region', () => {
    let s = initSession(config('immediate'), now());
    const id = s.config.plan.questionOrder[0]!;
    const q = SAMPLE_SET.find((x) => x.id === id)!;
    const wrong = q.choices?.find((c) => q.answer.kind === 'choice' && c.id !== q.answer.choiceId)?.id ?? 'x';
    s = sessionReducer(s, q.type === 'numeric' ? { type: 'numeric', questionId: id, raw: '1' } : { type: 'select', questionId: id, choiceId: wrong });
    s = sessionReducer(s, { type: 'check', questionId: id });
    const html = render(s);
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /Not quite|Incorrect|correct answer/i);
  });
  it('finished, safety item missed: role=alert safety callout with topic and remediation action', () => {
    const s = answerAll(initSession(config('end'), now()), { ...ALL_CORRECT, 'CPB-Q03': { choiceIds: ['true'] } });
    const html = render(s);
    assert.match(html, /role="alert"/);
    assert.match(html, /Leverage/);
    assert.match(html, /Re-check|re-answer|safety/i);
    assert.ok(html.includes(EDUCATION_ONLY_NOTICE.slice(0, 40)));
  });
  it('finished, all correct: pass text never implies trading readiness', () => {
    const html = render(answerAll(initSession(config('end'), now()), ALL_CORRECT));
    assert.match(html, /results/);
    assert.doesNotMatch(html.replaceAll('not proof that you are ready to trade', ''), /ready to trade|you can now trade|start trading/i);
    assert.match(html, /never permission to trade/i);
  });
  it('checkpoint gate + progress display show the local-only demo label', async () => {
    const svc = new ProgressService(new LocalOnlyDemoProgressAdapter({ storage: new MemoryStorage(), now }), { now });
    const summary = await svc.courseSummary();
    const gateHtml = renderToStaticMarkup(<CheckpointGate view={checkpointGate(CPA_PLAN, summary, null)} onStart={() => {}} />);
    assert.match(gateHtml, /<button/); assert.match(gateHtml, /T01|lesson/i);
    const pd = renderToStaticMarkup(<ProgressDisplay summary={summary} persistence="local-storage" />);
    assert.match(pd, /role="progressbar"/);
    assert.ok(pd.includes(LOCAL_DEMO_LABEL.slice(0, 30)), 'local-only demo label visible');
    assert.match(renderToStaticMarkup(<EducationOnlyNotice compact />), /role="note"|aria-label|<p/);
  });
});
