/** Formula and edge-case tests for every educational simulator. All numbers are fictional. */
import { describe, expect, it } from 'vitest';
import { SIMULATOR_IDS, validateOhlcAnatomyResult } from '@futures-edge/contracts';
import {
  breakEvenPrice, feesEstimateRoundTrip, feesNet, fundingPayment, leverageExposure, linearToyPrice, liquidationApprox, MAX_INPUT,
  ohlcAggregate, ohlcAnatomy, ohlcValidate, ordersFill, pairConvert, percentChange, pnlLinear, positionSize, rangeLookback, riskReward, runSimulator,
} from '../simulation/math';
import { EDUCATIONAL_CONSTANTS as K } from '../simulation/constants';

const val = <T,>(r: { ok: true; value: T } | { ok: false; error: { code: string; message: string } }): T => {
  if (!r.ok) throw new Error(`${r.error.code}: ${r.error.message}`);
  return r.value;
};
const code = (r: { ok: boolean; error?: { code: string } }) => (r.ok ? 'OK' : r.error?.code);

describe('constants (D-12 baseline)', () => {
  it('match the published teaching values', () => {
    expect(K.takerFeeRatePerSide).toBe(0.0005);
    expect(K.makerFeeRatePerSide).toBe(0.0002);
    expect(K.slippageRatePerSideEstimate).toBe(0.0002);
    expect(K.fundingRatePerInterval).toBe(0.0001);
    expect(K.fundingIntervalHours).toBe(8);
    expect(K.maintenanceMarginRate).toBe(0.005);
    expect(K.illustrativeMarginTiers).toEqual([0.005, 0.01, 0.025]);
    expect(K.examples).toEqual({ riskPerTrade: 0.01, dailyLossLimit: 0.03, maxTradesPerSession: 5, consecutiveLossStop: 2 });
    expect(K.demoPairDisplay).toBe('DEMO/USDT');
  });
});

describe('pair.convert and percent change', () => {
  it('value = quantity × price, and back', () => {
    expect(val(pairConvert({ quantity: 0.002, price: 60_000 })).quoteValue).toBe(120);
    expect(val(pairConvert({ quoteAmount: 120, price: 60_000 })).quantity).toBe(0.002);
    expect(val(pairConvert({ quantity: 1, price: 60_000 })).quoteValue).toBe(60_000);
    expect(val(pairConvert({ quantity: 0.001, price: 60_000 })).quoteValue).toBe(60);
  });
  it('rejects zero price, negative quantity, overflow and NaN', () => {
    expect(code(pairConvert({ quantity: 1, price: 0 }))).toBe('ZERO');
    expect(code(pairConvert({ quantity: -1, price: 10 }))).toBe('NEGATIVE');
    expect(code(pairConvert({ quantity: MAX_INPUT * 10, price: 10 }))).toBe('OUT_OF_RANGE');
    expect(code(pairConvert({ quantity: Number.NaN, price: 10 }))).toBe('NOT_A_NUMBER');
  });
  it('percent change', () => {
    expect(val(percentChange({ oldPrice: 100, newPrice: 103 })).percentChange).toBe(3);
    expect(val(percentChange({ oldPrice: 200, newPrice: 190 })).percentChange).toBe(-5);
    expect(code(percentChange({ oldPrice: 0, newPrice: 1 }))).toBe('ZERO');
  });
  it('linear toy model is labelled approximate and refuses negative prices', () => {
    const r = linearToyPrice({ buyers: 8, sellers: 3, basePrice: 100, stepPerLevel: 0.5 });
    expect(val(r).price).toBe(102.5);
    expect(r.ok && r.approximate).toBe(true);
    expect(code(linearToyPrice({ buyers: 0, sellers: 500, basePrice: 10, stepPerLevel: 1 }))).toBe('OUT_OF_RANGE');
  });
});

