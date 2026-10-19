/**
 * Feature-flag helper. The platform (EDGE-01) owns the flag and passes the raw build-time value:
 *   assessmentEnabled(import.meta.env.VITE_FUTURES_EDGE_ENABLED)
 * This module never reads env itself (no `import.meta.env` here, so it stays testable in Node).
 */
import { parseFeatureFlag } from '../contracts';
export function assessmentEnabled(raw: string | undefined | null): boolean { return parseFeatureFlag(raw); }
