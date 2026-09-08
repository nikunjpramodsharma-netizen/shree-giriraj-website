import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import {
  postLocaleIndexQuery,
  pageLocaleIndexQuery,
  projectLocaleIndexQuery,
} from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import { absoluteUrl, sitemapAlternates, SERVICE_SLUGS } from "@/lib/seo";
import { LOCALES, type Locale } from "@/lib/i18n-content";
import { PILLAR_SLUGS } from "@/lib/pillars";
import { AREA_SLUGS, getArea, areaIsComplete } from "@/lib/areas";
import { STORY_IS_WRITTEN } from "@/lib/about";
import { TOOL_SLUGS } from "@/lib/tools";
import { getAllPosts, displayDate } from "@/lib/posts";

export const revalidate = 3600;

type LocaleIndexRow = { slug: string; updatedAt: string; locales: Locale[] };

/**
 * One entry per locale that genuinely exists, each carrying the full hreflang
 * set for its cluster.
 *
 * The rule that makes or breaks this: the alternates here, the canonical on the
 * page, and the routes that actually generate must all agree. If the sitemap
 * advertises a Marathi URL that the route does not generate, Google finds a 404
 * inside an hreflang cluster and discards the whole cluster, taking the working
 * English page's signal with it.
 */
function entriesFor(
  path: string,
  locales: readonly Locale[],
  lastModified?: string | Date,
  priority?: number,
): MetadataRoute.Sitemap {
  if (locales.length === 0) return [];
  const alternates = sitemapAlternates(path, locales);
  return locales.map((locale) => ({
    url: absoluteUrl(locale, path),
    lastModified: lastModified ? new Date(lastModified) : undefined,
    alternates,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages, projects] = await Promise.all([
    client.fetch<LocaleIndexRow[]>(postLocaleIndexQuery).catch(() => []),
    client.fetch<LocaleIndexRow[]>(pageLocaleIndexQuery).catch(() => []),
    client.fetch<LocaleIndexRow[]>(projectLocaleIndexQuery).catch(() => []),
  ]);

  const out: MetadataRoute.Sitemap = [];

  // Static routes. These are genuinely translated in all four locales, so the
  // full cluster is correct here.
  out.push(...entriesFor("/", LOCALES, undefined, 1));
  out.push(...entriesFor("/services", LOCALES, undefined, 0.8));
  for (const slug of SERVICE_SLUGS) {
    out.push(...entriesFor(`/services/${slug}`, LOCALES, undefined, 0.8));
  }
  out.push(...entriesFor("/projects", LOCALES, undefined, 0.6));
  out.push(...entriesFor("/blog", LOCALES, undefined, 0.6));

  // Guides are English only, so a single locale and no hreflang cluster.
  // Priority above the posts they hub, because the hub is what should rank.
  for (const slug of PILLAR_SLUGS) {
    out.push(...entriesFor(`/guides/${slug}`, ["en"], undefined, 0.7));
  }
  out.push(...entriesFor("/guides", ["en"], undefined, 0.6));

  // Areas and contact are the local SEO spine.
  //
  // A sitemap is a request to index. A noindex tag is an instruction not to.
  // Sending both for the same URL is not a tie the page wins, it is a
  // contradiction, and Search Console reports it as "Submitted URL marked
  // noindex". This file used to list every area page and About regardless,
  // on the reasoning that the page level tag took precedence. It does decide
  // the outcome, but the error is still raised and it still costs crawl budget
  // on URLs we have asked not to be indexed.
  //
  // So the readiness gates are read here too, and the rule is one way: nothing
  // enters the sitemap while it is noindexed. Both gates live in libraries
  // precisely so this file and the routes cannot drift apart again. Answer an
  // area page's input blocks, or write the About story, and the URL appears
  // here on the next build with no further change.
  out.push(...entriesFor("/areas", ["en"], undefined, 0.8));
  for (const slug of AREA_SLUGS) {
    const area = getArea(slug);
    if (!area || !areaIsComplete(area)) continue;
    out.push(...entriesFor(`/areas/${slug}`, ["en"], undefined, 0.8));
  }
  out.push(...entriesFor("/contact", ["en"], undefined, 0.7));
  if (STORY_IS_WRITTEN) {
    out.push(...entriesFor("/about", ["en"], undefined, 0.5));
  }

  // Tools convert at the moment the reader gets their number, so they are
  // worth more than the traffic they pull.
  out.push(...entriesFor("/tools", ["en"], undefined, 0.7));
  for (const slug of TOOL_SLUGS) {
    out.push(...entriesFor(`/tools/${slug}`, ["en"], undefined, 0.7));
  }

  // CMS content. Only the locales that actually have a body.
  // Must match RESERVED in the flexible [slug] route exactly. If the sitemap
  // advertises a URL the route no longer generates, Google finds a 404 inside
  // an hreflang cluster and discards the cluster.
  const reserved = new Set([
    "about",
    "areas",
    "blog",
    "contact",
    "guides",
    "tools",
    "projects",
    "services",
    ...SERVICE_SLUGS,
  ]);

  const fromSanity = new Set<string>();
  for (const p of posts) {
    fromSanity.add(p.slug);
    out.push(...entriesFor(`/blog/${p.slug}`, p.locales ?? [], p.updatedAt, 0.5));
  }

  /**
   * Posts written as markdown in the repo.
   *
   * These were missing entirely. The sitemap listed the /blog index and then
   * nothing under it, so thirteen finished articles were declared nowhere,
   * while the same articles were linked from the homepage and the guides hub.
   *
   * English only, because that is the only locale the route generates for
   * them, and only once a post carries no review markers: an unfinished post
   * is served noindex, and advertising a noindex URL in a sitemap is a
   * contradiction Google reports as an error.
   *
   * lastModified is the date the sources were last checked, which is the only
   * honest modification date the file carries.
   */
  for (const p of getAllPosts()) {
    if (!p.isReady || fromSanity.has(p.slug)) continue;
    const checked = displayDate(p.sourcesCheckedOn);
    out.push(...entriesFor(`/blog/${p.slug}`, ["en"], checked ?? undefined, 0.5));
  }
  for (const p of projects) {
    out.push(...entriesFor(`/projects/${p.slug}`, p.locales ?? [], p.updatedAt, 0.5));
  }
  for (const p of pages) {
    // The flexible [slug] route does not own the reserved section prefixes.
    if (reserved.has(p.slug)) continue;
    out.push(...entriesFor(`/${p.slug}`, p.locales ?? [], p.updatedAt, 0.4));
  }

  return out;
}

// Guard against the locale list and the routing config drifting apart.
if (LOCALES.length !== routing.locales.length) {
  throw new Error(
    "LOCALES in i18n-content and routing.locales disagree. The sitemap, the " +
      "canonicals and the generated routes must all use the same list.",
  );
}
