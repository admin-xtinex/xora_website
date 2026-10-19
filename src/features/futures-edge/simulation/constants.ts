/**
 * Shared ILLUSTRATIVE teaching constants (decision D-12). Not current exchange rates, not recommendations.
 * Lesson text quotes these same numbers; content tests check that they stay in sync.
 */
import type { EducationalConstants } from '@futures-edge/contracts';

export const EDUCATIONAL_CONSTANTS: EducationalConstants = {
  version: '1.0.0',
  currency: 'USDT',
  demoSymbol: 'DEMOUSDT',
  demoPairDisplay: 'DEMO/USDT',
  takerFeeRatePerSide: 0.0005, // 0.05% per side
  makerFeeRatePerSide: 0.0002, // 0.02% per side
  slippageRatePerSideEstimate: 0.0002, // 0.02% per side
  fundingRatePerInterval: 0.0001, // +0.01% per interval
  fundingIntervalHours: 8,
  fundingSignConvention: 'positive-longs-pay',
  maintenanceMarginRate: 0.005, // 0.5% single flat tier
  illustrativeMarginTiers: [0.005, 0.01, 0.025],
  liquidationFeeModel: 'consumes-remaining-maintenance-margin',
  examples: {
    riskPerTrade: 0.01,
    dailyLossLimit: 0.03,
    maxTradesPerSession: 5,
    consecutiveLossStop: 2,
  },
  dojiBodyToRangeMax: 0,
};
