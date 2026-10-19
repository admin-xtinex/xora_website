/**
 * Fixed decision words for exercises, quizzes and the assessment engine (v1.1.0). Owner: EDGE-00. Decision D-16.
 * Learner UI always labels trade decisions as DEMO. No decision ever creates an order anywhere.
 */
/** A decision about one trade setup. */
export const TRADE_DECISIONS = ['BUY', 'SELL', 'WAIT', 'NO_TRADE'] as const;
/** A decision about the practice session as a whole (e.g. after the daily loss limit or consecutive losses). */
export const SESSION_DECISIONS = ['CONTINUE_SIM_PRACTICE', 'STOP_TRADING'] as const;
/** Verdict of a pre-trade risk check (e.g. liquidation distance vs stop distance). */
export const RISK_CHECK_VERDICTS = ['OK_FOR_SIM', 'WARNING', 'NO_TRADE'] as const;

export type TradeDecision = (typeof TRADE_DECISIONS)[number];
export type SessionDecision = (typeof SESSION_DECISIONS)[number];
export type RiskCheckVerdict = (typeof RISK_CHECK_VERDICTS)[number];
export type DecisionWord = TradeDecision | SessionDecision | RiskCheckVerdict;
export type DecisionSet = 'trade' | 'session' | 'risk-check';

export const DECISION_SETS: Readonly<Record<DecisionSet, readonly DecisionWord[]>> = {
  trade: TRADE_DECISIONS,
  session: SESSION_DECISIONS,
  'risk-check': RISK_CHECK_VERDICTS,
};
export const DECISION_WORDS: readonly DecisionWord[] = [...new Set<DecisionWord>([...TRADE_DECISIONS, ...SESSION_DECISIONS, ...RISK_CHECK_VERDICTS])];
/** Abstaining answers. Phase 5 lessons need at least one item whose best answer is one of these. */
export const ABSTAIN_DECISIONS: readonly DecisionWord[] = ['WAIT', 'NO_TRADE', 'STOP_TRADING'];

/** Replaced words: map them during migration. */
export const RETIRED_DECISION_WORDS: Readonly<Record<string, string>> = {
  SIM_ENTRY_ALLOWED: 'use BUY or SELL (direction required; UI shows "DEMO BUY"/"DEMO SELL")',
};

export function isDecisionWord(v: unknown): v is DecisionWord {
  return typeof v === 'string' && (DECISION_WORDS as readonly string[]).includes(v);
}
