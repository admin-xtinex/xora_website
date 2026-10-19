import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';
const UNITS = { price: 'USDT per DEMO', time: 'ms' } as const;

export const fixtures: Fixture[] = [
  {
    id: 'FX-T07-BOOK-01',
    kind: 'order-book',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: UNITS,
    data: {
      label: 'fictional',
      note: 'Small fictional book used by the market-sweep and limit-partial-fill scenes.',
      asks: [{ price: 100.1, quantity: 2 }, { price: 100.2, quantity: 3 }, { price: 100.4, quantity: 5 }],
      bids: [{ price: 100.0, quantity: 3 }, { price: 99.9, quantity: 4 }, { price: 99.7, quantity: 5 }],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T07-BOOK-02',
    kind: 'order-book',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: UNITS,
    data: {
      label: 'fictional',
      note: 'Practice book for exercises T07-X02 and T07-X03 (asks, best first).',
      asks: [{ price: 100.5, quantity: 4 }, { price: 100.7, quantity: 4 }, { price: 101.0, quantity: 5 }],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T07-JUMP-01',
    kind: 'price-path',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: UNITS,
    data: {
      label: 'fictional',
      ticks: [
        { t: 0, p: 100.0 },
        { t: 5_000, p: 99.9 },
        { t: 10_000, p: 99.8 },
        { t: 15_000, p: 98.6 },
        { t: 20_000, p: 98.4 },
        { t: 25_000, p: 98.5 },
      ],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T07-CHOOSE-01',
    kind: 'classification-set',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: UNITS,
    data: {
      label: 'fictional',
      note: 'Six fictional order-choice scenarios for exercise T07-X01.',
      buckets: ['market', 'limit', 'stop-market', 'stop-limit'],
    },
    version: '1.0.0',
  },
];
