/** Static fictional chart used inside exercises: candles or a price line, optional levels, zone and window. */
import { Candle, FictionalBadge, Frame, HLine, makeScale, pathD, PLOT, PriceAxis } from '../motion/chart';
import type { SeriesCandle } from '../motion/params';

export interface MiniChartProps {
  candles?: SeriesCandle[];
  points?: number[];
  labels?: string[];
  highlight?: number[];
  lines?: Array<{ price: number; label: string; cls?: string }>;
  zone?: { low: number; high: number; label?: string } | undefined;
  window?: { start: number; end: number } | undefined;
  label: string;
  showValues?: boolean;
}

export function MiniChart({ candles = [], points = [], labels = [], highlight = [], lines = [], zone, window: win, label, showValues }: MiniChartProps) {
  const vals = [...candles.flatMap((c) => [c.h, c.l]), ...points, ...lines.map((l) => l.price), ...(zone ? [zone.low, zone.high] : [])];
  const count = Math.max(candles.length, points.length, 2);
  const sc = makeScale(vals, count);
  const slot = PLOT.w / Math.max(1, candles.length);
  return (
    <Frame label={label}>
      <FictionalBadge />
      <PriceAxis scale={sc} />
      {zone ? (
        <g>
          <rect x={PLOT.x} y={sc.y(zone.high)} width={PLOT.w} height={Math.max(3, sc.y(zone.low) - sc.y(zone.high))} className="fel-svg-zone-support" />
          {zone.label ? <text x={PLOT.x + 6} y={sc.y(zone.high) - 6} className="fel-svg-label">{zone.label}</text> : null}
        </g>
      ) : null}
      {win && candles.length ? <rect x={PLOT.x + win.start * slot} y={PLOT.y} width={(win.end - win.start + 1) * slot} height={PLOT.h} className="fel-svg-group" /> : null}
      {candles.map((c, k) => (
        <g key={k}>
          <Candle c={c} x={PLOT.x + (k + 0.5) * slot} width={Math.max(4, Math.min(40, slot * 0.55))} scale={sc} label={labels[k]} highlight={highlight.includes(k)} />
          {showValues ? <text x={PLOT.x + (k + 0.5) * slot} y={sc.y(c.h) - 8} textAnchor="middle" className="fel-svg-small">{c.c}</text> : null}
        </g>
      ))}
      {points.length > 1 ? <path d={pathD(points, sc)} className="fel-svg-price" /> : null}
      {lines.map((l, k) => <HLine key={k} y={sc.y(l.price)} label={l.label} cls={l.cls ?? 'fel-svg-level'} side="left" />)}
    </Frame>
  );
}
