import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

export const fixtures: Fixture[] = [
  {
    id: 'FX-T01-PATH-01',
    kind: 'price-path',
    fictional: true,
    label: 'Fictional illustrative BTC/USDT prices — not real market data',
    displaySymbol: 'BTC/USDT (fictional prices)',
    units: { price: 'USDT per BTC (fictional)', time: 'ms' },
    data: {
      label: 'fictional',
      ticks: [50_000, 50_400, 51_200, 50_800, 52_000, 49_800, 47_500].map((p, i) => ({ t: i * 3_600_000, p })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T01-CLASSIFY-01',
    kind: 'classification-set',
    fictional: true,
    label: LABEL,
    data: {
      buckets: ['crypto', 'not-crypto'],
      note: 'Everyday digital objects sorted into cryptocurrency and not cryptocurrency (illustrative).',
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T01-BALANCE-01',
    kind: 'account-scenario',
    fictional: true,
    label: 'Fictional illustrative balance — not a real account',
    displaySymbol: 'BTC/USDT (fictional prices)',
    units: { price: 'USDT per BTC (fictional)', quantity: 'BTC' },
    data: { quantity: 0.002, asset: 'BTC', samplePrice: 61_250, quote: 'USDT' },
    version: '1.0.0',
  },
];
