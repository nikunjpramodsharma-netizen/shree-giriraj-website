import { describe, it, expect } from "vitest";
import { getLowestPriceConfig, publicPrice } from "./project-helpers";

describe("getLowestPriceConfig", () => {
  it("returns the configuration with the lowest leading price figure", () => {
    const configs = [
      { type: "3 BHK", displayPrice: "From ₹4.** Cr" },
      { type: "2 BHK · lower floor", displayPrice: "From ₹2.** Cr" },
      { type: "2 BHK · higher floor", displayPrice: "From ₹3.** Cr" },
    ];
    expect(getLowestPriceConfig(configs)?.type).toBe("2 BHK · lower floor");
  });

  it("returns undefined for an empty array", () => {
    expect(getLowestPriceConfig([])).toBeUndefined();
  });

  it("returns undefined for undefined input", () => {
    expect(getLowestPriceConfig(undefined)).toBeUndefined();
  });

  it("falls back to the first configuration when no price can be parsed", () => {
    const configs = [
      { type: "Studio", displayPrice: "Price on request" },
      { type: "Penthouse", displayPrice: "Price on request" },
    ];
    expect(getLowestPriceConfig(configs)?.type).toBe("Studio");
  });

  it("handles a single configuration", () => {
    const configs = [{ type: "2 BHK", displayPrice: "From ₹2.** Cr" }];
    expect(getLowestPriceConfig(configs)?.type).toBe("2 BHK");
  });
});

describe("publicPrice", () => {
  it("turns a masked price into a rough from about figure", () => {
    expect(publicPrice("₹2.** Cr")).toBe("From about ₹2 Cr");
    expect(publicPrice("From ₹3.** Cr")).toBe("From about ₹3 Cr");
    expect(publicPrice("₹4.** Cr")).toBe("From about ₹4 Cr");
  });
  it("keeps a real base rate and an exact figure", () => {
    expect(publicPrice("₹41,000++ per sq.ft")).toBe("₹41,000++ per sq.ft");
    expect(publicPrice("₹2.92 Cr")).toBe("₹2.92 Cr");
    expect(publicPrice(undefined)).toBeUndefined();
  });
});
