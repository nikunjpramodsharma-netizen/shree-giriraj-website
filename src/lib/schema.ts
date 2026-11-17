import { site } from "@/lib/config";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { FOUNDER } from "@/lib/about";

/**
 * JSON-LD builders.
 *
 * Three rules, all of which exist to keep this from becoming a liability:
 *
 * 1. ACCURACY FIRST. Only mark up what is visibly on the page. Structured data
 *    that does not match the rendered content is a policy violation, not a
 *    shortcut.
 * 2. NEVER emit aggregateRating or Review for the business itself. Self serving
 *    review markup for LocalBusiness is disallowed by Google, and there is no
 *    verified review corpus anyway. The Google Business Profile rating already
 *    surfaces in the local pack; duplicating it here gains nothing and risks a
 *    manual action.
 * 3. OMIT RATHER THAN INVENT. A missing property is always safer than a
 *    plausible wrong one. priceRange is absent below for exactly that reason.
 */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const FOUNDER_ID = `${SITE_URL}/about#founder`;

/**
 * Where the firm works, as answer engines should read it. Flat finding is
 * Borivali, Kandivali and Malad; MHADA paperwork is filed with the one Mumbai
 * Board and is taken on for a flat anywhere in Mumbai (owner, 3 October
 * 2026), so the city itself is in the list too.
 */
const MUMBAI = {
  "@type": "City",
  name: "Mumbai",
  containedInPlace: { "@type": "State", name: "Maharashtra" },
};
const CORE_PLACES = ["Borivali West", "Borivali East", "Kandivali", "Malad"].map((name) => ({
  "@type": "Place",
  name: `${name}, Mumbai`,
  containedInPlace: { "@type": "City", name: "Mumbai" },
}));

/**
 * The subjects the firm is a source on, for knowsAbout. Each one is a
 * service it sells or a topic the articles on this site cover in depth.
 */
const KNOWS_ABOUT = [
  "Resale flats in Borivali, Kandivali and Malad",
  "Selling a flat in Mumbai",
  "Flat rentals and leave and licence agreements in Mumbai",
  "New project bookings and MahaRERA project checks",
  "Property investment in the western suburbs of Mumbai",
  "Commercial property and plots",
  "Home interiors and civil work",
  "MHADA flat transfer, NOCs and paperwork in Mumbai",
  "Stamp duty and registration in Maharashtra",
  "Society share certificates and NOCs for sale",
];

/**
 * A compact reference to the business for nodes on pages that do not carry
 * the full organization node (articles, tools). A bare @id only resolves when
 * the same page defines it, so the name, URL and logo travel with it: that is
 * what Google reads for an article's publisher.
 */
export function organizationRef(): Json {
  return {
    "@type": "RealEstateAgent",
    "@id": ORG_ID,
    name: site.name,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
  };
}

type Json = Record<string, unknown>;

/**
 * The business. RealEstateAgent is a subtype of LocalBusiness, so this
 * satisfies both without emitting two overlapping nodes.
 */
export function organizationNode(opts: { founder?: string } = {}): Json {
  return {
    "@type": "RealEstateAgent",
    "@id": ORG_ID,
    name: site.name,
    url: SITE_URL,
    description:
      "Real estate agency in Borivali West, Mumbai, in real estate since 1996 and at this office since 2005. Resale flats to buy and sell, rentals, new project bookings, investment advisory, commercial property and plots, and interiors in Borivali, Kandivali and Malad, plus MHADA paperwork anywhere in Mumbai.",
    image: `${SITE_URL}/logo.png`,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    telephone: site.phonePrimary,
    email: site.email,
    // Both numbers as contact points. The first is also the WhatsApp line,
    // which is how most enquiries arrive.
    contactPoint: [
      { "@type": "ContactPoint", contactType: "sales", telephone: site.phonePrimary, areaServed: "IN" },
      { "@type": "ContactPoint", contactType: "customer service", telephone: site.phoneSecondary, areaServed: "IN" },
    ],
    // In real estate since 1996. The Borivali West office dates from 2005,
    // which the description says; this field never implies the shop is older.
    foundingDate: site.established,
    // Confirmed by the owner. Always emitted: the founder is the entity an
    // answer engine ties the business to, on every page that carries it.
    founder: {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: opts.founder ?? FOUNDER.name,
      jobTitle: FOUNDER.role,
    },
    // Concatenated, these read exactly as the master NAP in config.ts:
    // Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092.
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400092",
      addressCountry: "IN",
    },
    // The pin of the Google Business Profile listing, read from Google Maps
    // on 18 September 2026 at the owner's request.
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.2199038,
      longitude: 72.8366379,
    },
    hasMap: "https://www.google.com/maps/place/?cid=5587711998336126142",
    areaServed: [...CORE_PLACES, MUMBAI],
    knowsAbout: KNOWS_ABOUT,
    identifier: {
      "@type": "PropertyValue",
      // The firm's own MahaRERA registration, not a project one. Public
      // wording always presents the firm as an agency (owner's rule, 20 Oct 2026).
      name: "MahaRERA Registration",
      value: site.rera,
    },
    // Confirmed by the owner on 16 September 2026: 9 am to 9 pm, all seven
    // days. One specification covering the week, because that is the truth
    // and Google reads it the same as seven identical rows.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    // The profiles Google already trusts, so it can tie this site to them.
    // Only URLs that were opened and matched on the name plus the Chikoowadi
    // address or one of the phone numbers; see SAME_AS in config.ts.
    ...(site.sameAs.length > 0 ? { sameAs: site.sameAs } : {}),
    // DELIBERATELY ABSENT until the Google Business Profile supplies real values:
    //   priceRange                would be invented; there is no published one
    //   aggregateRating           see rule 2 above. Never add this.
  };
}

