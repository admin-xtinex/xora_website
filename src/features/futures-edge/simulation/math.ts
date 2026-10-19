/**
 * Pure, deterministic educational simulators (one per SIMULATOR_IDS entry).
 * No network, no clock, no randomness. Every function validates its inputs and returns a SimResult instead of
 * throwing, so a slider at an absurd value shows a message rather than NaN.
 */
import type {
  CandleDirection, OhlcAnatomyInput, OhlcAnatomyResult, SimErrorCode, SimResult, SimulatorId,
} from '@futures-edge/contracts';

export type Side = 'long' | 'short';

/** Values above this are rejected as slider overflow / nonsense input. */
export const MAX_INPUT = 1e12;

const fail = <O>(code: SimErrorCode, message: string, field?: string): SimResult<O> => ({
  ok: false,
  error: { code, message, ...(field ? { field } : {}) },
});
const ok = <O>(value: O, assumptions: string[] = [], approximate = false): SimResult<O> => ({ ok: true, value, assumptions, approximate });

type Check = { code: SimErrorCode; field: string; message: string } | null;

function num(field: string, v: unknown, rule: 'positive' | 'non-negative' | 'any' = 'positive'): Check {
  if (typeof v !== 'number' || !Number.isFinite(v)) return { code: 'NOT_A_NUMBER', field, message: `${field} must be a number` };
  if (Math.abs(v) > MAX_INPUT) return { code: 'OUT_OF_RANGE', field, message: `${field} is too large to be meaningful` };
  if (rule === 'positive' && v === 0) return { code: 'ZERO', field, message: `${field} cannot be zero` };
  if (rule !== 'any' && v < 0) return { code: 'NEGATIVE', field, message: `${field} cannot be negative` };
  return null;
}
function firstError(...checks: Check[]): Check {
  return checks.find((c) => c !== null) ?? null;
}
function sideOf(v: unknown): Side | null {
  return v === 'long' || v === 'short' ? v : null;
}
/** Round away float noise for display and comparisons (12 significant digits). */
export function clean(n: number): number {
  return Number.parseFloat(n.toPrecision(12));
}
const sign = (side: Side) => (side === 'long' ? 1 : -1);

// ------------------------------------------------------------------ pair.convert

export function pairConvert(i: { quantity: number; price: number }): SimResult<{ quoteValue: number }>;
export function pairConvert(i: { quoteAmount: number; price: number }): SimResult<{ quantity: number }>;
export function pairConvert(i: { quantity?: number; quoteAmount?: number; price: number }): SimResult<{ quoteValue: number } | { quantity: number }> {
  const pe = num('price', i.price);
  if (pe) return fail(pe.code, pe.message, pe.field);
  if (i.quantity !== undefined) {
    const e = num('quantity', i.quantity);
    if (e) return fail(e.code, e.message, e.field);
    return ok({ quoteValue: clean(i.quantity * i.price) }, ['value in quote = quantity × price', 'fees excluded']);
  }
  const e = num('quoteAmount', i.quoteAmount);
  if (e) return fail(e.code, e.message, e.field);
  return ok({ quantity: clean((i.quoteAmount as number) / i.price) }, ['quantity = quote amount ÷ price', 'fees excluded']);
}

// ------------------------------------------------------------------ price.percent-change

export function percentChange(i: { oldPrice: number; newPrice: number }): SimResult<{ percentChange: number }> {
  const e = firstError(num('oldPrice', i.oldPrice), num('newPrice', i.newPrice));
  if (e) return fail(e.code, e.message, e.field);
  return ok({ percentChange: clean(((i.newPrice - i.oldPrice) / i.oldPrice) * 100) });
}

// ------------------------------------------------------------------ price.linear-toy

export function linearToyPrice(i: { buyers: number; sellers: number; basePrice: number; stepPerLevel: number }): SimResult<{ price: number }> {
  const e = firstError(num('buyers', i.buyers, 'non-negative'), num('sellers', i.sellers, 'non-negative'), num('basePrice', i.basePrice), num('stepPerLevel', i.stepPerLevel, 'non-negative'));
  if (e) return fail(e.code, e.message, e.field);
  const price = i.basePrice + i.stepPerLevel * (i.buyers - i.sellers);
  if (price <= 0) return fail('OUT_OF_RANGE', 'the toy model went below zero; real prices cannot', 'price');
  return ok({ price: clean(price) }, ['illustrative toy model, not a model of a real market', 'price = base + step × (buyers − sellers)'], true);
}

