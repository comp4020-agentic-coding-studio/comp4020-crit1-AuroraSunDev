import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Crit 1 ("Forgotten web") published spec, split into what a test can hold:
// https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/crits/01-forgotten-web/
//
// Mechanically checkable, asserted here:
// - "built with plain HTML and CSS, no JavaScript"
// - "it is a real site — a handful of pages of readable content, each
//    reachable from the home page"
//
// Only a person can judge at the crit, not tested here:
// - "the look commits to a web era the modern web has forgotten"
// - "you can account for how you directed, grounded and corrected the agent"
//
// Already covered elsewhere, not duplicated here:
// - "deployed and live at its public GitHub Pages URL by the cutoff" — the
//   CI deploy job checks the live URL returns 200.
// - "the starter's invariant checks pass" — spec/invariants.test.ts.
// - "the repo shows the process..." — `pnpm check:evidence`.
const DIST = resolve("dist");

function htmlFiles(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

const pageNames = htmlFiles().map((path) => relative(DIST, path));

describe("no JavaScript", () => {
  it("ships no .js files in dist/", () => {
    function jsFiles(dir: string = DIST): string[] {
      return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return jsFiles(path);
        return entry.name.endsWith(".js") ? [path] : [];
      });
    }
    expect(jsFiles()).toEqual([]);
  });

  for (const name of pageNames) {
    it(`${name} has no <script> element`, () => {
      const doc = new JSDOM(readFileSync(join(DIST, name), "utf8")).window.document;
      expect(doc.querySelectorAll("script").length).toBe(0);
    });
  }
});

describe("a handful of pages, each reachable from home", () => {
  it("built more than one page", () => {
    expect(pageNames.length).toBeGreaterThanOrEqual(3);
  });

  it("home page links to every other page", () => {
    const homePath = join(DIST, "index.html");
    expect(existsSync(homePath)).toBe(true);

    const home = new JSDOM(readFileSync(homePath, "utf8")).window.document;
    const hrefs = new Set(
      [...home.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")?.replace("./", "")),
    );

    for (const name of pageNames.filter((n) => n !== "index.html")) {
      expect(hrefs.has(name), `home page has no link to ${name}`).toBe(true);
    }
  });
});
