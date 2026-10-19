/// <reference types="node" />
/**
 * Content inventory, computed from the lesson data itself. Asserts every lesson T01–T23 is fully authored.
 * Write the markdown table with:  WRITE_INVENTORY=1 npx vitest run src/features/futures-edge/__tests__/inventory.test.ts
 */
import { describe, expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LESSON_IDS, validateLesson, type ContentBlock, type Fixture, type Lesson } from '@futures-edge/contracts';
import { sceneRegistry } from '../motion/registry';

const mods = import.meta.glob<{ default: Lesson; fixtures: Fixture[] }>('../content/phase-0*/T*/lesson.ts', { eager: true });
const cps = import.meta.glob<{ default: { id: string; items: unknown[]; questionIds: unknown[] } }>('../assessment/checkpoints/cp*.ts', { eager: true });
const lessons = new Map(Object.values(mods).map((m) => [m.default.id, m]));

const words = (s: string) => s.replace(/\[\[[^\]|]+\|?([^\]]*)\]\]/g, '$1').split(/\s+/).filter(Boolean).length;
function blockWords(b: ContentBlock): number {
  switch (b.kind) {
    case 'paragraph': case 'heading': case 'analogy': case 'callout': return words(b.text);
    case 'definition': return b.text ? words(b.text) : 0;
    case 'list': return b.items.reduce((n, s) => n + words(s), 0);
    case 'formula': return words(b.expression) + b.variables.reduce((n, x) => n + words(x.meaning), 0);
    case 'worked-example': return words(b.title) + b.steps.reduce((n, s) => n + words(s.text), 0) + words(b.conclusion);
    case 'table': return b.rows.flat().reduce((n, s) => n + words(s), 0);
    case 'comparison': return [...b.left.points, ...b.right.points].reduce((n, s) => n + words(s), 0);
    case 'learn-more': return b.blocks.reduce((n, x) => n + blockWords(x), 0);
    default: return 0;
  }
}

describe('content inventory', () => {
  it('has all 23 lessons fully authored and the three checkpoints', () => {
    const rows: string[] = [];
    let totals = { slides: 0, scenes: 0, exercises: 0, questions: 0, terms: 0 };
    for (const id of LESSON_IDS) {
      const m = lessons.get(id);
      expect(m, `${id} missing`).toBeDefined();
      if (!m) continue;
      const l = m.default;
      const ids = new Set(m.fixtures.map((f) => f.id));
      const v = validateLesson(l, { fixtureProvider: { has: (f) => ids.has(f) }, sceneRegistry });
      const reviewed = v.ok && v.warnings.length === 0;
      const notes = l.notesSections.filter((s) => s.heading !== 'learn-more').reduce((n, s) => n + s.blocks.reduce((a, b) => a + blockWords(b), 0), 0);
      const secs = Math.round(l.animationScenes.reduce((n, s) => n + (s.durationMs ?? 30_000), 0) / 1000);
      const safety = l.quizQuestions.filter((q) => q.safetyCritical).map((q) => q.safetyTopic).join(', ') || '—';
      totals = { slides: totals.slides + l.slides.length, scenes: totals.scenes + l.animationScenes.length, exercises: totals.exercises + l.exercises.length, questions: totals.questions + l.quizQuestions.length, terms: totals.terms + l.glossaryEntries.length };
      rows.push(`| ${id} | ${l.title} | ${l.slides.length} | ${notes} w | ${l.animationScenes.length} · ${secs}s | ${l.exercises.length} (${[...new Set(l.exercises.map((x) => x.type))].join(', ')}) | ${l.quizQuestions.length} | ${safety} | ${l.glossaryEntries.length} | ${reviewed ? '✓ gate' : '✗'} |`);
      expect(reviewed, `${id} must pass validateLesson with 0 errors / 0 warnings`).toBe(true);
    }
    const cpRows = Object.values(cps).map((c) => `| ${c.default.id} | ${c.default.items.length + c.default.questionIds.length} |`);
    expect(cpRows).toHaveLength(3);
    if (process.env['WRITE_INVENTORY'] === '1') {
      const md = [
        '# XORA Futures Edge — content inventory (generated)',
        '',
        `Generated from the lesson data by \`src/features/futures-edge/__tests__/inventory.test.ts\`. "✓ gate" = passes the contract validator with 0 errors and 0 warnings, plus the content gate (scene/exercise specs, fixtures, formula recomputation, render checks). Human SME/legal review is still pending for every lesson.`,
        '',
        '| ID | Title | Slides | Notes (counted words) | Animation (steps · length) | Exercises | Quiz | Safety-critical topics | New terms | Status |',
        '|---|---|---|---|---|---|---|---|---|---|',
        ...rows,
        `| **Total** | 23 lessons | ${totals.slides} | — | ${totals.scenes} steps | ${totals.exercises} | ${totals.questions} | — | ${totals.terms} | |`,
        '',
        '| Checkpoint | Questions |',
        '|---|---|',
        ...cpRows,
        '',
      ].join('\n');
      writeFileSync(join(process.cwd(), 'docs', 'futures-edge', 'content-inventory.md'), md);
    }
  });
});
