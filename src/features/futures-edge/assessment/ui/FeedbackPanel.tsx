/** Per-question feedback: verdict, the learner's answer, the correct answer, why, and per-choice explanations. */
import type { QuestionResult } from '../engine/types';
import { DECISION_LABELS } from '../engine/strings';
import { plainRichText, type RichTextRenderer } from './RichText';

const ABSTAIN_NOTES: Partial<Record<QuestionResult['abstention']['outcome'], string>> = {
  'correct-abstain': 'Good call: not trading was the best decision here.',
  'missed-abstain': 'The best decision here was not to trade. Choosing to act anyway is the risk this question checks.',
  'abstain-word-mismatch': 'You chose not to trade, but a different decision word fits this situation better.',
  'unneeded-abstain': 'Here the plan allowed a simulated action; waiting was not required by the rules.',
};

export function FeedbackPanel({ result, showAllChoices = true, renderRichText, live = true }: {
  result: QuestionResult; showAllChoices?: boolean; renderRichText?: RichTextRenderer; live?: boolean;
}) {
  const rt = renderRichText ?? plainRichText;
  const verdict = result.correct ? 'Correct' : result.status === 'unanswered' ? 'Not answered' : 'Not quite';
  const abstainNote = ABSTAIN_NOTES[result.abstention.outcome];
  return (
    <section
      className={`fe-assess-feedback ${result.correct ? 'fe-assess-feedback--correct' : 'fe-assess-feedback--wrong'}`}
      aria-live={live ? 'polite' : undefined} aria-atomic={live ? 'true' : undefined}
      aria-label={`Feedback for ${result.questionId}`} data-question-id={result.questionId}
    >
      <h4 className="fe-assess-feedback__verdict">{verdict}{result.safetyCritical ? ' (safety-critical)' : ''}</h4>
      {!result.correct ? (
        <dl className="fe-assess-feedback__answers">
          <dt>Your answer</dt><dd>{result.learnerAnswerText}</dd>
          <dt>Correct answer</dt><dd>{result.correctAnswerText}</dd>
        </dl>
      ) : null}
      {result.misconception ? <p className="fe-assess-feedback__misconception">{rt(result.misconception)}</p> : null}
      <p className="fe-assess-feedback__rationale"><strong>Why: </strong>{rt(result.rationale)}</p>
      {abstainNote ? (
        <p className="fe-assess-feedback__abstain">
          {abstainNote}
          {result.abstention.bestDecision ? ` Best decision: ${DECISION_LABELS[result.abstention.bestDecision] ?? result.abstention.bestDecision}.` : ''}
        </p>
      ) : null}
      {showAllChoices && result.choiceFeedback.length > 0 && result.type !== 'ordering' ? (
        <details className="fe-assess-feedback__choices">
          <summary>Explain every option</summary>
          <ul>
            {result.choiceFeedback.map((c) => (
              <li key={c.choiceId} data-choice-id={c.choiceId}>
                <span>{c.isKey ? 'Correct option: ' : 'Wrong option: '}</span>{rt(c.text)}{c.selected ? ' (your choice)' : ''}
                {c.feedback && !c.isKey ? <span className="fe-assess-feedback__why"> {rt(c.feedback)}</span> : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
