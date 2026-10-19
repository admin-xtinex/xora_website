/** Course home: intro, optional diagnostic, continue/review, five-phase roadmap, checkpoints, FAQ, accessibility. */
import { useState } from 'react';
import { LESSON_IDS, LESSON_WORKING_TITLES, PHASES, type LessonId } from '@futures-edge/contracts';
import { LESSON_META } from '../content';
import { CHECKPOINT_TITLES } from '../assessment/checkpoints';
import { useProgress } from './progress-context';
import { Link } from './router';

const DIAGNOSTIC = [
  { id: 'd1', q: 'Do you know what BTC/USDT means?', start: 'T03' as LessonId },
  { id: 'd2', q: 'Could you explain buy, sell, long and short?', start: 'T05' as LessonId },
  { id: 'd3', q: 'Can you read open, high, low and close on a candle?', start: 'T14' as LessonId },
];

export function CourseHome() {
  const { lessons, checkpoints, ready, reset } = useProgress();
  const [diag, setDiag] = useState<Record<string, boolean>>({});
  const [confirmReset, setConfirmReset] = useState(false);
  const completed = LESSON_IDS.filter((id) => lessons[id]?.completed).length;
  const recent = Object.values(lessons).filter((p) => p && !p.completed).sort((a, b) => (b?.lastUpdatedAt ?? '').localeCompare(a?.lastUpdatedAt ?? ''))[0];
  const weak = LESSON_IDS.filter((id) => { const p = lessons[id]; return p && p.assessed.attempts > 0 && ((p.assessed.bestScore ?? 0) < 0.8 || !p.assessed.safetyCriticalPassed); });
  const firstNo = DIAGNOSTIC.find((d) => diag[d.id] === false);
  const allYes = DIAGNOSTIC.every((d) => diag[d.id] === true);

  return (
    <main className="fe-page fe-home" id="fe-main">
      <section className="fe-hero-panel">
        <p className="fe-kicker">XORA Futures Edge</p>
        <h1>Learn crypto futures from zero, one small step at a time</h1>
        <p>23 short lessons in 5 phases. Each lesson has an animation, slides, written notes, a hands-on exercise and a quiz, all built from the same content. Every price is fictional, and nothing here can place a real order.</p>
        <p className="fe-small fe-muted">Education and simulated practice only. Not financial advice. Trading crypto futures can lose more than you expect; waiting or not trading is always allowed.</p>
        <div className="fe-row fe-wrap">
          <Link className="fe-btn fe-btn-primary" to={{ kind: 'lesson', id: recent?.lessonId ?? 'T01' }}>{recent ? `Continue ${recent.lessonId}` : 'Start with T01'}</Link>
          <Link className="fe-btn" to={{ kind: 'glossary' }}>Open glossary</Link>
        </div>
        <p className="fe-small" aria-live="polite">{ready ? `${completed} of 23 lessons completed` : 'Loading your progress…'} · progress is saved on this device only.</p>
        <progress className="fe-course-progress" max={23} value={completed} aria-label="Course progress" />
      </section>

      <section className="fe-section" aria-labelledby="diag-h">
        <h2 id="diag-h">New to crypto? Quick self-check (optional)</h2>
        <p className="fe-small">Not a test and it locks nothing. It only suggests where to start.</p>
        {DIAGNOSTIC.map((d) => (
          <fieldset key={d.id} className="fe-diag">
            <legend>{d.q}</legend>
            <div className="fe-seg">
              {[true, false].map((v) => (
                <label key={String(v)} className={`fe-seg-opt ${diag[d.id] === v ? 'is-on' : ''}`}><input type="radio" name={d.id} checked={diag[d.id] === v} onChange={() => setDiag((s) => ({ ...s, [d.id]: v }))} /><span>{v ? 'Yes' : 'Not yet'}</span></label>
              ))}
            </div>
          </fieldset>
        ))}
        {firstNo ? <p>Suggestion: start at <Link to={{ kind: 'lesson', id: DIAGNOSTIC[0] === firstNo ? 'T01' : firstNo.start }}>{DIAGNOSTIC[0] === firstNo ? 'T01' : firstNo.start}</Link>. You can still open any lesson.</p> : allYes ? <p>You already know the basics. You could skim Phase 1 and start at <Link to={{ kind: 'lesson', id: 'T05' }}>T05</Link>, but the safety lessons T12, T13 and T22 are worth everyone’s time.</p> : null}
      </section>

      {weak.length ? (
        <section className="fe-section" aria-labelledby="weak-h">
          <h2 id="weak-h">Review weak topics</h2>
          <ul className="fe-inline-list">{weak.map((id) => <li key={id}><Link to={{ kind: 'lesson', id }}>{id} · {LESSON_META[id]?.title}</Link></li>)}</ul>
        </section>
      ) : null}

      <section className="fe-section" aria-labelledby="road-h">
        <h2 id="road-h">Your roadmap</h2>
        <ol className="fe-roadmap">
          {PHASES.map((ph) => (
            <li key={ph.id} className="fe-phase">
              <div className="fe-phase-head">
                <p className="fe-kicker">Phase {ph.order}</p>
                <h3>{ph.title}</h3>
                <p className="fe-small">{ph.goal}</p>
              </div>
              <ul className="fe-cards">
                {ph.tutorialIds.map((id) => {
                  const m = LESSON_META[id];
                  const p = lessons[id];
                  return (
                    <li key={id}>
                      <Link to={{ kind: 'lesson', id }} className={`fe-card ${p?.completed ? 'is-done' : ''}`}>
                        <span className="fe-card-id">{id}</span>
                        <span className="fe-card-title">{m?.title ?? LESSON_WORKING_TITLES[id]}</span>
                        <span className="fe-card-sum">{m?.summary ?? ''}</span>
                        <span className="fe-card-meta">{m ? `${m.durationMinutes} min` : ''}{p ? ` · ${p.completed ? '✓ completed' : p.assessed.bestScore !== null ? `quiz best ${Math.round(p.assessed.bestScore * 100)}%` : 'started'}` : ''}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {ph.checkpointAfter ? (
                <Link to={{ kind: 'checkpoint', id: ph.checkpointAfter }} className={`fe-checkpoint-card ${checkpoints[ph.checkpointAfter]?.passed ? 'is-done' : ''}`}>
                  <span className="fe-badge">{checkpoints[ph.checkpointAfter]?.passed ? '🏅 Passed' : 'Checkpoint'}</span>
                  <span>{CHECKPOINT_TITLES[ph.checkpointAfter]}</span>
                </Link>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="fe-section" aria-labelledby="faq-h">
        <h2 id="faq-h">FAQ</h2>
        <details className="fe-details"><summary>Is this real trading?</summary><p>No. Every price, coin and order book is fictional. Nothing in this course connects to an exchange, asks for API keys or sends an order.</p></details>
        <details className="fe-details"><summary>Will finishing the course make me profitable?</summary><p>No course can promise that. Completing it shows you understand the basic ideas and risks. Many traders lose money, especially with leverage.</p></details>
        <details className="fe-details"><summary>Where is my progress saved?</summary><p>Only in this browser on this device. Clearing site data removes it. Nothing is sent to a server.</p></details>
        <details className="fe-details"><summary>Is it available in Malayalam or Hindi?</summary><p>The course is written in simple English first. Malayalam and Hindi versions are prepared but will only appear after a human translator has reviewed them.</p></details>
        <details className="fe-details"><summary>Are the fees and rates real?</summary><p>No. Lessons use clearly labelled illustrative numbers (for example 0.05% per side). Real rates depend on the exchange, your account and the day. Always check your own platform.</p></details>
      </section>

      <section className="fe-section" aria-labelledby="a11y-h">
        <h2 id="a11y-h">Accessibility</h2>
        <p>Everything works with a keyboard and a screen reader. Animations have captions, a “Read as text” view and respect your device’s reduced-motion setting. Every drag or slider has a typing alternative. Colour is never the only signal.</p>
        <h2>Feedback</h2>
        <p>Found a mistake or something confusing? <a href="mailto:info@xtinex.com?subject=XORA%20Futures%20Edge%20feedback">Email the XORA team</a>. Please don’t include passwords, keys or account details.</p>
        <div className="fe-row">
          {confirmReset ? (
            <>
              <span>Erase all progress on this device?</span>
              <button type="button" className="fe-btn" onClick={() => { reset(); setConfirmReset(false); }}>Yes, erase</button>
              <button type="button" className="fe-btn" onClick={() => setConfirmReset(false)}>Cancel</button>
            </>
          ) : <button type="button" className="fe-btn fe-btn-small" onClick={() => setConfirmReset(true)}>Reset my progress</button>}
        </div>
      </section>
    </main>
  );
}
