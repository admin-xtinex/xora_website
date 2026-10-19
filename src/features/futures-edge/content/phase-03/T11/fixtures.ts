import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

export const fixtures: Fixture[] = [
  {
    id: 'FX-T11-CRASH-01',
    kind: 'price-path',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      interval: '1h',
      label: 'fictional',
      ticks: [100, 96, 91, 85, 80].map((p, i) => ({ t: i * 3_600_000, p })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T11-CLASSIFY-01',
    kind: 'classification-set',
    fictional: true,
    label: 'Fictional classification examples for teaching',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO' },
    data: { buckets: ['spot', 'futures'], items: ['ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5'] },
    version: '1.0.0',
  },
  {
    id: 'FX-T11-RISKS-01',
    kind: 'account-scenario',
    fictional: true,
    label: 'Fictional account scenario with illustrative rates',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', quantity: 'notional in USDT' },
    data: { side: 'long', entry: 100, quantity: 1, deposit: 20, fundingRate: 0.0001, intervalHours: 8 },
    version: '1.0.0',
  },
  {
    id: 'FX-T11-FUNDING-01',
    kind: 'account-scenario',
    fictional: true,
    label: 'Fictional account scenario with illustrative funding rates',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', quantity: 'notional in USDT' },
    data: { side: 'long', notional: 2000, rate: 0.0001, intervalHours: 8, intervals: 3 },
    version: '1.0.0',
  },
];
