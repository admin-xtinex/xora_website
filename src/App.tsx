import { lazy, Suspense } from "react";
import { MotionConfig } from "motion/react";
import { DifferenceSection } from "./components/DifferenceSection";
import { FinalCTASection } from "./components/FinalCTASection";
import { Footer } from "./components/Footer";
import { FuturesEdgeSection } from "./components/FuturesEdgeSection";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { IntelligenceShowcaseSection } from "./components/IntelligenceShowcaseSection";
import { JourneySection } from "./components/JourneySection";
import { TrustNoticeSection } from "./components/TrustNoticeSection";
import { ValueSection } from "./components/ValueSection";

// XORA Futures Edge (EDGE-01). Build-time flag, OFF unless exactly "true". Compared inline so a flag-OFF build
// drops the lazy import and emits no learning-area chunk.
const FUTURES_EDGE_ENABLED = import.meta.env.VITE_FUTURES_EDGE_ENABLED === "true";
const FuturesEdgeApp = FUTURES_EDGE_ENABLED ? lazy(() => import("@/features/futures-edge")) : null;

// Same value as contracts ROUTE_BASE (checked by a test). Not imported, so the contracts stay out of the main chunk.
export const FUTURES_EDGE_ROUTE_BASE = "/learn/futures-edge";

function isFuturesEdgePath(pathname: string): boolean {
  return pathname === FUTURES_EDGE_ROUTE_BASE || pathname.startsWith(`${FUTURES_EDGE_ROUTE_BASE}/`);
}

export function App() {
  if (FuturesEdgeApp && isFuturesEdgePath(window.location.pathname)) {
    return (
      <MotionConfig reducedMotion="user">
        <Suspense fallback={<p role="status">Loading Futures Edge…</p>}>
          <FuturesEdgeApp />
        </Suspense>
      </MotionConfig>
    );
  }
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#what">
        Skip to content
      </a>
      <div className="ambient" aria-hidden />
      <Header />
      <main>
        <HeroSection />
        <ValueSection />
        <FuturesEdgeSection />
        <JourneySection />
        <IntelligenceShowcaseSection />
        <DifferenceSection />
        <TrustNoticeSection />
        <FinalCTASection />
      </main>
      <Footer />
    </MotionConfig>
  );
}
