import { describe, it, expect } from "vitest";
import { GLOSSARY, termsIn } from "./glossary";
import { plainText } from "./markdown";
import { getAllPosts } from "./posts";

describe("the glossary itself", () => {
  it("gives every term a plain sentence", () => {
    for (const t of GLOSSARY) {
      expect(t.plain.length, t.term).toBeGreaterThan(30);
      expect(t.match.length, t.term).toBeGreaterThan(0);
    }
  });

  it("keeps every needle lowercase, since matching lowercases the text", () => {
    for (const t of GLOSSARY) {
      for (const m of t.match) expect(m, t.term).toBe(m.toLowerCase());
    }
  });

  it("names no term twice", () => {
    const names = GLOSSARY.map((t) => t.term);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("picking terms out of a piece of text", () => {
  it("finds a term the text uses", () => {
    expect(termsIn("the bank still has a lien on it").map((t) => t.term)).toContain(
      "Lien",
    );
  });

  it("says nothing when the text uses none of them", () => {
    expect(termsIn("a short note about nothing in particular")).toEqual([]);
  });

  it("is not case sensitive", () => {
    expect(termsIn("STAMP DUTY is payable").length).toBeGreaterThan(0);
  });

  it("caps the list, so a long article does not end in a dictionary", () => {
    const everything = GLOSSARY.flatMap((t) => t.match).join(" ");
    expect(termsIn(everything).length).toBeLessThanOrEqual(6);
  });
});

describe("against the real drafts", () => {
  /**
   * The point of the glossary is the reader who has never bought a flat. Two
   * words in particular were doing the damage: "lien" and "consideration"
   * appear across most of the cluster with no explanation anywhere.
   */
  const posts = getAllPosts();

  it("explains lien wherever a post uses it", () => {
    for (const p of posts) {
      const text = plainText(p.blocks);
      if (!/\blien\b/i.test(text)) continue;
      expect(
        termsIn(text).map((t) => t.term),
        p.slug,
      ).toContain("Lien");
    }
  });

  it("explains consideration wherever a post uses it", () => {
    for (const p of posts) {
      const text = plainText(p.blocks);
      if (!/consideration/i.test(text)) continue;
      expect(
        termsIn(text).map((t) => t.term),
        p.slug,
      ).toContain("Consideration");
    }
  });

  it("never defines a word the reader has not met in that post", () => {
    for (const p of posts) {
      const text = plainText(p.blocks).toLowerCase();
      for (const t of termsIn(text)) {
        expect(
          t.match.some((m) => text.includes(m)),
          `${p.slug} defined ${t.term}`,
        ).toBe(true);
      }
    }
  });
});

describe("whole word matching", () => {
  /**
   * A plain substring test put a definition of "lien" on eight of the
   * thirteen drafts, including one about hiring an interior designer. The
   * letters sit inside "client". "loading" hides inside "downloading" the
   * same way.
   */
  it("does not find lien inside client", () => {
    expect(termsIn("we ask every client the same question")).toEqual([]);
  });

  it("does not find loading inside downloading", () => {
    expect(termsIn("downloading the receipt is free")).toEqual([]);
  });

  it("still finds the word when it is punctuated", () => {
    expect(termsIn("cleared of any lien, and then sold").map((t) => t.term)).toContain(
      "Lien",
    );
    expect(termsIn("is there a lien?").map((t) => t.term)).toContain("Lien");
  });

  it("still finds a multi word term", () => {
    expect(
      termsIn("the ready reckoner rate for the area").map((t) => t.term),
    ).toContain("Ready reckoner rate");
  });
});

describe("a post does not define its own subject", () => {
  it("drops the term the title is already about", () => {
    const text = "an occupancy certificate is issued once the building is done";
    expect(termsIn(text).map((t) => t.term)).toContain("Occupancy certificate");
    expect(
      termsIn(text, { notAbout: "Occupancy certificate: why it matters" }).map(
        (t) => t.term,
      ),
    ).not.toContain("Occupancy certificate");
  });

  it("keeps the other terms in the same article", () => {
    const terms = termsIn("stamp duty is paid at the sub registrar office", {
      notAbout: "Stamp duty and registration charges in Mumbai",
    }).map((t) => t.term);
    expect(terms).not.toContain("Stamp duty");
    expect(terms).toContain("Sub registrar");
  });
});