describe('OHLC', () => {
  it('validate enforces high ≥ max(o,c) and low ≤ min(o,c)', () => {
    expect(code(ohlcValidate({ o: 100, h: 101, l: 99, c: 100.5 }))).toBe('OK');
    expect(code(ohlcValidate({ o: 100, h: 100.2, l: 99, c: 100.5 }))).toBe('INCONSISTENT_OHLC');
    expect(code(ohlcValidate({ o: 100, h: 101, l: 100.1, c: 100.5 }))).toBe('INCONSISTENT_OHLC');
    expect(code(ohlcValidate({ o: 0, h: 1, l: 0, c: 1 }))).toBe('ZERO');
  });
  it('anatomy: body + wicks = range; direction from close vs open', () => {
    const input = { o: 100, h: 101.2, l: 99.4, c: 100.8 };
    const a = val(ohlcAnatomy({ ...input, dojiThreshold: { bodyToRangeMax: 0 } }));
    expect(a).toMatchObject({ direction: 'bullish', body: 0.8, upperWick: 0.4, lowerWick: 0.6, range: 1.8 });
    expect(validateOhlcAnatomyResult(input, a).ok).toBe(true);
    expect(val(ohlcAnatomy({ o: 101.1, h: 101.2, l: 100.2, c: 100.4, dojiThreshold: { bodyToRangeMax: 0 } })).direction).toBe('bearish');
    expect(val(ohlcAnatomy({ o: 100.4, h: 100.9, l: 99.6, c: 100.4, dojiThreshold: { bodyToRangeMax: 0 } })).direction).toBe('doji');
    expect(val(ohlcAnatomy({ o: 100, h: 100, l: 100, c: 100, dojiThreshold: { bodyToRangeMax: 0 } })).direction).toBe('doji');
    expect(code(ohlcAnatomy({ o: 100, h: 101, l: 99, c: 100, dojiThreshold: { bodyToRangeMax: 1 } }))).toBe('INVALID_INPUT');
  });
  it('aggregates five 1m candles into one 5m candle (first open, max high, min low, last close, summed volume)', () => {
    const m = [
      { t: 0, o: 100, h: 100.6, l: 99.8, c: 100.4, v: 10 },
      { t: 60_000, o: 100.4, h: 101.0, l: 100.1, c: 100.9, v: 12 },
      { t: 120_000, o: 100.9, h: 101.3, l: 100.2, c: 100.3, v: 8 },
      { t: 180_000, o: 100.3, h: 100.5, l: 99.5, c: 99.7, v: 20 },
      { t: 240_000, o: 99.7, h: 100.2, l: 99.6, c: 100.1, v: 5 },
      { t: 300_000, o: 100.1, h: 100.4, l: 99.9, c: 100.2, v: 7 },
    ];
    const r = val(ohlcAggregate({ candles: m, groupSize: 5 })).candles;
    expect(r).toHaveLength(2);
    expect(r[0]).toEqual({ t: 0, o: 100, h: 101.3, l: 99.5, c: 100.1, v: 55, partial: false });
    expect(r[1]).toMatchObject({ o: 100.1, c: 100.2, partial: true });
    // groupSize 1 is the identity
    expect(val(ohlcAggregate({ candles: m, groupSize: 1 })).candles.map(({ partial: _p, ...c }) => c)).toEqual(m);
    // 15m over 15 candles = one candle containing all extremes
    const fifteen = Array.from({ length: 15 }, (_, k) => ({ t: k * 60_000, o: 100 + k, h: 101 + k, l: 99 + k, c: 100.5 + k }));
    expect(val(ohlcAggregate({ candles: fifteen, groupSize: 15 })).candles[0]).toMatchObject({ o: 100, h: 115, l: 99, c: 114.5, partial: false });
  });
  it('aggregation rejects bad input', () => {
    expect(code(ohlcAggregate({ candles: [], groupSize: 5 }))).toBe('INVALID_INPUT');
    expect(code(ohlcAggregate({ candles: [{ t: 0, o: 1, h: 2, l: 0.5, c: 1.5 }], groupSize: 0 }))).toBe('ZERO');
    expect(code(ohlcAggregate({ candles: [{ t: 0, o: 1, h: 2, l: 0.5, c: 1.5 }], groupSize: 2.5 }))).toBe('INVALID_INPUT');
    expect(code(ohlcAggregate({ candles: [{ t: 0, o: 1, h: 1.2, l: 0.5, c: 1.5 }], groupSize: 1 }))).toBe('INCONSISTENT_OHLC');
  });
});

