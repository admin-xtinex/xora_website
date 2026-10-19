/** Written lesson notes: required headings in order, "Learn more" collapsed, print-friendly, marks itself read at the end. */
import { useEffect, useRef } from 'react';
import type { Lesson } from '@futures-edge/contracts';
import { Blocks, type BlockCtx } from './Blocks';
import { RichText } from './RichText';

export function NotesReader({ lesson, ctx, onRead }: { lesson: Lesson; ctx: BlockCtx; onRead: () => void }) {
  const end = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = end.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) onRead(); }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [onRead]);
  const terms = lesson.glossaryEntries;
  return (
    <article className="fel-notes" aria-label={`Notes: ${lesson.title}`}>
      <div className="fel-row fel-noprint"><button type="button" className="fel-btn fel-btn-small" onClick={() => window.print()}>Print notes</button></div>
      <h2 className="fel-print-only">{lesson.title}</h2>
      <p className="fel-badge-fictional">{lesson.fictionalDataNotice}</p>
      {lesson.notesSections.map((s) => s.heading === 'learn-more' || s.collapsedByDefault ? (
        <details key={s.id} id={s.id} className="fel-details fel-notes-more">
          <summary><RichText text={s.title} /></summary>
          <Blocks blocks={s.blocks} ctx={ctx} />
        </details>
      ) : (
        <section key={s.id} id={s.id} className="fel-notes-section">
          <h3><RichText text={s.title} /></h3>
          <Blocks blocks={s.blocks} ctx={ctx} />
        </section>
      ))}
      {terms.length ? (
        <section className="fel-notes-section">
          <h3>Key definitions</h3>
          <div className="fel-table-wrap">
            <table className="fel-table">
              <caption>Terms introduced in this lesson</caption>
              <thead><tr><th scope="col">Term</th><th scope="col">Meaning</th><th scope="col">Example</th></tr></thead>
              <tbody>{terms.map((g) => <tr key={g.id}><th scope="row">{g.term}</th><td><RichText text={g.plainDefinition} /></td><td><RichText text={g.example} /></td></tr>)}</tbody>
            </table>
          </div>
        </section>
      ) : null}
      <section className="fel-notes-section">
        <h3>Misconceptions to avoid</h3>
        <ul className="fel-misconceptions">{lesson.commonMistakes.map((m, k) => <li key={k}><p><strong>Myth: </strong><RichText text={m.mistake} /></p><p><strong>Instead: </strong><RichText text={m.correction} /></p></li>)}</ul>
      </section>
      <section className="fel-notes-section">
        <h3>Recap</h3>
        <ul>{lesson.takeaways.map((t, k) => <li key={k}><RichText text={t} /></li>)}</ul>
      </section>
      <div ref={end} aria-hidden className="fel-end-marker" />
    </article>
  );
}
