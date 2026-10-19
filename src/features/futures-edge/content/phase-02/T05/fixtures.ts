import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

/** One predetermined fictional path: rises from 100 to 104, then reverses down to 96. Sampled every 10 seconds. */
export const T05_PATH = [100, 101, 102, 103, 104, 103, 102, 101, 100, 99, 98, 97, 96];

export const fixtures: Fixture[] = [
  {
    id: 'FX-T05-PATH-01',
    kind: 'price-path',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'fictional',
      ticks: T05_PATH.map((p, i) => ({ t: i * 10_000, p })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T05-SIDES-01',
    kind: 'classification-set',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', quantity: 'DEMO' },
    data: {
      entry: 100,
      quantity: 2,
      checkpoints: [
        { id: 'top', price: 104, longPnl: 8, shortPnl: -8 },
        { id: 'back-at-entry', price: 100, longPnl: 0, shortPnl: 0 },
        { id: 'on-the-way-down', price: 102, longPnl: 4, shortPnl: -4 },
        { id: 'end', price: 96, longPnl: -8, shortPnl: 8 },
      ],
      buckets: ['profit', 'loss', 'flat'],
    },
    version: '1.0.0',
  },
];
