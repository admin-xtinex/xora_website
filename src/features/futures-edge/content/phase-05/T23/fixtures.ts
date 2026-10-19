import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market. Educational simulation.';

/** 15 fictional one-minute candles: a choppy range, ending in the middle of it. */
const CANDLES: Array<[number, number, number, number, number]> = [
  [100.2, 100.45, 100.05, 100.3, 140],
  [100.3, 100.6, 100.2, 100.55, 160],
  [100.55, 100.9, 100.45, 100.8, 210],
  [100.8, 101.1, 100.6, 100.7, 230],
  [100.7, 100.75, 100.25, 100.35, 190],
  [100.35, 100.5, 99.9, 100.0, 220],
  [100.0, 100.3, 99.7, 99.8, 200],
  [99.8, 100.05, 99.55, 99.95, 240],
  [99.95, 100.4, 99.85, 100.3, 170],
  [100.3, 100.65, 100.2, 100.55, 150],
  [100.55, 100.85, 100.4, 100.45, 180],
  [100.45, 100.5, 99.95, 100.05, 160],
  [100.05, 100.35, 99.8, 100.25, 130],
  [100.25, 100.55, 100.1, 100.15, 110],
  [100.15, 100.3, 99.95, 100.0, 100],
];

export const CLOSES = CANDLES.map((c) => c[3]);

export const BRANCHES = [
  { id: 'rally', label: 'Rally to 101.30', points: [100.3, 100.6, 100.5, 100.9, 101.0, 101.25, 101.3] },
  { id: 'chop', label: 'Chops sideways', points: [100.2, 99.9, 100.3, 100.1, 99.8, 100.2, 100.0] },
  { id: 'drop', label: 'Drops to 98.80', points: [99.9, 99.7, 99.6, 99.45, 99.3, 99.1, 98.95, 98.8] },
];

export const fixtures: Fixture[] = [
  {
    id: 'FX-T23-SERIES-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      labels: CANDLES.map((_, i) => String(i + 1)),
      candles: CANDLES.map(([o, h, l, c, v], i) => ({ t: i * 60_000, o, h, l, c, v })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T23-BRANCH-01',
    kind: 'branching-paths',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO' },
    data: {
      past: CLOSES,
      branches: BRANCHES,
      level: { price: 100.85, label: 'Recent high 100.85' },
    },
    version: '1.0.0',
  },
];
