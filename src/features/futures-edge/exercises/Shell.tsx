/** Shared frame for every exercise: instructions, step hints, fictional-data label, feedback and Reset. */
import { useState, type ReactNode } from 'react';
import type { Exercise, Fixture } from '@futures-edge/contracts';
import { RichText } from '../platform/RichText';

export type Status = 'idle' | 'correct' | 'incorrect' | 'partial' | 'info';

export interface WidgetProps {
  exercise: Exercise;
  fixture: Fixture | undefined;
  onComplete: () => void;
}

export function ExerciseShell({ exercise, status, feedback, onReset, children, done }: {
  exercise: Exercise; status: Status; feedback?: ReactNode; onReset: () => void; children: ReactNode; done: boolean;
}) {
  const [hints, setHints] = useState<Record<string, boolean>>({});
  return (
    <section className="fe-exercise" aria-labelledby={`${exercise.id}-title`}>
      <header className="fe-exercise-head">
        <h3 id={`${exercise.id}-title`}><RichText text={exercise.title} /></h3>
        <p className="fe-badge-fictional">{exercise.fictionalDataLabel}</p>
      </header>
      <p><RichText text={exercise.instructions} /></p>
      <ol className="fe-exercise-steps">
        {exercise.steps.map((s) => (
          <li key={s.id}>
            <RichText text={s.prompt} />{' '}
            <button type="button" className="fe-link" aria-expanded={!!hints[s.id]} onClick={() => setHints((h) => ({ ...h, [s.id]: !h[s.id] }))}>
              {hints[s.id] ? 'Hide hint' : 'Hint'}
            </button>
            {hints[s.id] ? <p className="fe-hint"><RichText text={s.hint} /></p> : null}
          </li>
        ))}
      </ol>
      <div className="fe-exercise-body">{children}</div>
      <div className={`fe-feedback fe-feedback-${status}`} role="status" aria-live="polite">
        {feedback}
        {done ? <p className="fe-explanation"><strong>Why: </strong><RichText text={exercise.explanation} /></p> : null}
      </div>
      <div className="fe-row">
        <button type="button" className="fe-btn" onClick={() => { setHints({}); onReset(); }}>Reset</button>
        {done ? <span className="fe-done-chip">Practice complete ✓</span> : null}
      </div>
    </section>
  );
}

/** Numeric text input that accepts "1,234.5" and reports a number or null. */
export function NumberField({ id, label, value, onChange, unit, step }: { id: string; label: string; value: string; onChange: (v: string) => void; unit?: string | undefined; step?: number | undefined }) {
  return (
    <label className="fe-field" htmlFor={id}>
      <span>{label}</span>
      <span className="fe-field-row">
        <input id={id} type="text" inputMode="decimal" autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} {...(step ? { 'data-step': step } : {})} />
        {unit ? <span className="fe-unit">{unit}</span> : null}
      </span>
    </label>
  );
}

export function parseNum(s: string): number | null {
  const t = s.replace(/,/g, '').replace(/−/g, '-').trim();
  if (t === '' || !/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Slider + numeric box kept in sync; the numeric box is the keyboard/screen-reader equivalent. */
export function SliderField({ id, label, min, max, step, value, onChange, unit }: { id: string; label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; unit?: string | undefined }) {
  const [text, setText] = useState(String(value));
  const [last, setLast] = useState(value);
  if (last !== value) { setLast(value); setText(String(value)); }
  return (
    <div className="fe-slider">
      <label htmlFor={`${id}-r`}>{label}{unit ? ` (${unit})` : ''}</label>
      <div className="fe-field-row">
        <input id={`${id}-r`} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <input aria-label={`${label} value`} type="text" inputMode="decimal" value={text}
          onChange={(e) => { setText(e.target.value); const n = parseNum(e.target.value); if (n !== null && n >= min && n <= max) onChange(n); }} />
      </div>
    </div>
  );
}
