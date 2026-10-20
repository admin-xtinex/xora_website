import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { navigate } from "@/lib/router";
import { showToast } from "@/components/ui/Toast";
import { BILLING_MODE } from "./catalog";
import { localStore } from "./localStore";
import { newId, type EntitlementStore } from "./store";
import { activate, type Change, type Ctx } from "./subscriptions";
import { EMPTY_STATE, type ActivationRequest, type EntitlementState } from "./types";

// ActivationService + the learner's entitlement state for the whole site.
//  - Firebase configured: entitlements live in the learner's account (cloud), synced across devices.
//  - Firebase not configured (development): a labelled, browser-only preview store.
// Buy Now never takes payment: in Paymentless Preview Mode it grants a preview entitlement directly.

export type StoreMode = "cloud" | "local" | "signed_out";

type Value = {
  ready: boolean;
  mode: StoreMode;
  state: EntitlementState;
  error: string;
  busy: boolean;
  /** Run an account action (activate, cancel, renew …) once; extra clicks while it runs are ignored. */
  run: (fn: (s: EntitlementState, ctx: Ctx) => Change) => Promise<Change | null>;
  /** Buy Now: sign-in if needed, then activate and open My Subscription (or `after`). */
  buy: (req: ActivationRequest, after?: string) => Promise<void>;
  reload: () => void;
  store: EntitlementStore | null;
};

const Ctx_ = createContext<Value | null>(null);
export function useEntitlements() {
  const v = useContext(Ctx_);
  if (!v) throw new Error("useEntitlements outside EntitlementProvider");
  return v;
}

// ── Remembering a Buy Now across sign-in ─────────────────────────────────────
const PENDING_KEY = "xora.pendingActivation";
const PENDING_MAX_AGE = 30 * 60 * 1000;
type Pending = ActivationRequest & { at: number; after?: string };

/** Only paths on this site (no "//host" or full URLs), so a return address cannot send anyone elsewhere. */
export const safePath = (p: unknown, fallback = "/account/subscription") =>
  typeof p === "string" && p.startsWith("/") && !p.startsWith("//") && !p.includes("\\") ? p : fallback;

export function savePending(req: ActivationRequest, after?: string) {
  try { sessionStorage.setItem(PENDING_KEY, JSON.stringify({ ...req, after, at: Date.now() })); } catch { /* the learner can click again */ }
}
/** Reads and removes the remembered request, so it runs at most once. */
export function takePending(now = Date.now()): (ActivationRequest & { after: string }) | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    sessionStorage.removeItem(PENDING_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Pending;
    if (!p || now - p.at > PENDING_MAX_AGE) return null;
    if (!["starter", "trader", "pro", "course", "bundle"].includes(p.productId)) return null;
    if (p.billingPeriod && p.billingPeriod !== "weekly" && p.billingPeriod !== "monthly") return null;
    return { productId: p.productId, billingPeriod: p.billingPeriod, after: safePath(p.after) };
  } catch {
    return null;
  }
}

const ACTIVATED = new Set(["activated", "upgraded", "renewed", "course_activated", "bundle_activated"]);
export const PREVIEW_TOAST = "Your XORA plan is activated — Preview Mode.";

const friendly = (e: unknown) => {
  const code = (e as { code?: string })?.code || "";
  if (code === "unavailable" || code === "failed-precondition" || !navigator.onLine) return "No connection to your account right now. Check your internet and try again.";
  if (code === "permission-denied") return "Your account could not be updated. Sign out and in again, then retry.";
  return "Something went wrong. Nothing was changed. Please try again.";
};

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const { enabled, ready: authReady, user, api } = useAuth();
  const [store, setStore] = useState<EntitlementStore | null>(null);
  const [state, setState] = useState<EntitlementState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [tick, setTick] = useState(0);

  const mode: StoreMode = !enabled ? "local" : user ? "cloud" : "signed_out";

  // Pick the store for this visitor.
  useEffect(() => {
    let alive = true;
    setReady(false);
    setError("");
    if (!enabled) {
      setStore(localStore());
      return;
    }
    if (!authReady) return;
    if (!user) {
      setStore(null);
      setState(EMPTY_STATE);
      setReady(true);
      return;
    }
    // Loads Firebase (already loaded by sign-in) and the Firestore store on demand.
    Promise.all([api(), import("./firestoreStore")])
      .then(([, m]) => alive && setStore(m.firestoreStore(user.uid)))
      .catch(() => alive && (setError("Your account could not be reached. Check your connection."), setReady(true)));
    return () => { alive = false; };
  }, [enabled, authReady, user, api]);

  // Load (and reload on focus, so another device's changes show up).
  useEffect(() => {
    if (!store) return;
    let alive = true;
    store
      .load()
      .then((s) => alive && (setState(s), setError("")))
      .catch((e) => alive && setError(friendly(e)))
      .finally(() => alive && setReady(true));
    return () => { alive = false; };
  }, [store, tick]);
  useEffect(() => {
    const onFocus = () => setTick((n) => n + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const run = useCallback<Value["run"]>(
    async (fn) => {
      if (!store || inFlight.current) return null;
      inFlight.current = true;
      setBusy(true);
      try {
        const ctx = { userId: user?.uid ?? "local-preview", newId };
        const change = await store.apply((s, now) => fn(s, { ...ctx, now }));
        setState(change.state);
        setError("");
        if (user && change.events.length) {
          const a = await api();
          for (const e of change.events) await a.logEvent(user, e.type, e.product.slice(0, 8), e.detail.slice(0, 200)).catch(() => {});
        }
        return change;
      } catch (e) {
        const msg = friendly(e);
        setError(msg);
        showToast(msg, "error");
        return null;
      } finally {
        inFlight.current = false;
        setBusy(false);
      }
    },
    [store, user, api],
  );

  const buy = useCallback<Value["buy"]>(
    async (req, after = "/account/subscription") => {
      if (BILLING_MODE !== "paymentless_preview") throw new Error("Real billing is not wired up yet.");
      if (enabled && !user) {
        savePending(req, after);
        navigate("/signin?next=" + encodeURIComponent(after));
        return;
      }
      const change = await run((s, ctx) => activate(s, req, ctx));
      if (!change) return;
      showToast(ACTIVATED.has(change.outcome) ? PREVIEW_TOAST : change.message, change.outcome === "blocked" ? "info" : "ok");
      navigate(after);
    },
    [enabled, user, run],
  );

  // After sign-in, continue the Buy Now that sent the learner there (once).
  const resumed = useRef(false);
  useEffect(() => {
    if (resumed.current || !ready || !store || mode !== "cloud") return;
    const p = takePending();
    if (!p) return;
    resumed.current = true;
    buy({ productId: p.productId, billingPeriod: p.billingPeriod }, p.after);
  }, [ready, store, mode, buy]);

  const value = useMemo<Value>(
    () => ({ ready, mode, state, error, busy, run, buy, reload: () => setTick((n) => n + 1), store }),
    [ready, mode, state, error, busy, run, buy, store],
  );
  return <Ctx_.Provider value={value}>{children}</Ctx_.Provider>;
}
