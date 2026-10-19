import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { HeroScene } from "./HeroScene";

const BEATS = [
  { k: "01", t: "Market noise", d: "Thousands of candles, conflicting signals, constant movement." },
  { k: "02", t: "XORA reads it", d: "Trend, key levels and volume behaviour, organised by the intelligence core." },
  { k: "03", t: "Clearer opportunity", d: "Scenarios explained in plain language, so the decision is yours — and informed." },
  { k: "04", t: "Practise first", d: "Futures Edge lessons and demo practice before any real capital is involved." },
];

export function OverviewDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setBeat(0);
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setBeat((b) => (b + 1) % BEATS.length), 3200);
    return () => window.clearInterval(id);
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="overview"
      aria-label="XORA overview"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="overview-frame">
        <button type="button" className="overview-close" onClick={onClose} aria-label="Close overview">
          <X size={20} />
        </button>
        {open ? <HeroScene className="overview-scene" /> : <div className="overview-scene" />}
        <div className="overview-caption" aria-live="polite">
          <span className="overview-k">{BEATS[beat].k}</span>
          <div>
            <strong>{BEATS[beat].t}</strong>
            <p>{BEATS[beat].d}</p>
          </div>
        </div>
        <div className="overview-progress">
          {BEATS.map((b, i) => (
            <button
              key={b.k}
              type="button"
              className={i === beat ? "is-active" : undefined}
              onClick={() => setBeat(i)}
              aria-label={`Show step ${b.k}: ${b.t}`}
            />
          ))}
        </div>
      </div>
    </dialog>
  );
}
