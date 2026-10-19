import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, type MotionValue, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, BookOpen, Play } from "lucide-react";
import { HERO, LINKS } from "@/lib/content";
import { toSmoothPath, walk } from "@/lib/series";
import { NeuralField } from "./NeuralField";
import { OverviewDialog } from "./OverviewDialog";
import { Icon } from "./ui/Icon";
import { MagneticButton } from "./ui/MagneticButton";
import { Sparkline } from "./ui/Sparkline";

const EASE = [0.16, 1, 0.3, 1] as const;
const FLOW = toSmoothPath(walk(36, 7, 0.9, 1.1), 1600, 220, 12);
const FLOW_2 = toSmoothPath(walk(36, 19, 0.6, 1.4), 1600, 220, 12);
const PILLARS = ["Analyze", "Plan", "Practice", "Improve"];
const BARS = [28, 36, 30, 44, 40, 52, 47, 60, 56, 70, 64, 82];

function useDepth(sx: MotionValue<number>, sy: MotionValue<number>, k: number) {
  return { x: useTransform(sx, (v) => v * k), y: useTransform(sy, (v) => v * k) };
}

function useCoreVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) {
      v.pause();
      return;
    }
    v.play().catch(() => undefined);
  }, [reduce]);
  return ref;
}

export function HeroSection() {
  const section = useRef<HTMLElement>(null);
  const video = useCoreVideo();
  const [overview, setOverview] = useState(false);
  const reduce = useReducedMotion();

  // Pointer parallax: each layer moves by its own depth.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  const coreP = useDepth(sx, sy, -14);
  const nearP = useDepth(sx, sy, 26);
  const farP = useDepth(sx, sy, 12);

  const onPointerMove = (e: PointerEvent) => {
    if (reduce || e.pointerType === "touch") return;
    const r = section.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  // Scroll: copy lifts and fades, the core sinks slightly — a cinematic hand-off.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const stageS = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section id="home" ref={section} className="hero" onPointerMove={onPointerMove} aria-labelledby="hero-title">
      <motion.div className="hero-stage" style={{ y: stageY, scale: stageS }} aria-hidden>
        <div className="hero-aurora" />
        <motion.div className="hero-core" style={coreP}>
          <video
            ref={video}
            className="hero-video"
            src="/brand/xora-core.mp4"
            poster="/brand/xora-core-poster.webp"
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
          />
          <div className="hero-core-glow" />
          <svg className="hero-orbits" viewBox="0 0 600 600">
            <circle cx="300" cy="300" r="210" />
            <circle cx="300" cy="300" r="250" strokeDasharray="2 10" />
            <circle cx="300" cy="300" r="288" strokeDasharray="60 18 4 18" />
          </svg>
        </motion.div>

        <NeuralField className="hero-field" />

        <svg className="hero-flow" viewBox="0 0 1600 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="flowStroke" x1="0" x2="1">
              <stop offset="0" stopColor="#3ecbff" stopOpacity="0" />
              <stop offset="0.25" stopColor="#3ecbff" />
              <stop offset="0.7" stopColor="#a855f7" />
              <stop offset="1" stopColor="#d946ef" />
            </linearGradient>
            <linearGradient id="flowFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#4f8ef7" stopOpacity="0.16" />
              <stop offset="1" stopColor="#4f8ef7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${FLOW} L1600,220 L0,220 Z`} fill="url(#flowFill)" />
          <path className="flow-line flow-line-2" d={FLOW_2} pathLength={1} />
          <path id="flowMain" className="flow-line" d={FLOW} pathLength={1} />
          {!reduce && (
            <circle r="4" className="flow-dot">
              <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
                <mpath href="#flowMain" />
              </animateMotion>
            </circle>
          )}
        </svg>

        <motion.div className="float float-btc" style={nearP}>
          <div className="float-card">
            <span className="float-sym">BTCUSDT</span>
            <span className="float-up">+2.48%</span>
            <Sparkline seed={11} width={118} height={34} />
          </div>
        </motion.div>
        <motion.div className="float float-eth" style={farP}>
          <div className="float-card">
            <span className="float-sym">ETHUSDT</span>
            <span className="float-up">+1.32%</span>
            <Sparkline seed={23} width={118} height={34} drift={0.4} />
          </div>
        </motion.div>
        <motion.div className="float float-pillars" style={farP}>
          <div className="float-card pillars">
            {PILLARS.map((p, i) => (
              <span key={p} style={{ animationDelay: `${i * 0.9}s` }}>
                <i />
                {p}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div className="float float-intel" style={nearP}>
          <div className="float-card intel">
            <span className="float-label">Market Intelligence</span>
            <div className="intel-bars">
              {BARS.map((b, i) => (
                <i key={i} style={{ height: `${b}%`, animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="hero-veil" aria-hidden />

      <div className="container hero-inner">
        <motion.div className="hero-copy" style={{ y: copyY, opacity: copyO }}>
          <motion.p
            className="kicker"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            {HERO.kicker}
          </motion.p>
          <h1 id="hero-title" className="hero-title">
            <motion.span
              className="hero-word"
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            >
              {HERO.title}
            </motion.span>
            {HERO.headline.map((line, i) => (
              <motion.span
                key={line}
                className={i === 1 ? "hero-line is-accent" : "hero-line"}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.45 + i * 0.14, ease: EASE }}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="hero-support"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75, ease: EASE }}
          >
            {HERO.support}
          </motion.p>
          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: EASE }}
          >
            <MagneticButton href={LINKS.getStarted}>
              Get Started
              <ArrowRight size={17} aria-hidden />
            </MagneticButton>
            <MagneticButton href={LINKS.futuresEdge} variant="ghost">
              Explore Futures Edge
              <BookOpen size={17} aria-hidden />
            </MagneticButton>
            <button type="button" className="btn btn-link" onClick={() => setOverview(true)}>
              <span className="play-ring">
                <Play size={13} fill="currentColor" aria-hidden />
              </span>
              Watch Overview
            </button>
          </motion.div>
        </motion.div>

        <motion.ul
          className="hero-chips"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 1.1 } } }}
        >
          {HERO.chips.map((c) => (
            <motion.li
              key={c.label}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
            >
              <Icon name={c.icon} size={20} />
              {c.label}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <a
        href="#what"
        className="scroll-cue"
        aria-label="Scroll to what XORA does"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("what")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span />
      </a>

      <OverviewDialog open={overview} onClose={() => setOverview(false)} />
    </section>
  );
}
