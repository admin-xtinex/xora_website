/**
 * XORA Futures Edge — shared contract schema version.
 * Owner: EDGE-00 (Mission Control). FROZEN for Wave 1/2.
 *
 * SemVer rules:
 *  - MAJOR: breaking change to any exported type/validator (requires EDGE-00 sign-off + all owners notified).
 *  - MINOR: additive change (new optional field, new allowed scene/exercise type via registry request).
 *  - PATCH: docs / validator message fixes only.
 *
 * Every authored Lesson carries `schemaVersion` (this contract) AND `version` (its own content version).
 */
export const SCHEMA_VERSION = '1.3.0' as const;
export type SchemaVersion = typeof SCHEMA_VERSION;

/** Major part of the schema version; validators reject content whose schemaVersion has a different major. */
export const SCHEMA_MAJOR = 1 as const;

/** SemVer string "MAJOR.MINOR.PATCH". Used for content versions too. */
export const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function schemaMajorOf(version: string): number | undefined {
  const m = SEMVER_PATTERN.exec(version);
  return m ? Number(m[1]) : undefined;
}
