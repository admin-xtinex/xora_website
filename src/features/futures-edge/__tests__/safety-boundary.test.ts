/// <reference types="node" />
/**
 * Safety boundary: the learning module must not be able to reach a network, an exchange, keys or accounts.
 * Scans every source file of the module (content included) for forbidden APIs and endpoints.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(process.cwd(), 'src', 'features', 'futures-edge');
const files: string[] = [];
const walk = (d: string) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(n) && !p.includes('__tests__')) files.push(p); } };
walk(ROOT);

const FORBIDDEN: Array<[string, RegExp]> = [
  ['fetch()', /\bfetch\s*\(/],
  ['XMLHttpRequest', /XMLHttpRequest/],
  ['WebSocket', /\bWebSocket\b/],
  ['EventSource', /\bEventSource\b/],
  ['sendBeacon', /sendBeacon/],
  ['axios', /\baxios\b/],
  ['exchange endpoints', /(?:api|fapi|dapi|stream)\.binance\.|wss?:\/\//i],
  ['http(s) URLs in code', /https?:\/\/(?!www\.w3\.org)/],
  ['secret/key fields', /\b(apiKey|apiSecret|secretKey|privateKey|passphrase)\b/],
  ['eval / Function', /\beval\s*\(|new Function\s*\(/],
  ['dangerouslySetInnerHTML', /dangerouslySetInnerHTML/],
  ['trading code imports', /from\s+['"][^'"]*(trading_bot|xora_v4|execution|orders?-client|binance)[^'"]*['"]/i],
];

describe('learning module safety boundary', () => {
  it('scans a non-trivial number of files', () => expect(files.length).toBeGreaterThan(30));
  for (const [name, re] of FORBIDDEN) {
    it(`contains no ${name}`, () => {
      const hits = files.filter((f) => re.test(readFileSync(f, 'utf8'))).map((f) => relative(ROOT, f));
      expect(hits).toEqual([]);
    });
  }
  it('imports only the module itself, React, and the host header/course data (read-only)', () => {
    const bad: string[] = [];
    for (const f of files) {
      for (const m of readFileSync(f, 'utf8').matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        const spec = m[1] as string;
        const ok = spec.startsWith('.') || spec.startsWith('@futures-edge/') || spec === 'react' || spec === 'react-dom' || spec === '@/components/Header' || spec === '@/components/futures-edge/courseData';
        if (!ok) bad.push(`${relative(ROOT, f)}: ${spec}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
