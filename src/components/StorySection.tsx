import { useState } from "react";
import { Play } from "lucide-react";
import { STORY } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { StoryDialog } from "./StoryDialog";

/** The first-user story, right before the final call to action: the film ends on "Your story could be next". */
export function StorySection() {
  const [open, setOpen] = useState(false);
  return (
    <section id="story" className="section story" aria-labelledby="story-title">
      <div className="container story-inner">
        <Reveal className="story-copy">
          <p className="kicker">{STORY.kicker}</p>
          <h2 id="story-title" className="section-title">
            {STORY.title}
          </h2>
          <p className="section-intro">{STORY.body}</p>
          <ul className="story-stats">
            {STORY.stats.map((s) => (
              <li key={s.sub}>
                <strong>{s.value}</strong>
                <span>{s.sub}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.12}>
          <button type="button" className="story-poster" onClick={() => setOpen(true)} aria-label={STORY.cta}>
            <span className="story-poster-glow" aria-hidden />
            <span className="story-poster-title" aria-hidden>
              Do you know what happened to <em>our first user?</em>
            </span>
            <span className="story-play" aria-hidden>
              <Play size={26} fill="currentColor" />
            </span>
            <span className="story-poster-cta">{STORY.cta}</span>
          </button>
          <p className="story-note">{STORY.note}</p>
        </Reveal>
      </div>
      <StoryDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
