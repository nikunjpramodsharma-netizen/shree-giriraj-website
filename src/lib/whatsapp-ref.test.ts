import { describe, it, expect } from "vitest";
import { pageLabel, sourceLabel, refLine, withRef } from "./whatsapp-ref";
import { waLink } from "./config";

describe("pageLabel", () => {
  it("names the pages the owner will see most", () => {
    expect(pageLabel("/")).toBe("Homepage");
    expect(pageLabel("/areas/borivali-west/flats-for-sale")).toBe("Borivali West sale page");
    expect(pageLabel("/areas/malad/flats-for-rent")).toBe("Malad rent page");
    expect(pageLabel("/areas/kandivali")).toBe("Kandivali area page");
    expect(pageLabel("/services/resale-flats")).toBe("Resale flats service");
    expect(pageLabel("/projects/jaswanti-jewel")).toBe("Jaswanti Jewel project");
    expect(pageLabel("/blog/occupancy-certificate")).toBe("Article: Occupancy certificate");
    expect(pageLabel("/card")).toBe("Visiting card");
  });

  it("ignores the language prefix", () => {
    expect(pageLabel("/hi")).toBe("Homepage");
    expect(pageLabel("/gu/services/rentals")).toBe("Rentals service");
  });
});

describe("sourceLabel", () => {
  it("credits the ad whenever a click id was stored", () => {
    expect(sourceLabel({ gclid: "abc", utmSource: "newsletter" })).toBe("Google ad");
  });
  it("falls back to the utm source, then to the website", () => {
    expect(sourceLabel({ utmSource: "justdial" })).toBe("justdial");
    expect(sourceLabel({ utmSource: "facebook", utmMedium: "paid" })).toBe("facebook paid");
    expect(sourceLabel({})).toBe("website");
  });
});

describe("withRef", () => {
  const ref = refLine("/areas/borivali-west/flats-for-sale", { gclid: "x" });
  const link = waLink("Hi Shree Giriraj, I am looking to buy a ___ BHK in Borivali West.");

  it("adds the reference on its own line at the end of the message", () => {
    const text = new URL(withRef(link, ref)).searchParams.get("text");
    expect(text).toBe(
      "Hi Shree Giriraj, I am looking to buy a ___ BHK in Borivali West.\n\n(Ref: Borivali West sale page, Google ad)",
    );
  });

  it("writes spaces as %20, never as +", () => {
    expect(withRef(link, ref)).not.toContain("+");
  });

  it("never adds it twice", () => {
    const once = withRef(link, ref);
    expect(withRef(once, ref)).toBe(once);
  });

  it("leaves anything that is not WhatsApp alone", () => {
    expect(withRef("tel:+919324974133", ref)).toBe("tel:+919324974133");
    expect(withRef("https://www.shreegiriraj.com/contact", ref)).toBe("https://www.shreegiriraj.com/contact");
  });

  it("works when the link has no message yet", () => {
    const text = new URL(withRef("https://wa.me/919324974133", ref)).searchParams.get("text");
    expect(text).toBe("(Ref: Borivali West sale page, Google ad)");
  });
});
