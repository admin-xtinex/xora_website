import { ShieldCheck } from "lucide-react";
import { TRUST } from "@/lib/content";
import { Reveal } from "./ui/Reveal";

export function TrustNoticeSection() {
  return (
    <section id="trust" className="trust" aria-labelledby="trust-title">
      <div className="container">
        <Reveal className="trust-panel">
          <span className="trust-icon">
            <ShieldCheck size={26} strokeWidth={1.6} aria-hidden />
          </span>
          <div>
            <h2 id="trust-title">{TRUST.title}</h2>
            <p>{TRUST.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
