/** Scene renderers: candles, timeframes, structure, levels, volume, ranges, branching futures. Pure functions of p. */
import { ohlcAggregate, ohlcAnatomy, rangeLookback } from '../../simulation/math';
import { Candle, clamp, FictionalBadge, fmt, Frame, HLine, lerp, makeScale, pathD, phase, PLOT, PriceAxis, priceAt, W, type CandleShape } from '../chart';
import { branchingOf, candlesOf, isObj, labelsOf, nums, numOr, objs, strOr, ticksOf } from '../params';
import type { SceneProps } from '../types';

const dirWord = (c: CandleShape) => (c.c > c.o ? 'BULLISH (close above open)' : c.c < c.o ? 'BEARISH (close below open)' : 'DOJI (close equals open)');

// ------------------------------------------------------------------ candle-formation

export function CandleFormationScene({ params, p, fixture }: SceneProps) {
  const variant = strOr(params['variant'], 'forming');
  if (variant === 'measure') {
    const c = { o: numOr(params['o'], 0), h: numOr(params['h'], 0), l: numOr(params['l'], 0), c: numOr(params['c'], 0) };
    const a = ohlcAnatomy({ ...c, dojiThreshold: { bodyToRangeMax: 0 } });
    const sc = makeScale([c.h, c.l], 2);
    const x = 250;
    const parts = a.ok ? [
      { y1: c.h, y2: Math.max(c.o, c.c), label: `Upper wick ${fmt(a.value.upperWick, 2)}`, at: 0.15 },
      { y1: Math.max(c.o, c.c), y2: Math.min(c.o, c.c), label: `Body ${fmt(a.value.body, 2)}`, at: 0.35 },
      { y1: Math.min(c.o, c.c), y2: c.l, label: `Lower wick ${fmt(a.value.lowerWick, 2)}`, at: 0.55 },
    ] : [];
    return (
      <Frame label={`Candle O ${c.o} H ${c.h} L ${c.l} C ${c.c}. ${a.ok ? `Body ${a.value.body}, upper wick ${a.value.upperWick}, lower wick ${a.value.lowerWick}, range ${a.value.range}` : ''}`}>
        <FictionalBadge />
        <PriceAxis scale={sc} />
        <Candle c={c} x={x} width={48} scale={sc} />
        {parts.map((pt, k) => (
          <g key={k} opacity={phase(p, pt.at, pt.at + 0.15)}>
            <line x1={300} x2={300} y1={sc.y(pt.y1)} y2={sc.y(pt.y2)} className="fel-svg-bracket" />
            <text x={312} y={(sc.y(pt.y1) + sc.y(pt.y2)) / 2 + 4} className="fel-svg-label">{pt.label}</text>
          </g>
        ))}
        <g opacity={phase(p, 0.75, 0.9)}>
          <line x1={180} x2={180} y1={sc.y(c.h)} y2={sc.y(c.l)} className="fel-svg-bracket" />
          <text x={170} y={(sc.y(c.h) + sc.y(c.l)) / 2} textAnchor="end" className="fel-svg-label">Range {a.ok ? fmt(a.value.range, 2) : ''}</text>
          <text x={170} y={(sc.y(c.h) + sc.y(c.l)) / 2 + 18} textAnchor="end" className="fel-svg-small">high − low</text>
        </g>
        <text x={W / 2 + 120} y={60} className="fel-svg-small">body + upper wick + lower wick = range</text>
      </Frame>
    );
  }
  if (variant === 'compare' || variant === 'groups') {
    const cs = objs(params['candles']).map((c) => ({ o: numOr(c['o'], 0), h: numOr(c['h'], 0), l: numOr(c['l'], 0), c: numOr(c['c'], 0), label: strOr(c['label'], '') }));
    const sc = makeScale(cs.flatMap((c) => [c.h, c.l]), cs.length);
    const shown = Math.ceil(clamp(p * 1.1, 0, 1) * cs.length);
    if (variant === 'groups') {
      const cols = ['bullish', 'bearish', 'doji'] as const;
      const place = cs.map((c) => (c.c > c.o ? 0 : c.c < c.o ? 1 : 2));
      return (
        <Frame label={`Sorting ${cs.length} fictional candles into bullish, bearish and doji`}>
          <FictionalBadge />
          {cols.map((name, k) => <text key={name} x={110 + k * 210} y={40} textAnchor="middle" className="fel-svg-title">{name.toUpperCase()}</text>)}
          {cs.map((c, k) => {
            if (k >= shown) return null;
            const col = place[k] as number;
            const sameBefore = place.slice(0, k).filter((x) => x === col).length;
            const cx = 70 + col * 210 + sameBefore * 40;
            const s2 = makeScale([c.h, c.l], 2, { x: 0, y: 70, w: 10, h: 220 });
            return <Candle key={k} c={c} x={cx} width={22} scale={s2} label={c.label} />;
          })}
        </Frame>
      );
    }
    const latest = cs[Math.max(0, shown - 1)];
    return (
      <Frame label={`Fictional candles compared. Latest: ${latest ? `${latest.label} ${dirWord(latest)}` : ''}`}>
        <FictionalBadge />
        <PriceAxis scale={sc} />
        {cs.map((c, k) => (k < shown ? <Candle key={k} c={c} x={PLOT.x + ((k + 0.5) * PLOT.w) / cs.length} width={Math.min(44, PLOT.w / cs.length / 2)} scale={sc} label={c.label} highlight={k === shown - 1} /> : null))}
        {latest ? <text x={PLOT.x} y={20} className="fel-svg-label">{latest.label}: {dirWord(latest)}</text> : null}
      </Frame>
    );
  }
  // forming: a 1-minute candle built from fictional ticks
  const ticks = ticksOf(fixture);
  const ps = ticks.map((t) => t.p);
  if (ps.length < 2) return <Frame label="No fixture data"><text x={20} y={40} className="fel-svg-label">Fixture data missing</text></Frame>;
  const rg = nums(params['range']);
  const q = lerp(rg[0] ?? 0, rg[1] ?? 1, p);
  const vis = 1 + q * (ps.length - 1);
  const seen = ps.slice(0, Math.max(1, Math.floor(vis)));
  const last = priceAt(ps, vis);
  const o = ps[0] as number;
  const h = Math.max(...seen, last);
  const l = Math.min(...seen, last);
  const done = q >= 1;
  const box = { x: 56, y: 28, w: 330, h: 290 };
  const sc = makeScale(ps, ps.length, box);
  const cx = 500;
  const secs = Math.round((((ticks[Math.min(ticks.length - 1, Math.floor(vis) - 1)]?.t ?? 0) as number) / 1000));
  return (
    <Frame label={`Forming 1-minute candle: open ${fmt(o, 2)}, high so far ${fmt(h, 2)}, low so far ${fmt(l, 2)}, ${done ? 'close' : 'last'} ${fmt(last, 2)}`}>
      <FictionalBadge />
      <PriceAxis scale={sc} box={box} />
      <path d={pathD(ps, sc, vis)} className="fel-svg-price" />
      <text x={box.x} y={20} className="fel-svg-small">Last traded price, second by second (fictional) · {done ? '60' : secs}s</text>
      <HLine y={sc.y(o)} x1={box.x} x2={cx + 60} label={`Open ${fmt(o, 2)}`} cls="fel-svg-level-faint" side="left" />
      <Candle c={{ o, h, l, c: last }} x={cx} width={44} scale={sc} />
      {sc.y(o) - sc.y(h) > 12 ? <text x={cx + 30} y={sc.y(h) + 4} className="fel-svg-small">High {fmt(h, 2)}</text> : null}
      {sc.y(l) - sc.y(o) > 12 ? <text x={cx + 30} y={sc.y(l) + 4} className="fel-svg-small">Low {fmt(l, 2)}</text> : null}
      <text x={cx - 30} y={sc.y(last) + 4} textAnchor="end" className="fel-svg-label">{done ? 'Close' : 'Last'} {fmt(last, 2)}</text>
      {done ? <text x={cx} y={340} textAnchor="middle" className="fel-svg-label">{dirWord({ o, h, l, c: last })}</text> : <text x={cx} y={340} textAnchor="middle" className="fel-svg-small">Candle still forming…</text>}
    </Frame>
  );
}

