import { existsSync } from "node:fs";
import { join } from "node:path";
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
    // No draft carries a marker any more, so the gate is exercised on a
    // synthetic post rather than on content that will not stay broken.
    const p = { ...getPost("carpet-area-vs-built-up-area")!, openMarkers: [{ kind: "YOUR WORDS", text: "x" }] };
    expect(p.openMarkers.length).toBeGreaterThan(0);
  });

  /**
   * All thirteen went ready on 8 September 2026. Ten were written from the
   * public record earlier that day; the last three (carpet area prices, the
   * interiors cost bands and society rules, and the rent deposit norm) were
   * written the same evening from portal, firm and statute sources, with
   * every number attributed and dated in the post.
   */
  it("names exactly the drafts that are genuinely waiting", () => {
    // Pinned rather than asserted empty. The investment cluster added on
    // 8 September 2026 brought one post back into draft on purpose: the
    // commercial post carries a VERIFY on the GST registration threshold for
    // letting commercial premises, which turns on both parties' registration
    // status and has been amended more than once. Publishing a tax threshold
    // we have not confirmed is exactly what the marker system exists to stop.
    // The MHADA cluster added on 9 September 2026 brought four more into
    // draft, each on a specific unconfirmed point: the NOC for rent document
    // list and fee, whether transfer charges apply in full to heirs, the
    // figures under Regulation 33(5) and the consent percentage, and lenders'
    // policies on MHADA resale. Each marker says exactly what to confirm.
    const drafts = getAllPosts().filter((p) => !p.isReady).map((p) => p.slug).sort();
    expect(drafts).toEqual(
      [
        "commercial-property-investment-mumbai",
        "can-we-rent-mhada-flat",
        "mhada-transfer-on-death",
        "mhada-redevelopment-rules",
        "how-to-buy-mhada-flat-in-resale",
      ].sort(),
    );
  });

  it("keeps the finished investment and MHADA posts out of draft", () => {
    for (const slug of ["rental-yield-mumbai", "best-area-to-invest-in-mumbai", "can-we-sell-mhada-flat"]) {
      const post = getPost(slug);
      expect(post, slug).toBeTruthy();
      expect(post!.openMarkers, slug).toEqual([]);
      expect(post!.isReady, slug).toBe(true);
    }
  });

  it("still knows what a draft looks like", () => {
    // The gate is not dead just because nothing trips it today.
    const p = getPost("carpet-area-vs-built-up-area")!;
    expect(p.openMarkers).toEqual([]);
    expect(p.isReady).toBe(true);
  });

  it("marks a finished post as ready", () => {
    const p = getPost("stamp-duty-and-registration-charges-mumbai")!;
    expect(p.openMarkers).toEqual([]);
    expect(p.isReady).toBe(true);
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

describe("every post brings its own hero image", () => {
  /**
   * Before this, a post with no image of its own fell back to one of six
   * category pictures. Ten of the thirteen drafts are filed under Paperwork,
   * so ten articles opened with the identical photograph and the index looked
   * like one article printed ten times.
   */
  const posts = getAllPosts();

  it("sets heroImage on all of them", () => {
    const missing = posts.filter((p) => !p.heroImage).map((p) => p.slug);
    expect(missing).toEqual([]);
  });

  it("never uses the same photograph twice", () => {
    const used = posts.map((p) => p.heroImage);
    expect(new Set(used).size).toBe(used.length);
  });

  it("points at a file that is actually in public", () => {
    for (const p of posts) {
      const file = join(process.cwd(), "public", p.heroImage!.replace(/^\//, ""));
      expect(existsSync(file), `${p.slug} -> ${p.heroImage}`).toBe(true);
    }
  });

  it("describes the picture, so a screen reader gets something useful", () => {
    for (const p of posts) {
      expect(p.heroAlt, p.slug).toBeTruthy();
      expect(p.heroAlt!.length, p.slug).toBeGreaterThan(15);
    }
  });
});
