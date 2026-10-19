/** Scene renderers: price paths, PnL, protective orders, costs, futures mechanics. Pure functions of p. */
import { breakEvenPrice, clean, feesNet, fundingPayment, leverageExposure, liquidationApprox, pnlLinear, type Side } from '../../simulation/math';
import { Bar, Card, clamp, FictionalBadge, fmt, Frame, HLine, lerp, makeScale, pathD, phase, PriceAxis, priceAt, signed, SignedBar, W } from '../chart';
import { isObj, nums, numOr, objs, strOr } from '../params';
import type { SceneProps } from '../types';

const sideOf = (v: unknown): Side => (v === 'short' ? 'short' : 'long');

// ------------------------------------------------------------------ price-path

export function PricePathScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'plain');
  const pts = nums(params['points']);
  const markers = objs(params['markers']);
  const level = isObj(params['level']) ? params['level'] : undefined;
  if (variant === 'horizon-compare') {
    const cmp = nums(params['comparePoints']);
    const top = { x: 56, y: 24, w: 560, h: 130 };
    const bot = { x: 56, y: 196, w: 560, h: 130 };
    const s1 = makeScale(pts, pts.length, top);
    const s2 = makeScale(cmp, cmp.length, bot);
    return (
      <Frame label="Two time horizons of the same fictional market">
        <FictionalBadge />
        <text x={56} y={18} className="fe-svg-label">{strOr(params['label'], 'Short horizon')}</text>
        <path d={pathD(pts, s1, 1 + phase(p, 0, 0.5) * (pts.length - 1))} className="fe-svg-price" />
        <text x={56} y={190} className="fe-svg-label">{strOr(params['compareLabel'], 'Longer horizon')}</text>
        <path d={pathD(cmp, s2, 1 + phase(p, 0.5, 1) * (cmp.length - 1))} className="fe-svg-price-alt" />
      </Frame>
    );
  }
  const sc = makeScale([...pts, ...(level ? [numOr(level['price'], pts[0] ?? 0)] : [])], pts.length);
  const vis = 1 + p * (pts.length - 1);
  return (
    <Frame label={`Fictional price path, now ${fmt(priceAt(pts, vis), 2)}`}>
      <FictionalBadge />
      <PriceAxis scale={sc} />
      {level ? <HLine y={sc.y(numOr(level['price'], 0))} label={strOr(level['label'], '')} /> : null}
      <path d={pathD(pts, sc, vis)} className="fe-svg-price" />
      {markers.map((m, k) => {
        const i = numOr(m['index'], 0);
        if (vis - 1 < i) return null;
        return (
          <g key={k}>
            <circle cx={sc.x(i)} cy={sc.y(pts[i] ?? 0)} r={5} className="fe-svg-dot-mark" />
            <text x={sc.x(i)} y={sc.y(pts[i] ?? 0) - 10} textAnchor="middle" className="fe-svg-label">{strOr(m['label'], '')}</text>
          </g>
        );
      })}
    </Frame>
  );
}

// ------------------------------------------------------------------ pnl-meter

