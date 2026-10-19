/**
 * Minimal, SAFE RichText renderer for assessment text (contract RichText: plain text + [[term]] / [[term|label]] +
 * **bold**). React escapes everything; no HTML is ever injected. EDGE-01's shared renderer (with glossary popups)
 * should replace this via the `renderRichText` prop once it exists.
 */
import type { ReactNode } from 'react';

export type RichTextRenderer = (text: string) => ReactNode;

export function plainRichText(text: string): ReactNode {
  const out: ReactNode[] = [];
  const re = /\[\[([a-z0-9-]+)(?:\|([^\]|]+))?\]\]|\*\*([^*]+)\*\*/g;
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    if (m[3] !== undefined) out.push(<strong key={k++}>{m[3]}</strong>);
    else out.push(<span key={k++} className="fe-assess-term" data-term-id={m[1]}>{m[2] ?? (m[1] ?? '').replace(/-/g, ' ')}</span>);
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Plain string (for aria-labels). */
export function richTextToPlain(text: string): string {
  return text.replace(/\[\[([a-z0-9-]+)(?:\|([^\]|]+))?\]\]/g, (_m, id: string, label?: string) => label ?? id.replace(/-/g, ' ')).replace(/\*\*([^*]+)\*\*/g, '$1');
}
