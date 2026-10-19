/**
 * One lesson: Watch animation / View slides / Read notes / Try it / Take quiz / Review, all from the same lesson data.
 * Desktop: phase sidebar + main + definitions panel. Mobile: single column with a sticky Back/Next bar.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LESSON_IDS, LESSON_WORKING_TITLES, PHASES, type Fixture, type FixtureId, type Lesson, type LessonId, type LessonMode } from '@futures-edge/contracts';
import { loadLesson, LESSON_META } from '../content';
import { StoryboardTimeline } from '../motion/StoryboardTimeline';
import { EXERCISE_WIDGETS } from '../exercises/registry';
import { toAttempt } from '../assessment/grader';
import { SlideDeck } from './SlideDeck';
import { NotesReader } from './NotesReader';
import { QuizRunner } from './QuizRunner';
import { ReviewCard } from './ReviewCard';
import { RichText } from './RichText';
import { useProgress } from './progress-context';
import { Link } from './router';
import { useGlossary } from './hooks';
import { VideoLesson } from './VideoLesson';

const MODES: Array<{ id: LessonMode; label: string }> = [
  { id: 'animation', label: 'Watch animation' },
  { id: 'slides', label: 'View slides' },
  { id: 'notes', label: 'Read notes' },
  { id: 'practice', label: 'Try it' },
  { id: 'quiz', label: 'Take quiz' },
  { id: 'review', label: 'Review' },
];

export function LessonPlayer({ id }: { id: LessonId }) {
  const [state, setState] = useState<{ lesson: Lesson; fixtures: Fixture[] } | { error: string } | null>(null);
  useEffect(() => {
    let alive = true;
    setState(null);
    loadLesson(id).then((r) => { if (alive) setState(r); }, (e: unknown) => { if (alive) setState({ error: e instanceof Error ? e.message : 'Could not load this lesson.' }); });
    return () => { alive = false; };
  }, [id]);
  if (!state) return <div className="fel-loading" role="status">Loading lesson {id}…</div>;
  if ('error' in state) return (
    <div className="fel-error" role="alert">
      <p>{state.error}</p>
      <button type="button" className="fel-btn" onClick={() => window.location.reload()}>Try again</button>
    </div>
  );
  return <LessonView key={state.lesson.id} lesson={state.lesson} fixtures={state.fixtures} />;
}

function LessonView({ lesson, fixtures }: { lesson: Lesson; fixtures: Fixture[] }) {
  const { lessons, record } = useProgress();
  const prog = lessons[lesson.id];
  const [mode, setMode] = useState<LessonMode>(() => (prog?.lastStepId?.mode && MODES.some((m) => m.id === prog.lastStepId?.mode) ? prog.lastStepId.mode : 'animation'));
  const [attempt, setAttempt] = useState(0);
  const [sidebar, setSidebar] = useState(true);
  const fx = useMemo(() => new Map(fixtures.map((f) => [f.id, f])), [fixtures]);
  const getFixture = useCallback((fid: FixtureId) => fx.get(fid), [fx]);
  const ctx = useMemo(() => ({ scenes: lesson.animationScenes, getFixture }), [lesson, getFixture]);
  const { open } = useGlossary();

  const pick = (m: LessonMode) => { setMode(m); record(lesson, { kind: 'step', step: { mode: m } }); };
  const onSlide = useCallback((sid: string) => { record(lesson, { kind: 'slide', id: sid }); record(lesson, { kind: 'step', step: { mode: 'slides', itemId: sid } }); }, [lesson, record]);
  const onScene = useCallback((sid: string) => record(lesson, { kind: 'scene', id: sid }), [lesson, record]);
  const onStep = useCallback((_: number, sid: string) => record(lesson, { kind: 'step', step: { mode: 'animation', itemId: sid } }), [lesson, record]);
  const onRead = useCallback(() => record(lesson, { kind: 'notes' }), [lesson, record]);

  const idx = LESSON_IDS.indexOf(lesson.id);
  const prevId = idx > 0 ? LESSON_IDS[idx - 1] : undefined;
  const nextId = idx < LESSON_IDS.length - 1 ? LESSON_IDS[idx + 1] : undefined;
  const phase = PHASES.find((p) => p.id === lesson.phaseId);
  const mi = MODES.findIndex((m) => m.id === mode);
  const initialSlide = prog?.lastStepId?.mode === 'slides' && prog.lastStepId.itemId ? Math.max(0, lesson.slides.findIndex((s) => s.id === prog.lastStepId?.itemId)) : 0;
  const initialScene = prog?.lastStepId?.mode === 'animation' && prog.lastStepId.itemId ? Math.max(0, lesson.animationScenes.findIndex((s) => s.id === prog.lastStepId?.itemId)) : 0;
  const done = prog?.completed === true;

  return (
    <div className={`fel-lesson ${sidebar ? '' : 'no-sidebar'}`}>
      <nav className="fel-sidebar" aria-label="Course phases">
        <button type="button" className="fel-btn fel-btn-small fel-sidebar-toggle" aria-expanded={sidebar} onClick={() => setSidebar((v) => !v)}>{sidebar ? 'Hide lessons' : 'Show lessons'}</button>
        {sidebar ? PHASES.map((p) => (
          <div key={p.id} className="fel-side-phase">
            <p className="fel-side-phase-title">Phase {p.order}: {p.title}</p>
            <ul>{p.tutorialIds.map((t) => (
              <li key={t}><Link to={{ kind: 'lesson', id: t }} className={`fel-side-link ${t === lesson.id ? 'is-current' : ''}`} aria-current={t === lesson.id ? 'page' : undefined}>
                {lessons[t]?.completed ? '✓ ' : ''}{t} · {LESSON_META[t]?.title ?? LESSON_WORKING_TITLES[t]}
              </Link></li>
            ))}</ul>
          </div>
        )) : null}
      </nav>

      <main className="fel-lesson-main" id="fel-main">
        <p className="fel-crumbs"><Link to={{ kind: 'home' }}>Course</Link> › Phase {phase?.order}: {phase?.title} › {lesson.id}</p>
        <h1 className="fel-lesson-title"><RichText text={lesson.title} /></h1>
        <p className="fel-lesson-summary"><RichText text={lesson.summary} /></p>
        <p className="fel-meta">{lesson.durationMinutes} min · {lesson.difficulty.replace('-', ' ')} · content v{lesson.version}{done ? ' · ✓ completed' : ''}</p>
        <details className="fel-details fel-objectives">
          <summary>What you will be able to do</summary>
          <ul>{lesson.objectives.map((o, k) => <li key={k}><RichText text={o} /></li>)}</ul>
          {lesson.prerequisites.length ? <p className="fel-small">Helps to know first: {lesson.prerequisites.map((p, k) => <span key={p}>{k ? ', ' : ''}<Link to={{ kind: 'lesson', id: p }}>{p} {LESSON_META[p]?.title ?? ''}</Link></span>)}</p> : null}
        </details>
        <p className="fel-badge-fictional" role="note">{lesson.fictionalDataNotice}</p>

        <div className="fel-tabs" role="tablist" aria-label="Lesson formats">
          {MODES.map((m) => (
            <button key={m.id} type="button" role="tab" id={`tab-${m.id}`} aria-selected={mode === m.id} aria-controls="fel-panel" className={`fel-tab ${mode === m.id ? 'is-on' : ''}`} onClick={() => pick(m.id)}>
              {m.label}
              <StatusDot lesson={lesson} mode={m.id} />
            </button>
          ))}
        </div>

        <div id="fel-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className="fel-panel-main">
          {mode === 'animation' ? <VideoLesson id={lesson.id} /> : null}
          {mode === 'animation' ? <StoryboardTimeline scenes={lesson.animationScenes} getFixture={getFixture} initialStep={initialScene} onStepChange={onStep} onSceneComplete={onScene} title={lesson.title} /> : null}
          {mode === 'slides' ? <SlideDeck slides={lesson.slides} ctx={ctx} initial={initialSlide} onView={onSlide} title={lesson.title} /> : null}
          {mode === 'notes' ? <NotesReader lesson={lesson} ctx={ctx} onRead={onRead} /> : null}
          {mode === 'practice' ? (
            <div className="fel-practice">
              {lesson.exercises.map((x) => {
                const W = EXERCISE_WIDGETS[x.type];
                return <W key={x.id} exercise={x} fixture={getFixture(x.fixtureId)} onComplete={() => record(lesson, { kind: 'exercise', id: x.id })} />;
              })}
            </div>
          ) : null}
          {mode === 'quiz' ? (
            <div>
              <QuizRunner key={attempt} questions={lesson.quizQuestions} mode="lesson" attempt={attempt} getFixture={getFixture} passThreshold={lesson.completionRequirements.minQuizScore}
                onFinish={(resp) => { const t = new Date().toISOString(); record(lesson, { kind: 'quiz', attempt: toAttempt({ kind: 'lesson', lessonId: lesson.id }, lesson.version, lesson.quizQuestions, resp, t, t) }); }} />
              <button type="button" className="fel-btn" onClick={() => setAttempt((a) => a + 1)}>Retake quiz</button>
            </div>
          ) : null}
          {mode === 'review' ? <ReviewCard lesson={lesson} progress={prog} onPractice={() => pick('practice')} onRetake={() => { setAttempt((a) => a + 1); pick('quiz'); }} nextId={nextId} /> : null}
        </div>
      </main>

      <aside className="fel-defs" aria-label="Definitions in this lesson">
        <h2 className="fel-defs-title">Definitions</h2>
        <ul>{lesson.glossaryEntries.map((g) => (
          <li key={g.id}><button type="button" className="fel-link" onClick={() => open(g.id)}>{g.term}</button><span className="fel-small"> — <RichText text={g.plainDefinition} /></span></li>
        ))}</ul>
        <div className="fel-callout fel-callout-safety"><p className="fel-callout-title">Safety</p><p><RichText text={lesson.reviewCard.safetyNote} /></p></div>
        <LessonChecklist lesson={lesson} />
      </aside>

      <div className="fel-bottom-bar" role="navigation" aria-label="Lesson navigation">
        {mi > 0 ? <button type="button" className="fel-btn" onClick={() => pick((MODES[mi - 1] as (typeof MODES)[number]).id)}>◀ {MODES[mi - 1]?.label}</button> : prevId ? <Link className="fel-btn" to={{ kind: 'lesson', id: prevId }}>◀ {prevId}</Link> : <span />}
        {mi < MODES.length - 1 ? <button type="button" className="fel-btn fel-btn-primary" onClick={() => pick((MODES[mi + 1] as (typeof MODES)[number]).id)}>{MODES[mi + 1]?.label} ▶</button> : nextId ? <Link className="fel-btn fel-btn-primary" to={{ kind: 'lesson', id: nextId }}>Next lesson ▶</Link> : <Link className="fel-btn fel-btn-primary" to={{ kind: 'checkpoint', id: 'CPB' }}>Final checkpoint ▶</Link>}
      </div>
    </div>
  );
}

function StatusDot({ lesson, mode }: { lesson: Lesson; mode: LessonMode }) {
  const p = useProgress().lessons[lesson.id];
  if (!p) return null;
  const ok =
    mode === 'slides' ? lesson.slides.every((s) => p.viewed.slides.includes(s.id))
      : mode === 'animation' ? lesson.animationScenes.every((s) => p.viewed.scenesCompleted.includes(s.id))
        : mode === 'notes' ? p.viewed.notesRead
          : mode === 'practice' ? lesson.exercises.every((x) => p.practiced.exerciseIdsCompleted.includes(x.id))
            : mode === 'quiz' ? (p.assessed.bestScore ?? 0) >= lesson.completionRequirements.minQuizScore && p.assessed.safetyCriticalPassed
              : p.completed;
  return ok ? <span className="fel-tab-ok" aria-label="done"> ✓</span> : null;
}

function LessonChecklist({ lesson }: { lesson: Lesson }) {
  const p = useProgress().lessons[lesson.id];
  const cr = lesson.completionRequirements;
  const items = [
    ...(cr.requireAllSlidesViewed ? [{ t: 'All slides viewed', ok: !!p && lesson.slides.every((s) => p.viewed.slides.includes(s.id)) }] : []),
    ...(cr.requireAnimationCompleted ? [{ t: 'Animation watched', ok: !!p && lesson.animationScenes.every((s) => p.viewed.scenesCompleted.includes(s.id)) }] : []),
    ...cr.requireExerciseIds.map((x) => ({ t: `Practice ${x}`, ok: !!p?.practiced.exerciseIdsCompleted.includes(x) })),
    { t: `Quiz ≥ ${Math.round(cr.minQuizScore * 100)}%${cr.requireSafetyCriticalCorrect ? ' incl. safety items' : ''}`, ok: !!p && (p.assessed.bestScore ?? 0) >= cr.minQuizScore && (!cr.requireSafetyCriticalCorrect || p.assessed.safetyCriticalPassed) },
  ];
  return (
    <div className="fel-lesson-check">
      <p className="fel-small"><strong>To complete this lesson</strong> (saved on this device only)</p>
      <ul className="fel-checklist">{items.map((i) => <li key={i.t} className={i.ok ? 'is-done' : ''}>{i.ok ? '✓' : '○'} {i.t}</li>)}</ul>
    </div>
  );
}
