/**
 * Content gate: every authored lesson must pass the v1.3.0 contract validator with zero errors AND zero warnings,
 * use registered scene/exercise parameter shapes, carry valid fictional fixtures, and have every formula worked
 * example recomputed by the simulators. Scenes and widgets must render at several progress points.
 * Filter one lesson with: npx vitest run src/features/futures-edge/__tests__/content.test.ts -t T05
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import {
  ABSTAIN_DECISIONS, LESSON_IDS, validateCourse, validateFixture, validateLesson,
  type Fixture, type Lesson, type LessonId,
} from '@futures-edge/contracts';
import { sceneRegistry, FIXTURE_SCENES } from '../motion/registry';
import { checkParams } from '../motion/params';
import { CAPSTONE_CRITERIA, EXERCISE_SPECS, EXERCISE_WIDGETS } from '../exercises/registry';
import { runSimulator } from '../simulation/math';
import { TERMINAL_AREAS } from '../motion/scenes/basics';

type Mod = { default: Lesson; fixtures: Fixture[] };
const lessonMods = import.meta.glob<Mod>('../content/phase-0*/T*/lesson.ts', { eager: true });
const metaMods = import.meta.glob<{ meta: Record<string, unknown> }>('../content/phase-0*/T*/meta.ts', { eager: true });
const glossMods = import.meta.glob<{ glossaryEntries: unknown[] }>('../content/phase-0*/T*/glossary.ts', { eager: true });
const cpMods = import.meta.glob<{ default: unknown }>('../assessment/checkpoints/cp*.ts', { eager: true });

const idOf = (p: string) => /\/(T\d\d)\//.exec(p)?.[1] as LessonId;
const lessons = Object.entries(lessonMods).map(([p, m]) => ({ path: p, id: idOf(p), lesson: m.default, fixtures: m.fixtures ?? [] })).sort((a, b) => a.id.localeCompare(b.id));
const fmtIssues = (xs: Array<{ path: string; code: string; message: string }>) => xs.map((x) => `${x.path} [${x.code}] ${x.message}`).join('\n');

