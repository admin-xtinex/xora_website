/** Native HTML slide deck: Next/Back, arrow keys, progress dots, speaker notes, fullscreen, print view. */
import { useEffect, useRef, useState } from 'react';
import type { Slide } from '@futures-edge/contracts';
import { Blocks, FixtureFigure, SceneStill, type BlockCtx } from './Blocks';
import { RichText } from './RichText';

export function SlideDeck({ slides, ctx, initial = 0, onView, title }: { slides: Slide[]; ctx: BlockCtx; initial?: number; onView: (slideId: string, index: number) => void; title: string }) {
  const [i, setI] = useState(Math.min(Math.max(0, initial), slides.length - 1));
  const [notes, setNotes] = useState(false);
  const [printAll, setPrintAll] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const live = useRef<HTMLParagraphElement | null>(null);
  const slide = slides[i] as Slide;

  useEffect(() => { onView(slide.id, i); }, [slide.id, i, onView]);

  const go = (n: number) => setI(Math.min(Math.max(0, n), slides.length - 1));
  const canFs = typeof document !== 'undefined' && typeof document.documentElement.requestFullscreen === 'function';
  const fullscreen = () => { const el = ref.current; if (!el) return; if (document.fullscreenElement) void document.exitFullscreen(); else void el.requestFullscreen?.().catch(() => {}); };

  if (printAll) {
    return (
      <section className="fel-print-deck" aria-label={`All slides: ${title}`}>
        <div className="fel-row fel-noprint">
          <button type="button" className="fel-btn" onClick={() => setPrintAll(false)}>Back to slide view</button>
          <button type="button" className="fel-btn fel-btn-primary" onClick={() => window.print()}>Print</button>
        </div>
        {slides.map((s, k) => (
          <article key={s.id} className="fel-slide fel-slide-print">
            <p className="fel-slide-count">Slide {k + 1} of {slides.length}</p>
            <h3><RichText text={s.title} /></h3>
            <Blocks blocks={s.blocks} ctx={ctx} />
            <p className="fel-small"><strong>Narration: </strong><RichText text={s.narrationText} /></p>
            {s.speakerNotes ? <p className="fel-small"><strong>Speaker notes: </strong><RichText text={s.speakerNotes} /></p> : null}
          </article>
        ))}
      </section>
    );
  }

  const vr = slide.visualRef;
  const scene = vr?.kind === 'scene' ? ctx.scenes.find((s) => s.id === vr.sceneId) : undefined;
  return (
    <section className="fel-deck" aria-roledescription="slide deck" aria-label={`Slides: ${title}`} ref={ref}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      }}>
      <article className="fel-slide" aria-roledescription="slide" aria-label={`Slide ${i + 1} of ${slides.length}`}>
        <p className="fel-slide-count">Slide {i + 1} of {slides.length}</p>
        <h3 className="fel-slide-title"><RichText text={slide.title} /></h3>
        <div className={`fel-slide-body ${vr && vr.kind !== 'none' ? 'has-visual' : ''}`}>
          <div className="fel-slide-text"><Blocks blocks={slide.blocks} ctx={ctx} /></div>
          {scene ? <div className="fel-slide-visual"><SceneStill scene={scene} ctx={ctx} /></div> : null}
          {vr?.kind === 'fixture' ? <div className="fel-slide-visual"><FixtureFigure fixture={ctx.getFixture(vr.fixtureId)} caption={vr.textAlternative} alt={vr.textAlternative} /></div> : null}
        </div>
        <details className="fel-details fel-slide-narration">
          <summary>Read explanation</summary>
          <p><RichText text={slide.narrationText} /></p>
        </details>
        {notes && slide.speakerNotes ? <p className="fel-speaker-notes"><strong>Speaker notes: </strong><RichText text={slide.speakerNotes} /></p> : null}
      </article>
      <p className="fel-sr" aria-live="polite" ref={live}>Slide {i + 1} of {slides.length}: {slide.title}</p>
      <div className="fel-deck-nav">
        <button type="button" className="fel-btn" onClick={() => go(i - 1)} disabled={i === 0}>◀ Back</button>
        <ol className="fel-dots" aria-label="Slides">
          {slides.map((s, k) => (
            <li key={s.id}><button type="button" className={`fel-dot ${k === i ? 'is-current' : ''}`} aria-label={`Slide ${k + 1}: ${s.title}`} aria-current={k === i ? 'step' : undefined} onClick={() => go(k)} /></li>
          ))}
        </ol>
        <button type="button" className="fel-btn fel-btn-primary" onClick={() => go(i + 1)} disabled={i === slides.length - 1}>Next ▶</button>
      </div>
      <div className="fel-row fel-wrap fel-deck-tools">
        <button type="button" className="fel-btn fel-btn-small" aria-pressed={notes} onClick={() => setNotes((v) => !v)}>{notes ? 'Hide' : 'Show'} speaker notes</button>
        {canFs ? <button type="button" className="fel-btn fel-btn-small" onClick={fullscreen}>Fullscreen</button> : null}
        <button type="button" className="fel-btn fel-btn-small" onClick={() => setPrintAll(true)}>Print-friendly view</button>
        <span className="fel-small fel-muted">Tip: use ← → keys when the deck is focused.</span>
      </div>
    </section>
  );
}
