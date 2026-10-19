/** Course progress overview. Always shows where progress is stored (local-only demo label) and the education-only notice. */
import { LESSON_WORKING_TITLES } from '../../contracts';
import type { CourseSummary, LessonStatus } from '../progress/service';
import type { PersistenceMode } from '../progress/adapter';
import { EducationOnlyNotice } from './EducationOnlyNotice';

const STATUS_TEXT: Record<LessonStatus, string> = {
  'not-started': 'Not started', 'in-progress': 'In progress', completed: 'Completed (education only)', 'needs-review': 'Updated: please review',
};

export function ProgressDisplay({ summary, persistence }: { summary: CourseSummary; persistence: PersistenceMode }) {
  return (
    <section className="fe-assess-progress" aria-labelledby="fe-assess-progress-title">
      <h2 id="fe-assess-progress-title">Your learning progress</h2>
      <p className={`fe-assess-storage fe-assess-storage--${persistence}`} data-testid="persistence-label">{summary.persistenceLabel}</p>
      <div
        role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary.percentComplete}
        aria-valuetext={`${summary.lessonsCompleted} of ${summary.lessonsTotal} lessons completed`} className="fe-assess-progress__bar"
      >
        <span style={{ width: `${summary.percentComplete}%` }} />
      </div>
      <p>{summary.lessonsCompleted} of {summary.lessonsTotal} lessons completed.</p>
      <ol className="fe-assess-progress__lessons">
        {summary.lessons.map((l) => (
          <li key={l.lessonId} data-lesson-id={l.lessonId} data-status={l.status}>
            <span>{l.lessonId} {LESSON_WORKING_TITLES[l.lessonId]}</span>: <span>{STATUS_TEXT[l.status]}</span>
            {l.bestScore !== null ? <span> · best quiz {Math.round(l.bestScore * 100)}%</span> : null}
          </li>
        ))}
      </ol>
      <ul className="fe-assess-progress__checkpoints">
        {summary.checkpoints.map((c) => (
          <li key={c.checkpointId} data-checkpoint-id={c.checkpointId}>
            {c.checkpointId}: {c.passed ? 'Passed (education only)' : c.attempts ? `Not passed yet (${c.attempts} attempt(s))` : 'Not attempted'}
          </li>
        ))}
      </ul>
      {summary.courseCompleted ? <p className="fe-assess-badge fe-assess-badge--done">{summary.record.badgeText}</p> : null}
      <EducationOnlyNotice />
    </section>
  );
}
