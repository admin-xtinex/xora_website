/** Glossary contract. Owner: EDGE-00. Entries authored by the lesson that introduces the term. */
import type { GlossaryTermId, LessonId } from './ids';
import type { RichText } from './content';

export interface GlossaryEntry {
  id: GlossaryTermId;          // kebab slug, globally unique across the course
  term: string;                // display label, e.g. "Trading pair"
  plainDefinition: RichText;   // one-line plain-English meaning (shown first)
  technicalMeaning: RichText;
  example: RichText;
  relatedTermIds: GlossaryTermId[];
  /** "Not the same as…" clarifications, e.g. leverage vs borrowing-for-profit. */
  notSameAs?: Array<{ termId?: GlossaryTermId; text: RichText }>;
  /** Lesson where the term is first introduced (single owner of the entry). */
  introducedIn: LessonId;
  aliases?: string[];
}
