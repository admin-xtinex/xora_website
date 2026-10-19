/** Formal checkpoints (CP1, CPA, CPB): exam mode, safety-critical tracking, remediation, unlimited retries. */
import { useEffect, useState } from 'react';
import type { CheckpointConfig, CheckpointId, Fixture, FixtureId, Question } from '@futures-edge/contracts';
import { lessonIdOf } from '@futures-edge/contracts';
import { loadCheckpoint } from '../assessment/checkpoints';
import { loadLesson } from '../content';
import { toAttempt, type GradeResult } from '../assessment/grader';
import { QuizRunner } from './QuizRunner';
import { RichText } from './RichText';
import { useProgress } from './progress-context';
import { Link } from './router';

interface Loaded { config: CheckpointConfig; questions: Question[]; fixtures: Map<FixtureId, Fixture> }

export function CheckpointExam({ id }: { id: CheckpointId }) {
  const [data, setData] = useState<Loaded | { error: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [started, setStarted] = useState(false);
  const [last, setLast] = useState<GradeResult | null>(null);
  const { checkpoints, recordCheckpoint } = useProgress();
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const config = await loadCheckpoint(id);
        const lessonIds = [...new Set(config.questionIds.map((q) => lessonIdOf(q)).filter((x): x is NonNullable<typeof x> => !!x))];
        const loaded = await Promise.all(lessonIds.map(loadLesson));
        const byQ = new Map<string, Question>();
        const fixtures = new Map<FixtureId, Fixture>();
        for (const l of loaded) { for (const q of l.lesson.quizQuestions) byQ.set(q.id, q); for (const f of l.fixtures) fixtures.set(f.id, f); }
        const questions = [...config.questionIds.map((q) => byQ.get(q)).filter((q): q is Question => !!q), ...config.items];
        if (alive) setData({ config, questions, fixtures });
      } catch (e) {
        if (alive) setData({ error: e instanceof Error ? e.message : 'Could not load this checkpoint.' });
      }
    })();
    return () => { alive = false; };
  }, [id]);
  if (!data) return <div className="fel-loading" role="status">Loading checkpoint…</div>;
  if ('error' in data) return <div className="fel-error" role="alert">{data.error}</div>;
  const { config, questions, fixtures } = data;
  const prog = checkpoints[id];
  return (
    <main className="fel-page" id="fel-main">
      <p className="fel-crumbs"><Link to={{ kind: 'home' }}>Course</Link> › Checkpoint</p>
      <h1>{config.title}</h1>
      <p><RichText text={config.disclaimer} /></p>
      <ul className="fel-meta-list">
        <li>{questions.length} questions covering {config.coversLessonIds[0]}–{config.coversLessonIds[config.coversLessonIds.length - 1]}</li>
        <li>Target: {Math.round(config.passThreshold * 100)}%{config.safetyCriticalMustBeCorrect ? ', and every safety-critical item correct' : ''}</li>
        <li>{config.gating ? 'Recommended before moving on' : 'Optional: it does not lock any lesson'} · unlimited retries</li>
        {prog ? <li>Your attempts: {prog.attempts.length}{prog.passed ? ' · passed ✓' : ''} (saved on this device only)</li> : null}
      </ul>
      {!started ? (
        <button type="button" className="fel-btn fel-btn-primary" onClick={() => setStarted(true)}>Start checkpoint</button>
      ) : (
        <>
          <QuizRunner key={attempt} questions={questions} mode="exam" attempt={attempt} passThreshold={config.passThreshold} getFixture={(f) => fixtures.get(f)}
            onFinish={(resp, g) => {
              const t = new Date().toISOString();
              const passed = g.score >= config.passThreshold && (!config.safetyCriticalMustBeCorrect || g.safetyCriticalAllCorrect);
              setLast(g);
              recordCheckpoint(id, config.version, toAttempt({ kind: 'checkpoint', checkpointId: id }, config.version, questions, resp, t, t), passed);
            }} />
          {last ? (
            <div className="fel-row fel-wrap">
              <button type="button" className="fel-btn fel-btn-primary" onClick={() => { setAttempt((a) => a + 1); setLast(null); }}>Try again</button>
              <Link className="fel-btn" to={{ kind: 'home' }}>Back to the course</Link>
            </div>
          ) : null}
          {last && id === 'CPB' && last.score >= config.passThreshold && last.safetyCriticalAllCorrect ? <CertificatePreview /> : null}
        </>
      )}
    </main>
  );
}

function CertificatePreview() {
  return (
    <section className="fel-certificate" aria-label="Learning certificate preview">
      <p className="fel-small fel-muted">LEARNING CERTIFICATE — PREVIEW</p>
      <h2>XORA Futures Edge · Course completed</h2>
      <p>You completed 23 lessons and the final checkpoint of this educational course.</p>
      <p className="fel-small">This is <strong>not</strong> a professional certification, not financial advice and not permission or proof of readiness to trade. Practice stays simulated; real trading can lose money.</p>
    </section>
  );
}
