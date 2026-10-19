/**
 * Learner-facing copy owned by EDGE-09 (English source; EDGE-01 may route it through l10n later).
 * Every completion surface MUST show EDUCATION_ONLY_NOTICE. Nothing here may imply trading readiness.
 */
export const EDUCATION_ONLY_NOTICE =
  'Education only. Passing a quiz, a checkpoint or the whole course is not financial advice, not a qualification, and never permission to trade with real money. XORA Futures Edge places no real orders.';

export const COMPLETION_BADGE_TEXT = 'Completed (education only, not permission to trade live)';

export const THRESHOLD_NOTE =
  'The pass mark is a configurable learning target, not proof that you are ready to trade.';

export const LOCAL_DEMO_LABEL =
  'Local-only demo: progress is saved in this browser on this device only. It is not cloud-synced, the browser can clear it, and it is not tamper-proof.';

export const MEMORY_FALLBACK_LABEL =
  'This browser is not letting us save progress, so it is kept in memory only and will be lost when you reload or close the page.';

export const SAFETY_FAIL_HEADLINE =
  'A safety-critical answer was wrong, so this attempt does not pass whatever the overall score. Read the correction, then answer it again.';

export const STALE_ATTEMPT_NOTE =
  'The questions changed since this attempt, so it no longer counts. Please take the current version.';

export const SAFETY_TOPIC_LABELS: Readonly<Record<string, string>> = {
  leverage: 'Leverage',
  liquidation: 'Liquidation',
  execution: 'Order execution',
  'account-security': 'Account security',
  'fees-costs': 'Fees and costs',
  'no-trade': 'Choosing not to trade',
  'stablecoin-risk': 'Stablecoin risk',
  'not-advice': 'Education, not advice',
  'loss-limits': 'Loss limits',
};

export const DECISION_LABELS: Readonly<Record<string, string>> = {
  BUY: 'DEMO BUY', SELL: 'DEMO SELL', WAIT: 'WAIT', NO_TRADE: 'NO TRADE', STOP_TRADING: 'STOP TRADING',
  CONTINUE_SIM_PRACTICE: 'Continue simulated practice', OK_FOR_SIM: 'OK for simulation', WARNING: 'Warning',
};
