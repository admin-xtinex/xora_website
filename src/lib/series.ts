// Deterministic pseudo-market data for decorative charts (no live data).
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function walk(n: number, seed: number, drift = 0.35, vol = 1) {
  const r = rng(seed);
  const out: number[] = [];
  let v = 0;
  for (let i = 0; i < n; i++) {
    v += (r() - 0.5 + drift * 0.1) * vol * 2;
    out.push(v);
  }
  return out;
}

// Catmull-Rom → cubic Bézier for a smooth flowing line.
export function toSmoothPath(values: number[], w: number, h: number, pad = 2) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => [i * step, pad + (1 - (v - min) / span) * (h - pad * 2)] as const);
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

export type Candle = { o: number; h: number; l: number; c: number };

export function candles(n: number, seed: number, drift = 0.2): Candle[] {
  const r = rng(seed);
  const out: Candle[] = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    const o = price;
    const c = o + (r() - 0.5 + drift * 0.15) * 4;
    const h = Math.max(o, c) + r() * 1.6;
    const l = Math.min(o, c) - r() * 1.6;
    out.push({ o, h, l, c });
    price = c;
  }
  return out;
}
