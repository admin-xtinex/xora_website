import { LESSON_WORKING_TITLES, PHASES } from '@futures-edge/contracts';
import { lessonRegistry, lessonRegistryIssues, type LessonRegistry } from '@futures-edge/content';
import { FeLink } from '../FeLink';
import { pathFor } from '../router';

/** Course overview + phase roadmap. Titles and phase data come from the contracts (PHASES, LESSON_WORKING_TITLES). */
export function CourseHome({ registry = lessonRegistry }: { registry?: LessonRegistry }) {
  const published = PHASES.flatMap((p) => p.tutorialIds).filter((id) => registry[id]).length;
  const total = PHASES.reduce((n, p) => n + p.tutorialIds.length, 0);
  return (
    <section aria-labelledby="fe-page-title">
      <h1 id="fe-page-title" className="fe-title" tabIndex={-1}>
        XORA Futures Edge
      </h1>
      <p className="fe-lead">
        Beginner crypto-futures education. Lessons use fictional data and simulated practice only. This is education,
        not financial advice, and nothing here places a real order.
      </p>
      <p className="fe-status" data-testid="fe-published-count">
        {published} of {total} lessons published in this build. Progress is not tracked yet.
      </p>
      {lessonRegistryIssues.length > 0 && (
        <div role="alert" className="fe-alert">
          {lessonRegistryIssues.length} lesson file(s) are in the wrong place and were not loaded.
        </div>
      )}
      <ol className="fe-phases">
        {PHASES.map((phase) => (
          <li key={phase.id} className="fe-phase">
            <h2 className="fe-phase-title">
              Phase {phase.order}: {phase.title}
            </h2>
            <p className="fe-muted">{phase.goal}</p>
            <ul className="fe-lessons">
              {phase.tutorialIds.map((id) => {
                const available = Boolean(registry[id]);
                return (
                  <li key={id} className="fe-lesson-row">
                    <FeLink to={pathFor({ name: 'lesson', lessonId: id })} className="fe-link">
                      <span className="fe-lesson-id">{id}</span> {LESSON_WORKING_TITLES[id]}
                    </FeLink>
                    <span className={available ? 'fe-badge fe-badge-ready' : 'fe-badge'}>
                      {available ? 'Published' : 'Not published yet'}
                    </span>
                  </li>
                );
              })}
            </ul>
            {phase.checkpointAfter && (
              <p className="fe-muted">
                Checkpoint:{' '}
                <FeLink to={pathFor({ name: 'checkpoint', checkpointId: phase.checkpointAfter })} className="fe-link">
                  {phase.checkpointAfter}
                </FeLink>
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
