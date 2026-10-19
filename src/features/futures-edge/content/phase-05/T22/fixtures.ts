import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

export const fixtures: Fixture[] = [
  {
    id: 'FX-T22-ACCOUNT-01',
    kind: 'account-scenario',
    fictional: true,
    label: `${LABEL}. Illustrative practice account.`,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', quantity: 'DEMO' },
    data: {
      label: 'fictional',
      accountBalance: 1000,
      illustrativeRiskPercent: 1,
      illustrativeDailyLossLimitPercent: 3,
      examples: [
        { side: 'long', entry: 100, stop: 98, riskAmount: 10, quantity: 5, notional: 500 },
        { side: 'short', entry: 50, stop: 51, riskAmount: 10, quantity: 10, notional: 500 },
        { side: 'long', entry: 100, stop: 97, riskAmount: 10, sizeStep: 0.1, quantity: 3.3, notional: 330 },
      ],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T22-SESSION-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
      candles: [
        { t: 0, o: 100.0, h: 100.3, l: 99.6, c: 99.7, v: 120 },
        { t: 60_000, o: 99.7, h: 99.9, l: 99.2, c: 99.3, v: 150 },
        { t: 120_000, o: 99.3, h: 99.5, l: 98.9, c: 99.1, v: 160 },
        { t: 180_000, o: 99.1, h: 99.8, l: 99.0, c: 99.7, v: 140 },
        { t: 240_000, o: 99.7, h: 100.4, l: 99.6, c: 100.3, v: 210 },
        { t: 300_000, o: 100.3, h: 100.9, l: 100.2, c: 100.8, v: 260 },
        { t: 360_000, o: 100.8, h: 101.0, l: 100.5, c: 100.6, v: 180 },
        { t: 420_000, o: 100.6, h: 101.2, l: 100.5, c: 101.1, v: 240 },
      ],
    },
    version: '1.0.0',
  },
];
