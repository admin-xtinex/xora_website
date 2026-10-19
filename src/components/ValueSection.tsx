import { VALUE } from "@/lib/content";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { SpotlightCard } from "./ui/SpotlightCard";

export function ValueSection() {
  return (
    <section id="what" className="section" aria-labelledby="what-title">
      <div className="container">
        <SectionHeading id="what-title" kicker={VALUE.kicker} title={VALUE.title} intro={VALUE.intro} />
        <div className="value-grid">
          {VALUE.cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <SpotlightCard className="value-card" tilt>
                <span className="hex-icon">
                  <Icon name={c.icon} size={24} />
                </span>
                <span className="value-index">0{i + 1}</span>
                <h3>{c.title}</h3>
                <p>{c.line}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
