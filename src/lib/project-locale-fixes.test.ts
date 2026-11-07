import { describe, expect, it } from "vitest";
import { repairProjectLocales } from "./project-locale-fixes";

type Fields = Record<string, string>;

describe("projects that are not on MahaRERA", () => {
  for (const slug of ["blissful-living", "luxury-living-punit-nagar"]) {
    it(`${slug} gets a registration awaited page in every language`, () => {
      const p = repairProjectLocales(slug, {
        summary: { en: "Open for Expression of Interest", gu: "Open for Expression of Interest", hi: "हिंदी" },
        body: { en: "Bookings are in the EOI phase, early bird pricing available." },
      });
      const summary = p.summary as Fields;
      const body = p.body as Fields;
      expect(body.en).toContain("MahaRERA registration awaited. Register your interest");
      expect(summary.en).toContain("MahaRERA registration awaited");
      for (const loc of ["en", "hi", "mr", "gu"]) {
        const all = `${summary[loc]} ${body[loc]}`;
        expect(all, loc).toContain("MahaRERA");
        expect(all, loc).not.toMatch(/early bird|EOI|Expression of Interest|booking/i);
      }
    });
  }
});

describe("The Landmark", () => {
  it("is by Borivali station, not Kandivali station", () => {
    const p = repairProjectLocales("the-landmark-borivali-west", {
      body: { en: "old", hi: "बोरिवली स्टेशन से तीन मिनट और कांदिवली स्टेशन व नए लिंक रोड मेट्रो से" },
    });
    const body = p.body as Fields;
    expect(body.en).toContain("three minutes from Borivali station");
    expect(body.en).not.toContain("Kandivali");
    expect(body.hi).not.toContain("कांदिवली स्टेशन");
  });
});

describe("other projects", () => {
  it("are left alone when nothing needs fixing", () => {
    const input = { summary: { en: "A", gu: "A" } };
    expect(repairProjectLocales("veena-celestia", input)).toBe(input);
  });
});

describe("typo repair", () => {
  it("turns net bookings into new bookings", () => {
    const p = repairProjectLocales("veena-celestia", {
      summary: { en: "RERA is in place and net bookings have started." },
    });
    expect((p.summary as Fields).en).toBe("RERA is in place and new bookings have started.");
  });
  it("fixes the same typo in Hindi", () => {
    const p = repairProjectLocales("veena-celestia", { body: { hi: "नेट बुकिंग शुरू" } });
    expect((p.body as Fields).hi).toBe("नई बुकिंग शुरू");
  });
});