// ------------------------------------------------------------------ OHLC

export interface Ohlc { o: number; h: number; l: number; c: number }
export interface OhlcCandle extends Ohlc { t: number; v?: number }

export function ohlcValidate(i: Ohlc): SimResult<{ valid: true }> {
  const e = firstError(num('o', i.o), num('h', i.h), num('l', i.l), num('c', i.c));
  if (e) return fail(e.code, e.message, e.field);
  if (i.h < Math.max(i.o, i.c)) return fail('INCONSISTENT_OHLC', 'high must be at least as large as both open and close', 'h');
  if (i.l > Math.min(i.o, i.c)) return fail('INCONSISTENT_OHLC', 'low must be at most as large as both open and close', 'l');
  return ok({ valid: true as const });
}

export function ohlcAnatomy(i: OhlcAnatomyInput): SimResult<OhlcAnatomyResult> {
  const v = ohlcValidate(i);
  if (!v.ok) return v;
  const t = i.dojiThreshold?.bodyToRangeMax;
  if (typeof t !== 'number' || !(t >= 0) || t >= 1) return fail('INVALID_INPUT', 'declare dojiThreshold.bodyToRangeMax in [0, 1)', 'dojiThreshold');
  const body = clean(Math.abs(i.c - i.o));
  const range = clean(i.h - i.l);
  const upperWick = clean(i.h - Math.max(i.o, i.c));
  const lowerWick = clean(Math.min(i.o, i.c) - i.l);
  const direction: CandleDirection = range === 0 || body <= t * range + 1e-12 ? 'doji' : i.c > i.o ? 'bullish' : 'bearish';
  return ok({ direction, body, upperWick, lowerWick, range, dojiThreshold: { bodyToRangeMax: t } });
}

/**
 * Aggregate consecutive candles into groups of `groupSize` (e.g. five 1-minute candles → one 5-minute candle).
 * open = first open, high = max high, low = min low, close = last close, volume = sum. A trailing partial group
 * is returned flagged `partial` so the UI never pretends an unfinished candle is complete.
 */
export function ohlcAggregate(i: { candles: OhlcCandle[]; groupSize: number }): SimResult<{ candles: Array<OhlcCandle & { partial: boolean }> }> {
  if (!Array.isArray(i.candles) || i.candles.length === 0) return fail('INVALID_INPUT', 'at least one candle is needed', 'candles');
  const g = num('groupSize', i.groupSize);
  if (g) return fail(g.code, g.message, g.field);
  if (!Number.isInteger(i.groupSize)) return fail('INVALID_INPUT', 'groupSize must be a whole number', 'groupSize');
  for (const [k, c] of i.candles.entries()) {
    const r = ohlcValidate(c);
    if (!r.ok) return fail(r.error.code, `candle ${k + 1}: ${r.error.message}`, 'candles');
  }
  const out: Array<OhlcCandle & { partial: boolean }> = [];
  for (let s = 0; s < i.candles.length; s += i.groupSize) {
    const grp = i.candles.slice(s, s + i.groupSize);
    const first = grp[0] as OhlcCandle;
    const last = grp[grp.length - 1] as OhlcCandle;
    const hasVol = grp.every((c) => typeof c.v === 'number');
    out.push({
      t: first.t,
      o: first.o,
      h: Math.max(...grp.map((c) => c.h)),
      l: Math.min(...grp.map((c) => c.l)),
      c: last.c,
      ...(hasVol ? { v: clean(grp.reduce((n, c) => n + (c.v ?? 0), 0)) } : {}),
      partial: grp.length < i.groupSize,
    });
  }
  return ok({ candles: out }, ['open = first open, high = highest high, low = lowest low, close = last close']);
}

// ------------------------------------------------------------------ orders.fill

