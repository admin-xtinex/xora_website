/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@futures-edge": fileURLToPath(new URL("./src/features/futures-edge", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
    // The content gate discovers lessons with import.meta.glob; a cached transform would hide newly added lessons.
    fsModuleCache: false,
  },
});
