import { describe, expect, it, beforeEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { LESSON_IDS } from '@futures-edge/contracts';
import { FuturesEdgeApp } from '../FuturesEdgeApp';
import { navigate, parseRoute, pathFor, isWithinBase } from '../router';
import { EMPTY_REGISTRY, SAMPLE_REGISTRY, setPath } from './test-utils';

describe('parseRoute / pathFor', () => {
  it('parses home, with or without trailing slash', () => {
    expect(parseRoute('/learn/futures-edge')).toEqual({ name: 'home' });
    expect(parseRoute('/learn/futures-edge/')).toEqual({ name: 'home' });
  });
  it('parses every lesson slug t01..t23 and round-trips', () => {
    for (const id of LESSON_IDS) {
      const path = pathFor({ name: 'lesson', lessonId: id });
      expect(path).toBe(`/learn/futures-edge/${id.toLowerCase()}`);
      expect(parseRoute(path)).toEqual({ name: 'lesson', lessonId: id });
    }
  });
  it('parses checkpoints', () => {
    expect(parseRoute('/learn/futures-edge/checkpoint/cpa')).toEqual({ name: 'checkpoint', checkpointId: 'CPA' });
    expect(pathFor({ name: 'checkpoint', checkpointId: 'CP1' })).toBe('/learn/futures-edge/checkpoint/cp1');
  });
  it('rejects unknown paths inside the base and ignores paths outside it', () => {
    expect(parseRoute('/learn/futures-edge/t24')).toEqual({ name: 'not-found', path: '/learn/futures-edge/t24' });
    expect(parseRoute('/learn/futures-edge/checkpoint/cpz')?.name).toBe('not-found');
    expect(parseRoute('/learn/futures-edge/t14/extra')?.name).toBe('not-found');
    expect(parseRoute('/')).toBeNull();
    expect(parseRoute('/learn/futures-edgex')).toBeNull();
    expect(isWithinBase('/learn/futures-edge/t01')).toBe(true);
  });
});

describe('History-API navigation in the shell', () => {
  beforeEach(() => setPath('/learn/futures-edge'));

  it('clicking a lesson link pushes history and renders the lesson without a reload', async () => {
    const before = window.history.length;
    render(<FuturesEdgeApp registry={SAMPLE_REGISTRY} />);
    fireEvent.click(screen.getByRole('link', { name: /T14/ }));
    expect(window.location.pathname).toBe('/learn/futures-edge/t14');
    expect(window.history.length).toBe(before + 1);
    expect(await screen.findByTestId('fe-lesson-ready')).toBeTruthy();
  });

  it('back/forward (popstate) re-renders the matching route', async () => {
    render(<FuturesEdgeApp registry={EMPTY_REGISTRY} />);
    act(() => navigate('/learn/futures-edge/t02'));
    expect(await screen.findByTestId('fe-empty-content')).toBeTruthy();
    act(() => {
      window.history.replaceState(null, '', '/learn/futures-edge');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('heading', { level: 1, name: 'XORA Futures Edge' })).toBeTruthy();
  });

  it('pager links move between lessons and update document.title', async () => {
    setPath('/learn/futures-edge/t01');
    render(<FuturesEdgeApp registry={EMPTY_REGISTRY} />);
    expect(screen.queryByRole('link', { name: /←/ })).toBeNull(); // no lesson before T01
    fireEvent.click(screen.getByRole('link', { name: 'T02 →' }));
    expect(window.location.pathname).toBe('/learn/futures-edge/t02');
    expect(await screen.findByRole('heading', { level: 1, name: /^T02:/ })).toBeTruthy();
    expect(document.title).toMatch(/^T02 /);
  });

  it('modified clicks are left to the browser (no pushState)', () => {
    render(<FuturesEdgeApp registry={EMPTY_REGISTRY} />);
    const link = screen.getByRole('link', { name: /T05/ });
    fireEvent.click(link, { ctrlKey: true });
    expect(window.location.pathname).toBe('/learn/futures-edge');
    expect(link.getAttribute('href')).toBe('/learn/futures-edge/t05');
  });

  it('renders the checkpoint and not-found states', () => {
    setPath('/learn/futures-edge/checkpoint/cpb');
    const { unmount } = render(<FuturesEdgeApp registry={EMPTY_REGISTRY} />);
    expect(screen.getByTestId('fe-checkpoint-unavailable')).toBeTruthy();
    unmount();
    setPath('/learn/futures-edge/nope');
    render(<FuturesEdgeApp registry={EMPTY_REGISTRY} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeTruthy();
  });
});
