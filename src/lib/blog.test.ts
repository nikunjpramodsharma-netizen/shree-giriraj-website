import { describe, it, expect } from "vitest";
import {
  categoryVisual,
  readingMinutes,
  extractHeadings,
  slugifyHeading,
} from "./blog";

function block(style: string, text: string) {
  return { _type: "block", style, children: [{ _type: "span", text }] };
}

describe("categoryVisual", () => {
  it("matches a category loosely, so full category titles still resolve", () => {
    expect(categoryVisual(["Paperwork, registration and tax"]).image).toBe(
      "/blog/paperwork.jpg",
    );
    expect(categoryVisual(["Society redevelopment"]).image).toBe(
      "/blog/redevelopment.jpg",
    );
    expect(categoryVisual(["Interiors and moving in"]).image).toBe(
      "/blog/interiors.jpg",
    );
  });

  it("falls back rather than rendering nothing when the category is unknown", () => {
    const v = categoryVisual(["Something we have not planned for"]);
    expect(v.image).toBe("/blog/buying.jpg");
    expect(v.alt).toBeTruthy();
  });

  it("falls back when there is no category at all", () => {
    expect(categoryVisual(undefined).image).toBe("/blog/buying.jpg");
    expect(categoryVisual([]).image).toBe("/blog/buying.jpg");
  });

  it("always supplies alt text, because a decorative hero still needs it", () => {
    for (const c of [["Renting"], ["Home loans"], ["Buying"], []]) {
      expect(categoryVisual(c).alt.length).toBeGreaterThan(0);
    }
  });
});

describe("extractHeadings and slugifyHeading", () => {
  const body = [
    block("normal", "Some introductory text that is not a heading."),
    block("h2", "What you are actually paying"),
    block("h3", "Is it charged on the price I agreed?"),
    block("h2", "Common questions"),
    block("h4", "Too deep to appear in the contents"),
  ];

  it("pulls only h2 and h3, in document order", () => {
    const h = extractHeadings(body);
    expect(h.map((x) => x.text)).toEqual([
      "What you are actually paying",
      "Is it charged on the price I agreed?",
      "Common questions",
    ]);
    expect(h.map((x) => x.level)).toEqual([2, 3, 2]);
  });

  it("generates ids that match what the renderer will produce", () => {
    // This is the contract that keeps the table of contents working. The
    // renderer slugs the same heading text with the same function, so if this
    // pair ever drifts the anchors silently point at nothing.
    const h = extractHeadings(body)[1];
    expect(h.id).toBe(slugifyHeading("Is it charged on the price I agreed?"));
    expect(h.id).toBe("is-it-charged-on-the-price-i-agreed");
  });

  it("drops punctuation and collapses whitespace", () => {
    expect(slugifyHeading("Stamp duty & registration, 2026")).toBe(
      "stamp-duty-registration-2026",
    );
  });

  it("ignores empty headings instead of creating a blank anchor", () => {
    expect(extractHeadings([block("h2", "   ")])).toEqual([]);
  });

  it("returns nothing for a missing or non array body", () => {
    expect(extractHeadings(undefined)).toEqual([]);
    expect(extractHeadings("not portable text")).toEqual([]);
  });
});

describe("readingMinutes", () => {
  it("counts words nested anywhere in the portable text tree", () => {
    const body = [block("normal", "one two three four five"), block("h2", "six seven")];
    expect(readingMinutes(body)).toBe(1);
  });

  it("scales at roughly 200 words per minute", () => {
    const long = [block("normal", Array(1000).fill("word").join(" "))];
    expect(readingMinutes(long)).toBe(5);
  });

  it("never returns zero, because '0 min read' is nonsense", () => {
    expect(readingMinutes([])).toBe(1);
    expect(readingMinutes(undefined)).toBe(1);
  });
});
