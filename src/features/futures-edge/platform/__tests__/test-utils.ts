import type { LessonModule } from '@futures-edge/contracts';
import type { LessonRegistry } from '@futures-edge/content';
// Contract self-test sample (NOT learner content). Test-only: proves the shell renders whatever valid data it gets.
import { sampleLesson } from '../../../../../docs/futures-edge/contracts/selftest/sample-lesson';

export { sampleLesson };

export const EMPTY_REGISTRY: LessonRegistry = {};
export const SAMPLE_REGISTRY: LessonRegistry = {
  T14: () => Promise.resolve({ default: sampleLesson } satisfies LessonModule),
};

export function setPath(path: string): void {
  window.history.replaceState(null, '', path);
}
