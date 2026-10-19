import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { MotionConfig } from "motion/react";
import { DifferenceSection } from "./components/DifferenceSection";
import { FinalCTASection } from "./components/FinalCTASection";
import { Footer } from "./components/Footer";
import { FuturesEdgeSection } from "./components/FuturesEdgeSection";
import { CourseCatalog } from "./components/futures-edge/CourseCatalog";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { IntelligenceShowcaseSection } from "./components/IntelligenceShowcaseSection";
import { JourneySection } from "./components/JourneySection";
import { TrustNoticeSection } from "./components/TrustNoticeSection";
import { ValueSection } from "./components/ValueSection";
import { scrollToTarget, usePath } from "./lib/router";
import { isFuturesEdgePath } from "./features/futures-edge";

// Interactive Futures Edge lessons (slides, notes, practice, quizzes) at /learn/futures-edge.
// Only reachable when the build-time flag VITE_FUTURES_EDGE_ENABLED is exactly "true".
const FUTURES_EDGE_ENABLED = import.meta.env.VITE_FUTURES_EDGE_ENABLED === "true";
const FuturesEdgeApp = FUTURES_EDGE_ENABLED ? lazy(() => import("./features/futures-edge/platform/FuturesEdgeApp")) : null;

const TITLES: Record<string, string> = {
  "/": "XORA — AI-Powered Trading Intelligence | XTINEX",
  "/course": "Futures Edge Course | XORA by XTINEX",
};

function HomePage() {
  return (
    <>
      <HeroSection />
      <ValueSection />
      <FuturesEdgeSection />
      <JourneySection />
      <IntelligenceShowcaseSection />
      <DifferenceSection />
      <TrustNoticeSection />
      <FinalCTASection />
    </>
  );
}

function CoursePage() {
  return (
    <div className="course-page">
      <CourseCatalog />
    </div>
  );
}

export function App() {
  const path = usePath();
  if (FuturesEdgeApp && isFuturesEdgePath(path)) {
    return (
      <Suspense fallback={<p style={{ padding: 24 }}>Loading XORA Futures Edge…</p>}>
        <FuturesEdgeApp />
      </Suspense>
    );
  }
  return <SitePages path={path} />;
}

function SitePages({ path }: { path: string }) {
  const page = path === "/course" ? "/course" : "/";

  useEffect(() => {
    document.title = TITLES[page];
  }, [page]);

  // Whenever a page renders (first load, a link to the other page, back/forward), land on its
  // #section if the URL has one, otherwise at the top. Runs before paint, so there is no jump.
  useLayoutEffect(() => {
    const id = location.hash ? decodeURIComponent(location.hash.slice(1)) : null;
    if (id || window.scrollY > 0) scrollToTarget(id, false);
  }, [page]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="ambient" aria-hidden />
      <Header />
      <main id="main" key={page}>
        {page === "/course" ? <CoursePage /> : <HomePage />}
      </main>
      <Footer />
    </MotionConfig>
  );
}
