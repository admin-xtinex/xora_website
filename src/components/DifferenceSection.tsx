import { motion } from "motion/react";
import { Check, Minus } from "lucide-react";
import { DIFFERENT } from "@/lib/content";
import { revealTransition, useSeen } from "@/lib/seen";
import { Reveal } from "./ui/Reveal";

export function DifferenceSection() {
  const [table, seen] = useSeen<HTMLDivElement>();
  return (
    <section id="about" className="section difference" aria-labelledby="diff-title">
      <div className="container diff-grid">
        <Reveal className="diff-statement">
          <p className="kicker">{DIFFERENT.kicker}</p>
          <h2 id="diff-title" className="section-title">
            {DIFFERENT.title}
          </h2>
          <ul className="diff-pillars">
            {DIFFERENT.pillars.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Reveal>

        <div ref={table} className="compare" role="table" aria-label="Typical approach compared with XORA">
          <div className="compare-head" role="row">
            <span role="columnheader">The usual way</span>
            <span role="columnheader">With XORA</span>
          </div>
          {DIFFERENT.rows.map((r, i) => (
            <motion.div
              key={r.with}
              className="compare-row"
              role="row"
              initial={{ opacity: 0, y: 20 }}
              animate={seen === "idle" ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              transition={revealTransition(seen, { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] })}
            >
              <span className="compare-without" role="cell">
                <Minus size={15} aria-hidden />
                {r.without}
              </span>
              <span className="compare-with" role="cell">
                <Check size={16} aria-hidden />
                {r.with}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
