/**
 * Everything on the site that is waiting on a real answer.
 *
 * This is the source of truth for the generated list at content/PLACEHOLDERS.md.
 * Add an entry here the moment something is stubbed, rather than leaving a
 * comment in a file nobody will find again.
 *
 * status:
 *   blocked   nothing can render or ship until this exists
 *   hidden    the feature is built and deliberately switched off until answered
 *   wrong     something is live right now and is inaccurate or placeholder
 *   cosmetic  it works and looks fine, this would make it better
 */

export const FILLS = [
  // ---------------------------------------------------------------- blocked
  {
    id: "resend-api-key",
    area: "Technical",
    status: "blocked",
    ask: "A Resend API key, added to .env.local as RESEND_API_KEY, and the inbox enquiries should land in.",
    why: "The enquiry form emails through Resend and nothing else. Without the key /api/lead returns a 503 and every enquiry sent through the site is lost; only WhatsApp works. Now that the copy is written to produce leads, this is the single biggest blocker on the site.",
    where: ["src/app/api/lead/route.ts", ".env.local"],
  },
  {
    id: "sanity-write-token",
    area: "Technical",
    status: "hidden",
    ask: "A Sanity API write token, added to .env.local as SANITY_API_WRITE_TOKEN.",
    why: "Not needed for enquiries, which go by email. It is needed to edit the five service pages, the homepage FAQs and the projects that live in Sanity, and to move finished posts into the Studio. Three service pages and all the posts were built in the repo instead, which works but is not editable in the Studio. The resale page still says 'for nearly 30 years', which cannot be changed without it.",
    where: ["src/lib/service-content.ts", ".env.local"],
  },

  // ---------------------------------------------------------------- wrong
  {
    id: "site-url",
    area: "Technical",
    status: "wrong",
    ask: "Confirmation that the live domain is shreegiriraj.in, and that .in is what NEXT_PUBLIC_SITE_URL should be.",
    why: "The domain is not registered yet and every canonical, hreflang entry and og:url currently resolves to localhost. The code falls back to https://www.shreegiriraj.in, so the www versus apex choice must match whatever is bought, or canonicals, hreflang, sitemap and JSON-LD will disagree with the real URL and Google discards the cluster.",
    where: ["src/lib/seo.ts", ".env.local"],
  },

  // ---------------------------------------------------------------- hidden
  {
    id: "testimonials",
    area: "Homepage",
    status: "hidden",
    ask: "Twelve more reviews to fill the rail: each with the client's words, first name, suburb, and what they bought, sold, rented or did with you. Three Google reviews are already on it.",
    why: "The rail carries the three text reviews from the Google profile, quoted exactly and linked to it, and twelve labelled placeholders (testimonials.ts). The rating link reads 5.0 from 5 reviews, as the profile showed on 15 September 2026.",
    where: ["src/lib/testimonials.ts"],
  },


  // ---------------------------------------------------------------- schema
  {
    id: "geo-coordinates",
    area: "Local SEO",
    status: "cosmetic",
    ask: "The exact latitude and longitude of the shop, taken from your Google Business Profile listing.",
    why: "Omitted rather than approximated. A wrong pin is worse than no pin.",
    where: ["src/lib/schema.ts"],
  },

  // ---------------------------------------------------------------- content
  {
    id: "photography",
    area: "Imagery",
    status: "wrong",
    ask: "Real photographs: the office, the team, buildings and streets in Borivali, Kandivali and Malad, and any completed interiors work.",
    why: "Every image on the site is stock at the moment, including the homepage and all six blog category images. Stock is the fastest way to look like every other property site.",
    where: ["src/lib/blog.ts", "src/app/(site)/[locale]/page.tsx", "public/blog/"],
  },
  {
    id: "analytics-ids",
    area: "Technical",
    status: "blocked",
    ask: "The GA4 measurement ID and the Google Tag Manager container ID.",
    why: "Nothing is measured until these exist. No conversion tracking means the ad spend starting a week after launch would be flying blind.",
    where: ["plan/07-analytics-ga4.md"],
  },
];
