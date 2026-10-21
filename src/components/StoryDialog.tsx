import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { STORY } from "@/lib/content";

/**
 * The first-user promo in a modal player. It is a web animation played by the Futures Edge lesson runtime
 * (public/promos/first-user.html, built from content/promos/first-user/), loaded only while the dialog is open.
 */
export function StoryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="overview story-dialog"
      aria-label={STORY.title}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="overview-frame">
        <button type="button" className="overview-close" onClick={onClose} aria-label="Close video">
          <X size={20} />
        </button>
        {open ? (
          <iframe className="story-video" src={STORY.film} title={STORY.title} allow="autoplay; fullscreen" allowFullScreen />
        ) : (
          <div className="story-video" />
        )}
      </div>
      <p className="story-dialog-note">{STORY.note}</p>
    </dialog>
  );
}
