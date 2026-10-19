/**
 * Renders authored RichText safely: plain text only, plus [[term-id]] / [[term-id|label]] glossary links and **bold**.
 * Nothing is ever injected as HTML.
 */
import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useGlossary } from './hooks';

const TOKEN = /\[\[([a-z0-9]+(?:-[a-z0-9]+)*)(?:\|([^\]|]+))?\]\]|\*\*([^*]+)\*\*/g;

export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(<Fragment key={k++}>{text.slice(last, at)}</Fragment>);
    if (m[1]) out.push(<DefinitionTooltip key={k++} termId={m[1]} label={m[2]} />);
    else if (m[3]) out.push(<strong key={k++}>{m[3]}</strong>);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

/** Inline term button. Opens the short definition in place; "More" opens the full glossary card. */
export function DefinitionTooltip({ termId, label }: { termId: string; label?: string | undefined }) {
  const { byId, open } = useGlossary();
  const entry = byId.get(termId);
  const [show, setShow] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShow(false); };
    const onDown = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShow(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [show]);
  const shown = label ?? entry?.term ?? termId.replace(/-/g, ' ');
  if (!entry) return <span className="fel-term-plain">{shown}</span>;
  return (
    <span className="fel-term" ref={ref}>
      <button type="button" className="fel-term-btn" aria-expanded={show} aria-controls={id} onClick={() => setShow((v) => !v)}>{shown}</button>
      {show ? (
        <span className="fel-term-pop" id={id} role="note">
          <strong>{entry.term}:</strong> {entry.plainDefinition}
          <button type="button" className="fel-link" onClick={() => { setShow(false); open(termId); }}>More about “{entry.term}”</button>
        </span>
      ) : null}
    </span>
  );
}
