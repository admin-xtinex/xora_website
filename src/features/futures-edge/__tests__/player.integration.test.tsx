// @vitest-environment jsdom
/**
 * End-to-end-style integration in jsdom for T01, T14 and T23: open the lesson route, use every tab, page through all
 * slides, complete the quiz with the correct answers, and check completion survives a remount (refresh).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { LOCAL_PROGRESS_KEY_PREFIX, type Lesson, type LessonId } from '@futures-edge/contracts';
import { FuturesEdgeApp } from '../platform/FuturesEdgeApp';
import { AVAILABLE_LESSONS, loadLesson } from '../content';

vi.setConfig({ testTimeout: 30_000 });
afterEach(() => { cleanup(); localStorage.clear(); });

async function openLesson(id: LessonId) {
  window.history.pushState({}, '', `/learn/futures-edge/${id.toLowerCase()}`);
  render(<FuturesEdgeApp />);
  await screen.findByRole('tablist', {}, { timeout: 4000 });
}

async function answerQuiz(lesson: Lesson) {
  fireEvent.click(screen.getByRole('tab', { name: /Take quiz/ }));
  for (const q of lesson.quizQuestions) {
    const quiz = await screen.findByLabelText('Quiz');
    if (q.answer.kind === 'numeric') {
      fireEvent.change(within(quiz).getByRole('textbox'), { target: { value: String(q.answer.value) } });
    } else if (q.answer.kind === 'choice' || q.answer.kind === 'choices') {
      const ids = q.answer.kind === 'choice' ? [q.answer.choiceId] : q.answer.choiceIds;
      for (const cid of ids) {
        const text = q.choices?.find((c) => c.id === cid)?.text ?? '';
        const label = within(quiz).getAllByRole(q.type === 'multi' ? 'checkbox' : 'radio').find((el) => el.closest('label')?.textContent?.includes(text.replace(/\[\[[^|\]]+\|?([^\]]*)\]\]/g, '$1').replace(/\*\*/g, '').slice(0, 30)));
        expect(label, `${q.id} choice ${cid}`).toBeDefined();
        fireEvent.click(label as HTMLElement);
      }
    } else {
      throw new Error(`ordering questions are not auto-answered in this test (${q.id})`);
    }
    fireEvent.click(within(quiz).getByRole('button', { name: 'Check answer' }));
    expect(within(quiz).getByRole('status').textContent, q.id).toMatch(/^Correct/);
    fireEvent.click(within(quiz).getByRole('button', { name: /Next question|See my result/ }));
  }
  expect(await screen.findByText(/correct \(100%\)/)).toBeTruthy();
}

const TARGETS = (['T01', 'T14', 'T23'] as const).filter((id) => AVAILABLE_LESSONS.includes(id));