export interface BookLevel { price: number; quantity: number }
export interface FillInput {
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop-market' | 'stop-limit';
  quantity: number;
  /** Opposite side of the book, best price first (asks for a buy, bids for a sell). */
  book: BookLevel[];
  limitPrice?: number;
  triggerPrice?: number;
  /** Last traded price sequence used to decide whether a stop triggers. */
  lastPrice?: number;
}
export interface FillOutput {
  triggered: boolean;
  filledQuantity: number;
  remainingQuantity: number;
  averagePrice: number | null;
  fills: BookLevel[];
  /** Average fill minus best available price at the moment of the order (buy), or the reverse (sell). ≥ 0 means worse. */
  slippagePerUnit: number | null;
  status: 'filled' | 'partial' | 'unfilled' | 'not-triggered';
}

export function ordersFill(i: FillInput): SimResult<FillOutput> {
  const q = num('quantity', i.quantity);
  if (q) return fail(q.code, q.message, q.field);
  if (!Array.isArray(i.book)) return fail('INVALID_INPUT', 'book must be a list of price levels', 'book');
  for (const l of i.book) {
    const e = firstError(num('book.price', l.price), num('book.quantity', l.quantity));
    if (e) return fail(e.code, e.message, e.field);
  }
  const isBuy = i.side === 'buy';
  if (i.type === 'stop-market' || i.type === 'stop-limit') {
    const e = firstError(num('triggerPrice', i.triggerPrice), num('lastPrice', i.lastPrice));
    if (e) return fail(e.code, e.message, e.field);
  }
  if (i.type === 'limit' || i.type === 'stop-limit') {
    const e = num('limitPrice', i.limitPrice);
    if (e) return fail(e.code, e.message, e.field);
  }
  const empty: FillOutput = { triggered: false, filledQuantity: 0, remainingQuantity: i.quantity, averagePrice: null, fills: [], slippagePerUnit: null, status: 'not-triggered' };
  if (i.type === 'stop-market' || i.type === 'stop-limit') {
    // A buy stop triggers when price rises to the trigger; a sell stop when it falls to it.
    const hit = isBuy ? (i.lastPrice as number) >= (i.triggerPrice as number) : (i.lastPrice as number) <= (i.triggerPrice as number);
    if (!hit) return ok(empty, ['a stop order waits until the trigger price trades']);
  }
  const best = i.book[0]?.price;
  const limit = i.type === 'limit' || i.type === 'stop-limit' ? (i.limitPrice as number) : undefined;
  let remaining = i.quantity;
  const fills: BookLevel[] = [];
  for (const lvl of i.book) {
    if (remaining <= 0) break;
    if (limit !== undefined && (isBuy ? lvl.price > limit : lvl.price < limit)) break;
    const take = Math.min(remaining, lvl.quantity);
    fills.push({ price: lvl.price, quantity: clean(take) });
    remaining = clean(remaining - take);
  }
  const filled = clean(i.quantity - remaining);
  const avg = filled > 0 ? clean(fills.reduce((n, f) => n + f.price * f.quantity, 0) / filled) : null;
  const slip = avg !== null && best !== undefined ? clean(isBuy ? avg - best : best - avg) : null;
  const status: FillOutput['status'] = filled === 0 ? 'unfilled' : remaining > 0 ? 'partial' : 'filled';
  const assumptions = ['fictional order book', 'fees excluded'];
  if (i.type === 'market' || i.type === 'stop-market') assumptions.push('a market order takes the best available prices, which can be worse than the last price');
  if (limit !== undefined) assumptions.push('a limit order never fills at a worse price than its limit, but it may not fill at all');
  return ok({ triggered: true, filledQuantity: filled, remainingQuantity: remaining, averagePrice: avg, fills, slippagePerUnit: slip, status }, assumptions);
}

// ------------------------------------------------------------------ pnl.linear

export function pnlLinear(i: { side: Side; entry: number; exit: number; quantity: number }): SimResult<{ grossPnl: number; priceChange: number; percentMove: number; entryNotional: number }> {
  const s = sideOf(i.side);
  if (!s) return fail('INVALID_INPUT', 'side must be long or short', 'side');
  const e = firstError(num('entry', i.entry), num('exit', i.exit), num('quantity', i.quantity));
  if (e) return fail(e.code, e.message, e.field);
  const priceChange = clean(i.exit - i.entry);
  return ok(
    {
      grossPnl: clean(sign(s) * priceChange * i.quantity),
      priceChange,
      percentMove: clean((priceChange / i.entry) * 100),
      entryNotional: clean(i.entry * i.quantity),
    },
    ['gross result before fees and funding', 'linear USDT-margined model (spot buy-then-sell behaves like a long)'],
  );
}

