/**
 * Safe renderer for contract RichText (content.ts): plain text plus `[[term-id]]`, `[[term-id|label]]` and
 * `**bold**`. Builds React nodes only (React escapes text); never uses innerHTML.
 */
import { Fragment, type ReactNode } from 'react';

const TOKEN = /\[\[([a-z0-9]+(?:-[a-z0-9]+)*)(?:\|([^\]|]+))?\]\]|\*\*([^*]+)\*\*/g;

function humanize(termId: string): string {
  return termId.replace(/-/g, ' ');
}

export function renderRichText(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(<Fragment key={i++}>{text.slice(last, start)}</Fragment>);
    if (m[1]) {
      out.push(
        <span key={i++} className="fe-term" data-term-id={m[1]}>
          {m[2] ?? humanize(m[1])}
        </span>,
      );
    } else if (m[3]) {
      out.push(<strong key={i++}>{m[3]}</strong>);
    }
    last = start + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return out;
}

export function RichText({ text }: { text: string }) {
  return <>{renderRichText(text)}</>;
}
