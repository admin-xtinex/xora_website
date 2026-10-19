import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

// Unit/component tests (D-31). Reuses the Vite config so the `@` and `@futures-edge/*` aliases resolve the same way.
// Lesson-content tests under content/** are excluded: content bots run them with their own runner (D-26).
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      include: ["src/**/*.test.{ts,tsx}"],
      exclude: ["**/node_modules/**", "src/features/futures-edge/content/**"],
      setupFiles: ["src/features/futures-edge/platform/__tests__/setup.ts"],
      // Process the module stylesheet (instead of stubbing it) so the scoping test can read it via `?raw`.
      css: { include: [/futures-edge\/platform\/theme\/.*\.css/] },
      restoreMocks: true,
      unstubEnvs: true,
    },
  }),
);
