/** Exercise type → widget, plus the parameter specs used by content tests (authoring reference). */
import type { ComponentType } from 'react';
import type { ExerciseType, ExpectedEvaluation } from '@futures-edge/contracts';
import type { ParamSpec } from '../motion/params';
import type { WidgetProps } from './Shell';
import { ChoiceFeedbackWidget, ClassifyWidget, NumericCalculatorWidget, SequenceOrderWidget, SliderExploreWidget } from './widgets-basic';
import { CandleBuilderWidget, HotspotFindWidget, LinePlacementWidget, LookbackRangeWidget, OrderMatchWidget, TimeframeSwitchWidget, ZonePlacementWidget } from './widgets-market';
import { CapstoneWidget, DecisionWidget, PositionSizeWidget } from './widgets-decision';

export const EXERCISE_WIDGETS: Record<ExerciseType, ComponentType<WidgetProps>> = {
  'choice-feedback': ChoiceFeedbackWidget,
  classify: ClassifyWidget,
  'numeric-calculator': NumericCalculatorWidget,
  'slider-explore': SliderExploreWidget,
  'sequence-order': SequenceOrderWidget,
  'hotspot-find': HotspotFindWidget,
  'order-match': OrderMatchWidget,
  'line-placement': LinePlacementWidget,
  'zone-placement': ZonePlacementWidget,
  'candle-builder': CandleBuilderWidget,
  'timeframe-switch': TimeframeSwitchWidget,
  'lookback-range': LookbackRangeWidget,
  'position-size': PositionSizeWidget,
  'decision-with-rationale': DecisionWidget,
  'capstone-lifecycle': CapstoneWidget,
};

type EvalKind = ExpectedEvaluation['kind'];

/** Parameters and evaluation kinds each widget understands. */
export const EXERCISE_SPECS: Record<ExerciseType, { params: ParamSpec; evaluations: EvalKind[]; needsChoices?: boolean; needsSimulator?: boolean }> = {
  'choice-feedback': { params: { optional: { feedback: 'object', showChart: 'boolean' } }, evaluations: ['exact-choice', 'choice-set'], needsChoices: true },
  classify: { params: { required: { items: 'objects', buckets: 'objects' }, optional: { itemFeedback: 'object', showChart: 'boolean' } }, evaluations: ['classification'] },
  'numeric-calculator': { params: { optional: { given: 'objects', candleIndex: 'number', showChart: 'boolean' } }, evaluations: ['numeric', 'numeric-set'] },
  'slider-explore': { params: { required: { sliders: 'objects', outputs: 'objects' }, optional: { fixed: 'object', side: 'string', sideToggle: 'boolean', note: 'string', question: 'string', feedback: 'object', showChart: 'boolean' } }, evaluations: ['numeric', 'numeric-set', 'exact-choice', 'choice-set', 'rubric', 'constraint'], needsSimulator: true },
  'sequence-order': { params: { required: { items: 'objects' } }, evaluations: ['sequence'] },
  'hotspot-find': { params: { required: { targets: 'objects' } }, evaluations: ['sequence'] },
  'order-match': { params: { required: { book: 'objects', side: 'string', quantity: 'number' }, optional: { limitPrice: 'number' } }, evaluations: ['numeric-set'] },
  'line-placement': { params: { required: { side: 'string', entry: 'number', stop: 'object', target: 'object' }, optional: { quantity: 'number', scenarios: 'objects', question: 'string', feedback: 'object' } }, evaluations: ['constraint', 'numeric', 'numeric-set', 'exact-choice', 'choice-set'] },
  'zone-placement': { params: { required: { zone: 'object', reference: 'object' }, optional: { question: 'string', feedback: 'object' } }, evaluations: ['choice-set', 'exact-choice'], needsChoices: true },
  'candle-builder': { params: { required: { tasks: 'objects' }, optional: { min: 'number', max: 'number', step: 'number' } }, evaluations: ['constraint'] },
  'timeframe-switch': { params: { optional: { groupSizes: 'numbers', question: 'string', feedback: 'object' } }, evaluations: ['numeric', 'numeric-set', 'exact-choice', 'choice-set'] },
  'lookback-range': { params: { required: { window: 'object' } }, evaluations: ['numeric', 'numeric-set'] },
  'position-size': { params: { optional: { playground: 'object', scenario: 'object' } }, evaluations: ['numeric', 'numeric-set'] },
  'decision-with-rationale': { params: { optional: { reveal: 'numbers', checklist: 'objects', context: 'strings', decisionFeedback: 'object', minRationale: 'number' } }, evaluations: ['decision'], needsChoices: true },
  'capstone-lifecycle': { params: { required: { coins: 'objects', risk: 'object', branches: 'objects' }, optional: { lookback: 'number', replayBranch: 'string', uncertaintyPrompt: 'string' } }, evaluations: ['rubric'], needsChoices: true },
};

/** Rubric criterion ids the capstone widget can score automatically. */
export const CAPSTONE_CRITERIA = ['market-choice', 'levels', 'uncertainty', 'risk-math', 'decision-justified', 'journal'] as const;
