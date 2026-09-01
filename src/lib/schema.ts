import { site } from "@/lib/config";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

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
 *    plausible wrong one. geo, openingHours and priceRange are absent below
 *    for exactly that reason, each flagged with what would unblock it.
 */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

type Json = Record<string, unknown>;

/**
 * The business. RealEstateAgent is a subtype of LocalBusiness, so this
 * satisfies both without emitting two overlapping nodes.
 */
export function organizationNode(): Json {
  return {
    "@type": "RealEstateAgent",
    "@id": ORG_ID,
    name: site.name,
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    telephone: site.phonePrimary,
    email: site.email,
    foundingDate: site.established,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop No 11, Clover Grove CHS, Chikoowadi",
      addressLocality: "Borivali West",
      addressRegion: "Maharashtra",
      postalCode: "400092",
      addressCountry: "IN",
    },
    areaServed: site.areas.map((name) => ({
      "@type": "Place",
      name: `${name}, Mumbai`,
    })),
    identifier: {
      "@type": "PropertyValue",
      // Labelled precisely: this is the AGENT registration, not a project one.
      name: "MahaRERA Agent Registration",
      value: site.rera,
    },
    // DELIBERATELY ABSENT until the Google Business Profile supplies real values:
    //   geo                       needs verified latitude and longitude
    //   openingHoursSpecification needs confirmed hours, including Sundays
    //   sameAs                    needs the real GBP, Facebook, JustDial URLs
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

export function serviceNode(opts: {
  locale: string;
  name: string;
  description?: string;
  slug: string;
}): Json {
  return {
    "@type": "Service",
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    serviceType: opts.name,
    provider: { "@id": ORG_ID },
    areaServed: site.areas.map((n) => ({ "@type": "Place", name: `${n}, Mumbai` })),
    url: absoluteUrl(opts.locale, `/services/${opts.slug}`),
  };
}

export function itemListNode(
  locale: string,
  items: { name: string; path: string }[],
): Json {
  return {
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(locale, it.path),
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

export function blogPostingNode(opts: {
  locale: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  published?: string;
  modified?: string;
  authorName?: string;
}): Json {
  return {
    "@type": "BlogPosting",
    headline: opts.title,
    url: absoluteUrl(opts.locale, `/blog/${opts.slug}`),
    mainEntityOfPage: absoluteUrl(opts.locale, `/blog/${opts.slug}`),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.published ? { datePublished: opts.published } : {}),
    ...(opts.modified ? { dateModified: opts.modified } : {}),
    // Named authorship is an E-E-A-T signal and worth real weight in a YMYL
    // adjacent category. Falls back to the firm rather than inventing a person.
    author: opts.authorName
      ? { "@type": "Person", name: opts.authorName }
      : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: opts.locale,
  };
}

/** Compose a page's nodes into one @graph. Cleaner than several script tags. */
export function graph(...nodes: (Json | null | undefined)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
