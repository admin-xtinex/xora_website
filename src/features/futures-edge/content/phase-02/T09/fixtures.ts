import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — illustrative rates, not a real market or a real fee schedule';

export const fixtures: Fixture[] = [
  {
    id: 'FX-T09-FEES-01',
    kind: 'fee-schedule',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'fictional',
      makerRate: 0.0002,
      takerRate: 0.0005,
      slippageEstimateRate: 0.0002,
      fundingRatePer8h: 0.0001,
      note: 'Illustrative course rates only. Real rates vary by exchange, product and account tier.',
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T09-SCALP-01',
    kind: 'account-scenario',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'fictional',
      side: 'long',
      quantity: 10,
      entryMid: 100.0,
      exitMid: 100.08,
      entryFeeRate: 0.0005,
      exitFeeRate: 0.0005,
      spreadCost: 0.2,
      slippageCost: 0.2,
      grossPnl: 0.8,
      netPnl: -0.6004,
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T09-BOOK-01',
    kind: 'order-book',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'fictional',
      bids: [{ price: 99.99, quantity: 12 }, { price: 99.98, quantity: 20 }, { price: 99.97, quantity: 35 }],
      asks: [{ price: 100.01, quantity: 10 }, { price: 100.02, quantity: 18 }, { price: 100.03, quantity: 30 }],
    },
    version: '1.0.0',
  },
];
