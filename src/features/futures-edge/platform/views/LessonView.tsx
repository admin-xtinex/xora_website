import { LESSON_IDS, LESSON_WORKING_TITLES, phaseOfLesson, type LessonId } from '@futures-edge/contracts';
import { lessonRegistry, type LessonRegistry } from '@futures-edge/content';
import { useLesson } from '../content-loader';
import { FeLink } from '../FeLink';
import { RichText } from '../RichText';
import { pathFor } from '../router';

const MAX_ERRORS_SHOWN = 5;

/**
 * Lesson shell. Renders only what the validated `Lesson` data contains. Missing, invalid or failed content gets an
 * explicit state; there is no completion or progress display until the assessment module provides real data.
 */
export function LessonView({ lessonId, registry = lessonRegistry }: { lessonId: LessonId; registry?: LessonRegistry }) {
  const state = useLesson(lessonId, registry);
  const phase = phaseOfLesson(lessonId);
  const index = LESSON_IDS.indexOf(lessonId);
  const prev = index > 0 ? LESSON_IDS[index - 1] : undefined;
  const next = index < LESSON_IDS.length - 1 ? LESSON_IDS[index + 1] : undefined;

  return (
    <article aria-labelledby="fe-page-title" aria-busy={state.status === 'loading'}>
      <p className="fe-crumb">
        <FeLink to={pathFor({ name: 'home' })} className="fe-link">
          Course
        </FeLink>{' '}
        / Phase {phase.order}: {phase.title} / {lessonId}
      </p>

      {state.status === 'loading' && (
        <>
          <h1 id="fe-page-title" className="fe-title" tabIndex={-1}>
            {lessonId}: {LESSON_WORKING_TITLES[lessonId]}
          </h1>
          <p role="status" className="fe-status">
            Loading lesson…
          </p>
        </>
      )}

      {state.status === 'not-published' && (
        <>
          <h1 id="fe-page-title" className="fe-title" tabIndex={-1}>
            {lessonId}: {LESSON_WORKING_TITLES[lessonId]}
          </h1>
          <div role="alert" className="fe-alert" data-testid="fe-empty-content">
            <strong>Lesson content not available.</strong> {lessonId} has not been published in this build, so there is
            nothing to show yet. It is not marked as started or completed.
          </div>
        </>
      )}

      {state.status === 'invalid' && (
        <>
          <h1 id="fe-page-title" className="fe-title" tabIndex={-1}>
            {lessonId}: {LESSON_WORKING_TITLES[lessonId]}
          </h1>
          <div role="alert" className="fe-alert fe-alert-error" data-testid="fe-invalid-content">
            <strong>This lesson's content failed validation</strong> ({state.errors.length} error
            {state.errors.length === 1 ? '' : 's'}) and was not shown.
            <ul>
              {state.errors.slice(0, MAX_ERRORS_SHOWN).map((e, i) => (
                <li key={i}>
                  <code>{e.code}</code> at <code>{e.path}</code>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {state.status === 'load-error' && (
        <>
          <h1 id="fe-page-title" className="fe-title" tabIndex={-1}>
            {lessonId}: {LESSON_WORKING_TITLES[lessonId]}
          </h1>
          <div role="alert" className="fe-alert fe-alert-error" data-testid="fe-load-error">
            <strong>The lesson could not be loaded.</strong> Check your connection and reload the page.
          </div>
        </>
      )}

      {state.status === 'ready' && (
        <div data-testid="fe-lesson-ready">
          <h1 id="fe-page-title" className="fe-title" tabIndex={-1}>
            {lessonId}: <RichText text={state.lesson.title} />
          </h1>
          <p className="fe-lead">
            <RichText text={state.lesson.summary} />
          </p>
          <p className="fe-muted">
            About {state.lesson.durationMinutes} min · {state.lesson.difficulty} · content v{state.lesson.version}
          </p>
          <aside className="fe-callout" aria-label="Fictional data notice">
            <RichText text={state.lesson.fictionalDataNotice} />
          </aside>
          <h2 className="fe-h2">You will be able to</h2>
          <ul className="fe-list">
            {state.lesson.objectives.map((o, i) => (
              <li key={i}>
                <RichText text={o} />
              </li>
            ))}
          </ul>
          <h2 className="fe-h2">In this lesson</h2>
          <ul className="fe-list" data-testid="fe-lesson-sections">
            <li>{state.lesson.slides.length} slides</li>
            <li>{state.lesson.animationScenes.length} animation scenes</li>
            <li>{state.lesson.exercises.length} practice exercise(s)</li>
            <li>{state.lesson.quizQuestions.length} quiz questions</li>
            <li>{state.lesson.notesSections.length} notes sections</li>
          </ul>
        </div>
      )}

      <nav aria-label="Lesson navigation" className="fe-pager">
        {prev ? (
          <FeLink to={pathFor({ name: 'lesson', lessonId: prev })} className="fe-link" rel="prev">
            ← {prev}
          </FeLink>
        ) : (
          <span />
        )}
        {next && (
          <FeLink to={pathFor({ name: 'lesson', lessonId: next })} className="fe-link" rel="next">
            {next} →
          </FeLink>
        )}
      </nav>
    </article>
  );
}
