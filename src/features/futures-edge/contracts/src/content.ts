/**
 * Rich-text and content blocks. Owner: EDGE-00. FROZEN.
 *
 * RichText = plain text. NO HTML, NO Markdown, NO executable content. The renderer (EDGE-01) escapes everything.
 * The only inline markup allowed:
 *   [[term-id]]            glossary link showing the term's own label
 *   [[term-id|shown text]] glossary link with custom label
 *   **bold**               emphasis (rendered as <strong>)
 * Validators reject anything that looks like an HTML tag (e.g. "<b>", "</", "<!--", "<script").
 * Use "≤ ≥ × ÷ −" or words in formulas; a bare "<" followed by space/digit is allowed ("a < b").
 */
import type { GlossaryTermId, SceneId, FixtureId, FormulaId } from './ids';

export type RichText = string;

export const GLOSSARY_LINK_PATTERN = /\[\[([a-z0-9]+(?:-[a-z0-9]+)*)(?:\|([^\]|]+))?\]\]/g;
/**
 * v1.1.0 (D-07): the event-handler alternative is limited to real DOM handler names at a word boundary, so
 * text like "Notional = …" or "Position = …" is no longer flagged. Tags are still rejected outright.
 */
export const FORBIDDEN_MARKUP_PATTERN =
  /<\s*[a-zA-Z!/?]|javascript:|\bon(?:click|dblclick|load|unload|error|abort|submit|reset|change|input|focus|blur|key(?:down|up|press)|mouse[a-z]*|pointer[a-z]*|touch[a-z]*|drag[a-z]*|drop|wheel|scroll|resize|contextmenu|animation[a-z]*|transition[a-z]*|begin|end)\s*=/i;

/** Glossary ids referenced inline by a rich-text string. */
export function extractGlossaryLinks(text: RichText): GlossaryTermId[] {
  const out: string[] = [];
  for (const m of text.matchAll(GLOSSARY_LINK_PATTERN)) if (m[1]) out.push(m[1]);
  return out;
}

export type CalloutKind = 'safety' | 'tip' | 'mistake' | 'fictional-data' | 'not-advice' | 'approximation';

export type ContentBlock =
  | { kind: 'paragraph'; text: RichText }
  | { kind: 'heading'; level: 3 | 4; text: RichText }
  | { kind: 'list'; ordered: boolean; items: RichText[] }
  | { kind: 'definition'; termId: GlossaryTermId; text?: RichText }
  | { kind: 'analogy'; text: RichText }
  | {
      kind: 'formula';
      /** Human-readable formula, e.g. "value in USDT = BTC amount × USDT per BTC". */
      expression: string;
      /** Every symbol explained with its unit. */
      variables: Array<{ symbol: string; meaning: RichText; unit: string }>;
      note?: RichText;
      /** v1.1.0: links to a machine-checked `Lesson.formulas` entry. */
      formulaId?: FormulaId;
    }
  | {
      kind: 'worked-example';
      title: RichText;
      /** Must be true: all numbers are fictional/illustrative unless proven historical. */
      fictional: true;
      steps: Array<{ text: RichText; result?: string }>;
      conclusion: RichText;
    }
  | { kind: 'callout'; callout: CalloutKind; title?: RichText; text: RichText }
  | { kind: 'table'; caption: RichText; headers: RichText[]; rows: RichText[][] }
  | { kind: 'comparison'; left: { title: RichText; points: RichText[] }; right: { title: RichText; points: RichText[] } }
  | { kind: 'scene-embed'; sceneId: SceneId; caption: RichText }
  | { kind: 'fixture-figure'; fixtureId: FixtureId; caption: RichText; textAlternative: RichText }
  | { kind: 'learn-more'; title: RichText; blocks: ContentBlock[] };

export type ContentBlockKind = ContentBlock['kind'];
export const CONTENT_BLOCK_KINDS: readonly ContentBlockKind[] = [
  'paragraph', 'heading', 'list', 'definition', 'analogy', 'formula', 'worked-example',
  'callout', 'table', 'comparison', 'scene-embed', 'fixture-figure', 'learn-more',
];