export function PnlMeterScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'single-position');
  const path = nums(params['path']);
  const entry = numOr(params['entry'], path[0] ?? 0);
  const qty = numOr(params['quantity'], 1);
  const side = sideOf(params['side']);
  const unit = strOr(params['unit'], 'USDT');
  const exitIndex = typeof params['exitIndex'] === 'number' ? params['exitIndex'] : undefined;
  const box = { x: 56, y: 28, w: 340, h: 290 };
  const sc = makeScale([...path, entry], path.length, box);
  const vis = 1 + p * (path.length - 1);
  const closed = exitIndex !== undefined && vis - 1 >= exitIndex;
  const now = closed ? (path[exitIndex as number] as number) : priceAt(path, vis);
  const pnl = (s: Side) => { const r = pnlLinear({ side: s, entry, exit: now, quantity: qty }); return r.ok ? r.value.grossPnl : 0; };
  const maxAbs = Math.max(...path.map((v) => Math.abs(v - entry) * qty), 1e-9);
  return (
    <Frame label={`Entry ${fmt(entry, 2)}, price now ${fmt(now, 2)}; long PnL ${signed(pnl('long'), 2)}, short PnL ${signed(pnl('short'), 2)}`}>
      <FictionalBadge />
      <PriceAxis scale={sc} box={box} />
      <HLine y={sc.y(entry)} x1={box.x} x2={box.x + box.w} label={`Entry ${fmt(entry, 2)}`} side="left" />
      <path d={pathD(path, sc, exitIndex !== undefined ? Math.min(vis, exitIndex + 1) : vis)} className="fe-svg-price" />
      {closed ? <circle cx={sc.x(exitIndex as number)} cy={sc.y(now)} r={6} className="fe-svg-dot-mark" /> : null}
      {variant === 'long-short-parallel' ? (
        <g>
          <SignedBar x={416} y={110} w={200} value={pnl('long')} maxAbs={maxAbs} label="LONG (gains if price rises)" valueText={`${signed(pnl('long'), 2)} ${unit}`} />
          <SignedBar x={416} y={190} w={200} value={pnl('short')} maxAbs={maxAbs} label="SHORT (gains if price falls)" valueText={`${signed(pnl('short'), 2)} ${unit}`} />
          <text x={416} y={250} className="fe-svg-small">Same price path. Opposite results.</text>
        </g>
      ) : (
        <g>
          <SignedBar x={416} y={120} w={200} value={pnl(side)} maxAbs={maxAbs} label={`${side.toUpperCase()} ${qty}`} valueText={`${signed(pnl(side), 2)} ${unit}`} />
          <text x={416} y={180} className="fe-svg-label">{closed ? 'REALIZED (position closed)' : 'UNREALIZED (still open)'}</text>
          <text x={416} y={204} className="fe-svg-small">Price now {fmt(now, 2)}</text>
          {variant === 'timeline' ? <text x={416} y={228} className="fe-svg-small">Gross, before fees</text> : null}
        </g>
      )}
    </Frame>
  );
}

// ------------------------------------------------------------------ sl-tp-lines

export function slTpEvents(side: Side, stop: number, target: number, path: number[], stopLimit?: number) {
  const hitTp = path.findIndex((v, k) => k > 0 && (side === 'long' ? v >= target : v <= target));
  const hitSl = path.findIndex((v, k) => k > 0 && (side === 'long' ? v <= stop : v >= stop));
  const first = hitTp >= 0 && (hitSl < 0 || hitTp < hitSl) ? 'tp' : hitSl >= 0 ? 'sl' : null;
  let fill: number | null = null;
  let fillIdx: number | null = null;
  if (first === 'tp') { fill = target; fillIdx = hitTp; }
  if (first === 'sl') {
    if (stopLimit === undefined) { fill = path[hitSl] as number; fillIdx = hitSl; }
    else {
      const j = path.findIndex((v, k) => k >= hitSl && (side === 'long' ? v >= stopLimit : v <= stopLimit));
      fill = j < 0 ? null : stopLimit; fillIdx = j < 0 ? null : j;
    }
  }
  return { first, triggerIdx: first === 'tp' ? hitTp : first === 'sl' ? hitSl : null, fill, fillIdx };
}

