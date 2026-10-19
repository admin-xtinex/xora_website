/**
 * Runs a set of questions. Lesson mode gives feedback after each answer; exam mode (checkpoints) grades at the end.
 * Choice order is shuffled only when the item allows it, with a stable seed, and choice ids never change.
 */
import { useMemo, useState } from 'react';
import type { Fixture, FixtureId, Question } from '@futures-edge/contracts';
import { feedbackFor, grade, isCorrect, seededShuffle, type GradeResult, type Response } from '../assessment/grader';
import { FixtureFigure } from './Blocks';
import { RichText } from './RichText';
import { parseNum } from '../exercises/Shell';
import { Link } from './router';

export interface QuizRunnerProps {
  questions: Question[];
  mode: 'lesson' | 'exam';
  attempt: number;
  getFixture: (id: FixtureId) => Fixture | undefined;
  onFinish: (responses: Record<string, Response>, result: GradeResult) => void;
  passThreshold: number;
}

export function QuizRunner({ questions, mode, attempt, getFixture, onFinish, passThreshold }: QuizRunnerProps) {
  const [idx, setIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const [texts, setTexts] = useState<Record<string, string>>({});
  const q = questions[idx] as Question;
  const order = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const x of questions) {
      const ids = (x.choices ?? []).map((c) => c.id);
      m.set(x.id, x.shuffleChoices || x.type === 'ordering' ? seededShuffle(ids, `${x.id}#${attempt}`) : ids);
    }
    return m;
  }, [questions, attempt]);

  if (result) {
    const passed = result.score >= passThreshold && result.safetyCriticalAllCorrect;
    const missed = result.perQuestion.filter((x) => !x.correct);
    return (
      <section className="fel-quiz-result" aria-live="polite">
        <h3>{mode === 'exam' ? 'Checkpoint result' : 'Quiz result'}</h3>
        <p className="fel-score">{result.correctCount} of {result.total} correct ({Math.round(result.score * 100)}%)</p>
        <p>{passed ? 'You reached the target score and answered every safety-critical item correctly.' : result.score >= passThreshold ? 'Good score, but at least one safety-critical item was missed. Review it below and try again.' : `The target is ${Math.round(passThreshold * 100)}%. Review the items below and try again: retries are unlimited.`}</p>
        {missed.length ? (
          <div className="fel-remediation">
            <h4>Review these</h4>
            <ul>
              {missed.map(({ question }) => (
                <li key={question.id}>
                  <p>{question.safetyCritical ? <span className="fel-chip fel-chip-warn">Safety-critical</span> : null} <RichText text={question.prompt} /></p>
                  <p className="fel-small"><strong>Correct idea: </strong><RichText text={question.rationale} /></p>
                  {question.remediationRef ? <Link className="fel-link" to={{ kind: 'lesson', id: question.remediationRef.lessonId }}>Revisit {question.remediationRef.lessonId}</Link> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="fel-small fel-muted">Scores measure understanding in this course only. They are not a qualification and never unlock real trading.</p>
      </section>
    );
  }

  const r = responses[q.id];
  const answered = !!r && ((r.choiceIds?.length ?? 0) > 0 || r.numeric !== undefined);
  const isChecked = checked[q.id] === true;
  const correct = isChecked && isCorrect(q, r);
  const setR = (n: Response) => { setResponses((s) => ({ ...s, [q.id]: n })); setChecked((c) => ({ ...c, [q.id]: false })); };
  const ids = order.get(q.id) ?? [];
  const byId = new Map((q.choices ?? []).map((c) => [c.id, c]));
  const last = idx === questions.length - 1;
  const finish = () => { const g = grade(questions, responses); setResult(g); onFinish(responses, g); };
  const multi = q.type === 'multi';

  return (
    <section className="fel-quiz" aria-label={mode === 'exam' ? 'Checkpoint questions' : 'Quiz'}>
      <p className="fel-quiz-count">Question {idx + 1} of {questions.length}{q.safetyCritical ? <span className="fel-chip fel-chip-warn">Safety-critical</span> : null}</p>
      <fieldset className="fel-question">
        <legend><RichText text={q.prompt} /></legend>
        {q.fixtureId ? <FixtureFigure fixture={getFixture(q.fixtureId)} caption="Fictional chart for this question." alt="Fictional chart for this question" /> : null}
        {q.type === 'numeric' ? (
          <label className="fel-field">
            <span>Answer {q.answer.kind === 'numeric' ? `(${q.answer.unit}${q.answer.rounding ? `, ${q.answer.rounding.decimals} dp` : ''})` : ''}</span>
            <input type="text" inputMode="decimal" value={texts[q.id] ?? ''}
              onChange={(e) => { const v = e.target.value; setTexts((t) => ({ ...t, [q.id]: v })); const n = parseNum(v); setR(n === null ? {} : { numeric: n }); }} />
          </label>
        ) : q.type === 'ordering' ? (
          <OrderingInput ids={r?.choiceIds ?? ids} labels={byId} onChange={(o) => setR({ choiceIds: o })} />
        ) : (
          <div className="fel-choices">
            {ids.map((cid) => {
              const c = byId.get(cid);
              if (!c) return null;
              const on = r?.choiceIds?.includes(cid) ?? false;
              return (
                <label key={cid} className={`fel-choice ${on ? 'is-on' : ''}`}>
                  <input type={multi ? 'checkbox' : 'radio'} name={`${q.id}-${attempt}`} checked={on}
                    onChange={() => setR({ choiceIds: multi ? (on ? (r?.choiceIds ?? []).filter((x) => x !== cid) : [...(r?.choiceIds ?? []), cid]) : [cid] })} />
                  <span>{c.decision ? <strong>DEMO {c.decision.replace('_', ' ')}: </strong> : null}<RichText text={c.text} /></span>
                </label>
              );
            })}
          </div>
        )}
      </fieldset>
      {mode === 'lesson' && isChecked ? (
        <div className={`fel-feedback ${correct ? 'fel-feedback-correct' : 'fel-feedback-incorrect'}`} role="status">
          <p><strong>{correct ? 'Correct. ' : 'Not quite. '}</strong><RichText text={feedbackFor(q, r)} /></p>
          {!correct ? <p className="fel-small">Why the right answer is right: <RichText text={q.rationale} /></p> : null}
        </div>
      ) : null}
      <div className="fel-row">
        <button type="button" className="fel-btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Previous</button>
        {mode === 'lesson' && !isChecked ? <button type="button" className="fel-btn fel-btn-primary" disabled={!answered} onClick={() => setChecked((c) => ({ ...c, [q.id]: true }))}>Check answer</button> : null}
        {(mode === 'exam' || isChecked) && !last ? <button type="button" className="fel-btn fel-btn-primary" disabled={!answered} onClick={() => setIdx(idx + 1)}>Next question</button> : null}
        {(mode === 'exam' || isChecked) && last ? <button type="button" className="fel-btn fel-btn-primary" disabled={!answered || questions.some((x) => { const y = responses[x.id]; return !y || ((y.choiceIds?.length ?? 0) === 0 && y.numeric === undefined); })} onClick={finish}>See my result</button> : null}
      </div>
    </section>
  );
}

function OrderingInput({ ids, labels, onChange }: { ids: string[]; labels: Map<string, { text: string }>; onChange: (o: string[]) => void }) {
  const move = (i: number, d: -1 | 1) => { const n = [...ids]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j] as string, n[i] as string]; onChange(n); };
  return (
    <ol className="fel-sequence">
      {ids.map((id, i) => (
        <li key={id}>
          <span className="fel-seq-text"><RichText text={labels.get(id)?.text ?? id} /></span>
          <span className="fel-seq-btns">
            <button type="button" className="fel-btn fel-btn-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
            <button type="button" className="fel-btn fel-btn-icon" onClick={() => move(i, 1)} disabled={i === ids.length - 1} aria-label="Move down">↓</button>
          </span>
        </li>
      ))}
    </ol>
  );
}
