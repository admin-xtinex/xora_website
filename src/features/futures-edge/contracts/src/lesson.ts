/**
 * Lesson contract. Owner: EDGE-00. FROZEN. One `Lesson` object per tutorial T01..T23,
 * exported as the default export of `features/futures-edge/content/phase-0N/<LessonId>/lesson.ts`.
 */
import type { LessonId, PhaseId, GlossaryTermId } from './ids';
import type { RichText } from './content';
import type { GlossaryEntry } from './glossary';
import type { Slide } from './slide';
import type { NotesSection } from './notes';
import type { AnimationScene } from './animation';
import type { Exercise } from './exercise';
import type { Question } from './question';
import type { Formula } from './formula';

export type Difficulty = 'beginner' | 'beginner-plus' | 'intermediate';

export interface Lesson {
  /** Contract version this file was written against (SCHEMA_VERSION). */
  schemaVersion: string;
  id: LessonId;
  phaseId: PhaseId;
  title: RichText;
  /** One-sentence objective. */
  summary: RichText;
  /** ≥3 measurable learning outcomes ("Learner can …"). */
  objectives: RichText[];
  prerequisites: LessonId[];
  durationMinutes: number;
  difficulty: Difficulty;
  /** New terms INTRODUCED by this lesson (the lesson is their owner). */
  glossaryEntries: GlossaryEntry[];
  /** 5–7 slides. */
  slides: Slide[];
  /** Notes article with all required headings. */
  notesSections: NotesSection[];
  /** Ordered animation timeline, 4–8 steps. */
  animationScenes: AnimationScene[];
  /** ≥1 interactive exercise (blueprint `exerciseRefs`, here inlined; ids are the refs). */
  exercises: Exercise[];
  /** 3–5 scored questions; ≥1 'interpretation' and ≥1 'mistake-risk'. */
  quizQuestions: Question[];
  /** v1.1.0 (optional): machine-checked formulas, recomputed by the EDGE-08 simulator named in each. */
  formulas?: Formula[];
  commonMistakes: Array<{ mistake: RichText; correction: RichText }>;
  /** Three-point takeaway (exactly 3 recommended; ≥3 required). */
  takeaways: RichText[];
  reviewCard: {
    keyTermIds: GlossaryTermId[]; // 3
    safetyNote: RichText;
    reviewMinutes: number;
    retrievalQuestion: RichText;
  };
  completionRequirements: {
    requireAllSlidesViewed: boolean;
    requireAnimationCompleted: boolean;
    requireExerciseIds: string[];
    /** Fraction 0..1; configurable. */
    minQuizScore: number;
    requireSafetyCriticalCorrect: boolean;
  };
  /** Content version (semver) — bump on any learner-visible change. */
  version: string;
  /** Visible notice that all market data in the lesson is fictional. */
  fictionalDataNotice: RichText;
  /** Long-form notes classification for word-count targets. */
  notesComplexity: 'simple' | 'complex-risk';
}

export interface LessonModule {
  default: Lesson;
}
