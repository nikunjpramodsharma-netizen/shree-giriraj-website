import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import middleware from "./middleware";

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
});
