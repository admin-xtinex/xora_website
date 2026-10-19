import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices and rates in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data, and real rates vary by exchange and account.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can explain the difference between owning a coin on spot and holding a futures position that only follows its price.',
    'Learner can classify everyday examples as spot or futures using ownership, deposit, funding and forced-closure clues.',
    'Learner can calculate an illustrative funding payment from notional, rate and number of intervals, and say which side pays.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T11-S01', kind: 'cover-problem', title: 'Same price, two different things',
      narrationText: 'Two people both say they are long DEMO. One bought the coin. The other opened a futures contract. The price chart is the same for both, but what they hold, and what can go wrong, is very different.',
      blocks: [
        { kind: 'paragraph', text: 'Two learners are both “long DEMO”. One bought the coin. One opened a contract.' },
        { kind: 'paragraph', text: 'The price moves the same for both. **What they own** is not the same.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T11-A01' },
      glossaryRefs: ['long-position'],
      speakerNotes: 'Start from the confusion beginners have: on an exchange the spot and futures screens look alike. The difference is ownership and risk, not the chart.',
    },
    {
      id: 'T11-S02', kind: 'key-definition', title: 'Spot and derivatives',
      narrationText: 'Spot trading means you buy the actual coin and it sits in your wallet. A derivative is a contract whose value comes from the price of something else, called the underlying asset. A futures contract is a derivative.',
      blocks: [
        { kind: 'definition', termId: 'spot-trading' },
        { kind: 'definition', termId: 'derivative' },
        { kind: 'paragraph', text: 'The coin a contract follows is its [[underlying-asset|underlying asset]].' },
      ],
      glossaryRefs: ['spot-trading', 'derivative', 'underlying-asset'],
    },
    {
      id: 'T11-S03', kind: 'visual-breakdown', title: 'Perpetual futures: no end date',
      narrationText: 'A perpetual futures contract has no expiry date. It stays open until you close it or the exchange closes it. Every few hours a funding payment moves between longs and shorts to keep its price near spot.',
      blocks: [
        { kind: 'paragraph', text: 'A [[perpetual-futures-contract|perpetual]] has no [[contract-expiry|expiry]]. Gains and losses are [[settlement|settled]] in USDT, not coins.' },
        { kind: 'paragraph', text: 'Every few hours a [[funding-rate|funding]] payment moves between longs and shorts.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T11-A05' },
      glossaryRefs: ['perpetual-futures-contract', 'contract-expiry', 'settlement', 'funding-rate'],
    },
    {
      id: 'T11-S04', kind: 'worked-example', title: 'A 20% fall, two outcomes',
      narrationText: 'DEMO falls from 100 to 80. The spot holder still owns 1 DEMO, now worth 80 USDT. The futures long of 1 DEMO, opened with a 20 USDT deposit, has lost 20 USDT: the whole deposit. The position is closed and nothing is left to wait with.',
      blocks: [
        {
          kind: 'worked-example', title: 'Fictional DEMO/USDT, 100.00 to 80.00', fictional: true,
          steps: [
            { text: 'Spot: 1 DEMO × 80.00', result: 'still owned, worth 80.00 USDT' },
            { text: 'Futures long 1 DEMO: (80.00 − 100.00) × 1', result: '−20.00 USDT' },
            { text: 'Deposit 20.00 − 20.00', result: '0.00 USDT left' },
          ],
          conclusion: 'Same move. Spot still holds the coin; the futures deposit is gone.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T11-A03' },
      glossaryRefs: ['exposure'],
    },
    {
      id: 'T11-S05', kind: 'risks-misunderstanding', title: 'Futures is not “owning with extra steps”',
      narrationText: 'The common mistake is to treat a futures position like owning coins and simply wait out a fall. A futures position can be force-closed when the deposit runs low, and it can pay funding while it stays open.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: '“I can just wait for recovery”', text: 'A futures position can be **force-closed** before price recovers. Spot coins are not.' },
        { kind: 'callout', callout: 'safety', text: 'Futures adds funding costs and forced-closure risk. Not trading is always allowed.' },
      ],
      glossaryRefs: ['perpetual-futures-contract', 'funding-rate'],
    },
    {
      id: 'T11-S06', kind: 'guided-practice', title: 'Sort five examples',
      narrationText: 'Now you sort five short examples into spot or futures. Look for clues: do you receive coins? Is there a deposit, a funding payment or a risk of forced closure?',
      blocks: [
        { kind: 'list', ordered: true, items: ['Read each example.', 'Ask: do I own the coin, or a contract on its price?', 'Place it in Spot or Futures, then press Check.'] },
        { kind: 'callout', callout: 'tip', text: 'Funding and forced closure only exist on the futures side.' },
      ],
      glossaryRefs: ['spot-trading', 'derivative'],
    },
    {
      id: 'T11-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Spot means you own the coin. Futures means you hold a contract that follows the price. Perpetuals have no expiry, pay or receive funding, and can be force-closed.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Spot: you own the coin.', 'Futures: a contract on the price; you own no coins.', 'Perpetuals have no expiry and settle in USDT.', 'Futures adds funding and forced-closure risk.'] },
      ],
      glossaryRefs: ['spot-trading', 'perpetual-futures-contract', 'funding-rate'],
    },
  ],

  notesSections: [
    {
      id: 'T11-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'In [[spot-trading|spot trading]] you swap USDT for the actual coin. The coin sits in your [[wallet]] and is yours. A futures contract is a [[derivative]]: an agreement whose value follows the price of an [[underlying-asset|underlying asset]]. You get price [[exposure]], but no coins. The most common type in crypto is the [[perpetual-futures-contract|perpetual futures contract]], which has no [[contract-expiry|expiry]] date. Its gains and losses are [[settlement|settled]] in USDT.' },
        { kind: 'analogy', text: 'Buying spot is like buying a bag of rice: it is in your kitchen. A futures position is like a written agreement with a neighbour to settle up in cash depending on the rice price. You never get the rice.' },
      ],
    },
    {
      id: 'T11-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'On many exchanges, for example on Binance, the spot and futures screens look similar. But the risks are different. A futures [[position]] needs a deposit, can pay a [[funding-rate|funding]] charge while open, and can be closed by the exchange if losses use up the deposit. A spot coin has none of these.' },
      ],
    },
    {
      id: 'T11-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: the same 20% fall (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Spot: buy 1 DEMO at 100.00 USDT. Futures: open a long of 1 DEMO at 100.00 with a 20.00 USDT deposit.' },
            { text: 'Price falls to 80.00, a move of −20%.' },
            { text: 'Spot value = 1 × 80.00', result: '80.00 USDT, coin still owned' },
            { text: 'Futures PnL = (80.00 − 100.00) × 1', result: '−20.00 USDT' },
            { text: 'Deposit left = 20.00 − 20.00', result: '0.00 USDT' },
          ],
          conclusion: 'The spot holder can still wait. The futures deposit is used up, so the position is closed; in practice the exchange closes it even earlier (lesson T13).',
        },
        {
          kind: 'worked-example', title: 'Example 2: funding over one day (illustrative rate)', fictional: true,
          steps: [
            { text: 'Long perpetual, notional 1,000.00 USDT, funding +0.01% every 8 hours.' },
            { text: 'One interval = 1,000.00 × 0.0001', result: '0.10 USDT paid by the long' },
            { text: 'Three intervals (24 hours) = 0.10 × 3', result: '0.30 USDT' },
          ],
          conclusion: 'A short of the same size would receive 0.30 USDT. If the rate turns negative, the direction flips.',
        },
        {
          kind: 'formula', expression: 'funding payment = notional × funding rate (per interval)',
          variables: [
            { symbol: 'notional', meaning: 'position size in USDT (quantity × price)', unit: 'USDT' },
            { symbol: 'funding rate', meaning: 'illustrative rate for one interval; positive means longs pay', unit: '% per interval' },
          ],
        },
      ],
    },
    {
      id: 'T11-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Coins arrive in your wallet and can be withdrawn: spot.',
          'You see a contract symbol, a long or short side, and a deposit: futures.',
          'You see a funding countdown or funding history: perpetual futures.',
          'You see a warning that the position can be closed if losses grow: futures.',
        ] },
      ],
    },
    {
      id: 'T11-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Thinking a futures long means you own coins', text: 'You own a contract. You cannot withdraw coins from it.' },
        { kind: 'callout', callout: 'mistake', title: 'Waiting out a fall like spot', text: 'A futures position can be force-closed before the price comes back.' },
        { kind: 'callout', callout: 'mistake', title: 'Ignoring funding', text: 'Small funding payments add up over many intervals.' },
      ],
    },
    {
      id: 'T11-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Futures are not a better version of spot. They add funding costs and the risk of losing the whole deposit quickly. No product is safe or guaranteed, and choosing not to trade is always valid.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T11-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Spot versus perpetual futures', headers: ['Question', 'Spot', 'Perpetual futures'], rows: [
          ['Do you own the coin?', 'Yes', 'No, a contract'],
          ['Expiry?', 'None', 'None'],
          ['Funding?', 'No', 'Yes, every interval'],
          ['Can it be force-closed?', 'No', 'Yes'],
          ['Settled in?', 'The coin', 'USDT'],
        ] },
      ],
    },
    {
      id: 'T11-N08', heading: 'learn-more', title: 'Learn more: dated futures and why funding exists', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Older futures contracts have a fixed expiry date, for example the end of a quarter. On that date every open position is settled and the contract ends. Perpetual contracts remove the date. Without an end date, something must stop the contract price drifting far from the spot price. Funding does that: when the contract trades above spot, the rate is usually positive and longs pay shorts, which encourages shorts and discourages longs.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T11-A01', type: 'spot-vs-futures', durationMs: 30_000,
      parameters: { variant: 'ownership', path: [100, 102, 105, 103, 106], spotQuantity: 1, futuresQuantity: 1, margin: 20 },
      caption: 'DEMO rises from 100.00 to 106.00. Spot: 1 DEMO now worth 106.00. Futures: PnL climbs to +6.00 USDT and the deposit grows from 20.00 to 26.00.',
      narration: 'Both sides follow the same price. Only the spot side owns a coin.',
      reducedMotionDescription: 'Fictional DEMO price moves 100.00, 102.00, 105.00, 103.00, 106.00. The spot card holds 1 DEMO, worth 106.00 USDT at the end. The futures card shows exposure 1 DEMO, PnL +6.00 USDT, deposit (margin) left 26.00 USDT, and the line “You own no coins here”.',
      glossaryRefs: ['spot-trading', 'exposure'],
    },
    {
      id: 'T11-A02', type: 'spot-vs-futures', durationMs: 30_000,
      parameters: { variant: 'ownership', path: [100, 98, 95, 97, 94], spotQuantity: 1, futuresQuantity: 1, margin: 20 },
      caption: 'Now DEMO dips from 100.00 to 94.00. Spot still holds 1 DEMO (worth 94.00). Futures PnL falls to −6.00 USDT and the deposit shrinks to 14.00.',
      narration: 'The loss per coin is identical. The difference is that the futures loss comes out of a small deposit.',
      reducedMotionDescription: 'Fictional DEMO price moves 100.00, 98.00, 95.00, 97.00, 94.00. Spot: 1 DEMO, worth 94.00 USDT. Futures: PnL −6.00 USDT, deposit left 14.00 USDT of the original 20.00.',
      glossaryRefs: ['derivative'],
    },
    {
      id: 'T11-A03', type: 'spot-vs-futures', durationMs: 35_000,
      parameters: { variant: 'crash-comparison', path: [100, 96, 91, 85, 80], spotQuantity: 1, futuresQuantity: 1, margin: 20 },
      caption: 'A 20% fall to 80.00: spot still owns 1 DEMO worth 80.00, but the futures loss of −20.00 USDT uses up the whole 20.00 deposit and the position is closed (conceptual).',
      narration: 'This is the key difference. The spot holder can wait. The futures holder has nothing left to wait with. Real exchanges close positions even earlier.',
      reducedMotionDescription: 'Fictional DEMO price falls 100.00, 96.00, 91.00, 85.00, 80.00. Spot: 1 DEMO still owned, worth 80.00 USDT. Futures: PnL −20.00 USDT, deposit left 0.00, card turns red and reads “Margin gone: closed (conceptual)”.',
      glossaryRefs: ['exposure'],
    },
    {
      id: 'T11-A04', type: 'text-card', durationMs: 25_000,
      parameters: { variant: 'plain', heading: 'Perpetual futures in four lines', items: [
        'A dated future has an expiry date and is settled then.',
        'A perpetual has no expiry: it stays open until it is closed.',
        'Settlement is paid in USDT, not in coins.',
        'Funding payments keep its price near the spot price.',
      ] },
      caption: 'Four facts appear one by one: expiry, no expiry, settlement in USDT, and funding.',
      reducedMotionDescription: 'Card: a dated future has an expiry date and is settled then; a perpetual has no expiry and stays open until closed; settlement is paid in USDT, not coins; funding payments keep its price near spot.',
      glossaryRefs: ['contract-expiry', 'settlement', 'perpetual-futures-contract'],
    },
    {
      id: 'T11-A05', type: 'funding-clock', durationMs: 30_000,
      parameters: { notional: 1000, side: 'long', rates: [0.0001, 0.0001, 0.0001], intervalHours: 8 },
      caption: 'The funding clock ticks three times. At an illustrative +0.01% the long pays 0.10 USDT each time: 0.30 USDT after 24 hours.',
      narration: 'A positive funding rate means longs pay shorts. The payment is based on the notional, not on the deposit.',
      reducedMotionDescription: 'Long position, notional 1,000.00 USDT, illustrative funding +0.010% every 8 hours. Interval 1: pays 0.10 USDT. Interval 2: pays 0.10. Interval 3: pays 0.10. Total paid 0.30 USDT.',
      glossaryRefs: ['funding-rate'],
    },
    {
      id: 'T11-A06', type: 'funding-clock', durationMs: 25_000,
      parameters: { notional: 1000, side: 'short', rates: [0.0001, 0.0001, 0.0001], intervalHours: 8 },
      caption: 'Same rates, but a short of the same size: it receives 0.10 USDT per interval, 0.30 USDT in total.',
      narration: 'Funding is a transfer between the two sides. When one side pays, the other receives.',
      reducedMotionDescription: 'Short position, notional 1,000.00 USDT, illustrative funding +0.010% every 8 hours. Each interval the short receives 0.10 USDT; total received 0.30 USDT.',
      glossaryRefs: ['funding-rate', 'short-position'],
    },
    {
      id: 'T11-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'checklist', heading: 'Spot or futures? Ask four questions', items: [
        'Did coins arrive in my wallet?',
        'Is there a long/short side and a deposit?',
        'Is there a funding countdown?',
        'Can the position be force-closed?',
      ] },
      caption: 'A four-question checklist builds up: coins in wallet means spot; deposit, funding or forced closure means futures.',
      reducedMotionDescription: 'Checklist: did coins arrive in my wallet; is there a long/short side and a deposit; is there a funding countdown; can the position be force-closed. Yes to the first means spot; yes to the others means futures.',
    },
    {
      id: 'T11-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'Futures add risks spot does not have', items: [
        'The deposit can be used up quickly.',
        'The exchange can force-close the position.',
        'Funding can cost money while you wait.',
        'Not trading is always allowed.',
      ] },
      caption: 'Safety: the warning lines appear one by one — deposit loss, forced closure, funding, and the choice not to trade.',
      reducedMotionDescription: 'Warning card: the deposit can be used up quickly; the exchange can force-close the position; funding can cost money while you wait; not trading is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T11-X01', type: 'classify', title: 'Spot or futures?',
      fixtureId: 'FX-T11-CLASSIFY-01',
      instructions: 'Read the five fictional examples. Put each one in Spot or Futures, then press Check.',
      steps: [
        { id: 'T11-X01-01', prompt: 'For each example, ask: do I own the coin, or a contract on its price?', hint: 'Coins in your wallet that you can withdraw = spot.' },
        { id: 'T11-X01-02', prompt: 'Look for futures clues: a deposit, funding, or forced closure. Then press Check.', hint: 'Funding and forced closure only happen on the futures side.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'ex-1', text: 'You pay 500.00 USDT and 5 DEMO appear in your wallet.' },
          { id: 'ex-2', text: 'You open a long DEMOUSDT perpetual of 1,000.00 USDT notional with a 100.00 USDT deposit.' },
          { id: 'ex-3', text: 'Every 8 hours a small funding amount is charged to or paid into your position.' },
          { id: 'ex-4', text: 'You withdraw the DEMO coins you bought to another wallet.' },
          { id: 'ex-5', text: 'If price moves far against you, the exchange can close the position and the deposit can be lost.' },
        ],
        buckets: [
          { id: 'spot', label: 'Spot (you own the coin)' },
          { id: 'futures', label: 'Futures (a contract on the price)' },
        ],
        itemFeedback: {
          'ex-1': 'Coins arrived in your wallet: that is a spot purchase.',
          'ex-2': 'A long side, a notional and a deposit: a futures position.',
          'ex-3': 'Funding only exists on perpetual futures.',
          'ex-4': 'Only coins you own can be withdrawn: spot.',
          'ex-5': 'Forced closure and losing the deposit are futures risks.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { spot: ['ex-1', 'ex-4'], futures: ['ex-2', 'ex-3', 'ex-5'] } },
      explanation: 'Examples 1 and 4 involve real coins you own. Examples 2, 3 and 5 describe a contract with a deposit, funding payments and forced-closure risk.',
      fictionalDataLabel: 'Fictional DEMO/USDT examples for practice only.',
    },
    {
      id: 'T11-X02', type: 'choice-feedback', title: 'Which risks come with futures?',
      fixtureId: 'FX-T11-RISKS-01',
      instructions: 'A learner opens a fictional long DEMOUSDT perpetual of 1 DEMO at 100.00 with a 20.00 USDT deposit. Select every risk that applies to this futures position but not to holding 1 DEMO on spot.',
      steps: [
        { id: 'T11-X02-01', prompt: 'Think about what happens while the position stays open.', hint: 'Funding is charged or credited every interval.' },
        { id: 'T11-X02-02', prompt: 'Think about what happens if price falls a lot. Select all that apply, then check.', hint: 'A 20.00 USDT deposit only covers a 20.00 USDT loss.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      choices: [
        { id: 'a', text: 'Funding payments can be charged while the position stays open.' },
        { id: 'b', text: 'The exchange can force-close the position if losses use up the deposit.' },
        { id: 'c', text: 'The contract expires every Friday and must be renewed.' },
        { id: 'd', text: 'Coins in a spot wallet disappear automatically after a 20% fall.' },
      ],
      parameters: {
        feedback: {
          a: 'Correct. With an illustrative +0.01% rate, a long pays a small amount every interval.',
          b: 'Correct. The deposit is small compared with the exposure, so a big fall can use it up and the position is closed.',
          c: 'A perpetual has no expiry date. That is what “perpetual” means.',
          d: 'Spot coins stay yours whatever the price does; only their value changes.',
        },
      },
      expectedEvaluation: { kind: 'choice-set', choiceIds: ['a', 'b'] },
      explanation: 'Funding and forced closure are futures-only risks. Perpetuals do not expire, and spot coins are never taken away because the price fell.',
      fictionalDataLabel: 'Fictional DEMO/USDT scenario with illustrative rates.',
    },
    {
      id: 'T11-X03', type: 'numeric-calculator', title: 'Work out a funding payment',
      fixtureId: 'FX-T11-FUNDING-01', simulatorId: 'funding.payment',
      instructions: 'A fictional long perpetual has a notional of 2,000.00 USDT. The illustrative funding rate is +0.01% every 8 hours. Work out the payment for one interval and the total over 24 hours (3 intervals), to 2 decimal places.',
      steps: [
        { id: 'T11-X03-01', prompt: 'Payment per interval = notional × rate.', hint: '+0.01% = 0.0001. So 2,000.00 × 0.0001.' },
        { id: 'T11-X03-02', prompt: 'Total for 3 intervals = payment per interval × 3.', hint: 'Positive rate: the long pays.' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: { given: [
        { label: 'Notional', value: 2000, unit: 'USDT', decimals: 2 },
        { label: 'Funding rate per interval', value: 0.01, unit: '%', decimals: 2 },
        { label: 'Intervals', value: 3, unit: 'intervals', decimals: 0 },
      ] },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'paymentPerInterval', label: 'Paid per interval', value: 0.2, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'total', label: 'Total paid over 24 hours', value: 0.6, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      ] },
      explanation: '2,000.00 × 0.0001 = 0.20 USDT per interval; 0.20 × 3 = 0.60 USDT per day. Funding is charged on the notional, so a bigger position pays more.',
      fictionalDataLabel: 'Fictional position with an illustrative funding rate; real rates change and vary by exchange.',
    },
  ],

  formulas: [
    {
      id: 'T11-F01', name: 'Funding payment', expression: 'payment per interval = notional × funding rate; total = payment × intervals (positive rate: longs pay, shorts receive)',
      variables: [
        { symbol: 'notional', meaning: 'position size in USDT', unit: 'USDT' },
        { symbol: 'funding rate', meaning: 'illustrative rate per interval (0.0001 = +0.01%)', unit: 'fraction per interval' },
        { symbol: 'intervals', meaning: 'number of funding times passed', unit: 'count' },
      ],
      simulatorId: 'funding.payment', approximate: false,
      workedExamples: [
        { label: 'Notes example 2 (long, 1,000.00 USDT)', inputs: { notional: 1000, rate: 0.0001, intervals: 3 }, outputs: { paymentPerInterval: 0.1, total: 0.3 }, tolerance: 1e-9, assumptions: ['illustrative rate'] },
        { label: 'Scene T11-A06 (short receives)', side: 'short', inputs: { notional: 1000, rate: 0.0001, intervals: 3 }, outputs: { paymentPerInterval: -0.1, total: -0.3 }, tolerance: 1e-9, assumptions: ['illustrative rate'] },
        { label: 'Exercise T11-X03', inputs: { notional: 2000, rate: 0.0001, intervals: 3 }, outputs: { paymentPerInterval: 0.2, total: 0.6 }, tolerance: 1e-9, assumptions: ['illustrative rate'] },
        { label: 'Quiz T11-Q03', inputs: { notional: 5000, rate: 0.0001, intervals: 1 }, outputs: { paymentPerInterval: 0.5 }, tolerance: 1e-9, assumptions: ['illustrative rate'] },
      ],
    },
    {
      id: 'T11-F02', name: 'Same price move, spot value versus futures PnL', expression: 'futures PnL (long) = (exit − entry) × quantity; spot value = quantity × price',
      variables: [
        { symbol: 'entry, exit', meaning: 'fictional DEMO prices', unit: 'USDT per DEMO' },
        { symbol: 'quantity', meaning: 'DEMO held on spot or covered by the contract', unit: 'DEMO' },
      ],
      simulatorId: 'pnl.linear', approximate: false,
      workedExamples: [
        { label: 'Crash comparison (slide T11-S04)', inputs: { entry: 100, exit: 80, quantity: 1 }, outputs: { grossPnl: -20, percentMove: -20, entryNotional: 100 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees and funding ignored'] },
        { label: 'Rising path (scene T11-A01)', inputs: { entry: 100, exit: 106, quantity: 1 }, outputs: { grossPnl: 6 }, tolerance: 1e-9, assumptions: ['fictional data'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T11-Q01', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T11',
      prompt: 'DEMO falls from 100.00 to 80.00 (fictional). Asha holds 1 DEMO on spot. Ravi holds a futures long of 1 DEMO opened with a 20.00 USDT deposit. Which statement is correct?',
      choices: [
        { id: 'a', text: 'Asha still owns 1 DEMO worth 80.00 USDT; Ravi’s 20.00 USDT deposit is used up and his position is closed.' },
        { id: 'b', text: 'Both still own 1 DEMO, each worth 80.00 USDT.' },
        { id: 'c', text: 'Both lost exactly the same, so there is no difference.' },
        { id: 'd', text: 'Ravi lost nothing because futures contracts are protected.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The loss per coin is 20.00 USDT for both. Asha still holds the coin. Ravi only had a 20.00 USDT deposit, which the loss used up.',
      misconceptionFeedback: {
        b: 'Ravi never owned DEMO. A futures position is a contract on the price.',
        c: 'The price change is the same, but Asha keeps her coin while Ravi’s small deposit is gone.',
        d: 'Futures positions are not protected. Losses come out of the deposit.',
      },
      learningOutcome: 'Distinguish actual ownership on spot from price exposure on futures.',
      remediationRef: { lessonId: 'T11', anchorId: 'T11-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T11-Q02', type: 'single', cognitiveTag: 'recall', linkedLessonId: 'T11',
      prompt: 'What makes a perpetual futures contract “perpetual”?',
      choices: [
        { id: 'a', text: 'It has no expiry date; it stays open until it is closed.' },
        { id: 'b', text: 'It can never lose money.' },
        { id: 'c', text: 'You receive the coins when you close it.' },
        { id: 'd', text: 'It expires every 8 hours.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: '“Perpetual” means no expiry date. Gains and losses are settled in USDT.',
      misconceptionFeedback: {
        b: 'Any futures position can lose money, including the whole deposit.',
        c: 'USDT-settled perpetuals settle in USDT. You never receive the coin.',
        d: 'Every 8 hours is an illustrative funding interval, not an expiry.',
      },
      learningOutcome: 'Recall that perpetual futures have no expiry and settle in USDT.',
      remediationRef: { lessonId: 'T11', anchorId: 'T11-N01' },
      shuffleChoices: true,
    },
    {
      id: 'T11-Q03', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T11',
      prompt: 'A fictional long perpetual has a notional of 5,000.00 USDT. The illustrative funding rate is +0.01% for one interval. How much does the long pay for that interval, in USDT?',
      answer: { kind: 'numeric', value: 0.5, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: '5,000.00 × 0.0001 = 0.50 USDT. With a positive rate, longs pay shorts.',
      learningOutcome: 'Calculate a funding payment from notional and rate.',
      remediationRef: { lessonId: 'T11', anchorId: 'T11-N03' },
    },
    {
      id: 'T11-Q04', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T11', safetyCritical: true, safetyTopic: 'liquidation',
      prompt: 'A learner says: “Futures are just like buying coins. If the price falls, I will simply wait for it to come back, like I would on spot.” What is the best response?',
      choices: [
        { id: 'a', text: 'Not true: a futures position can be force-closed when losses use up the deposit, and funding can cost money while you wait. Not trading is also a valid choice.' },
        { id: 'b', text: 'True: futures and spot behave the same way when price falls.' },
        { id: 'c', text: 'True, as long as the position is a perpetual, because perpetuals never close.' },
        { id: 'd', text: 'True, because funding payments always cover the losses.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Spot coins stay yours. A futures position depends on a deposit; if losses use it up, the exchange closes the position and the chance to “wait for recovery” is gone.',
      misconceptionFeedback: {
        b: 'The price move is the same, but a futures loss comes out of a limited deposit and can end the position.',
        c: 'No expiry does not mean no closing. The exchange can still force-close a perpetual position.',
        d: 'Funding is a small transfer between longs and shorts. It does not cover losses, and it can add to them.',
      },
      learningOutcome: 'Recognise that futures carry forced-closure and funding risk that spot does not.',
      remediationRef: { lessonId: 'T11', anchorId: 'T11-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T11-Q05', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T11', safetyCritical: true, safetyTopic: 'fees-costs',
      prompt: 'The illustrative funding rate is +0.01% and you hold a short perpetual position. What happens at the next funding time?',
      choices: [
        { id: 'a', text: 'You receive a small payment, because with a positive rate longs pay shorts.' },
        { id: 'b', text: 'You pay, because everyone always pays funding.' },
        { id: 'c', text: 'Nothing, because funding only applies to spot.' },
        { id: 'd', text: 'Your position expires.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A positive rate means longs pay shorts, so a short receives. If the rate turns negative, shorts pay instead. Rates change every interval.',
      misconceptionFeedback: {
        b: 'Funding is a transfer: when one side pays, the other side receives.',
        c: 'Funding exists only on perpetual futures, never on spot.',
        d: 'Perpetuals have no expiry. Funding time is just a payment time.',
      },
      learningOutcome: 'Tell which side pays funding from the sign of the rate.',
      remediationRef: { lessonId: 'T11', anchorId: 'T11-N03' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Thinking a futures long means you own coins.', correction: 'You own a contract that follows the price. Only spot puts coins in your wallet.' },
    { mistake: 'Planning to “wait out” a fall on futures like on spot.', correction: 'A futures position can be force-closed when losses use up the deposit.' },
    { mistake: 'Ignoring funding because each payment is small.', correction: 'Funding is charged on the full notional every interval and adds up over time.' },
  ],
  takeaways: [
    'Spot means you own the coin; futures means you hold a contract on its price.',
    'Perpetual futures have no expiry, settle in USDT and pay or receive funding.',
    'Futures add forced-closure and funding risk that spot does not have.',
  ],
  reviewCard: {
    keyTermIds: ['spot-trading', 'perpetual-futures-contract', 'funding-rate'],
    safetyNote: 'A futures position is not ownership. It can be force-closed and can cost funding while open. Not trading is always allowed.',
    reviewMinutes: 3,
    retrievalQuestion: 'DEMO falls 20%. You hold 1 DEMO on spot. What do you still own? What would happen to a futures long of 1 DEMO opened with a 20 USDT deposit?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T11-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