export function SlTpScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'setup');
  const side = sideOf(params['side']);
  const entry = numOr(params['entry'], 0);
  const stop = numOr(params['stop'], 0);
  const target = numOr(params['target'], 0);
  const stopLimit = typeof params['stopLimit'] === 'number' ? params['stopLimit'] : undefined;
  const path = variant === 'setup' ? [entry, entry] : nums(params['path']);
  const box = { x: 56, y: 28, w: 380, h: 290 };
  const sc = makeScale([...path, entry, stop, target, ...(stopLimit !== undefined ? [stopLimit] : [])], path.length, box);
  const ev = slTpEvents(side, stop, target, path, stopLimit);
  const vis = 1 + (variant === 'setup' ? 0 : p) * (path.length - 1);
  const now = vis - 1;
  const drawTo = ev.fillIdx !== null ? Math.min(vis, ev.fillIdx + 1) : vis;
  const show = (from: number) => (variant === 'setup' ? phase(p, from, from + 0.25) : 1);
  const triggered = ev.triggerIdx !== null && now >= ev.triggerIdx;
  const filled = ev.fillIdx !== null && now >= ev.fillIdx;
  const status = variant === 'setup' ? 'Plan set before entry' : filled ? (ev.first === 'tp' ? `Take-profit FILLED at ${fmt(ev.fill as number, 2)}` : `Stop-loss FILLED at ${fmt(ev.fill as number, 2)}`) : triggered ? 'Stop TRIGGERED — limit not reached, NOT filled' : 'Position open';
  const qty = numOr(params['quantity'], 1);
  const result = filled && ev.fill !== null ? (side === 'long' ? ev.fill - entry : entry - ev.fill) * qty : null;
  const slip = filled && ev.first === 'sl' && ev.fill !== null ? Math.abs(ev.fill - stop) : 0;
  return (
    <Frame label={`${side} entry ${fmt(entry, 2)}, stop ${fmt(stop, 2)}, target ${fmt(target, 2)}. ${status}`}>
      <FictionalBadge />
      <PriceAxis scale={sc} box={box} />
      <g opacity={show(0)}><HLine y={sc.y(entry)} x1={box.x} x2={box.x + box.w} label={`Entry ${fmt(entry, 2)}`} side="left" /></g>
      <g opacity={show(0.25)}><HLine y={sc.y(stop)} x1={box.x} x2={box.x + box.w} label={`Stop-loss ${fmt(stop, 2)}`} cls="fe-svg-level-stop" side="left" /></g>
      <g opacity={show(0.5)}><HLine y={sc.y(target)} x1={box.x} x2={box.x + box.w} label={`Take-profit ${fmt(target, 2)}`} cls="fe-svg-level-target" side="left" /></g>
      {stopLimit !== undefined ? <HLine y={sc.y(stopLimit)} x1={box.x} x2={box.x + box.w} label={`Stop-limit ${fmt(stopLimit, 2)}`} cls="fe-svg-level-stop" side="right" /> : null}
      {variant !== 'setup' ? <path d={pathD(path, sc, drawTo)} className="fe-svg-price" /> : null}
      {triggered && ev.triggerIdx !== null ? <circle cx={sc.x(ev.triggerIdx)} cy={sc.y(ev.first === 'tp' ? target : stop)} r={5} className="fe-svg-dot-ring" /> : null}
      {filled && ev.fillIdx !== null && ev.fill !== null ? <circle cx={sc.x(ev.fillIdx)} cy={sc.y(ev.fill)} r={6} className={ev.first === 'tp' ? 'fe-svg-dot-buy' : 'fe-svg-dot-sell'} /> : null}
      <Card x={452} y={40} w={172} h={170} title={side === 'long' ? 'LONG plan' : 'SHORT plan'} tone={filled ? (result !== null && result >= 0 ? 'up' : 'down') : triggered ? 'warn' : 'neutral'}
        lines={[
          `Risk/unit ${fmt(Math.abs(entry - stop), 2)}`,
          `Reward/unit ${fmt(Math.abs(target - entry), 2)}`,
          `R:R ${fmt(Math.abs(target - entry) / Math.max(1e-9, Math.abs(entry - stop)), 2)} (not a win chance)`,
          result !== null ? `Result ${signed(result, 2)} USDT` : ' ',
          slip > 0 ? `Slipped ${fmt(slip, 2)} past stop` : ' ',
        ]} />
      <text x={452} y={240} className="fe-svg-small" style={{ fontWeight: 600 }}>{status.length > 30 ? status.slice(0, 30) : status}</text>
      {status.length > 30 ? <text x={452} y={258} className="fe-svg-small">{status.slice(30)}</text> : null}
    </Frame>
  );
}

