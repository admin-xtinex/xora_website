/**
 * Feature flag contract. Owner of the resolver implementation: EDGE-01 (platform).
 * Only EDGE-11 may change the release default, and only with explicit user authorization.
 *
 * Canonical flag name: FUTURES_EDGE_ENABLED
 * Build-time env var (Vite convention, assumed stack): VITE_FUTURES_EDGE_ENABLED
 * Default: false (learning area hidden; routes not registered / render "not available").
 */
export const FEATURE_FLAG_NAME = 'FUTURES_EDGE_ENABLED' as const;
export const FEATURE_FLAG_ENV_VAR = 'VITE_FUTURES_EDGE_ENABLED' as const;
export const FEATURE_FLAG_DEFAULT = false as const;

/** Only the exact string "true" enables the area. Anything else (missing, "1", "TRUE ", "yes") stays OFF. */
export function parseFeatureFlag(raw: string | undefined | null): boolean {
  return raw === 'true';
}

/** Route base proposed for the learning area (no router exists in the repo yet — ASSUMPTION, see architecture.md). */
export const ROUTE_BASE = '/learn/futures-edge' as const;
