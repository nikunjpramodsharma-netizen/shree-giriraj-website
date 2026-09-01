import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  parseFrontmatter,
  parseBlocks,
  wordCount,
  type Block,
} from "@/lib/markdown";

/**
 * Blog posts from markdown in the repo.
 *
 * WHY THIS EXISTS
 *
 * The blog was the only part of the site still waiting on a Sanity write
 * token. Guides, areas and all seven tools render from content in the repo and
 * work today. There was no reason for the blog to be different, and while it
 * was, thirteen finished drafts could not be seen by anybody.
 *
 * So posts are read from content/drafts at build time. Sanity remains the
 * eventual home for anything the owner wants to edit without a deploy, and the
 * route falls through to it, but nothing is blocked on it any more.
 *
 * READY VERSUS DRAFT
 *
 * A post with no outstanding review markers is publishable. A post that still
 * carries any is a draft: it renders, with its markers shown as review notes,
 * and it is served noindex. Same rule as the area pages. That way a draft can
 * be read and corrected on the deployed site without one unverified claim
 * reaching a search engine.
 */

const DIR = join(process.cwd(), "content", "drafts");

export type PostMeta = {
  slug: string;
  title: string;
  category?: string;
  targetKeyword?: string;
  searchVolume?: number;
  answer?: string;
  note?: string;
  sources: { label: string; url?: string }[];
  sourcesCheckedOn?: string;
  readNext: string[];
  relatedFaqs: string[];
};

export type Post = PostMeta & {
  blocks: Block[];
  readingMinutes: number;
  /** Outstanding review markers. Empty means the post is publishable. */
  openMarkers: { kind: string; text: string }[];
  isReady: boolean;
};

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function asStringList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

function asSources(v: unknown): { label: string; url?: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (typeof x === "string") return { label: x };
      if (x && typeof x === "object") {
        const o = x as Record<string, unknown>;
        const label = asString(o.label);
        if (!label) return null;
        const url = asString(o.url);
        // A source whose URL is still a placeholder is a label only.
        return { label, url: url && url.startsWith("http") ? url : undefined };
      }
      return null;
    })
    .filter((x): x is { label: string; url?: string } => x !== null);
}

/**
 * A frontmatter date is only a date if it parses. Drafts carry "" or a review
 * marker in this field as often as a real value, and rendering those produced
 * a literal "Checked Invalid Date" on the page.
 */
export function displayDate(v: string | undefined): string | null {
  if (!v || v.trim().startsWith("[")) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : v;
}

export function getPostSlugs(): string[] {
  if (!existsSync(DIR)) return [];
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPost(slug: string): Post | null {
  const file = join(DIR, `${slug}.md`);
  if (!existsSync(file)) return null;

  const { data, body } = parseFrontmatter(readFileSync(file, "utf8"));
  const answer = asString(data.answer);
  const blocks = dropDuplicateAnswer(parseBlocks(body), answer);
  const openMarkers = blocks
    .filter((b): b is Extract<Block, { t: "marker" }> => b.t === "marker")
    .map((b) => ({ kind: b.kind, text: b.text }));

  return {
    slug: asString(data.slug) ?? slug,
    title: asString(data.title) ?? slug,
    category: asString(data.category),
    targetKeyword: asString(data.targetKeyword),
    searchVolume:
      typeof data.searchVolume === "number" ? data.searchVolume : undefined,
    answer,
    note: asString(data.note),
    sources: asSources(data.sources),
    sourcesCheckedOn: asString(data.sourcesCheckedOn),
    readNext: asStringList(data.readNext),
    relatedFaqs: asStringList(data.relatedFaqs),
    blocks,
    readingMinutes: Math.max(1, Math.round(wordCount(blocks) / 200)),
    openMarkers,
    isReady: openMarkers.length === 0,
  };
}

/**
 * Every draft repeats its answer twice: once in the frontmatter, where it is
 * the machine readable summary, and again as a "## The short answer" section
 * at the top of the body. That is correct in the markdown, and it rendered the
 * same paragraph twice on the page, immediately under itself.
 *
 * The frontmatter version wins, because it gets the styled treatment and is
 * what a search result lifts. So the body copy of that one section is dropped,
 * from its heading to the rule that closes it.
 */
function dropDuplicateAnswer(blocks: Block[], answer?: string): Block[] {
  if (!answer) return blocks;
  const start = blocks.findIndex(
    (b) => b.t === "h2" && /^the short answer$/i.test(b.text),
  );
  if (start === -1) return blocks;

  let end = start + 1;
  while (end < blocks.length && blocks[end].t !== "hr" && blocks[end].t !== "h2") {
    end += 1;
  }
  // Take the closing rule with it, or the page keeps a stray line.
  if (blocks[end]?.t === "hr") end += 1;
  return [...blocks.slice(0, start), ...blocks.slice(end)];
}

/** Every post, biggest search volume first. Drafts included. */
export function getAllPosts(): Post[] {
  return getPostSlugs()
    .map(getPost)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (b.searchVolume ?? 0) - (a.searchVolume ?? 0));
}

/**
 * Related posts for the bottom of an article.
 *
 * Prefers the ones named in readNext, then fills from the same category, then
 * from whatever is left. Only ever returns posts that actually exist, so it
 * cannot link into a hole.
 */
export function getRelated(post: Post, limit = 3): Post[] {
  const all = getAllPosts().filter((p) => p.slug !== post.slug);
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const out: Post[] = [];

  for (const slug of post.readNext) {
    const hit = bySlug.get(slug);
    if (hit && !out.includes(hit)) out.push(hit);
    if (out.length >= limit) return out;
  }
  for (const p of all) {
    if (out.length >= limit) break;
    if (p.category && p.category === post.category && !out.includes(p)) {
      out.push(p);
    }
  }
  for (const p of all) {
    if (out.length >= limit) break;
    if (!out.includes(p)) out.push(p);
  }
  return out;
}
