import { existsSync } from "node:fs";
import { join } from "node:path";
import { loadPostFile, type Post } from "@/lib/posts";
import type { PostOffer } from "@/lib/post-offers";

/**
 * Long form guides, written as markdown in content/guides.
 *
 * Same article format as the blog (answer box, tables, questions with
 * FAQPage markup, sources), rendered by the same component, but they live
 * under /guides/<slug> and are listed on the guides index under "New
 * projects and launches".
 *
 * SERIES, AND LINKS TO GUIDES THAT DO NOT EXIST YET
 *
 * The set is five guides, written together, in this order. Two of them have
 * not arrived. Their slugs are listed here so that a link to one resolves
 * against the files that actually exist: while the file is missing the link
 * renders as plain text (see isUnpublishedGuidePath, used by MarkdownBody),
 * and the day the markdown file is added it becomes a link, with no other
 * edit. The index lists only the guides that exist, so three today and five
 * later. Same idea as the readiness logic in pillars.ts.
 *
 * Pillar hubs (pillars.ts) are separate and unaffected.
 */

const GUIDE_DIR = join(process.cwd(), "content", "guides");

export type GuideEntry = {
  slug: string;
  /** Short title for the index and for lists. The page keeps its full H1. */
  label: string;
};

/** In reading order. */
export const GUIDE_SERIES: GuideEntry[] = [
  {
    slug: "new-projects-borivali-west",
    label: "New projects in Borivali West and how a launch booking works",
  },
  {
    slug: "allotment-letter-under-construction-flat",
    label: "What an allotment letter is and what to read in it",
  },
  {
    slug: "nri-book-under-construction-flat-mumbai",
    label: "How an NRI books an under construction flat",
  },
  {
    slug: "stamp-duty-gst-under-construction-maharashtra",
    label: "Stamp duty and GST on under construction property",
  },
  {
    slug: "how-to-check-a-builder-rera-page",
    label: "How to check a builder's RERA page",
  },
];

export const GUIDE_SERIES_SLUGS = GUIDE_SERIES.map((g) => g.slug);

/** True once the guide's markdown file exists. Cheap enough to call per link. */
export function guideExists(slug: string): boolean {
  return (
    GUIDE_SERIES_SLUGS.includes(slug) &&
    existsSync(join(GUIDE_DIR, `${slug}.md`))
  );
}

export function getGuide(slug: string): Post | null {
  if (!GUIDE_SERIES_SLUGS.includes(slug)) return null;
  return loadPostFile(join(GUIDE_DIR, `${slug}.md`), slug);
}

/** The guides that exist, in series order. */
export function getPublishedGuides(): (GuideEntry & { post: Post })[] {
  const out: (GuideEntry & { post: Post })[] = [];
  for (const g of GUIDE_SERIES) {
    const post = getGuide(g.slug);
    if (post) out.push({ ...g, post });
  }
  return out;
}

export function getPublishedGuideSlugs(): string[] {
  return GUIDE_SERIES_SLUGS.filter(guideExists);
}

/**
 * A link to a guide in the series whose file has not been added yet. The
 * renderer shows its text without a link, so nothing points into a 404.
 * Links to anything else, including the pillar hubs, are never affected.
 */
export function isUnpublishedGuidePath(href: string): boolean {
  const m = /^\/guides\/([a-z0-9-]+)\/?(?:[?#].*)?$/.exec(href);
  if (!m) return false;
  return GUIDE_SERIES_SLUGS.includes(m[1]) && !guideExists(m[1]);
}

/** The offer shown beside each guide. Same shape as a blog post's. */
export const GUIDE_OFFERS: Record<string, PostOffer> = {
  "new-projects-borivali-west": {
    heading: "Want the current sheet for a new project?",
    body: "We send you the builder sheet for the unit you want. Then we check the MahaRERA record and the papers before you pay anything.",
    whatsapp:
      "Hi Shree Giriraj, please send me the current sheet for new projects in Borivali West. I am looking for ___.",
    button: "Send me the sheet",
    intentKey: "intentNewProject",
  },
  "stamp-duty-gst-under-construction-maharashtra": {
    heading: "Want the all inclusive figure for a unit?",
    body: "Tell us the project and the unit. We work out stamp duty, registration, GST and the builder's charges in rupees before you book.",
    whatsapp:
      "Hi Shree Giriraj, please work out the all inclusive cost for ___.",
    button: "Get the full figure",
    intentKey: "intentNewProject",
  },
  "how-to-check-a-builder-rera-page": {
    heading: "Want a second pair of eyes on a RERA page?",
    body: "Send us a project name. We read its MahaRERA page with you and explain what each filing means.",
    whatsapp:
      "Hi Shree Giriraj, can you check the RERA page for ___ with me?",
    button: "Check a project with us",
    intentKey: "intentNewProject",
  },
  // The two guides still to arrive get their offer when their files do.
  "allotment-letter-under-construction-flat": {
    heading: "Got an allotment letter to read?",
    body: "Send it to us. We read it with you and tell you what each clause means, before you pay more.",
    whatsapp:
      "Hi Shree Giriraj, I have an allotment letter for ___. Can you read it with me?",
    button: "Read it with us",
    intentKey: "intentNewProject",
  },
  "nri-book-under-construction-flat-mumbai": {
    heading: "Booking a Mumbai flat from abroad?",
    body: "We do the checks and the paperwork. You say yes on WhatsApp.",
    whatsapp:
      "Hi Shree Giriraj, I live abroad and want to book a flat in a new project in ___. Can you help?",
    button: "Ask about booking",
    intentKey: "intentNewProject",
  },
};
