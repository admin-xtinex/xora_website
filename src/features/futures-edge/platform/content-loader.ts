/**
 * Lesson content loader (EDGE-01). Loads a lesson through the lazy registry and validates it with the contract
 * validator before anything is rendered. Every failure is a distinct, visible state; nothing is faked.
 */
import { useEffect, useState } from 'react';
import { validateLesson, type Lesson, type LessonId, type ValidationIssue } from '@futures-edge/contracts';
import { lessonRegistry, type LessonRegistry } from '@futures-edge/content';

export type LessonLoadResult =
  | { status: 'ready'; lessonId: LessonId; lesson: Lesson; warnings: ValidationIssue[] }
  /** No lesson file exists in this build yet. */
  | { status: 'not-published'; lessonId: LessonId }
  /** A file exists but fails the contract validator (or is for another lesson id). */
  | { status: 'invalid'; lessonId: LessonId; errors: ValidationIssue[]; warnings: ValidationIssue[] }
  /** The chunk failed to load or threw. */
  | { status: 'load-error'; lessonId: LessonId; message: string };

export type LessonLoadState = { status: 'loading'; lessonId: LessonId } | LessonLoadResult;

export async function loadLesson(lessonId: LessonId, registry: LessonRegistry = lessonRegistry): Promise<LessonLoadResult> {
  const loader = registry[lessonId];
  if (!loader) return { status: 'not-published', lessonId };
  let data: unknown;
  try {
    const mod = await loader();
    data = (mod as { default?: unknown } | undefined)?.default;
  } catch (err) {
    return { status: 'load-error', lessonId, message: err instanceof Error ? err.message : String(err) };
  }
  const result = validateLesson(data);
  if (!result.ok) return { status: 'invalid', lessonId, errors: result.errors, warnings: result.warnings };
  if (result.value.id !== lessonId) {
    return {
      status: 'invalid',
      lessonId,
      errors: [{ path: 'lesson.id', code: 'LESSON_ID_MISMATCH', message: `file for ${lessonId} contains ${result.value.id}`, severity: 'error' }],
      warnings: result.warnings,
    };
  }
  return { status: 'ready', lessonId, lesson: result.value, warnings: result.warnings };
}

/** React hook around loadLesson; ignores results that arrive after the lesson id changed. */
export function useLesson(lessonId: LessonId, registry: LessonRegistry = lessonRegistry): LessonLoadState {
  const [state, setState] = useState<LessonLoadState>({ status: 'loading', lessonId });
  useEffect(() => {
    let live = true;
    setState({ status: 'loading', lessonId });
    loadLesson(lessonId, registry).then((r) => {
      if (live) setState(r);
    });
    return () => {
      live = false;
    };
  }, [lessonId, registry]);
  return state.lessonId === lessonId ? state : { status: 'loading', lessonId };
}
