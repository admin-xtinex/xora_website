import type { GlossaryEntry } from '@futures-edge/contracts';

export const glossaryEntries: GlossaryEntry[] = [
  {
    id: 'scalping',
    term: 'Scalping',
    plainDefinition: 'A style of trading that aims to catch small price moves over a short time, often many times a day.',
    technicalMeaning: 'Short-horizon trading where positions are usually held for seconds to minutes and targets are small (often a fraction of a percent). Because each target is small, fees, spread and slippage take a large share of every result, and execution quality matters a lot.',
    example: 'A fictional DEMO/USDT scalp: buy 10 DEMO at 100.00, sell at 100.10 a few minutes later. Gross +1.00 USDT, but about 1.40 USDT of illustrative costs turn it into a net loss.',
    relatedTermIds: ['time-horizon', 'overtrading', 'round-trip', 'slippage'],
    notSameAs: [{ termId: 'swing-trading', text: 'Swing trading holds for hours to days and aims at bigger moves. Scalping aims at small moves within minutes.' }],
    introducedIn: 'T19',
  },
  {
    id: 'time-horizon',
    term: 'Time horizon',
    plainDefinition: 'How far ahead you are looking, or how long you expect a trade idea to matter.',
    technicalMeaning: 'The period over which an analysis is made or a position is expected to be held. XORA proposes a 10–15 minute ANALYSIS horizon for scalping study; it is not a required holding time and not a promise that price will move within it.',
    example: 'You study the last 15 one-minute candles and think about the next 10–15 minutes. You may still exit after 2 minutes if your stop is hit, or never enter at all.',
    relatedTermIds: ['scalping', 'swing-trading', 'timeframe'],
    notSameAs: [
      { termId: 'timeframe', text: 'A timeframe is how long ONE candle lasts (1m, 15m). A time horizon is how far ahead your idea looks.' },
      { text: 'An analysis horizon is not a holding rule. You do not have to stay in a trade for 10–15 minutes.' },
    ],
    introducedIn: 'T19',
    aliases: ['holding period', 'analysis horizon'],
  },
  {
    id: 'swing-trading',
    term: 'Swing trading',
    plainDefinition: 'A style of trading that holds positions for hours or days to catch larger price swings.',
    technicalMeaning: 'A longer-horizon style with fewer trades and wider targets and stops. Costs are a smaller share of each result, but positions face more time-based risks such as overnight news, gaps and, on perpetual futures, funding payments.',
    example: 'A fictional swing idea: buy at 100.00 aiming for 103.00 over two days. The same 1.40 USDT of costs on 1,000 USDT is small next to a 30 USDT target, but the trade is exposed for much longer.',
    relatedTermIds: ['scalping', 'time-horizon'],
    notSameAs: [{ termId: 'scalping', text: 'Longer is not automatically safer. Swing trades carry different risks: bigger moves against you and more time exposed.' }],
    introducedIn: 'T19',
  },
  {
    id: 'overtrading',
    term: 'Overtrading',
    plainDefinition: 'Taking more trades than your plan allows, often out of boredom, excitement or the urge to win back a loss.',
    technicalMeaning: 'Trading frequency beyond what the plan and the evidence justify. Every extra trade adds a certain cost (fees, spread, slippage) and another chance of a loss, so overtrading steadily drains an account even when individual trades look small.',
    example: '20 fictional scalps, each a gross winner of +1.00 USDT with 1.40 USDT of costs: gross +20.00, costs 28.01, net −8.01 USDT.',
    relatedTermIds: ['scalping', 'trading-fee', 'round-trip'],
    notSameAs: [{ text: 'Being active is not the same as making progress. A skipped trade costs nothing.' }],
    introducedIn: 'T19',
  },
];