// ------------------------------------------------------------------ fees

export interface FeesNetInput {
  side: Side;
  entry: number;
  exit: number;
  quantity: number;
  entryFeeRate: number;
  exitFeeRate: number;
  /** Optional extra costs in USDT (e.g. half-spread crossed twice, slippage), already estimated. */
  spreadCost?: number;
  slippageCost?: number;
}
export function feesNet(i: FeesNetInput): SimResult<{ grossPnl: number; entryFee: number; exitFee: number; otherCosts: number; totalCosts: number; netPnl: number }> {
  const g = pnlLinear(i);
  if (!g.ok) return g;
  const e = firstError(
    num('entryFeeRate', i.entryFeeRate, 'non-negative'), num('exitFeeRate', i.exitFeeRate, 'non-negative'),
    i.spreadCost === undefined ? null : num('spreadCost', i.spreadCost, 'non-negative'),
    i.slippageCost === undefined ? null : num('slippageCost', i.slippageCost, 'non-negative'),
  );
  if (e) return fail(e.code, e.message, e.field);
  if (i.entryFeeRate > 0.1 || i.exitFeeRate > 0.1) return fail('OUT_OF_RANGE', 'fee rates above 10% per side are not realistic', 'entryFeeRate');
  const entryFee = clean(i.entry * i.quantity * i.entryFeeRate);
  const exitFee = clean(i.exit * i.quantity * i.exitFeeRate);
  const otherCosts = clean((i.spreadCost ?? 0) + (i.slippageCost ?? 0));
  const totalCosts = clean(entryFee + exitFee + otherCosts);
  return ok(
    { grossPnl: g.value.grossPnl, entryFee, exitFee, otherCosts, totalCosts, netPnl: clean(g.value.grossPnl - totalCosts) },
    ['each fee is charged on that side’s notional (price × quantity)', 'funding excluded', 'illustrative rates; check your own account'],
  );
}

export function feesEstimateRoundTrip(i: { notional: number; feeRate: number; slippageRate: number }): SimResult<{ estimate: number }> {
  const e = firstError(num('notional', i.notional), num('feeRate', i.feeRate, 'non-negative'), num('slippageRate', i.slippageRate, 'non-negative'));
  if (e) return fail(e.code, e.message, e.field);
  return ok({ estimate: clean(i.notional * 2 * (i.feeRate + i.slippageRate)) }, ['pre-trade ESTIMATE: entry notional × 2 × (fee + slippage)', 'exit notional assumed equal to entry'], true);
}

/** Break-even exit price after both fees (each on its own side's notional). */
export function breakEvenPrice(i: { side: Side; entry: number; entryFeeRate: number; exitFeeRate: number }): SimResult<{ breakEven: number; movePercent: number }> {
  const s = sideOf(i.side);
  if (!s) return fail('INVALID_INPUT', 'side must be long or short', 'side');
  const e = firstError(num('entry', i.entry), num('entryFeeRate', i.entryFeeRate, 'non-negative'), num('exitFeeRate', i.exitFeeRate, 'non-negative'));
  if (e) return fail(e.code, e.message, e.field);
  if (s === 'short' && i.exitFeeRate >= 1) return fail('OUT_OF_RANGE', 'exit fee rate too large', 'exitFeeRate');
  // long: x(1 − fx) = e(1 + fe) ; short: x(1 + fx) = e(1 − fe)
  const be = s === 'long' ? (i.entry * (1 + i.entryFeeRate)) / (1 - i.exitFeeRate) : (i.entry * (1 - i.entryFeeRate)) / (1 + i.exitFeeRate);
  return ok({ breakEven: clean(be), movePercent: clean(((be - i.entry) / i.entry) * 100) }, ['fees only; spread, slippage and funding excluded']);
}

// ------------------------------------------------------------------ risk.reward

