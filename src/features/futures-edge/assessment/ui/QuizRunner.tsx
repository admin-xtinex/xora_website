/**
 * QuizRunner: lesson mini-quiz (immediate feedback) or checkpoint exam (feedback at the end).
 * State lives in the pure sessionReducer; pass `initialState` to render any state in tests or to restore a session.
 */
import { useEffect, useReducer, useRef, type ReactNode } from 'react';
import {
  answeredCount, blockedByRemediation, currentQuestion, initSession, sessionReducer,
  type SessionConfig, type SessionState,
} from '../engine/session';
import type { AttemptResult } from '../engine/types';
import { SAFETY_TOPIC_LABELS } from '../engine/strings';
import { EducationOnlyNotice } from './EducationOnlyNotice';
import { FeedbackPanel } from './FeedbackPanel';
import { QuestionView } from './QuestionView';
import { RetryPanel } from './RetryPanel';
import { SafetyCriticalCallout } from './SafetyCriticalCallout';
import { plainRichText, type RichTextRenderer } from './RichText';

export interface QuizRunnerProps {
  config: SessionConfig;
  title: string;
  newAttemptId: () => string;
  now: () => string;
  initialState?: SessionState;
  onFinish?: (result: AttemptResult) => void;
  onRetry?: (last: AttemptResult) => void;
  onRemediate?: (last: AttemptResult) => void;
  onOpenRemediation?: (lessonId: string, anchorId?: string) => void;
  renderRichText?: RichTextRenderer;
  renderFixture?: (fixtureId: string) => ReactNode;
}

export function QuizRunner(props: QuizRunnerProps) {
  const [state, dispatch] = useReducer(sessionReducer, props.initialState ?? initSession(props.config, props.now()));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const finishedRef = useRef(false);
  const rt = props.renderRichText ?? plainRichText;
  useEffect(() => { headingRef.current?.focus(); }, [state.index, state.phase]);
  useEffect(() => {
    if (state.phase === 'finished' && state.result && !finishedRef.current) { finishedRef.current = true; props.onFinish?.(state.result); }
  }, [state.phase, state.result, props]);

  const total = state.config.plan.questionOrder.length;
  const kindLabel = state.config.plan.kind === 'remediation' ? 'Safety re-check' : state.config.plan.kind === 'practice' ? 'Practice (not scored)' : null;

  if (state.phase === 'finished' && state.result) {
    const r = state.result;
    return (
      <section className="fe-assess-runner" aria-labelledby="fe-assess-runner-title">
        <h2 id="fe-assess-runner-title" ref={headingRef} tabIndex={-1}>{props.title}: results</h2>
        <SafetyCriticalCallout
          failures={r.safetyFailures} renderRichText={rt}
          {...(props.onOpenRemediation ? { onOpenRemediation: (f: (typeof r.safetyFailures)[number]) => props.onOpenRemediation?.(f.remediationRef?.lessonId ?? r.results.find((x) => x.questionId === f.questionId)?.linkedLessonId ?? '', f.remediationRef?.anchorId) } : {})}
        />
        <RetryPanel
          result={r}
          {...(props.onRetry ? { onRetry: () => props.onRetry?.(r) } : {})}
          {...(props.onRemediate ? { onRemediate: () => props.onRemediate?.(r) } : {})}
        />
        <h3>Review every answer</h3>
        <ol className="fe-assess-review">
          {r.results.map((x) => (
            <li key={x.questionId}>
              <p className="fe-assess-review__prompt">{rt(x.prompt)}</p>
              <FeedbackPanel result={x} renderRichText={rt} live={false} />
            </li>
          ))}
        </ol>
        <EducationOnlyNotice />
      </section>
    );
  }

  const q = currentQuestion(state);
  if (!q) return <p role="alert">This quiz has no questions yet.</p>;
  const checked = state.checked[q.id];
  const needsAck = blockedByRemediation(state, q.id);
  const ack = state.config.plan.remediationRequired.find((x) => x.questionId === q.id);
  const isLast = state.index === total - 1;
  return (
    <section className="fe-assess-runner" aria-labelledby="fe-assess-runner-title">
      <h2 id="fe-assess-runner-title" ref={headingRef} tabIndex={-1}>{props.title}{kindLabel ? ` · ${kindLabel}` : ''}</h2>
      <div className="fe-assess-runner__progress" role="progressbar" aria-label="Question position" aria-valuemin={1} aria-valuemax={total} aria-valuenow={state.index + 1} aria-valuetext={`Question ${state.index + 1} of ${total}`}>
        <span className="fe-assess-runner__bar" style={{ width: `${Math.round(((state.index + 1) / Math.max(total, 1)) * 100)}%` }} />
      </div>
      <p className="fe-assess-runner__status" aria-live="polite">Answered {answeredCount(state)} of {total}.</p>
      {needsAck && ack ? (
        <section className="fe-assess-safety" role="alert" aria-label="Read the correction first">
          <h3>Before you answer again: {SAFETY_TOPIC_LABELS[ack.safetyTopic] ?? ack.safetyTopic}</h3>
          <p>{rt(ack.correction)}</p>
          <button type="button" onClick={() => dispatch({ type: 'acknowledge', questionId: q.id })}>I have read the correction</button>
        </section>
      ) : null}
      <form onSubmit={(e) => { e.preventDefault(); if (state.config.feedbackMode === 'immediate' && !checked) dispatch({ type: 'check', questionId: q.id }); }}>
        <QuestionView
          question={q} choiceOrder={state.config.plan.choiceOrder[q.id] ?? (q.choices ?? []).map((c) => c.id)}
          response={state.responses[q.id]} locked={checked !== undefined || needsAck} index={state.index} total={total}
          onSelect={(choiceId) => dispatch({ type: 'select', questionId: q.id, choiceId })}
          onNumeric={(raw) => dispatch({ type: 'numeric', questionId: q.id, raw })}
          onMove={(choiceId, delta) => dispatch({ type: 'move', questionId: q.id, choiceId, delta })}
          renderRichText={rt}
          {...(state.numericDrafts[q.id] !== undefined ? { numericDraft: state.numericDrafts[q.id] as string } : {})}
          {...(props.renderFixture ? { renderFixture: props.renderFixture } : {})}
        />
        {state.config.feedbackMode === 'immediate' && !checked ? (
          <button type="submit" disabled={state.responses[q.id] === undefined || needsAck}>Check answer</button>
        ) : null}
      </form>
      {checked ? (
        <>
          <FeedbackPanel result={checked} renderRichText={rt} />
          {checked.safetyCritical && !checked.correct ? (
            <p className="fe-assess-safety__inline" role="note">This is a safety-critical question. The quiz cannot be passed until it is answered correctly.</p>
          ) : null}
        </>
      ) : null}
      <nav className="fe-assess-runner__nav" aria-label="Question navigation">
        <button type="button" onClick={() => dispatch({ type: 'prev' })} disabled={state.index === 0}>Previous</button>
        {!isLast ? <button type="button" onClick={() => dispatch({ type: 'next' })}>Next</button> : null}
        {isLast || answeredCount(state) === total ? (
          <button type="button" onClick={() => dispatch({ type: 'submit', attemptId: props.newAttemptId(), nowIso: props.now() })}>
            {state.config.plan.kind === 'practice' ? 'Finish practice' : 'Submit answers'}
          </button>
        ) : null}
      </nav>
      <EducationOnlyNotice compact />
    </section>
  );
}
