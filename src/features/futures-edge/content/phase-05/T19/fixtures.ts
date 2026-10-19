import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

type Row = [o: number, h: number, l: number, c: number, v: number];

/**
 * A fictional 15-minute chart (15 × 1m). Observation 1 = minute 5 (bounce from 100.00);
 * observation 2 = minute 11 (touch of 100.40, closes back at 100.27). Range 100.00–100.40 (0.40%), average volume 176.
 */
const CHART15: Row[] = [
  [100.2, 100.3, 100.12, 100.18, 140],
  [100.18, 100.24, 100.08, 100.1, 150],
  [100.1, 100.16, 100.03, 100.06, 170],
  [100.06, 100.12, 100.0, 100.04, 210],
  [100.04, 100.22, 100.0, 100.2, 260],
  [100.2, 100.28, 100.15, 100.25, 180],
  [100.25, 100.32, 100.18, 100.22, 160],
  [100.22, 100.3, 100.14, 100.28, 150],
  [100.28, 100.36, 100.22, 100.33, 190],
  [100.33, 100.38, 100.25, 100.3, 200],
  [100.3, 100.4, 100.24, 100.27, 240],
  [100.27, 100.31, 100.17, 100.21, 170],
  [100.21, 100.29, 100.15, 100.26, 150],
  [100.26, 100.34, 100.2, 100.31, 140],
  [100.31, 100.35, 100.24, 100.3, 130],
];

/** Closing prices of CHART15, for price-path scenes. */
export const CHART15_CLOSES: number[] = CHART15.map((r) => r[3]);

export const fixtures: Fixture[] = [
  {
    id: 'FX-T19-CHART15-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      labels: CHART15.map((_, i) => String(i + 1)),
      candles: CHART15.map(([o, h, l, c, v], i) => ({ t: i * 60_000, o, h, l, c, v })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T19-COSTS-01',
    kind: 'fee-schedule',
    fictional: true,
    label: 'Illustrative fee and slippage rates (fictional) — rates vary by exchange and account',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'illustrative',
      takerFeeRatePerSide: 0.0005,
      makerFeeRatePerSide: 0.0002,
      slippageRatePerSide: 0.0002,
      example: { entry: 100, quantity: 10, notional: 1000, roundTripEstimate: 1.4 },
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T19-SITUATIONS-01',
    kind: 'classification-set',
    fictional: true,
    label: 'Fictional situations for practice — not real market events',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'fictional',
      buckets: ['inappropriate', 'evaluate'],
      note: 'Situations describe a fictional DEMO/USDT session; no orders are placed.',
    },
    version: '1.0.0',
  },
];
