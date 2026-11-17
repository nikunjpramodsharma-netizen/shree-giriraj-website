import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import middleware, { config } from "./middleware";

describe("locale detection middleware", () => {
  it("redirects a first-time Hindi-preferring visitor to /hi", () => {
    const req = new NextRequest("https://example.com/", {
      headers: { "accept-language": "hi-IN,hi;q=0.9" },
    });
    const res = middleware(req);
    expect(res.headers.get("location")).toContain("/hi");
  });

  it("redirects a first-time Marathi-preferring visitor to /mr", () => {
    const req = new NextRequest("https://example.com/", {
      headers: { "accept-language": "mr-IN,mr;q=0.9" },
    });
    const res = middleware(req);
    expect(res.headers.get("location")).toContain("/mr");
  });

  it("redirects a first-time Gujarati-preferring visitor to /gu", () => {
    const req = new NextRequest("https://example.com/", {
      headers: { "accept-language": "gu-IN,gu;q=0.9" },
    });
    const res = middleware(req);
    expect(res.headers.get("location")).toContain("/gu");
  });

  it("leaves English visitors on the unprefixed path", () => {
    const req = new NextRequest("https://example.com/projects", {
      headers: { "accept-language": "en-US,en;q=0.9" },
    });
    const res = middleware(req);
    // "as-needed" prefix strategy: English never redirects to /en.
    expect(res.headers.get("location")).toBeNull();
  });

  it("respects an existing NEXT_LOCALE cookie over Accept-Language", () => {
    const req = new NextRequest("https://example.com/", {
      headers: { "accept-language": "hi-IN,hi;q=0.9", cookie: "NEXT_LOCALE=mr" },
    });
    const res = middleware(req);
    expect(res.headers.get("location")).toContain("/mr");
  });

  it("leaves the digital card alone and still handles ordinary pages", () => {
    const matcher = new RegExp(`^${config.matcher[0]}$`);
    expect(matcher.test("/card")).toBe(false);
    expect(matcher.test("/card/pramod-sharma.vcf")).toBe(false);
    expect(matcher.test("/projects")).toBe(true);
    expect(matcher.test("/cardamom")).toBe(true);
  });

  it("never sends a Hindi browser on an English only page to a locale 404", () => {
    for (const path of ["/tools/rental-yield-calculator", "/blog/mhada-flat-transfer", "/areas/kandivali", "/contact", "/guides", "/about"]) {
      const req = new NextRequest(`https://example.com${path}`, {
        headers: { "accept-language": "hi-IN,hi;q=0.9" },
      });
      const res = middleware(req);
      expect(res.headers.get("location"), path).toBeNull();
    }
  });

  it("ignores a Gujarati cookie on an English only page", () => {
    const req = new NextRequest("https://example.com/tools", {
      headers: { cookie: "NEXT_LOCALE=gu" },
    });
    expect(middleware(req).headers.get("location")).toBeNull();
  });

  it("sends a prefixed English only URL to the English page", () => {
    const res = middleware(new NextRequest("https://example.com/mr/tools/home-loan-emi-calculator"));
    expect(res.status).toBe(308);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/tools/home-loan-emi-calculator");
  });

  it("leaves the translated blog index under its locale", () => {
    const res = middleware(new NextRequest("https://example.com/hi/blog"));
    expect(res.headers.get("location")).toBeNull();
  });
});
