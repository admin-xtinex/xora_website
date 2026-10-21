import { useRef, useState, type PointerEvent } from "react";
import { motion, type MotionValue, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, BookOpen, Play } from "lucide-react";
import { HERO, LINKS } from "@/lib/content";
import { linkClick } from "@/lib/router";
import { HeroScene } from "./HeroScene";
import { OverviewDialog } from "./OverviewDialog";
import { StoryDialog } from "./StoryDialog";
import { Icon } from "./ui/Icon";
import { MagneticButton } from "./ui/MagneticButton";
import { Sparkline } from "./ui/Sparkline";

const EASE = [0.16, 1, 0.3, 1] as const;
const BARS = [28, 36, 30, 44, 40, 52, 47, 60, 56, 70, 64, 82];

function useDepth(sx: MotionValue<number>, sy: MotionValue<number>, k: number) {
  return { x: useTransform(sx, (v) => v * k), y: useTransform(sy, (v) => v * k) };
}

export function HeroSection() {
  const section = useRef<HTMLElement>(null);
  const [overview, setOverview] = useState(false);
  const [story, setStory] = useState(false);
  const reduce = useReducedMotion();

  // Pointer parallax: each layer moves by its own depth.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  const coreP = useDepth(sx, sy, -14);
  const nearP = useDepth(sx, sy, 26);

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
        <motion.div className="hero-scene" style={coreP}>
          <HeroScene />
        </motion.div>

        <motion.div className="float float-btc" style={nearP}>
          <div className="float-card">
            <span className="float-sym">BTCUSDT</span>
            <span className="float-up">+2.48%</span>
            <Sparkline seed={11} width={118} height={34} />
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
            <button type="button" className="btn btn-link" onClick={() => setStory(true)}>
              <span className="play-ring">
                <Play size={13} fill="currentColor" aria-hidden />
              </span>
              First user story
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
        onClick={linkClick("#what")}
      >
        <span />
      </a>

      <OverviewDialog open={overview} onClose={() => setOverview(false)} />
      <StoryDialog open={story} onClose={() => setStory(false)} />
    </section>
  );
}
