/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** XORA Futures Edge feature flag (build time). Only the exact string "true" enables /learn/futures-edge. Default OFF. */
  readonly VITE_FUTURES_EDGE_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
