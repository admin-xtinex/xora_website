import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { MotionConfig } from "motion/react";
import { DifferenceSection } from "./components/DifferenceSection";
import { FinalCTASection } from "./components/FinalCTASection";
import { Footer } from "./components/Footer";
import { FuturesEdgeSection } from "./components/FuturesEdgeSection";
import { CourseCatalog } from "./components/futures-edge/CourseCatalog";
import { IntelligenceLesson, intelligenceFromPath } from "./components/futures-edge/IntelligenceLesson";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { IntelligenceShowcaseSection } from "./components/IntelligenceShowcaseSection";
import { JourneySection } from "./components/JourneySection";
import { StorySection } from "./components/StorySection";
import { TrustNoticeSection } from "./components/TrustNoticeSection";
import { ValueSection } from "./components/ValueSection";
import { navigate, scrollToTarget, usePath } from "./lib/router";
import { isFuturesEdgePath } from "./features/futures-edge";
import { ActivityTracker } from "./auth/ActivityTracker";
import { AuthPage, RequireAuth } from "./auth/AuthPage";
import { needsAuth } from "./auth/config";
import { CourseGate } from "./billing/CourseGate";

const PricingPage = lazy(() => import("./billing/PricingPage").then((m) => ({ default: m.PricingPage })));
const AccountPage = lazy(() => import("./billing/AccountPage").then((m) => ({ default: m.AccountPage })));

const AdminPage = lazy(() => import("./admin/AdminPage").then((m) => ({ default: m.AdminPage })));
const loading = <p role="status" style={{ minHeight: "100vh", margin: 0, display: "grid", placeItems: "center", color: "#b4bccb" }}>Loading…</p>;

// Interactive Futures Edge lessons (slides, notes, practice, quizzes) at /learn/futures-edge.
// Only reachable when the build-time flag VITE_FUTURES_EDGE_ENABLED is exactly "true".
const FUTURES_EDGE_ENABLED = import.meta.env.VITE_FUTURES_EDGE_ENABLED === "true";
const FuturesEdgeApp = FUTURES_EDGE_ENABLED ? lazy(() => import("./features/futures-edge/platform/FuturesEdgeApp")) : null;

const TITLES: Record<string, string> = {
  "/": "XORA — AI-Powered Trading Intelligence | XTINEX",
  "/course": "Futures Edge Course | XORA by XTINEX",
  "/pricing": "Pricing | XORA by XTINEX",
  "/account/subscription": "My Subscription | XORA",
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
      <StorySection />
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
  return (
    <>
      <ActivityTracker path={path} />
      <Routes path={path} />
    </>
  );
}

function Routes({ path }: { path: string }) {
  if (path === "/signin" || path === "/signup") return <AuthPage initial={path === "/signup" ? "signup" : "signin"} />;
  if (path === "/admin") return <Suspense fallback={loading}><AdminPage /></Suspense>;
  // The course and everything in it needs an account; the landing page does not.
  if (needsAuth(path)) return <RequireAuth path={path}><CourseGate path={path}><CourseRoutes path={path} /></CourseGate></RequireAuth>;
  return <SitePages path={path} />;
}

function CourseRoutes({ path }: { path: string }) {
  // The old video-catalogue address now opens the course, where every lesson carries its video.
  useLayoutEffect(() => {
    if (FuturesEdgeApp && path === "/course") navigate("/learn/futures-edge", true);
  }, [path]);
  if (FuturesEdgeApp && path === "/course") return null;
  const intelligence = intelligenceFromPath(path);
  if (intelligence) return <IntelligenceLesson id={intelligence.id} />;
  if (FuturesEdgeApp && isFuturesEdgePath(path)) {
    return (
      <Suspense fallback={<p role="status" style={{ minHeight: "100vh", margin: 0, display: "grid", placeItems: "center", color: "#b4bccb" }}>Loading the course…</p>}>
        <FuturesEdgeApp />
      </Suspense>
    );
  }
  return <SitePages path={path} />;
}

function SitePages({ path }: { path: string }) {
  const page = path === "/course" || path === "/pricing" || path === "/account/subscription" ? path : "/";

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
        {page === "/course" ? <CoursePage /> : page === "/pricing" || page === "/account/subscription" ? (
          <Suspense fallback={<p role="status" className="container" style={{ padding: "140px 0" }}>Loading…</p>}>
            {page === "/pricing" ? <PricingPage /> : <AccountPage />}
          </Suspense>
        ) : <HomePage />}
      </main>
      <Footer />
    </MotionConfig>
  );
}
