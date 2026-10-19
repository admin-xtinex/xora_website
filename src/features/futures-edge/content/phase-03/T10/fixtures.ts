import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational mock — not a real exchange screen or real market data';

export const fixtures: Fixture[] = [
  {
    id: 'FX-T10-TERMINAL-01',
    kind: 'mock-terminal',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'fictional',
      areas: ['watchlist', 'symbol', 'chart', 'order-book', 'order-entry', 'positions', 'wallet', 'security'],
      symbol: 'DEMO/USDT',
      lastPrice: 100.25,
      markPrice: 100.2,
      walletBalance: 500,
      watchlist: [
        { symbol: 'DEMO/USDT', lastPrice: 100.25 },
        { symbol: 'TOY/USDT', lastPrice: 4.12 },
        { symbol: 'MOCK/USDT', lastPrice: 0.87 },
      ],
      position: { symbol: 'DEMO/USDT', side: 'long', quantity: 2, entry: 100, mark: 100.2, unrealizedPnl: 0.4 },
      note: 'Generic layout for learning. Real platforms differ and change over time. No logos, no API keys, no real orders.',
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T10-SECURITY-01',
    kind: 'classification-set',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'fictional',
      buckets: ['good-habit', 'red-flag'],
      note: 'Fictional security situations for practice.',
    },
    version: '1.0.0',
  },
];