// ------------------------------------------------------------------ timeframe-aggregation

export function TimeframeAggregationScene({ params, p, fixture }: SceneProps) {
  const raw = candlesOf(fixture);
  const g = Math.max(1, Math.round(numOr(params['groupSize'], 5)));
  const agg = ohlcAggregate({ candles: raw, groupSize: g });
  const big = agg.ok ? agg.value.candles : [];
  const sc = makeScale(raw.flatMap((c) => [c.h, c.l]), raw.length);
  const slot = PLOT.w / raw.length;
  const tBrackets = phase(p, 0.15, 0.45);
  const tMerge = phase(p, 0.5, 0.85);
  const tf = strOr(params['targetLabel'], `${g}m`);
  return (
    <Frame label={`${raw.length} one-minute fictional candles grouped by ${g} into ${big.length} ${tf} candles: ${big.map((b) => `O ${b.o} H ${b.h} L ${b.l} C ${b.c}`).join('; ')}`}>
      <FictionalBadge />
      <PriceAxis scale={sc} />
      {raw.map((c, k) => <g key={k} opacity={1 - tMerge * 0.75}><Candle c={c} x={PLOT.x + (k + 0.5) * slot} width={Math.max(4, slot * 0.55)} scale={sc} /></g>)}
      {big.map((b, k) => {
        const x0 = PLOT.x + k * g * slot;
        const w = Math.min(g, raw.length - k * g) * slot;
        return (
          <g key={`b${k}`}>
            <rect x={x0 + 2} y={PLOT.y} width={w - 4} height={PLOT.h} rx={6} className="fel-svg-group" opacity={tBrackets} />
            <g opacity={tMerge}><Candle c={b} x={x0 + w / 2} width={Math.min(60, w * 0.5)} scale={sc} highlight /></g>
            <text x={x0 + w / 2} y={PLOT.y + PLOT.h + 20} textAnchor="middle" className="fel-svg-small" opacity={tMerge}>{tf} #{k + 1}{b.partial ? ' (unfinished)' : ''}</text>
          </g>
        );
      })}
      <text x={PLOT.x} y={18} className="fel-svg-small">{tMerge > 0.5 ? `Open = first open · High = highest high · Low = lowest low · Close = last close` : `${raw.length} × 1m candles, same raw data`}</text>
    </Frame>
  );
}

