import replace from "@rollup/plugin-replace";
import { readdirSync } from "fs";
import { resolve } from "path";
import copy from "rollup-plugin-copy-merge";
import jscc from "rollup-plugin-jscc";
import { defineConfig } from "vite";

const workerpoolImportDev = `
importScripts(
  "http://localhost:3000/node_modules/workerpool/dist/workerpool.js"
);
`;
let workerpoolImportProd;

try {
  workerpoolImportProd = `
importScripts("${
    readdirSync(resolve(__dirname, "dist", "assets")).filter((fn) =>
      fn.startsWith("workerpool")
    )[0]
  }")`;
} catch (e) {}

const importScripts =
  process.env.NODE_ENV === "development"
    ? workerpoolImportDev
    : workerpoolImportProd;

const replaceRules = {
  IMPORT_WORKERPOOL: importScripts,
  delimiters: ["", ""],
};
const copyTargets = [
  {
    src: [
      resolve(__dirname, "worker", "worker.part1.js"),
      resolve(__dirname, "worker", "worker.part2.js"),
    ],
    file: resolve(__dirname, "worker", "CompiledWorker.js"),
  },
];

const JSCC_CONFIG = {
  _PRODUCTION: process.env.NODE_ENV === "production",
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    copy({
      hook: "buildStart",
      targets: copyTargets,
    }),
    copy({
      hook: "transform",
      prevent: (context, targets) =>
        context._activeId &&
        context._activeId.indexOf("CompiledWorker.js") >= 0,
      targets: copyTargets,
    }),

    replace(replaceRules),

    jscc(JSCC_CONFIG),
  ],
  build: {
    rollupOptions: {
      plugins: [replace(replaceRules), jscc(JSCC_CONFIG)],
      output: {
        manualChunks: {
          workerpool: ["workerpool"],
          // CompiledWorker: ["./worker/CompiledWorker.js"],
        },
      },
    },
  },
});
