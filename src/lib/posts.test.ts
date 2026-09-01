import { describe, it, expect } from "vitest";
import { getPost, getPostSlugs, getAllPosts, getRelated, displayDate } from "./posts";

describe("reading posts from markdown", () => {
  it("finds the drafts", () => {
    expect(getPostSlugs().length).toBeGreaterThan(10);
  });

  it("reads a real post", () => {
    const p = getPost("carpet-area-vs-built-up-area")!;
    expect(p.title).toContain("Carpet area");
    expect(p.answer).toContain("net usable floor space");
    expect(p.blocks.length).toBeGreaterThan(15);
  });

  it("returns null for a slug that does not exist", () => {
    expect(getPost("no-such-post")).toBeNull();
  });
});

describe("the answer is not printed twice", () => {
  // Every draft carries the answer in frontmatter AND as a "## The short
  // answer" section. Both rendered, so the same paragraph appeared twice on
  // the page, directly under itself.
  it("drops the duplicated body section", () => {
    const p = getPost("carpet-area-vs-built-up-area")!;
    const headings = p.blocks
      .filter((b) => b.t === "h2")
      .map((b: any) => b.text.toLowerCase());
    expect(headings).not.toContain("the short answer");
  });

  it("keeps the frontmatter answer, which is the one that gets styled", () => {
    expect(getPost("carpet-area-vs-built-up-area")!.answer).toBeTruthy();
  });

  it("does it for every draft, since they all have the pattern", () => {
    for (const p of getAllPosts()) {
      const h = p.blocks.filter((b) => b.t === "h2").map((b: any) => b.text.toLowerCase());
      expect(h).not.toContain("the short answer");
    }
  });
});

describe("draft versus ready", () => {
  it("marks a post with open markers as not ready", () => {
    const p = getPost("carpet-area-vs-built-up-area")!;
    expect(p.openMarkers.length).toBeGreaterThan(0);
    expect(p.isReady).toBe(false);
  });

  it("has no ready posts yet, which is the honest current state", () => {
    expect(getAllPosts().filter((p) => p.isReady)).toEqual([]);
  });
});

describe("dates", () => {
  it("rejects a review marker sitting in a date field", () => {
    expect(displayDate("[ VERIFY: date you check these ]")).toBeNull();
    expect(displayDate("")).toBeNull();
    expect(displayDate(undefined)).toBeNull();
  });

  it("accepts a real date", () => {
    expect(displayDate("1 September 2026")).toBe("1 September 2026");
  });
});

describe("related posts", () => {
  it("never links to itself and never links to a post that does not exist", () => {
    const p = getPost("carpet-area-vs-built-up-area")!;
    const slugs = new Set(getPostSlugs());
    for (const r of getRelated(p, 3)) {
      expect(r.slug).not.toBe(p.slug);
      expect(slugs.has(r.slug)).toBe(true);
    }
  });

  it("returns at most the limit", () => {
    expect(getRelated(getPost("carpet-area-vs-built-up-area")!, 3).length).toBeLessThanOrEqual(3);
  });
});
