import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { RichText } from '../RichText';
import css from '../theme/fe.css?raw';

describe('RichText', () => {
  it('renders glossary links and bold, and escapes markup instead of executing it', () => {
    const { container } = render(<RichText text={'A [[trading-pair|pair]] and [[order-book]] are **key**. <img src=x onerror=alert(1)>'} />);
    expect(container.querySelector('[data-term-id="trading-pair"]')?.textContent).toBe('pair');
    expect(container.querySelector('[data-term-id="order-book"]')?.textContent).toBe('order book');
    expect(container.querySelector('strong')?.textContent).toBe('key');
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
  });
});

describe('.fe-root CSS scoping', () => {
  it('every selector in theme/fe.css starts with .fe-root', () => {
    const body = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const selectors: string[] = [];
    const re = /([^{};]+)\{/g;
    for (const m of body.matchAll(re)) {
      const sel = (m[1] ?? '').trim();
      if (sel.startsWith('@')) continue; // @media wrapper; its inner rules are checked too
      selectors.push(...sel.split(',').map((s) => s.trim()));
    }
    expect(selectors.length).toBeGreaterThan(20);
    const leaks = selectors.filter((s) => !/^\.fe-root(?![\w-])/.test(s));
    expect(leaks).toEqual([]);
  });
});
