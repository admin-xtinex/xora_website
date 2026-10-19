/** Exercise widgets: choice-feedback, classify, numeric-calculator, sequence-order, slider-explore. */
import { useMemo, useState } from 'react';
import type { ExpectedEvaluation, JsonObject } from '@futures-edge/contracts';
import { runSimulator, type Side } from '../simulation/math';
import { fmt } from '../motion/chart';
import { candlesOf, isObj, labelsOf, numOr, objs, strOr, ticksOf } from '../motion/params';
import { seededShuffle } from '../assessment/grader';
import { RichText } from '../platform/RichText';
import { ExerciseShell, NumberField, parseNum, SliderField, type Status, type WidgetProps } from './Shell';
import { MiniChart } from './MiniChart';

/** Optional fixture chart shown above a widget when parameters.showChart is true. */
export function FixtureChart({ fixture, params, label }: { fixture: WidgetProps['fixture']; params: JsonObject; label: string }) {
  if (params['showChart'] !== true || !fixture) return null;
  const cs = candlesOf(fixture);
  const pts = ticksOf(fixture).map((t) => t.p);
  return <div className="fel-figure"><MiniChart candles={cs} points={cs.length ? [] : pts} labels={labelsOf(fixture)} label={label} /></div>;
}

/** Numeric check shared by several widgets. */
export function numericFields(e: ExpectedEvaluation): Array<{ key: string; label: string; value: number; tolerance: number; unit: string; decimals?: number | undefined }> {
  if (e.kind === 'numeric') return [{ key: 'answer', label: 'Your answer', value: e.value, tolerance: e.tolerance, unit: e.unit, decimals: e.rounding?.decimals }];
  if (e.kind === 'numeric-set') return e.fields.map((f) => ({ key: f.key, label: f.label, value: f.value, tolerance: f.tolerance, unit: f.unit, decimals: f.rounding?.decimals }));
  return [];
}

export function NumericAnswers({ exercise, onAllCorrect, done }: { exercise: WidgetProps['exercise']; onAllCorrect: () => void; done: boolean }) {
  const fields = numericFields(exercise.expectedEvaluation);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean> | null>(null);
  const check = () => {
    const res: Record<string, boolean> = {};
    for (const f of fields) { const n = parseNum(vals[f.key] ?? ''); res[f.key] = n !== null && Math.abs(n - f.value) <= f.tolerance + 1e-9; }
    setChecked(res);
    if (fields.every((f) => res[f.key])) onAllCorrect();
  };
  return (
    <div className="fel-numeric-answers">
      <div className="fel-grid-fields">
        {fields.map((f) => (
          <div key={f.key}>
            <NumberField id={`${exercise.id}-${f.key}`} label={`${f.label}${f.decimals !== undefined ? ` (${f.decimals} dp)` : ''}`} unit={f.unit} value={vals[f.key] ?? ''} onChange={(v) => setVals((s) => ({ ...s, [f.key]: v }))} />
            {checked ? <span className={checked[f.key] ? 'fel-ok' : 'fel-bad'}>{checked[f.key] ? '✓ correct' : done ? `answer: ${fmt(f.value, f.decimals)}` : '✗ not yet'}</span> : null}
          </div>
        ))}
      </div>
      <button type="button" className="fel-btn fel-btn-primary" onClick={check}>Check</button>
    </div>
  );
}

// ------------------------------------------------------------------ choice-feedback

