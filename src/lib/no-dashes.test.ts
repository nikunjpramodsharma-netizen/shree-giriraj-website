import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * No em dashes or en dashes in anything a visitor reads.
 *
 * A guard already existed for messages/*.json, but the 2026 rebuild moved most
 * visible copy out of the message catalogs and into typed content modules and
 * markdown drafts. None of that was covered, so the rule was being enforced by
 * hand, which is not enforcement.
 *
 * This covers the content modules and the drafts. Code comments are not in
 * scope: nobody reads them on the site.
 */

const CONTENT_MODULES = [
  "src/lib/pillars.ts",
  "src/lib/areas.ts",
  "src/lib/tools.ts",
  "src/lib/homepage-content.ts",
  "src/lib/consult.ts",
  "src/lib/interiors.ts",
  "src/lib/blog.ts",
];

const DASHES = /[—–]/;

/**
 * Strip block and line comments before checking, so an em dash in a comment
 * does not fail the build. Crude, but these files have no regex literals or
 * strings containing "//" that would confuse it.
 */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

describe("no dashes in visible copy", () => {
  it.each(CONTENT_MODULES)("%s has no em or en dashes", (file) => {
    const src = stripComments(readFileSync(file, "utf8"));
    const offending = src
      .split("\n")
      .map((line, i) => ({ line, n: i + 1 }))
      .filter((x) => DASHES.test(x.line));
    expect(offending.map((x) => `${x.n}: ${x.line.trim()}`)).toEqual([]);
  });

  it("content drafts have no em or en dashes", () => {
    const files = walk("content");
    // If this ever finds nothing, the walk is broken and the test is useless.
    expect(files.length).toBeGreaterThan(5);
    const bad = files.filter((f) => DASHES.test(readFileSync(f, "utf8")));
    expect(bad).toEqual([]);
  });
});
