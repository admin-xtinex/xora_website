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
import { isFuturesEdgePath } from "./features/futures-edge";

// XORA Futures Edge course: only built into the reachable app when VITE_FUTURES_EDGE_ENABLED is exactly "true".
const FUTURES_EDGE_ENABLED = import.meta.env.VITE_FUTURES_EDGE_ENABLED === "true";
const FuturesEdgeApp = lazy(() => import("./features/futures-edge/platform/FuturesEdgeApp"));

export function App() {
  if (FUTURES_EDGE_ENABLED && isFuturesEdgePath(window.location.pathname)) {
    return (
      <Suspense fallback={<p style={{ padding: 24 }}>Loading XORA Futures Edge…</p>}>
        <FuturesEdgeApp />
      </Suspense>
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
