/**
 * Completion semantics (EDGE-09). Every completion record is EDUCATION-ONLY and carries the literal
 * `authorizesLiveTrading: false`. No completion state is ever read by, or written to, any trading system.
 */
import type { CheckpointId, LessonId } from '../../contracts';
import { COMPLETION_BADGE_TEXT, EDUCATION_ONLY_NOTICE } from '../engine/strings';

export interface CompletionRecord {
  scope: { kind: 'lesson'; lessonId: LessonId } | { kind: 'checkpoint'; checkpointId: CheckpointId } | { kind: 'course' };
  completed: boolean;
  completedAt: string | null;
  educationOnly: true;
  authorizesLiveTrading: false;
  badgeText: string;
  notice: string;
}

export function completionRecord(scope: CompletionRecord['scope'], completed: boolean, completedAt: string | null): CompletionRecord {
  return {
    scope, completed, completedAt: completed ? completedAt : null,
    educationOnly: true, authorizesLiveTrading: false,
    badgeText: completed ? COMPLETION_BADGE_TEXT : 'Not completed yet',
    notice: EDUCATION_ONLY_NOTICE,
  };
}