export function ChoiceFeedbackWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const multi = exercise.expectedEvaluation.kind === 'choice-set';
  const correct = useMemo(() => new Set(exercise.expectedEvaluation.kind === 'exact-choice' ? [exercise.expectedEvaluation.choiceId] : exercise.expectedEvaluation.kind === 'choice-set' ? exercise.expectedEvaluation.choiceIds : []), [exercise]);
  const fb = isObj(p['feedback']) ? (p['feedback'] as Record<string, unknown>) : {};
  const [sel, setSel] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [done, setDone] = useState(false);
  const check = () => {
    const ok = sel.length === correct.size && sel.every((c) => correct.has(c));
    setStatus(ok ? 'correct' : 'incorrect');
    if (ok) { setDone(true); onComplete(); }
  };
  const wrongNotes = status === 'incorrect' ? sel.filter((c) => !correct.has(c)).map((c) => (typeof fb[c] === 'string' ? (fb[c] as string) : '')).filter(Boolean) : [];
  return (
    <ExerciseShell exercise={exercise} status={status} done={done} onReset={() => { setSel([]); setStatus('idle'); }}
      feedback={status === 'correct' ? <p>Correct.</p> : status === 'incorrect' ? <p>{wrongNotes.length ? wrongNotes.map((n, k) => <span key={k}><RichText text={n} /> </span>) : multi ? 'Not quite. Check which options you included or left out.' : 'Not quite. Try again; use the hints if you need them.'}</p> : null}>
      <FixtureChart fixture={fixture} params={p} label={exercise.title} />
      <fieldset className="fel-choices">
        <legend className="fel-sr">{exercise.title}</legend>
        {(exercise.choices ?? []).map((c) => (
          <label key={c.id} className={`fel-choice ${sel.includes(c.id) ? 'is-on' : ''}`}>
            <input type={multi ? 'checkbox' : 'radio'} name={exercise.id} checked={sel.includes(c.id)}
              onChange={() => { setStatus('idle'); setSel((s) => (multi ? (s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id]) : [c.id])); }} />
            <span>{c.decision ? <strong>DEMO {c.decision.replace('_', ' ')}: </strong> : null}<RichText text={c.text} /></span>
          </label>
        ))}
      </fieldset>
      <button type="button" className="fel-btn fel-btn-primary" disabled={sel.length === 0} onClick={check}>Check</button>
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ classify