// ------------------------------------------------------------------ fee-buildup

export function FeeBuildupScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'waterfall');
  const side = sideOf(params['side']);
  const entry = numOr(params['entry'], 0);
  const exit = numOr(params['exit'], entry);
  const qty = numOr(params['quantity'], 1);
  const fe = numOr(params['entryFeeRate'], 0.0005);
  const fx = numOr(params['exitFeeRate'], 0.0005);
  const spread = numOr(params['spreadCost'], 0);
  const slip = numOr(params['slippageCost'], 0);
  if (variant === 'compare-roles') {
    const notional = numOr(params['notional'], entry * qty);
    const maker = numOr(params['makerRate'], 0.0002);
    const taker = numOr(params['takerRate'], 0.0005);
    const t = phase(p, 0.1, 0.8);
    const max = notional * Math.max(maker, taker);
    return (
      <Frame label={`Fee on ${fmt(notional, 2)} USDT notional: maker ${fmt(notional * maker, 4)}, taker ${fmt(notional * taker, 4)}`}>
        <FictionalBadge text="ILLUSTRATIVE RATES" />
        <text x={40} y={50} className="fe-svg-title">Fee on a {fmt(notional, 2)} USDT order</text>
        <Bar x={40} y={110} w={540} frac={(notional * maker * t) / max} label={`MAKER ${(maker * 100).toFixed(2)}% (order waits in the book)`} value={`${fmt(notional * maker * t, 4)} USDT`} tone="neutral" />
        <Bar x={40} y={190} w={540} frac={(notional * taker * t) / max} label={`TAKER ${(taker * 100).toFixed(2)}% (order takes from the book)`} value={`${fmt(notional * taker * t, 4)} USDT`} tone="warn" />
        <text x={40} y={270} className="fe-svg-small">Rates differ by exchange and account. Check your own before acting.</text>
      </Frame>
    );
  }
  const r = feesNet({ side, entry, exit, quantity: qty, entryFeeRate: fe, exitFeeRate: fx, spreadCost: spread, slippageCost: slip });
  const v = r.ok ? r.value : { grossPnl: 0, entryFee: 0, exitFee: 0, otherCosts: 0, totalCosts: 0, netPnl: 0 };
  if (variant === 'break-even') {
    const be = breakEvenPrice({ side, entry, entryFeeRate: fe, exitFeeRate: fx });
    const bp = be.ok ? be.value.breakEven : entry;
    const pts = [entry, exit];
    const sc = makeScale([entry, exit, bp], 2);
    const t = phase(p, 0.2, 0.9);
    return (
      <Frame label={`Entry ${fmt(entry, 2)}, break-even after fees ${fmt(bp, 2)}, exit ${fmt(exit, 2)}`}>
        <FictionalBadge />
        <PriceAxis scale={sc} />
        <HLine y={sc.y(entry)} label={`Entry ${fmt(entry, 2)}`} side="left" />
        <g opacity={phase(p, 0, 0.3)}><HLine y={sc.y(bp)} label={`Break-even after fees ${fmt(bp, 2)}`} cls="fe-svg-level-stop" side="left" /></g>
        <path d={pathD(pts, sc, 1 + t)} className="fe-svg-price" />
        <text x={W / 2} y={340} textAnchor="middle" className="fe-svg-label">{side === 'long' ? 'Price must rise past break-even before a long makes money' : 'Price must fall past break-even before a short makes money'}</text>
      </Frame>
    );
  }
  if (variant === 'accumulate') {
    const trades = Math.max(1, Math.round(numOr(params['trades'], 10)));
    const n = Math.max(1, Math.ceil(p * trades));
    const gross = v.grossPnl * n;
    const costs = v.totalCosts * n;
    const max = Math.max(Math.abs(v.grossPnl) * trades, v.totalCosts * trades, 1e-9);
    return (
      <Frame label={`After ${n} trades: gross ${signed(gross, 2)}, costs ${fmt(costs, 2)}, net ${signed(gross - costs, 2)} USDT`}>
        <FictionalBadge />
        <text x={40} y={50} className="fe-svg-title">After {n} of {trades} identical fictional trades</text>
        <SignedBar x={40} y={100} w={560} value={gross} maxAbs={max} label="Gross result" valueText={`${signed(gross, 2)} USDT`} />
        <SignedBar x={40} y={170} w={560} value={-costs} maxAbs={max} label="Fees + spread + slippage" valueText={`−${fmt(costs, 2)} USDT`} />
        <SignedBar x={40} y={240} w={560} value={gross - costs} maxAbs={max} label="Net result" valueText={`${signed(gross - costs, 2)} USDT`} />
        <text x={40} y={310} className="fe-svg-small">More trades = more costs. Costs are certain; profits are not.</text>
      </Frame>
    );
  }
  // waterfall / gross-to-net
  const steps: Array<{ label: string; delta: number }> = [
    { label: 'Gross result', delta: v.grossPnl },
    { label: `Entry fee (${(fe * 100).toFixed(3)}%)`, delta: -v.entryFee },
    { label: `Exit fee (${(fx * 100).toFixed(3)}%)`, delta: -v.exitFee },
    ...(spread > 0 ? [{ label: 'Spread cost', delta: -spread }] : []),
    ...(slip > 0 ? [{ label: 'Slippage', delta: -slip }] : []),
  ];
  const shown = Math.ceil(clamp(p * 1.2, 0, 1) * (steps.length + 1));
  const max = Math.max(Math.abs(v.grossPnl), v.totalCosts, Math.abs(v.netPnl), 1e-9);
  return (
    <Frame label={`Gross ${signed(v.grossPnl, 4)} USDT, costs ${fmt(v.totalCosts, 4)}, net ${signed(v.netPnl, 4)} USDT`}>
      <FictionalBadge />
      <text x={40} y={34} className="fe-svg-label">{side.toUpperCase()} {qty} at {fmt(entry, 2)} → {fmt(exit, 2)} (fictional)</text>
      {steps.map((s, k) => (k < shown ? <SignedBar key={k} x={40} y={66 + k * 50} w={560} h={14} value={s.delta} maxAbs={max} label={s.label} valueText={`${signed(s.delta, 4)} USDT`} /> : null))}
      {shown > steps.length ? (
        <g>
          <SignedBar x={40} y={66 + steps.length * 50} w={560} h={18} value={v.netPnl} maxAbs={max} label="NET RESULT" valueText={`${signed(v.netPnl, 4)} USDT`} />
          {v.grossPnl > 0 && v.netPnl < 0 ? <text x={40} y={66 + steps.length * 50 + 40} className="fe-svg-label fe-svg-text-down">A gross winner became a net loser.</text> : null}
        </g>
      ) : null}
    </Frame>
  );
}

