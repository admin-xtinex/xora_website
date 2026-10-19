/**
 * One question. Native form controls only (radio / checkbox / text / buttons) so keyboard and screen-reader support
 * come from the platform: Tab moves between groups, arrow keys move within a radio group, Space toggles checkboxes.
 */
import type { ReactNode } from 'react';
import type { ChoiceId, Question } from '../../contracts';
import type { LearnerResponse } from '../engine/types';
import { plainRichText, richTextToPlain, type RichTextRenderer } from './RichText';

export interface QuestionViewProps {
  question: Question;
  choiceOrder: readonly ChoiceId[];
  response: LearnerResponse | undefined;
  numericDraft?: string;
  locked: boolean;
  index: number;
  total: number;
  onSelect(choiceId: ChoiceId): void;
  onNumeric(raw: string): void;
  onMove(choiceId: ChoiceId, delta: -1 | 1): void;
  renderRichText?: RichTextRenderer;
  /** Slot for chart/fixture figures (EDGE-07/08 renderers). */
  renderFixture?: (fixtureId: string) => ReactNode;
}

export function QuestionView(p: QuestionViewProps) {
  const q = p.question;
  const rt = p.renderRichText ?? plainRichText;
  const byId = new Map((q.choices ?? []).map((c) => [c.id, c]));
  const selected = new Set(p.response?.choiceIds ?? []);
  const hintId = `${q.id}-hint`;
  const hint = q.type === 'multi' ? 'Select every answer that applies.'
    : q.type === 'ordering' ? 'Put the steps in the correct order using the Move up and Move down buttons.'
    : q.type === 'numeric' ? 'Type a number.' : 'Choose one answer.';
  return (
    <fieldset className="fe-assess-question" data-question-id={q.id} aria-describedby={hintId} disabled={p.locked}>
      <legend className="fe-assess-question__prompt">
        <span className="fe-assess-question__count">Question {p.index + 1} of {p.total}</span>
        {q.safetyCritical ? <span className="fe-assess-badge fe-assess-badge--safety">Safety-critical</span> : null}
        <span className="fe-assess-question__text">{rt(q.prompt)}</span>
      </legend>
      {q.fixtureId && p.renderFixture ? <div className="fe-assess-question__figure">{p.renderFixture(q.fixtureId)}</div> : null}
      <p id={hintId} className="fe-assess-hint">{hint}</p>
      {q.type === 'numeric' ? (
        <div className="fe-assess-numeric">
          <label htmlFor={`${q.id}-input`}>Your answer{q.answer.kind === 'numeric' && q.answer.unit ? ` (${q.answer.unit})` : ''}</label>
          <input
            id={`${q.id}-input`} name={q.id} type="text" inputMode="decimal" autoComplete="off"
            value={p.numericDraft ?? (p.response?.numeric !== undefined ? String(p.response.numeric) : '')}
            onChange={(e) => p.onNumeric(e.currentTarget.value)}
          />
        </div>
      ) : q.type === 'ordering' ? (
        <ol className="fe-assess-order">
          {(p.response?.choiceIds ?? p.choiceOrder).map((id, i, arr) => {
            const label = richTextToPlain(byId.get(id)?.text ?? id);
            return (
              <li key={id} data-choice-id={id}>
                <span className="fe-assess-order__text">{rt(byId.get(id)?.text ?? id)}</span>
                <button type="button" onClick={() => p.onMove(id, -1)} disabled={p.locked || i === 0} aria-label={`Move "${label}" up`}>Move up</button>
                <button type="button" onClick={() => p.onMove(id, 1)} disabled={p.locked || i === arr.length - 1} aria-label={`Move "${label}" down`}>Move down</button>
              </li>
            );
          })}
        </ol>
      ) : (
        <ul className="fe-assess-choices" role="presentation">
          {p.choiceOrder.map((id) => {
            const c = byId.get(id);
            if (!c) return null;
            const inputId = `${q.id}-${id}`;
            return (
              <li key={id}>
                <input
                  id={inputId} type={q.type === 'multi' ? 'checkbox' : 'radio'} name={q.id} value={id}
                  checked={selected.has(id)} onChange={() => p.onSelect(id)}
                />
                <label htmlFor={inputId}>{rt(c.text)}</label>
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}
