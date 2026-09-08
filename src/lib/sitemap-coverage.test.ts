import { describe, it, expect } from "vitest";
import { getAllPosts, displayDate } from "./posts";

/**
 * The sitemap listed the /blog index and nothing under it, so thirteen
 * finished articles were declared nowhere while being linked from the
 * homepage and the guides hub. These pin the two rules the sitemap entry
 * depends on, without standing up the route.
 */
describe("what the sitemap can say about a markdown post", () => {
  const posts = getAllPosts();

  it("has posts to list", () => {
    expect(posts.length).toBeGreaterThan(10);
  });

  it("gives every ready post a slug safe to put in a URL", () => {
    for (const p of posts.filter((p) => p.isReady)) {
      expect(p.slug, p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("gives every ready post a checked date a Date can parse", () => {
    // lastModified is built from this. An unparseable value would put
    // "Invalid Date" into the XML.
    for (const p of posts.filter((p) => p.isReady)) {
      const checked = displayDate(p.sourcesCheckedOn);
      expect(checked, p.slug).toBeTruthy();
      expect(Number.isNaN(new Date(checked!).getTime()), p.slug).toBe(false);
    }
  });

  it("never lists a post that still carries review markers", () => {
    // A draft is served noindex, and advertising a noindex URL is a
    // contradiction Google reports as an error.
    for (const p of posts) {
      if (p.openMarkers.length > 0) expect(p.isReady).toBe(false);
    }
  });

  it("uses a distinct slug per post", () => {
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
