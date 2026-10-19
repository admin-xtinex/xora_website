import { useEffect, useRef } from 'react';
import { LESSON_WORKING_TITLES } from '@futures-edge/contracts';
import { lessonRegistry, type LessonRegistry } from '@futures-edge/content';
import { BrandLockup } from '@/components/Header';
import { FeLink } from './FeLink';
import { pathFor, useFeRoute, type FeRoute } from './router';
import { CourseHome } from './views/CourseHome';
import { LessonView } from './views/LessonView';
import { CheckpointView, NotFoundView } from './views/StatusViews';
import './theme/fe.css';

function titleFor(route: FeRoute): string {
  switch (route.name) {
    case 'home':
      return 'Futures Edge · XORA';
    case 'lesson':
      return `${route.lessonId} ${LESSON_WORKING_TITLES[route.lessonId]} · Futures Edge · XORA`;
    case 'checkpoint':
      return `Checkpoint ${route.checkpointId} · Futures Edge · XORA`;
    case 'not-found':
      return 'Not found · Futures Edge · XORA';
  }
}

/** Root of the learning area. Everything renders inside `.fe-root` so module styles stay scoped. */
export function FuturesEdgeApp({ registry = lessonRegistry }: { registry?: LessonRegistry }) {
  const route = useFeRoute();
  const routeKey = pathFor(route);
  const firstRender = useRef(true);

  useEffect(() => {
    document.title = titleFor(route);
    // Move focus to the new page heading after client-side navigation (not on first load).
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.getElementById('fe-page-title')?.focus();
    window.scrollTo?.(0, 0);
    // routeKey identifies the route; `route` is a fresh object every render.
  }, [routeKey]);

  return (
    <div className="fe-root" data-testid="fe-root">
      <header className="fe-header">
        <a href="/" className="fe-brand" aria-label="XORA home">
          <BrandLockup />
        </a>
        <nav aria-label="Futures Edge" className="fe-header-nav">
          <FeLink to={pathFor({ name: 'home' })} className="fe-link">
            Course overview
          </FeLink>
          <a href="/#futures-edge" className="fe-link">
            Back to XORA
          </a>
        </nav>
      </header>
      <main id="fe-main" className="fe-main">
        {route.name === 'home' && <CourseHome registry={registry} />}
        {route.name === 'lesson' && <LessonView key={route.lessonId} lessonId={route.lessonId} registry={registry} />}
        {route.name === 'checkpoint' && <CheckpointView checkpointId={route.checkpointId} />}
        {route.name === 'not-found' && <NotFoundView />}
      </main>
      <footer className="fe-footer">
        Education only. Fictional data and simulated practice. Not financial advice. No real orders are placed.
      </footer>
    </div>
  );
}

export default FuturesEdgeApp;
