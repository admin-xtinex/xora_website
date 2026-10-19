import { motion } from "motion/react";
import { ArrowRight, ChevronRight, CircleCheck, Lock, Play } from "lucide-react";
import { EDGE, LINKS } from "@/lib/content";
import { revealTransition, useSeen } from "@/lib/seen";
import { cn } from "@/lib/utils";
import { LESSONS, PHASES } from "./futures-edge/courseData";
import { MagneticButton } from "./ui/MagneticButton";
import { Reveal } from "./ui/Reveal";
import { SpotlightCard } from "./ui/SpotlightCard";

// The preview is the real course, read from its catalogue: phases, lesson counts and which videos are released.
const LESSONS_ONLY = LESSONS.filter((l) => l.kind === "lesson");
const VIDEOS_READY = LESSONS.filter((l) => l.status === "available").length;
const PCT = Math.round((VIDEOS_READY / LESSONS.length) * 100);
const COURSE_PHASES = PHASES.filter((p) => p.id > 0).map((p) => {
  const items = LESSONS_ONLY.filter((l) => l.phase === p.id);
  const ready = items.filter((l) => l.status === "available").length;
  return { ...p, count: items.length, ready, state: ready === items.length ? "done" : ready > 0 ? "active" : "locked" };
});
const FIRST = LESSONS_ONLY[0]!;
const R = 34;
const C = 2 * Math.PI * R;

function LearningPreview() {
  const [ring, ringSeen] = useSeen<SVGSVGElement>();
  const [list, listSeen] = useSeen<HTMLOListElement>();
  return (
    <SpotlightCard className="edge-preview" tilt>
      <div className="edge-preview-bar" aria-hidden>
        <i />
        <i />
        <i />
        <span>Futures Edge · The course</span>
      </div>

      <div className="edge-top">
        <div className="edge-progress">
          <svg ref={ring} viewBox="0 0 80 80" aria-hidden>
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
              animate={{ strokeDashoffset: ringSeen === "idle" ? C : C * (1 - PCT / 100) }}
              transition={revealTransition(ringSeen, { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 })}
            />
          </svg>
          <span className="ring-label">{VIDEOS_READY}</span>
          <div>
            <strong>{LESSONS_ONLY.length} lessons, {COURSE_PHASES.length} phases</strong>
            <span>
              {VIDEOS_READY} of {LESSONS.length} videos released
            </span>
          </div>
        </div>
        <div className="edge-next">
          <span className="play-orb" aria-hidden>
            <Play size={16} fill="currentColor" />
          </span>
          <div>
            <span className="tag">Start here</span>
            <strong>{FIRST.title}</strong>
            <span>
              {FIRST.id} · {FIRST.minutes}-min video
            </span>
          </div>
        </div>
      </div>

      <ol ref={list} className="module-list">
        {COURSE_PHASES.map((m, i) => (
          <motion.li
            key={m.id}
            className={cn("module", `is-${m.state}`)}
            initial={{ opacity: 0, x: 16 }}
            animate={listSeen === "idle" ? { opacity: 0, x: 16 } : { opacity: 1, x: 0 }}
            transition={revealTransition(listSeen, { duration: 0.6, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] })}
          >
            <span className="module-n">{m.id}</span>
            <div className="module-text">
              <strong>{m.name}</strong>
              <span>{m.goal}</span>
            </div>
            <span className="module-state">
              {m.state === "done" ? (
                <>
                  <CircleCheck size={15} aria-hidden /> Videos ready
                </>
              ) : m.state === "active" ? (
                <>
                  <ChevronRight size={15} aria-hidden /> {m.ready} of {m.count} videos
                </>
              ) : (
                <>
                  <Lock size={14} aria-hidden /> Videos soon
                </>
              )}
            </span>
            <span className="module-mins">{m.count} lessons</span>
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
