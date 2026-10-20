/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" enables the XORA Futures Edge course at /learn/futures-edge (default off). */
  readonly VITE_FUTURES_EDGE_ENABLED?: string;
  /** Firebase web app config (public). Sign-in is off until VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID are set. */
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  /** Comma-separated admin emails (default tisan@xtinex.com). Keep in step with firebase/firestore.rules. */
  readonly VITE_ADMIN_EMAILS?: string;
  /** "true" connects to the local Firebase emulators (testing only). */
  readonly VITE_FIREBASE_EMULATOR?: string;
}
