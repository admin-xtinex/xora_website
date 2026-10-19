# EDGE-09 · Production migration: local-only demo → server-graded progress

**Today (static Vite site on Azure SWA, no authenticated backend):** progress is stored by
`LocalOnlyDemoProgressAdapter` — *local-only demo, this device only, not cloud-synced, can be cleared by the
browser, not tamper-proof.* Anything it says about scores is advisory. Completion is education-only and never
permission to trade (`authorizesLiveTrading: false` everywhere).

**Target:** `ServerBackedProgressAdapter` + a backend that grades from **versioned question sets**, so a client
score is never trusted.

## 1. What is already built (box-tested, no network calls)
| Piece | File | Status |
|---|---|---|
| Adapter interface (contract `ProgressStorageAdapter` + attempt log, label, persistence mode, issues) | `progress/adapter.ts` | done |
| Local demo adapter (localStorage → memory fallback, schema v2, namespaced keys, quarantine of corrupt blobs) | `progress/local-demo-adapter.ts`, `progress/schema.ts` | done, 16 tests |
| Server adapter: sends **activity only** (viewed / practiced / lastStepId); `appendLessonAttempt` throws `CLIENT_ATTEMPTS_NOT_ACCEPTED`; attempts go through `submitAttempt(raw responses)` | `progress/server-adapter.ts` | done, transport is an interface |
| Reference grader for the server: `serverGradeSubmission(registry, body, now)` — looks up the manifest by `questionSetVersion`, ignores any client `score/passed/correct` fields, rejects `UNKNOWN_QUESTION_SET`, `SCOPE_MISMATCH`, `BAD_SUBMISSION`, `REMEDIATION_BASE_MISSING` | `progress/server-adapter.ts` | done, 6 tests |
| Manifests: `questionSetVersion = <contentVersion>+c.<contentHash12>.g.<gradingHash12>` (SHA-256 of canonical JSON) | `question-sets/manifest.ts` | done |

## 2. Backend steps (needs user authorisation: new infra, auth, data storage)
1. **Auth.** SWA built-in auth or Entra External ID. `userId` comes from the session on the server; the client never sends it (the adapter ignores its `userId` argument on purpose).
2. **API.** Azure Functions (SWA managed API) implementing `ServerAssessmentTransport`:
   `GET /api/fe/progress[/:lessonId]`, `PUT /api/fe/progress/:lessonId/activity`, `GET /api/fe/attempts/:lessonId`,
   `GET /api/fe/checkpoints/:id`, `POST /api/fe/attempts` (body = `AttemptSubmission`), `DELETE /api/fe/progress` (user's own data).
   EDGE-09 writes the browser transport (`fetch`) only when this exists; today the module has zero network code (boundary scan).
3. **Registry at deploy time.** Build `Map<questionSetVersion, QuestionSetManifest>` on the server from the same content bundle (`buildLessonManifest`, `buildCheckpoint(...).manifest`). Keep old versions so in-flight attempts can still be graded; never accept a manifest from the client.
4. **Grade on the server** with `serverGradeSubmission`. Store `QuizAttempt` + `AttemptResult` server-side; derive `Progress.assessed`, `completed`, `CheckpointProgress.passed` there.
5. **Storage.** A per-user progress store (e.g. Table Storage / Cosmos DB). This is *education* data only — not a trading database, no order/exchange data, no API keys.
6. **Rate-limit + size-limit** `POST /attempts` (attempt spam cannot raise a score because grading is deterministic per response, but it fills storage).
7. **Privacy.** Progress is personal data: retention policy, export and delete endpoints, privacy-notice update.

## 3. Client switch-over
- Construct `new ProgressService(new ServerBackedProgressAdapter(transport))` behind the existing flag `VITE_FUTURES_EDGE_ENABLED` plus a second server flag; keep the local adapter as the signed-out fallback, still labelled local-only.
- **Import of local demo data:** offer "copy my local practice history" once after sign-in. Send only **activity** (`viewed`, `practiced`, `lastStepId`). Local scores are **not** imported as passes; the learner re-takes graded quizzes (they cannot be verified).
- UI copy switches from `LOCAL_DEMO_LABEL` to the adapter's `label` automatically (`ProgressDisplay` reads `persistence()`).

## 4. Stale versions after a content change
- Same major, identical hashes → attempts still count (pure version bumps do not reset learners).
- Text-only change (content hash differs, grading hash same) → default `staleWhen: 'any-change'` marks attempts stale; switch to `'grading-change'` to keep them.
- Grading change or major bump → stale; learner re-takes. The server applies the same rule (`compareQuestionSetVersion`).

## 5. Not solvable client-side (stated plainly)
A static site cannot stop a learner editing localStorage or calling `gradeAttempt` with the answer key that ships
in the bundle. That is acceptable only because local completion grants nothing. Anything that must be trusted
(certificates, leaderboards, gating of paid features) needs steps 1–4.
