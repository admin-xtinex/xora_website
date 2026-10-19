import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

/** One fictional long trade: entry 200.00, price wanders up to an exit at 210.00. Sampled every 10 seconds. */
export const T06_PATH = [200, 201.5, 203, 202, 204, 205, 203.5, 207, 210];
/** A losing long / winning short from 150.00 to 146.00. */
export const T06_DOWN_PATH = [150, 149, 151, 148, 147, 146];

export const fixtures: Fixture[] = [
  {
    id: 'FX-T06-PATH-01',
    kind: 'price-path',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', time: 'ms' },
    data: {
      label: 'fictional',
      ticks: T06_PATH.map((p, i) => ({ t: i * 10_000, p })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T06-FEES-01',
    kind: 'fee-schedule',
    fictional: true,
    label: 'Illustrative fee rates for teaching — not any exchange’s real schedule',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', quantity: 'DEMO' },
    data: {
      takerRatePerSide: 0.0005,
      makerRatePerSide: 0.0002,
      note: 'Illustrative only. Real rates vary by exchange, account and order type.',
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T06-STATES-01',
    kind: 'classification-set',
    fictional: true,
    label: LABEL,
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO', quantity: 'DEMO' },
    data: {
      buckets: ['realized', 'unrealized'],
      cases: [
        { id: 'open-long', state: 'unrealized' },
        { id: 'closed-short', state: 'realized' },
        { id: 'partial-closed-part', state: 'realized' },
        { id: 'partial-open-part', state: 'unrealized' },
        { id: 'mark-view', state: 'unrealized' },
        { id: 'sold-spot', state: 'realized' },
      ],
    },
    version: '1.0.0',
  },
];
