/**
 * The narrated video lesson from the site's /course catalogue (owner-authored, public/futures-edge/lessons/<id>.html),
 * shown inside the interactive lesson when that lesson is released. Read-only use of courseData; loads on request.
 */
import { useState } from 'react';
import { LESSONS, cardSrc, lessonSrc } from '@/components/futures-edge/courseData';

export function videoFor(id: string) {
  const l = LESSONS.find((x) => x.id === id);
  return l && l.status === 'available' ? l : undefined;
}

export function VideoLesson({ id }: { id: string }) {
  const lesson = videoFor(id);
  const [open, setOpen] = useState(false);
  if (!lesson) return null;
  return (
    <section className="fel-video" aria-label={`Narrated video: ${lesson.title}`}>
      <div className="fel-row fel-wrap">
        <h2 className="fel-video-title">Narrated video lesson · {lesson.minutes} min</h2>
        <button type="button" className="fel-btn fel-btn-primary" aria-expanded={open} onClick={() => setOpen((v) => !v)}>{open ? 'Close video' : 'Watch the video'}</button>
      </div>
      <div className="fel-stage fel-video-stage">
        {open ? (
          <iframe src={lessonSrc(lesson.id)} title={`${lesson.id}: ${lesson.title}`} allow="autoplay; fullscreen" allowFullScreen />
        ) : (
          <img src={cardSrc(lesson.id)} alt="" width={1280} height={720} loading="lazy" decoding="async" />
        )}
      </div>
      <p className="fel-small fel-muted">The video has its own captions and voiceover. The interactive animation below covers the same ideas step by step, with text for every step.</p>
    </section>
  );
}
