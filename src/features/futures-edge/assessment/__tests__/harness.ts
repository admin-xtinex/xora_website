/**
 * TEST-ONLY harness seam. Today: Node's built-in runner (`npx -y tsx --test …`), reached through
 * tools/node-builtins.ts so the repo needs no @types/node. When Vitest is approved (D-31), change this ONE file to
 * `export { describe, it } from 'vitest'` plus an assert adapter.
 */
import { nodeAssert, nodeTest, type NodeAssert, type NodeTest } from '../tools/node-builtins';

const t: NodeTest = nodeTest();
export const describe: NodeTest['describe'] = t.describe;
export const it: NodeTest['it'] = t.it;
/** Report a test as SKIPPED with a reason (never as a vacuous pass). */
export const skip = (name: string, reason: string): void => t.it(name, { skip: reason }, () => {});
export const assert: NodeAssert = nodeAssert();
