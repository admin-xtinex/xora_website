/** Flag gate + lazy route mount in the real host <App/> (src/App.tsx). */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ROUTE_BASE } from '@futures-edge/contracts';
import { setPath } from './test-utils';

let moduleImports = 0;

async function loadApp(flag: string | undefined) {
  vi.resetModules();
  if (flag === undefined) vi.stubEnv('VITE_FUTURES_EDGE_ENABLED', undefined as unknown as string);
  else vi.stubEnv('VITE_FUTURES_EDGE_ENABLED', flag);
  moduleImports = 0;
  vi.doMock('@/features/futures-edge', async (importOriginal) => {
    moduleImports += 1;
    return importOriginal();
  });
  return import('@/App');
}

beforeEach(() => {
  setPath('/');
});

describe('host mount behind VITE_FUTURES_EDGE_ENABLED', () => {
  it('keeps the host route base in sync with the contract ROUTE_BASE', async () => {
    const { FUTURES_EDGE_ROUTE_BASE } = await loadApp(undefined);
    expect(FUTURES_EDGE_ROUTE_BASE).toBe(ROUTE_BASE);
  });

  it.each([undefined, '', 'false', '1', 'TRUE', 'true ', 'yes'])(
    'flag OFF (%j): /learn/futures-edge renders the landing page and never loads the module',
    async (flag) => {
      setPath('/learn/futures-edge/t14');
      const { App } = await loadApp(flag);
      render(<App />);
      expect(screen.getByText('Skip to content')).toBeTruthy();
      expect(screen.queryByTestId('fe-root')).toBeNull();
      await new Promise((r) => setTimeout(r, 20));
      expect(screen.queryByTestId('fe-root')).toBeNull();
      expect(moduleImports).toBe(0);
    },
  );

  it('flag ON: /learn/futures-edge lazily loads and renders the learning shell inside .fe-root', async () => {
    setPath('/learn/futures-edge');
    const { App } = await loadApp('true');
    render(<App />);
    expect(moduleImports).toBe(0); // not loaded until rendered
    const root = await screen.findByTestId('fe-root');
    expect(root.classList.contains('fe-root')).toBe(true);
    expect(screen.getByRole('heading', { level: 1, name: 'XORA Futures Edge' })).toBeTruthy();
    expect(screen.queryByText('Skip to content')).toBeNull();
    expect(moduleImports).toBe(1);
  });

  it('flag ON: other paths still render the landing page without loading the module', async () => {
    setPath('/');
    const { App } = await loadApp('true');
    render(<App />);
    expect(screen.getByText('Skip to content')).toBeTruthy();
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByTestId('fe-root')).toBeNull();
    expect(moduleImports).toBe(0);
  });

  it('flag ON: a look-alike path (/learn/futures-edgeX) is not the learning area', async () => {
    setPath('/learn/futures-edgeX');
    const { App } = await loadApp('true');
    render(<App />);
    expect(screen.getByText('Skip to content')).toBeTruthy();
    expect(moduleImports).toBe(0);
  });
});
