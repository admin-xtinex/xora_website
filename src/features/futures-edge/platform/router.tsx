/** Tiny History-API router for the course (no router dependency in the host). */
import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { ROUTE_BASE, lessonIdFromSlug, type CheckpointId, type LessonId } from '@futures-edge/contracts';

export type Route =
  | { kind: 'home' }
  | { kind: 'lesson'; id: LessonId }
  | { kind: 'checkpoint'; id: CheckpointId }
  | { kind: 'glossary' }
  | { kind: 'not-found' };

export function parseRoute(pathname: string): Route {
  if (!pathname.startsWith(ROUTE_BASE)) return { kind: 'not-found' };
  const rest = pathname.slice(ROUTE_BASE.length).replace(/^\/+|\/+$/g, '');
  if (rest === '') return { kind: 'home' };
  if (rest === 'glossary') return { kind: 'glossary' };
  const cp = /^checkpoint\/(cp1|cpa|cpb)$/i.exec(rest);
  if (cp) return { kind: 'checkpoint', id: (cp[1] as string).toUpperCase() as CheckpointId };
  const id = lessonIdFromSlug(rest);
  return id ? { kind: 'lesson', id } : { kind: 'not-found' };
}

export function hrefFor(r: Route): string {
  switch (r.kind) {
    case 'home': return ROUTE_BASE;
    case 'glossary': return `${ROUTE_BASE}/glossary`;
    case 'lesson': return `${ROUTE_BASE}/${r.id.toLowerCase()}`;
    case 'checkpoint': return `${ROUTE_BASE}/checkpoint/${r.id.toLowerCase()}`;
    case 'not-found': return ROUTE_BASE;
  }
}

const EVT = 'fe:navigate';

export function navigate(to: string) {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === to) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event(EVT));
  window.scrollTo?.(0, 0);
}

export function useRoute(): Route {
  const [path, setPath] = useState(() => (typeof window === 'undefined' ? ROUTE_BASE : window.location.pathname));
  useEffect(() => {
    const on = () => setPath(window.location.pathname);
    window.addEventListener('popstate', on);
    window.addEventListener(EVT, on);
    return () => { window.removeEventListener('popstate', on); window.removeEventListener(EVT, on); };
  }, []);
  return parseRoute(path);
}

export function Link({ to, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: Route }) {
  const href = hrefFor(to);
  return (
    <a
      href={href}
      {...rest}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href);
      }}
    />
  );
}
