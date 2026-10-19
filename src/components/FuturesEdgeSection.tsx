import { motion } from "motion/react";
import { ArrowRight, ChevronRight, CircleCheck, Lock, Play } from "lucide-react";
import { EDGE, LINKS } from "@/lib/content";
import { cn } from "@/lib/utils";
import { MagneticButton } from "./ui/MagneticButton";
import { Reveal } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";

const DONE = EDGE.modules.filter((m) => m.state === "done").length;
const PCT = Math.round((DONE / EDGE.modules.length) * 100);
const R = 34;
const C = 2 * Math.PI * R;

function LearningPreview() {
  const next = EDGE.modules.find((m) => m.state === "active")!;
  const nextIndex = EDGE.modules.indexOf(next) + 1;
  return (
    <SpotlightCard className="edge-preview" tilt>
      <div className="edge-preview-bar" aria-hidden>
        <i />
        <i />
        <i />
        <span>Futures Edge · Guided Onboarding</span>
      </div>

      <div className="edge-top">
        <div className="edge-progress">
          <svg viewBox="0 0 80 80" aria-hidden>
            <defs>
              <linearGradient id="ringGrad" x1="0" x2="1">
                <stop offset="0" stopColor="#3ecbff" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r={R} className="ring-track" />
            <motion.circle
              cx="40"
              cy="40"
              r={R}
              className="ring-value"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              whileInView={{ strokeDashoffset: C * (1 - PCT / 100) }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </svg>
          <span className="ring-label">{PCT}%</span>
          <div>
            <strong>Learning progress</strong>
            <span>
              {DONE} of {EDGE.modules.length} modules completed
            </span>
          </div>
        </div>
        <div className="edge-next">
          <span className="play-orb" aria-hidden>
            <Play size={16} fill="currentColor" />
          </span>
          <div>
            <span className="tag">Next up</span>
            <strong>{next.title}</strong>
            <span>
              Module {nextIndex} · {next.mins} min
            </span>
          </div>
        </div>
      </div>

      <ol className="module-list">
        {EDGE.modules.map((m, i) => (
          <motion.li
            key={m.title}
            className={cn("module", `is-${m.state}`)}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="module-n">{i + 1}</span>
            <div className="module-text">
              <strong>{m.title}</strong>
              <span>{m.line}</span>
            </div>
            <span className="module-state">
              {m.state === "done" ? (
                <>
                  <CircleCheck size={15} aria-hidden /> Completed
                </>
              ) : m.state === "active" ? (
                <>
                  <ChevronRight size={15} aria-hidden /> In progress
                </>
              ) : (
                <>
                  <Lock size={14} aria-hidden /> Locked
                </>
              )}
            </span>
            <span className="module-mins">{m.mins} min</span>
          </motion.li>
        ))}
      </ol>
    </SpotlightCard>
  );
}

export function FuturesEdgeSection() {
  return (
    <section id="futures-edge" className="section edge" aria-labelledby="edge-title">
      <div className="edge-glow" aria-hidden />
      <div className="container edge-grid">
        <div className="edge-copy">
          <Reveal>
            <p className="kicker">{EDGE.kicker}</p>
            <h2 id="edge-title" className="section-title">
              <span className="text-gradient">{EDGE.title}</span>
            </h2>
            <p className="edge-sub">{EDGE.sub}</p>
            <p className="edge-body">{EDGE.body}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="topic-chips" aria-label="What you will learn">
              {EDGE.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.18}>
            <ol className="mini-flow" aria-label="Futures Edge stages">
              {EDGE.flow.map((s, i) => (
                <li key={s}>
                  <span>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.24}>
            <MagneticButton href={LINKS.course}>
              Start Futures Edge
              <ArrowRight size={17} aria-hidden />
            </MagneticButton>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={40} className="edge-visual">
          <LearningPreview />
        </Reveal>
      </div>
    </section>
  );
}
