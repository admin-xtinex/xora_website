import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

const r2 = (x: number) => Math.round(x * 100) / 100;

/** Builds simple 1m candles from a start price and a list of closes: each candle opens at the previous close, wicks 0.20 beyond the body. */
function fromCloses(start: number, closes: number[]) {
  let prev = start;
  return closes.map((c, i) => {
    const o = prev;
    prev = c;
    return { t: i * 60_000, o, h: r2(Math.max(o, c) + 0.2), l: r2(Math.min(o, c) - 0.2), c };
  });
}

/** Sample chart 1: lower highs and lower lows (downtrend). */
const CHART_DOWN = fromCloses(105.0, [104.2, 104.8, 103.5, 104.1, 102.8, 103.3, 101.9, 102.3, 101.0]);
/** Sample chart 2: higher highs and higher lows (uptrend). */
const CHART_UP = fromCloses(100.0, [101.0, 100.5, 101.8, 101.2, 102.6, 102.0, 103.4, 102.9, 104.1]);
/** Sample chart 3: swings turning inside roughly the same band (sideways). */
const CHART_SIDEWAYS = fromCloses(100.2, [101.6, 100.2, 101.5, 100.1, 101.7, 100.3, 101.5, 100.2, 101.6]);

const ohlc = (id: `FX-${string}`, candles: ReturnType<typeof fromCloses>, labels?: string[]): Fixture => ({
  id,
  kind: 'ohlc-series',
  fictional: true,
  label: LABEL,
  displaySymbol: 'DEMO/USDT',
  units: { price: 'USDT per DEMO', time: 'ms' },
  data: { interval: '1m', label: 'fictional', candles, ...(labels ? { labels } : {}) },
  version: '1.0.0',
});

export const fixtures: Fixture[] = [
  {
    id: 'FX-T16-SWINGS-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      // Swing points: A low 100.00, B high 102.00, C low 101.00, D high 103.00, E low 101.60, F high 102.60, G low 100.60
      labels: ['A', '·', 'B', '·', 'C', '·', 'D', '·', 'E', 'F', '·', 'G'],
      candles: [
        { t: 0, o: 100.6, h: 100.8, l: 100.0, c: 100.5 },
        { t: 60_000, o: 100.5, h: 101.4, l: 100.4, c: 101.3 },
        { t: 120_000, o: 101.3, h: 102.0, l: 101.2, c: 101.7 },
        { t: 180_000, o: 101.7, h: 101.8, l: 101.2, c: 101.3 },
        { t: 240_000, o: 101.3, h: 101.5, l: 101.0, c: 101.4 },
        { t: 300_000, o: 101.4, h: 102.3, l: 101.3, c: 102.2 },
        { t: 360_000, o: 102.2, h: 103.0, l: 102.1, c: 102.6 },
        { t: 420_000, o: 102.6, h: 102.7, l: 101.9, c: 102.0 },
        { t: 480_000, o: 102.0, h: 102.2, l: 101.6, c: 102.1 },
        { t: 540_000, o: 102.1, h: 102.6, l: 102.0, c: 102.3 },
        { t: 600_000, o: 102.3, h: 102.4, l: 101.2, c: 101.3 },
        { t: 660_000, o: 101.3, h: 101.4, l: 100.6, c: 100.8 },
      ],
    },
    version: '1.0.0',
  },
  ohlc('FX-T16-CHART-1', CHART_DOWN),
  ohlc('FX-T16-CHART-2', CHART_UP),
  ohlc('FX-T16-CHART-3', CHART_SIDEWAYS),
];
