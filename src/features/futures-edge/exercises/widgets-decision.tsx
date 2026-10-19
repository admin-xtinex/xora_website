/** Exercise widgets: position-size, decision-with-rationale, capstone-lifecycle. Decisions are DEMO only. */
import { useMemo, useState } from 'react';
import type { Choice, DecisionWord } from '@futures-edge/contracts';
import { feesEstimateRoundTrip, ohlcAggregate, positionSize, rangeLookback, type Side } from '../simulation/math';
import { fmt } from '../motion/chart';
import { slTpEvents } from '../motion/scenes/trading';
import { candlesOf, isObj, labelsOf, nums, numOr, objs, strOr, strs } from '../motion/params';
import { RichText } from '../platform/RichText';
import { ExerciseShell, NumberField, parseNum, type Status, type WidgetProps } from './Shell';
import { MiniChart } from './MiniChart';
import { NumericAnswers } from './widgets-basic';

const demoLabel = (d: DecisionWord | undefined) => (d ? `DEMO ${d.replace('_', ' ')}` : '');

// ------------------------------------------------------------------ position-size

export function PositionSizeWidget({ exercise, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const play = isObj(p['playground']) ? p['playground'] : {};
  const init = {
    balance: String(numOr(play['balance'], 1000)), risk: String(numOr(play['riskAmount'], 10)),
    entry: String(numOr(play['entry'], 100)), stop: String(numOr(play['stop'], 98)), side: (play['side'] === 'short' ? 'short' : 'long') as Side,
  };
  const [f, setF] = useState(init);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);
  const vals = { balance: parseNum(f.balance), risk: parseNum(f.risk), entry: parseNum(f.entry), stop: parseNum(f.stop) };
  const missing = Object.values(vals).some((v) => v === null);
  const r = missing ? null : positionSize({ side: f.side, riskAmount: vals.risk as number, entry: vals.entry as number, stop: vals.stop as number, accountBalance: vals.balance as number });
  const sc = isObj(p['scenario']) ? p['scenario'] : {};
  return (
    <ExerciseShell exercise={exercise} status={done ? 'correct' : 'idle'} done={done} onReset={() => { setF(init); setKey((k) => k + 1); }}>
      <fieldset className="fel-panel">
        <legend>Try your own numbers (fictional, simple model)</legend>
        <div className="fel-seg" role="radiogroup" aria-label="Direction">
          {(['long', 'short'] as const).map((s) => <label key={s} className={`fel-seg-opt ${f.side === s ? 'is-on' : ''}`}><input type="radio" name={`${exercise.id}-side`} checked={f.side === s} onChange={() => setF((x) => ({ ...x, side: s }))} /><span>{s.toUpperCase()}</span></label>)}
        </div>
        <div className="fel-grid-fields">
          <NumberField id={`${exercise.id}-bal`} label="Account balance" unit="USDT" value={f.balance} onChange={(v) => setF((x) => ({ ...x, balance: v }))} />
          <NumberField id={`${exercise.id}-risk`} label="Risk budget (example)" unit="USDT" value={f.risk} onChange={(v) => setF((x) => ({ ...x, risk: v }))} />
          <NumberField id={`${exercise.id}-entry`} label="Entry price" unit="USDT" value={f.entry} onChange={(v) => setF((x) => ({ ...x, entry: v }))} />
          <NumberField id={`${exercise.id}-stop`} label="Stop price" unit="USDT" value={f.stop} onChange={(v) => setF((x) => ({ ...x, stop: v }))} />
        </div>
        <div aria-live="polite">
          {missing ? <p className="fel-bad">Enter a number in every box.</p> : r && !r.ok ? <p className="fel-bad">{r.error.message}</p> : r && r.ok ? (
            <dl className="fel-outputs">
              <div className="fel-output"><dt>Stop distance</dt><dd>{fmt(r.value.stopDistance, 4)} USDT ({fmt(r.value.stopDistancePercent, 3)}%)</dd></div>
              <div className="fel-output"><dt>Size</dt><dd>{fmt(r.value.quantity, 6)} DEMO</dd></div>
              <div className="fel-output"><dt>Notional</dt><dd>{fmt(r.value.notional, 2)} USDT</dd></div>
              <div className="fel-output"><dt>Exposure ÷ balance</dt><dd>{r.value.impliedLeverage !== null ? `${fmt(r.value.impliedLeverage, 2)}×` : '—'}</dd></div>
            </dl>
          ) : null}
          {r && r.ok && r.value.impliedLeverage !== null && r.value.impliedLeverage > 5 ? <p className="fel-warn">Warning: this stop is so close that the position is large compared with the account. Stops can slip; the real loss can exceed the budget.</p> : null}
        </div>
      </fieldset>
      <fieldset className="fel-panel">
        <legend>Your turn</legend>
        <p><RichText text={strOr(sc['text'], 'Work out the values for the scenario in the instructions.')} /></p>
        <NumericAnswers key={key} exercise={exercise} done={done} onAllCorrect={() => { setDone(true); onComplete(); }} />
      </fieldset>
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ decision-with-rationale

export function DecisionWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const ev = exercise.expectedEvaluation;
  const cs = candlesOf(fixture);
  const reveal = nums(p['reveal']);
  const checklist = objs(p['checklist']).map((c) => ({ id: strOr(c['id'], ''), text: strOr(c['text'], '') }));
  const context = strs(p['context']);
  const dfb = isObj(p['decisionFeedback']) ? (p['decisionFeedback'] as Record<string, unknown>) : {};
  const minLen = numOr(p['minRationale'], 20);
  const [stage, setStage] = useState(0);
  const [ticks, setTicks] = useState<string[]>([]);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [why, setWhy] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const visibleCount = reveal.length ? (submitted ? cs.length : reveal[Math.min(stage, reveal.length - 1)] ?? cs.length) : cs.length;
  const acceptable = ev.kind === 'decision' ? ev.acceptable : [];
  const needsWhy = ev.kind === 'decision' ? ev.requiresRationale : false;
  const cues = ev.kind === 'decision' ? ev.rationaleCues : [];
  const okDecision = choice?.decision !== undefined && acceptable.includes(choice.decision);
  const submit = () => {
    setSubmitted(true);
    if (okDecision && (!needsWhy || why.trim().length >= minLen)) { setDone(true); onComplete(); }
  };
  const status: Status = !submitted ? 'idle' : done ? 'correct' : 'partial';
  return (
    <ExerciseShell exercise={exercise} status={status} done={done} onReset={() => { setStage(0); setTicks([]); setChoice(null); setWhy(''); setSubmitted(false); }}
      feedback={submitted ? (
        <div>
          <p>{okDecision ? `${demoLabel(choice?.decision)} is a reasonable choice here.` : `${demoLabel(choice?.decision)} is hard to justify with this evidence.`}{' '}
            {choice && typeof dfb[choice.id] === 'string' ? <RichText text={dfb[choice.id] as string} /> : null}</p>
          {needsWhy && why.trim().length < minLen ? <p>Write a short reason (at least {minLen} characters). The reasoning matters more than the button.</p> : null}
          <p><strong>A strong reason mentions:</strong></p>
          <ul>{cues.map((c, k) => <li key={k}><RichText text={c} /></li>)}</ul>
          {reveal.length ? <p className="fel-small">The rest of the fictional chart is now shown. It is ONE possible outcome: a good decision can still lose and a poor one can still win.</p> : null}
        </div>
      ) : null}>
      {context.length ? <ul className="fel-context">{context.map((c, k) => <li key={k}><RichText text={c} /></li>)}</ul> : null}
      {cs.length ? (
        <div className="fel-figure">
          <MiniChart candles={cs.slice(0, visibleCount)} labels={labelsOf(fixture).slice(0, visibleCount)} label={`Fictional chart, ${visibleCount} of ${cs.length} candles visible`} />
        </div>
      ) : null}
      {reveal.length && !submitted ? (
        <button type="button" className="fel-btn" disabled={stage >= reveal.length - 1} onClick={() => setStage((s) => s + 1)}>
          {stage >= reveal.length - 1 ? 'No more candles before you decide' : `Reveal the next candle (${stage + 1} of ${reveal.length - 1})`}
        </button>
      ) : null}
      {checklist.length ? (
        <fieldset className="fel-panel">
          <legend>Checklist: tick what you can actually see</legend>
          {checklist.map((c) => (
            <label key={c.id} className="fel-check">
              <input type="checkbox" checked={ticks.includes(c.id)} onChange={() => setTicks((t) => (t.includes(c.id) ? t.filter((x) => x !== c.id) : [...t, c.id]))} />
              <span><RichText text={c.text} /></span>
            </label>
          ))}
        </fieldset>
      ) : null}
      <fieldset className="fel-choices">
        <legend>Your DEMO decision</legend>
        {(exercise.choices ?? []).map((c) => (
          <label key={c.id} className={`fel-choice ${choice?.id === c.id ? 'is-on' : ''}`}>
            <input type="radio" name={`${exercise.id}-d`} checked={choice?.id === c.id} disabled={done} onChange={() => { setChoice(c); setSubmitted(false); }} />
            <span><strong>{demoLabel(c.decision)}</strong>{c.decision ? ' — ' : ''}<RichText text={c.text} /></span>
          </label>
        ))}
      </fieldset>
      <label className="fel-field" htmlFor={`${exercise.id}-why`}>
        <span>Why? (your reasoning{needsWhy ? ', required' : ''})</span>
        <textarea id={`${exercise.id}-why`} rows={3} value={why} maxLength={600} disabled={done} onChange={(e) => setWhy(e.target.value)} />
      </label>
      <button type="button" className="fel-btn fel-btn-primary" disabled={!choice || done} onClick={submit}>Submit decision</button>
      <p className="fel-small fel-muted">Educational simulation. No order is sent anywhere.</p>
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ capstone-lifecycle

interface CapCoin { id: string; label: string; note: string; suitable: boolean }

export function CapstoneWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const coins: CapCoin[] = objs(p['coins']).map((c) => ({ id: strOr(c['id'], ''), label: strOr(c['label'], ''), note: strOr(c['note'], ''), suitable: c['suitable'] === true }));
  const cs = candlesOf(fixture);
  const lookback = Math.round(numOr(p['lookback'], 10));
  const risk = isObj(p['risk']) ? p['risk'] : {};
  const rSide: Side = risk['side'] === 'short' ? 'short' : 'long';
  const rEntry = numOr(risk['entry'], 100);
  const rStop = numOr(risk['stop'], 99);
  const rTarget = numOr(risk['target'], 102);
  const rAmount = numOr(risk['riskAmount'], 10);
  const feeRate = numOr(risk['feeRate'], 0.0005);
  const slipRate = numOr(risk['slippageRate'], 0.0002);
  const branches = objs(p['branches']).map((b) => ({ id: strOr(b['id'], ''), label: strOr(b['label'], ''), points: nums(b['points']) }));
  const replayId = strOr(p['replayBranch'], branches[0]?.id ?? '');
  const criteria = exercise.expectedEvaluation.kind === 'rubric' ? exercise.expectedEvaluation.criteria : [];

  const range = rangeLookback({ candles: cs, window: Math.min(lookback, cs.length) });
  const size = positionSize({ side: rSide, riskAmount: rAmount, entry: rEntry, stop: rStop });
  const fee = size.ok ? feesEstimateRoundTrip({ notional: size.value.notional, feeRate, slippageRate: slipRate }) : null;
  const five = useMemo(() => ohlcAggregate({ candles: cs, groupSize: 5 }), [cs]);

  const [stage, setStage] = useState(0);
  const [coin, setCoin] = useState<string>('');
  const [tf, setTf] = useState<1 | 5>(1);
  const [hi, setHi] = useState('');
  const [lo, setLo] = useState('');
  const [unc, setUnc] = useState('');
  const [qty, setQty] = useState('');
  const [feeTxt, setFeeTxt] = useState('');
  const [decision, setDecision] = useState<Choice | null>(null);
  const [why, setWhy] = useState('');
  const [replayed, setReplayed] = useState(false);
  const [journal, setJournal] = useState('');
  const [finished, setFinished] = useState(false);

  const near = (s: string, v: number | undefined, tol: number) => { const n = parseNum(s); return n !== null && v !== undefined && Math.abs(n - v) <= tol; };
  const levelsOk = range.ok && near(hi, range.value.max, 0.005) && near(lo, range.value.min, 0.005);
  const riskOk = size.ok && near(qty, size.value.quantity, Math.max(0.0005, size.value.quantity * 0.01)) && fee !== null && fee.ok && near(feeTxt, fee.value.estimate, Math.max(0.005, fee.value.estimate * 0.02));
  const decided = decision?.decision !== undefined && why.trim().length >= 20;
  const met: Record<string, boolean> = {
    'market-choice': coins.find((c) => c.id === coin)?.suitable === true,
    levels: levelsOk,
    uncertainty: unc.trim().length >= 20,
    'risk-math': riskOk,
    'decision-justified': decided,
    journal: journal.trim().length >= 20,
  };
  const score = criteria.length ? criteria.filter((c) => met[c.id]).length / criteria.length : 0;
  const branch = branches.find((b) => b.id === replayId);
  const ev = branch && decision?.decision && decision.decision !== 'NO_TRADE' && decision.decision !== 'WAIT'
    ? slTpEvents(decision.decision === 'SELL' ? 'short' : 'long', decision.decision === 'SELL' ? rEntry + (rEntry - rStop) : rStop, decision.decision === 'SELL' ? rEntry - (rTarget - rEntry) : rTarget, [rEntry, ...branch.points])
    : null;
  const stages = ['Choose a synthetic market', 'View 1m and 5m context', 'Mark the recent range', 'Write down what is uncertain', 'Costs and risk', 'DEMO decision', 'Simulated monitoring', 'Journal and review'];
  const canNext = [coin !== '', true, levelsOk, met['uncertainty'], riskOk, decided, decision?.decision === 'NO_TRADE' || decision?.decision === 'WAIT' || replayed, true][stage];

  return (
    <ExerciseShell exercise={exercise} status={finished ? 'correct' : 'idle'} done={finished}
      onReset={() => { setStage(0); setCoin(''); setTf(1); setHi(''); setLo(''); setUnc(''); setQty(''); setFeeTxt(''); setDecision(null); setWhy(''); setReplayed(false); setJournal(''); setFinished(false); }}
      feedback={finished ? <p>Process score: {Math.round(score * 100)}% ({criteria.filter((c) => met[c.id]).length} of {criteria.length} criteria). This scores how you worked, not whether the simulated trade made money.</p> : null}>
      <ol className="fel-stepper" aria-label="Capstone stages">
        {stages.map((s, k) => <li key={s} className={k < stage ? 'is-done' : k === stage ? 'is-current' : ''} aria-current={k === stage ? 'step' : undefined}>{k + 1}. {s}</li>)}
      </ol>
      <div className="fel-panel" aria-live="polite">
        <h4>Step {stage + 1}: {stages[stage]}</h4>
        {stage === 0 ? (
          <fieldset className="fel-choices"><legend>All markets here are fictional.</legend>
            {coins.map((c) => (
              <label key={c.id} className={`fel-choice ${coin === c.id ? 'is-on' : ''}`}>
                <input type="radio" name={`${exercise.id}-coin`} checked={coin === c.id} onChange={() => setCoin(c.id)} />
                <span><strong>{c.label}</strong> — <RichText text={c.note} /></span>
              </label>
            ))}
            {coin && !coins.find((c) => c.id === coin)?.suitable ? <p className="fel-warn">Careful: that market’s conditions (see its note) make costs and slippage hard to control. Skipping it is a sound choice. You may continue to see the rest of the process; the replay uses one fictional chart for every coin.</p> : null}
          </fieldset>
        ) : null}
        {stage === 1 ? (
          <div>
            <div className="fel-seg" role="radiogroup" aria-label="Timeframe">
              {([1, 5] as const).map((t) => <label key={t} className={`fel-seg-opt ${tf === t ? 'is-on' : ''}`}><input type="radio" name={`${exercise.id}-tf`} checked={tf === t} onChange={() => setTf(t)} /><span>{t}m</span></label>)}
            </div>
            <div className="fel-figure"><MiniChart candles={tf === 1 ? cs : five.ok ? five.value.candles : []} label={`Fictional ${tf}-minute view`} /></div>
            <p className="fel-small">Same fictional data, two views. The 5m candles are built from five 1m candles each.</p>
          </div>
        ) : null}
        {stage === 2 ? (
          <div>
            <div className="fel-figure"><MiniChart candles={cs} window={range.ok ? { start: range.value.startIndex, end: range.value.endIndex } : undefined} label={`Fictional 1m chart; last ${lookback} candles highlighted`} /></div>
            <p>Read the last {lookback} one-minute candles (shaded). Enter the highest high and the lowest low (2 dp).</p>
            <div className="fel-grid-fields">
              <NumberField id={`${exercise.id}-hi`} label="Recent high" unit="USDT" value={hi} onChange={setHi} />
              <NumberField id={`${exercise.id}-lo`} label="Recent low" unit="USDT" value={lo} onChange={setLo} />
            </div>
            <details className="fel-details"><summary>Show candle values</summary>
              <table className="fel-table fel-table-compact"><thead><tr><th scope="col">#</th><th scope="col">High</th><th scope="col">Low</th></tr></thead>
                <tbody>{cs.map((c, k) => <tr key={k}><td>{k + 1}</td><td>{fmt(c.h, 2)}</td><td>{fmt(c.l, 2)}</td></tr>)}</tbody></table>
            </details>
            {hi && lo ? <p className={levelsOk ? 'fel-ok' : 'fel-bad'}>{levelsOk ? '✓ Range marked correctly.' : '✗ Not yet: check only the shaded candles.'}</p> : null}
          </div>
        ) : null}
        {stage === 3 ? (
          <label className="fel-field" htmlFor={`${exercise.id}-unc`}><span><RichText text={strOr(p['uncertaintyPrompt'], 'What could go wrong? What do you NOT know?')} /></span>
            <textarea id={`${exercise.id}-unc`} rows={3} maxLength={600} value={unc} onChange={(e) => setUnc(e.target.value)} /></label>
        ) : null}
        {stage === 4 ? (
          <div>
            <p><RichText text={`Plan (fictional): ${rSide.toUpperCase()} at ${fmt(rEntry, 2)}, stop ${fmt(rStop, 2)}, risk budget ${fmt(rAmount, 2)} USDT (example). Fee ${(feeRate * 100).toFixed(2)}% + slippage estimate ${(slipRate * 100).toFixed(2)}% per side.`} /></p>
            <div className="fel-grid-fields">
              <NumberField id={`${exercise.id}-qty`} label="Size = risk ÷ stop distance" unit="DEMO" value={qty} onChange={setQty} />
              <NumberField id={`${exercise.id}-fee`} label="Round-trip cost estimate = notional × 2 × (fee + slippage)" unit="USDT" value={feeTxt} onChange={setFeeTxt} />
            </div>
            {qty && feeTxt ? <p className={riskOk ? 'fel-ok' : 'fel-bad'}>{riskOk ? `✓ Size ${fmt(size.ok ? size.value.quantity : 0, 4)} DEMO, notional ${fmt(size.ok ? size.value.notional : 0, 2)} USDT, cost estimate ${fmt(fee && fee.ok ? fee.value.estimate : 0, 4)} USDT.` : '✗ Not yet. Stop distance = |entry − stop|.'}</p> : null}
          </div>
        ) : null}
        {stage === 5 ? (
          <div>
            <fieldset className="fel-choices"><legend>DEMO decision (no order is sent anywhere)</legend>
              {(exercise.choices ?? []).map((c) => (
                <label key={c.id} className={`fel-choice ${decision?.id === c.id ? 'is-on' : ''}`}>
                  <input type="radio" name={`${exercise.id}-dec`} checked={decision?.id === c.id} onChange={() => { setDecision(c); setReplayed(false); }} />
                  <span><strong>{demoLabel(c.decision)}</strong> — <RichText text={c.text} /></span>
                </label>
              ))}
            </fieldset>
            <label className="fel-field" htmlFor={`${exercise.id}-why`}><span>Justify it (at least 20 characters)</span>
              <textarea id={`${exercise.id}-why`} rows={3} maxLength={600} value={why} onChange={(e) => setWhy(e.target.value)} /></label>
          </div>
        ) : null}
        {stage === 6 ? (
          <div>
            {decision?.decision === 'NO_TRADE' || decision?.decision === 'WAIT' ? (
              <div>
                <p className="fel-ok">You chose {demoLabel(decision.decision)}. No position, no fees, no risk taken. That is a complete, valid outcome.</p>
                <p>For learning only, here is how the fictional chart could have continued:</p>
                <div className="fel-figure"><MiniChart points={[rEntry, ...(branch?.points ?? [])]} label="One possible continuation (fictional)" /></div>
              </div>
            ) : (
              <div>
                <button type="button" className="fel-btn fel-btn-primary" onClick={() => setReplayed(true)}>Play the simulated replay</button>
                {replayed && branch ? (
                  <div>
                    <div className="fel-figure"><MiniChart points={[rEntry, ...branch.points]} lines={[{ price: rEntry, label: `Entry ${fmt(rEntry, 2)}` }]} label={`Simulated continuation: ${branch.label}`} /></div>
                    <p>{ev?.first === 'tp' ? 'Target reached in this replay.' : ev?.first === 'sl' ? `Stop hit in this replay; filled at ${fmt(ev.fill ?? 0, 2)}.` : 'Neither level was hit in this replay; you would still be managing the position.'} This is ONE fictional path; a different path was equally possible.</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
        {stage === 7 ? (
          <div>
            <dl className="fel-outputs">
              <div className="fel-output"><dt>Market</dt><dd>{coins.find((c) => c.id === coin)?.label ?? '—'}</dd></div>
              <div className="fel-output"><dt>Recent range</dt><dd>{range.ok ? `${fmt(range.value.min, 2)}–${fmt(range.value.max, 2)}` : '—'}</dd></div>
              <div className="fel-output"><dt>Decision</dt><dd>{demoLabel(decision?.decision)}</dd></div>
              <div className="fel-output"><dt>Size / risk</dt><dd>{size.ok ? `${fmt(size.value.quantity, 4)} DEMO / ${fmt(rAmount, 2)} USDT` : '—'}</dd></div>
            </dl>
            <label className="fel-field" htmlFor={`${exercise.id}-jr`}><span>Journal: what did you do well, and what would you check differently next time?</span>
              <textarea id={`${exercise.id}-jr`} rows={3} maxLength={800} value={journal} onChange={(e) => setJournal(e.target.value)} /></label>
            <ul className="fel-checklist">{criteria.map((c) => <li key={c.id} className={met[c.id] ? 'is-done' : ''}>{met[c.id] ? '✓' : '○'} <RichText text={c.description} /></li>)}</ul>
            <button type="button" className="fel-btn fel-btn-primary" disabled={journal.trim().length < 20 || finished} onClick={() => { setFinished(true); onComplete(); }}>Finish and save journal</button>
          </div>
        ) : null}
      </div>
      <div className="fel-row">
        <button type="button" className="fel-btn" disabled={stage === 0} onClick={() => setStage((s) => s - 1)}>Back</button>
        {stage < stages.length - 1 ? <button type="button" className="fel-btn fel-btn-primary" disabled={!canNext} onClick={() => setStage((s) => s + 1)}>Next step</button> : null}
      </div>
    </ExerciseShell>
  );
}
