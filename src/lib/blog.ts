import type { Locale } from "@/lib/i18n-content";

/**
 * Blog presentation helpers.
 *
 * IMAGERY RULE: every image on a post has to be about the thing the post is
 * about. A category fallback of hands stamping a document on a stamp duty
 * article is relevant; a generic skyline on the same article is decoration and
 * makes the page look like every other property blog. When a post has its own
 * `mainImage` that always wins, because a specific photograph beats a category
 * one every time.
 *
 * These six are PLACEHOLDER stock, chosen to match the cluster rather than to
 * look pretty. Replace with real photography as it becomes available.
 */
export type CategoryVisual = { image: string; alt: string };

const FALLBACK: CategoryVisual = {
  image: "/blog/buying.jpg",
  alt: "Residential towers in the Mumbai skyline",
};

/**
 * Keys are matched loosely against the post's category titles, so a category
 * called "Paperwork, registration and tax" still resolves to `paperwork`.
 */
const CATEGORY_VISUALS: { match: RegExp; visual: CategoryVisual }[] = [
  {
    match: /paperwork|registration|tax|document|legal/i,
    visual: {
      image: "/blog/paperwork.jpg",
      alt: "Hands stamping an official property document",
    },
  },
  {
    match: /loan|money|finance|mortgage|emi/i,
    visual: {
      image: "/blog/money.jpg",
      alt: "Signing a property agreement at a desk",
    },
  },
  {
    match: /rent|tenant|licence|license/i,
    visual: {
      image: "/blog/renting.jpg",
      alt: "Keys being handed across a desk to a new tenant",
    },
  },
  {
    match: /buy|resale|purchase|area|vastu/i,
    visual: {
      image: "/blog/buying.jpg",
      alt: "Residential towers in the Mumbai skyline",
    },
  },
  {
    match: /redevelop|society|fsi|tdr|committee/i,
    visual: {
      image: "/blog/redevelopment.jpg",
      alt: "A high rise residential building under construction",
    },
  },
  {
    match: /interior|kitchen|renovation|fit out|civil/i,
    visual: {
      image: "/blog/interiors.jpg",
      alt: "A finished living room in a Mumbai apartment",
    },
  },
];

export function categoryVisual(categories?: string[]): CategoryVisual {
  for (const c of categories ?? []) {
    const hit = CATEGORY_VISUALS.find((v) => v.match.test(c));
    if (hit) return hit.visual;
  }
  return FALLBACK;
}

/**
 * Reading time from Portable Text. 200 words per minute, which is a
 * conservative rate for a reader skimming a reference article rather than
 * reading fiction.
 */
export function readingMinutes(body: unknown): number {
  const words = countWords(body);
  return Math.max(1, Math.round(words / 200));
}

function countWords(node: unknown): number {
  if (!node) return 0;
  if (Array.isArray(node)) return node.reduce<number>((n, x) => n + countWords(x), 0);
  if (typeof node === "object") {
    const o = node as Record<string, unknown>;
    if (typeof o.text === "string") return o.text.trim().split(/\s+/).filter(Boolean).length;
    return Object.values(o).reduce<number>((n, x) => n + countWords(x), 0);
  }
  return 0;
}

export type Heading = { id: string; text: string; level: 2 | 3 };

/**
 * Pull H2 and H3 out of Portable Text for the table of contents.
 *
 * The same slugging has to be used when rendering the headings themselves or
 * the anchors will not match, which is why both live in this file.
 */
export function extractHeadings(body: unknown): Heading[] {
  if (!Array.isArray(body)) return [];
  const out: Heading[] = [];
  for (const block of body) {
    const b = block as Record<string, unknown>;
    if (b?._type !== "block") continue;
    const style = b.style;
    if (style !== "h2" && style !== "h3") continue;
    const text = (Array.isArray(b.children) ? b.children : [])
      .map((c) => (c as Record<string, unknown>)?.text ?? "")
      .join("")
      .trim();
    if (!text) continue;
    out.push({ id: slugifyHeading(text), text, level: style === "h2" ? 2 : 3 });
  }
  return out;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/** Long posts get a table of contents. Short ones do not need one. */
export const TOC_MIN_HEADINGS = 3;

export function formatDate(d: string, locale: Locale | string) {
  return new Date(d).toLocaleDateString(locale === "en" ? "en-IN" : String(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
