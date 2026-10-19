/** Searchable course glossary (page) and the slide-in drawer opened from inline terms. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GlossaryEntry } from '@futures-edge/contracts';
import { LESSON_META } from '../content';
import { RichText } from './RichText';
import { Link } from './router';
import { useGlossary } from './hooks';

export function GlossaryCard({ g, compact }: { g: GlossaryEntry; compact?: boolean }) {
  const { byId, open } = useGlossary();
  return (
    <article className="fel-gcard" id={`term-${g.id}`}>
      <h3>{g.term}</h3>
      <p className="fel-gcard-plain"><RichText text={g.plainDefinition} /></p>
      <dl>
        <dt>More precisely</dt><dd><RichText text={g.technicalMeaning} /></dd>
        <dt>Example</dt><dd><RichText text={g.example} /></dd>
        {g.notSameAs?.length ? (<><dt>Not the same as</dt><dd><ul>{g.notSameAs.map((n, k) => <li key={k}>{n.termId && byId.get(n.termId) ? <button type="button" className="fel-link" onClick={() => open(n.termId as string)}>{byId.get(n.termId)?.term}</button> : null}{n.termId && byId.get(n.termId) ? ': ' : ''}<RichText text={n.text} /></li>)}</ul></dd></>) : null}
        {g.relatedTermIds.length ? (<><dt>Related</dt><dd>{g.relatedTermIds.map((r, k) => <span key={r}>{k ? ', ' : ''}{byId.get(r) ? <button type="button" className="fel-link" onClick={() => open(r)}>{byId.get(r)?.term}</button> : r}</span>)}</dd></>) : null}
      </dl>
      {!compact ? <p className="fel-small">Introduced in <Link to={{ kind: 'lesson', id: g.introducedIn }}>{g.introducedIn} · {LESSON_META[g.introducedIn]?.title}</Link></p> : <p className="fel-small">Introduced in {g.introducedIn}</p>}
    </article>
  );
}

export function GlossaryPage() {
  const { byId } = useGlossary();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return [...byId.values()].sort((a, b) => a.term.localeCompare(b.term)).filter((g) => !s || g.term.toLowerCase().includes(s) || g.plainDefinition.toLowerCase().includes(s) || (g.aliases ?? []).some((a) => a.toLowerCase().includes(s)));
  }, [byId, q]);
  return (
    <main className="fel-page" id="fel-main">
      <h1>Course glossary</h1>
      <p>{byId.size} terms, each defined in the lesson that introduces it.</p>
      <label className="fel-field fel-search"><span>Search terms</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. leverage, wick, spread" /></label>
      <p className="fel-sr" aria-live="polite">{list.length} matching terms</p>
      <div className="fel-gcards">{list.map((g) => <GlossaryCard key={g.id} g={g} />)}</div>
    </main>
  );
}

export function GlossaryDrawer({ termId, onClose }: { termId: string | null; onClose: () => void }) {
  const { byId } = useGlossary();
  const ref = useRef<HTMLDivElement | null>(null);
  const g = termId ? byId.get(termId) : undefined;
  useEffect(() => {
    if (!g) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [g, onClose]);
  if (!g) return null;
  return (
    <div className="fel-drawer-wrap" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="fel-drawer" role="dialog" aria-modal="true" aria-label={`Definition: ${g.term}`} tabIndex={-1} ref={ref}>
        <button type="button" className="fel-btn fel-btn-small fel-drawer-close" onClick={onClose}>Close</button>
        <GlossaryCard g={g} compact />
      </div>
    </div>
  );
}
