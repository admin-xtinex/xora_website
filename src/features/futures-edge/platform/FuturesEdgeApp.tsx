/** Course shell: header, safety banner, routes, glossary drawer, progress provider. Scoped under .fe-root. */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BrandLockup } from '@/components/Header';
import { COURSE_GLOSSARY } from '../content';
import { GlossaryContext } from './hooks';
import { ProgressProvider } from './progress-context';
import { Link, useRoute } from './router';
import { CourseHome } from './CourseHome';
import { LessonPlayer } from './LessonPlayer';
import { CheckpointExam } from './CheckpointExam';
import { GlossaryDrawer, GlossaryPage } from './Glossary';
import './fe.css';

export function FuturesEdgeApp() {
  const route = useRoute();
  const [term, setTerm] = useState<string | null>(null);
  const open = useCallback((id: string) => setTerm(id), []);
  const close = useCallback(() => setTerm(null), []);
  const glossary = useMemo(() => ({ byId: COURSE_GLOSSARY, open }), [open]);

  useEffect(() => {
    const t = route.kind === 'lesson' ? `${route.id} · XORA Futures Edge` : route.kind === 'checkpoint' ? `Checkpoint ${route.id} · XORA Futures Edge` : route.kind === 'glossary' ? 'Glossary · XORA Futures Edge' : 'XORA Futures Edge · Learn crypto futures from zero';
    document.title = t;
  }, [route]);

  return (
    <GlossaryContext.Provider value={glossary}>
      <ProgressProvider>
        <div className="fe-root">
          <a className="fe-skip" href="#fe-main">Skip to content</a>
          <header className="fe-header">
            <a href="/" className="fe-brand" aria-label="XORA home"><BrandLockup /></a>
            <nav aria-label="Course" className="fe-header-nav">
              <Link to={{ kind: 'home' }}>Course</Link>
              <Link to={{ kind: 'glossary' }}>Glossary</Link>
            </nav>
          </header>
          <p className="fe-banner" role="note">Education only · all market data is fictional · no real orders, no API keys</p>
          {route.kind === 'home' ? <CourseHome /> : null}
          {route.kind === 'lesson' ? <LessonPlayer id={route.id} /> : null}
          {route.kind === 'checkpoint' ? <CheckpointExam id={route.id} /> : null}
          {route.kind === 'glossary' ? <GlossaryPage /> : null}
          {route.kind === 'not-found' ? (
            <main className="fe-page" id="fe-main"><h1>Page not found</h1><p><Link to={{ kind: 'home' }}>Go to the course home</Link></p></main>
          ) : null}
          <footer className="fe-footer">
            <p>XORA Futures Edge by XTINEX. Educational content with fictional data. Not financial advice. No profit is promised or implied; trading crypto futures can lose money.</p>
          </footer>
          <GlossaryDrawer termId={term} onClose={close} />
        </div>
      </ProgressProvider>
    </GlossaryContext.Provider>
  );
}

export default FuturesEdgeApp;
