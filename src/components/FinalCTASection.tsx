import { ArrowRight, BookOpen, CircleCheck } from "lucide-react";
import { FINAL, LINKS } from "@/lib/content";
import { MagneticButton } from "./ui/MagneticButton";
import { Reveal } from "./ui/Reveal";

export function FinalCTASection() {
  return (
    <section id="start" className="final" aria-labelledby="final-title">
      <div className="final-plate" aria-hidden />
      <div className="final-rings" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <div className="container final-inner">
        <Reveal>
          <p className="kicker">{FINAL.kicker}</p>
          <h2 id="final-title" className="final-title">
            {FINAL.title[0]} <span className="text-gradient">{FINAL.title[1]}</span>
          </h2>
          <p className="final-body">{FINAL.body}</p>
        </Reveal>
        <Reveal delay={0.12} className="final-ctas">
          <MagneticButton href={LINKS.course}>
            Start Futures Edge
            <ArrowRight size={17} aria-hidden />
          </MagneticButton>
          <MagneticButton href={LINKS.contact} variant="ghost">
            Talk to the XORA team
            <BookOpen size={17} aria-hidden />
          </MagneticButton>
        </Reveal>
        <Reveal delay={0.2}>
          <ul className="final-points">
            {FINAL.points.map((p) => (
              <li key={p}>
                <CircleCheck size={16} aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