describe('orders.fill', () => {
  const asks = [{ price: 100.0, quantity: 1 }, { price: 100.2, quantity: 2 }, { price: 100.5, quantity: 5 }];
  it('market buy sweeps the book and reports slippage', () => {
    const r = val(ordersFill({ side: 'buy', type: 'market', quantity: 2, book: asks }));
    expect(r).toMatchObject({ status: 'filled', filledQuantity: 2, averagePrice: 100.1, slippagePerUnit: 0.1 });
  });
  it('limit buy never pays above its limit and can partially fill', () => {
    const r = val(ordersFill({ side: 'buy', type: 'limit', quantity: 4, limitPrice: 100.2, book: asks }));
    expect(r).toMatchObject({ status: 'partial', filledQuantity: 3, remainingQuantity: 1 });
    expect(r.averagePrice).toBeCloseTo((100 + 200.4) / 3, 9);
    expect(val(ordersFill({ side: 'buy', type: 'limit', quantity: 1, limitPrice: 99, book: asks })).status).toBe('unfilled');
  });
  it('a market order on an empty book does not fill', () => {
    expect(val(ordersFill({ side: 'sell', type: 'market', quantity: 1, book: [] })).status).toBe('unfilled');
  });
  it('stop orders wait for the trigger, then fill at available prices (no guaranteed price)', () => {
    const bids = [{ price: 98.6, quantity: 5 }];
    expect(val(ordersFill({ side: 'sell', type: 'stop-market', quantity: 1, triggerPrice: 99, lastPrice: 99.5, book: bids })).status).toBe('not-triggered');
    const hit = val(ordersFill({ side: 'sell', type: 'stop-market', quantity: 1, triggerPrice: 99, lastPrice: 98.7, book: bids }));
    expect(hit).toMatchObject({ status: 'filled', averagePrice: 98.6 });
    expect(val(ordersFill({ side: 'sell', type: 'stop-limit', quantity: 1, triggerPrice: 99, limitPrice: 98.9, lastPrice: 98.7, book: bids })).status).toBe('unfilled');
  });
  it('rejects negative quantity', () => {
    expect(code(ordersFill({ side: 'buy', type: 'market', quantity: -1, book: asks }))).toBe('NEGATIVE');
  });
});

