import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { getAllPosts } from "./posts";

/**
 * The owner's rule for the whole site: no photograph is used in two places.
 * This reads every source and content file for image paths and fails on any
 * path that appears twice, or that points at a file that is not there.
 *
 * `blog.ts` is left out on purpose. It holds the category fallbacks, which
 * only show when an article has no picture of its own; the last test makes
 * sure every article has one, so a fallback never reaches a reader.
 */
const ROOT = process.cwd();
// author.ts names a photograph that is optional until the owner supplies it.
const SKIP = new Set(["blog.ts", "author.ts"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|md)$/.test(name) && !/\.test\.tsx?$/.test(name) && !SKIP.has(name)) out.push(p);
  }
  return out;
}

const refs: { path: string; file: string }[] = [];
for (const file of [...walk(join(ROOT, "src")), ...walk(join(ROOT, "content"))]) {
  const text = readFileSync(file, "utf8");
  for (const m of Array.from(text.matchAll(/["'(:\s](\/(?:(?:premium|areas|sections|services|blog|hero|projects)\/)?[^"'\s)`/]*[^"'\s)`]*\.(?:jpg|jpeg|webp))/g))) {
    refs.push({ path: m[1], file: file.slice(ROOT.length + 1).split("\\").join("/") });
  }
}

describe("photographs across the site", () => {
  it("finds the image references", () => {
    expect(refs.length).toBeGreaterThan(80);
  });

  it("points only at files that exist", () => {
    for (const r of refs) expect(existsSync(join(ROOT, "public", r.path)), `${r.path} in ${r.file}`).toBe(true);
  });

  it("never uses one photograph in two places", () => {
    const seen = new Map<string, string>();
    const repeats: string[] = [];
    for (const r of refs) {
      const prior = seen.get(r.path);
      if (prior) repeats.push(`${r.path}: ${prior} and ${r.file}`);
      else seen.set(r.path, r.file);
    }
    expect(repeats).toEqual([]);
  });

  it("gives every article its own picture, so no category fallback is ever shown", () => {
    for (const p of getAllPosts()) expect(p.heroImage, p.slug).toBeTruthy();
  });
});
