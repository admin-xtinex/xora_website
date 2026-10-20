import type { FirebaseOptions } from "firebase/app";

// Firebase web config (public values, not secrets): set in .env.production. Until it is set,
// sign-in is off and the course stays open, so a deploy never locks everyone out.
const env = import.meta.env;

export const firebaseOptions: FirebaseOptions | null =
  env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID
    ? {
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        appId: env.VITE_FIREBASE_APP_ID,
      }
    : null;

export const AUTH_ENABLED = firebaseOptions !== null;

/** Who may open /admin. Must match the list in firebase/firestore.rules, which is what actually protects the data. */
export const ADMIN_EMAILS = (env.VITE_ADMIN_EMAILS || "tisan@xtinex.com")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

/** Paths that need a signed-in user: the course and everything under it. The landing page stays public. */
export const needsAuth = (path: string) => path === "/course" || path === "/learn/futures-edge" || path.startsWith("/learn/");