describe('PnL and costs', () => {
  it('long and short gross PnL are mirror images', () => {
    expect(val(pnlLinear({ side: 'long', entry: 100, exit: 103, quantity: 2 })).grossPnl).toBe(6);
    expect(val(pnlLinear({ side: 'short', entry: 100, exit: 103, quantity: 2 })).grossPnl).toBe(-6);
    expect(val(pnlLinear({ side: 'short', entry: 100, exit: 97, quantity: 2 })).grossPnl).toBe(6);
    expect(code(pnlLinear({ side: 'long', entry: 0, exit: 1, quantity: 1 }))).toBe('ZERO');
    expect(code(pnlLinear({ side: 'sideways' as never, entry: 1, exit: 1, quantity: 1 }))).toBe('INVALID_INPUT');
  });
  it('fees are charged on each side’s notional; a gross winner can be a net loser', () => {
    const r = val(feesNet({ side: 'long', entry: 100, exit: 100.05, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }));
    expect(r.grossPnl).toBe(0.5);
    expect(r.entryFee).toBe(0.5);
    expect(r.exitFee).toBe(0.50025);
    expect(r.netPnl).toBe(-0.50025);
    const withCosts = val(feesNet({ side: 'short', entry: 200, exit: 198, quantity: 1, entryFeeRate: 0.0002, exitFeeRate: 0.0005, spreadCost: 0.05, slippageCost: 0.04 }));
    expect(withCosts).toMatchObject({ grossPnl: 2, entryFee: 0.04, exitFee: 0.099, otherCosts: 0.09, totalCosts: 0.229, netPnl: 1.771 });
    expect(code(feesNet({ side: 'long', entry: 100, exit: 101, quantity: 1, entryFeeRate: 0.5, exitFeeRate: 0.0005 }))).toBe('OUT_OF_RANGE');
    expect(code(feesNet({ side: 'long', entry: 100, exit: 101, quantity: 1, entryFeeRate: -0.1, exitFeeRate: 0.0005 }))).toBe('NEGATIVE');
  });
  it('break-even after fees, both sides', () => {
    const l = val(breakEvenPrice({ side: 'long', entry: 100, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }));
    expect(l.breakEven).toBeCloseTo(100.10005, 5);
    const s = val(breakEvenPrice({ side: 'short', entry: 100, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }));
    expect(s.breakEven).toBeCloseTo(99.90005, 5);
    // at the break-even exit, net PnL is zero
    expect(val(feesNet({ side: 'long', entry: 100, exit: l.breakEven, quantity: 3, entryFeeRate: 0.0005, exitFeeRate: 0.0005 })).netPnl).toBeCloseTo(0, 9);
  });
  it('round-trip estimate = notional × 2 × (fee + slippage), labelled approximate', () => {
    const r = feesEstimateRoundTrip({ notional: 1000, feeRate: 0.0005, slippageRate: 0.0002 });
    expect(val(r).estimate).toBe(1.4);
    expect(r.ok && r.approximate).toBe(true);
  });
  it('risk/reward requires correct sides and is not a probability', () => {
    const r = riskReward({ side: 'long', entry: 100, stop: 98, target: 104, quantity: 3 });
    expect(val(r)).toMatchObject({ riskPerUnit: 2, rewardPerUnit: 4, ratio: 2, risk: 6, reward: 12 });
    expect(r.ok && r.assumptions.join(' ')).toMatch(/NOT a probability/);
    expect(val(riskReward({ side: 'short', entry: 100, stop: 101, target: 97 })).ratio).toBe(3);
    expect(code(riskReward({ side: 'long', entry: 100, stop: 101, target: 104 }))).toBe('WRONG_SIDE');
    expect(code(riskReward({ side: 'short', entry: 100, stop: 99, target: 97 }))).toBe('WRONG_SIDE');
    expect(code(riskReward({ side: 'long', entry: 100, stop: 98, target: 99 }))).toBe('WRONG_SIDE');
  });
});