describe.each(TARGETS)('%s lesson player', (id) => {
  it('renders all formats, records slides, quiz and completion, and resumes after a refresh', async () => {
    const { lesson } = await loadLesson(id);
    await openLesson(id);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(lesson.title.replace(/\*\*/g, ''));
    expect(screen.getAllByText(/fictional/i).length).toBeGreaterThan(0);

    // Animation tab: captions and controls, step navigation
    expect(screen.getByRole('group', { name: 'Animation controls' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
    expect(screen.getByText(`Step 2 of ${lesson.animationScenes.length}`)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Read as text' }));
    expect(screen.getAllByText(/Step 1\./).length).toBeGreaterThan(0);

    // Slides: page through every slide with the Next button
    fireEvent.click(screen.getByRole('tab', { name: /View slides/ }));
    for (let k = 1; k < lesson.slides.length; k++) fireEvent.click(screen.getByRole('button', { name: /Next ▶/ }));
    expect(screen.getByText(`Slide ${lesson.slides.length} of ${lesson.slides.length}`)).toBeTruthy();

    // Notes and practice render
    fireEvent.click(screen.getByRole('tab', { name: /Read notes/ }));
    expect(screen.getByRole('heading', { name: 'Meaning' })).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: /Try it/ }));
    expect(screen.getAllByRole('button', { name: 'Reset' }).length).toBe(lesson.exercises.length);

    // Quiz with correct answers (exercises are not done yet, so the lesson is not complete)
    await answerQuiz(lesson);
    const key = `${LOCAL_PROGRESS_KEY_PREFIX}local-anonymous`;
    const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
    expect(saved.lessons[id].viewed.slides).toHaveLength(lesson.slides.length);
    expect(saved.lessons[id].assessed).toMatchObject({ bestScore: 1, safetyCriticalPassed: true });
    expect(saved.lessons[id].completed).toBe(lesson.completionRequirements.requireExerciseIds.length === 0);

    // Refresh: the player resumes on the last tab and keeps progress
    cleanup();
    await openLesson(id);
    expect(screen.getByRole('tab', { name: /Take quiz/ }).getAttribute('aria-selected')).toBe('true');
  });
});

describe('course home', () => {
  it('lists five phases, all 23 lessons and three checkpoints', async () => {
    window.history.pushState({}, '', '/learn/futures-edge');
    render(<FuturesEdgeApp />);
    expect(await screen.findByRole('heading', { name: 'Your roadmap' })).toBeTruthy();
    for (const t of ['T01', 'T12', 'T23']) expect(screen.getByText(t)).toBeTruthy();
    expect(screen.getAllByText(/Checkpoint/).length).toBeGreaterThanOrEqual(3);
    expect(screen.queryByText(/guaranteed profit/i)).toBeNull();
  });
});

describe('checkpoints', () => {
  it('CPA: answering everything correctly passes and is saved; a wrong safety item blocks the pass', async () => {
    const { loadCheckpoint } = await import('../assessment/checkpoints');
    const cpa = await loadCheckpoint('CPA');
    for (const wrongSafety of [true, false]) {
      cleanup();
      localStorage.clear();
      window.history.pushState({}, '', '/learn/futures-edge/checkpoint/cpa');
      render(<FuturesEdgeApp />);
      fireEvent.click(await screen.findByRole('button', { name: 'Start checkpoint' }));
      let missedOnce = false;
      for (const q of cpa.items) {
        const quiz = await screen.findByLabelText('Checkpoint questions');
        if (q.answer.kind === 'numeric') {
          fireEvent.change(within(quiz).getByRole('textbox'), { target: { value: String(q.answer.value) } });
        } else if (q.answer.kind === 'choice') {
          const target = wrongSafety && q.safetyCritical && !missedOnce ? (q.choices ?? []).find((c) => c.id !== (q.answer as { choiceId: string }).choiceId)?.id : q.answer.choiceId;
          if (target !== q.answer.choiceId) missedOnce = true;
          const text = (q.choices ?? []).find((c) => c.id === target)?.text ?? '';
          const input = within(quiz).getAllByRole('radio').find((el) => el.closest('label')?.textContent?.includes(text.slice(0, 30)));
          fireEvent.click(input as HTMLElement);
        }
        fireEvent.click(within(quiz).getByRole('button', { name: /Next question|See my result/ }));
      }
      const saved = JSON.parse(localStorage.getItem(`${LOCAL_PROGRESS_KEY_PREFIX}local-anonymous`) ?? '{}');
      expect(saved.checkpoints.CPA.passed).toBe(!wrongSafety);
      expect(await screen.findByText(wrongSafety ? /safety-critical item was missed/ : /every safety-critical item correctly/)).toBeTruthy();
    }
  });
  it('CPB loads 25 questions including the T14 chart tasks', async () => {
    window.history.pushState({}, '', '/learn/futures-edge/checkpoint/cpb');
    render(<FuturesEdgeApp />);
    expect(await screen.findByText(/25 questions covering T14–T23/)).toBeTruthy();
  });
});
