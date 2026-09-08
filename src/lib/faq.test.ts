import { describe, it, expect } from "vitest";
import { parseBlocks } from "./markdown";
import { splitFaqs } from "./faq";
import { getAllPosts } from "./posts";

const md = `
## Body

Some body text.

---

## Common questions

**Is it refundable?**
Yes, less deductions. See the [guide](/guides/x).

**When is it returned?**
Within thirty days.

---

## Before you sign

Last words.
`;

describe("splitting the questions out of a post", () => {
  const { blocks, faqs } = splitFaqs(parseBlocks(md));

  it("finds every bold question and its answer", () => {
    expect(faqs.map((f) => f.question)).toEqual([
      "Is it refundable?",
      "When is it returned?",
    ]);
    expect(faqs[1].answer).toBe("Within thirty days.");
  });

  it("strips the line break that separated question from answer", () => {
    expect(faqs[0].answer.startsWith("Yes")).toBe(true);
    expect(faqs[0].answerSpans[0].v.startsWith(" ")).toBe(false);
  });

  it("keeps a link inside an answer as a link", () => {
    expect(faqs[0].answerSpans.some((s) => s.t === "link")).toBe(true);
    expect(faqs[0].answer).toContain("See the guide.");
  });

  it("removes the section, its heading and the rule before it from the body", () => {
    const types = blocks.map((b) => (b.t === "h2" ? `h2:${b.text}` : b.t));
    expect(types).toEqual(["h2:Body", "p", "h2:Before you sign", "p"]);
  });

  it("leaves a post without the section alone", () => {
    const b = parseBlocks("## Only\n\nText.");
    expect(splitFaqs(b)).toEqual({ blocks: b, faqs: [] });
  });

  it("does not delete a heading that yielded no questions", () => {
    const b = parseBlocks("## Common questions\n\nNo questions here.\n\n## Next\n\nText.");
    const r = splitFaqs(b);
    expect(r.faqs).toEqual([]);
    expect(r.blocks).toBe(b);
  });
});

describe("against the real posts", () => {
  const posts = getAllPosts();

  it("gives every post at least three questions", () => {
    for (const p of posts) {
      expect(p.faqs.length, p.slug).toBeGreaterThanOrEqual(3);
    }
  });

  it("phrases every one as a question", () => {
    for (const p of posts) {
      for (const f of p.faqs) expect(f.question.endsWith("?"), `${p.slug}: ${f.question}`).toBe(true);
    }
  });

  it("gives every question a real answer", () => {
    for (const p of posts) {
      for (const f of p.faqs) expect(f.answer.length, `${p.slug}: ${f.question}`).toBeGreaterThan(40);
    }
  });

  it("leaves no questions heading in the body once lifted", () => {
    for (const p of posts) {
      const left = p.blocks.some((b) => b.t === "h2" && /common questions/i.test(b.text));
      expect(left, p.slug).toBe(false);
    }
  });
});