describe('leverage, liquidation, funding', () => {
  it('notional ≈ margin × leverage; return on margin magnified both ways', () => {
    expect(val(leverageExposure({ side: 'long', margin: 100, leverage: 10, movePercent: 2 }))).toMatchObject({ notional: 1000, grossPnl: 20, returnOnMarginPercent: 20, marginUsedUp: false });
    expect(val(leverageExposure({ side: 'long', margin: 100, leverage: 10, movePercent: -2 }))).toMatchObject({ grossPnl: -20, returnOnMarginPercent: -20 });
    expect(val(leverageExposure({ side: 'short', margin: 100, leverage: 3, movePercent: 2 })).grossPnl).toBe(-6);
    expect(val(leverageExposure({ side: 'long', margin: 50, leverage: 20, movePercent: -5 })).marginUsedUp).toBe(true);
  });
  it('rejects absurd leverage and impossible moves', () => {
    expect(code(leverageExposure({ side: 'long', margin: 100, leverage: 1000, movePercent: 1 }))).toBe('OUT_OF_RANGE');
    expect(code(leverageExposure({ side: 'long', margin: 100, leverage: 0.5, movePercent: 1 }))).toBe('OUT_OF_RANGE');
    expect(code(leverageExposure({ side: 'long', margin: 100, leverage: 5, movePercent: -100 }))).toBe('OUT_OF_RANGE');
    expect(code(leverageExposure({ side: 'long', margin: 0, leverage: 5, movePercent: 1 }))).toBe('ZERO');
  });
  it('approximate liquidation (D-13): isolated long/short and collateral variant', () => {
    const l = liquidationApprox({ side: 'long', entry: 100, leverage: 10, mmr: 0.005 });
    expect(val(l).liquidationPrice).toBeCloseTo(90.5, 9);
    expect(l.ok && l.approximate).toBe(true);
    expect(val(liquidationApprox({ side: 'short', entry: 100, leverage: 10, mmr: 0.005 })).liquidationPrice).toBeCloseTo(109.5, 9);
    expect(val(liquidationApprox({ side: 'long', entry: 100, leverage: 10, mmr: 0 })).liquidationPrice).toBeCloseTo(90, 9);
    expect(val(liquidationApprox({ side: 'long', entry: 100, collateral: 200, quantity: 10, mmr: 0.005 })).liquidationPrice).toBeCloseTo(80.5, 9);
    expect(code(liquidationApprox({ side: 'long', entry: 100, leverage: 250, mmr: 0.005 }))).toBe('OUT_OF_RANGE');
    expect(code(liquidationApprox({ side: 'long', entry: 100, leverage: 100, mmr: 0.02 }))).toBe('OUT_OF_RANGE');
    expect(code(liquidationApprox({ side: 'long', entry: 0, leverage: 5, mmr: 0.005 }))).toBe('ZERO');
  });
  it('funding: positive rate means longs pay, shorts receive', () => {
    expect(val(fundingPayment({ side: 'long', notional: 1000, rate: 0.0001, intervals: 3 }))).toEqual({ paymentPerInterval: 0.1, total: 0.3 });
    expect(val(fundingPayment({ side: 'short', notional: 1000, rate: 0.0001 })).paymentPerInterval).toBe(-0.1);
    expect(val(fundingPayment({ side: 'short', notional: 1000, rate: -0.0002 })).paymentPerInterval).toBe(0.2);
    expect(code(fundingPayment({ side: 'long', notional: 1000, rate: 0.5 }))).toBe('OUT_OF_RANGE');
  });
});

describe('position size (D-27)', () => {
  it('allowed notional ≈ risk ÷ (|entry − stop| ÷ entry)', () => {
    const r = val(positionSize({ side: 'long', riskAmount: 10, entry: 100, stop: 98, accountBalance: 1000 }));
    expect(r).toMatchObject({ stopDistance: 2, stopDistancePercent: 2, quantity: 5, notional: 500, impliedLeverage: 0.5 });
    expect(r.notional).toBeCloseTo(10 / (2 / 100), 9);
  });
  it('short side: stop above entry', () => {
    expect(val(positionSize({ side: 'short', riskAmount: 12, entry: 200, stop: 203 }))).toMatchObject({ stopDistance: 3, quantity: 4, notional: 800 });
  });
  it('size step rounds DOWN; costs per unit shrink the size', () => {
    expect(val(positionSize({ side: 'long', riskAmount: 10, entry: 100, stop: 97, sizeStep: 0.1 })).quantity).toBe(3.3);
    expect(val(positionSize({ side: 'long', riskAmount: 10, entry: 100, stop: 98, costPerUnit: 0.5 })).quantity).toBe(4);
    expect(code(positionSize({ side: 'long', riskAmount: 1, entry: 100, stop: 90, sizeStep: 1 }))).toBe('OUT_OF_RANGE');
  });
  it('rejects wrong-side stops, zero distance, negative and over-budget inputs', () => {
    expect(code(positionSize({ side: 'long', riskAmount: 10, entry: 100, stop: 101 }))).toBe('WRONG_SIDE');
    expect(code(positionSize({ side: 'short', riskAmount: 10, entry: 100, stop: 99 }))).toBe('WRONG_SIDE');
    expect(code(positionSize({ side: 'long', riskAmount: 10, entry: 100, stop: 100 }))).toBe('WRONG_SIDE');
    expect(code(positionSize({ side: 'long', riskAmount: -5, entry: 100, stop: 99 }))).toBe('NEGATIVE');
    expect(code(positionSize({ side: 'long', riskAmount: 0, entry: 100, stop: 99 }))).toBe('ZERO');
    expect(code(positionSize({ side: 'long', riskAmount: 2000, entry: 100, stop: 99, accountBalance: 1000 }))).toBe('OUT_OF_RANGE');
  });
});