// ------------------------------------------------------------------ spot-vs-futures

export function SpotVsFuturesScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'ownership');
  const path = nums(params['path']);
  const entry = path[0] ?? 0;
  const spotQty = numOr(params['spotQuantity'], 1);
  const futQty = numOr(params['futuresQuantity'], spotQty);
  const margin = numOr(params['margin'], entry * futQty);
  const vis = 1 + p * (path.length - 1);
  const now = priceAt(path, vis);
  const futPnl = (now - entry) * futQty;
  const equity = margin + futPnl;
  const marginGone = equity <= 0;
  const sc = makeScale(path, path.length, { x: 40, y: 40, w: 560, h: 100 });
  return (
    <Frame label={`Price ${fmt(now, 2)}. Spot: you own ${spotQty} coins worth ${fmt(spotQty * now, 2)}. Futures: position PnL ${signed(futPnl, 2)}, margin left ${fmt(Math.max(0, equity), 2)}`}>
      <FictionalBadge />
      <path d={pathD(path, sc, vis)} className="fe-svg-price" />
      <text x={40} y={34} className="fe-svg-small">Fictional DEMO price: {fmt(now, 2)} USDT</text>
      <Card x={30} y={170} w={280} h={150} title="SPOT: you own the asset" tone="neutral"
        lines={[`Holding: ${fmt(spotQty, 4)} DEMO`, `Worth now: ${fmt(spotQty * now, 2)} USDT`, 'Still yours if price falls', 'No liquidation, no funding']} />
      <Card x={330} y={170} w={280} h={150} title="FUTURES: a contract position" tone={marginGone ? 'down' : futPnl < 0 ? 'warn' : 'neutral'}
        lines={[`Exposure: ${fmt(futQty, 4)} DEMO`, `PnL: ${signed(futPnl, 2)} USDT`, `Margin left: ${fmt(Math.max(0, equity), 2)} USDT`, marginGone ? (variant === 'crash-comparison' ? 'Margin gone: closed (conceptual)' : 'Margin gone') : 'You own no coins here']} />
    </Frame>
  );
}