describe.each(lessons)('$id', ({ id, lesson, fixtures, path }) => {
  const fxIds = new Set(fixtures.map((f) => f.id));
  const getFx = (fid: string) => fixtures.find((f) => f.id === fid);

  it('passes validateLesson with no errors and no warnings', () => {
    const r = validateLesson(lesson, { fixtureProvider: { has: (f) => fxIds.has(f) }, sceneRegistry });
    expect(r.ok ? '' : fmtIssues(r.errors)).toBe('');
    expect(fmtIssues(r.warnings)).toBe('');
    expect(lesson.id).toBe(id);
    expect(path).toContain(`/phase-0${lesson.phaseId.slice(1)}/`);
  });

  it('has meta.ts and glossary.ts matching the lesson', () => {
    const meta = Object.entries(metaMods).find(([p]) => idOf(p) === id)?.[1].meta;
    const gl = Object.entries(glossMods).find(([p]) => idOf(p) === id)?.[1].glossaryEntries;
    expect(meta, 'meta.ts missing').toBeDefined();
    for (const [k, v] of Object.entries(meta ?? {})) expect((lesson as unknown as Record<string, unknown>)[k], `meta.${k}`).toEqual(v);
    expect(gl, 'glossary.ts missing').toBe(lesson.glossaryEntries);
  });

  it('has valid, clearly fictional fixtures', () => {
    for (const f of fixtures) {
      const r = validateFixture(f);
      expect(r.ok ? '' : `${f.id}: ${fmtIssues(r.errors)}`).toBe('');
      expect(fmtIssues(r.warnings)).toBe('');
      expect(f.id.startsWith(`FX-${id}-`), `${f.id} must start with FX-${id}-`).toBe(true);
      expect(/fictional|illustrative/i.test(f.label)).toBe(true);
    }
  });

  it('uses registered scene parameters and renders every scene at p = 0, 0.5, 1', () => {
    for (const s of lesson.animationScenes) {
      const def = sceneRegistry.get(s.type);
      expect(def, s.type).toBeDefined();
      expect(fmtIssues(def?.validateParameters(s.parameters) ?? []), s.id).toBe('');
      const variant = typeof s.parameters['variant'] === 'string' ? (s.parameters['variant'] as string) : undefined;
      if (FIXTURE_SCENES[s.type]?.(variant)) expect(s.fixtureId, `${s.id} (${s.type}) needs a fixtureId`).toBeDefined();
      const fixture = s.fixtureId ? getFx(s.fixtureId) : undefined;
      for (const p of [0, 0.5, 1]) {
        const html = renderToString(createElement(def!.render, { params: s.parameters, p, ...(fixture ? { fixture } : {}) }));
        expect(html.length, `${s.id} at p=${p}`).toBeGreaterThan(50);
        expect(html, `${s.id} at p=${p} shows NaN`).not.toMatch(/NaN|undefined|Infinity/);
      }
    }
  });

  it('uses registered exercise parameters and every widget renders', () => {
    for (const x of lesson.exercises) {
      const spec = EXERCISE_SPECS[x.type];
      expect(fmtIssues(checkParams(x.parameters, spec.params)), x.id).toBe('');
      expect(spec.evaluations, `${x.id} evaluation kind`).toContain(x.expectedEvaluation.kind);
      if (spec.needsChoices) expect(x.choices?.length ?? 0, `${x.id} needs choices`).toBeGreaterThan(1);
      if (spec.needsSimulator) expect(x.simulatorId, `${x.id} needs simulatorId`).toBeDefined();
      expect(getFx(x.fixtureId), `${x.id} fixture ${x.fixtureId}`).toBeDefined();
      const ev = x.expectedEvaluation;
      if (x.type === 'classify' && ev.kind === 'classification') {
        const items = (x.parameters['items'] as Array<{ id: string }>).map((i) => i.id).sort();
        const bucketIds = (x.parameters['buckets'] as Array<{ id: string }>).map((b) => b.id);
        expect(Object.values(ev.buckets).flat().sort(), `${x.id} buckets must cover every item once`).toEqual(items);
        for (const b of Object.keys(ev.buckets)) expect(bucketIds, `${x.id} bucket ${b}`).toContain(b);
      }
      if (x.type === 'sequence-order' && ev.kind === 'sequence') expect([...ev.order].sort()).toEqual((x.parameters['items'] as Array<{ id: string }>).map((i) => i.id).sort());
      if (x.type === 'hotspot-find' && ev.kind === 'sequence') {
        const areas = (x.parameters['targets'] as Array<{ area: string }>).map((t) => t.area);
        expect(ev.order).toEqual(areas);
        for (const a of areas) expect(TERMINAL_AREAS).toContain(a);
      }
      if (x.type === 'capstone-lifecycle' && ev.kind === 'rubric') for (const c of ev.criteria) expect(CAPSTONE_CRITERIA as readonly string[]).toContain(c.id);
      if (ev.kind === 'decision') {
        const words = (x.choices ?? []).map((c) => c.decision);
        for (const a of ev.acceptable) expect(words, `${x.id} acceptable ${a} needs a choice`).toContain(a);
      }
      if (x.type === 'slider-explore' && x.simulatorId) {
        const p = x.parameters as Record<string, unknown>;
        const inputs: Record<string, number> = { ...((p['fixed'] as Record<string, number>) ?? {}) };
        for (const s of p['sliders'] as Array<{ key: string; value: number }>) inputs[s.key] = s.value;
        const r = runSimulator(x.simulatorId, inputs, p['side'] === 'short' ? 'short' : 'long');
        expect(r.ok ? '' : r.error.message, `${x.id} initial slider values must compute`).toBe('');
        if (r.ok) for (const o of p['outputs'] as Array<{ key: string }>) expect(r.value[o.key], `${x.id} output ${o.key}`).toBeTypeOf('number');
      }
      const html = renderToString(createElement(EXERCISE_WIDGETS[x.type], { exercise: x, fixture: getFx(x.fixtureId), onComplete: () => {} }));
      expect(html, x.id).not.toMatch(/NaN|Infinity/);
    }
  });

  it('recomputes every formula worked example with the simulators', () => {
    for (const f of lesson.formulas ?? []) {
      for (const w of f.workedExamples) {
        const r = runSimulator(f.simulatorId, w.inputs, w.side);
        expect(r.ok ? '' : `${f.id} ${w.label}: ${r.error.message}`).toBe('');
        if (!r.ok) continue;
        for (const [k, v] of Object.entries(w.outputs)) {
          expect(r.value[k], `${f.id} "${w.label}" output ${k}`).toBeTypeOf('number');
          expect(Math.abs((r.value[k] as number) - v), `${f.id} "${w.label}" ${k}: expected ${v}, simulator ${r.value[k]}`).toBeLessThanOrEqual(w.tolerance + 1e-9);
        }
        if (f.approximate) expect(r.approximate || f.approximate).toBe(true);
      }
    }
  });

  if (lesson.phaseId === 'P5') {
    it('has at least one item whose best answer is to abstain (WAIT / NO_TRADE / STOP_TRADING)', () => {
      const inExercises = lesson.exercises.some((x) => x.expectedEvaluation.kind === 'decision' && x.expectedEvaluation.acceptable.some((a) => ABSTAIN_DECISIONS.includes(a)));
      const inQuiz = lesson.quizQuestions.some((q) => q.answer.kind === 'choice' && q.choices?.find((c) => c.id === (q.answer as { choiceId: string }).choiceId)?.decision !== undefined && ABSTAIN_DECISIONS.includes(q.choices.find((c) => c.id === (q.answer as { choiceId: string }).choiceId)?.decision as never));
      expect(inExercises || inQuiz).toBe(true);
    });
  }
});

describe('course', () => {
  it('validates as a course (partial until all 23 lessons exist)', () => {
    const all = lessons.length === LESSON_IDS.length;
    const cps = Object.values(cpMods).map((m) => m.default);
    const r = validateCourse(lessons.map((l) => l.lesson), cps, { partial: !all });
    expect(r.ok ? '' : fmtIssues(r.errors)).toBe('');
    const unexpected = r.warnings.filter((w) => !['LESSON_NOT_PRESENT', 'GLOSSARY_PENDING_OWNER', 'REF_PENDING'].includes(w.code));
    expect(fmtIssues(unexpected)).toBe('');
  });
});
