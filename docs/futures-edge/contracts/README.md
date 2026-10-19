# XORA Futures Edge — shared contracts (v1.3.0, FROZEN for Wave 1/2; see CHANGELOG.md)

Owner: **EDGE-00 Mission Control**. Target repo path: `features/futures-edge/contracts/`
(currently staged on the box at `/workspace/futures-edge/docs/contracts/`; not yet committed — see architecture.md §9).

Plain TypeScript, **zero runtime dependencies** (the repo has no zod/ajv; it has no package.json at all).
Framework-agnostic: no React/DOM types, so the same contracts work whatever UI stack EDGE-01 lands.

## Import rule
Import **only** via `@futures-edge/contracts` (alias → `features/futures-edge/contracts/index.ts`, which re-exports
`src/index.ts`). Never deep-import, never copy. Staging tsconfig: `"paths": { "@futures-edge/contracts": ["/workspace/futures-edge/docs/contracts/index.ts"] }`.
Changes go through EDGE-00 (see "Change process").

## Exports (by file)
| File | Exports |
|---|---|
| `fixture-shapes.ts` | v1.3.0 standard `ohlc-series` / `price-path` data shapes (D-43); checked by `validateFixture()` |
| `version.ts` | `SCHEMA_VERSION` ("1.3.0"), `SCHEMA_MAJOR`, `SEMVER_PATTERN`, `schemaMajorOf()` |
| `feature-flag.ts` | `FEATURE_FLAG_NAME` = `FUTURES_EDGE_ENABLED`, `FEATURE_FLAG_ENV_VAR` = `VITE_FUTURES_EDGE_ENABLED`, `FEATURE_FLAG_DEFAULT` = `false`, `parseFeatureFlag()` (only `"true"` enables), `ROUTE_BASE` = `/learn/futures-edge` |
| `ids.ts` | `LESSON_IDS` (T01–T23), `PHASE_IDS` (P1–P5), `CHECKPOINT_IDS` (CP1, CPA, CPB), id template types (`SlideId`, `SceneId`, `ExerciseId`, `QuestionId`, …), `ID_PATTERNS`, `isValidId()`, `isLessonId()`, `isPhaseId()`, `lessonIdOf()`, `lessonSlug()`, `lessonIdFromSlug()` |
| `phases.ts` | `Phase`, `PHASES` (canonical map + author bot + checkpoint placement), `LESSON_WORKING_TITLES`, `phaseOfLesson()` |
| `i18n.ts` | `SOURCE_LOCALE`, `SUPPORTED_LOCALES` (en, ml, hi), `L10N_KEY_PATTERN`, `l10nKey()`, `TranslationEntry`, `TranslationBundle` |
| `json.ts` | `JsonValue`, `JsonObject`, `isJsonValue()`, `isJsonObject()` |
| `content.ts` | `RichText`, `ContentBlock` union (13 kinds), `CONTENT_BLOCK_KINDS`, `CalloutKind`, `GLOSSARY_LINK_PATTERN`, `FORBIDDEN_MARKUP_PATTERN`, `extractGlossaryLinks()` |
| `glossary.ts` | `GlossaryEntry` |
| `slide.ts` | `Slide`, `SlideKind`, `SLIDE_KINDS`, `SlideVisualRef`, `SLIDES_MIN`=5, `SLIDES_MAX`=7 |
| `notes.ts` | `NotesSection`, `NotesHeading`, `REQUIRED_NOTES_HEADINGS`, `NOTES_WORDS` |
| `animation.ts` | `AnimationScene`, `SceneType`, `SCENE_TYPES` (25), `SCENE_VARIANTS` (1.1), `isSceneType()`, `SceneDefinition<TRender>`, `SceneRegistry<TRender>`, `ScenePlaybackController`, `SceneRenderContext`, `PLAYBACK_SPEEDS`, `SCENES_MIN`=4, `SCENES_MAX`=8, `TIMELINE_TARGET_MS` |
| `exercise.ts` | `Exercise`, `ExerciseType`, `EXERCISE_TYPES` (15), `ExerciseControl`, `EXERCISE_CONTROLS`, `ExerciseStep`, `ExpectedEvaluation`, `DemoDecision`/`DEMO_DECISIONS` (BUY, SELL, WAIT, NO_TRADE), `Fixture`, `FixtureKind`, `Candle`, `FixtureProvider`, `SimulatorDescriptor<I,O>`, `SimResult<O>`, `SimErrorCode` |
| `question.ts` | `Question`, `QuestionType`, `Choice`, `Answer`, `SafetyTopic`/`SAFETY_TOPICS`, `CheckpointConfig`, `LESSON_QUESTIONS_MIN`=3, `LESSON_QUESTIONS_MAX`=5 |
| `progress.ts` | `Progress`, `CheckpointProgress`, `QuizAttempt`, `QuestionAttempt`, `StepPointer`, `LessonMode`, `ProgressStorageAdapter`, `ProgressMigrationPolicy`, `defaultMigrationPolicy()`, `emptyProgress()`, `LOCAL_PROGRESS_KEY_PREFIX`, `ANONYMOUS_USER_ID`, `PROGRESS_SCHEMA_VERSION` |
| `lesson.ts` | `Lesson` (+ optional `formulas`), `LessonModule`, `Difficulty` |
| `glossary-owners.ts` (1.1) | `GLOSSARY_TERM_OWNERS` (165 terms → owner lesson), `GLOSSARY_ALIASES`, `glossaryOwnerOf()` |
| `decisions.ts` (1.1) | `TRADE_DECISIONS`, `SESSION_DECISIONS`, `RISK_CHECK_VERDICTS`, `DECISION_WORDS`, `DECISION_SETS`, `ABSTAIN_DECISIONS`, `RETIRED_DECISION_WORDS` |
| `simulators.ts` (1.1) | `SIMULATOR_IDS` (14), `SimulatorId`, `isSimulatorId()`, `EducationalConstants` (shape; values in EDGE-08 `simulation/constants.ts`) |
| `formula.ts` (1.1) | `Formula`, `FormulaWorkedExample` |
| `validation.ts` | `validateLesson()`, `isLesson()`, `validateQuestion()`, `validateExercise()`, `validateAnimationScene()`, `validateCheckpoint()`, `validateProgress()`, `validateCourse()` (option `partial`), `buildCourseGlossary()`, `collectGlossaryRefs()`, `PLACEHOLDER_PATTERN`, `ValidateOptions`, `CourseValidateOptions` |
| `validation-types.ts` | `ValidationIssue`, `ValidationResult<T>`, `Severity` |