export function websiteNode(locale: string): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: site.name,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbNode(
  locale: string,
  trail: { name: string; path: string }[],
): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(locale, c.path),
    })),
  };
}

/**
 * Only pass questions that are actually rendered on the page. If the visible
 * FAQ is collapsed behind an accordion that is fine; if it is not on the page
 * at all, it must not be in the markup.
 */
export function faqNode(qa: { question: string; answer: string }[]): Json | null {
  const clean = qa.filter((x) => x.question?.trim() && x.answer?.trim());
  if (clean.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: clean.map((x) => ({
      "@type": "Question",
      name: x.question,
      acceptedAnswer: { "@type": "Answer", text: x.answer },
    })),
  };
}

export function webApplicationNode(opts: {
  locale: string;
  name: string;
  path: string;
  category: "FinanceApplication" | "UtilitiesApplication";
}): Json {
  return {
    "@type": "WebApplication",
    name: opts.name,
    url: absoluteUrl(opts.locale, opts.path),
    applicationCategory: opts.category,
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    provider: organizationRef(),
  };
}

const place = (name: string) => ({
  "@type": "Place",
  name: `${name}, Mumbai`,
  containedInPlace: { "@type": "City", name: "Mumbai" },
});

/**
 * What each service is, in the words its page uses, and where it is offered.
 * MHADA paperwork is filed with the one Mumbai Board whatever the suburb, so
 * it is offered city wide (owner, 3 October 2026). Flat finding is Borivali
 * West, Kandivali and Malad; investment advisory names Borivali West and
 * East, Kandivali and Malad in its copy.
 */
const SERVICE_DEFAULTS: Record<string, { serviceType: string; areaServed: Json[] }> = {
  "resale-flats": {
    serviceType: "Buying and selling of resale flats",
    areaServed: ["Borivali West", "Kandivali", "Malad"].map(place),
  },
  rentals: {
    serviceType: "Flat rentals for tenants and owners, with leave and licence agreements",
    areaServed: ["Borivali West", "Kandivali", "Malad"].map(place),
  },
  "new-project-bookings": {
    serviceType: "New project flat bookings",
    areaServed: ["Borivali West", "Kandivali", "Malad"].map(place),
  },
  "investment-advisory": {
    serviceType: "Residential property investment advisory",
    areaServed: CORE_PLACES,
  },
  "commercial-plots": {
    serviceType: "Commercial property and plots, to buy or rent",
    areaServed: ["Borivali West", "Kandivali", "Malad"].map(place),
  },
  interiors: {
    serviceType: "Home interiors and civil work",
    areaServed: ["Borivali West", "Kandivali", "Malad"].map(place),
  },
  "mhada-paperwork": {
    serviceType: "MHADA flat transfer, NOC and paperwork",
    areaServed: [MUMBAI],
  },
};

export function serviceNode(opts: {
  locale: string;
  name: string;
  description?: string;
  slug: string;
  /** Overrides the default for the slug in SERVICE_DEFAULTS. */
  serviceType?: string;
  /** Place names in Mumbai, or "Mumbai" for the whole city. Overrides the default. */
  areaServed?: string[];
}): Json {
  const d = SERVICE_DEFAULTS[opts.slug];
  const areaServed = opts.areaServed
    ? opts.areaServed.map((n) => (n === "Mumbai" ? MUMBAI : place(n)))
    : d?.areaServed ?? CORE_PLACES;
  return {
    "@type": "Service",
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    serviceType: opts.serviceType ?? d?.serviceType ?? opts.name,
    provider: organizationRef(),
    areaServed,
    url: absoluteUrl(opts.locale, `/services/${opts.slug}`),
  };
}

/**
 * An area guide's subject: the suburb itself, inside Mumbai. Only the name,
 * the page and the description the page shows; no coordinates, because none
 * are published for a whole suburb and an invented pin is worse than none.
 */
