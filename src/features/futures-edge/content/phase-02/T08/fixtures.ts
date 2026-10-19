import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';
const UNITS = { price: 'USDT per DEMO', time: 'ms' as const };

const CANDLES: Array<[number, number, number, number]> = [
  [99.2, 99.6, 98.9, 99.4],
  [99.4, 99.9, 99.2, 99.7],
  [99.7, 100.1, 99.5, 99.6],
  [99.6, 100.0, 99.3, 99.9],
  [99.9, 100.3, 99.7, 100.2],
  [100.2, 100.4, 99.8, 99.9],
  [99.9, 100.2, 99.7, 100.0],
  [100.0, 100.3, 99.8, 100.0],
];

export const fixtures: Fixture[] = [
  {
    id: 'FX-T08-CHART-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: UNITS,
    data: {
      interval: '1m',
      label: 'fictional',
      candles: CANDLES.map(([o, h, l, c], i) => ({ t: i * 60_000, o, h, l, c })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T08-GAP-01',
    kind: 'price-path',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: UNITS,
    data: {
      label: 'fictional',
      ticks: [100.0, 99.6, 99.1, 96.5, 96.2, 96.8].map((p, i) => ({ t: i * 10_000, p })),
    },
    version: '1.0.0',
  },
];
