import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ADMIN_EMAILS, AUTH_ENABLED } from "./config";
import type { AppUser } from "./firebase";

type Api = typeof import("./firebase");

type AuthState = {
  /** Firebase is configured (otherwise everything is open and there is no sign-in). */
  enabled: boolean;
  /** The first answer from Firebase has arrived (until then we do not know if someone is signed in). */
  ready: boolean;
  user: AppUser | null;
  isAdmin: boolean;
  /** The Firebase functions, loaded on demand. */
  api: () => Promise<Api>;
};

let apiPromise: Promise<Api> | null = null;
const loadApi = () => (apiPromise ??= import("./firebase"));

const Ctx = createContext<AuthState>({ enabled: false, ready: true, user: null, isAdmin: false, api: loadApi });
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!AUTH_ENABLED);
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!AUTH_ENABLED) return;
    let stop: (() => void) | undefined;
    let alive = true;
    loadApi()
      .then((api) => {
        if (!alive) return;
        stop = api.watchUser((u) => {
          setUser(u);
          setReady(true);
        });
      })
      .catch(() => setReady(true));
    return () => {
      alive = false;
      stop?.();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      enabled: AUTH_ENABLED,
      ready,
      user,
      // A password account must have confirmed its email; Google accounts are confirmed already.
      isAdmin: !!user && user.emailVerified && ADMIN_EMAILS.includes(user.email),
      api: loadApi,
    }),
    [ready, user],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
