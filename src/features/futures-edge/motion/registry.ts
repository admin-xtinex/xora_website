/**
 * Scene registry: one definition per SCENE_TYPES entry. `validateParameters` is the authoring reference for each
 * scene's JSON parameters; content tests run it over every scene in the course.
 */
import { SCENE_TYPES, type JsonObject, type SceneRegistry, type SceneType } from '@futures-edge/contracts';
import { checkParams, type ParamSpec } from './params';
import { OrderBookScene, OrderPlacementScene, MockTerminalScene, SupplyDemandScene, TextCardScene, TradingPairScene, ValueExchangeScene, TERMINAL_AREAS } from './scenes/basics';
import { FeeBuildupScene, FundingClockScene, LeverageExposureScene, MarginBufferScene, PnlMeterScene, PricePathScene, SlTpScene, SpotVsFuturesScene } from './scenes/trading';
import { BranchingScene, CandleFormationScene, MarketStructureScene, RangeOverlayScene, SupportResistanceScene, TimeframeAggregationScene, VolumeBarsScene } from './scenes/charts';
import { PositionSizingScene, TradeLifecycleScene } from './scenes/risk';
import type { SceneDef, SceneRenderer } from './types';

/** Parameter specs per scene type (variant/branchId are always allowed). */
export const SCENE_PARAM_SPECS: Record<SceneType, ParamSpec> = {
  'text-card': { required: { heading: 'string' }, optional: { items: 'strings' } },
  'value-exchange': { optional: { asset: 'string', quote: 'string', quantity: 'number', prices: 'numbers', entries: 'objects', give: 'object', get: 'object' } },
  'supply-demand': { required: { basePrice: 'number', stepPerLevel: 'number', buyers: 'numbers', sellers: 'numbers' } },
  'trading-pair': { required: { base: 'string', quote: 'string', price: 'number' }, optional: { prices: 'numbers', quantities: 'numbers', quantity: 'number', quoteAmount: 'number' } },
  'order-book-matching': { required: { bids: 'objects', asks: 'objects' }, optional: { incoming: 'object' } },
  'order-placement': { required: { path: 'numbers', orders: 'objects' }, optional: { slippage: 'number' } },
  'price-path': { required: { points: 'numbers' }, optional: { markers: 'objects', level: 'object', comparePoints: 'numbers', label: 'string', compareLabel: 'string' } },
  'pnl-meter': { required: { path: 'numbers', entry: 'number', quantity: 'number' }, optional: { side: 'string', exitIndex: 'number', unit: 'string' } },
  'sl-tp-lines': { required: { side: 'string', entry: 'number', stop: 'number', target: 'number' }, optional: { path: 'numbers', stopLimit: 'number', quantity: 'number' } },
  'fee-buildup': { required: { entry: 'number' }, optional: { side: 'string', exit: 'number', quantity: 'number', entryFeeRate: 'number', exitFeeRate: 'number', spreadCost: 'number', slippageCost: 'number', trades: 'number', notional: 'number', makerRate: 'number', takerRate: 'number' } },
  'mock-terminal-tour': { required: { areas: 'strings' }, optional: { symbol: 'string' } },
  'spot-vs-futures': { required: { path: 'numbers', spotQuantity: 'number' }, optional: { futuresQuantity: 'number', margin: 'number' } },
  'leverage-exposure': { required: { margin: 'number', leverages: 'numbers' }, optional: { movePercents: 'numbers', side: 'string' } },
  'margin-buffer': { required: { side: 'string', entry: 'number', leverage: 'number', mmr: 'number' }, optional: { path: 'numbers', quantity: 'number', walletBalance: 'number', tiers: 'numbers' } },
  'funding-clock': { required: { notional: 'number', side: 'string', rates: 'numbers' }, optional: { intervalHours: 'number' } },
  'candle-formation': { optional: { o: 'number', h: 'number', l: 'number', c: 'number', candles: 'objects', range: 'numbers' } },
  'timeframe-aggregation': { required: { groupSize: 'number' }, optional: { targetLabel: 'string' } },
  'market-structure': { required: { points: 'numbers' } },
  'support-resistance-zone': { required: { points: 'numbers', zone: 'object' } },
  'breakout-fakeout': { optional: { past: 'numbers', branches: 'objects', level: 'object' } },
  'volume-bars': { optional: { highlight: 'numbers' } },
  'range-overlay': { required: { window: 'number' }, optional: { slide: 'boolean' } },
  'position-sizing': { required: { entry: 'number', riskAmount: 'number', stops: 'numbers' }, optional: { side: 'string', balance: 'number' } },
  'branching-paths': { optional: { past: 'numbers', branches: 'objects', level: 'object' } },
  'trade-lifecycle': { required: { steps: 'strings' }, optional: { path: 'numbers', decision: 'string', outcome: 'string' } },
};

