import { describe, it, expect } from "vitest";
import { isEnglishOnlyPath } from "./seo";

describe("English only sections keep their links unprefixed", () => {
  // Three 404s on 9 September 2026: the repo backed service pages render in
  // four locales and their bodies link to the rental yield calculator, which
  // exists only in English. These pin the predicate the markdown renderer uses.
  it("recognises every English only section and its children", () => {
    for (const p of ["/tools", "/tools/rental-yield-calculator", "/guides/x", "/blog/y", "/areas/malad", "/about", "/contact"]) {
      expect(isEnglishOnlyPath(p), p).toBe(true);
    }
  });
  it("leaves the translated sections alone", () => {
    for (const p of ["/", "/services", "/services/investment-advisory", "/projects", "/toolsy", "/aboutus"]) {
      expect(isEnglishOnlyPath(p), p).toBe(false);
    }
  });
});
