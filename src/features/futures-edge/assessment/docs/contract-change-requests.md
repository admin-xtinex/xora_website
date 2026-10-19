# EDGE-09 · Contract change requests (to EDGE-00). Contracts are not edited by EDGE-09.

Checked against contracts **v1.3.0** (`src/features/futures-edge/contracts`, 19 Oct 2026 ~08:35 IST). EDGE-09 builds and tests green on 1.3.0 without these; they remove workarounds.

## CR-1 (MINOR, additive) · `Progress.assessed.questionSetVersion?: string`
- **Why:** `Progress.assessed` (`bestScore`, `attempts`, `safetyCriticalPassed`) has no record of *which* question set produced the score, and `Progress` has no attempt list. A lesson edit that changes an answer key cannot be detected from `Progress` alone.
- **Workaround today:** EDGE-09 keeps lesson attempts in its own side store (`appendLessonAttempt` / `loadLessonAttempts`, schema-versioned) and re-derives `assessed` + `completed` from current-version attempts on every `openLesson`.
- **Ask:** optional `questionSetVersion` on `assessed` (format `<contentVersion>+c.<12 hex>.g.<12 hex>`), validated as a string by `validateProgress`. `QuizAttempt.questionSetVersion` (required) already exists on attempts; this mirrors it on the lesson summary, so a server or QA tool can see stale progress without the attempt list.

## CR-2 (MINOR, additive) · `validateCheckpointProgress(x)`
- **Why:** `validateProgress` covers lesson `Progress` only. EDGE-09 validates `CheckpointProgress` records with its own guard in `progress/schema.ts` (corrupt or hand-edited local data is quarantined).
- **Ask:** a contract validator so EDGE-10 QA and a future server use the same rule.

## CR-3 (doc only) · document that a checkpoint may reference lesson question ids
- CP1/CPA/CPB `questionIds` reference `Tnn-Qnn` lesson items (plus `CPx-Qnn` items in `items[]`). `validateCheckpoint` accepts this; a sentence in `question.ts` would stop authors from duplicating lesson items as CPx copies.

## Notes for other bots (no contract change)
- **EDGE-05 / EDGE-06:** no staged Phase 4/5 item is a safety-critical `leverage` item, so CPB's mandatory `leverage` topic rests on EDGE-09's pending CPB-Q04. If T17/T18 include a leverage safety item, CPB can reference it.
- **All authors:** 28 safety-critical items have no `remediationRef` (warning `Q_SAFETY_REMEDIATION_MISSING`; see `reports/question-bank-coverage.md`). The remediation screen then links to the lesson start instead of the exact note/slide.
- **D-37 (all authors):** 21 of 23 numeric lesson questions have no `rounding` (the contract only warns in some cases; EDGE-09's strict check reports them). List with minimal fixes: `reports/question-bank-coverage.md` § D-37. 13 of them are referenced by CP1 (3), CPA (4) and CPB (6).
- **EDGE-06:** the legacy `drafts/phase-05/T19.json` Q4 used "NO_TRADE: stop for the session"; the port correctly tags T19-Q04 as `STOP_TRADING` (session set). The legacy JSON is superseded and no longer read by EDGE-09 except for the coverage report.
