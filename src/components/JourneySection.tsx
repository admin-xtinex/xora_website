import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { JOURNEY } from "@/lib/content";
import { Icon } from "./ui/Icon";
import { SectionHeading } from "./ui/SectionHeading";

export function JourneySection() {
  const track = useRef<HTMLDivElement>(null);
  // The connector fills as the steps scroll through the viewport.
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 85%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="container">
        <SectionHeading id="journey-title" kicker={JOURNEY.kicker} title={JOURNEY.title} intro={JOURNEY.intro} />
        <div ref={track} className="journey">
          <div className="journey-rail" aria-hidden>
            <motion.div className="journey-fill" style={{ ["--p" as string]: fill }} />
          </div>
          <ol>
            {JOURNEY.steps.map((s, i) => (
              <motion.li
                key={s.title}
                className="journey-step"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="journey-node">{i + 1}</span>
                <span className="journey-icon">
                  <Icon name={s.icon} size={22} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.line}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
