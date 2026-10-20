import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { BrandLockup } from "@/components/Header";
import { LESSONS } from "@/components/futures-edge/courseData";
import { AccountMenu } from "@/auth/AccountMenu";
import { useAuth } from "@/auth/AuthProvider";
import type { EventRow, UserRow } from "@/auth/firebase";
import { linkClick, navigate } from "@/lib/router";
import "@/auth/auth.css";
import "./admin.css";

const DAY = 86400000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const fmtDate = (d: Date | null) => (d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");
const fmtTime = (d: Date | null) => (d ? d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");
function ago(d: Date | null) {
  if (!d) return "—";
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

const EVENT_LABEL: Record<string, string> = {
  signup: "Signed up", signin: "Signed in", lesson_open: "Opened lesson", checkpoint_open: "Opened checkpoint",
  video_start: "Started video", video_25: "Watched 25%", video_50: "Watched 50%", video_75: "Watched 75%",
  video_complete: "Finished video", lesson_complete: "Completed lesson", quiz_attempt: "Took quiz", checkpoint_attempt: "Took checkpoint",
};

function csv(rows: (string | number)[][]) {
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}

export function AdminPage() {
  const { enabled, ready, user, isAdmin, api } = useAuth();
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { document.title = "Admin | XORA"; }, []);
  useEffect(() => {
    if (enabled && ready && !user) navigate("/signin?next=/admin", true);
  }, [enabled, ready, user]);

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const a = await api();
      const [u, e] = await Promise.all([a.loadUsers(), a.loadEvents()]);
      setUsers(u);
      setEvents(e);
    } catch (e) {
      setError((e as { code?: string })?.code === "permission-denied"
        ? "Firestore refused the request. Check that this email is in the admin list in firebase/firestore.rules and that the rules are published."
        : "Could not load the data. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }, [api]);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const stats = useMemo(() => {
    if (!users || !events) return null;
    const now = Date.now(), today = startOfDay(new Date());
    const within = (d: Date | null, ms: number) => !!d && now - d.getTime() < ms;
    const days = Array.from({ length: 14 }, (_, i) => today - (13 - i) * DAY);
    const signups = days.map((d) => ({ d, n: users.filter((u) => u.createdAt && startOfDay(u.createdAt) === d).length }));
    const opened: Record<string, Set<string>> = {};
    for (const e of events) if (e.type === "lesson_open" || e.type === "checkpoint_open") (opened[e.lesson] ??= new Set()).add(e.uid);
    const lessons = LESSONS.map((l) => {
      const done = users.filter((u) => u.progress?.lessons?.[l.id]?.done || u.progress?.checkpoints?.[l.id]?.passed).length;
      const watched = users.filter((u) => (u.videos?.[l.id] ?? 0) >= 100).length;
      const scores = users.map((u) => u.progress?.lessons?.[l.id]?.best ?? u.progress?.checkpoints?.[l.id]?.best).filter((s): s is number => typeof s === "number");
      return { id: l.id, title: l.title, opened: opened[l.id]?.size ?? 0, watched, done, avg: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null };
    });
    return {
      total: users.length,
      newWeek: users.filter((u) => within(u.createdAt, 7 * DAY)).length,
      activeToday: users.filter((u) => u.lastSeenAt && u.lastSeenAt.getTime() >= today).length,
      activeWeek: users.filter((u) => within(u.lastSeenAt, 7 * DAY)).length,
      completed: users.reduce((a, u) => a + u.lessonsCompleted, 0),
      videosDone: events.filter((e) => e.type === "video_complete").length,
      signups,
      lessons,
    };
  }, [users, events]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (users || []).filter((u) => !q || u.email.includes(q) || u.name.toLowerCase().includes(q));
  }, [users, search]);

  const exportCsv = () => {
    const rows: (string | number)[][] = [["Name", "Email", "Sign-in method", "Joined", "Last seen", "Sign-ins", "Lessons started", "Lessons completed"]];
    for (const u of users || []) rows.push([u.name, u.email, u.provider, fmtDate(u.createdAt), fmtTime(u.lastSeenAt), u.signInCount, u.lessonsStarted, u.lessonsCompleted]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv(rows)], { type: "text/csv" }));
    a.download = `xora-learners-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  if (!enabled) return <Shell><p className="adm-msg">Sign-in is not set up yet (no Firebase config), so there is no data to show.</p></Shell>;
  if (!ready || !user) return <p role="status" className="auth-wait">Loading…</p>;
  if (!isAdmin) {
    return (
      <Shell>
        <p className="adm-msg">
          {user.emailVerified
            ? "This account does not have admin access."
            : "Confirm your email address first (check your inbox for the link), then sign in again to open the admin portal."}
        </p>
      </Shell>
    );
  }

  const maxSignup = Math.max(1, ...(stats?.signups.map((s) => s.n) ?? [1]));
  return (
    <Shell>
      <div className="adm-head">
        <div>
          <h1>Learner activity</h1>
          <p>Futures Edge course · loaded {busy ? "…" : "just now"}</p>
        </div>
        <div className="adm-actions">
          <button type="button" onClick={load} disabled={busy}><RefreshCw size={16} aria-hidden /> Refresh</button>
          <button type="button" onClick={exportCsv} disabled={!users?.length}><Download size={16} aria-hidden /> Export CSV</button>
        </div>
      </div>
      {error ? <p className="auth-error" role="alert">{error}</p> : null}
      {!stats ? (
        <p className="adm-msg">{busy ? "Loading…" : ""}</p>
      ) : (
        <>
          <section className="adm-kpis" aria-label="Summary">
            <Kpi label="Learners" value={stats.total} />
            <Kpi label="New this week" value={stats.newWeek} />
            <Kpi label="Active today" value={stats.activeToday} />
            <Kpi label="Active this week" value={stats.activeWeek} />
            <Kpi label="Lessons completed" value={stats.completed} />
            <Kpi label="Videos finished" value={stats.videosDone} />
          </section>

          <div className="adm-grid">
            <section className="adm-card">
              <h2>Sign-ups, last 14 days</h2>
              <div className="adm-bars" role="img" aria-label={stats.signups.map((s) => `${new Date(s.d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}: ${s.n}`).join(", ")}>
                {stats.signups.map((s) => (
                  <div key={s.d} className="adm-bar">
                    <span className="adm-bar-n">{s.n || ""}</span>
                    <i style={{ height: `${(s.n / maxSignup) * 100}%` }} />
                    <span className="adm-bar-d">{new Date(s.d).getDate()}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="adm-card">
              <h2>Sales</h2>
              <p className="adm-msg">Payments are not enabled yet: the course is free. When paid access is added (for example with Razorpay), orders, revenue and paying learners will show here.</p>
            </section>
          </div>

          <section className="adm-card">
            <h2>Lessons</h2>
            <div className="adm-scroll">
              <table className="adm-table">
                <thead>
                  <tr><th>Lesson</th><th>Opened</th><th>Watched video</th><th>Completed</th><th>Avg. quiz</th></tr>
                </thead>
                <tbody>
                  {stats.lessons.map((l) => (
                    <tr key={l.id}>
                      <td><b>{l.id}</b> {l.title}</td>
                      <td>{l.opened}</td>
                      <td>{l.watched}</td>
                      <td>{l.done}</td>
                      <td>{l.avg == null ? "—" : `${Math.round(l.avg * 100)}%`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="adm-note">Opened counts learners from the last 1,000 activity records; watched and completed count every learner.</p>
          </section>

          <section className="adm-card">
            <div className="adm-row">
              <h2>Learners ({shown.length})</h2>
              <input type="search" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search learners" />
            </div>
            <div className="adm-scroll">
              <table className="adm-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Joined</th><th>Last seen</th><th>Sign-ins</th><th>Lessons done</th><th>Method</th></tr>
                </thead>
                <tbody>
                  {shown.map((u) => (
                    <tr key={u.uid}>
                      <td>{u.name || "—"}</td>
                      <td>{u.email}</td>
                      <td>{fmtDate(u.createdAt)}</td>
                      <td title={fmtTime(u.lastSeenAt)}>{ago(u.lastSeenAt)}</td>
                      <td>{u.signInCount}</td>
                      <td>{u.lessonsCompleted} / {u.lessonsStarted}</td>
                      <td>{u.provider === "google.com" ? "Google" : "Email"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="adm-card">
            <h2>Recent activity</h2>
            <ul className="adm-feed">
              {(events || []).slice(0, 100).map((e) => (
                <li key={e.id}>
                  <span className="adm-when" title={fmtTime(e.at)}>{ago(e.at)}</span>
                  <span className="adm-who">{e.email}</span>
                  <span>{EVENT_LABEL[e.type] || e.type}{e.lesson ? ` ${e.lesson}` : ""}{e.detail ? ` · ${e.detail}` : ""}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </Shell>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="adm-kpi">
      <b>{value.toLocaleString("en-IN")}</b>
      <span>{label}</span>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm">
      <header className="adm-top">
        <a href="/" aria-label="XORA home" onClick={linkClick("/")}><BrandLockup /></a>
        <span className="adm-tag">Admin</span>
        <span className="adm-spacer" />
        <a className="adm-link" href="/learn/futures-edge" onClick={linkClick("/learn/futures-edge")}>Course</a>
        <AccountMenu compact />
      </header>
      <main className="adm-main">{children}</main>
    </div>
  );
}