// ------------------------------------------------------------------ market-structure

export function swingLabels(points: number[]): string[] {
  // points alternate between swing lows and swing highs; compare each with the previous swing of the same kind
  return points.map((v, i) => {
    if (i < 2) return i === 0 ? 'start' : '';
    const prev = points[i - 2] as number;
    const isHigh = v > (points[i - 1] as number);
    if (isHigh) return v > prev ? 'HH' : v < prev ? 'LH' : 'EH';
    return v > prev ? 'HL' : v < prev ? 'LL' : 'EL';
  });
}

export function MarketStructureScene({ params, p }: SceneProps) {
  const pts = nums(params['points']);
  const labels = swingLabels(pts);
  const sc = makeScale(pts, pts.length);
  const vis = 1 + p * (pts.length - 1);
  const shown = Math.floor(vis);
  const recent = labels.slice(2, shown).slice(-2);
  const verdict = recent.length < 2 ? 'Not enough swings yet' : recent.every((x) => x === 'HH' || x === 'HL') ? 'Higher highs + higher lows: UPTREND structure' : recent.every((x) => x === 'LH' || x === 'LL') ? 'Lower highs + lower lows: DOWNTREND structure' : 'Mixed swings: SIDEWAYS / unclear';
  return (
    <Frame label={`Fictional swings labelled ${labels.slice(2, shown).join(', ')}. ${verdict}`}>
      <FictionalBadge />
      <PriceAxis scale={sc} />
      <path d={pathD(pts, sc, vis)} className="fel-svg-price" />
      {pts.slice(0, shown).map((v, i) => (labels[i] ? (
        <g key={i}>
          <circle cx={sc.x(i)} cy={sc.y(v)} r={5} className="fel-svg-dot-mark" />
          <text x={sc.x(i)} y={sc.y(v) + (i > 0 && v > (pts[i - 1] as number) ? -12 : 20)} textAnchor="middle" className="fel-svg-label">{labels[i]}</text>
        </g>
      ) : null))}
      <text x={PLOT.x} y={20} className="fel-svg-label">{verdict}</text>
    </Frame>
  );
}

// ------------------------------------------------------------------ support-resistance-zone