// ------------------------------------------------------------------ leverage-exposure

export function LeverageExposureScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'pnl-amplification');
  const margin = numOr(params['margin'], 100);
  const levs = nums(params['leverages']);
  const side = sideOf(params['side']);
  const moves = nums(params['movePercents']);
  if (variant === 'exposure-bars') {
    const maxN = margin * Math.max(...levs, 1);
    return (
      <Frame label={`Same ${margin} USDT margin controls ${levs.map((l) => fmt(margin * l, 0)).join(', ')} USDT of exposure`}>
        <FictionalBadge />
        <text x={40} y={40} className="fe-svg-title">Margin {fmt(margin, 2)} USDT (your money at risk)</text>
        {levs.map((l, k) => {
          const t = phase(p, k / levs.length, (k + 1) / levs.length);
          return <Bar key={k} x={40} y={90 + k * 70} w={560} frac={(margin * l * t) / maxN} label={`${l}× leverage → notional exposure`} value={`${fmt(margin * l * t, 2)} USDT`} tone={l >= 10 ? 'warn' : 'neutral'} />;
        })}
        <text x={40} y={90 + levs.length * 70} className="fe-svg-small">Notional ≈ margin × leverage. The margin is the same; the exposure is not.</text>
      </Frame>
    );
  }
  const idx = moves.length > 1 ? p * (moves.length - 1) : 0;
  const k0 = Math.floor(idx);
  const move = moves.length > 1 ? lerp(moves[k0] as number, moves[Math.min(moves.length - 1, k0 + 1)] as number, idx - k0) : (moves[0] ?? 0);
  return (
    <Frame label={`Price move ${signed(move, 2)}%. Return on margin: ${levs.map((l) => `${l}× ${signed(move * l * (side === 'long' ? 1 : -1), 1)}%`).join(', ')}`}>
      <FictionalBadge />
      <text x={40} y={40} className="fe-svg-title">Price move: {signed(move, 2)}% ({side})</text>
      {levs.map((l, k) => {
        const r = leverageExposure({ side, margin, leverage: l, movePercent: move });
        const rom = r.ok ? r.value.returnOnMarginPercent : 0;
        const gone = r.ok && r.value.marginUsedUp;
        return (
          <g key={k}>
            <SignedBar x={40} y={90 + k * 72} w={560} value={Math.max(-100, rom)} maxAbs={100} label={`${l}× · PnL ${r.ok ? signed(r.value.grossPnl, 2) : '—'} USDT`} valueText={gone ? 'margin used up (liquidated earlier)' : `${signed(rom, 1)}% of margin`} />
          </g>
        );
      })}
      <text x={40} y={90 + levs.length * 72} className="fe-svg-small">Same price move. Leverage magnifies the result in BOTH directions. Simplified; fees ignored.</text>
    </Frame>
  );
}

