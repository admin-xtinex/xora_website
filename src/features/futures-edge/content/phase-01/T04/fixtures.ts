import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

export const fixtures: Fixture[] = [
  {
    id: 'FX-T04-BOOK-01',
    kind: 'order-book',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', quantity: 'DEMO' },
    data: {
      label: 'fictional',
      asks: [
        { price: 100.1, quantity: 1.5 },
        { price: 100.2, quantity: 2 },
        { price: 100.3, quantity: 4 },
      ],
      bids: [
        { price: 99.9, quantity: 2 },
        { price: 99.8, quantity: 3 },
        { price: 99.7, quantity: 5 },
      ],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T04-SECURITY-01',
    kind: 'classification-set',
    fictional: true,
    label: 'Fictional educational mock messages — not from any real exchange',
    data: {
      label: 'fictional',
      note: 'Generic mock security cues for practice; no real brand, address or interface.',
    },
    version: '1.0.0',
  },
];
