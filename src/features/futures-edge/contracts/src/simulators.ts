/**
 * Simulator id registry + educational-constants SHAPE (v1.1.0). Owner: EDGE-00 (ids/shape). EDGE-08 implements
 * every simulator and owns the constant VALUES in `features/futures-edge/simulation/constants.ts`.
 * Decisions D-12 (constants), D-13 (liquidation formula), D-14 (simulator ids).
 */
export const SIMULATOR_IDS = [
  'pair.convert',               // value in quote = quantity × price
  'price.percent-change',
  'ohlc.validate',              // high ≥ max(o,c), low ≤ min(o,c)
  'ohlc.anatomy',               // v1.3.0 (D-41): direction (declared doji threshold), body, wicks, range
  'price.linear-toy',           // v1.3.0 (D-47): T02 ILLUSTRATIVE toy model price = basePrice + stepPerLevel × (buyers − sellers); not a market model
  'ohlc.aggregate',             // 1m → 5m/15m
  'orders.fill',                // market/limit/stop fill, partial fill, slippage
  'pnl.linear',                 // spot + linear USDT-margined long/short gross PnL
  'fees.net',                   // gross → net with each side's fee on THAT side's notional, + spread/slippage
  'fees.estimate-round-trip',   // pre-trade estimate: entry notional × 2 × (fee + slippage)  [labelled "estimate"]
  'risk.reward',                // reward ÷ risk (not a win probability)
  'leverage.exposure',          // notional ≈ margin × leverage; gross PnL ≈ notional × signed move
  'liquidation.approx',         // canonical approximate liquidation (isolated + cross/collateral variant), approximate:true
  'funding.payment',            // notional × rate per interval; sign convention below
  'risk.position-size',         // allowed notional/size from risk budget and stop distance (optional costs, size step)
  'range.lookback',             // max, min, range % over a window
] as const;
export type SimulatorId = (typeof SIMULATOR_IDS)[number];

export function isSimulatorId(v: unknown): v is SimulatorId {
  return typeof v === 'string' && (SIMULATOR_IDS as readonly string[]).includes(v);
}

/**
 * Simulator input/output KEYS recorded so far (v1.3.0, D-47). EDGE-08 implements; content and widgets must use exactly
 * these names. A simulator can have several signatures (e.g. pair.convert both directions). Unlisted ids: keys pending.
 */
export interface SimulatorSignature { inputs: readonly string[]; outputs: readonly string[] }
export const SIMULATOR_KEYS: Partial<Record<SimulatorId, readonly SimulatorSignature[]>> = {
  'pair.convert': [
    { inputs: ['quantity', 'price'], outputs: ['quoteValue'] },      // quoteValue = quantity × price
    { inputs: ['quoteAmount', 'price'], outputs: ['quantity'] },     // quantity = quoteAmount ÷ price
  ],
  'price.percent-change': [{ inputs: ['oldPrice', 'newPrice'], outputs: ['percentChange'] }], // (new − old) ÷ old × 100
  'price.linear-toy': [{ inputs: ['buyers', 'sellers', 'basePrice', 'stepPerLevel'], outputs: ['price'] }],
};

/**
 * `parameters.model.kind` → simulator that evaluates the model (D-47). A widget that receives `model.kind` uses this
 * simulator for the model price, whatever the exercise's own `simulatorId` (e.g. T02-X01 grades percent change with
 * `price.percent-change`, its toy price comes from `price.linear-toy`). Toy models are ALWAYS labelled illustrative.
 */
export const MODEL_KIND_SIMULATORS = { 'linear-toy': 'price.linear-toy' } as const satisfies Record<string, SimulatorId>;
export type ModelKind = keyof typeof MODEL_KIND_SIMULATORS;

/**
 * `ohlc.anatomy` (v1.3.0, D-41). EDGE-08 implements; contracts fix the shape.
 *   body = |c − o| · upperWick = h − max(o, c) · lowerWick = min(o, c) − l · range = h − l
 *   invariant: body + upperWick + lowerWick = range (all ≥ 0).
 *   direction: 'doji' if body ≤ dojiThreshold.bodyToRangeMax × range (range 0 → 'doji'); else c > o 'bullish', c < o 'bearish'.
 * The threshold is always DECLARED by the caller (no hidden default) and echoed in the result. bodyToRangeMax = 0 means
 * "open equals close exactly" (what T14 teaches). Inconsistent OHLC → SimErrorCode 'INCONSISTENT_OHLC' (as ohlc.validate).
 */
export const CANDLE_DIRECTIONS = ['bullish', 'bearish', 'doji'] as const;
export type CandleDirection = (typeof CANDLE_DIRECTIONS)[number];
export interface DojiThreshold { bodyToRangeMax: number }
export interface OhlcAnatomyInput { o: number; h: number; l: number; c: number; dojiThreshold: DojiThreshold }
export interface OhlcAnatomyResult {
  direction: CandleDirection;
  body: number;
  upperWick: number;
  lowerWick: number;
  range: number;
  dojiThreshold: DojiThreshold;
}

/**
 * Shape of the shared ILLUSTRATIVE constants. All rates are fractions (0.0005 = 0.05%).
 * They are teaching assumptions, not current exchange rates and not recommendations.
 * Lesson text must quote the same numbers. Content __tests__ may import them from `@futures-edge/simulation`.
 */
export interface EducationalConstants {
  version: string;
  currency: 'USDT';
  demoSymbol: string;            // 'DEMOUSDT'
  demoPairDisplay: string;       // 'DEMO/USDT'
  takerFeeRatePerSide: number;
  makerFeeRatePerSide: number;
  slippageRatePerSideEstimate: number;
  fundingRatePerInterval: number;
  fundingIntervalHours: number;
  /** Positive funding rate: longs pay shorts. Negative: shorts pay longs. */
  fundingSignConvention: 'positive-longs-pay';
  maintenanceMarginRate: number;          // single flat tier, on entry notional
  illustrativeMarginTiers: readonly number[];
  liquidationFeeModel: 'consumes-remaining-maintenance-margin';
  /** Teaching examples ONLY (never presented as recommendations). */
  examples: {
    riskPerTrade: number;
    dailyLossLimit: number;
    maxTradesPerSession: number;
    consecutiveLossStop: number;
  };
  /** v1.3.0 (D-41), optional: default doji threshold EDGE-08 offers callers (body ≤ ratio × range). */
  dojiBodyToRangeMax?: number;
}
