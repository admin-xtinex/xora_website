/**
 * Lazy lesson registry (EDGE-01). Data-only module: imports contracts only (architecture.md §5).
 *
 * Every authored lesson lives at `content/phase-0N/Tnn/lesson.ts` and default-exports a `Lesson`
 * (ownership.md "Per-lesson file convention"). Vite's `import.meta.glob` turns each file that exists into a
 * separate lazy chunk, so a lesson that has not been published yet simply has no loader. Nothing is
 * hardcoded here, and no lesson text lives in this file.
 */
import { isLessonId, phaseOfLesson, type LessonId, type LessonModule } from '@futures-edge/contracts';

export type LessonLoader = () => Promise<LessonModule>;
export type LessonRegistry = Readonly<Partial<Record<LessonId, LessonLoader>>>;

export interface RegistryIssue {
  path: string;
  message: string;
}

const LESSON_PATH = /^\.\/phase-0([1-5])\/(T\d\d)\/lesson\.ts$/;

/**
 * Builds a registry from a `{ './phase-0N/Tnn/lesson.ts': loader }` map. Files in the wrong phase folder or with
 * an unknown lesson id are skipped and reported, never guessed.
 */
export function buildLessonRegistry(modules: Record<string, LessonLoader>): {
  registry: LessonRegistry;
  issues: RegistryIssue[];
} {
  const registry: Partial<Record<LessonId, LessonLoader>> = {};
  const issues: RegistryIssue[] = [];
  for (const [path, loader] of Object.entries(modules)) {
    const m = LESSON_PATH.exec(path);
    const id = m?.[2];
    if (!m || !isLessonId(id)) {
      issues.push({ path, message: 'not a lesson path (expected ./phase-0N/T01..T23/lesson.ts)' });
      continue;
    }
    const expectedPhase = phaseOfLesson(id).order;
    if (Number(m[1]) !== expectedPhase) {
      issues.push({ path, message: `${id} belongs in phase-0${expectedPhase}` });
      continue;
    }
    registry[id] = loader;
  }
  return { registry, issues };
}

const built = buildLessonRegistry(
  import.meta.glob<LessonModule>('./phase-0[1-5]/T[0-2][0-9]/lesson.ts'),
);

/** Lesson id -> lazy loader, for every lesson file present in this build. */
export const lessonRegistry: LessonRegistry = built.registry;
/** Lesson files that were found but not registered (wrong folder / id). Shown by the platform, not hidden. */
export const lessonRegistryIssues: readonly RegistryIssue[] = built.issues;
