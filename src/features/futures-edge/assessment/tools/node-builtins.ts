/**
 * TEST/TOOL-ONLY (EDGE-09). Typed access to the few Node built-ins the tests and tools need, WITHOUT ambient
 * `declare module 'node:*'` shims and without @types/node (the repo has neither, and two bots declaring the same
 * ambient module would clash at integration). Uses `process.getBuiltinModule` (Node ≥ 20.16; box: 20.19.2).
 * Never imported by runtime assessment code (boundary test enforces this).
 */
type TestFn = () => void | Promise<void>;
export interface NodeTest {
  describe(name: string, fn: TestFn): void;
  it(name: string, fn: TestFn): void;
  it(name: string, options: { skip?: string | boolean }, fn: TestFn): void;
}
export interface NodeAssert {
  (value: unknown, message?: string): asserts value;
  ok(value: unknown, message?: string): asserts value;
  equal(actual: unknown, expected: unknown, message?: string): void;
  notEqual(actual: unknown, expected: unknown, message?: string): void;
  deepEqual(actual: unknown, expected: unknown, message?: string): void;
  notDeepEqual(actual: unknown, expected: unknown, message?: string): void;
  throws(fn: () => unknown, expected?: unknown, message?: string): void;
  rejects(fn: (() => Promise<unknown>) | Promise<unknown>, expected?: unknown, message?: string): Promise<void>;
  match(value: string, re: RegExp, message?: string): void;
  doesNotMatch(value: string, re: RegExp, message?: string): void;
}
export interface NodeFs {
  readFileSync(path: string, encoding: 'utf8'): string;
  writeFileSync(path: string, data: string, encoding: 'utf8'): void;
  readdirSync(path: string): string[];
  existsSync(path: string): boolean;
  statSync(path: string): { isDirectory(): boolean };
}
export interface NodeUrl { pathToFileURL(path: string): { href: string } }
interface NodeProcess {
  getBuiltinModule?(id: string): unknown;
  cwd(): string;
  env: Record<string, string | undefined>;
  exitCode?: number;
}

const proc = (globalThis as unknown as { process?: NodeProcess }).process;
function builtin<T>(id: string): T {
  const m = proc?.getBuiltinModule?.(id);
  if (!m) throw new Error(`EDGE-09 tests/tools need Node ≥ 20.16 (process.getBuiltinModule unavailable for ${id})`);
  return m as T;
}

export const nodeTest = (): NodeTest => builtin<NodeTest>('node:test');
export const nodeAssert = (): NodeAssert => builtin<NodeAssert>('node:assert/strict');
export const nodeFs = (): NodeFs => builtin<NodeFs>('node:fs');
export const nodeUrl = (): NodeUrl => builtin<NodeUrl>('node:url');
export const nodeProcess = (): NodeProcess => {
  if (!proc) throw new Error('not running under Node');
  return proc;
};
