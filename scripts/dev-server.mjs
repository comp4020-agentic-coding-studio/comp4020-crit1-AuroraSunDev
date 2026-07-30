#!/usr/bin/env node
// Zero-dependency static server for `pnpm dev`. There's no build step to
// watch for in a pure HTML/CSS site, so this just serves the source tree
// directly rather than requiring a rebuild-on-save loop.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = process.env.PORT ?? 5173;
const ROOT = process.cwd();

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

const server = createServer(async (req, res) => {
  try {
    let path = normalize(decodeURIComponent(req.url.split("?")[0]));
    if (path.includes("..")) throw new Error("bad path");
    if (path === "/" || path === "\\") path = "/index.html";
    let full = join(ROOT, path);
    const info = await stat(full).catch(() => null);
    if (info?.isDirectory()) full = join(full, "index.html");
    const body = await readFile(full);
    res.writeHead(200, { "Content-Type": TYPES[extname(full)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 not found");
  }
});

server.listen(PORT, () => {
  console.log(`dev server: http://localhost:${PORT}/`);
});
