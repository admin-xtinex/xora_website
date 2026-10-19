/** Attempt verdict + retry options. Retries are unlimited unless a policy says otherwise (education, not gatekeeping). */
import type { AttemptResult, FailReason } from '../engine/types';
import { STALE_ATTEMPT_NOTE, THRESHOLD_NOTE } from '../engine/strings';

const REASON_TEXT: Record<FailReason, string> = {
  BELOW_THRESHOLD: 'The score is below the pass mark.',
  SAFETY_CRITICAL_WRONG: 'At least one safety-critical answer was wrong. This blocks a pass at any score.',
  INCOMPLETE: 'Some questions were not answered.',
  SAFETY_REANSWER_MISSING: 'A safety-critical question you missed last time was not answered again.',
  STALE_QUESTION_SET: STALE_ATTEMPT_NOTE,
};

const pct = (x: number) => `${Math.round(x * 100)}%`;

export function RetryPanel({ result, onRetry, onRemediate, attemptsRemaining = null }: {
  result: AttemptResult;
  onRetry?: () => void;
  /** Offered when the score met the threshold and only safety-critical items are missing. */
  onRemediate?: () => void;
  attemptsRemaining?: number | null;
}) {
  const canRemediate = result.kind === 'full' && result.meetsThreshold && !result.passed
    && result.failReasons.every((r) => r === 'SAFETY_CRITICAL_WRONG') && onRemediate !== undefined;
  return (
    <section className="fe-assess-retry" aria-labelledby="fe-assess-retry-title" data-passed={result.passed ? 'true' : 'false'}>
      <h3 id="fe-assess-retry-title">{result.kind === 'practice' ? 'Practice round finished (not scored)' : result.passed ? 'Passed (education only)' : 'Not passed yet'}</h3>
      <p>
        Score: {result.correctCount} of {result.total} ({pct(result.score)}). Pass mark: {pct(result.passThreshold)}.{' '}
        <span className="fe-assess-retry__note">{THRESHOLD_NOTE}</span>
      </p>
      {result.failReasons.length ? <ul className="fe-assess-retry__reasons">{result.failReasons.map((r) => <li key={r} data-reason={r}>{REASON_TEXT[r]}</li>)}</ul> : null}
      <div className="fe-assess-retry__actions">
        {canRemediate ? <button type="button" onClick={onRemediate}>Re-answer the safety-critical questions</button> : null}
        {onRetry && attemptsRemaining !== 0 ? <button type="button" onClick={onRetry}>{result.passed ? 'Practise again' : 'Retake quiz'}</button> : null}
        {attemptsRemaining !== null ? <p>{attemptsRemaining} attempt(s) left.</p> : null}
      </div>
    </section>
  );
}
