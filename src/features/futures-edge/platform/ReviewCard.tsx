/** One-screen recap: takeaways, three key terms, safety note, retrieval question, next actions. */
import { useState } from 'react';
import type { Lesson, LessonId, Progress } from '@futures-edge/contracts';
import { RichText } from './RichText';
import { Link } from './router';
import { useGlossary } from './hooks';

export function ReviewCard({ lesson, progress, onPractice, onRetake, nextId }: { lesson: Lesson; progress: Progress | undefined; onPractice: () => void; onRetake: () => void; nextId: LessonId | undefined }) {
  const { byId, open } = useGlossary();
  const [reveal, setReveal] = useState(false);
  return (
    <section className="fe-review" aria-label={`Review card: ${lesson.title}`}>
      <p className="fe-small fe-muted">Review time ≈ {lesson.reviewCard.reviewMinutes} min</p>
      <h3>Three things to remember</h3>
      <ol>{lesson.takeaways.map((t, k) => <li key={k}><RichText text={t} /></li>)}</ol>
      <h3>Key terms</h3>
      <ul className="fe-term-cards">
        {lesson.reviewCard.keyTermIds.map((t) => {
          const g = byId.get(t);
          return <li key={t}><button type="button" className="fe-term-card" onClick={() => open(t)}><strong>{g?.term ?? t}</strong><span><RichText text={g?.plainDefinition ?? ''} /></span></button></li>;
        })}
      </ul>
      <div className="fe-callout fe-callout-safety"><p className="fe-callout-title">Main safety note</p><p><RichText text={lesson.reviewCard.safetyNote} /></p></div>
      <div className="fe-retrieval">
        <p><strong>Try to answer from memory: </strong><RichText text={lesson.reviewCard.retrievalQuestion} /></p>
        <button type="button" className="fe-link" aria-expanded={reveal} onClick={() => setReveal((v) => !v)}>{reveal ? 'Hide' : 'Show'} where to find the answer</button>
        {reveal ? <p className="fe-small">Check the Notes tab (sections “Example” and “Quick revision”) or rewatch the animation.</p> : null}
      </div>
      <p className="fe-small">Status: {progress?.completed ? `completed on ${new Date(progress.completedAt ?? progress.lastUpdatedAt).toLocaleDateString()}` : 'not completed yet'} · best quiz score {progress?.assessed.bestScore !== null && progress?.assessed.bestScore !== undefined ? `${Math.round(progress.assessed.bestScore * 100)}%` : '—'}</p>
      <div className="fe-row fe-wrap fe-noprint">
        <button type="button" className="fe-btn" onClick={onPractice}>Practice again</button>
        <button type="button" className="fe-btn" onClick={onRetake}>Retake quiz</button>
        <button type="button" className="fe-btn" onClick={() => window.print()}>Print this card</button>
        {nextId ? <Link className="fe-btn fe-btn-primary" to={{ kind: 'lesson', id: nextId }}>Continue to {nextId}</Link> : <Link className="fe-btn fe-btn-primary" to={{ kind: 'checkpoint', id: 'CPB' }}>Continue to the final checkpoint</Link>}
      </div>
    </section>
  );
}
