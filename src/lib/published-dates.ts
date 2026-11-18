import { displayDate, type Post } from "@/lib/posts";
import { isoDate } from "@/lib/schema";

/**
 * First publication date of each markdown article, frozen.
 *
 * The articles carry two dates in their frontmatter, updatedOn and
 * sourcesCheckedOn, and no publish date. datePublished used to be read from
 * sourcesCheckedOn, so every time the sources were re-read the article's
 * publish date jumped forward, and on a re-check without a copy edit it
 * landed after dateModified, which is contradictory markup. These are the
 * datePublished values the live site carried on 16 November 2026, before
 * that audit's source checks, and they no longer move.
 *
 * A new article needs no entry: it falls back to the earlier of its two
 * dates, which is right on the day it goes live. Add it here afterwards to
 * freeze it.
 */
export const PUBLISHED_ON: Record<string, string> = {
  "1-bhk-price-borivali-kandivali-malad": "2026-11-14",
  "2-bhk-interior-cost-mumbai": "2026-11-07",
  "best-area-to-invest-in-mumbai": "2026-09-08",
  "bmc-property-tax": "2026-09-08",
  "buy-first-flat-in-mumbai": "2026-11-14",
  "buy-flat-in-mumbai-from-abroad": "2026-11-14",
  "can-nri-buy-property-in-india": "2026-11-14",
  "can-we-rent-mhada-flat": "2026-09-09",
  "can-we-sell-mhada-flat": "2026-09-09",
  "carpet-area-vs-built-up-area": "2026-09-08",
  "choosing-an-interior-designer-in-borivali": "2026-09-08",
  "commercial-property-investment-mumbai": "2026-09-16",
  "conveyance-and-deemed-conveyance": "2026-09-08",
  "encumbrance-certificate": "2026-09-08",
  "first-investment-flat-small-budget-mumbai": "2026-11-14",
  "fractional-ownership-real-estate-india": "2026-09-16",
  "gift-deed-stamp-duty-maharashtra": "2026-11-07",
  "home-loan-on-mhada-flat": "2026-10-19",
  "how-to-buy-mhada-flat-in-resale": "2026-09-09",
  "how-to-invest-in-real-estate-india": "2026-09-16",
  "igr-maharashtra-explained": "2026-09-08",
  "index-2-property-document": "2026-09-08",
  "leave-and-licence-agreement-mumbai": "2026-11-07",
  "mhada-allotment-letter": "2026-10-19",
  "mhada-dues-lease-rent-property-tax": "2026-11-07",
  "mhada-flat-transfer": "2026-10-19",
  "mhada-lottery-2026-mumbai": "2026-11-07",
  "mhada-noc-online": "2026-10-03",
  "mhada-office-bandra": "2026-10-03",
  "mhada-redevelopment-rules": "2026-09-09",
  "mhada-transfer-on-death": "2026-09-09",
  "modular-kitchen-cost-mumbai": "2026-11-07",
  "mutation-of-property": "2026-09-08",
  "occupancy-certificate": "2026-09-08",
  "ready-reckoner-rate-mumbai": "2026-09-08",
  "redevelopment-borivali-kandivali": "2026-11-07",
  "rent-deposit-months-western-suburbs": "2026-09-08",
  "rent-or-buy-borivali-kandivali-malad": "2026-11-14",
  "rental-yield-mumbai": "2026-09-08",
  "property-rates-borivali-kandivali-malad": "2026-11-18",
  "sell-flat-in-mumbai": "2026-11-17",
  "society-noc-for-sale-of-flat-mumbai": "2026-11-07",
  "society-share-certificate-transfer-fee": "2026-11-07",
  "stamp-duty-and-registration-charges-mumbai": "2026-09-08",
  "tenant-police-verification-mumbai": "2026-11-07",
  "under-construction-vs-ready-to-move-flat": "2026-09-16",
  "what-a-sale-deed-contains": "2026-09-08",
  // Long form guides under /guides.
  "how-to-check-a-builder-rera-page": "2026-11-14",
  "new-projects-borivali-west": "2026-11-14",
  "stamp-duty-gst-under-construction-maharashtra": "2026-11-14",
};

/**
 * The two dates an article's markup and social tags carry, as ISO days.
 *
 * modified is the date the reader sees as "Updated" (updatedOn), falling back
 * to the sources check when the article has never been edited, so the markup
 * always matches the page. published is the frozen date above, or the earlier
 * of the two frontmatter dates, and is never later than modified.
 */
export function articleDates(post: Pick<Post, "slug" | "updatedOn" | "sourcesCheckedOn">): {
  published?: string;
  modified?: string;
} {
  const updated = isoDate(displayDate(post.updatedOn) ?? undefined);
  const checked = isoDate(displayDate(post.sourcesCheckedOn) ?? undefined);
  const modified = updated ?? checked;
  const known = [updated, checked].filter((d): d is string => !!d).sort();
  let published = PUBLISHED_ON[post.slug] ?? known[0];
  if (published && modified && published > modified) published = modified;
  return { published, modified };
}
