import { describe, it, expect } from "vitest";
import { SERVICE_SLUGS } from "./seo";
import { SERVICE_FAQS, getServiceFaqs } from "./service-faqs";
import { getPost } from "./posts";

// Imported rather than retyped. This list was a hand written copy and it went
// stale the moment redevelopment advisory was replaced by investment advisory,
// which is exactly the drift the import prevents.
const SLUGS = SERVICE_SLUGS;

describe("service page questions", () => {
  it("covers every service route", () => {
    for (const s of SLUGS) expect(getServiceFaqs(s).length, s).toBeGreaterThanOrEqual(4);
  });

  it("returns nothing for a route that is not a service", () => {
    expect(getServiceFaqs("no-such-service")).toEqual([]);
  });

  it("phrases every entry as a question with a real answer", () => {
    for (const [slug, faqs] of Object.entries(SERVICE_FAQS)) {
      for (const f of faqs) {
        expect(f.q.endsWith("?"), `${slug}: ${f.q}`).toBe(true);
        expect(f.a.length, `${slug}: ${f.q}`).toBeGreaterThan(80);
      }
    }
  });

  it("only links to pages that exist", () => {
    for (const faqs of Object.values(SERVICE_FAQS)) {
      for (const f of faqs) {
        if (!f.href) continue;
        expect(f.hrefLabel, f.href).toBeTruthy();
        if (f.href.startsWith("/blog/")) {
          expect(getPost(f.href.replace("/blog/", "")), f.href).not.toBeNull();
        }
      }
    }
  });

  /**
   * The resale and new launch answers quote the same asking rates as the
   * carpet area article. If one is refreshed without the other, this fails.
   */
  it("quotes the same Borivali West resale rate as the carpet area article", () => {
    const post = getPost("carpet-area-vs-built-up-area")!;
    const table = JSON.stringify(post.blocks);
    expect(table).toContain("31,200");
    expect(SERVICE_FAQS["resale-flats"][0].a).toContain("31,200");
  });

  it("uses no dashes, per the site rule", () => {
    for (const faqs of Object.values(SERVICE_FAQS)) {
      for (const f of faqs) {
        expect(/[\u2013\u2014]/.test(f.q + f.a)).toBe(false);
      }
    }
  });
});
