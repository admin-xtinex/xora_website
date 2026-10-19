/**
 * TOOL/TEST-ONLY, READ-ONLY loader for lesson question banks (EDGE-09 never writes to other bots' folders).
 *  1. In-repo content: <repo>/src/features/futures-edge/content/phase-0N/Tnn/lesson.ts (empty on this branch until the
 *     author PRs merge into feature/futures-edge).
 *  2. Extra roots from FE_BANK_ROOTS (":"-separated directories that contain Tnn/lesson.ts), e.g. the staged drafts on
 *     the box. Staged drafts import `@futures-edge/contracts`, so run with a tsconfig that maps that alias
 *     (see README "Real-bank run").
 * The first source that provides a lesson id wins.
 */
import type { Lesson } from '../../contracts';
import { nodeFs, nodeProcess, nodeUrl } from './node-builtins';

export interface LoadedLesson { source: string; path: string; lesson: Lesson }

export function bankRoots(): string[] {
  const p = nodeProcess();
  const repo = `${p.cwd()}/src/features/futures-edge/content`;
  const inRepo = [1, 2, 3, 4, 5].map((n) => `${repo}/phase-0${n}`);
  const extra = (p.env['FE_BANK_ROOTS'] ?? '').split(':').map((s) => s.trim()).filter(Boolean);
  return [...inRepo, ...extra];
}

export async function loadLessons(roots: readonly string[] = bankRoots()): Promise<LoadedLesson[]> {
  const fs = nodeFs();
  const { pathToFileURL } = nodeUrl();
  const seen = new Map<string, LoadedLesson>();
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const dir of fs.readdirSync(root).filter((d) => /^T\d\d$/.test(d)).sort()) {
      const path = `${root}/${dir}/lesson.ts`;
      if (seen.has(dir) || !fs.existsSync(path)) continue;
      const mod = (await import(pathToFileURL(path).href)) as { default?: Lesson };
      if (mod.default && typeof mod.default === 'object') seen.set(dir, { source: root, path, lesson: mod.default });
    }
  }
  return [...seen.values()].sort((a, b) => a.lesson.id.localeCompare(b.lesson.id));
}