export function ClassifyWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const items = objs(p['items']).map((i) => ({ id: strOr(i['id'], ''), text: strOr(i['text'], '') }));
  const buckets = objs(p['buckets']).map((b) => ({ id: strOr(b['id'], ''), label: strOr(b['label'], '') }));
  const itemFb = isObj(p['itemFeedback']) ? (p['itemFeedback'] as Record<string, unknown>) : {};
  const answer = useMemo(() => {
    const m = new Map<string, string>();
    if (exercise.expectedEvaluation.kind === 'classification') for (const [b, ids] of Object.entries(exercise.expectedEvaluation.buckets)) for (const i of ids) m.set(i, b);
    return m;
  }, [exercise]);
  const [pick, setPick] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  const right = items.filter((i) => pick[i.id] === answer.get(i.id)).length;
  const check = () => { setChecked(true); if (right === items.length) { setDone(true); onComplete(); } };
  return (
    <ExerciseShell exercise={exercise} status={!checked ? 'idle' : right === items.length ? 'correct' : 'partial'} done={done}
      onReset={() => { setPick({}); setChecked(false); }}
      feedback={checked ? <p>{right} of {items.length} placed correctly.{right < items.length ? ' Items marked ✗ need another look.' : ''}</p> : null}>
      <FixtureChart fixture={fixture} params={p} label={exercise.title} />
      <div className="fel-classify">
        {items.map((it) => {
          const ok = pick[it.id] === answer.get(it.id);
          return (
            <fieldset key={it.id} className="fel-classify-item">
              <legend><RichText text={it.text} /> {checked ? <span className={ok ? 'fel-ok' : 'fel-bad'}>{ok ? '✓' : '✗'}</span> : null}</legend>
              <div className="fel-seg">
                {buckets.map((b) => (
                  <label key={b.id} className={`fel-seg-opt ${pick[it.id] === b.id ? 'is-on' : ''}`}>
                    <input type="radio" name={`${exercise.id}-${it.id}`} checked={pick[it.id] === b.id} onChange={() => { setChecked(false); setPick((s) => ({ ...s, [it.id]: b.id })); }} />
                    <span>{b.label}</span>
                  </label>
                ))}
              </div>
              {checked && !ok && typeof itemFb[it.id] === 'string' ? <p className="fel-hint"><RichText text={itemFb[it.id] as string} /></p> : null}
            </fieldset>
          );
        })}
      </div>
      <button type="button" className="fel-btn fel-btn-primary" disabled={Object.keys(pick).length < items.length} onClick={check}>Check</button>
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ numeric-calculator

export function NumericCalculatorWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const given = objs(p['given']);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);
  const cs = candlesOf(fixture);
  const ci = typeof p['candleIndex'] === 'number' ? p['candleIndex'] : undefined;
  const candle = ci !== undefined ? cs[ci] : undefined;
  return (
    <ExerciseShell exercise={exercise} status={done ? 'correct' : 'idle'} done={done} onReset={() => setKey((k) => k + 1)} feedback={done ? <p>All values correct.</p> : null}>
      {candle ? <div className="fel-figure fel-figure-small"><MiniChart candles={[candle]} labels={[labelsOf(fixture)[ci as number] ?? '']} label={`Fictional candle O ${candle.o} H ${candle.h} L ${candle.l} C ${candle.c}`} lines={[{ price: candle.h, label: `High ${candle.h}`, cls: 'fel-svg-level-faint' }, { price: candle.l, label: `Low ${candle.l}`, cls: 'fel-svg-level-faint' }]} /></div> : <FixtureChart fixture={fixture} params={p} label={exercise.title} />}
      {given.length ? (
        <table className="fel-table fel-table-compact">
          <caption className="fel-sr">Given values</caption>
          <tbody>{given.map((g, k) => <tr key={k}><th scope="row">{strOr(g['label'], '')}</th><td>{typeof g['value'] === 'number' ? fmt(g['value'], typeof g['decimals'] === 'number' ? g['decimals'] : undefined) : strOr(g['value'], '')} {strOr(g['unit'], '')}</td></tr>)}</tbody>
        </table>
      ) : null}
      <NumericAnswers key={key} exercise={exercise} done={done} onAllCorrect={() => { setDone(true); onComplete(); }} />
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ sequence-order

export function SequenceOrderWidget({ exercise, onComplete }: WidgetProps) {
  const items = objs(exercise.parameters['items']).map((i) => ({ id: strOr(i['id'], ''), text: strOr(i['text'], '') }));
  const target = exercise.expectedEvaluation.kind === 'sequence' ? exercise.expectedEvaluation.order : [];
  const initial = useMemo(() => {
    let s = seededShuffle(items, exercise.id);
    if (s.every((x, i) => x.id === target[i])) s = [...s.slice(1), s[0] as (typeof s)[number]];
    return s;
  }, [exercise.id]);
  const [order, setOrder] = useState(initial);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  const move = (i: number, d: -1 | 1) => setOrder((o) => { const n = [...o]; const j = i + d; if (j < 0 || j >= n.length) return o; [n[i], n[j]] = [n[j] as (typeof n)[number], n[i] as (typeof n)[number]]; setChecked(false); return n; });
  const right = order.filter((x, i) => x.id === target[i]).length;
  const check = () => { setChecked(true); if (right === order.length) { setDone(true); onComplete(); } };
  return (
    <ExerciseShell exercise={exercise} status={!checked ? 'idle' : right === order.length ? 'correct' : 'partial'} done={done} onReset={() => { setOrder(initial); setChecked(false); }}
      feedback={checked ? <p>{right} of {order.length} in the right position.</p> : null}>
      <ol className="fel-sequence">
        {order.map((it, i) => (
          <li key={it.id} className={checked ? (it.id === target[i] ? 'is-ok' : 'is-bad') : ''}>
            <span className="fel-seq-text"><RichText text={it.text} /></span>
            <span className="fel-seq-btns">
              <button type="button" className="fel-btn fel-btn-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move “${it.text}” up`}>↑</button>
              <button type="button" className="fel-btn fel-btn-icon" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label={`Move “${it.text}” down`}>↓</button>
            </span>
          </li>
        ))}
      </ol>
      <button type="button" className="fel-btn fel-btn-primary" onClick={check}>Check order</button>
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ slider-explore

export function SliderExploreWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const sliders = objs(p['sliders']).map((s) => ({ key: strOr(s['key'], ''), label: strOr(s['label'], ''), min: numOr(s['min'], 0), max: numOr(s['max'], 100), step: numOr(s['step'], 1), value: numOr(s['value'], 0), unit: strOr(s['unit'], '') }));
  const fixed = isObj(p['fixed']) ? (p['fixed'] as Record<string, unknown>) : {};
  const outputs = objs(p['outputs']).map((o) => ({ key: strOr(o['key'], ''), label: strOr(o['label'], ''), unit: strOr(o['unit'], ''), decimals: typeof o['decimals'] === 'number' ? o['decimals'] : undefined }));
  const sideToggle = p['sideToggle'] === true;
  const init = () => Object.fromEntries(sliders.map((s) => [s.key, s.value]));
  const [vals, setVals] = useState<Record<string, number>>(init);
  const [side, setSide] = useState<Side>(p['side'] === 'short' ? 'short' : 'long');
  const [touched, setTouched] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);
  const inputs: Record<string, number> = { ...Object.fromEntries(Object.entries(fixed).filter(([, v]) => typeof v === 'number')) as Record<string, number>, ...vals };
  const res = exercise.simulatorId ? runSimulator(exercise.simulatorId, inputs, side) : null;
  const ev = exercise.expectedEvaluation;
  const allTouched = sliders.every((s) => touched.includes(s.key));
  const finish = () => { if (!done) { setDone(true); onComplete(); } };
  const note = strOr(p['note'], '');
  return (
    <ExerciseShell exercise={exercise} status={done ? 'correct' : 'idle'} done={done} onReset={() => { setVals(init()); setTouched([]); setKey((k) => k + 1); }}
      feedback={res && !res.ok ? <p className="fel-bad">{res.error.message}</p> : null}>
      <FixtureChart fixture={fixture} params={p} label={exercise.title} />
      {sideToggle ? (
        <div className="fel-seg" role="radiogroup" aria-label="Side">
          {(['long', 'short'] as const).map((s) => (
            <label key={s} className={`fel-seg-opt ${side === s ? 'is-on' : ''}`}><input type="radio" name={`${exercise.id}-side`} checked={side === s} onChange={() => setSide(s)} /><span>{s === 'long' ? 'LONG' : 'SHORT'}</span></label>
          ))}
        </div>
      ) : null}
      <div className="fel-sliders">
        {sliders.map((s) => (
          <SliderField key={`${s.key}-${key}`} id={`${exercise.id}-${s.key}`} label={s.label} unit={s.unit} min={s.min} max={s.max} step={s.step} value={vals[s.key] ?? s.value}
            onChange={(v) => { setVals((x) => ({ ...x, [s.key]: v })); setTouched((t) => (t.includes(s.key) ? t : [...t, s.key])); }} />
        ))}
      </div>
      {res && res.ok ? (
        <dl className="fel-outputs" aria-live="polite">
          {outputs.map((o) => (
            <div key={o.key} className="fel-output"><dt>{o.label}</dt><dd>{res.value[o.key] !== undefined ? `${fmt(res.value[o.key] as number, o.decimals)} ${o.unit}` : '—'}</dd></div>
          ))}
        </dl>
      ) : null}
      {res && res.ok && res.approximate ? <p className="fel-small fel-muted">Illustrative/approximate model: {res.assumptions.join('; ')}.</p> : null}
      {note ? <p className="fel-small"><RichText text={note} /></p> : null}
      {ev.kind === 'numeric' || ev.kind === 'numeric-set' ? <NumericAnswers exercise={exercise} done={done} onAllCorrect={finish} /> : null}
      {ev.kind === 'exact-choice' || ev.kind === 'choice-set' ? <InlineChoice exercise={exercise} onCorrect={finish} /> : null}
      {ev.kind === 'rubric' || ev.kind === 'constraint' ? (
        <button type="button" className="fel-btn fel-btn-primary" disabled={!allTouched} onClick={finish}>{allTouched ? 'I have explored every control' : 'Move every control at least once'}</button>
      ) : null}
    </ExerciseShell>
  );
}

/** A compact single/multi choice used inside other widgets. */
export function InlineChoice({ exercise, onCorrect }: { exercise: WidgetProps['exercise']; onCorrect: () => void }) {
  const ev = exercise.expectedEvaluation;
  const correct = new Set(ev.kind === 'exact-choice' ? [ev.choiceId] : ev.kind === 'choice-set' ? ev.choiceIds : []);
  const multi = ev.kind === 'choice-set';
  const fb = isObj(exercise.parameters['feedback']) ? (exercise.parameters['feedback'] as Record<string, unknown>) : {};
  const [sel, setSel] = useState<string[]>([]);
  const [res, setRes] = useState<boolean | null>(null);
  const q = strOr(exercise.parameters['question'], '');
  return (
    <fieldset className="fel-choices">
      <legend>{q ? <RichText text={q} /> : 'Your answer'}</legend>
      {(exercise.choices ?? []).map((c) => (
        <label key={c.id} className={`fel-choice ${sel.includes(c.id) ? 'is-on' : ''}`}>
          <input type={multi ? 'checkbox' : 'radio'} name={`${exercise.id}-q`} checked={sel.includes(c.id)} onChange={() => { setRes(null); setSel((s) => (multi ? (s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id]) : [c.id])); }} />
          <span>{c.decision ? <strong>DEMO {c.decision.replace('_', ' ')}: </strong> : null}<RichText text={c.text} /></span>
        </label>
      ))}
      <button type="button" className="fel-btn fel-btn-primary" disabled={!sel.length} onClick={() => { const ok = sel.length === correct.size && sel.every((x) => correct.has(x)); setRes(ok); if (ok) onCorrect(); }}>Check</button>
      {res === false ? <p className="fel-bad">{sel.map((x) => (typeof fb[x] === 'string' ? (fb[x] as string) : '')).filter(Boolean).join(' ') || 'Not quite. Look at the numbers again.'}</p> : null}
      {res === true ? <p className="fel-ok">Correct.</p> : null}
    </fieldset>
  );
}

