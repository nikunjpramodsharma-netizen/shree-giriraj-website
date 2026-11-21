import { describe, it, expect, vi } from "vitest";
import { AGENCY_PAGES, agencyPagePath, priceRows } from "./agency-pages";
import { AREA_SLUGS } from "./areas";

vi.mock("@/sanity/client", () => ({ client: { fetch: vi.fn().mockResolvedValue([]) } }));

/** Every string a visitor reads on a page, from the data module. */
function visibleCopy(p: (typeof AGENCY_PAGES)[number]): string[] {
  return [
    p.metaTitle,
    p.metaDescription,
    p.h1,
    p.answer,
    p.pocketsIntro,
    ...p.pockets.flatMap((k) => [k.name, k.line]),
    ...p.services.flatMap((s) => [s.title, s.body, s.cta]),
    p.ask,
    p.howIntro,
    p.waMessage,
    ...p.faqs.flatMap((f) => [f.q, f.a]),
  ];
}

describe("real estate agency landing pages", () => {
  it("covers the three suburbs, each an existing area", () => {
    expect(AGENCY_PAGES.map((p) => p.slug)).toEqual(["borivali-west", "kandivali", "malad"]);
    for (const p of AGENCY_PAGES) expect(AREA_SLUGS).toContain(p.slug);
  });

  it("is listed in the sitemap, English only", async () => {
    const { default: sitemap } = await import("../app/sitemap");
    const urls = (await sitemap()).map((e) => e.url);
    for (const p of AGENCY_PAGES) {
      const hit = urls.filter((u) => u.endsWith(agencyPagePath(p.slug)));
      expect(hit, p.slug).toHaveLength(1);
      expect(hit[0]).not.toMatch(/\/(hi|mr|gu)\//);
    }
  });

  it("names the suburb in the title, the H1 and the description", () => {
    for (const p of AGENCY_PAGES) {
      expect(p.metaTitle).toBe(`Real estate agency in ${p.place}`);
      expect(p.h1).toBe(`Real estate agency in ${p.place}`);
      expect(p.metaDescription).toContain(p.place.replace(" West", ""));
      expect(p.metaDescription.length).toBeGreaterThan(120);
      expect(p.metaDescription.length).toBeLessThan(170);
    }
  });

  it("has no em or en dashes, no spaced hyphens and no standalone word agent", () => {
    for (const p of AGENCY_PAGES) {
      for (const text of visibleCopy(p)) {
        expect(text, text).not.toMatch(/[—–]/);
        expect(text, text).not.toMatch(/ - /);
        expect(text, text).not.toMatch(/\d-\d/);
        expect(text, text).not.toMatch(/\bagents?\b/i);
        expect(text, text).not.toMatch(/\b(broker|dealer)s?\b/i);
      }
    }
  });

  it("reads its prices from the flats data, for all three sizes", () => {
    for (const p of AGENCY_PAGES) {
      const rows = priceRows(p.slug);
      expect(rows.map((r) => r.size)).toEqual(["1 BHK", "2 BHK", "3 BHK"]);
      for (const r of rows) {
        expect(r.buy.figure).toBeTruthy();
        expect(r.rent.figure).toBeTruthy();
      }
    }
  });

  it("is written once per suburb, not swapped", () => {
    const answers = new Set(AGENCY_PAGES.map((p) => p.answer));
    expect(answers.size).toBe(3);
    const pockets = new Set(AGENCY_PAGES.flatMap((p) => p.pockets.map((k) => k.name)));
    expect(pockets.size).toBe(AGENCY_PAGES.reduce((n, p) => n + p.pockets.length, 0));
  });
});
