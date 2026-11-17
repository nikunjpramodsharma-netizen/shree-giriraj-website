import { describe, it, expect, vi } from "vitest";
import { getPublishedGuides } from "./guides";
import { PILLARS } from "./pillars";

vi.mock("@/sanity/client", () => ({ client: { fetch: async () => [] } }));

/**
 * The three long form guides were live and indexable on 16 November 2026 but
 * missing from sitemap.xml (the regenerated sitemap could not see
 * content/guides; fixed in next.config.mjs). This pins the half a test can
 * see: every ready guide and pillar is listed, with a lastmod.
 */
describe("sitemap and the guides", () => {
  it("lists every ready long form guide and pillar with a lastmod", async () => {
    const { default: sitemap } = await import("../app/sitemap");
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    const ready = getPublishedGuides().filter((g) => g.post.isReady);
    expect(ready.length).toBeGreaterThan(0);
    for (const g of ready) {
      const e = entries.find((x) => x.url.endsWith(`/guides/${g.slug}`));
      expect(e, g.slug).toBeTruthy();
      expect(e!.lastModified, g.slug).toBeTruthy();
    }
    for (const p of PILLARS) {
      expect(urls.some((u) => u.endsWith(`/guides/${p.slug}`)), p.slug).toBe(true);
    }
  });
});
