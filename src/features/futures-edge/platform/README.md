# @futures-edge/platform (EDGE-01 Learning Platform)

Wave 1 scaffold of the XORA Futures Edge learning area. Import via `@futures-edge/platform`
(alias → `src/features/futures-edge/platform/index.ts`, D-10).

## Exports
| Export | Purpose |
|---|---|
| `FuturesEdgeApp` | Root of the learning area. Renders inside `.fe-root`. Optional `registry` prop (tests). |
| `parseRoute`, `pathFor`, `isWithinBase`, `navigate`, `usePathname`, `useFeRoute`, `FeRoute` | History-API router (D-30). Routes: `/learn/futures-edge`, `/t01`…`/t23`, `/checkpoint/cp1\|cpa\|cpb`, else not-found. |
| `FeLink` | `<a href>` that uses `navigate()` on a plain left click. |
| `loadLesson`, `useLesson`, `LessonLoadResult`, `LessonLoadState` | Loads a lesson through `@futures-edge/content` and validates it with `validateLesson` (states: loading, ready, not-published, invalid, load-error). |
| `RichText`, `renderRichText` | Safe RichText renderer (`[[term]]`, `[[term\|label]]`, `**bold**`), no innerHTML. |

`@futures-edge/content` (`content/index.ts`) exports `lessonRegistry`, `lessonRegistryIssues`, `buildLessonRegistry`,
`LessonRegistry`, `LessonLoader`. It discovers `content/phase-0N/Tnn/lesson.ts` with `import.meta.glob` (lazy chunks).

## Host mount
`src/App.tsx` lazy-imports `@/features/futures-edge` only when `import.meta.env.VITE_FUTURES_EDGE_ENABLED === "true"`
and the path is `/learn/futures-edge` or below. A flag-OFF build contains no learning-area code.

## Styles
`theme/fe.css`: every selector starts with `.fe-root` (enforced by `__tests__/rich-text-and-css.test.tsx`).
Tokens alias the host tokens from `src/styles.css`.

## Run
```bash
npm ci
npm run typecheck && npm test
VITE_FUTURES_EDGE_ENABLED=true npm run dev     # then open http://localhost:5180/learn/futures-edge
```
