import { useEffect, useState, type FormEvent } from "react";
import { BrandLockup } from "@/components/Header";
import { linkClick, navigate } from "@/lib/router";
import { useAuth } from "./AuthProvider";
import "./auth.css";

type Mode = "signin" | "signup" | "reset";

// Where to go after signing in: ?next=/learn/futures-edge/t05, only paths on this site.
function nextPath() {
  const n = new URLSearchParams(location.search).get("next") || "";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/learn/futures-edge";
}

const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "That email and password do not match. Try again, or reset your password.",
  "auth/wrong-password": "That email and password do not match. Try again, or reset your password.",
  "auth/user-not-found": "There is no account with that email. Create one below.",
  "auth/email-already-in-use": "An account with that email already exists. Sign in instead.",
  "auth/weak-password": "Choose a password with at least 8 characters.",
  "auth/invalid-email": "That email address does not look right.",
  "auth/too-many-requests": "Too many tries. Wait a few minutes and try again.",
  "auth/popup-closed-by-user": "The Google window was closed before signing in.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups for this site and try again.",
  "auth/network-request-failed": "No connection. Check your internet and try again.",
  "auth/unauthorized-domain": "Google sign-in is not enabled for this address yet.",
};
const message = (e: unknown) => MESSAGES[(e as { code?: string })?.code || ""] || "Something went wrong. Please try again.";

export function AuthPage({ initial }: { initial: Mode }) {
  const { enabled, ready, user, api } = useAuth();
  const [mode, setMode] = useState<Mode>(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => setMode(initial), [initial]);
  useEffect(() => {
    document.title = (mode === "signup" ? "Create your account" : mode === "reset" ? "Reset your password" : "Sign in") + " | XORA";
  }, [mode]);
  // Already signed in (or sign-in finished): continue to the course.
  useEffect(() => {
    if (ready && user) navigate(nextPath(), true);
  }, [ready, user]);

  const go = (m: Mode) => {
    setMode(m);
    setError("");
    setNotice("");
    history.replaceState(null, "", (m === "signup" ? "/signup" : "/signin") + location.search);
  };

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && password.length < 8) return setError("Choose a password with at least 8 characters.");
    run(async () => {
      const a = await api();
      if (mode === "signup") await a.signUp(name.trim(), email.trim(), password);
      else if (mode === "signin") await a.signIn(email.trim(), password);
      else {
        await a.resetPassword(email.trim());
        setNotice("If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.");
      }
    });
  };

  if (!enabled) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p>Sign-in is not set up yet. The course is open to everyone for now.</p>
          <a className="auth-primary" href="/learn/futures-edge" onClick={linkClick("/learn/futures-edge")}>Open the course</a>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <a href="/" className="auth-brand" aria-label="XORA home" onClick={linkClick("/")}>
          <BrandLockup />
        </a>
        <h1>{mode === "signup" ? "Create your free account" : mode === "reset" ? "Reset your password" : "Welcome back"}</h1>
        <p className="auth-sub">
          {mode === "reset"
            ? "Enter your email and we will send you a link to choose a new password."
            : "Sign in to watch the XORA Futures Edge lessons, practise and track your progress."}
        </p>

        {mode !== "reset" ? (
          <>
            <button type="button" className="auth-google" disabled={busy} onClick={() => run(async () => (await api()).signInWithGoogle())}>
              <svg viewBox="0 0 48 48" aria-hidden="true" width="20" height="20">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
              </svg>
              Continue with Google
            </button>
            <div className="auth-or" role="separator">or with email</div>
          </>
        ) : null}

        <form onSubmit={submit} noValidate={false}>
          {mode === "signup" ? (
            <label>
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={60} />
            </label>
          ) : null}
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" />
          </label>
          {mode !== "reset" ? (
            <label>
              Password
              <input
                type="password"
                required
                minLength={mode === "signup" ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              {mode === "signup" ? <span className="auth-hint">At least 8 characters.</span> : null}
            </label>
          ) : null}

          {error ? <p className="auth-error" role="alert">{error}</p> : null}
          {notice ? <p className="auth-notice" role="status">{notice}</p> : null}

          <button type="submit" className="auth-primary" disabled={busy}>
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "signin" ? (
            <>
              <button type="button" onClick={() => go("reset")}>Forgot password?</button>
              <span>
                New here? <button type="button" onClick={() => go("signup")}>Create an account</button>
              </span>
            </>
          ) : (
            <span>
              {mode === "signup" ? "Already have an account? " : "Remembered it? "}
              <button type="button" onClick={() => go("signin")}>Sign in</button>
            </span>
          )}
        </div>
        <p className="auth-fine">Education and demo practice only. No live trading, no real money. We never ask for exchange passwords, OTPs or API keys.</p>
      </div>
    </main>
  );
}

/** Shows the course only to signed-in learners; others are sent to sign in and brought back afterwards. */
export function RequireAuth({ path, children }: { path: string; children: React.ReactNode }) {
  const { enabled, ready, user } = useAuth();
  useEffect(() => {
    if (enabled && ready && !user) navigate("/signin?next=" + encodeURIComponent(path + location.search), true);
  }, [enabled, ready, user, path]);
  if (!enabled) return <>{children}</>;
  if (!ready || !user) {
    return (
      <p role="status" className="auth-wait">
        {ready ? "Taking you to sign in…" : "Loading…"}
      </p>
    );
  }
  return <>{children}</>;
}
