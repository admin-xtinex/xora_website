/** Exercise widgets: hotspot-find, order-match, line-placement, candle-builder, timeframe-switch, lookback-range, zone-placement. */
import { useMemo, useState } from 'react';
import { ohlcAggregate, ohlcAnatomy, ordersFill, rangeLookback, riskReward, type Side } from '../simulation/math';
import { fmt, Frame, H, W } from '../motion/chart';
import { slTpEvents } from '../motion/scenes/trading';
import { TERMINAL_AREAS } from '../motion/scenes/basics';
import { candlesOf, isObj, labelsOf, nums, numOr, objs, strOr } from '../motion/params';
import { RichText } from '../platform/RichText';
import { ExerciseShell, SliderField, type Status, type WidgetProps } from './Shell';
import { MiniChart } from './MiniChart';
import { InlineChoice, NumericAnswers } from './widgets-basic';

// ------------------------------------------------------------------ hotspot-find

const AREA_BOXES: Record<string, { x: number; y: number; w: number; h: number; name: string }> = {
  wallet: { x: 8, y: 6, w: 200, h: 28, name: 'Wallet balance' },
  security: { x: 520, y: 6, w: 112, h: 28, name: 'Security / settings' },
  watchlist: { x: 8, y: 40, w: 120, h: 312, name: 'Watchlist' },
  symbol: { x: 136, y: 40, w: 300, h: 34, name: 'Symbol & last price' },
  chart: { x: 136, y: 80, w: 300, h: 170, name: 'Chart' },
  'order-book': { x: 444, y: 40, w: 188, h: 150, name: 'Order book' },
  'order-entry': { x: 444, y: 196, w: 188, h: 156, name: 'Order entry (DEMO)' },
  positions: { x: 136, y: 256, w: 300, h: 96, name: 'Open positions & PnL' },
};

export function HotspotFindWidget({ exercise, onComplete }: WidgetProps) {
  const targets = objs(exercise.parameters['targets']).map((t) => ({ area: strOr(t['area'], ''), prompt: strOr(t['prompt'], '') })).filter((t) => TERMINAL_AREAS.includes(t.area));
  const [idx, setIdx] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const done = idx >= targets.length;
  const pick = (area: string) => {
    if (done) return;
    const t = targets[idx];
    if (!t) return;
    if (area === t.area) {
      setFound((f) => [...f, area]);
      setMsg({ ok: true, text: `Yes: that is the ${AREA_BOXES[area]?.name}.` });
      const next = idx + 1;
      setIdx(next);
      if (next >= targets.length) onComplete();
    } else setMsg({ ok: false, text: `That is the ${AREA_BOXES[area]?.name}. Try again.` });
  };
  return (
    <ExerciseShell exercise={exercise} status={done ? 'correct' : msg ? (msg.ok ? 'correct' : 'incorrect') : 'idle'} done={done} onReset={() => { setIdx(0); setFound([]); setMsg(null); }}
      feedback={msg ? <p>{msg.text}</p> : null}>
      {!done ? <p className="fel-task"><strong>Find {idx + 1} of {targets.length}:</strong> <RichText text={targets[idx]?.prompt ?? ''} /></p> : <p className="fel-ok">All {targets.length} found.</p>}
      <div className="fel-figure">
        <Frame label="Fictional generic trading screen. Select an area.">
          <text x={W / 2} y={H - 4} textAnchor="middle" className="fel-svg-badge">EDUCATIONAL MOCK — NOT A REAL EXCHANGE SCREEN</text>
          {Object.entries(AREA_BOXES).map(([k, a]) => (
            <g key={k} role="button" tabIndex={0} aria-label={a.name} className="fel-hotspot" onClick={() => pick(k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); } }}>
              <rect x={a.x} y={a.y} width={a.w} height={a.h} rx={6} className={found.includes(k) ? 'fel-svg-area-on' : 'fel-svg-area'} />
              <text x={a.x + 8} y={a.y + 18} className="fel-svg-small">{found.includes(k) ? `✓ ${a.name}` : '?'}</text>
            </g>
          ))}
        </Frame>
      </div>
      <div className="fel-row fel-wrap" role="group" aria-label="Area list (keyboard alternative)">
        {Object.entries(AREA_BOXES).map(([k, a]) => <button key={k} type="button" className="fel-btn fel-btn-small" onClick={() => pick(k)}>{found.includes(k) ? '✓ ' : ''}{a.name}</button>)}
      </div>
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ order-match

