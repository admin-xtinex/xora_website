import { useEffect, useState } from "react";

// A small notification at the bottom of the screen: showToast("…") from anywhere.
type Item = { id: number; text: string; tone: "ok" | "info" | "error" };
const EVT = "xora:toast";
let seq = 0;

export function showToast(text: string, tone: Item["tone"] = "ok") {
  window.dispatchEvent(new CustomEvent<Item>(EVT, { detail: { id: ++seq, text, tone } }));
}

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    const on = (e: Event) => {
      const it = (e as CustomEvent<Item>).detail;
      setItems((xs) => [...xs.slice(-2), it]);
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== it.id)), 6000);
    };
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);
  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <p key={t.id} className={`toast toast-${t.tone}`}>
          {t.text}
          <button type="button" aria-label="Dismiss" onClick={() => setItems((xs) => xs.filter((x) => x.id !== t.id))}>×</button>
        </p>
      ))}
    </div>
  );
}
