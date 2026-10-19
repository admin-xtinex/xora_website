import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { buildLessonRegistry, lessonRegistry, type LessonRegistry } from '@futures-edge/content';
import { FuturesEdgeApp } from '../FuturesEdgeApp';
import { loadLesson } from '../content-loader';
import { EMPTY_REGISTRY, SAMPLE_REGISTRY, sampleLesson, setPath } from './test-utils';

describe('loadLesson', () => {
  it('returns not-published when no lesson file exists', async () => {
    expect(await loadLesson('T07', EMPTY_REGISTRY)).toEqual({ status: 'not-published', lessonId: 'T07' });
  });
  it('validates content with the contract validator before returning it', async () => {
    const r = await loadLesson('T14', SAMPLE_REGISTRY);
    expect(r.status).toBe('ready');
    const bad: LessonRegistry = { T14: () => Promise.resolve({ default: { id: 'T14' } as never }) };
    const inv = await loadLesson('T14', bad);
    expect(inv.status).toBe('invalid');
    if (inv.status === 'invalid') expect(inv.errors.length).toBeGreaterThan(0);
  });
  it('rejects a valid lesson filed under another id', async () => {
    const wrong: LessonRegistry = { T15: () => Promise.resolve({ default: sampleLesson }) };
    const r = await loadLesson('T15', wrong);
    expect(r.status).toBe('invalid');
    if (r.status === 'invalid') expect(r.errors[0]?.code).toBe('LESSON_ID_MISMATCH');
  });
  it('reports a chunk that fails to load', async () => {
    const broken: LessonRegistry = { T01: () => Promise.reject(new Error('chunk failed')) };
    expect(await loadLesson('T01', broken)).toEqual({ status: 'load-error', lessonId: 'T01', message: 'chunk failed' });
  });
});

describe('lesson registry', () => {
  it('registers lesson files only from their contract phase folder', () => {
    const loader = () => Promise.resolve({ default: sampleLesson });
    const { registry, issues } = buildLessonRegistry({
      './phase-04/T14/lesson.ts': loader,
      './phase-01/T14/lesson.ts': loader,
      './phase-05/T24/lesson.ts': loader,
    });
    expect(Object.keys(registry)).toEqual(['T14']);
    expect(issues.map((i) => i.path)).toEqual(['./phase-01/T14/lesson.ts', './phase-05/T24/lesson.ts']);
  });
  it('the built-in registry only contains lesson files that really exist (none on this branch)', () => {
    expect(Object.keys(lessonRegistry)).toEqual([]);
  });
});

describe('lesson shell states', () => {
  beforeEach(() => setPath('/learn/futures-edge/t14'));

  it('empty content: shows a clear not-available state and no completion/progress', async () => {
    render(<FuturesEdgeApp registry={EMPTY_REGISTRY} />);
    const alert = await screen.findByTestId('fe-empty-content');
    expect(alert.textContent).toMatch(/not been published/);
    expect(alert.textContent).toMatch(/not marked as started or completed/);
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.queryByText(/^(completed|done|100%)$/i)).toBeNull();
    expect(screen.queryByTestId('fe-lesson-ready')).toBeNull();
  });

  it('course home shows 0 of 23 published with the empty built-in registry', () => {
    setPath('/learn/futures-edge');
    render(<FuturesEdgeApp />);
    expect(screen.getByTestId('fe-published-count').textContent).toMatch(/^0 of 23 lessons published/);
    expect(screen.getAllByText('Not published yet')).toHaveLength(23);
  });

  it('invalid content: shows a validation error state, not the lesson', async () => {
    const bad: LessonRegistry = { T14: () => Promise.resolve({ default: { id: 'T14' } as never }) };
    render(<FuturesEdgeApp registry={bad} />);
    expect(await screen.findByTestId('fe-invalid-content')).toBeTruthy();
    expect(screen.queryByTestId('fe-lesson-ready')).toBeNull();
  });

  it('valid content: renders title, summary and objectives from the data, not from app code', async () => {
    render(<FuturesEdgeApp registry={SAMPLE_REGISTRY} />);
    await screen.findByTestId('fe-lesson-ready');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(sampleLesson.title.replace(/\*\*/g, ''));
    for (const o of sampleLesson.objectives) {
      expect(document.body.textContent).toContain(o.replace(/\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g, '$2').replace(/\*\*/g, '').slice(0, 20));
    }
    expect(screen.getByTestId('fe-lesson-sections').textContent).toContain(`${sampleLesson.slides.length} slides`);
  });
});
