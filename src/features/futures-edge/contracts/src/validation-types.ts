/** Shared validation result shapes. */
export type Severity = 'error' | 'warning';
export interface ValidationIssue {
  /** JSON-path-like location, e.g. "lesson.slides[2].title". */
  path: string;
  code: string;
  message: string;
  severity: Severity;
}
export type ValidationResult<T> =
  | { ok: true; value: T; warnings: ValidationIssue[] }
  | { ok: false; errors: ValidationIssue[]; warnings: ValidationIssue[] };
