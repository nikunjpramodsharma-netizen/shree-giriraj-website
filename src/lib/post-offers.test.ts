import { describe, expect, it } from "vitest";
import { POST_OFFERS } from "@/lib/post-offers";
import { getPostSlugs } from "@/lib/posts";

describe("post offers", () => {
  it("only names posts that exist", () => {
    const slugs = new Set(getPostSlugs());
    for (const slug of Object.keys(POST_OFFERS)) expect(slugs.has(slug)).toBe(true);
  });

  it("uses no dashes anywhere in the copy", () => {
    for (const o of Object.values(POST_OFFERS)) {
      for (const text of [o.heading, o.body, o.whatsapp, o.button]) {
        expect(text).not.toMatch(/[‐-―−]| - /);
      }
    }
  });

  it("leaves the reader a blank to fill in on WhatsApp", () => {
    for (const o of Object.values(POST_OFFERS)) expect(o.whatsapp).toContain("___");
  });
});
