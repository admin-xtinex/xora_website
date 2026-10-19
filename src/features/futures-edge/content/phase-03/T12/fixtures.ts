import type { Fixture } from '@futures-edge/contracts';

export const fixtures: Fixture[] = [
  {
    id: 'FX-T12-LEVERAGE-01',
    kind: 'toy-model',
    fictional: true,
    label: 'Illustrative simplified linear-contract model with fictional numbers',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO' },
    data: { model: 'leverage.exposure', margin: 100, leverages: [1, 3, 10], note: 'fees, funding and exchange closure rules ignored' },
    version: '1.0.0',
  },
  {
    id: 'FX-T12-SHORT-01',
    kind: 'account-scenario',
    fictional: true,
    label: 'Fictional account scenario for practice',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO' },
    data: { side: 'short', margin: 50, leverage: 10, movePercent: 4 },
    version: '1.0.0',
  },
  {
    id: 'FX-T12-WALLET-01',
    kind: 'account-scenario',
    fictional: true,
    label: 'Fictional account scenario for practice',
    displaySymbol: 'DEMO/USDT',
    units: { price: 'USDT per DEMO' },
    data: { walletBalance: 500, positionMargin: 100, leverage: 10, mode: 'isolated' },
    version: '1.0.0',
  },
];