export function SupportResistanceScene({ params, p }: SceneProps) {
  const pts = nums(params['points']);
  const zone = isObj(params['zone']) ? params['zone'] : {};
  const lo = numOr(zone['low'], 0);
  const hi = numOr(zone['high'], 0);
  const kind = strOr(zone['kind'], 'support');
  const sc = makeScale([...pts, lo, hi], pts.length);
  const vis = 1 + p * (pts.length - 1);
  let touches = 0;
  let inside = false;
  for (let i = 0; i < Math.floor(vis); i++) {
    const v = pts[i] as number;
    const now = v >= lo && v <= hi;
    if (now && !inside) touches++;
    inside = now;
  }
  return (
    <Frame label={`Fictional ${kind} zone ${fmt(lo, 2)} to ${fmt(hi, 2)}, visited ${touches} times so far`}>
      <FictionalBadge />
      <PriceAxis scale={sc} />
      <rect x={PLOT.x} y={sc.y(hi)} width={PLOT.w} height={Math.max(4, sc.y(lo) - sc.y(hi))} className={kind === 'support' ? 'fel-svg-zone-support' : 'fel-svg-zone-resistance'} />
      <text x={PLOT.x + 6} y={sc.y(hi) - 6} className="fel-svg-label">{kind === 'support' ? 'Support ZONE' : 'Resistance ZONE'} {fmt(lo, 2)}–{fmt(hi, 2)}</text>
      <path d={pathD(pts, sc, vis)} className="fel-svg-price" />
      <text x={PLOT.x + PLOT.w} y={20} textAnchor="end" className="fel-svg-label">Visits: {touches}</text>
      <text x={PLOT.x} y={20} className="fel-svg-small">A zone is an area, not one exact price.</text>
    </Frame>
  );
}

// ------------------------------------------------------------------ breakout-fakeout + branching-paths