// ------------------------------------------------------------------ margin-buffer

export function MarginBufferScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'maintenance-gauge');
  const side = sideOf(params['side']);
  const entry = numOr(params['entry'], 100);
  const lev = numOr(params['leverage'], 10);
  const mmr = numOr(params['mmr'], 0.005);
  const path = nums(params['path']);
  const qty = numOr(params['quantity'], 1);
  if (variant === 'tier-comparison') {
    const tiers = nums(params['tiers']);
    return (
      <Frame label={`Approximate liquidation prices at ${lev}× for maintenance rates ${tiers.map((t) => `${(t * 100).toFixed(1)}%`).join(', ')}`}>
        <FictionalBadge text="APPROXIMATE MODEL" />
        <text x={40} y={44} className="fe-svg-title">{side.toUpperCase()} at {fmt(entry, 2)}, {lev}× — higher maintenance rate, closer liquidation</text>
        {tiers.map((t, k) => {
          const r = liquidationApprox({ side, entry, leverage: lev, mmr: t });
          const on = phase(p, k / tiers.length, (k + 1) / tiers.length);
          return (
            <g key={k} opacity={0.2 + 0.8 * on}>
              <Card x={40 + k * 196} y={100} w={180} h={120} title={`MMR ${(t * 100).toFixed(1)}%`} tone="warn"
                lines={[r.ok ? `≈ ${fmt(r.value.liquidationPrice, 2)}` : 'outside model', r.ok ? `${signed(r.value.distancePercent, 2)}% away` : ' ', 'approximate']} />
            </g>
          );
        })}
      </Frame>
    );
  }
  const margin = (entry * qty) / lev;
  const vis = 1 + p * (path.length - 1);
  const now = priceAt(path, vis);
  const pnl = (side === 'long' ? now - entry : entry - now) * qty;
  const maint = mmr * entry * qty;
  const equity = margin + pnl;
  const liq = liquidationApprox({ side, entry, leverage: lev, mmr });
  const liqP = liq.ok ? liq.value.liquidationPrice : NaN;
  const hit = equity <= maint;
  const box = { x: 56, y: 28, w: 340, h: 290 };
  const sc = makeScale([...path, liqP].filter(Number.isFinite), path.length, box);
  const isoCross = variant === 'isolated-vs-cross';
  const wallet = numOr(params['walletBalance'], margin * 3);
  const crossEquity = wallet + pnl;
  return (
    <Frame label={`Price ${fmt(now, 2)}; equity ${fmt(equity, 2)} vs maintenance ${fmt(maint, 2)} USDT${hit ? '; liquidation (approximate)' : ''}`}>
      <FictionalBadge text="CONCEPTUAL — NOT AN EXCHANGE MODEL" />
      <PriceAxis scale={sc} box={box} />
      <HLine y={sc.y(entry)} x1={box.x} x2={box.x + box.w} label={`Entry ${fmt(entry, 2)}`} side="left" />
      {Number.isFinite(liqP) ? <HLine y={sc.y(liqP)} x1={box.x} x2={box.x + box.w} label={`≈ Liquidation ${fmt(liqP, 2)}`} cls="fe-svg-level-stop" side="left" /> : null}
      <path d={pathD(path, sc, vis)} className="fe-svg-price" />
      {isoCross ? (
        <g>
          <Bar x={416} y={70} w={200} frac={clamp(equity / margin, 0, 1)} label="ISOLATED: this position’s margin" value={`${fmt(Math.max(0, equity), 2)}`} tone={hit ? 'down' : 'neutral'} />
          <Bar x={416} y={150} w={200} frac={clamp(crossEquity / wallet, 0, 1)} label="CROSS: whole wallet at risk" value={`${fmt(Math.max(0, crossEquity), 2)}`} tone={crossEquity < wallet * 0.5 ? 'down' : 'warn'} />
          <text x={416} y={210} className="fe-svg-small">Isolated limits the loss to its margin.</text>
          <text x={416} y={228} className="fe-svg-small">Cross can use your other balance.</text>
        </g>
      ) : (
        <g>
          <Bar x={416} y={80} w={200} frac={clamp(equity / margin, 0, 1)} label="Margin buffer (equity)" value={`${fmt(Math.max(0, equity), 2)} USDT`} tone={hit ? 'down' : equity < margin * 0.5 ? 'warn' : 'up'} />
          <Bar x={416} y={150} w={200} frac={clamp(maint / margin, 0, 1)} label="Maintenance requirement" value={`${fmt(maint, 2)} USDT`} tone="warn" />
          <text x={416} y={210} className={`fe-svg-label ${hit ? 'fe-svg-text-down' : ''}`}>{hit ? 'FORCED CLOSE (liquidation)' : `PnL ${signed(pnl, 2)} USDT`}</text>
          <text x={416} y={232} className="fe-svg-small">{variant === 'margin-used-up' ? 'Liquidation comes BEFORE margin hits zero' : 'Approximate; real rules differ'}</text>
        </g>
      )}
    </Frame>
  );
}

