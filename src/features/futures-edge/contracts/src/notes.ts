/** Notes/lesson-article contract. Owner: EDGE-00. */
import type { NotesSectionId } from './ids';
import type { ContentBlock, RichText } from './content';

/** Required headings (master prompt §3C). `learn-more` is optional and collapsed by default. */
export const REQUIRED_NOTES_HEADINGS = [
  'meaning', 'why-it-matters', 'example', 'how-to-recognize', 'common-mistakes', 'safety-note', 'quick-revision',
] as const;
export type NotesHeading = (typeof REQUIRED_NOTES_HEADINGS)[number] | 'learn-more';

export interface NotesSection {
  id: NotesSectionId;
  heading: NotesHeading;
  title: RichText;
  blocks: ContentBlock[];
  collapsedByDefault?: boolean;
}

/** Word-count targets for the whole notes article (validator warns outside range). */
export const NOTES_WORDS = {
  simple: { min: 300, max: 650 },
  complexRisk: { min: 450, max: 900 },
  referenceT14Min: 500,
} as const;
