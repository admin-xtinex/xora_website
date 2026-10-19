/**
 * History-API router for the learning area (D-30: no router dependency).
 *
 * Routes, all under ROUTE_BASE (`/learn/futures-edge`):
 *   /                          course home
 *   /t01 … /t23                lesson (slug from contracts `lessonSlug`)
 *   /checkpoint/cp1|cpa|cpb    checkpoint
 *   anything else under base   in-module "not found"
 * Paths outside the base are left to the host (full page navigation).
 */
import { useSyncExternalStore } from 'react';
import {
  CHECKPOINT_IDS,
  ROUTE_BASE,
  lessonIdFromSlug,
  lessonSlug,
  type CheckpointId,
  type LessonId,
} from '@futures-edge/contracts';

export type FeRoute =
  | { name: 'home' }
  | { name: 'lesson'; lessonId: LessonId }
  | { name: 'checkpoint'; checkpointId: CheckpointId }
  | { name: 'not-found'; path: string };

/** True when `pathname` is the learning-area base or below it. */
export function isWithinBase(pathname: string, base: string = ROUTE_BASE): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

/** Parses a pathname. Returns null when the path is outside the learning area. */
export function parseRoute(pathname: string, base: string = ROUTE_BASE): FeRoute | null {
  if (!isWithinBase(pathname, base)) return null;
  const rest = pathname.slice(base.length).split('/').filter(Boolean);
  if (rest.length === 0) return { name: 'home' };
  if (rest.length === 1) {
    const id = lessonIdFromSlug(rest[0] ?? '');
    if (id) return { name: 'lesson', lessonId: id };
  }
  if (rest.length === 2 && rest[0] === 'checkpoint') {
    const cp = (rest[1] ?? '').toUpperCase();
    const match = CHECKPOINT_IDS.find((c) => c === cp);
    if (match) return { name: 'checkpoint', checkpointId: match };
  }
  return { name: 'not-found', path: pathname };
}

/** Canonical path for a route. */
export function pathFor(route: FeRoute, base: string = ROUTE_BASE): string {
  switch (route.name) {
    case 'home':
      return base;
    case 'lesson':
      return `${base}/${lessonSlug(route.lessonId)}`;
    case 'checkpoint':
      return `${base}/checkpoint/${route.checkpointId.toLowerCase()}`;
    case 'not-found':
      return route.path;
  }
}

const listeners = new Set<() => void>();
function emit(): void {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

function currentPath(): string {
  return window.location.pathname;
}

/**
 * Navigates. Inside the learning area: `history.pushState` (or `replaceState`) and re-render, no reload.
 * Outside it: a normal full navigation, so the host app renders that page.
 */
export function navigate(to: string, opts: { replace?: boolean } = {}): void {
  const url = new URL(to, window.location.href);
  if (url.origin !== window.location.origin || !isWithinBase(url.pathname)) {
    window.location.assign(url.href);
    return;
  }
  const target = `${url.pathname}${url.search}${url.hash}`;
  if (opts.replace) window.history.replaceState(null, '', target);
  else window.history.pushState(null, '', target);
  emit();
}

/** Current pathname, re-rendering on navigate() and browser back/forward. */
export function usePathname(): string {
  return useSyncExternalStore(subscribe, currentPath, () => ROUTE_BASE);
}

/** Current learning-area route (`not-found` if the path somehow left the base). */
export function useFeRoute(): FeRoute {
  const pathname = usePathname();
  return parseRoute(pathname) ?? { name: 'not-found', path: pathname };
}