export function BranchingScene({ params, p, fixture }: SceneProps) {
  const data = branchingOf(fixture, params);
  const only = typeof params['branchId'] === 'string' ? params['branchId'] : undefined;
  const branches = only ? data.branches.filter((b) => b.id === only) : data.branches;
  const past = data.past;
  const total = past.length + Math.max(0, ...branches.map((b) => b.points.length));
  const sc = makeScale([...past, ...branches.flatMap((b) => b.points), ...(data.level ? [data.level.price] : [])], total);
  const tPast = phase(p, 0, 0.35);
  const tFut = phase(p, 0.35, 1);
  const pastEnd = past.length - 1;
  const xs = (i: number) => sc.x(i);
  const cls = ['fel-svg-branch-a', 'fel-svg-branch-b', 'fel-svg-branch-c', 'fel-svg-branch-d'];
  return (
    <Frame label={`Same fictional past, ${branches.length} possible futures: ${branches.map((b) => b.label).join('; ')}`}>
      <FictionalBadge text="EDUCATIONAL SIMULATION" />
      <PriceAxis scale={sc} />
      {data.level ? <HLine y={sc.y(data.level.price)} label={data.level.label} /> : null}
      <path d={pathD(past, sc, 1 + tPast * (past.length - 1))} className="fel-svg-price" />
      <line x1={xs(pastEnd)} x2={xs(pastEnd)} y1={PLOT.y} y2={PLOT.y + PLOT.h} className="fel-svg-now" opacity={tPast >= 1 ? 1 : 0} />
      <text x={xs(pastEnd) + 4} y={PLOT.y + 12} className="fel-svg-small" opacity={tPast >= 1 ? 1 : 0}>NOW — the future is unknown</text>
      {tPast >= 1 ? branches.map((b, k) => {
        const pts = [past[pastEnd] as number, ...b.points];
        const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${xs(pastEnd + i).toFixed(1)},${sc.y(v).toFixed(1)}`);
        const n = 1 + tFut * (pts.length - 1);
        const end = pts[Math.min(pts.length - 1, Math.floor(n) - 1)] as number;
        return (
          <g key={b.id}>
            <path d={d.slice(0, Math.max(1, Math.floor(n))).join(' ')} className={cls[k % cls.length]} />
            {tFut >= 1 ? <text x={xs(pastEnd + pts.length - 1) - 4} y={sc.y(end) - 8} textAnchor="end" className="fel-svg-label">{b.label}</text> : null}
          </g>
        );
      }) : null}
    </Frame>
  );
}

// ------------------------------------------------------------------ volume-bars

export function VolumeBarsScene({ params, p, fixture }: SceneProps) {
  const cs = candlesOf(fixture);
  const labels = labelsOf(fixture);
  const highlight = nums(params['highlight']);
  const top = { x: 56, y: 24, w: 552, h: 200 };
  const bot = { x: 56, y: 250, w: 552, h: 80 };
  const sc = makeScale(cs.flatMap((c) => [c.h, c.l]), cs.length, top);
  const vmax = Math.max(1, ...cs.map((c) => c.v ?? 0));
  const avg = cs.reduce((n, c) => n + (c.v ?? 0), 0) / Math.max(1, cs.length);
  const slot = top.w / Math.max(1, cs.length);
  const shown = Math.ceil(clamp(p * 1.05, 0, 1) * cs.length);
  const lastShown = cs[shown - 1];
  return (
    <Frame label={`Fictional candles with volume; average volume ${fmt(avg, 0)}${lastShown ? `; latest candle volume ${fmt(lastShown.v ?? 0, 0)}` : ''}`}>
      <FictionalBadge />
      <PriceAxis scale={sc} box={top} ticks={3} />
      {cs.map((c, k) => (k < shown ? (
        <g key={k}>
          <Candle c={c} x={top.x + (k + 0.5) * slot} width={Math.max(4, slot * 0.55)} scale={sc} highlight={highlight.includes(k)} />
          <rect x={bot.x + k * slot + slot * 0.2} y={bot.y + bot.h - ((c.v ?? 0) / vmax) * bot.h} width={slot * 0.6} height={((c.v ?? 0) / vmax) * bot.h} className={highlight.includes(k) ? 'fel-svg-vol-hl' : c.c >= c.o ? 'fel-svg-vol-up' : 'fel-svg-vol-down'} />
          {labels[k] ? <text x={top.x + (k + 0.5) * slot} y={bot.y + bot.h + 14} textAnchor="middle" className="fel-svg-small">{labels[k]}</text> : null}
        </g>
      ) : null))}
      <line x1={bot.x} x2={bot.x + bot.w} y1={bot.y + bot.h - (avg / vmax) * bot.h} y2={bot.y + bot.h - (avg / vmax) * bot.h} className="fel-svg-level-faint" />
      <text x={bot.x - 6} y={bot.y + 10} textAnchor="end" className="fel-svg-small">Vol</text>
      <text x={bot.x + bot.w} y={bot.y - 4} textAnchor="end" className="fel-svg-small">dashed line = average volume</text>
    </Frame>
  );
}

// ------------------------------------------------------------------ range-overlay

export function RangeOverlayScene({ params, p, fixture }: SceneProps) {
  const cs = candlesOf(fixture);
  const win = Math.max(1, Math.round(numOr(params['window'], 10)));
  const slide = params['slide'] !== false;
  const minEnd = Math.min(cs.length - 1, win - 1);
  const end = slide ? Math.round(lerp(minEnd, cs.length - 1, p)) : cs.length - 1;
  const r = rangeLookback({ candles: cs, window: Math.min(win, end + 1), endIndex: end });
  const sc = makeScale(cs.flatMap((c) => [c.h, c.l]), cs.length);
  const slot = PLOT.w / Math.max(1, cs.length);
  return (
    <Frame label={r.ok ? `Lookback of ${win} candles ending at candle ${end + 1}: high ${fmt(r.value.max, 2)}, low ${fmt(r.value.min, 2)}, range ${fmt(r.value.rangePercent, 2)}%` : 'Range not available'}>
      <FictionalBadge />
      <PriceAxis scale={sc} />
      {r.ok ? <rect x={PLOT.x + r.value.startIndex * slot} y={PLOT.y} width={(r.value.endIndex - r.value.startIndex + 1) * slot} height={PLOT.h} className="fel-svg-group" /> : null}
      {cs.map((c, k) => <Candle key={k} c={c} x={PLOT.x + (k + 0.5) * slot} width={Math.max(3, slot * 0.55)} scale={sc} />)}
      {r.ok ? (
        <g>
          <HLine y={sc.y(r.value.max)} label={`Previous high ${fmt(r.value.max, 2)}`} cls="fel-svg-level-target" side="left" />
          <HLine y={sc.y(r.value.min)} label={`Previous low ${fmt(r.value.min, 2)}`} cls="fel-svg-level-stop" side="left" />
          <text x={PLOT.x + PLOT.w} y={20} textAnchor="end" className="fel-svg-label">Range {fmt(r.value.range, 2)} ({fmt(r.value.rangePercent, 2)}%) over last {win}</text>
        </g>
      ) : null}
    </Frame>
  );
}

