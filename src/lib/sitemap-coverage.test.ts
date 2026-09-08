import { describe, it, expect, vi } from "vitest";
import { getAllPosts, displayDate } from "./posts";
import { AREA_SLUGS, getArea, areaIsComplete } from "./areas";
import { STORY_IS_WRITTEN } from "./about";

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

/**
 * The same rule, applied to the two gated sections.
 *
 * /about and the three area pages were listed unconditionally while every one
 * of them emitted noindex, so the sitemap asked Google to index four URLs that
 * told it not to. This runs the real sitemap with Sanity stubbed out and
 * checks the output directly, because the only version of this test worth
 * having is one that would have caught the original bug.
 */
vi.mock("@/sanity/client", () => ({ client: { fetch: async () => [] } }));

describe("gated pages the sitemap must stay silent about", () => {
  it("never advertises a URL that its own page marks noindex", async () => {
    const { default: sitemap } = await import("../app/sitemap");
    const urls = (await sitemap()).map((e) => e.url);

    for (const slug of AREA_SLUGS) {
      const area = getArea(slug);
      expect(area, slug).toBeTruthy();
      const listed = urls.some((u) => u.endsWith(`/areas/${slug}`));
      // areaIsComplete is the same predicate the route uses to decide noindex.
      expect(listed, `/areas/${slug}`).toBe(areaIsComplete(area!));
    }

    const aboutListed = urls.some((u) => u.endsWith("/about"));
    expect(aboutListed).toBe(STORY_IS_WRITTEN);
  });

  it("still lists the pages that are genuinely ready", async () => {
    const { default: sitemap } = await import("../app/sitemap");
    const urls = (await sitemap()).map((e) => e.url);
    // Guards against a filter that is so eager it empties the sitemap.
    expect(urls.some((u) => u.endsWith("/areas"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/contact"))).toBe(true);
    expect(urls.length).toBeGreaterThan(40);
  });
});
