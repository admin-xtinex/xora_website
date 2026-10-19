import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

/**
 * Fifteen fictional 1-minute candles (t = k × 60 000 ms). Aggregated:
 * 5m #1 O 100.00 H 100.80 L 99.70 C 100.50 · 5m #2 O 100.50 H 101.60 L 100.40 C 101.30 · 5m #3 O 101.30 H 101.40 L 100.00 C 100.90
 * 15m   O 100.00 H 101.60 L 99.70 C 100.90
 */
const RAW: Array<[number, number, number, number]> = [
  [100.0, 100.4, 99.8, 100.2],
  [100.2, 100.7, 100.1, 100.6],
  [100.6, 100.8, 100.2, 100.3],
  [100.3, 100.5, 99.7, 99.9],
  [99.9, 100.6, 99.8, 100.5],
  [100.5, 101.1, 100.4, 101.0],
  [101.0, 101.3, 100.6, 100.7],
  [100.7, 101.6, 100.6, 101.4],
  [101.4, 101.5, 100.9, 101.1],
  [101.1, 101.4, 100.8, 101.3],
  [101.3, 101.4, 100.5, 100.6],
  [100.6, 100.9, 100.1, 100.3],
  [100.3, 100.8, 100.0, 100.7],
  [100.7, 101.2, 100.6, 101.1],
  [101.1, 101.3, 100.7, 100.9],
];

export const fixtures: Fixture[] = [
  {
    id: 'FX-T15-SERIES-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      labels: RAW.map((_, k) => `${k + 1}`),
      candles: RAW.map(([o, h, l, c], k) => ({ t: k * 60_000, o, h, l, c })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T15-CLASSIFY-01',
    kind: 'classification-set',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    data: {
      label: 'fictional',
      buckets: ['representation', 'market-event'],
      note: 'Statements about switching timeframes on the same fictional DEMO/USDT trades.',
    },
    version: '1.0.0',
  },
];
