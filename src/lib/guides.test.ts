import { describe, expect, it } from "vitest";
import { getPostSlugs } from "./posts";
import {
  GUIDE_SERIES_SLUGS,
  getGuide,
  getPublishedGuides,
  isUnpublishedGuidePath,
} from "./guides";
import { PILLAR_SLUGS } from "./pillars";
import { PROJECT_LINKS } from "./project-links";
import { AREA_SLUGS } from "./areas";
import { TOOL_SLUGS } from "./tools";
import { SERVICE_SLUGS } from "./seo";
import type { Block, Inline } from "./markdown";

const guides = getPublishedGuides();

function hrefs(blocks: Block[], extra: Inline[][] = []): string[] {
  const out: string[] = [];
  const take = (spans: Inline[]) => {
    for (const s of spans) if (s.t === "link") out.push(s.href);
  };
  for (const b of blocks) {
    if (b.t === "p" || b.t === "quote") take(b.spans);
    else if (b.t === "ul" || b.t === "ol") b.items.forEach(take);
  }
  extra.forEach(take);
  return out;
}

describe("long form guides", () => {
  it("has the three guides that have arrived", () => {
    expect(guides.map((g) => g.slug)).toEqual([
      "new-projects-borivali-west",
      "stamp-duty-gst-under-construction-maharashtra",
      "how-to-check-a-builder-rera-page",
    ]);
  });

  it("gives each a short answer of 40 to 60 words, a title tag and a description within limits", () => {
    for (const { post } of guides) {
      const words = (post.answer ?? "").split(/\s+/).filter(Boolean).length;
      expect(words, post.slug).toBeGreaterThanOrEqual(40);
      expect(words, post.slug).toBeLessThanOrEqual(60);
      expect(post.metaTitle!.length, post.slug).toBeLessThanOrEqual(44);
      expect(post.metaDescription!.length, post.slug).toBeLessThanOrEqual(150);
      expect(post.heroImage, post.slug).toBeTruthy();
      expect(post.isReady, post.slug).toBe(true);
      expect(post.faqs.length, post.slug).toBeGreaterThan(2);
    }
  });

  it("never names a guide outside the series", () => {
    for (const { post } of guides) {
      for (const h of hrefs(post.blocks, post.faqs.map((f) => f.answerSpans))) {
        const m = /^\/guides\/([a-z0-9-]+)$/.exec(h);
        if (m) {
          expect(
            GUIDE_SERIES_SLUGS.includes(m[1]) || PILLAR_SLUGS.includes(m[1]),
            `${post.slug} links to ${h}`,
          ).toBe(true);
        }
      }
    }
  });

  it("only links to pages that exist", () => {
    const blog = new Set(getPostSlugs());
    const projects = new Set(PROJECT_LINKS.map((p) => p.slug));
    for (const { post } of guides) {
      for (const h of hrefs(post.blocks, post.faqs.map((f) => f.answerSpans))) {
        if (!h.startsWith("/")) continue;
        const [, section, slug] = h.split("/");
        const where = `${post.slug} links to ${h}`;
        if (section === "blog") expect(blog.has(slug), where).toBe(true);
        else if (section === "projects" && slug) expect(projects.has(slug), where).toBe(true);
        else if (section === "areas" && slug) expect(AREA_SLUGS.includes(slug), where).toBe(true);
        else if (section === "tools" && slug) expect(TOOL_SLUGS.includes(slug), where).toBe(true);
        else if (section === "services" && slug) expect((SERVICE_SLUGS as readonly string[]).includes(slug), where).toBe(true);
        else if (section === "guides") expect(GUIDE_SERIES_SLUGS.includes(slug) || PILLAR_SLUGS.includes(slug), where).toBe(true);
        else expect(["projects", "invest", "areas", "guides", "tools"], where).toContain(section);
      }
    }
  });

  it("keeps house wording: agency, no gendered builder, no banned phrases", () => {
    for (const { slug } of guides) {
      const g = getGuide(slug)!;
      const text = [g.answer, g.title, ...g.blocks.map((b) => JSON.stringify(b)), ...g.faqs.map((f) => f.answer)].join(" ");
      expect(text, slug).not.toMatch(/goes wrong|go wrong|collapse|overpay|hostage|catch(es)? people out/i);
      expect(text, slug).not.toMatch(/\b(he|his|him)\b/i);
      expect(text, slug).not.toMatch(/\bagent\b/i);
    }
  });

  it("renders a link to a guide that has not arrived as plain text, and a published one as a link", () => {
    expect(isUnpublishedGuidePath("/guides/allotment-letter-under-construction-flat")).toBe(true);
    expect(isUnpublishedGuidePath("/guides/nri-book-under-construction-flat-mumbai")).toBe(true);
    expect(isUnpublishedGuidePath("/guides/how-to-check-a-builder-rera-page")).toBe(false);
    expect(isUnpublishedGuidePath("/guides/property-paperwork-maharashtra")).toBe(false);
    expect(isUnpublishedGuidePath("/blog/carpet-area-vs-built-up-area")).toBe(false);
  });
});
