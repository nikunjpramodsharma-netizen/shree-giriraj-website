import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * AI crawler access is deliberate, not incidental.
 *
 * Blocking GPTBot, PerplexityBot, ClaudeBot or Google-Extended means those
 * engines cannot cite this site at all. For a firm with no brand recognition
 * that is a pure loss, so they are all explicitly allowed. CCBot is left
 * allowed too: it feeds training rather than citation, and being in training
 * data is an asset here rather than a risk.
 *
 * `/studio` is the Sanity editor and must never be indexed. `/lp/` holds paid
 * landing pages, which exist to be measured rather than to rank, and keeping
 * them out of the index stops them competing with the service and area pages
 * for the same terms.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-SearchBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/lp/", "/api/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/studio", "/lp/", "/api/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
