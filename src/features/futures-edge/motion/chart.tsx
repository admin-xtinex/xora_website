/**
 * Small SVG helpers shared by scene renderers and exercise widgets. Local SVG only: no chart library and no
 * coupling to any trading chart code.
 */
import type { ReactNode } from 'react';

export const W = 640;
export const H = 360;

export interface Box { x: number; y: number; w: number; h: number }
export const PLOT: Box = { x: 56, y: 28, w: 552, h: 280 };

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progress of a sub-phase [from, to] inside scene progress p. */
export const phase = (p: number, from: number, to: number) => clamp((p - from) / (to - from), 0, 1);

export interface Scale { y: (price: number) => number; x: (i: number) => number; min: number; max: number }

export function makeScale(values: number[], count: number, box: Box = PLOT, padFrac = 0.08): Scale {
  const finite = values.filter((v) => Number.isFinite(v));
  let min = Math.min(...finite);
  let max = Math.max(...finite);
  if (!Number.isFinite(min) || !Number.isFinite(max)) { min = 0; max = 1; }
  if (max === min) { max += 1; min -= 1; }
  const pad = (max - min) * padFrac;
  min -= pad; max += pad;
  const n = Math.max(1, count - 1);
  return {
    min, max,
    y: (v) => box.y + box.h - ((v - min) / (max - min)) * box.h,
    x: (i) => box.x + (i / n) * box.w,
  };
}

/** Compact, locale-stable number formatting for fictional prices. */
export function fmt(n: number, decimals?: number): string {
  if (!Number.isFinite(n)) return '—';
  const d = decimals ?? (Math.abs(n) >= 1000 ? 0 : Math.abs(n) >= 10 ? 2 : Math.abs(n) >= 1 ? 3 : 5);
  return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}
export function signed(n: number, decimals?: number): string {
  return `${n > 0 ? '+' : n < 0 ? '−' : ''}${fmt(Math.abs(n), decimals)}`;
}

export function Frame({ children, label, title }: { children: ReactNode; label: string; title?: string }) {
  return (
    <svg className="fel-scene-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function FictionalBadge({ x = W - 8, y = 16, text = 'FICTIONAL DATA' }: { x?: number; y?: number; text?: string }) {
  return <text x={x} y={y} textAnchor="end" className="fel-svg-badge">{text}</text>;
}

export function PriceAxis({ scale, ticks = 4, box = PLOT, decimals }: { scale: Scale; ticks?: number; box?: Box; decimals?: number }) {
  const vals = Array.from({ length: ticks + 1 }, (_, k) => scale.min + ((scale.max - scale.min) * k) / ticks);
  return (
    <g aria-hidden>
      {vals.map((v, k) => (
        <g key={k}>
          <line x1={box.x} x2={box.x + box.w} y1={scale.y(v)} y2={scale.y(v)} className="fel-svg-grid" />
          <text x={box.x - 6} y={scale.y(v) + 4} textAnchor="end" className="fel-svg-axis">{fmt(v, decimals)}</text>
        </g>
      ))}
    </g>
  );
}

/** Polyline of the first `visible` (fractional) points. */
export function pathD(points: number[], scale: Scale, visible = points.length): string {
  const n = clamp(visible, 0, points.length);
  const whole = Math.floor(n);
  const parts: string[] = [];
  for (let i = 0; i < whole && i < points.length; i++) parts.push(`${i === 0 ? 'M' : 'L'}${scale.x(i).toFixed(1)},${scale.y(points[i] as number).toFixed(1)}`);
  const frac = n - whole;
  if (frac > 0 && whole < points.length && whole > 0) {
    const a = points[whole - 1] as number;
    const b = points[whole] as number;
    parts.push(`L${lerp(scale.x(whole - 1), scale.x(whole), frac).toFixed(1)},${scale.y(lerp(a, b, frac)).toFixed(1)}`);
  }
  return parts.join(' ');
}

/** Price at fractional index. */
export function priceAt(points: number[], visible: number): number {
  const n = clamp(visible, 1, points.length);
  const whole = Math.floor(n);
  const frac = n - whole;
  const a = points[Math.max(0, whole - 1)] as number;
  const b = points[Math.min(points.length - 1, whole)] as number;
  return frac > 0 ? lerp(a, b, frac) : a;
}

export interface CandleShape { o: number; h: number; l: number; c: number }

export function Candle({ c, x, width, scale, label, highlight }: { c: CandleShape; x: number; width: number; scale: Scale; label?: string; highlight?: boolean }) {
  const up = c.c > c.o;
  const down = c.c < c.o;
  const cls = up ? 'fel-svg-up' : down ? 'fel-svg-down' : 'fel-svg-flat';
  const top = scale.y(Math.max(c.o, c.c));
  const bot = scale.y(Math.min(c.o, c.c));
  return (
    <g className={`${cls}${highlight ? ' fel-svg-hl' : ''}`}>
      <line x1={x} x2={x} y1={scale.y(c.h)} y2={scale.y(c.l)} className="fel-svg-wick" />
      <rect x={x - width / 2} y={top} width={width} height={Math.max(2, bot - top)} rx={2} className={up ? 'fel-svg-body-up' : down ? 'fel-svg-body-down' : 'fel-svg-body-flat'} />
      {label ? <text x={x} y={scale.y(c.l) + 16} textAnchor="middle" className="fel-svg-small">{label}</text> : null}
    </g>
  );
}

export function HLine({ y, x1 = PLOT.x, x2 = PLOT.x + PLOT.w, label, cls = 'fel-svg-level', side = 'right' }: { y: number; x1?: number; x2?: number; label?: string; cls?: string; side?: 'left' | 'right' }) {
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} className={cls} />
      {label ? <text x={side === 'right' ? x2 - 4 : x1 + 4} y={y - 5} textAnchor={side === 'right' ? 'end' : 'start'} className="fel-svg-label">{label}</text> : null}
    </g>
  );
}

