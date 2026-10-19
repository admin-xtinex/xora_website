/** Scene renderers: position sizing and the full decision lifecycle. Pure functions of p. */
import { positionSize, type Side } from '../../simulation/math';
import { Bar, Card, clamp, FictionalBadge, fmt, Frame, makeScale, pathD, phase, priceAt, W } from '../chart';
import { nums, numOr, strOr, strs } from '../params';
import type { SceneProps } from '../types';

export function PositionSizingScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'risk-budget');
  const side: Side = params['side'] === 'short' ? 'short' : 'long';
  const balance = numOr(params['balance'], 1000);
  const risk = numOr(params['riskAmount'], 10);
  const entry = numOr(params['entry'], 100);
  const stops = nums(params['stops']);
  if (variant === 'builder') {
    const stop = stops[0] ?? entry * 0.99;
    const r = positionSize({ side, riskAmount: risk, entry, stop });
    const v = r.ok ? r.value : null;
    const steps = [
      `1. Account (fictional): ${fmt(balance, 2)} USDT`,
      `2. Risk budget (example): ${fmt(risk, 2)} USDT`,
      `3. Stop distance: |${fmt(entry, 2)} − ${fmt(stop, 2)}| = ${v ? fmt(v.stopDistance, 2) : '—'} (${v ? fmt(v.stopDistancePercent, 2) : '—'}%)`,
      `4. Size = ${fmt(risk, 2)} ÷ ${v ? fmt(v.stopDistance, 2) : '—'} = ${v ? fmt(v.quantity, 4) : '—'} DEMO`,
      `5. Notional ≈ ${v ? fmt(v.notional, 2) : '—'} USDT`,
      'Before fees and slippage. Stops can slip.',
    ];
    const shown = Math.ceil(clamp(p * 1.1, 0, 1) * steps.length);
    return (
      <Frame label={steps.join(' ')}>
        <FictionalBadge />
        <text x={40} y={44} className="fel-svg-title">{side.toUpperCase()} size from a risk budget (simple model)</text>
        {steps.slice(0, shown).map((s, k) => <text key={k} x={40} y={90 + k * 38} className={k === steps.length - 1 ? 'fel-svg-small' : 'fel-svg-label'}>{s}</text>)}
      </Frame>
    );
  }
  // risk-budget: same risk, different stop distances → different notional
  const idx = Math.min(stops.length - 1, Math.floor(p * stops.length));
  const rows = stops.map((s) => ({ s, r: positionSize({ side, riskAmount: risk, entry, stop: s }) }));
  const maxN = Math.max(1, ...rows.map(({ r }) => (r.ok ? r.value.notional : 0)));
  return (
    <Frame label={`Risk budget ${risk} USDT fixed. ${rows.map(({ s, r }) => `stop ${s}: notional ${r.ok ? fmt(r.value.notional, 2) : 'invalid'}`).join('; ')}`}>
      <FictionalBadge />
      <Bar x={40} y={50} w={560} frac={risk / balance} label={`Risk budget: ${fmt(risk, 2)} USDT of ${fmt(balance, 2)} (example only)`} value={`${fmt((risk / balance) * 100, 2)}%`} tone="warn" />
      {rows.map(({ s, r }, k) => (
        <g key={k} opacity={k <= idx ? 1 : 0.2}>
          <Bar x={40} y={130 + k * 64} w={560} frac={r.ok ? r.value.notional / maxN : 0}
            label={`Stop ${fmt(s, 2)} → distance ${r.ok ? fmt(r.value.stopDistancePercent, 2) : '—'}%`}
            value={r.ok ? `notional ${fmt(r.value.notional, 2)} USDT` : r.error.message} tone={r.ok ? 'neutral' : 'down'} />
        </g>
      ))}
      <text x={40} y={340} className="fel-svg-small">Same money at risk. A wider stop means a smaller position.</text>
    </Frame>
  );
}

export function TradeLifecycleScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'full');
  const steps = strs(params['steps']);
  const path = nums(params['path']);
  const decision = strOr(params['decision'], '');
  const outcome = strOr(params['outcome'], '');
  const active = Math.min(steps.length - 1, Math.floor(p * steps.length));
  const box = { x: 300, y: 50, w: 320, h: 220 };
  const sc = makeScale(path.length ? path : [1, 2], Math.max(2, path.length), box);
  const vis = 1 + phase(p, 0, 1) * (Math.max(2, path.length) - 1);
  return (
    <Frame label={`Decision lifecycle step ${active + 1}: ${steps[active] ?? ''}${decision ? `. Decision: ${decision}` : ''}`}>
      <FictionalBadge text="EDUCATIONAL SIMULATION" />
      {steps.map((s, k) => (
        <g key={k}>
          <circle cx={36} cy={44 + k * 36} r={11} className={k < active ? 'fel-svg-step-done' : k === active ? 'fel-svg-step-on' : 'fel-svg-step'} />
          <text x={36} y={48 + k * 36} textAnchor="middle" className="fel-svg-step-num">{k + 1}</text>
          <text x={56} y={49 + k * 36} className={k === active ? 'fel-svg-label' : 'fel-svg-small'}>{s.length > 30 ? `${s.slice(0, 29)}…` : s}</text>
        </g>
      ))}
      {path.length > 1 ? (
        <g>
          <path d={pathD(path, sc, vis)} className="fel-svg-price" />
          <text x={box.x} y={box.y - 10} className="fel-svg-small">Fictional DEMO/USDT · now {fmt(priceAt(path, vis), 2)}</text>
        </g>
      ) : null}
      {decision && (variant === 'decision-gate' ? p > 0.5 : p > 0.7) ? (
        <Card x={300} y={284} w={320} h={60} title={`DEMO decision: ${decision}`} lines={[outcome || ' ']} tone={decision === 'NO_TRADE' || decision === 'WAIT' ? 'neutral' : 'warn'} />
      ) : null}
      {variant === 'journal' ? <text x={W - 20} y={350} textAnchor="end" className="fel-svg-small">Judge the process, not only the result.</text> : null}
    </Frame>
  );
}
