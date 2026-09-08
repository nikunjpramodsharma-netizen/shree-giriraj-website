import type { Block, Inline } from "@/lib/markdown";

/**
 * Lifting the "Common questions" section out of a post.
 *
 * WHY
 *
 * Every draft ends with a "## Common questions" section written as a bold
 * question followed by its answer. Rendered as ordinary body markdown that is
 * a heading and some bold paragraphs: fine to read, invisible to a machine.
 * The Sanity posts, by contrast, carry their questions as structured data
 * and get a proper FAQ block plus FAQPage markup. The markdown posts, which
 * are the ones that actually exist, got neither. That is the wrong way round
 * for a site whose whole content strategy is being the cited answer.
 *
 * So the section is parsed into question and answer pairs here, removed from
 * the body, and rendered by a dedicated block with matching JSON-LD. Nothing
 * about how the drafts are written changes. A question is a paragraph whose
 * first span is bold; its answer is the rest of the paragraph.
 */

export type Faq = {
  question: string;
  /** Rich spans, so a link inside an answer survives. */
  answerSpans: Inline[];
  /** Plain text for the schema markup. */
  answer: string;
};

const HEADING = /^common questions$/i;

export function plainOf(spans: Inline[]): string {
  return spans
    .map((s) => s.v)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns the body without its questions section, and the questions.
 *
 * The section runs from the "Common questions" heading to the next h2. A
 * horizontal rule inside it is ignored. Paragraphs in it that do not start
 * with a bold span are left in the body, so a stray sentence is not lost.
 */
export function splitFaqs(blocks: Block[]): { blocks: Block[]; faqs: Faq[] } {
  const start = blocks.findIndex((b) => b.t === "h2" && HEADING.test(b.text));
  if (start === -1) return { blocks, faqs: [] };

  let end = blocks.length;
  for (let i = start + 1; i < blocks.length; i++) {
    if (blocks[i].t === "h2") {
      end = i;
      break;
    }
  }

  const faqs: Faq[] = [];
  const keep: Block[] = [];
  for (const b of blocks.slice(start + 1, end)) {
    if (b.t === "hr") continue;
    if (b.t === "p" && b.spans[0]?.t === "bold" && b.spans.length > 1) {
      const question = b.spans[0].v.trim();
      const answerSpans = b.spans.slice(1);
      // The first text span begins with the newline that separated question
      // from answer in the markdown, which parses as a leading space.
      const first = answerSpans[0];
      if (first && first.t === "text") {
        answerSpans[0] = { ...first, v: first.v.replace(/^\s+/, "") };
      }
      const answer = plainOf(answerSpans);
      if (question && answer) {
        faqs.push({ question, answerSpans, answer });
        continue;
      }
    }
    keep.push(b);
  }

  // If the section produced no questions at all, leave the post untouched
  // rather than silently deleting a heading.
  if (faqs.length === 0) return { blocks, faqs: [] };

  // Drop a rule that immediately preceded the heading too, or the body ends
  // on a bare line.
  let cut = start;
  if (cut > 0 && blocks[cut - 1].t === "hr") cut -= 1;

  return {
    blocks: [...blocks.slice(0, cut), ...keep, ...blocks.slice(end)],
    faqs,
  };
}
