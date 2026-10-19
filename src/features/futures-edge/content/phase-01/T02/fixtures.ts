import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — not a real market';

/** Fictional minute-by-minute prices: quiet trading, then a surprise headline at index 5. */
export const NEWS_PATH = [100.0, 100.2, 99.9, 100.1, 100.0, 104.5, 103.2, 105.1, 102.8, 103.6];

export const fixtures: Fixture[] = [
  {
    id: 'FX-T02-TOY-01',
    kind: 'toy-model',
    fictional: true,
    label: 'Illustrative toy model — not a prediction of real markets',
    displaySymbol: 'TOY/USDT',
    units: { price: 'USDT per TOY' },
    data: {
      model: 'price.linear-toy',
      formula: 'price = basePrice + stepPerLevel × (buyers − sellers)',
      basePrice: 100,
      stepPerLevel: 0.5,
      buyers: { min: 0, max: 20, start: 5 },
      sellers: { min: 0, max: 20, start: 5 },
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T02-NEWS-01',
    kind: 'price-path',
    fictional: true,
    label: LABEL,
    displaySymbol: 'TOY/USDT',
    units: { price: 'USDT per TOY', time: 'ms' },
    data: {
      interval: '1m',
      label: 'fictional',
      ticks: NEWS_PATH.map((p, i) => ({ t: i * 60_000, p, ...(i === 5 ? { mark: 'Surprise news' } : {}) })),
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T02-CLASSIFY-01',
    kind: 'classification-set',
    fictional: true,
    label: 'Illustrative statements for practice — fictional',
    data: {
      buckets: ['myth', 'fact'],
      note: 'Statements about why prices move, sorted into myths and facts.',
    },
    version: '1.0.0',
  },
];
