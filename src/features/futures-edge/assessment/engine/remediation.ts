/**
 * Remediation-link resolver (EDGE-09). Turns a question's `remediationRef` into a navigation target.
 *
 * Contracts v1.3.1 (D-67, documented on the box; the repo is still on contracts v1.3.0, which already has the
 * `remediationRef: { lessonId; anchorId?: string }` shape, so nothing here needs a contract edit):
 *  - `anchorId` is a slide (`Tnn-Snn`) or notes-section (`Tnn-Nnn`) id INSIDE `lessonId` (same `Tnn` prefix);
 *  - scene ids (`Tnn-Ann`) are accepted with a warning during 1.x (transitional);
 *  - anything else is invalid.
 * This resolver applies the same rules at run time and never throws. Anything it cannot use falls back to the
 * START of the lesson (`remediationRef.lessonId`, else the item's `linkedLessonId`) and says why, so a bad anchor can
 * never strand the learner. When v1.3.1 lands in the repo nothing changes here except, optionally, swapping the local
 * kind table for the contract export.
 */
import { isLessonId, isValidId, lessonIdOf, type Lesson, type LessonId, type Question } from '../../contracts';

export type RemediationAnchorKind = 'slide' | 'notes' | 'scene' | 'lesson-start';
export type RemediationFallbackReason =
  | 'no-remediation-ref'      // item has no remediationRef: linkedLessonId start
  | 'no-anchor'               // remediationRef without anchorId: lesson start (valid, not an error)
  | 'anchor-format'           // anchorId is not Tnn-Snn / Tnn-Nnn / Tnn-Ann
  | 'anchor-other-lesson'     // anchorId's Tnn prefix differs from remediationRef.lessonId
  | 'anchor-not-found'        // lesson index given and the anchor is not in that lesson
  | 'invalid-lesson';         // remediationRef.lessonId is not T01..T23: linkedLessonId start

export interface RemediationTarget {
  lessonId: LessonId;
  /** Present only when the anchor passed every check (format, same lesson, exists if an index was given). */
  anchorId?: string;
  anchorKind: RemediationAnchorKind;
  /** True for scene anchors (accepted during contracts 1.x, should move to a slide or notes section). */
  transitional: boolean;
  fallbackReason?: RemediationFallbackReason;
  /** Short button label, e.g. "Review T12, slide T12-S03". */
  label: string;
}

/** Anchor kinds in contract D-67 order; `scene` is the 1.x transitional kind. */
const ANCHOR_KINDS = [
  { idKind: 'slide', kind: 'slide', transitional: false },
  { idKind: 'notesSection', kind: 'notes', transitional: false },
  { idKind: 'scene', kind: 'scene', transitional: true },
] as const;

export function parseRemediationAnchor(anchorId: unknown): { lessonId: LessonId; kind: Exclude<RemediationAnchorKind, 'lesson-start'>; transitional: boolean } | null {
  if (typeof anchorId !== 'string') return null;
  const k = ANCHOR_KINDS.find((x) => isValidId(x.idKind, anchorId));
  const lessonId = lessonIdOf(anchorId);
  return k && lessonId ? { lessonId, kind: k.kind, transitional: k.transitional } : null;
}

/** Index of anchors that exist in loaded lessons (slides, notes sections, scenes). */
export type AnchorIndex = (lessonId: LessonId, anchorId: string) => boolean;
export function anchorIndexFromLessons(lessons: ReadonlyArray<Pick<Lesson, 'id' | 'slides' | 'notesSections' | 'animationScenes'>>): AnchorIndex {
  const byLesson = new Map<string, Set<string>>();
  for (const l of lessons) {
    byLesson.set(l.id, new Set([...(l.slides ?? []).map((s) => s.id), ...(l.notesSections ?? []).map((n) => n.id), ...(l.animationScenes ?? []).map((a) => a.id)]));
  }
  // A lesson that is not loaded cannot be checked: trust the (format-valid) anchor rather than dropping it.
  return (lessonId, anchorId) => byLesson.get(lessonId)?.has(anchorId) ?? true;
}

const KIND_LABEL: Record<RemediationAnchorKind, string> = { slide: 'slide', notes: 'notes', scene: 'animation', 'lesson-start': 'from the start' };
function labelFor(lessonId: LessonId, kind: RemediationAnchorKind, anchorId?: string): string {
  return anchorId ? `Review ${lessonId}, ${KIND_LABEL[kind]} ${anchorId}` : `Review ${lessonId} ${KIND_LABEL['lesson-start']}`;
}

export function resolveRemediationTarget(
  item: { remediationRef?: Question['remediationRef'] | undefined; linkedLessonId: LessonId },
  opts: { anchorExists?: AnchorIndex } = {},
): RemediationTarget {
  const start = (lessonId: LessonId, fallbackReason: RemediationFallbackReason): RemediationTarget => ({
    lessonId, anchorKind: 'lesson-start', transitional: false, fallbackReason, label: labelFor(lessonId, 'lesson-start'),
  });
  const ref = item.remediationRef;
  if (!ref) return start(item.linkedLessonId, 'no-remediation-ref');
  if (!isLessonId(ref.lessonId)) return start(item.linkedLessonId, 'invalid-lesson');
  if (ref.anchorId === undefined) return start(ref.lessonId, 'no-anchor');
  const a = parseRemediationAnchor(ref.anchorId);
  if (!a) return start(ref.lessonId, 'anchor-format');
  if (a.lessonId !== ref.lessonId) return start(ref.lessonId, 'anchor-other-lesson');
  if (opts.anchorExists && !opts.anchorExists(ref.lessonId, ref.anchorId)) return start(ref.lessonId, 'anchor-not-found');
  return { lessonId: ref.lessonId, anchorId: ref.anchorId, anchorKind: a.kind, transitional: a.transitional, label: labelFor(ref.lessonId, a.kind, ref.anchorId) };
}
