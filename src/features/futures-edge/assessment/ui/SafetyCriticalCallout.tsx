/**
 * Safety-critical callout: lists every wrong safety-critical item with its correction, grouped by safety topic.
 * Uses role="alert" so screen readers announce it once when it appears.
 */
import type { SafetyFailure } from '../engine/types';
import { SAFETY_FAIL_HEADLINE, SAFETY_TOPIC_LABELS } from '../engine/strings';
import { plainRichText, type RichTextRenderer } from './RichText';

export function SafetyCriticalCallout({ failures, onOpenRemediation, renderRichText, headline = SAFETY_FAIL_HEADLINE }: {
  failures: readonly SafetyFailure[];
  onOpenRemediation?: (f: SafetyFailure) => void;
  renderRichText?: RichTextRenderer;
  headline?: string;
}) {
  if (failures.length === 0) return null;
  const rt = renderRichText ?? plainRichText;
  const topics = [...new Set(failures.map((f) => f.safetyTopic))];
  return (
    <section className="fe-assess-safety" role="alert" aria-labelledby="fe-assess-safety-title" data-testid="safety-critical-callout">
      <h3 id="fe-assess-safety-title">Safety check: {topics.map((t) => SAFETY_TOPIC_LABELS[t] ?? t).join(', ')}</h3>
      <p>{headline}</p>
      <ul>
        {failures.map((f) => (
          <li key={f.questionId} data-question-id={f.questionId} data-safety-topic={f.safetyTopic}>
            <p className="fe-assess-safety__topic">{SAFETY_TOPIC_LABELS[f.safetyTopic] ?? f.safetyTopic}</p>
            <p className="fe-assess-safety__prompt">{rt(f.prompt)}</p>
            <dl>
              <dt>Your answer</dt><dd>{f.learnerAnswerText}</dd>
              <dt>Correct answer</dt><dd>{f.correctAnswerText}</dd>
              <dt>Correction</dt><dd>{rt(f.correction)}</dd>
              {f.misconception ? (<><dt>Why your answer is risky</dt><dd>{rt(f.misconception)}</dd></>) : null}
            </dl>
            {onOpenRemediation ? (
              <button type="button" onClick={() => onOpenRemediation(f)}>
                Review {f.remediationRef?.lessonId ?? 'the lesson'}{f.remediationRef?.anchorId ? ` (${f.remediationRef.anchorId})` : ''}
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
