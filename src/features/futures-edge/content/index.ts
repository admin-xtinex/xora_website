/**
 * Lesson registry. Each lesson is its own lazy chunk; light metadata and glossary entries load eagerly so the course
 * home and inline definitions work without pulling in all 23 lessons.
 */
import { LESSON_IDS, type Fixture, type GlossaryEntry, type Lesson, type LessonId } from '@futures-edge/contracts';
import type { LessonMeta, LessonModuleWithFixtures } from './types';

const lessonLoaders = import.meta.glob<LessonModuleWithFixtures>('./phase-0*/T*/lesson.ts');
const metaModules = import.meta.glob<{ meta: LessonMeta }>('./phase-0*/T*/meta.ts', { eager: true });
const glossaryModules = import.meta.glob<{ glossaryEntries: GlossaryEntry[] }>('./phase-0*/T*/glossary.ts', { eager: true });

const idOf = (path: string) => /\/(T\d\d)\//.exec(path)?.[1] as LessonId | undefined;

export const LESSON_META: Partial<Record<LessonId, LessonMeta>> = {};
for (const [path, m] of Object.entries(metaModules)) { const id = idOf(path); if (id) LESSON_META[id] = m.meta; }

export const AVAILABLE_LESSONS: readonly LessonId[] = LESSON_IDS.filter((id) => LESSON_META[id] !== undefined);

/** Course glossary built from every lesson's own entries (each term has one owning lesson). */
export const COURSE_GLOSSARY: ReadonlyMap<string, GlossaryEntry> = (() => {
  const m = new Map<string, GlossaryEntry>();
  for (const mod of Object.values(glossaryModules)) for (const g of mod.glossaryEntries) if (!m.has(g.id)) m.set(g.id, g);
  return m;
})();

const cache = new Map<LessonId, Promise<{ lesson: Lesson; fixtures: Fixture[] }>>();

export function loadLesson(id: LessonId): Promise<{ lesson: Lesson; fixtures: Fixture[] }> {
  const hit = cache.get(id);
  if (hit) return hit;
  const path = Object.keys(lessonLoaders).find((p) => idOf(p) === id);
  const loader = path ? lessonLoaders[path] : undefined;
  if (!loader) return Promise.reject(new Error(`Lesson ${id} is not available`));
  const pr = loader().then((m) => ({ lesson: m.default, fixtures: m.fixtures ?? [] }));
  pr.catch(() => cache.delete(id));
  cache.set(id, pr);
  return pr;
}

export function loadAllLessons(): Promise<Array<{ lesson: Lesson; fixtures: Fixture[] }>> {
  return Promise.all(AVAILABLE_LESSONS.map(loadLesson));
}