All validators take `unknown`, never throw, and return `{ ok, value|errors, warnings }`.
Errors block merge; warnings are reviewed by EDGE-10.

## What the validators enforce (errors)
- IDs follow `ids.ts` conventions and are prefixed by their lesson; no duplicates; T24+ rejected.
- Lesson in the correct phase; prerequisites are earlier lessons; schemaVersion major = 1; semver content version.
- 5–7 slides; all 7 required notes headings; 4–8 animation scenes of registered types with captions and
  `reducedMotionDescription`; ≥1 exercise with 2–4 steps, `reset`, and a non-drag alternative; 3–5 questions with
  ≥1 `interpretation` + ≥1 `mistake-risk`; feedback for every wrong choice; `safetyTopic` on safety-critical items.
- Worked examples marked `fictional: true`; every exercise has a fictional-data label.
- No HTML/script markup anywhere; no placeholder text (TODO, TBD, lorem ipsum, "coming soon", …).
- Progress: `educationOnly: true`; cannot be `completed` without an assessment score.
- Course level (`validateCourse`): all 23 lessons present once; glossary terms unique and all references resolvable;
  checkpoint question references exist.

v1.1 adds errors for: a glossary term defined outside its owner lesson (GLOSSARY_TERM_OWNERS), alias term ids,
unknown simulatorId, an unregistered variant on a type with a variant list, a dangling formulaId, choice answers
pointing to missing choices, the retired decision word SIM_ENTRY_ALLOWED, and liquidation formulas not marked approximate.

Warnings: deprecated `parameters.mode` / `parameters.choices`, unregistered glossary terms, slide density > 60 words, notes length outside target, timeline length outside 90–360 s, review card ≠ 3 key terms.

## Validation / typecheck commands (run from this folder)
```bash
npx -y -p typescript@5.9.3 tsc -p tsconfig.json        # strict typecheck of src + selftest (exit 0 = pass)
npx -y tsx selftest/run.ts                               # 52 runtime checks of the validators (exit 0 = pass)
```
Note: use `-p typescript@…` — plain `npx -y tsc` would download the unrelated npm package named "tsc".
Once EDGE-01's scaffold exists these become `npm run typecheck` and `npm run validate:content`.

`selftest/sample-lesson.ts` is a structural sample for the self-test only. It is **not** learner content and must
never be imported by the app.

## Change process
1. Bot writes the request in its handoff (`CONTRACT CHANGES REQUESTED:`), with the exact field/type and reason.
2. EDGE-00 (+ EDGE-07 for scene types, EDGE-08 for exercise/fixture types, EDGE-09 for question/progress) approves.
3. EDGE-00 bumps `SCHEMA_VERSION` (MINOR for additive, MAJOR for breaking) on its own branch; EDGE-11 merges it
   before dependants. No other bot edits `features/futures-edge/contracts/`.
