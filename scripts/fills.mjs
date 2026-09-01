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
    id: "sanity-write-token",
    area: "Technical",
    status: "blocked",
    ask: "A Sanity API write token, added to .env.local as SANITY_API_WRITE_TOKEN.",
    why: "Without it no blog post can be created and the enquiry form cannot save a lead. The form currently returns a 503 and the visitor is told to use WhatsApp. This is the single biggest blocker on the site.",
    where: ["src/app/api/lead/route.ts", ".env.local"],
  },
  {
    id: "author-document",
    area: "Blog",
    status: "blocked",
    ask: "One author: full name, role, a two or three line bio, and a photograph.",
    why: "The byline, the author box and the schema author field all stay hidden until an author exists. Content with no named author is weaker for both search and AI citation.",
    where: ["src/sanity/schemas/author.ts"],
  },
  {
    id: "about-page",
    area: "Site",
    status: "wrong",
    ask: "The story of the business for an About page: how it started in 1996, who runs it now, and what you want someone to feel after reading it.",
    why: "About is in the main navigation right now and it is a live 404. Every visitor who clicks it hits a dead end.",
    where: ["src/components/Nav.tsx"],
  },

  // ---------------------------------------------------------------- wrong
  {
    id: "team-names",
    area: "Homepage",
    status: "wrong",
    ask: "Three real names and roles for the team section, or a decision to cut the section.",
    why: "The entries currently read [ NAME ]. The section is gated off so nothing false ships, but the homepage is missing a trust block because of it.",
    where: ["src/lib/homepage-content.ts"],
  },
  {
    id: "site-url",
    area: "Technical",
    status: "wrong",
    ask: "Confirmation that the live domain is shreegiriraj.in, and that .in is what NEXT_PUBLIC_SITE_URL should be.",
    why: "The code still falls back to the .com if the variable is ever missing. Canonicals, hreflang, sitemap and JSON-LD all have to agree on one exact origin, and a mismatch makes Google discard the whole cluster.",
    where: ["src/lib/seo.ts", ".env.local"],
  },
  {
    id: "compare-section",
    area: "Homepage",
    status: "wrong",
    ask: "Your actual answer to the portals: what someone gets from you that 99acres and NoBroker cannot give them. Also whether you want to say anything about brokerage.",
    why: "That section still carries the old copy and does not answer the zero brokerage claim the portals lead with, which is the first objection a buyer arrives with.",
    where: ["src/app/(site)/[locale]/page.tsx"],
  },

  // ---------------------------------------------------------------- hidden
  {
    id: "consult-operations",
    area: "Consultation",
    status: "hidden",
    ask: "Who takes a paid consultation call, and whether the fee comes off the bill if the person later transacts with you. No price needed.",
    why: "The consultation band is built and switched off. These two answers, not a fee, are what it is actually waiting on.",
    where: ["src/lib/consult.ts"],
  },
  {
    id: "area-pages",
    area: "Areas",
    status: "hidden",
    ask: "For Borivali West, Borivali East, Kandivali and Malad: what each area is actually like, who buys there, and what you would warn someone about.",
    why: "The homepage area switcher has its links switched off because the four pages do not exist. These pages are the core of the local SEO plan and nobody else can write them.",
    where: ["src/lib/homepage-content.ts", "src/components/AreaSwitcher.tsx"],
  },
  {
    id: "testimonials",
    area: "Homepage",
    status: "hidden",
    ask: "Real client testimonials, with permission to publish and a real first name and area.",
    why: "Seeded placeholder testimonials are filtered out in code so they cannot ship, which means the homepage has no social proof at all.",
    where: ["src/app/(site)/[locale]/page.tsx"],
  },

  // ---------------------------------------------------------------- schema
  {
    id: "opening-hours",
    area: "Local SEO",
    status: "cosmetic",
    ask: "Your actual opening hours, including whether you work Sundays.",
    why: "Deliberately left out of the business markup rather than guessed. Hours are one of the things the local pack and AI answers quote most often.",
    where: ["src/lib/schema.ts"],
  },
  {
    id: "geo-coordinates",
    area: "Local SEO",
    status: "cosmetic",
    ask: "The exact latitude and longitude of the shop, taken from your Google Business Profile listing.",
    why: "Omitted rather than approximated. A wrong pin is worse than no pin.",
    where: ["src/lib/schema.ts"],
  },
  {
    id: "same-as-profiles",
    area: "Local SEO",
    status: "cosmetic",
    ask: "Links to every profile you own: Google Business Profile, Facebook, Instagram, JustDial, anything else.",
    why: "These connect the website to the profiles Google already trusts. Nothing is guessed, so the field is currently empty.",
    where: ["src/lib/schema.ts"],
  },

  // ---------------------------------------------------------------- content
  {
    id: "photography",
    area: "Imagery",
    status: "wrong",
    ask: "Real photographs: the shop, the team, buildings and streets in Borivali, Kandivali and Malad, and any completed interiors work.",
    why: "Every image on the site is stock at the moment, including the homepage and all six blog category images. Stock is the fastest way to look like every other property site.",
    where: ["src/lib/blog.ts", "src/app/(site)/[locale]/page.tsx", "public/blog/"],
  },
  {
    id: "jaswanti-jewel",
    area: "Projects",
    status: "cosmetic",
    ask: "For Jaswanti Jewel: the project MahaRERA number, and confirmation of what you can say about configurations and possession.",
    why: "Prices stay masked by decision. The project registration number is a credibility marker a serious buyer looks for.",
    where: ["src/sanity/schemas/project.ts"],
  },
  {
    id: "interiors-cost-bands",
    area: "Blog",
    status: "hidden",
    ask: "The real cost band for a 2 BHK interior fit out in these suburbs, at a basic and at a premium specification. Plus what advance percentage you consider reasonable.",
    why: "The interiors cluster is the highest value commercial position on the site. Without bands the posts say contact us, which is what every competing result already says. This is the one pricing question with direct revenue consequences.",
    where: ["content/drafts/choosing-an-interior-designer-in-borivali.md"],
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
