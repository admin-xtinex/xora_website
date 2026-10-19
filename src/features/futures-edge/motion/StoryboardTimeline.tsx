/**
 * Animated lesson timeline. Each step renders a registered scene at progress p = elapsed / duration, so seeking,
 * replaying and reduced motion are deterministic. requestAnimationFrame runs only while playing, on screen and with
 * the tab visible; every timer and observer is released on unmount.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PLAYBACK_SPEEDS, type AnimationScene, type Fixture, type FixtureId, type PlaybackSpeed } from '@futures-edge/contracts';
import { sceneRegistry } from './registry';
import { RichText } from '../platform/RichText';
import { useReducedMotion } from '../platform/hooks';

export interface StoryboardProps {
  scenes: AnimationScene[];
  getFixture: (id: FixtureId) => Fixture | undefined;
  initialStep?: number;
  onStepChange?: (index: number, sceneId: string) => void;
  onSceneComplete?: (sceneId: string) => void;
  title: string;
}

export function durationOf(s: AnimationScene): number {
  return s.durationMs ?? sceneRegistry.get(s.type)?.defaultDurationMs ?? 30_000;
}

export function StoryboardTimeline({ scenes, getFixture, initialStep = 0, onStepChange, onSceneComplete, title }: StoryboardProps) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(() => Math.min(Math.max(0, initialStep), scenes.length - 1));
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [asText, setAsText] = useState(false);
  const [visible, setVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const scene = scenes[step] as AnimationScene;
  const dur = durationOf(scene);
  const p = reduced ? 1 : Math.min(1, elapsed / dur);

  // Visibility: pause the loop when off-screen or the tab is hidden.
  useEffect(() => {
    const el = stageRef.current;
    let io: IntersectionObserver | undefined;
    if (el && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((entries) => setVisible(entries.some((e) => e.isIntersecting)), { threshold: 0.1 });
      io.observe(el);
    }
    const onVis = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', onVis);
    return () => { io?.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  const goTo = useCallback((i: number, autoplay = false) => {
    const n = Math.min(Math.max(0, i), scenes.length - 1);
    setStep(n);
    setElapsed(0);
    setPlaying(autoplay && !reduced);
    onStepChange?.(n, (scenes[n] as AnimationScene).id);
  }, [scenes, reduced, onStepChange]);

  // Under reduced motion a step counts as watched once shown as its static frame + description.
  useEffect(() => { if (reduced) onSceneComplete?.(scene.id); }, [reduced, scene.id, onSceneComplete]);

  // Animation loop.
  const last = useRef<number | null>(null);
  useEffect(() => {
    if (!playing || !visible || reduced) { last.current = null; return; }
    let raf = 0;
    const tick = (now: number) => {
      const prev = last.current ?? now;
      last.current = now;
      setElapsed((e) => Math.min(dur, e + (now - prev) * speed));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); last.current = null; };
  }, [playing, visible, reduced, speed, dur]);

  // Step end → mark complete, advance (or stop at the last step).
  useEffect(() => {
    if (reduced || elapsed < dur) return;
    onSceneComplete?.(scene.id);
    if (step < scenes.length - 1) goTo(step + 1, playing);
    else setPlaying(false);
  }, [elapsed, dur, reduced, scene.id, step, scenes.length, goTo, playing, onSceneComplete]);

  const Renderer = sceneRegistry.get(scene.type)?.render;
  const fixture = scene.fixtureId ? getFixture(scene.fixtureId) : undefined;
  const totalMs = useMemo(() => scenes.reduce((n, s) => n + durationOf(s), 0), [scenes]);
  const doneMs = scenes.slice(0, step).reduce((n, s) => n + durationOf(s), 0) + (reduced ? dur : elapsed);
  const ended = step === scenes.length - 1 && elapsed >= dur;

  return (
    <section className="fe-storyboard" aria-label={`Animated scene: ${title}`}>
      <div className="fe-stage" ref={stageRef}>
        {asText ? (
          <ol className="fe-transcript">
            {scenes.map((s, k) => (
              <li key={s.id} className={k === step ? 'is-current' : ''}>
                <p><strong>Step {k + 1}.</strong> <RichText text={s.caption} /></p>
                {s.narration ? <p><RichText text={s.narration} /></p> : null}
                <p className="fe-muted"><RichText text={s.reducedMotionDescription} /></p>
              </li>
            ))}
          </ol>
        ) : Renderer ? (
          <Renderer params={scene.parameters} p={p} {...(fixture ? { fixture } : {})} />
        ) : (
          <p className="fe-error">This scene type is not available.</p>
        )}
      </div>

      <div className="fe-caption" aria-live="polite" aria-atomic="true">
        <span className="fe-caption-step">Step {step + 1} of {scenes.length}</span>
        <RichText text={scene.caption} />
      </div>
      {reduced && !asText ? <p className="fe-reduced-note"><RichText text={scene.reducedMotionDescription} /></p> : null}
      {scene.pauseForInteraction && p >= 1 ? <p className="fe-tip"><RichText text={scene.pauseForInteraction.prompt} /></p> : null}

      <div className="fe-controls" role="group" aria-label="Animation controls">
        <button type="button" className="fe-btn" onClick={() => goTo(step - 1)} disabled={step === 0} aria-label="Previous step">◀ Prev</button>
        {!reduced ? (
          <button type="button" className="fe-btn fe-btn-primary" onClick={() => { if (ended) goTo(0, true); else setPlaying((v) => !v); }} aria-pressed={playing}>
            {playing ? 'Pause' : ended ? 'Replay' : elapsed > 0 ? 'Resume' : 'Play'}
          </button>
        ) : null}
        <button type="button" className="fe-btn" onClick={() => goTo(step + 1, playing)} disabled={step === scenes.length - 1} aria-label="Next step">Next ▶</button>
        {!reduced ? <button type="button" className="fe-btn" onClick={() => setElapsed(dur)} aria-label="Skip to the end of this step">Skip</button> : null}
        <button type="button" className="fe-btn" onClick={() => goTo(0)}>Restart</button>
        {!reduced ? (
          <label className="fe-speed">
            Speed
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value) as PlaybackSpeed)}>
              {PLAYBACK_SPEEDS.map((s) => <option key={s} value={s}>{s}×</option>)}
            </select>
          </label>
        ) : null}
        <button type="button" className="fe-btn" onClick={() => setAsText((v) => !v)} aria-pressed={asText}>{asText ? 'Show animation' : 'Read as text'}</button>
      </div>
      <progress className="fe-timeline-progress" max={totalMs} value={doneMs} aria-label="Timeline progress" />
      <ol className="fe-steps" aria-label="Animation steps">
        {scenes.map((s, k) => (
          <li key={s.id}>
            <button type="button" className={`fe-step-dot ${k === step ? 'is-current' : ''}`} onClick={() => goTo(k)} aria-current={k === step ? 'step' : undefined} aria-label={`Go to step ${k + 1}`}>{k + 1}</button>
          </li>
        ))}
      </ol>
      {reduced ? <p className="fe-muted fe-small">Reduced motion is on: each step shows its final state with a written description.</p> : null}
    </section>
  );
}
