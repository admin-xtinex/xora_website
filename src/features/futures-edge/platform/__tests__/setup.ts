/**
 * jsdom lacks a few browser APIs the host landing page uses (matchMedia, IntersectionObserver).
 * Minimal inert stubs so the real <App/> can render in tests. Test-only.
 */
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

if (!('IntersectionObserver' in window)) {
  class InertIntersectionObserver {
    readonly root = null;
    readonly rootMargin = '0px';
    readonly thresholds: readonly number[] = [0];
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  Object.defineProperty(window, 'IntersectionObserver', { value: InertIntersectionObserver, writable: true });
  Object.defineProperty(globalThis, 'IntersectionObserver', { value: InertIntersectionObserver, writable: true });
}

{
  // jsdom's play() is "not implemented"; the hero video calls it.
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
}

// jsdom prints "not implemented" for scrollTo; the shell scrolls to top after navigation.
window.scrollTo = () => {};
