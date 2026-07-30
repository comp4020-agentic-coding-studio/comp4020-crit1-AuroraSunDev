#!/usr/bin/env node
// Pure HTML/CSS site: no bundler, so "build" is just a copy into dist/ of
// everything that isn't source tooling. Mirrors the template's original
// page-discovery idea (every top-level file ships) minus the bundling step.
import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const SKIP_DIRS = new Set(["node_modules", "dist", "spec", "scripts", "reflections"]);
const SKIP_FILES = new Set([
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "mise.toml",
  "README.md",
  "CLAUDE.md",
  "PROCESS.md",
]);

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");

for (const entry of readdirSync(".", { withFileTypes: true })) {
  if (entry.name.startsWith(".")) continue;
  if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
  if (!entry.isDirectory() && SKIP_FILES.has(entry.name)) continue;
  cpSync(join(".", entry.name), join("dist", entry.name), { recursive: true });
}
