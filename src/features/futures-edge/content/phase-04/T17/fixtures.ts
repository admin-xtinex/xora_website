import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';
const UNITS = { price: 'USDT per DEMO', time: 'ms' } as const;

/** Shared past for the breakout-fakeout scenes: price turns under a resistance zone 102.00–102.40 several times. */
export const BRANCH_PAST = [101.0, 101.6, 102.2, 101.5, 100.9, 101.7, 102.3, 101.6, 101.2, 101.9, 102.3];
export const BRANCH_CONTINUE = [102.7, 103.1, 102.6, 102.5, 102.9, 103.4, 103.8];
export const BRANCH_FAKEOUT = [102.7, 102.9, 102.3, 101.8, 101.4, 101.0, 100.7];

export const fixtures: Fixture[] = [
  {
    id: 'FX-T17-ZONE-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: UNITS,
    data: {
      interval: '1m',
      label: 'fictional',
      // Three touches of a support area: lows 99.70 (T1), 99.60 (T2), 99.80 (T3)
      labels: ['·', '·', 'T1', '·', '·', '·', 'T2', '·', '·', '·', 'T3', '·'],
      candles: [
        { t: 0, o: 101.0, h: 101.3, l: 100.8, c: 101.1 },
        { t: 60_000, o: 101.1, h: 101.2, l: 100.5, c: 100.6 },
        { t: 120_000, o: 100.6, h: 100.7, l: 99.7, c: 99.9 },
        { t: 180_000, o: 99.9, h: 100.8, l: 99.8, c: 100.7 },
        { t: 240_000, o: 100.7, h: 101.5, l: 100.6, c: 101.3 },
        { t: 300_000, o: 101.3, h: 101.4, l: 100.4, c: 100.5 },
        { t: 360_000, o: 100.5, h: 100.6, l: 99.6, c: 100.1 },
        { t: 420_000, o: 100.1, h: 101.0, l: 100.0, c: 100.9 },
        { t: 480_000, o: 100.9, h: 101.4, l: 100.7, c: 101.0 },
        { t: 540_000, o: 101.0, h: 101.1, l: 100.2, c: 100.3 },
        { t: 600_000, o: 100.3, h: 100.4, l: 99.8, c: 100.2 },
        { t: 660_000, o: 100.2, h: 101.2, l: 100.1, c: 101.1 },
      ],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T17-BRANCH-01',
    kind: 'branching-paths',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: UNITS,
    data: {
      past: BRANCH_PAST,
      level: { price: 102.4, label: 'Top of resistance zone 102.40' },
      branches: [
        { id: 'continue', label: 'A: breakout + retest holds', points: BRANCH_CONTINUE, note: 'Closes above 102.40, retest at 102.50 holds, continues to 103.80.' },
        { id: 'fakeout', label: 'B: fakeout, back inside', points: BRANCH_FAKEOUT, note: 'Pokes to 102.90, falls back to 102.30 inside the zone, then 100.70.' },
      ],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T17-BREAK-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: UNITS,
    data: {
      interval: '1m',
      label: 'fictional',
      // Highs turn under 102.00–102.40; the last candle (N) is the first close above the zone, at 102.70.
      labels: ['·', 'R1', '·', '·', 'R2', '·', '·', 'R3', '·', 'N'],
      candles: [
        { t: 0, o: 101.2, h: 101.7, l: 101.1, c: 101.6 },
        { t: 60_000, o: 101.6, h: 102.3, l: 101.5, c: 101.8 },
        { t: 120_000, o: 101.8, h: 101.9, l: 101.0, c: 101.1 },
        { t: 180_000, o: 101.1, h: 101.8, l: 101.0, c: 101.7 },
        { t: 240_000, o: 101.7, h: 102.2, l: 101.6, c: 101.9 },
        { t: 300_000, o: 101.9, h: 102.0, l: 101.2, c: 101.3 },
        { t: 360_000, o: 101.3, h: 102.0, l: 101.2, c: 101.9 },
        { t: 420_000, o: 101.9, h: 102.4, l: 101.8, c: 102.1 },
        { t: 480_000, o: 102.1, h: 102.3, l: 101.8, c: 102.0 },
        { t: 540_000, o: 102.0, h: 102.9, l: 101.9, c: 102.7 },
      ],
    },
    version: '1.0.0',
  },
];