export function riskReward(i: { side: Side; entry: number; stop: number; target: number; quantity?: number }): SimResult<{ riskPerUnit: number; rewardPerUnit: number; ratio: number; risk: number | null; reward: number | null }> {
  const s = sideOf(i.side);
  if (!s) return fail('INVALID_INPUT', 'side must be long or short', 'side');
  const e = firstError(num('entry', i.entry), num('stop', i.stop), num('target', i.target), i.quantity === undefined ? null : num('quantity', i.quantity));
  if (e) return fail(e.code, e.message, e.field);
  if (s === 'long' && i.stop >= i.entry) return fail('WRONG_SIDE', 'for a long, the stop-loss must be below the entry', 'stop');
  if (s === 'short' && i.stop <= i.entry) return fail('WRONG_SIDE', 'for a short, the stop-loss must be above the entry', 'stop');
  if (s === 'long' && i.target <= i.entry) return fail('WRONG_SIDE', 'for a long, the take-profit must be above the entry', 'target');
  if (s === 'short' && i.target >= i.entry) return fail('WRONG_SIDE', 'for a short, the take-profit must be below the entry', 'target');
  const riskPerUnit = clean(Math.abs(i.entry - i.stop));
  const rewardPerUnit = clean(Math.abs(i.target - i.entry));
  return ok(
    {
      riskPerUnit, rewardPerUnit, ratio: clean(rewardPerUnit / riskPerUnit),
      risk: i.quantity === undefined ? null : clean(riskPerUnit * i.quantity),
      reward: i.quantity === undefined ? null : clean(rewardPerUnit * i.quantity),
    },
    ['planned amounts before fees', 'stops can slip and targets may not fill', 'a ratio is NOT a probability of winning'],
  );
}

// ------------------------------------------------------------------ leverage.exposure

export const MAX_TEACHING_LEVERAGE = 125;

export function leverageExposure(i: { side: Side; margin: number; leverage: number; movePercent: number }): SimResult<{ notional: number; grossPnl: number; returnOnMarginPercent: number; marginUsedUp: boolean }> {
  const s = sideOf(i.side);
  if (!s) return fail('INVALID_INPUT', 'side must be long or short', 'side');
  const e = firstError(num('margin', i.margin), num('leverage', i.leverage), num('movePercent', i.movePercent, 'any'));
  if (e) return fail(e.code, e.message, e.field);
  if (i.leverage < 1) return fail('OUT_OF_RANGE', 'leverage below 1× is not leverage', 'leverage');
  if (i.leverage > MAX_TEACHING_LEVERAGE) return fail('OUT_OF_RANGE', `leverage above ${MAX_TEACHING_LEVERAGE}× is outside this model`, 'leverage');
  if (i.movePercent <= -100) return fail('OUT_OF_RANGE', 'a price cannot fall 100% or more', 'movePercent');
  const notional = clean(i.margin * i.leverage);
  const grossPnl = clean((sign(s) * notional * i.movePercent) / 100);
  return ok(
    { notional, grossPnl, returnOnMarginPercent: clean((grossPnl / i.margin) * 100), marginUsedUp: grossPnl <= -i.margin },
    ['simplified linear contract', 'fees, funding and the exchange’s liquidation rules are ignored', 'liquidation happens BEFORE the margin is fully used up'],
    true,
  );
}

// ------------------------------------------------------------------ liquidation.approx

/**
 * Canonical approximate liquidation price (D-13). Isolated: long ≈ entry × (1 − 1/L + MMR), short ≈ entry × (1 + 1/L − MMR).
 * Collateral variant: pass `collateral` and `quantity` — 1/L is replaced by collateral ÷ entry notional.
 * mmr = 0 gives the "margin used up" price (liquidation happens before it).
 */
