# EDGE-09 · Assessment & Progress (`src/features/futures-edge/assessment/`)

Owner: EDGE-09 (ownership.md). Branch: `futures-edge/edge-09-assessment-progress`.
Contracts **v1.3.0**, imported from the package root `src/features/futures-edge/contracts/index.ts` by relative path
(`../../contracts`, or `../contracts` from `index.ts`) — the same convention as EDGE-03/EDGE-04 — until EDGE-01 wires the D-10
alias `@futures-edge/contracts`. Nothing inside `contracts/` is imported deep or edited.

> **Education only.** Passing a quiz, a checkpoint or the course is never permission to trade. Every result and
> completion record carries `educationOnly: true` and `authorizesLiveTrading: false`. Progress today is a
> **local-only demo**: this device only, not cloud-synced, can be cleared by the browser, not tamper-proof.

## Run (repo root, Node ≥ 20.16; box: 20.19.2)
```bash
npm ci
npm run typecheck                                    # tsc --noEmit (TS 7.0.2, repo tsconfig, includes these tests)
npx -y tsx --test src/features/futures-edge/assessment/__tests__/*.test.ts src/features/futures-edge/assessment/__tests__/*.test.tsx
bash src/features/futures-edge/assessment/tools/boundary-scan.sh
```
The repo has **no lint script and no test runner** yet (D-31: Vitest is pending approval). Tests use Node's built-in
runner through `tools/node-builtins.ts` (`process.getBuiltinModule`), so they need **no @types/node, no ambient
`declare module 'node:*'` shim and no new devDependency**. Switching to Vitest = change `__tests__/harness.ts` only.

### Real-bank run (lessons not yet merged into this branch)
On this branch `src/features/futures-edge/content/` is empty, so the CP1/CPA real-bank checks report **skipped**.
To run them against the staged author drafts on the box (read-only), map their `@futures-edge/contracts` import with a
throwaway tsconfig outside the repo and point `FE_BANK_ROOTS` at them:
```bash
cat > /tmp/tsconfig.banks.json <<'JSON'
{ "extends": "<repo>/tsconfig.json",
  "compilerOptions": { "paths": { "@/*": ["<repo>/src/*"],
    "@futures-edge/contracts": ["<repo>/src/features/futures-edge/contracts/index.ts"] } } }
JSON
D=/workspace/futures-edge/drafts
export FE_BANK_ROOTS="$D/edge-02/features/futures-edge/content/phase-01:$D/edge-03/features/futures-edge/content/phase-02:$D/edge-04/features/futures-edge/content/phase-03:$D/edge-05/content/phase-04:$D/edge-06/features/futures-edge/content/phase-05"
npx -y tsx --tsconfig /tmp/tsconfig.banks.json --test src/features/futures-edge/assessment/__tests__/real-banks.test.ts
npx -y tsx --tsconfig /tmp/tsconfig.banks.json src/features/futures-edge/assessment/tools/report-banks.ts   # → reports/question-bank-coverage.md
```
Once the author PRs merge, the in-repo content is picked up automatically (no env needed).

## File map
| Area | Files |
|---|---|
| Engine | `engine/grader.ts` (7 question types, per-choice feedback, abstention tracking via `Choice.decision`, configurable `ScoringPolicy`, 0.8 default, safety gating by topic) · `engine/retry.ts` (history, seeded reshuffle, missed-safety-first, remediation `~remN`, stale detection) · `engine/session.ts` (pure reducer) · `engine/shuffle.ts` · `engine/hash.ts` · `engine/strings.ts` · `engine/types.ts` |
| Question sets | `question-sets/manifest.ts` (`<ver>+c.<hash12>.g.<hash12>`) · `question-sets/validator.ts` (ids, keys, rationales, distractor feedback, safety topics, P5 abstention rule, required topics, **D-37 `numericRoundingIssues`**, tamper check) · `question-sets/bank.ts` |
| Checkpoints | `checkpoints/plan.ts` · `cp1.ts` (8 refs, **non-gating**) · `cpa.ts` (24 refs, after T13, gating) · `cpb.ts` (26 slots, after T23, gating) · `build.ts` (plan → contract `CheckpointConfig` + gaps; `CP_NUMERIC_D37`) · `gate.ts` · `disclaimer.ts` |
| Progress | `progress/adapter.ts` · `progress/local-demo-adapter.ts` (**LocalOnlyDemoProgressAdapter**) · `progress/storage.ts` · `progress/schema.ts` · `progress/service.ts` · `progress/completion.ts` · `progress/server-adapter.ts` (production path; no network code) |
| UI (React 19) | `ui/QuizRunner.tsx` · `QuestionView.tsx` · `FeedbackPanel.tsx` · `SafetyCriticalCallout.tsx` · `RetryPanel.tsx` · `CheckpointGate.tsx` · `ProgressDisplay.tsx` · `EducationOnlyNotice.tsx` · `RichText.tsx` · `assessment.css` (scoped under `.fe-root`) |
| Entry | `index.ts` (public barrel) · `flag.ts` (`assessmentEnabled(raw)` for `VITE_FUTURES_EDGE_ENABLED`) |
| Tests (test-only) | `__tests__/*.test.ts(x)`, `__tests__/harness.ts`, `__tests__/fixtures/` |
| Tools (tool-only) | `tools/node-builtins.ts`, `tools/load-banks.ts`, `tools/report-banks.ts`, `tools/boundary-scan.sh` |
| Docs / reports | `docs/MIGRATION-server-adapter.md` · `docs/contract-change-requests.md` · `reports/question-bank-coverage.md` (snapshot, regenerate with the tool) |

Runtime code never imports `tools/` or `__tests__/` (boundary scan check 7). The app does not import this module yet,
so it is not in the production bundle until EDGE-01 mounts it behind the flag.

## Handoff to EDGE-01 (host/shell files EDGE-09 does not edit)
1. `tsconfig.json` `paths` + `vite.config.ts` `resolve.alias`: `@futures-edge/assessment` → `src/features/futures-edge/assessment/index.ts` (D-10). When `@futures-edge/contracts` is wired, EDGE-09 will switch its relative contract imports in one commit.
2. Import `assessment/ui/assessment.css` once inside the `.fe-root` shell. It uses `--fe-*` tokens with fallbacks; EDGE-01's theme should define `--fe-accent`, `--fe-surface-2` (aliasing host vars, A6).
3. Pass the flag: `assessmentEnabled(import.meta.env.VITE_FUTURES_EDGE_ENABLED)`; construct `new ProgressService(new LocalOnlyDemoProgressAdapter())` and show `ProgressDisplay` (it renders the local-only label).
4. Checkpoint pages: `buildCheckpoint(CPx_PLAN, buildQuestionBank(allLessons))`; an `incomplete` build renders as a practice preview and cannot be passed.