// ------------------------------------------------------------------ funding-clock

export function FundingClockScene({ params, p }: SceneProps) {
  const side = sideOf(params['side']);
  const notional = numOr(params['notional'], 1000);
  const rates = nums(params['rates']);
  const hours = numOr(params['intervalHours'], 8);
  const n = rates.length;
  const elapsed = p * n;
  const done = Math.floor(elapsed + 1e-9);
  let total = 0;
  const rows = rates.slice(0, done).map((r, k) => {
    const f = fundingPayment({ side, notional, rate: r });
    const pay = f.ok ? f.value.paymentPerInterval : 0;
    total = clean(total + pay);
    return { k, r, pay };
  });
  const angle = (elapsed % 1) * 360;
  return (
    <Frame label={`${side} ${fmt(notional, 2)} USDT notional; after ${done} funding intervals the position has ${total >= 0 ? 'paid' : 'received'} ${fmt(Math.abs(total), 4)} USDT`}>
      <FictionalBadge text="ILLUSTRATIVE RATES" />
      <circle cx={130} cy={170} r={90} className="fe-svg-clock" />
      <line x1={130} y1={170} x2={130 + 80 * Math.sin((angle * Math.PI) / 180)} y2={170 - 80 * Math.cos((angle * Math.PI) / 180)} className="fe-svg-hand" />
      <text x={130} y={290} textAnchor="middle" className="fe-svg-small">every {hours} h (varies by exchange)</text>
      <text x={260} y={50} className="fe-svg-title">{side.toUpperCase()} · notional {fmt(notional, 2)} USDT</text>
      {rows.map(({ k, r, pay }) => (
        <text key={k} x={260} y={86 + k * 26} className={`fe-svg-label ${pay > 0 ? 'fe-svg-text-down' : 'fe-svg-text-up'}`}>
          Interval {k + 1}: rate {r >= 0 ? '+' : '−'}{(Math.abs(r) * 100).toFixed(3)}% → {pay > 0 ? 'you PAY' : 'you RECEIVE'} {fmt(Math.abs(pay), 4)}
        </text>
      ))}
      <text x={260} y={86 + Math.max(rows.length, 1) * 26 + 16} className="fe-svg-card-title">Total so far: {total > 0 ? 'paid' : 'received'} {fmt(Math.abs(total), 4)} USDT</text>
      <text x={260} y={330} className="fe-svg-small">Positive rate: longs pay shorts. Negative: shorts pay longs.</text>
    </Frame>
  );
}

