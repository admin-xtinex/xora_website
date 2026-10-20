import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { LESSONS } from "@/components/futures-edge/courseData";
import { linkClick } from "@/lib/router";
import { COURSE_PAYWALL_ENABLED, FREE_LESSONS } from "./catalog";
import { useEntitlements } from "./EntitlementProvider";
import { courseQuote, inr } from "./pricing";
import { canOpenLesson, hasCourse } from "./subscriptions";
import "./pricing.css";

// Course access: the free introduction is open to every signed-in learner; other lessons need the course
// entitlement. This is a website-level gate for the preview. The lesson video files themselves are static and
// reachable by direct URL, so it does not protect paid content (see docs/FUTURE_PAYMENT_INTEGRATION.md).

/** The lesson or checkpoint id in a course address, or null for the course home, glossary and others. */
export function lessonFromPath(path: string): string | null {
  const m = /^\/learn\/futures-edge\/(?:checkpoint\/)?([a-z0-9]+)$/i.exec(path);
  if (!m) return null;
  const id = m[1].toUpperCase();
  return /^(T\d\d|V00|CP[1AB])$/.test(id) ? id : null;
}

export function CourseGate({ path, children }: { path: string; children: ReactNode }) {
  const { ready, state, error } = useEntitlements();
  // Preview access is not content protection, so if the account's entitlements cannot be read (offline, or the
  // database rules not published yet) the course stays open rather than locking learners out.
  if (!COURSE_PAYWALL_ENABLED || error) return <>{children}</>;
  const now = Date.now();
  const id = lessonFromPath(path);
  const owns = hasCourse(state, now);
  if (!ready) return <p role="status" className="auth-wait">Loading…</p>;
  if (id && !canOpenLesson(state, id, now)) return <LockedLesson id={id} />;
  return (
    <>
      {!owns ? (
        <p className="course-strip" role="note">
          Free introduction: {FREE_LESSONS.join(", ")} are open.{" "}
          <a href="/pricing" onClick={linkClick("/pricing")}>Unlock all lessons ({inr(courseQuote({ launchUsed: state.launchUsed.course }).price)}, Preview Mode)</a>
        </p>
      ) : null}
      {children}
    </>
  );
}

function LockedLesson({ id }: { id: string }) {
  const { buy, busy, state } = useEntitlements();
  const lesson = LESSONS.find((l) => l.id === id);
  const q = courseQuote({ launchUsed: state.launchUsed.course });
  return (
    <main className="lock-page">
      <div className="lock-card">
        <span className="acc-pill warn" style={{ justifySelf: "start" }}><Lock size={12} aria-hidden />&nbsp;Part of the complete course</span>
        <h1>{lesson ? `${lesson.id} · ${lesson.title}` : id}</h1>
        {lesson ? <p>{lesson.line}</p> : null}
        <p>
          This lesson is in the Complete XORA Futures Edge course ({inr(q.price)}{q.launchApplied ? `, regular ${inr(q.regular)}` : ""}).
          In Preview Mode it unlocks instantly, without payment. Your progress is kept.
        </p>
        <button type="button" className="pr-buy" disabled={busy} onClick={() => buy({ productId: "course" }, location.pathname)}>
          {busy ? "Unlocking…" : "Unlock the full course"}
        </button>
        <a className="pr-buy pr-buy-ghost" href="/learn/futures-edge" onClick={linkClick("/learn/futures-edge")}>Back to the course</a>
        <a className="pr-buy pr-buy-ghost" href="/pricing" onClick={linkClick("/pricing")}>See all plans</a>
      </div>
    </main>
  );
}
