import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

/**
 * One fictional DEMO/USDT coin, 15 one-minute candles. An early fall (101.80 → 99.20) turns into a quiet sideways
 * range: last-10 high 100.80, low 99.30; support zone 99.20–99.40, resistance zone 100.60–100.80; price now 100.05
 * (middle); volume fades from 1,800 to 580 (average ≈ 1,003). Built so that the honest answer is WAIT / NO_TRADE.
 */
const CANDLES = [
  { o: 101.6, h: 101.8, l: 101.0, c: 101.1, v: 1400 },
  { o: 101.1, h: 101.2, l: 100.3, c: 100.5, v: 1600 },
  { o: 100.5, h: 100.7, l: 99.6, c: 99.8, v: 1800 },
  { o: 99.8, h: 100.1, l: 99.2, c: 99.5, v: 1500 },
  { o: 99.5, h: 100.3, l: 99.4, c: 100.2, v: 1100 },
  { o: 100.2, h: 100.8, l: 100.0, c: 100.6, v: 1000 },
  { o: 100.6, h: 100.7, l: 99.9, c: 100.0, v: 900 },
  { o: 100.0, h: 100.2, l: 99.3, c: 99.4, v: 950 },
  { o: 99.4, h: 99.9, l: 99.3, c: 99.8, v: 800 },
  { o: 99.8, h: 100.7, l: 99.7, c: 100.5, v: 850 },
  { o: 100.5, h: 100.75, l: 100.1, c: 100.2, v: 700 },
  { o: 100.2, h: 100.4, l: 99.6, c: 99.7, v: 650 },
  { o: 99.7, h: 100.1, l: 99.5, c: 100.0, v: 600 },
  { o: 100.0, h: 100.3, l: 99.8, c: 100.1, v: 620 },
  { o: 100.1, h: 100.25, l: 99.9, c: 100.05, v: 580 },
];

/** Close prices of the same coin, used by path-based scenes. */
export const T20_CLOSES = CANDLES.map((c) => c.c);

export const fixtures: Fixture[] = [
  {
    id: 'FX-T20-COIN-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', quantity: 'DEMO', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      labels: CANDLES.map((_, i) => String(i + 1)),
      candles: CANDLES.map((c, i) => ({ t: i * 60_000, ...c })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T20-RISK-01',
    kind: 'account-scenario',
    fictional: true,
    label: 'Fictional illustrative account — not a recommendation',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', quantity: 'DEMO' },
    data: { balance: 1000, riskAmount: 10, side: 'long', entry: 99.4, stop: 99.0, target: 100.6, currency: 'USDT', note: 'illustrative example only' },
    version: '1.0.0',
  },
  {
    id: 'FX-T20-STEPS-01',
    kind: 'classification-set',
    fictional: true,
    label: 'Illustrative evaluation steps (fictional teaching data)',
    data: { steps: ['trend', 'range', 'level', 'volume', 'risk', 'decision'] },
    version: '1.0.0',
  },
];
