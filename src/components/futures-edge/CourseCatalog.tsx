import { useEffect, useRef, useState } from "react";
import { Clock, Lock, Play, X } from "lucide-react";
import { LESSONS, PHASES, cardSrc, videoSrc, type Lesson } from "./courseData";
import "./course.css";

// The XORA Futures Edge course: every video as a title card, grouped by phase.
// Locked lessons are shown but cannot be opened; available ones play in a dialog.
export function CourseCatalog() {
  const [playing, setPlaying] = useState<Lesson | null>(null);
  const available = LESSONS.filter((l) => l.status === "available").length;

  return (
    <section id="course" className="fe-course" aria-labelledby="fe-course-title">
      <div className="fe-wrap">
        <header className="fe-head">
          <p className="fe-kicker">XORA Futures Edge · The course</p>
          <h2 id="fe-course-title" className="fe-title">
            {LESSONS.length} short videos, five phases
          </h2>
          <p className="fe-intro">
            From “what is Bitcoin?” to a full demo trading decision. New lessons unlock as they are released.
          </p>
          <div className="fe-progress" aria-label={`${available} of ${LESSONS.length} videos available`}>
            <span className="fe-progress-bar">
              <i style={{ width: `${(available / LESSONS.length) * 100}%` }} />
            </span>
            <span className="fe-progress-text">
              {available} of {LESSONS.length} available
            </span>
          </div>
        </header>

        {PHASES.map((phase) => {
          const items = LESSONS.filter((l) => l.phase === phase.id);
          return (
            <div key={phase.id} className="fe-phase">
              <div className="fe-phase-head">
                <span className="fe-phase-n">{phase.id === 0 ? "★" : phase.id}</span>
                <div>
                  <h3>{phase.id === 0 ? phase.name : `Phase ${phase.id} · ${phase.name}`}</h3>
                  <p>{phase.goal}</p>
                </div>
              </div>
              <ul className="fe-grid">
                {items.map((l) => (
                  <li key={l.id}>
                    <LessonCard lesson={l} onPlay={() => setPlaying(l)} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <p className="fe-note">
          Education and demo practice only. No live trading, no real money. All prices in the videos are fictional.
        </p>
      </div>
      <VideoDialog lesson={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}

function LessonCard({ lesson: l, onPlay }: { lesson: Lesson; onPlay: () => void }) {
  const locked = l.status === "locked";
  const label = `${l.id}: ${l.title}, ${l.minutes} minutes${locked ? ", locked, coming soon" : ""}`;
  return (
    <button
      type="button"
      className={`fe-card${locked ? " is-locked" : ""}`}
      onClick={locked ? undefined : onPlay}
      aria-disabled={locked}
      aria-label={label}
    >
      <span className="fe-thumb">
        <img src={cardSrc(l.id)} alt="" width={1280} height={720} loading="lazy" decoding="async" />
        {locked ? (
          <span className="fe-lock">
            <Lock size={18} aria-hidden /> Coming soon
          </span>
        ) : (
          <span className="fe-play" aria-hidden>
            <Play size={16} fill="currentColor" /> Watch
          </span>
        )}
      </span>
      <span className="fe-body">
        <span className="fe-meta">
          <span className="fe-id">{l.id}</span>
          <span className="fe-mins">
            <Clock size={14} aria-hidden /> {l.minutes} min
          </span>
          {l.kind === "checkpoint" ? <span className="fe-tag">Checkpoint</span> : null}
        </span>
        <span className="fe-name">{l.title}</span>
        <span className="fe-line">{l.line}</span>
      </span>
    </button>
  );
}

function VideoDialog({ lesson, onClose }: { lesson: Lesson | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (lesson && !d.open) {
      setMissing(false);
      d.showModal();
    } else if (!lesson && d.open) {
      d.close();
    }
  }, [lesson]);

  return (
    <dialog
      ref={ref}
      className="fe-dialog"
      aria-label={lesson ? `${lesson.id}: ${lesson.title}` : "Lesson video"}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {lesson ? (
        <div className="fe-dialog-inner">
          <div className="fe-dialog-bar">
            <span>
              <b>{lesson.id}</b> {lesson.title}
            </span>
            <button type="button" className="fe-close" onClick={onClose} aria-label="Close video">
              <X size={20} />
            </button>
          </div>
          {missing ? (
            <p className="fe-missing">This video has not been uploaded yet. Please check back soon.</p>
          ) : (
            <video
              key={lesson.id}
              src={videoSrc(lesson.id)}
              poster={cardSrc(lesson.id)}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onError={() => setMissing(true)}
            />
          )}
        </div>
      ) : null}
    </dialog>
  );
}
