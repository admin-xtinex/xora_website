import type { Fixture, Lesson } from '@futures-edge/contracts';

/** Light lesson metadata used by the course home without loading the whole lesson. Spread into the Lesson. */
export type LessonMeta = Pick<Lesson, 'id' | 'phaseId' | 'title' | 'summary' | 'durationMinutes' | 'difficulty' | 'prerequisites' | 'version'>;

/** What every `content/phase-0N/Tnn/lesson.ts` module exports. */
export interface LessonModuleWithFixtures {
  default: Lesson;
  fixtures: Fixture[];
}
