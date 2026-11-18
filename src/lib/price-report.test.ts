import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FLAT_LISTINGS } from "./flats";
import { getPost } from "./posts";

/**
 * The monthly price report repeats figures the area, flats for sale and BHK
 * pages publish from src/lib/flats.ts. When a rate there is updated, this
 * fails until the report is updated too, so the site never shows two
 * different numbers for the same thing.
 */
const SLUG = "property-rates-borivali-kandivali-malad";
const text = readFileSync(join(process.cwd(), "content", "drafts", `${SLUG}.md`), "utf8");

describe("monthly price report", () => {
  it("is a ready post within the title, description and answer limits", () => {
    const p = getPost(SLUG)!;
    expect(p.isReady).toBe(true);
    expect(p.metaTitle!.length).toBeLessThanOrEqual(44);
    expect(p.metaDescription!.length).toBeLessThanOrEqual(150);
    const words = (p.answer ?? "").split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(40);
    expect(words).toBeLessThanOrEqual(60);
    expect(p.faqs.length).toBeGreaterThanOrEqual(6);
  });

  it("states the same 1, 2 and 3 BHK figures as the flats for sale pages", () => {
    for (const l of FLAT_LISTINGS.filter((x) => x.intent === "sale")) {
      for (const q of l.quick) expect(text, `${l.place} ${q.size}`).toContain(q.figure);
    }
  });

  it("states each sale page's headline pocket rate", () => {
    for (const l of FLAT_LISTINGS.filter((x) => x.intent === "sale")) {
      const first = l.pockets![0];
      expect(text, l.place).toContain(first.low.toLocaleString("en-IN"));
    }
  });

  it("has no dashes, no forecast and never calls the firm an agent", () => {
    const body = text.split("---").slice(2).join("---").replace(/\([^)]*\)|https?:\/\/\S+/g, "");
    expect(body).not.toMatch(/[—–]/);
    expect(body).not.toMatch(/\bagent\b/i);
    expect(body).not.toMatch(/will (rise|grow|appreciate)|expected to (rise|grow)/i);
  });
});
