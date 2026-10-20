import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { linkClick } from "@/lib/router";
import { LESSONS, PHASES, lessonSrc } from "./courseData";
import "./course.css";

// Phase 6 · XORA Intelligence (T24–T27). These are video lessons only, so they live on the site rather than in the
// interactive course module, whose lesson list is fixed at T01–T23. The course gate locks them like any other lesson.

export const INTELLIGENCE = LESSONS.filter((l) => l.phase === 6);

/** The Phase 6 lesson in a course address (/learn/futures-edge/t24 … t27), or null. */
export function intelligenceFromPath(path: string) {
  const m = /^\/learn\/futures-edge\/(t2[4-9])\/?$/i.exec(path);
  return m ? INTELLIGENCE.find((l) => l.id === m[1].toUpperCase()) ?? null : null;
}

export const intelligenceHref = (id: string) => `/learn/futures-edge/${id.toLowerCase()}`;

export function IntelligenceLesson({ id }: { id: string }) {
  const i = INTELLIGENCE.findIndex((l) => l.id === id);
  const lesson = INTELLIGENCE[i];
  const prev = INTELLIGENCE[i - 1];
  const next = INTELLIGENCE[i + 1];
  const phase = PHASES.find((p) => p.id === 6);
  // iPhone Safari has no Fullscreen API for pages: the lesson player asks for this instead, and the stage fills the screen.
  const [full, setFull] = useState(false);

  useEffect(() => {
    document.title = lesson ? `${lesson.id} · ${lesson.title} — XORA Futures Edge` : "XORA Futures Edge";
    setFull(false);
    window.scrollTo(0, 0);
    const onMessage = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === "futures-edge:fullscreen") setFull(!!e.data.on);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [lesson]);

  if (!lesson) return null;
  const ready = lesson.status === "available";

  return (
    <>
      <Header />
      <main id="main" className="fe-course fe-intel">
        <div className="fe-wrap">
          <a className="fe-back" href="/learn/futures-edge" onClick={linkClick("/learn/futures-edge")}>
            <ArrowLeft size={16} aria-hidden /> Back to the course
          </a>
          <p className="fe-kicker">Phase 6 · {phase?.name} · {lesson.id}</p>
          <h1 className="fe-title">{lesson.title}</h1>
          <p className="fe-intro">{lesson.line} {lesson.minutes}-min video with English and Malayalam subtitles.</p>

          <div className={`fe-intel-stage${full ? " is-full" : ""}`}>
            <div className="fe-stage">
              {ready ? (
                <iframe key={lesson.id} src={lessonSrc(lesson.id)} title={`${lesson.id}: ${lesson.title}`} allow="autoplay; fullscreen" allowFullScreen />
              ) : (
                <p className="fe-missing">This video is being prepared. Please check back soon.</p>
              )}
            </div>
          </div>

          <nav className="fe-intel-nav" aria-label="Phase 6 lessons">
            {prev ? (
              <a href={intelligenceHref(prev.id)} onClick={linkClick(intelligenceHref(prev.id))}>
                <ArrowLeft size={16} aria-hidden /> {prev.id} · {prev.title}
              </a>
            ) : <span />}
            {next ? (
              <a href={intelligenceHref(next.id)} onClick={linkClick(intelligenceHref(next.id))}>
                {next.id} · {next.title} <ArrowRight size={16} aria-hidden />
              </a>
            ) : null}
          </nav>

          <p className="fe-note">
            The screens in this video are illustrative mock-ups of the XORA app with fictional numbers. XORA does not
            predict prices and cannot promise profit; confidence is evidence strength, not a chance of winning.
            Education only, not financial advice. Start in DEMO.
          </p>
        </div>
      </main>
    </>
  );
}