export function OrderMatchWidget({ exercise, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const side = strOr(p['side'], 'buy') === 'sell' ? 'sell' : 'buy';
  const book = objs(p['book']).map((l) => ({ price: numOr(l['price'], 0), quantity: numOr(l['quantity'], 0) }));
  const qty = numOr(p['quantity'], 0);
  const limit = typeof p['limitPrice'] === 'number' ? p['limitPrice'] : undefined;
  const sim = ordersFill({ side, type: limit !== undefined ? 'limit' : 'market', quantity: qty, book, ...(limit !== undefined ? { limitPrice: limit } : {}) });
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [key, setKey] = useState(0);
  const running = picked.reduce((n, i) => n + (book[i]?.quantity ?? 0), 0);
  return (
    <ExerciseShell exercise={exercise} status={done ? 'correct' : 'idle'} done={done} onReset={() => { setPicked([]); setReveal(false); setKey((k) => k + 1); }}
      feedback={reveal && sim.ok ? <p>Simulated match: filled {fmt(sim.value.filledQuantity, 4)} at an average of {sim.value.averagePrice !== null ? fmt(sim.value.averagePrice, 2) : '—'}{sim.value.remainingQuantity > 0 ? `; ${fmt(sim.value.remainingQuantity, 4)} ${limit !== undefined ? 'waits in the book' : 'could not fill'}` : ''}.</p> : null}>
      <p className="fel-task">Your fictional order: <strong>{side.toUpperCase()} {qty} DEMO {limit !== undefined ? `limit ${fmt(limit, 2)}` : 'at market'}</strong>. Tap the {side === 'buy' ? 'sell offers (asks)' : 'buy offers (bids)'} it would trade with, best price first.</p>
      <table className="fel-table">
        <caption>{side === 'buy' ? 'Asks (sellers), best first' : 'Bids (buyers), best first'} — fictional</caption>
        <thead><tr><th scope="col">Use?</th><th scope="col">Price (USDT)</th><th scope="col">Quantity (DEMO)</th></tr></thead>
        <tbody>
          {book.map((l, i) => (
            <tr key={i} className={picked.includes(i) ? 'is-on' : ''}>
              <td><input type="checkbox" aria-label={`Use level ${fmt(l.price, 2)}`} checked={picked.includes(i)} onChange={() => setPicked((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))} /></td>
              <td>{fmt(l.price, 2)}</td><td>{fmt(l.quantity, 4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="fel-small">Quantity in the levels you picked: {fmt(running, 4)} of {qty}.</p>
      <NumericAnswers key={key} exercise={exercise} done={done} onAllCorrect={() => { setDone(true); setReveal(true); onComplete(); }} />
      <button type="button" className="fel-btn" onClick={() => setReveal(true)}>Show the simulated match</button>
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ line-placement

export function LinePlacementWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const side: Side = p['side'] === 'short' ? 'short' : 'long';
  const entry = numOr(p['entry'], 100);
  const qty = numOr(p['quantity'], 1);
  const sCfg = isObj(p['stop']) ? p['stop'] : {};
  const tCfg = isObj(p['target']) ? p['target'] : {};
  const scenarios = objs(p['scenarios']).map((s) => ({ id: strOr(s['id'], ''), label: strOr(s['label'], ''), points: nums(s['points']) }));
  const init = { stop: numOr(sCfg['value'], entry * 0.99), target: numOr(tCfg['value'], entry * 1.02) };
  const [stop, setStop] = useState(init.stop);
  const [target, setTarget] = useState(init.target);
  const [scen, setScen] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const rr = riskReward({ side, entry, stop, target, quantity: qty });
  const ev = exercise.expectedEvaluation;
  const sc = scenarios.find((s) => s.id === scen);
  const events = sc ? slTpEvents(side, stop, target, sc.points) : null;
  const cs = candlesOf(fixture);
  const finish = () => { if (!done) { setDone(true); onComplete(); } };
  const constraintMet = rr.ok && (scenarios.length === 0 || seen.length === scenarios.length);
  const status: Status = done ? 'correct' : rr.ok ? 'info' : 'incorrect';
  return (
    <ExerciseShell exercise={exercise} status={status} done={done} onReset={() => { setStop(init.stop); setTarget(init.target); setScen(null); setSeen([]); }}
      feedback={!rr.ok ? <p>{rr.error.message}</p> : <p>Planned risk {fmt(rr.value.risk ?? 0, 2)} USDT, potential reward {fmt(rr.value.reward ?? 0, 2)} USDT (before fees). Reward ÷ risk = {fmt(rr.value.ratio, 2)}. This ratio is not a chance of winning.</p>}>
      <div className="fel-figure">
        <MiniChart candles={sc ? [] : cs} points={sc ? sc.points : []} label={`${side} entry ${entry}, stop ${stop}, target ${target}`}
          lines={[{ price: entry, label: `Entry ${fmt(entry, 2)}` }, { price: stop, label: `Stop-loss ${fmt(stop, 2)}`, cls: 'fel-svg-level-stop' }, { price: target, label: `Take-profit ${fmt(target, 2)}`, cls: 'fel-svg-level-target' }]} />
      </div>
      <div className="fel-sliders">
        <SliderField id={`${exercise.id}-stop`} label="Stop-loss price" unit="USDT" min={numOr(sCfg['min'], entry * 0.9)} max={numOr(sCfg['max'], entry * 1.1)} step={numOr(sCfg['step'], 0.1)} value={stop} onChange={setStop} />
        <SliderField id={`${exercise.id}-target`} label="Take-profit price" unit="USDT" min={numOr(tCfg['min'], entry * 0.9)} max={numOr(tCfg['max'], entry * 1.1)} step={numOr(tCfg['step'], 0.1)} value={target} onChange={setTarget} />
      </div>
      {scenarios.length ? (
        <div className="fel-row fel-wrap" role="group" aria-label="Play a fictional scenario">
          {scenarios.map((s) => <button key={s.id} type="button" className={`fel-btn ${scen === s.id ? 'fel-btn-primary' : ''}`} disabled={!rr.ok} onClick={() => { setScen(s.id); setSeen((x) => (x.includes(s.id) ? x : [...x, s.id])); }}>{seen.includes(s.id) ? '✓ ' : ''}Play: {s.label}</button>)}
        </div>
      ) : null}
      {events && sc ? (
        <p className="fel-small" aria-live="polite">
          {events.first === null ? 'Neither level was reached: the position is still open.'
            : events.first === 'tp' ? `Take-profit reached at ${fmt(target, 2)} and filled at ${fmt(events.fill as number, 2)}.`
            : `Stop TRIGGERED at ${fmt(stop, 2)}; it FILLED at ${fmt(events.fill as number, 2)}${Math.abs((events.fill as number) - stop) > 1e-9 ? ` — ${fmt(Math.abs((events.fill as number) - stop), 2)} worse than planned (slippage/gap)` : ''}.`}
        </p>
      ) : null}
      {ev.kind === 'numeric' || ev.kind === 'numeric-set' ? <NumericAnswers exercise={exercise} done={done} onAllCorrect={finish} /> : null}
      {ev.kind === 'exact-choice' || ev.kind === 'choice-set' ? <InlineChoice exercise={exercise} onCorrect={finish} /> : null}
      {ev.kind === 'constraint' ? <button type="button" className="fel-btn fel-btn-primary" disabled={!constraintMet} onClick={finish}>{constraintMet ? 'Confirm my plan' : scenarios.length ? 'Place valid lines and play every scenario' : 'Place the lines on the correct sides'}</button> : null}
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ candle-builder

type Dir = 'bullish' | 'bearish' | 'doji';

export function CandleBuilderWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const min = numOr(p['min'], 90);
  const max = numOr(p['max'], 110);
  const step = numOr(p['step'], 0.1);
  const tasks = objs(p['tasks']).map((t) => ({ id: strOr(t['id'], ''), direction: strOr(t['direction'], 'bullish') as Dir }));
  const start = candlesOf(fixture)[0] ?? { o: 100, h: 102, l: 99, c: 101 };
  const init = { o: start.o, h: start.h, l: start.l, c: start.c };
  const [c, setC] = useState(init);
  const [doneTasks, setDoneTasks] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const round = (v: number) => Math.round(v / step) * step;
  const anatomy = ohlcAnatomy({ ...c, dojiThreshold: { bodyToRangeMax: 0 } });
  const set = (k: 'o' | 'h' | 'l' | 'c', raw: number) => {
    const v = Number(round(raw).toFixed(6));
    const n = { ...c, [k]: v };
    let msg = '';
    if (k === 'o' || k === 'c') {
      if (v > n.h) { n.h = v; msg = 'High moved up with the body: high can never be below open or close.'; }
      if (v < n.l) { n.l = v; msg = 'Low moved down with the body: low can never be above open or close.'; }
    }
    if (k === 'h' && v < Math.max(n.o, n.c)) { n.h = Math.max(n.o, n.c); msg = 'High cannot be lower than the top of the body.'; }
    if (k === 'l' && v > Math.min(n.o, n.c)) { n.l = Math.min(n.o, n.c); msg = 'Low cannot be higher than the bottom of the body.'; }
    setC(n);
    setNote(msg);
    const a = ohlcAnatomy({ ...n, dojiThreshold: { bodyToRangeMax: 0 } });
    if (!a.ok) return;
    const hit = tasks.filter((t) => t.direction === a.value.direction).map((t) => t.id);
    const nd = [...new Set([...doneTasks, ...hit])];
    if (nd.length === doneTasks.length) return;
    setDoneTasks(nd);
    if (nd.length === tasks.length) onComplete();
  };
  const done = tasks.length > 0 && doneTasks.length === tasks.length;
  return (
    <ExerciseShell exercise={exercise} status={done ? 'correct' : 'idle'} done={done} onReset={() => { setC(init); setDoneTasks([]); setNote(''); }}
      feedback={<p>{note ? `${note} ` : ''}{anatomy.ok ? `This candle is ${anatomy.value.direction.toUpperCase()}: body ${fmt(anatomy.value.body, 2)}, upper wick ${fmt(anatomy.value.upperWick, 2)}, lower wick ${fmt(anatomy.value.lowerWick, 2)}, range ${fmt(anatomy.value.range, 2)}.` : ''}</p>}>
      <div className="fel-builder">
        <div className="fel-figure fel-figure-small">
          <MiniChart candles={[{ t: 0, ...c }]} label={`Your candle: open ${c.o}, high ${c.h}, low ${c.l}, close ${c.c}`}
            lines={[{ price: c.o, label: `Open ${fmt(c.o, 2)}`, cls: 'fel-svg-level-faint' }, { price: c.c, label: `Close ${fmt(c.c, 2)}`, cls: 'fel-svg-level' }]} />
        </div>
        <div className="fel-sliders">
          <SliderField id={`${exercise.id}-o`} label="Open" unit="USDT" min={min} max={max} step={step} value={c.o} onChange={(v) => set('o', v)} />
          <SliderField id={`${exercise.id}-h`} label="High" unit="USDT" min={min} max={max} step={step} value={c.h} onChange={(v) => set('h', v)} />
          <SliderField id={`${exercise.id}-l`} label="Low" unit="USDT" min={min} max={max} step={step} value={c.l} onChange={(v) => set('l', v)} />
          <SliderField id={`${exercise.id}-c`} label="Close" unit="USDT" min={min} max={max} step={step} value={c.c} onChange={(v) => set('c', v)} />
        </div>
      </div>
      <ul className="fel-checklist" aria-label="Shapes to build">
        {tasks.map((t) => <li key={t.id} className={doneTasks.includes(t.id) ? 'is-done' : ''}>{doneTasks.includes(t.id) ? '✓' : '○'} Build a {t.direction} candle</li>)}
      </ul>
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ timeframe-switch

export function TimeframeSwitchWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const raw = candlesOf(fixture);
  const sizes = nums(p['groupSizes']).length ? nums(p['groupSizes']) : [1, 5, 15];
  const [g, setG] = useState(sizes[0] ?? 1);
  const [done, setDone] = useState(false);
  const agg = useMemo(() => ohlcAggregate({ candles: raw, groupSize: g }), [raw, g]);
  const cs = agg.ok ? agg.value.candles : [];
  const ev = exercise.expectedEvaluation;
  const finish = () => { if (!done) { setDone(true); onComplete(); } };
  return (
    <ExerciseShell exercise={exercise} status={done ? 'correct' : 'idle'} done={done} onReset={() => setG(sizes[0] ?? 1)}
      feedback={<p>Showing {cs.length} candle{cs.length === 1 ? '' : 's'} of {g} minute{g === 1 ? '' : 's'} each, built from the same {raw.length} one-minute candles.{cs.some((c) => c.partial) ? ' The last one is unfinished.' : ''}</p>}>
      <div className="fel-seg" role="radiogroup" aria-label="Timeframe">
        {sizes.map((s) => <label key={s} className={`fel-seg-opt ${g === s ? 'is-on' : ''}`}><input type="radio" name={`${exercise.id}-tf`} checked={g === s} onChange={() => setG(s)} /><span>{s}m</span></label>)}
      </div>
      <div className="fel-figure"><MiniChart candles={cs} labels={cs.map((_, k) => `#${k + 1}`)} label={`Fictional ${g}-minute candles: ${cs.map((c) => `O ${c.o} H ${c.h} L ${c.l} C ${c.c}`).join('; ')}`} /></div>
      <details className="fel-details"><summary>Show the numbers</summary>
        <table className="fel-table fel-table-compact"><thead><tr><th scope="col">#</th><th scope="col">Open</th><th scope="col">High</th><th scope="col">Low</th><th scope="col">Close</th></tr></thead>
          <tbody>{cs.map((c, k) => <tr key={k}><td>{k + 1}{c.partial ? '*' : ''}</td><td>{fmt(c.o, 2)}</td><td>{fmt(c.h, 2)}</td><td>{fmt(c.l, 2)}</td><td>{fmt(c.c, 2)}</td></tr>)}</tbody></table>
      </details>
      {ev.kind === 'numeric' || ev.kind === 'numeric-set' ? <NumericAnswers exercise={exercise} done={done} onAllCorrect={finish} /> : null}
      {ev.kind === 'exact-choice' || ev.kind === 'choice-set' ? <InlineChoice exercise={exercise} onCorrect={finish} /> : null}
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ lookback-range

export function LookbackRangeWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const cs = candlesOf(fixture);
  const wCfg = isObj(p['window']) ? p['window'] : {};
  const wMin = Math.max(1, numOr(wCfg['min'], 3));
  const wMax = Math.min(cs.length, numOr(wCfg['max'], cs.length));
  const [win, setWin] = useState(Math.min(wMax, Math.max(wMin, numOr(wCfg['value'], wMin))));
  const [done, setDone] = useState(false);
  const r = rangeLookback({ candles: cs, window: win });
  return (
    <ExerciseShell exercise={exercise} status={done ? 'correct' : 'idle'} done={done} onReset={() => setWin(Math.min(wMax, Math.max(wMin, numOr(wCfg['value'], wMin))))}
      feedback={r.ok ? <p>Window: last {win} candles. Highest high {fmt(r.value.max, 2)}, lowest low {fmt(r.value.min, 2)}.</p> : <p>{r.error.message}</p>}>
      <div className="fel-figure">
        <MiniChart candles={cs} labels={labelsOf(fixture)} window={r.ok ? { start: r.value.startIndex, end: r.value.endIndex } : undefined}
          lines={r.ok ? [{ price: r.value.max, label: `Highest high ${fmt(r.value.max, 2)}`, cls: 'fel-svg-level-target' }, { price: r.value.min, label: `Lowest low ${fmt(r.value.min, 2)}`, cls: 'fel-svg-level-stop' }] : []}
          label={`Fictional candles with a lookback window of ${win}`} />
      </div>
      <SliderField id={`${exercise.id}-win`} label="Lookback window" unit="candles" min={wMin} max={wMax} step={1} value={win} onChange={(v) => setWin(Math.round(v))} />
      <NumericAnswers exercise={exercise} done={done} onAllCorrect={() => { setDone(true); onComplete(); }} />
    </ExerciseShell>
  );
}

// ------------------------------------------------------------------ zone-placement

export function ZonePlacementWidget({ exercise, fixture, onComplete }: WidgetProps) {
  const p = exercise.parameters;
  const cs = candlesOf(fixture);
  const z = isObj(p['zone']) ? p['zone'] : {};
  const ref = isObj(p['reference']) ? p['reference'] : {};
  const zmin = numOr(z['min'], Math.min(...cs.map((c) => c.l)));
  const zmax = numOr(z['max'], Math.max(...cs.map((c) => c.h)));
  const step = numOr(z['step'], 0.1);
  const init = { low: numOr(z['low'], zmin), high: numOr(z['high'], zmin + step * 5) };
  const [low, setLow] = useState(init.low);
  const [high, setHigh] = useState(init.high);
  const [zoneOk, setZoneOk] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const rl = numOr(ref['low'], 0);
  const rh = numOr(ref['high'], 0);
  const checkZone = () => {
    const lo = Math.min(low, high);
    const hi = Math.max(low, high);
    const overlap = Math.max(0, Math.min(hi, rh) - Math.max(lo, rl));
    const ok = overlap >= 0.5 * (rh - rl) && hi - lo <= 3 * (rh - rl);
    setZoneOk(ok);
  };
  return (
    <ExerciseShell exercise={exercise} status={done ? 'correct' : zoneOk === false ? 'incorrect' : 'idle'} done={done} onReset={() => { setLow(init.low); setHigh(init.high); setZoneOk(null); }}
      feedback={zoneOk === null ? null : zoneOk ? <p>Good zone: it covers the area where price turned several times.</p> : <p>Your zone misses most of the area where price turned, or it is too wide to be useful. Look for where several candles stopped.</p>}>
      <div className="fel-figure">
        <MiniChart candles={cs} labels={labelsOf(fixture)} zone={{ low: Math.min(low, high), high: Math.max(low, high), label: `Your zone ${fmt(Math.min(low, high), 2)}–${fmt(Math.max(low, high), 2)}` }} label={`Fictional chart with your zone from ${low} to ${high}`} />
      </div>
      <div className="fel-sliders">
        <SliderField id={`${exercise.id}-low`} label="Zone bottom" unit="USDT" min={zmin} max={zmax} step={step} value={low} onChange={(v) => { setLow(v); setZoneOk(null); }} />
        <SliderField id={`${exercise.id}-high`} label="Zone top" unit="USDT" min={zmin} max={zmax} step={step} value={high} onChange={(v) => { setHigh(v); setZoneOk(null); }} />
      </div>
      <button type="button" className="fel-btn" onClick={checkZone}>Check my zone</button>
      {zoneOk ? <InlineChoice exercise={exercise} onCorrect={() => { setDone(true); onComplete(); }} /> : null}
    </ExerciseShell>
  );
}
