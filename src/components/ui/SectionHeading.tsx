import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type Props = {
  kicker: string;
  title: string;
  intro?: string;
  align?: "split" | "center";
  id?: string;
};

export function SectionHeading({ kicker, title, intro, align = "split", id }: Props) {
  return (
    <div className={cn("section-heading", align === "center" && "is-center")}>
      <Reveal>
        <p className="kicker">{kicker}</p>
        <h2 id={id} className="section-title">
          {title}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.12}>
          <p className="section-intro">{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
