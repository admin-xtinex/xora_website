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

export function App() {
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
