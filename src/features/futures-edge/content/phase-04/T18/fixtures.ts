import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

type Row = [o: number, h: number, l: number, c: number, v: number];

/** Build a 1-minute series: t is a millisecond offset, one minute apart. */
const series = (rows: Row[]) => rows.map(([o, h, l, c, v], i) => ({ t: i * 60_000, o, h, l, c, v }));

/** Quiet sample: tiny candles, low volume (average 105 DEMO). Range over 10 candles 99.90–100.16. */
const QUIET: Row[] = [
  [100.0, 100.12, 99.94, 100.06, 110],
  [100.06, 100.1, 99.98, 100.02, 95],
  [100.02, 100.08, 99.92, 99.96, 120],
  [99.96, 100.04, 99.9, 100.0, 100],
  [100.0, 100.14, 99.98, 100.1, 130],
  [100.1, 100.16, 100.02, 100.04, 90],
  [100.04, 100.08, 99.95, 99.98, 105],
  [99.98, 100.06, 99.93, 100.03, 115],
  [100.03, 100.11, 100.0, 100.08, 100],
  [100.08, 100.13, 100.01, 100.05, 85],
];

/** Volatile sample: large candles, high volume (average 1,050 DEMO). Range over 10 candles 98.60–103.00. */
const VOLATILE: Row[] = [
  [100.0, 101.6, 99.4, 101.2, 820],
  [101.2, 102.8, 100.9, 102.4, 1100],
  [102.4, 102.7, 100.2, 100.6, 1350],
  [100.6, 101.1, 98.9, 99.3, 1240],
  [99.3, 100.8, 98.6, 100.5, 980],
  [100.5, 102.2, 100.1, 101.8, 900],
  [101.8, 102.0, 99.7, 100.1, 1060],
  [100.1, 101.4, 99.5, 101.0, 870],
  [101.0, 103.0, 100.8, 102.6, 1200],
  [102.6, 102.9, 100.9, 101.3, 980],
];

/** One volume spike (candle E, 1,500 DEMO vs average 309) that closes only 0.05 above its open. */
const SPIKE: Row[] = [
  [100.0, 100.2, 99.9, 100.1, 150],
  [100.1, 100.3, 100.0, 100.2, 160],
  [100.2, 100.35, 100.05, 100.15, 140],
  [100.15, 100.3, 100.0, 100.2, 170],
  [100.2, 101.4, 99.1, 100.25, 1500],
  [100.25, 100.5, 100.0, 100.3, 260],
  [100.3, 100.45, 100.1, 100.2, 200],
  [100.2, 100.4, 100.05, 100.35, 180],
  [100.35, 100.5, 100.15, 100.25, 170],
  [100.25, 100.4, 100.05, 100.3, 160],
];

/** Scenario A (15 minutes). Last 10: high 102.00, low 100.00 (2.00%). All 15: high 102.60, low 99.70 (2.91%). */
const RANGE_A: Row[] = [
  [101.8, 102.6, 101.5, 102.2, 300],
  [102.2, 102.4, 101.4, 101.6, 260],
  [101.6, 101.7, 100.6, 100.8, 280],
  [100.8, 101.0, 99.7, 100.2, 340],
  [100.2, 100.9, 100.1, 100.7, 220],
  [100.7, 101.4, 100.5, 101.2, 180],
  [101.2, 101.8, 101.0, 101.6, 200],
  [101.6, 102.0, 101.3, 101.5, 210],
  [101.5, 101.6, 100.8, 100.9, 190],
  [100.9, 101.1, 100.0, 100.3, 230],
  [100.3, 100.9, 100.1, 100.8, 170],
  [100.8, 101.5, 100.6, 101.4, 160],
  [101.4, 101.9, 101.2, 101.7, 180],
  [101.7, 101.95, 101.3, 101.4, 150],
  [101.4, 101.6, 100.9, 101.1, 140],
];

/** Scenario B (15 minutes, volatile). Last 10 and all 15: high 106.00, low 100.00 (6.00%). */
const RANGE_B: Row[] = [
  [103.0, 103.8, 102.4, 103.5, 500],
  [103.5, 104.2, 102.9, 103.1, 520],
  [103.1, 103.4, 101.6, 101.9, 610],
  [101.9, 102.6, 101.2, 102.4, 480],
  [102.4, 103.6, 102.1, 103.3, 560],
  [103.3, 104.9, 103.0, 104.6, 720],
  [104.6, 106.0, 104.2, 104.5, 950],
  [104.5, 104.8, 102.3, 102.6, 880],
  [102.6, 103.1, 100.0, 100.7, 1100],
  [100.7, 102.9, 100.4, 102.5, 900],
  [102.5, 104.4, 102.2, 103.8, 760],
  [103.8, 105.2, 103.1, 103.4, 820],
  [103.4, 103.9, 101.5, 101.9, 870],
  [101.9, 103.7, 101.6, 103.2, 690],
  [103.2, 104.1, 102.4, 102.8, 640],
];

const ohlc = (id: `FX-${string}`, rows: Row[], labels?: string[]): Fixture => ({
  id,
  kind: 'ohlc-series',
  fictional: true,
  label: LABEL,
  displaySymbol: 'DEMO/USDT',
  units: { price: 'USDT per DEMO', time: 'ms' },
  data: { interval: '1m', label: 'fictional', candles: series(rows), ...(labels ? { labels } : {}) },
  version: '1.0.0',
});

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const fixtures: Fixture[] = [
  ohlc('FX-T18-QUIET-01', QUIET),
  ohlc('FX-T18-VOLATILE-01', VOLATILE),
  ohlc('FX-T18-SPIKE-01', SPIKE, LETTERS),
  ohlc('FX-T18-RANGE-A-01', RANGE_A),
  ohlc('FX-T18-RANGE-B-01', RANGE_B),
];

/** Flat simulator inputs (h1,l1 … hN,lN) for the range.lookback formula examples. */
export const RANGE_A_HL: Record<string, number> = Object.fromEntries(RANGE_A.flatMap(([, h, l], i) => [[`h${i + 1}`, h], [`l${i + 1}`, l]]));
export const RANGE_B_HL: Record<string, number> = Object.fromEntries(RANGE_B.flatMap(([, h, l], i) => [[`h${i + 1}`, h], [`l${i + 1}`, l]]));
