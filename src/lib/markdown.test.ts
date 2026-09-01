import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  parseFrontmatter,
  parseBlocks,
  parseInline,
  wordCount,
  slugify,
} from "./markdown";

describe("frontmatter", () => {
  const src = [
    "---",
    'title: "Carpet area, built up and super built up"',
    "slug: carpet-area-vs-built-up-area",
    "searchVolume: 3600",
    "answer: >",
    "  Carpet area is the usable floor space inside your flat.",
    "  Built up adds the walls.",
    "sources:",
    "  - label: MahaRERA",
    "    url: https://maharera.maharashtra.gov.in",
    "readNext:",
    "  - super-built-up-area-meaning",
    "  - what-is-loading-in-real-estate",
    "---",
    "",
    "## The short answer",
  ].join("\n");

  const { data, body } = parseFrontmatter(src);

  it("reads quoted and bare scalars", () => {
    expect(data.title).toBe("Carpet area, built up and super built up");
    expect(data.slug).toBe("carpet-area-vs-built-up-area");
  });

  it("reads numbers as numbers, so they can be compared", () => {
    expect(data.searchVolume).toBe(3600);
    expect(typeof data.searchVolume).toBe("number");
  });

  it("folds a block scalar onto one line", () => {
    expect(data.answer).toBe(
      "Carpet area is the usable floor space inside your flat. Built up adds the walls.",
    );
  });

  it("reads a list of objects", () => {
    expect(data.sources).toEqual([
      { label: "MahaRERA", url: "https://maharera.maharashtra.gov.in" },
    ]);
  });

  it("reads a plain list", () => {
    expect(data.readNext).toEqual([
      "super-built-up-area-meaning",
      "what-is-loading-in-real-estate",
    ]);
  });

  it("returns the body without the frontmatter", () => {
    expect(body.startsWith("## The short answer")).toBe(true);
  });

  it("survives a file with no frontmatter", () => {
    const r = parseFrontmatter("# Just a heading");
    expect(r.data).toEqual({});
    expect(r.body).toBe("# Just a heading");
  });
});

describe("blocks", () => {
  it("reads headings and gives them anchors", () => {
    const b = parseBlocks("## What you are paying for\n\n### Is it charged?");
    expect(b[0]).toEqual({
      t: "h2",
      text: "What you are paying for",
      id: "what-you-are-paying-for",
    });
    expect(b[1].t).toBe("h3");
  });

  it("joins a wrapped paragraph into one block", () => {
    const b = parseBlocks("One line\nand its continuation.\n\nA second para.");
    expect(b).toHaveLength(2);
    expect(b[0].t).toBe("p");
  });

  it("reads bullets and numbered lists", () => {
    const b = parseBlocks("- one\n- two\n\n1. first\n2. second");
    expect(b[0]).toMatchObject({ t: "ul" });
    expect(b[1]).toMatchObject({ t: "ol" });
    expect((b[0] as any).items).toHaveLength(2);
  });

  it("reads a table and drops the alignment row", () => {
    const b = parseBlocks("| A | B |\n|---|---|\n| 1 | 2 |");
    expect(b[0]).toEqual({ t: "table", head: ["A", "B"], rows: [["1", "2"]] });
  });

  it("reads a blockquote across lines", () => {
    const b = parseBlocks("> first\n> second");
    expect(b[0].t).toBe("quote");
  });

  it("reads a horizontal rule", () => {
    expect(parseBlocks("---").at(0)).toEqual({ t: "hr" });
  });
});

describe("review markers, the reason this parser exists", () => {
  it("lifts a standalone marker out as its own block", () => {
    const b = parseBlocks("[ VERIFY: confirm the RERA definition. ]");
    expect(b[0]).toEqual({
      t: "marker",
      kind: "VERIFY",
      text: "confirm the RERA definition.",
    });
  });

  it("recognises all three kinds", () => {
    const kinds = parseBlocks(
      "[ VERIFY: a ]\n\n[ YOUR WORDS: b ]\n\n[ DECISION: c ]",
    ).map((x: any) => x.kind);
    expect(kinds).toEqual(["VERIFY", "YOUR WORDS", "DECISION"]);
  });

  it("never leaks a marker into body copy as a paragraph", () => {
    const b = parseBlocks("[ YOUR WORDS: what we check first ]");
    expect(b[0].t).not.toBe("p");
  });

  it("keeps a marker used as a heading as a heading, with the tail as text", () => {
    const b = parseBlocks("## [ YOUR WORDS ] What we see in Borivali");
    expect(b[0]).toMatchObject({ t: "h2", text: "What we see in Borivali" });
  });

  it("leaves an ordinary paragraph alone", () => {
    expect(parseBlocks("Just a sentence.")[0].t).toBe("p");
  });
});

