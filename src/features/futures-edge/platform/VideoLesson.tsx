/**
 * The narrated video for a lesson or checkpoint (owner-authored web animation, public/futures-edge/lessons/<id>.html),
 * shown inside the course as one part of the lesson. Collapsed it is a compact row; the player loads only on request.
 * The thumbnail is cropped to the tutor so the title text baked into the card never repeats the page heading.
 */
import { useState } from 'react';
import { LESSONS, cardSrc, lessonSrc } from '@/components/futures-edge/courseData';

export function videoFor(id: string) {
  const l = LESSONS.find((x) => x.id === id);
  return l && l.status === 'available' ? l : undefined;
}

export function VideoLesson({ id, label = 'Video lesson', note }: { id: string; label?: string; note?: string }) {
  const lesson = videoFor(id);
  const [open, setOpen] = useState(false);
  if (!lesson) return null;
  return (
    <section className={`fel-video ${open ? 'is-open' : ''}`} aria-label={`${label}: ${lesson.title}`}>
      <div className="fel-video-row">
        <img className="fel-video-thumb" src={cardSrc(lesson.id)} alt="" width={1280} height={720} loading="lazy" decoding="async" />
        <div className="fel-video-text">
          <p className="fel-video-title">{label} · {lesson.minutes} min</p>
          <p className="fel-small fel-muted">{note ?? 'Narrated, with captions. Covers the same ideas as the animation below.'}</p>
        </div>
        <button type="button" className={`fel-btn ${open ? '' : 'fel-btn-primary'}`} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? 'Close video' : '▶ Play video'}
        </button>
      </div>
      {open ? (
        <div className="fel-stage fel-video-stage">
          <iframe src={lessonSrc(lesson.id)} title={`${lesson.id}: ${lesson.title}`} allow="autoplay; fullscreen" allowFullScreen />
        </div>
      ) : null}
    </section>
  );
}