/** A rounded info card drawn inside the SVG. */
export function Card({ x, y, w, h, title, lines, tone }: { x: number; y: number; w: number; h: number; title: string; lines: string[]; tone?: 'up' | 'down' | 'warn' | 'neutral' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className={`fel-svg-card fel-svg-card-${tone ?? 'neutral'}`} />
      <text x={x + 12} y={y + 22} className="fel-svg-card-title">{title}</text>
      {lines.map((l, k) => (
        <text key={k} x={x + 12} y={y + 44 + k * 20} className="fel-svg-card-line">{l}</text>
      ))}
    </g>
  );
}

/** Horizontal bar with label and value (used for meters). */
export function Bar({ x, y, w, h = 18, frac, label, value, tone }: { x: number; y: number; w: number; h?: number; frac: number; label: string; value: string; tone: 'up' | 'down' | 'warn' | 'neutral' }) {
  const f = clamp(frac, 0, 1);
  return (
    <g>
      <text x={x} y={y - 6} className="fel-svg-label">{label}</text>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} className="fel-svg-track" />
      <rect x={x} y={y} width={Math.max(0, w * f)} height={h} rx={h / 2} className={`fel-svg-fill-${tone}`} />
      <text x={x + w} y={y - 6} textAnchor="end" className="fel-svg-label">{value}</text>
    </g>
  );
}

/** Centred bar for signed values (profit right, loss left). */
export function SignedBar({ x, y, w, h = 18, value, maxAbs, label, valueText }: { x: number; y: number; w: number; h?: number; value: number; maxAbs: number; label: string; valueText: string }) {
  const mid = x + w / 2;
  const f = maxAbs > 0 ? clamp(Math.abs(value) / maxAbs, 0, 1) : 0;
  const len = (w / 2) * f;
  return (
    <g>
      <text x={x} y={y - 6} className="fel-svg-label">{label}</text>
      <text x={x + w} y={y - 6} textAnchor="end" className={`fel-svg-label ${value > 0 ? 'fel-svg-text-up' : value < 0 ? 'fel-svg-text-down' : ''}`}>{valueText}</text>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} className="fel-svg-track" />
      <rect x={value >= 0 ? mid : mid - len} y={y} width={len} height={h} rx={4} className={value >= 0 ? 'fel-svg-fill-up' : 'fel-svg-fill-down'} />
      <line x1={mid} x2={mid} y1={y - 3} y2={y + h + 3} className="fel-svg-mid" />
    </g>
  );
}