export function liquidationApprox(i: { side: Side; entry: number; leverage?: number; mmr: number; collateral?: number; quantity?: number }): SimResult<{ liquidationPrice: number; distancePercent: number }> {
  const s = sideOf(i.side);
  if (!s) return fail('INVALID_INPUT', 'side must be long or short', 'side');
  const e = firstError(num('entry', i.entry), num('mmr', i.mmr, 'non-negative'));
  if (e) return fail(e.code, e.message, e.field);
  let inv: number;
  if (i.collateral !== undefined || i.quantity !== undefined) {
    const ce = firstError(num('collateral', i.collateral), num('quantity', i.quantity));
    if (ce) return fail(ce.code, ce.message, ce.field);
    inv = (i.collateral as number) / (i.entry * (i.quantity as number));
  } else {
    const le = num('leverage', i.leverage);
    if (le) return fail(le.code, le.message, le.field);
    if ((i.leverage as number) < 1) return fail('OUT_OF_RANGE', 'leverage must be at least 1×', 'leverage');
    if ((i.leverage as number) > MAX_TEACHING_LEVERAGE) return fail('OUT_OF_RANGE', `leverage above ${MAX_TEACHING_LEVERAGE}× is outside this model`, 'leverage');
    inv = 1 / (i.leverage as number);
  }
  if (i.mmr >= inv) return fail('OUT_OF_RANGE', 'maintenance margin rate must be smaller than the margin fraction (1/L)', 'mmr');
  const f = s === 'long' ? 1 - inv + i.mmr : 1 + inv - i.mmr;
  const liq = clean(i.entry * f);
  if (liq <= 0) {
    return ok({ liquidationPrice: 0, distancePercent: -100 }, ['collateral covers a fall to zero in this simplified model'], true);
  }
  return ok(
    { liquidationPrice: liq, distancePercent: clean(((liq - i.entry) / i.entry) * 100) },
    ['APPROXIMATE: fees, funding, margin tiers, other positions and mark-vs-last price are ignored', 'the real exchange price can differ'],
    true,
  );
}

// ------------------------------------------------------------------ funding.payment

/** Positive rate: longs pay shorts. Returns the signed amount this position PAYS (negative = receives). */
export function fundingPayment(i: { side: Side; notional: number; rate: number; intervals?: number }): SimResult<{ paymentPerInterval: number; total: number }> {
  const s = sideOf(i.side);
  if (!s) return fail('INVALID_INPUT', 'side must be long or short', 'side');
  const e = firstError(num('notional', i.notional), num('rate', i.rate, 'any'), i.intervals === undefined ? null : num('intervals', i.intervals, 'non-negative'));
  if (e) return fail(e.code, e.message, e.field);
  if (Math.abs(i.rate) > 0.05) return fail('OUT_OF_RANGE', 'funding rates above 5% per interval are outside this model', 'rate');
  const per = clean(sign(s) * i.notional * i.rate);
  return ok({ paymentPerInterval: per, total: clean(per * (i.intervals ?? 1)) }, ['positive rate: longs pay shorts; negative rate: shorts pay longs', 'rates change every interval in real markets']);
}

// ------------------------------------------------------------------ risk.position-size

export interface PositionSizeInput {
  side: Side;
  riskAmount: number;
  entry: number;
  stop: number;
  /** Optional: extra cost per unit (fees + expected slippage) added to the stop distance. */
  costPerUnit?: number;
  /** Optional: quantity step; the size is rounded DOWN to it. */
  sizeStep?: number;
  /** Optional: account balance, only used for warnings. */
  accountBalance?: number;
}
export function positionSize(i: PositionSizeInput): SimResult<{ stopDistance: number; stopDistancePercent: number; quantity: number; notional: number; impliedLeverage: number | null }> {
  const s = sideOf(i.side);
  if (!s) return fail('INVALID_INPUT', 'side must be long or short', 'side');
  const e = firstError(
    num('riskAmount', i.riskAmount), num('entry', i.entry), num('stop', i.stop),
    i.costPerUnit === undefined ? null : num('costPerUnit', i.costPerUnit, 'non-negative'),
    i.sizeStep === undefined ? null : num('sizeStep', i.sizeStep),
    i.accountBalance === undefined ? null : num('accountBalance', i.accountBalance),
  );
  if (e) return fail(e.code, e.message, e.field);
  if (s === 'long' && i.stop >= i.entry) return fail('WRONG_SIDE', 'for a long, the stop must be below the entry', 'stop');
  if (s === 'short' && i.stop <= i.entry) return fail('WRONG_SIDE', 'for a short, the stop must be above the entry', 'stop');
  if (i.accountBalance !== undefined && i.riskAmount > i.accountBalance) return fail('OUT_OF_RANGE', 'the risk amount cannot be larger than the account balance', 'riskAmount');
  const stopDistance = clean(Math.abs(i.entry - i.stop));
  const perUnit = stopDistance + (i.costPerUnit ?? 0);
  if (perUnit === 0) return fail('DIVIDE_BY_ZERO', 'stop distance is zero', 'stop');
  let quantity = i.riskAmount / perUnit;
  if (i.sizeStep !== undefined) {
    quantity = Math.floor(clean(quantity / i.sizeStep)) * i.sizeStep;
    if (quantity <= 0) return fail('OUT_OF_RANGE', 'the allowed size is smaller than one size step: the trade does not fit the risk budget', 'sizeStep');
  }
  quantity = clean(quantity);
  const notional = clean(quantity * i.entry);
  return ok(
    {
      stopDistance,
      stopDistancePercent: clean((stopDistance / i.entry) * 100),
      quantity,
      notional,
      impliedLeverage: i.accountBalance === undefined ? null : clean(notional / i.accountBalance),
    },
    ['simple model: allowed notional ≈ risk ÷ (|entry − stop| ÷ entry)', 'stops can slip, so the real loss can be larger', 'contract limits and liquidation are not modelled'],
    true,
  );
}

