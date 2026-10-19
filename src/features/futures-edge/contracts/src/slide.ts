/** Slide contract. Owner: EDGE-00. 5–7 slides per lesson. */
import type { SlideId, SceneId, GlossaryTermId, FixtureId } from './ids';
import type { ContentBlock, RichText } from './content';

export const SLIDE_KINDS = [
  'cover-problem', 'key-definition', 'visual-breakdown', 'worked-example', 'risks-misunderstanding',
  'guided-practice', 'recap',
] as const;
export type SlideKind = (typeof SLIDE_KINDS)[number];

export type SlideVisualRef =
  | { kind: 'scene'; sceneId: SceneId }
  | { kind: 'fixture'; fixtureId: FixtureId; textAlternative: RichText }
  | { kind: 'none' };

export interface Slide {
  id: SlideId;
  kind: SlideKind;
  title: RichText;
  /** Narrated-equivalent text: what a presenter would say. Used for captions/screen readers. */
  narrationText: RichText;
  /** Main visible content. Target ≤ 35 main words where possible (validator warns above 60). */
  blocks: ContentBlock[];
  visualRef?: SlideVisualRef;
  glossaryRefs: GlossaryTermId[];
  speakerNotes?: RichText;
}
export const SLIDES_MIN = 5;
export const SLIDES_MAX = 7;