export function placeNode(opts: {
  locale: string;
  name: string;
  path: string;
  description?: string;
}): Json {
  return {
    "@type": "Place",
    name: `${opts.name}, Mumbai`,
    url: absoluteUrl(opts.locale, opts.path),
    ...(opts.description ? { description: opts.description } : {}),
    containedInPlace: MUMBAI,
  };
}

/**
 * The flat finding service as it applies to one suburb, for the flats for
 * sale and flats for rent pages: what the agency does there, and who does it.
 * Not a listing or an offer, because the pages publish asking rates, not
 * flats with prices.
 */
export function localServiceNode(opts: {
  locale: string;
  name: string;
  path: string;
  place: string;
  description?: string;
}): Json {
  return {
    "@type": "Service",
    name: opts.name,
    serviceType: "Real estate agency",
    ...(opts.description ? { description: opts.description } : {}),
    url: absoluteUrl(opts.locale, opts.path),
    provider: organizationRef(),
    areaServed: {
      "@type": "Place",
      name: `${opts.place}, Mumbai`,
      containedInPlace: { "@type": "City", name: "Mumbai" },
    },
  };
}

/**
 * An item may carry its own locale, for a list entry served in English only
 * (Jaswanti Jewel on the hi, mr and gu project lists).
 */
export function itemListNode(
  locale: string,
  items: { name: string; path: string; locale?: string }[],
): Json {
  return {
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.locale ?? locale, it.path),
    })),
  };
}

/**
 * A project.
 *
 * NOTE: intentionally `Residence`, not `Product` with an `offers` block.
 * Pricing on this site is masked, and marking up a masked or approximate price
 * as an offer is inaccurate structured data. If real, current, unmasked prices
 * are ever published, Product/offers becomes appropriate. Not before.
 */
export function residenceNode(opts: {
  locale: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  location?: string;
  rera?: string;
}): Json {
  return {
    "@type": "Residence",
    name: opts.name,
    url: absoluteUrl(opts.locale, `/projects/${opts.slug}`),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.location
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: opts.location,
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          },
        }
      : {}),
    // The project's own MahaRERA number, when supplied. The agent registration
    // does not substitute for it on a page promoting a specific project.
    ...(opts.rera
      ? {
          identifier: {
            "@type": "PropertyValue",
            name: "MahaRERA Project Registration",
            value: opts.rera,
          },
        }
      : {}),
  };
}

/**
 * Schema.org dates must be ISO 8601. The posts carry human dates such as
 * "19 October 2026", which Google's validator rejects, so they are converted
 * here; anything that does not parse is dropped rather than emitted wrong.
 */
export function isoDate(v?: string): string | undefined {
  if (!v) return undefined;
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v;
  const d = new Date(`${v} 12:00 UTC`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export function blogPostingNode(opts: {
  locale: string;
  title: string;
  slug: string;
  /** Path of the article. Defaults to /blog/<slug>; guides pass /guides/<slug>. */
  path?: string;
  description?: string;
  image?: string;
  published?: string;
  modified?: string;
  authorName?: string;
  /** The author's role at the firm, as shown in the author box. */
  authorRole?: string;
  /** The sources listed visibly on the page, so the markup matches it. */
  citations?: string[];
}): Json {
  let published = isoDate(opts.published);
  const modified = isoDate(opts.modified) ?? published;
  // A publish date after the modified date is contradictory and Google then
  // trusts neither. The earlier one is never allowed to be the later.
  if (published && modified && published > modified) published = modified;
  const image = opts.image
    ? opts.image.startsWith("http") ? opts.image : `${SITE_URL}${opts.image}`
    : undefined;
  return {
    "@type": "BlogPosting",
    headline: opts.title,
    url: absoluteUrl(opts.locale, opts.path ?? `/blog/${opts.slug}`),
    mainEntityOfPage: absoluteUrl(opts.locale, opts.path ?? `/blog/${opts.slug}`),
    ...(opts.description ? { description: opts.description } : {}),
    ...(image ? { image } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    ...(opts.citations && opts.citations.length > 0 ? { citation: opts.citations } : {}),
    // Named authorship is an E-E-A-T signal and worth real weight in a YMYL
    // adjacent category. Falls back to the firm rather than inventing a person.
    author: opts.authorName
      ? {
          "@type": "Person",
          "@id": `${SITE_URL}/#author-${opts.authorName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          name: opts.authorName,
          ...(opts.authorRole ? { jobTitle: opts.authorRole } : {}),
          worksFor: organizationRef(),
        }
      : organizationRef(),
    publisher: organizationRef(),
    inLanguage: opts.locale,
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** Compose a page's nodes into one @graph. Cleaner than several script tags. */
export function graph(...nodes: (Json | null | undefined)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