// ------------------------------------------------------------------ range.lookback

export function rangeLookback(i: { candles: Array<{ h: number; l: number; c?: number }>; window: number; endIndex?: number }): SimResult<{ max: number; min: number; range: number; rangePercent: number; startIndex: number; endIndex: number }> {
  if (!Array.isArray(i.candles) || i.candles.length === 0) return fail('INVALID_INPUT', 'at least one candle is needed', 'candles');
  const w = num('window', i.window);
  if (w) return fail(w.code, w.message, w.field);
  if (!Number.isInteger(i.window)) return fail('INVALID_INPUT', 'window must be a whole number of candles', 'window');
  const end = i.endIndex ?? i.candles.length - 1;
  if (!Number.isInteger(end) || end < 0 || end >= i.candles.length) return fail('OUT_OF_RANGE', 'endIndex is outside the series', 'endIndex');
  if (i.window > end + 1) return fail('OUT_OF_RANGE', 'the window is longer than the data available', 'window');
  const start = end - i.window + 1;
  const slice = i.candles.slice(start, end + 1);
  for (const c of slice) {
    const e = firstError(num('h', c.h), num('l', c.l));
    if (e) return fail(e.code, e.message, e.field);
  }
  const max = Math.max(...slice.map((c) => c.h));
  const min = Math.min(...slice.map((c) => c.l));
  return ok(
    { max, min, range: clean(max - min), rangePercent: clean(((max - min) / min) * 100), startIndex: start, endIndex: end },
    ['range % = (highest high − lowest low) ÷ lowest low × 100', 'a past range does not predict the next one'],
  );
}

// ------------------------------------------------------------------ generic numeric adapter (formula goldens)

type NumMap = Readonly<Record<string, number>>;
/**
 * Runs a simulator from a flat number map (as stored in `Formula.workedExamples`) and returns its numeric outputs.
 * Used by tests to recompute every authored worked example.
 */
