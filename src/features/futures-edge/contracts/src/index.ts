/**
 * @futures-edge/contracts — public entry point. Canonical import specifier (D-10):
 *   import { type Lesson, validateLesson } from '@futures-edge/contracts';
 * EDGE-01 maps the alias to features/futures-edge/contracts/index.ts (tsconfig `paths` + bundler alias).
 */
export * from './version';
export * from './feature-flag';
export * from './ids';
export * from './phases';
export * from './i18n';
export * from './json';
export * from './content';
export * from './glossary';
export * from './glossary-owners';
export * from './slide';
export * from './notes';
export * from './animation';
export * from './decisions';
export * from './simulators';
export * from './formula';
export * from './exercise';
export * from './fixture-shapes';
export * from './question';
export * from './progress';
export * from './lesson';
export * from './validation-types';
export {
  validateLesson, isLesson, validateQuestion, validateExercise, validateAnimationScene, validateCheckpoint,
  validateProgress, validateCourse, validateFixture, validateOhlcAnatomyResult, collectGlossaryRefs, buildCourseGlossary, PLACEHOLDER_PATTERN,
  type ValidateOptions, type CourseValidateOptions, type CourseGlossary,
} from './validation';
