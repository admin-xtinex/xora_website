/**
 * Localization conventions. Owner: EDGE-00. FROZEN.
 *
 * Authoring rule: content bots write plain English strings in lesson data. They do NOT invent keys.
 * Keys are DERIVED deterministically from the item's stable ID + field, so translations survive edits:
 *
 *   fe.<LessonId>.<field>                         fe.T14.title
 *   fe.<LessonId>.<itemId>.<field>                fe.T14.T14-S03.title
 *   fe.<LessonId>.<itemId>.<field>.<index>        fe.T14.T14-S03.blocks.2   (array position inside item)
 *   fe.glossary.<termId>.<field>                  fe.glossary.trading-pair.plainDefinition
 *   fe.<CheckpointId>.<itemId>.<field>            fe.CPA.CPA-Q04.prompt
 *   fe.ui.<component>.<name>                      fe.ui.player.next          (UI chrome — EDGE-01 owns)
 *
 * English ("en") is the source locale. "ml" (Malayalam) and "hi" (Hindi) are prepared hooks only;
 * no machine-translated text may ship without human review (reviewed: true).
 */
export const SOURCE_LOCALE = 'en' as const;
export const SUPPORTED_LOCALES = ['en', 'ml', 'hi'] as const;
export type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

export const L10N_KEY_PATTERN = /^fe\.(?:ui|glossary|T0[1-9]|T1\d|T2[0-3]|CP1|CPA|CPB)(?:\.[A-Za-z0-9-]+)+$/;

export function l10nKey(...parts: Array<string | number>): string {
  if (parts.length === 0) throw new Error('l10nKey requires at least one part');
  for (const p of parts) {
    const s = String(p);
    if (s.length === 0 || s.includes('.')) throw new Error(`Invalid l10n key part: "${s}"`);
  }
  return ['fe', ...parts.map(String)].join('.');
}

export interface TranslationEntry {
  text: string;
  /** true only after a human fluent reviewer approved it. Unreviewed entries must fall back to English. */
  reviewed: boolean;
}
/** A translation bundle for one locale: key -> entry. Missing keys fall back to the English source. */
export interface TranslationBundle {
  locale: LocaleCode;
  schemaVersion: string;
  entries: Readonly<Record<string, TranslationEntry>>;
}