export function runSimulator(id: SimulatorId, inputs: NumMap, side?: Side): SimResult<Record<string, number>> {
  const sd = side ?? 'long';
  const pick = <T extends object>(r: SimResult<T>): SimResult<Record<string, number>> => {
    if (!r.ok) return r;
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(r.value)) if (typeof v === 'number') out[k] = v;
    return { ...r, value: out };
  };
  const g = (k: string) => inputs[k] as number;
  switch (id) {
    case 'pair.convert':
      return 'quantity' in inputs ? pick(pairConvert({ quantity: g('quantity'), price: g('price') })) : pick(pairConvert({ quoteAmount: g('quoteAmount'), price: g('price') }));
    case 'price.percent-change': return pick(percentChange({ oldPrice: g('oldPrice'), newPrice: g('newPrice') }));
    case 'price.linear-toy': return pick(linearToyPrice({ buyers: g('buyers'), sellers: g('sellers'), basePrice: g('basePrice'), stepPerLevel: g('stepPerLevel') }));
    case 'ohlc.validate': {
      const r = ohlcValidate({ o: g('o'), h: g('h'), l: g('l'), c: g('c') });
      return r.ok ? { ...r, value: { valid: 1 } } : r;
    }
    case 'ohlc.anatomy': return pick(ohlcAnatomy({ o: g('o'), h: g('h'), l: g('l'), c: g('c'), dojiThreshold: { bodyToRangeMax: inputs['bodyToRangeMax'] ?? 0 } }));
    case 'ohlc.aggregate': {
      // Flat form: o1,h1,l1,c1 … oN,hN,lN,cN + groupSize → o,h,l,c of the first group.
      const n = Object.keys(inputs).filter((k) => /^o\d+$/.test(k)).length;
      const candles: OhlcCandle[] = Array.from({ length: n }, (_, k) => ({ t: k * 60_000, o: g(`o${k + 1}`), h: g(`h${k + 1}`), l: g(`l${k + 1}`), c: g(`c${k + 1}`) }));
      const r = ohlcAggregate({ candles, groupSize: g('groupSize') });
      if (!r.ok) return r;
      const c0 = r.value.candles[0] as OhlcCandle;
      return { ...r, value: { o: c0.o, h: c0.h, l: c0.l, c: c0.c } };
    }
    case 'orders.fill': {
      // Flat form: quantity, p1,q1 … pN,qN (+ limitPrice) for a buy.
      const n = Object.keys(inputs).filter((k) => /^p\d+$/.test(k)).length;
      const book = Array.from({ length: n }, (_, k) => ({ price: g(`p${k + 1}`), quantity: g(`q${k + 1}`) }));
      const r = ordersFill({ side: side === 'short' ? 'sell' : 'buy', type: 'limitPrice' in inputs ? 'limit' : 'market', quantity: g('quantity'), book, ...('limitPrice' in inputs ? { limitPrice: g('limitPrice') } : {}) });
      if (!r.ok) return r;
      return { ...r, value: { filledQuantity: r.value.filledQuantity, remainingQuantity: r.value.remainingQuantity, ...(r.value.averagePrice !== null ? { averagePrice: r.value.averagePrice } : {}), ...(r.value.slippagePerUnit !== null ? { slippagePerUnit: r.value.slippagePerUnit } : {}) } };
    }
    case 'pnl.linear': return pick(pnlLinear({ side: sd, entry: g('entry'), exit: g('exit'), quantity: g('quantity') }));
    case 'fees.net':
      if (!('exit' in inputs)) return pick(breakEvenPrice({ side: sd, entry: g('entry'), entryFeeRate: g('entryFeeRate'), exitFeeRate: g('exitFeeRate') }));
      return pick(feesNet({ side: sd, entry: g('entry'), exit: g('exit'), quantity: g('quantity'), entryFeeRate: g('entryFeeRate'), exitFeeRate: g('exitFeeRate'), ...('spreadCost' in inputs ? { spreadCost: g('spreadCost') } : {}), ...('slippageCost' in inputs ? { slippageCost: g('slippageCost') } : {}) }));
    case 'fees.estimate-round-trip': return pick(feesEstimateRoundTrip({ notional: g('notional'), feeRate: g('feeRate'), slippageRate: g('slippageRate') }));
    case 'risk.reward': return pick(riskReward({ side: sd, entry: g('entry'), stop: g('stop'), target: g('target'), ...('quantity' in inputs ? { quantity: g('quantity') } : {}) }));
    case 'leverage.exposure': return pick(leverageExposure({ side: sd, margin: g('margin'), leverage: g('leverage'), movePercent: g('movePercent') }));
    case 'liquidation.approx': return pick(liquidationApprox({ side: sd, entry: g('entry'), mmr: g('mmr'), ...('collateral' in inputs ? { collateral: g('collateral'), quantity: g('quantity') } : { leverage: g('leverage') }) }));
    case 'funding.payment': return pick(fundingPayment({ side: sd, notional: g('notional'), rate: g('rate'), ...('intervals' in inputs ? { intervals: g('intervals') } : {}) }));
    case 'risk.position-size': return pick(positionSize({ side: sd, riskAmount: g('riskAmount'), entry: g('entry'), stop: g('stop'), ...('costPerUnit' in inputs ? { costPerUnit: g('costPerUnit') } : {}), ...('sizeStep' in inputs ? { sizeStep: g('sizeStep') } : {}), ...('accountBalance' in inputs ? { accountBalance: g('accountBalance') } : {}) }));
    case 'range.lookback': {
      const n = Object.keys(inputs).filter((k) => /^h\d+$/.test(k)).length;
      const candles = Array.from({ length: n }, (_, k) => ({ h: g(`h${k + 1}`), l: g(`l${k + 1}`) }));
      return pick(rangeLookback({ candles, window: g('window') }));
    }
  }
}
