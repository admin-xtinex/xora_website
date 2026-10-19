/**
 * COURSE GLOSSARY — term-owner map (v1.1.0). Owner: EDGE-00. Decision D-11.
 *
 * There is ONE course-wide glossary. Every term id has exactly ONE owning lesson. The owning lesson writes the
 * entry in its `glossaryEntries`. Every other lesson only REFERENCES the id ([[term-id]], glossaryRefs,
 * definition blocks, keyTermIds). The platform builds the merged index with `buildCourseGlossary()`.
 *
 * Ownership rule: the term belongs to the earliest lesson where the master prompt / blueprint syllabus defines it.
 * When the syllabus is silent, it belongs to the first lesson that needs it. To add or move a term, request it
 * from EDGE-00 (MINOR bump). Owners not yet authored are marked "planned". They are still binding.
 */
import type { LessonId } from './ids';

export const GLOSSARY_TERM_OWNERS = {
  // ---- Phase 1 · EDGE-02 (planned, from bot-briefs) ----
  'money-value': 'T01', 'digital-asset': 'T01', cryptocurrency: 'T01', bitcoin: 'T01', token: 'T01', wallet: 'T01',
  blockchain: 'T01', // v1.3.0 (D-45)
  buyer: 'T02', seller: 'T02', demand: 'T02', supply: 'T02', 'market-price': 'T02', liquidity: 'T02', volatility: 'T02',
  'base-asset': 'T03', 'quote-asset': 'T03', 'trading-pair': 'T03', symbol: 'T03', usdt: 'T03', stablecoin: 'T03',
  quantity: 'T03', 'notional-value': 'T03',
  peg: 'T03', // v1.3.0 (D-45): a stablecoin's target value; not guaranteed
  exchange: 'T04', order: 'T04', 'order-book': 'T04', bid: 'T04', ask: 'T04', spread: 'T04', 'account-security': 'T04',
  // ---- Phase 2 · EDGE-03 (T05–T09 drafted) ----
  position: 'T05', 'long-position': 'T05', 'short-position': 'T05', 'close-a-position': 'T05', 'profit-and-loss': 'T05',
  'entry-price': 'T06', 'exit-price': 'T06', 'unrealized-pnl': 'T06', 'realized-pnl': 'T06', 'partial-close': 'T06',
  'gross-pnl': 'T06', 'net-pnl': 'T06', 'percent-return': 'T06',
  // v1.2.0 (D-35): moved from T10. T06 needs it for unrealized PnL (define before use); T10/T11/T13 reference and deepen it.
  'mark-price': 'T06',
  'market-order': 'T07', 'limit-order': 'T07', 'trigger-price': 'T07', 'stop-market-order': 'T07',
  'stop-limit-order': 'T07', fill: 'T07', 'partial-fill': 'T07', slippage: 'T07', 'price-gap': 'T07',
  'stop-loss': 'T08', 'take-profit': 'T08', 'execution-price': 'T08', 'planned-loss': 'T08', 'risk-reward-ratio': 'T08',
  'trading-fee': 'T09', 'fee-rate': 'T09', maker: 'T09', taker: 'T09', 'round-trip': 'T09', 'mid-price': 'T09',
  'break-even-price': 'T09',
  // ---- Phase 3 · EDGE-04 (drafted) ----
  'educational-mock-terminal': 'T10', watchlist: 'T10', 'order-entry-panel': 'T10', 'positions-panel': 'T10',
  'wallet-balance': 'T10', 'last-price': 'T10', 'two-factor-authentication': 'T10',
  phishing: 'T10', 'api-access-key': 'T10', kyc: 'T10', 'regional-availability': 'T10',
  'spot-trading': 'T11', 'underlying-asset': 'T11', derivative: 'T11', 'perpetual-futures-contract': 'T11',
  exposure: 'T11', settlement: 'T11', 'contract-expiry': 'T11', 'funding-rate': 'T11',
  margin: 'T12', 'initial-margin': 'T12', leverage: 'T12', 'return-on-margin': 'T12', 'isolated-margin': 'T12',
  'cross-margin': 'T12', 'account-equity': 'T12',
  liquidation: 'T13', 'liquidation-price': 'T13', 'maintenance-margin': 'T13', 'maintenance-margin-rate': 'T13',
  'margin-tier': 'T13', 'liquidation-fee': 'T13', 'funding-interval': 'T13', 'gap-risk': 'T13',
  // ---- Phase 4 · EDGE-05 (planned, from master prompt §5) ----
  candlestick: 'T14', ohlc: 'T14', 'open-price': 'T14', 'high-price': 'T14', 'low-price': 'T14', 'close-price': 'T14',
  // v1.3.0 (D-44): range of ONE candle (high − low). Not the same as price-range (T18, range over a period).
  'candle-range': 'T14',
  'candle-body': 'T14', wick: 'T14', doji: 'T14', 'bullish-candle': 'T14', 'bearish-candle': 'T14',
  timeframe: 'T15', 'candle-aggregation': 'T15', 'market-noise': 'T15', 'higher-timeframe-context': 'T15',
  uptrend: 'T16', downtrend: 'T16', 'sideways-market': 'T16', 'higher-high': 'T16', 'higher-low': 'T16',
  'lower-high': 'T16', 'lower-low': 'T16', 'market-structure': 'T16',
  'support-zone': 'T17', 'resistance-zone': 'T17', retest: 'T17', breakout: 'T17', fakeout: 'T17', confirmation: 'T17',
  'trading-volume': 'T18', 'price-range': 'T18', 'previous-high': 'T18', 'previous-low': 'T18', 'lookback-window': 'T18',
  // ---- Phase 5 · EDGE-06 (drafted; ids normalised: "gl-" prefix dropped) ----
  scalping: 'T19', 'time-horizon': 'T19', 'swing-trading': 'T19', overtrading: 'T19',
  setup: 'T20', 'trade-checklist': 'T20', 'market-context': 'T20', 'key-level': 'T20', 'entry-trigger': 'T20',
  'invalidation-point': 'T20', 'wait-decision': 'T20',
  'false-signal': 'T21', 'relative-volume': 'T21', chasing: 'T21', 'choppy-range': 'T21', 'no-trade': 'T21',
  'account-balance': 'T22', 'risk-budget': 'T22', 'risk-amount': 'T22', 'stop-distance': 'T22', 'position-size': 'T22',
  'size-step': 'T22', 'stop-slippage': 'T22', 'max-daily-loss': 'T22', drawdown: 'T22',
  'trading-plan': 'T23', 'trade-lifecycle': 'T23', 'trade-management': 'T23', exit: 'T23', 'trading-journal': 'T23',
  'r-multiple': 'T23', 'consecutive-loss-rule': 'T23', 'process-review': 'T23', 'skipped-trade': 'T23',
} as const satisfies Readonly<Record<string, LessonId>>;

export type RegisteredTermId = keyof typeof GLOSSARY_TERM_OWNERS;

/**
 * Former / alternative ids → canonical id. Authors must use the canonical id; validators warn when they see an alias.
 * (E.g. EDGE-06's T22 "gl-approx-liquidation" is the T13 term "liquidation-price".)
 */
export const GLOSSARY_ALIASES: Readonly<Record<string, RegisteredTermId>> = {
  notional: 'notional-value',
  'approx-liquidation': 'liquidation-price',
  'reward-to-risk': 'risk-reward-ratio',
  'candle-close': 'close-price',
  support: 'support-zone',
  resistance: 'resistance-zone',
  candle: 'candlestick',
  'taker-fee': 'taker',
  'maker-fee': 'maker',
  'breakeven-move': 'break-even-price',
};

export function glossaryOwnerOf(termId: string): LessonId | undefined {
  return (GLOSSARY_TERM_OWNERS as Readonly<Record<string, LessonId>>)[termId];
}
