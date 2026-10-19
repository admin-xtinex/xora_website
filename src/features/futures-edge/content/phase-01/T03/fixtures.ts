import type { Fixture } from '@futures-edge/contracts';

const LABEL = 'Fictional educational data — illustrative BTC/USDT prices, not a real market';

export const fixtures: Fixture[] = [
  {
    id: 'FX-T03-PAIR-01',
    kind: 'toy-model',
    fictional: true,
    label: LABEL,
    displaySymbol: 'BTC/USDT (illustrative)',
    units: { price: 'USDT per BTC' },
    data: {
      label: 'fictional',
      base: 'BTC',
      quote: 'USDT',
      price: 60000,
      repricePath: [60000, 62000, 57000],
      quantities: [1, 0.001],
    },
    version: '1.0.0',
  },
  {
    id: 'FX-T03-CLASSIFY-01',
    kind: 'classification-set',
    fictional: true,
    label: 'Fictional and illustrative pair names for practice',
    data: {
      label: 'fictional',
      pairs: ['BTC/USDT', 'DEMO/USDT', 'DEMO/BTC', 'TOY/USDT'],
    },
    version: '1.0.0',
  },
];
