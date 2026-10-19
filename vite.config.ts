import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// D-10: `@futures-edge/<module>` -> src/features/futures-edge/<module>/index.ts (keep in sync with tsconfig `paths`).
const futuresEdgeDir = fileURLToPath(new URL("./src/features/futures-edge/", import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@futures-edge\/([a-z0-9-]+)$/, replacement: `${futuresEdgeDir}$1/index.ts` },
      { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
    ],
  },
});
