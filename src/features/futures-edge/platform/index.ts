/**
 * @futures-edge/platform — documented exports of the EDGE-01 learning platform.
 */
export { FuturesEdgeApp } from './FuturesEdgeApp';
export { FeLink } from './FeLink';
export { RichText, renderRichText } from './RichText';
export {
  parseRoute,
  pathFor,
  navigate,
  isWithinBase,
  usePathname,
  useFeRoute,
  type FeRoute,
} from './router';
export { loadLesson, useLesson, type LessonLoadResult, type LessonLoadState } from './content-loader';