describe("inline", () => {
  it("reads bold, italic and links", () => {
    expect(parseInline("a **b** c")).toEqual([
      { t: "text", v: "a " },
      { t: "bold", v: "b" },
      { t: "text", v: " c" },
    ]);
    expect(parseInline("*em*")).toEqual([{ t: "em", v: "em" }]);
    expect(parseInline("[x](/y)")).toEqual([{ t: "link", v: "x", href: "/y" }]);
  });

  it("does not read bold as two italics", () => {
    const r = parseInline("**strong**");
    expect(r).toHaveLength(1);
    expect(r[0].t).toBe("bold");
  });

  it("returns plain text unchanged", () => {
    expect(parseInline("nothing special")).toEqual([
      { t: "text", v: "nothing special" },
    ]);
  });
});

describe("against the real drafts", () => {
  const raw = readFileSync(
    "content/drafts/carpet-area-vs-built-up-area.md",
    "utf8",
  );
  const { data, body } = parseFrontmatter(raw);
  const blocks = parseBlocks(body);

  it("parses a real draft's frontmatter", () => {
    expect(data.slug).toBe("carpet-area-vs-built-up-area");
    expect(data.searchVolume).toBe(3600);
    expect(String(data.answer)).toContain("Carpet area");
  });

  it("produces a real document, not an empty one", () => {
    expect(blocks.length).toBeGreaterThan(20);
    expect(blocks.filter((b) => b.t === "h2").length).toBeGreaterThan(3);
  });

  it("finds the review markers that are actually in it", () => {
    const markers = blocks.filter((b) => b.t === "marker");
    expect(markers.length).toBeGreaterThan(0);
  });

  it("counts a sensible number of words", () => {
    expect(wordCount(blocks)).toBeGreaterThan(500);
  });

  it("leaves no unrendered bracket marker inside a paragraph", () => {
    // The failure this guards against: a marker appearing as body copy on a
    // published page, which is exactly what must never happen.
    const paras = blocks.filter((b) => b.t === "p") as any[];
    const leaked = paras.filter((p) =>
      /\[\s*(VERIFY|YOUR WORDS|DECISION)\b/.test(
        p.spans.map((s: any) => s.v).join(""),
      ),
    );
    expect(leaked.map((p) => p.spans.map((s: any) => s.v).join(""))).toEqual([]);
  });
});

describe("slugify", () => {
  it("matches what the table of contents will link to", () => {
    expect(slugify("Stamp duty & registration, 2026")).toBe(
      "stamp-duty-registration-2026",
    );
  });
});

describe("markers inside tables and lists", () => {
  it("parses a marker sitting in a table cell", () => {
    // These leaked raw brackets onto the page until parseInline learned about
    // markers. The bug survived a first fix because a stray backspace
    // character had been written into the regex, which is invisible in source.
    const b: any = parseBlocks("| A | B |\n|---|---|\n| x | [ VERIFY: use a real flat ] |")[0];
    expect(parseInline(b.rows[0][1])[0].t).toBe("marker");
  });

  it("parses a marker in a list item", () => {
    const b: any = parseBlocks("- [ YOUR WORDS. what makes a landlord flexible ]")[0];
    expect(b.items[0][0].t).toBe("marker");
  });

  it("has no stray control characters in its own regexes", () => {
    const src = readFileSync("src/lib/markdown.ts", "utf8");
    // eslint-disable-next-line no-control-regex
    expect(/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(src)).toBe(false);
  });
});

describe("a marker heading still counts as outstanding", () => {
  it("emits both the heading and the marker", () => {
    // Without the marker, a post whose only unfinished section was a marker
    // heading reported itself ready and would have been indexed unwritten.
    const b = parseBlocks("## [ YOUR WORDS ] What we check first");
    expect(b.map((x) => x.t)).toEqual(["h2", "marker"]);
    expect((b[0] as any).text).toBe("What we check first");
    expect((b[1] as any).kind).toBe("YOUR WORDS");
  });
});
