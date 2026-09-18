import { describe, expect, it } from "vitest";
import { repairProjectLocales } from "./project-locale-fixes";

describe("repairProjectLocales", () => {
  it("replaces a Gujarati value that is a copy of the English", () => {
    const p = repairProjectLocales("luxury-living-punit-nagar", {
      summary: { en: "Same", gu: "Same", hi: "हिंदी" },
      body: { en: "Body", gu: "Body" },
    });
    expect((p.summary as Record<string, string>).gu).not.toBe("Same");
    expect((p.summary as Record<string, string>).hi).toBe("हिंदी");
    expect((p.body as Record<string, string>).gu).not.toBe("Body");
  });

  it("leaves a real translation from the CMS alone", () => {
    const p = repairProjectLocales("luxury-living-punit-nagar", {
      summary: { en: "Same", gu: "ગુજરાતી" },
    });
    expect((p.summary as Record<string, string>).gu).toBe("ગુજરાતી");
  });

  it("does nothing for other projects", () => {
    const input = { summary: { en: "A", gu: "A" } };
    expect(repairProjectLocales("veena-celestia", input)).toBe(input);
  });
});