describe('range.lookback', () => {
  const cs = [{ h: 101, l: 99 }, { h: 102, l: 100 }, { h: 100.5, l: 98 }, { h: 103, l: 100.5 }];
  it('max, min and range % over the window', () => {
    expect(val(rangeLookback({ candles: cs, window: 4 }))).toMatchObject({ max: 103, min: 98, range: 5, startIndex: 0, endIndex: 3 });
    expect(val(rangeLookback({ candles: cs, window: 4 })).rangePercent).toBeCloseTo((5 / 98) * 100, 9);
    expect(val(rangeLookback({ candles: cs, window: 2 }))).toMatchObject({ max: 103, min: 98 });
  });
  it('rejects windows longer than the data', () => {
    expect(code(rangeLookback({ candles: cs, window: 5 }))).toBe('OUT_OF_RANGE');
    expect(code(rangeLookback({ candles: cs, window: 0 }))).toBe('ZERO');
  });
});

describe('runSimulator flat adapter', () => {
  it('covers every SIMULATOR_ID', () => {
    const samples: Record<string, Record<string, number>> = {
      'pair.convert': { quantity: 2, price: 50 },
      'price.percent-change': { oldPrice: 50, newPrice: 55 },
      'ohlc.validate': { o: 1, h: 2, l: 0.5, c: 1.5 },
      'ohlc.anatomy': { o: 1, h: 2, l: 0.5, c: 1.5, bodyToRangeMax: 0 },
      'price.linear-toy': { buyers: 5, sellers: 5, basePrice: 10, stepPerLevel: 1 },
      'ohlc.aggregate': { o1: 1, h1: 2, l1: 0.5, c1: 1.5, o2: 1.5, h2: 3, l2: 1, c2: 2.5, groupSize: 2 },
      'orders.fill': { quantity: 1, p1: 10, q1: 1 },
      'pnl.linear': { entry: 10, exit: 11, quantity: 1 },
      'fees.net': { entry: 10, exit: 11, quantity: 1, entryFeeRate: 0.0005, exitFeeRate: 0.0005 },
      'fees.estimate-round-trip': { notional: 100, feeRate: 0.0005, slippageRate: 0.0002 },
      'risk.reward': { entry: 10, stop: 9, target: 12 },
      'leverage.exposure': { margin: 10, leverage: 2, movePercent: 1 },
      'liquidation.approx': { entry: 10, leverage: 5, mmr: 0.005 },
      'funding.payment': { notional: 100, rate: 0.0001 },
      'risk.position-size': { riskAmount: 1, entry: 10, stop: 9 },
      'range.lookback': { h1: 2, l1: 1, h2: 3, l2: 1.5, window: 2 },
    };
    for (const id of SIMULATOR_IDS) {
      const r = runSimulator(id, samples[id] as Record<string, number>);
      expect(r.ok, id).toBe(true);
    }
    expect(val(runSimulator('ohlc.aggregate', samples['ohlc.aggregate'] as Record<string, number>))).toEqual({ o: 1, h: 3, l: 0.5, c: 2.5 });
    expect(val(runSimulator('fees.net', { entry: 100, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }, 'long')).breakEven).toBeCloseTo(100.10005, 5);
  });
});
