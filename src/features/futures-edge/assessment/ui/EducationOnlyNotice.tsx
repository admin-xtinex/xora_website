import { EDUCATION_ONLY_NOTICE } from '../engine/strings';

/** Shown on every completion surface (quiz result, checkpoint, progress, course badge). */
export function EducationOnlyNotice({ compact = false }: { compact?: boolean }) {
  return (
    <p className={compact ? 'fe-assess-edu fe-assess-edu--compact' : 'fe-assess-edu'} role="note" data-testid="education-only-notice">
      {EDUCATION_ONLY_NOTICE}
    </p>
  );
}
