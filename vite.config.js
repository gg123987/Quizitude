/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import path from "node:path";
import { createRequire } from "node:module";
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const require = createRequire(import.meta.url);
const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const cMapsDir = normalizePath(path.join(pdfjsDistPath, "cmaps"));

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: cMapsDir,
          dest: "",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom", // Simulate a browser environment for React components
    include: ["**/*.test.jsx", "**/*.test.js"],
    setupFiles: "./tests/setupTests.js", // Setup file
    coverage: {
      reporter: ["text", "json"],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".mjs": "js",
      },
    },
  },
});
