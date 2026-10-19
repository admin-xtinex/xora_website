import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

/** Last traded price vs mark price, one sample every 10 s. The last price spikes to 90.20; the mark price stays near 91.60. */
const LAST = [100.0, 98.6, 96.9, 95.2, 93.8, 92.4, 90.2, 91.7, 92.3];
const MARK = [100.0, 98.8, 97.1, 95.4, 94.0, 92.6, 91.6, 91.8, 92.2];

/** A gap: price jumps from 93.80 straight to 90.00 between two samples. */
const GAP = [95.2, 94.6, 94.1, 93.8, 90.0, 90.4];

export const fixtures: Fixture[] = [
  {
    id: 'FX-T13-MARK-01',
    kind: 'price-path',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'fictional',
      ticks: LAST.map((p, i) => ({ t: i * 10_000, p, mark: MARK[i] as number })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T13-GAP-01',
    kind: 'price-path',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'fictional',
      ticks: GAP.map((p, i) => ({ t: i * 10_000, p })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T13-SERIES-01',
    kind: 'ohlc-series',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      candles: [
        { t: 0, o: 96.2, h: 96.8, l: 95.6, c: 95.9 },
        { t: 60_000, o: 95.9, h: 96.9, l: 95.1, c: 96.4 },
        { t: 120_000, o: 96.4, h: 96.6, l: 94.7, c: 95.0 },
        { t: 180_000, o: 95.0, h: 96.3, l: 94.4, c: 95.8 },
        { t: 240_000, o: 95.8, h: 96.1, l: 94.2, c: 94.6 },
        { t: 300_000, o: 94.6, h: 95.4, l: 93.8, c: 95.0 },
        { t: 360_000, o: 95.0, h: 96.0, l: 94.1, c: 94.5 },
        { t: 420_000, o: 94.5, h: 95.6, l: 93.6, c: 95.2 },
        { t: 480_000, o: 95.2, h: 95.5, l: 92.9, c: 93.4 },
        { t: 540_000, o: 93.4, h: 94.8, l: 92.6, c: 94.3 },
      ],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T13-ACCOUNT-01',
    kind: 'account-scenario',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', quantity: 'DEMO' },
    data: {
      label: 'fictional',
      entry: 100,
      quantity: 10,
      notional: 1000,
      maintenanceMarginRate: 0.005,
      fundingRatePer8h: 0.0001,
      note: 'Approximate model: fees, funding, margin tiers, other positions and mark-vs-last price are ignored.',
    },
    version: '1.0.0',
  },
];