/** Scene types that read their data from a fixture (fixtureId required on the scene). */
export const FIXTURE_SCENES: Partial<Record<SceneType, (variant: string | undefined) => boolean>> = {
  'candle-formation': (v) => v === undefined || v === 'forming',
  'timeframe-aggregation': () => true,
  'volume-bars': () => true,
  'range-overlay': () => true,
};

const RENDERERS: Record<SceneType, SceneRenderer> = {
  'text-card': TextCardScene,
  'value-exchange': ValueExchangeScene,
  'supply-demand': SupplyDemandScene,
  'trading-pair': TradingPairScene,
  'order-book-matching': OrderBookScene,
  'order-placement': OrderPlacementScene,
  'price-path': PricePathScene,
  'pnl-meter': PnlMeterScene,
  'sl-tp-lines': SlTpScene,
  'fee-buildup': FeeBuildupScene,
  'mock-terminal-tour': MockTerminalScene,
  'spot-vs-futures': SpotVsFuturesScene,
  'leverage-exposure': LeverageExposureScene,
  'margin-buffer': MarginBufferScene,
  'funding-clock': FundingClockScene,
  'candle-formation': CandleFormationScene,
  'timeframe-aggregation': TimeframeAggregationScene,
  'market-structure': MarketStructureScene,
  'support-resistance-zone': SupportResistanceScene,
  'breakout-fakeout': BranchingScene,
  'volume-bars': VolumeBarsScene,
  'range-overlay': RangeOverlayScene,
  'position-sizing': PositionSizingScene,
  'branching-paths': BranchingScene,
  'trade-lifecycle': TradeLifecycleScene,
};

function extraChecks(type: SceneType, params: JsonObject) {
  const issues = checkParams(params, SCENE_PARAM_SPECS[type]);
  if (type === 'mock-terminal-tour' && Array.isArray(params['areas'])) {
    for (const a of params['areas']) if (typeof a === 'string' && !TERMINAL_AREAS.includes(a)) issues.push({ path: 'parameters.areas', code: 'PARAM_VALUE', message: `unknown area ${a} (allowed: ${TERMINAL_AREAS.join(', ')})`, severity: 'error' });
  }
  return issues;
}

function makeRegistry(): SceneRegistry<SceneRenderer> {
  const defs = new Map<SceneType, SceneDef>();
  const reg: SceneRegistry<SceneRenderer> = {
    register(def) {
      if (!(SCENE_TYPES as readonly string[]).includes(def.type)) throw new Error(`unknown scene type ${def.type}`);
      if (defs.has(def.type)) throw new Error(`duplicate scene type ${def.type}`);
      defs.set(def.type, def);
    },
    get: (t) => defs.get(t),
    has: (t): t is SceneType => defs.has(t as SceneType),
    list: () => [...defs.keys()],
  };
  for (const type of SCENE_TYPES) {
    reg.register({
      type,
      version: '1.0.0',
      defaultDurationMs: 30_000,
      validateParameters: (params) => {
        try { return extraChecks(type, params); } catch { return [{ path: 'parameters', code: 'PARAM_CHECK_FAILED', message: 'parameter check failed', severity: 'error' }]; }
      },
      reducedMotionMode: type === 'text-card' ? 'text-only' : 'static-frame',
      render: RENDERERS[type],
    });
  }
  return reg;
}

export const sceneRegistry = makeRegistry();
