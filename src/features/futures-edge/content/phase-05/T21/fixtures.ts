import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

/**
 * Fictional DEMO/USDT, 12 one-minute candles. Candles 1–8: range 99.40–100.60, average volume 1,200.
 * Candle 9 closes 100.90 above the 100.60 resistance on 900 volume (relative volume 0.75) with a 0.40 upper wick;
 * candle 10 fades (close 100.75, volume 700, relative volume ≈ 0.58). Candles 11–12 are ONE possible continuation
 * (back to 99.90), revealed only after the learner decides.
 */
const CANDLES = [
  { o: 100.0, h: 100.5, l: 99.6, c: 100.3, v: 1300 },
  { o: 100.3, h: 100.6, l: 99.9, c: 100.0, v: 1250 },
  { o: 100.0, h: 100.2, l: 99.4, c: 99.6, v: 1400 },
  { o: 99.6, h: 100.1, l: 99.5, c: 100.0, v: 1150 },
  { o: 100.0, h: 100.55, l: 99.9, c: 100.4, v: 1100 },
  { o: 100.4, h: 100.5, l: 99.8, c: 99.9, v: 1200 },
  { o: 99.9, h: 100.3, l: 99.7, c: 100.2, v: 1050 },
  { o: 100.2, h: 100.6, l: 100.1, c: 100.5, v: 1150 },
  { o: 100.5, h: 101.3, l: 100.45, c: 100.9, v: 900 },
  { o: 100.9, h: 101.0, l: 100.6, c: 100.75, v: 700 },
  { o: 100.75, h: 100.8, l: 100.2, c: 100.3, v: 1300 },
  { o: 100.3, h: 100.4, l: 99.8, c: 99.9, v: 1100 },
];

/** Closes of the first 10 candles: the identical past shared by every branch. */
export const T21_PAST = CANDLES.slice(0, 10).map((c) => c.c);

export const fixtures: Fixture[] = [
  {
    id: 'FX-T21-REVEAL-01',
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
    id: 'FX-T21-BRANCH-01',
    kind: 'branching-paths',
    fictional: true,
    label: 'Fictional educational simulation — possible futures, not predictions',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO' },
    data: {
      past: T21_PAST,
      level: { price: 100.6, label: 'Resistance 100.60' },
      branches: [
        { id: 'follow-through', label: 'Follow-through to 101.90', points: [101.0, 101.3, 101.6, 101.9], note: 'the breakout continues' },
        { id: 'false-breakout', label: 'False breakout to 99.70', points: [100.4, 100.1, 99.8, 99.7], note: 'price falls back into the range' },
        { id: 'chop', label: 'Chop around 100.60', points: [100.9, 100.5, 100.8, 100.55], note: 'no follow-through either way' },
      ],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T21-EVIDENCE-01',
    kind: 'classification-set',
    fictional: true,
    label: 'Illustrative statements about fictional chart evidence',
    data: { buckets: ['can', 'cannot'] },
    version: '1.0.0',
  },
];
