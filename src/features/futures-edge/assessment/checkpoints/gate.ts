/**
 * Checkpoint gate (EDGE-09). A gate never locks learning content or safety notes (master prompt §8, §9). It only
 * decides what the checkpoint counts toward: a gating checkpoint must be passed for the (education-only) course
 * completion badge. Lessons not yet completed are RECOMMENDED first, not required to start.
 */
import type { LessonId } from '../../contracts';
import type { CheckpointPlan } from './plan';
import type { CourseSummary, CheckpointState } from '../progress/service';

export interface CheckpointGateView {
  checkpointId: CheckpointPlan['id'];
  title: string;
  canStart: true;
  recommendedFirst: LessonId[];
  gating: boolean;
  passed: boolean;
  isPreview: boolean;
  blocksCourseCompletion: boolean;
  message: string;
}

export function checkpointGate(plan: CheckpointPlan, course: CourseSummary, state: CheckpointState | null): CheckpointGateView {
  const recommendedFirst = plan.coversLessonIds.filter((id) => course.lessons.find((l) => l.lessonId === id)?.status !== 'completed');
  const passed = state?.status === 'passed';
  const isPreview = state?.isPreview ?? false;
  let message: string;
  if (isPreview && state?.previewReason === 'provisional') message = 'Preview: every question is written, but some are still being checked. You can practise, but a preview cannot be passed.';
  else if (isPreview) message = 'Preview: some questions for this checkpoint are still being written. You can practise, but a preview cannot be passed.';
  else if (passed) message = 'Passed. This is a learning milestone only, not permission to trade.';
  else if (recommendedFirst.length) message = `You can start now. We recommend finishing ${recommendedFirst.join(', ')} first.`;
  else message = 'Ready when you are. You can retake it as many times as you like.';
  return {
    checkpointId: plan.id, title: plan.title, canStart: true, recommendedFirst, gating: plan.gating, passed, isPreview,
    blocksCourseCompletion: plan.gating && !passed, message,
  };
}
