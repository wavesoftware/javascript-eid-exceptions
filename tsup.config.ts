import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    target: "es2022",
    outDir: "dist",
    clean: true,
    splitting: false,
    outExtension({ format }) {
      if (format === "cjs") {
        return { js: ".cjs", dts: ".d.cts" };
      }
      return { js: ".mjs", dts: ".d.ts" };
    },
  },
  {
    entry: ["src/index.ts"],
    format: ["iife"],
    globalName: "Eid",
    outDir: "dist",
    minify: true,
    target: "es2020",
    outExtension() {
      return { js: ".global.js" };
    },
  },
]);
