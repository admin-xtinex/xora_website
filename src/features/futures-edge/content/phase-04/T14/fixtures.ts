import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

/** One fictional minute, sampled every 5 seconds. finalCandle = first/max/min/last tick. */
const FORMING_TICKS = [100.0, 100.4, 100.9, 100.6, 99.7, 99.4, 99.8, 100.5, 101.2, 100.95, 100.7, 100.85, 100.8];

export const fixtures: Fixture[] = [
  {
    id: 'FX-T14-FORMING-01',
    kind: 'price-path',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      ticks: FORMING_TICKS.map((p, i) => ({ t: i * 5_000, p })),
      finalCandle: { t: 0, o: 100.0, h: 101.2, l: 99.4, c: 100.8 },
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T14-SERIES-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      labels: ['A', 'B', 'C', 'D', 'E', 'F'],
      candles: [
        { t: 0, o: 100.8, h: 101.3, l: 100.5, c: 101.1 },
        { t: 60_000, o: 101.1, h: 101.2, l: 100.2, c: 100.4 },
        { t: 120_000, o: 100.4, h: 100.9, l: 99.6, c: 100.4 },
        { t: 180_000, o: 100.4, h: 100.6, l: 99.2, c: 99.5 },
        { t: 240_000, o: 99.5, h: 100.7, l: 99.4, c: 100.6 },
        { t: 300_000, o: 100.6, h: 101.8, l: 100.5, c: 100.9 },
      ],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T14-BUILDER-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      candles: [{ t: 0, o: 100.0, h: 102.0, l: 99.0, c: 101.5 }],
    },
    version: '1.0.0',
  },
];
