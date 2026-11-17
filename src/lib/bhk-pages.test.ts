import { describe, it, expect } from "vitest";
import { BHK_PAGES, getBhkPage } from "./bhk-pages";
import { FLAT_LISTINGS } from "./flats";

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe("BHK by suburb pages", () => {
  it("builds nine pages, three sizes in each of the three suburbs", () => {
    expect(BHK_PAGES).toHaveLength(9);
    expect(new Set(BHK_PAGES.map((p) => p.path)).size).toBe(9);
    expect(getBhkPage("borivali-west", "3-bhk-flats-for-sale")?.h1).toBe("3 BHK flats for sale in Borivali West");
    expect(getBhkPage("kandivali", "1-bhk-flats-for-sale")?.place).toBe("Kandivali West");
  });

  it("keeps titles, descriptions and answers within the site limits", () => {
    for (const p of BHK_PAGES) {
      expect(p.metaTitle.length, p.path).toBeLessThanOrEqual(44);
      expect(p.metaDescription.length, p.path).toBeLessThanOrEqual(150);
      expect(p.metaDescription.length, p.path).toBeGreaterThanOrEqual(110);
      expect(p.metaDescription, p.path).toMatch(/[.]$/);
      expect(words(p.answer), p.path).toBeGreaterThanOrEqual(40);
      expect(words(p.answer), p.path).toBeLessThanOrEqual(60);
      expect(p.faqs.length, p.path).toBeGreaterThanOrEqual(6);
    }
  });

  it("states the same headline figure as the flats for sale page", () => {
    for (const p of BHK_PAGES) {
      const sale = FLAT_LISTINGS.find((l) => l.area === p.area && l.intent === "sale")!;
      expect(p.quickFigure).toBe(sale.quick.find((q) => q.size === p.size)!.figure);
      expect(p.pocketRows).toHaveLength(sale.pockets!.length);
    }
  });

  it("works stamp duty at 6 percent of the headline price", () => {
    const p = getBhkPage("borivali-west", "2-bhk-flats-for-sale")!;
    expect(p.cashOnTop.priceLow).toBe(30750 * 700);
    expect(p.cashOnTop.dutyLow).toBe(Math.round(30750 * 700 * 0.06));
    expect(p.cashOnTop.registration).toBe(30000);
  });

  it("has no dashes and never calls the firm an agent", () => {
    const all = JSON.stringify(BHK_PAGES);
    expect(all).not.toMatch(/[—–]/);
    expect(all).not.toMatch(/\bagent\b/i);
    expect(all).not.toMatch(/\bten months?\b/i);
  });
});
