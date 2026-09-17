import { AREAS } from "@/lib/areas";
import { getAllPosts } from "@/lib/posts";
import { getRepoService } from "@/lib/service-content";
import { getTool } from "@/lib/tools";

/**
 * The web between the four kinds of page. A service points at the tools
 * that do its arithmetic, the suburbs it is done in and the articles that
 * go deeper; a suburb points back at the services and tools; a tool at the
 * services and suburbs it serves; an article at the service, tool and
 * suburb it is really about. Everything here resolves against the live
 * registries, so a link is only rendered when its target exists, and the
 * titles are never retyped.
 *
 * The hooks are the one line under each title. They say why the reader
 * would go there, not what the page is called.
 */

export type LinkKind = "service" | "area" | "tool" | "article";

export type LinkCard = {
  kind: LinkKind;
  href: string;
  title: string;
  hook: string;
  /** English only targets (tools, areas, articles) must bypass the locale Link. */
  englishOnly: boolean;
};

export type Interlinks = {
  services: LinkCard[];
  areas: LinkCard[];
  tools: LinkCard[];
  articles: LinkCard[];
};

const TOOL_HOOKS: Record<string, string> = {
  "home-loan-emi-calculator": "The EMI, and the full cost of the flat once duty, registration and interest are added.",
  "stamp-duty-calculator-mumbai": "Duty and registration on the agreement value or the ready reckoner, whichever is higher.",
  "carpet-area-calculator": "What the loading does to the price per square foot you are actually paying.",
  "hra-calculator-rent-receipts": "The HRA you can claim on this rent, and the receipts to go with it.",
  "interior-scope-builder": "Room by room, what needs doing, so the quote you get is for the right job.",
  "capital-gains-calculator-property": "The gain on a sale after indexation, and what a reinvestment would save.",
  "bmc-property-tax-calculator": "The annual property tax on a flat or a shop in the western suburbs.",
  "rental-yield-calculator": "What a flat earns as rent against what it costs to buy and hold.",
};

const AREA_HOOKS: Record<string, string> = {
  "borivali-west": "Pockets, asking rates, the metro and the National Park, with the rents by size.",
  kandivali: "Charkop, Mahavir Nagar and the Link Road towers, with what each costs to buy and rent.",
  malad: "Mindspace on one side, Marve on the other, and the rates in between.",
};

const SERVICE_HOOKS: Record<string, string> = {
  "resale-flats": "Buying or selling a flat that already exists, with the paperwork checked before the token.",
  rentals: "Flats and shops on leave and licence, with a deposit of two to three months, not more.",
  "new-project-bookings": "Booking in a launch with the RERA page read before the cheque is written.",
  "investment-advisory": "Which flat, in which pocket, for rent or for growth, with the arithmetic done first.",
  "commercial-plots": "Shops, offices and plots, where the tenant matters more than the view.",
  interiors: "A finished flat, scoped room by room and delivered on the date agreed.",
  "mhada-paperwork": "Transfer, sale and rent permissions for a MHADA flat, done in the right order.",
};

/** Per page recipes. Slugs only; titles come from the registries. */
const SERVICE_MAP: Record<string, { tools: string[]; articles: string[]; services: string[] }> = {
  "resale-flats": {
    tools: ["stamp-duty-calculator-mumbai", "carpet-area-calculator"],
    articles: ["stamp-duty-and-registration-charges-mumbai", "what-a-sale-deed-contains"],
    services: ["new-project-bookings", "investment-advisory"],
  },
  rentals: {
    tools: ["hra-calculator-rent-receipts", "rental-yield-calculator"],
    articles: ["rent-deposit-months-western-suburbs", "can-we-rent-mhada-flat"],
    services: ["resale-flats", "interiors"],
  },
  "new-project-bookings": {
    tools: ["home-loan-emi-calculator", "carpet-area-calculator"],
    articles: ["under-construction-vs-ready-to-move-flat", "occupancy-certificate"],
    services: ["resale-flats", "investment-advisory"],
  },
  "investment-advisory": {
    tools: ["rental-yield-calculator", "capital-gains-calculator-property"],
    articles: ["how-to-invest-in-real-estate-india", "best-area-to-invest-in-mumbai"],
    services: ["commercial-plots", "new-project-bookings"],
  },
  "commercial-plots": {
    tools: ["rental-yield-calculator", "bmc-property-tax-calculator"],
    articles: ["commercial-property-investment-mumbai", "ready-reckoner-rate-mumbai"],
    services: ["investment-advisory", "resale-flats"],
  },
  interiors: {
    tools: ["interior-scope-builder", "carpet-area-calculator"],
    articles: ["choosing-an-interior-designer-in-borivali", "carpet-area-vs-built-up-area"],
    services: ["resale-flats", "rentals"],
  },
  "mhada-paperwork": {
    tools: ["stamp-duty-calculator-mumbai", "capital-gains-calculator-property"],
    articles: ["how-to-buy-mhada-flat-in-resale", "can-we-sell-mhada-flat"],
    services: ["resale-flats", "rentals"],
  },
};

const AREA_RECIPE = {
  services: ["resale-flats", "rentals", "investment-advisory"],
  tools: ["stamp-duty-calculator-mumbai", "rental-yield-calculator", "home-loan-emi-calculator"],
  articles: ["best-area-to-invest-in-mumbai", "rental-yield-mumbai", "rent-deposit-months-western-suburbs"],
};

const TOOL_MAP: Record<string, { services: string[]; articles: string[] }> = {
  "home-loan-emi-calculator": {
    services: ["new-project-bookings", "resale-flats"],
    articles: ["under-construction-vs-ready-to-move-flat", "stamp-duty-and-registration-charges-mumbai"],
  },
  "stamp-duty-calculator-mumbai": {
    services: ["resale-flats", "mhada-paperwork"],
    articles: ["stamp-duty-and-registration-charges-mumbai", "ready-reckoner-rate-mumbai"],
  },
  "carpet-area-calculator": {
    services: ["new-project-bookings", "interiors"],
    articles: ["carpet-area-vs-built-up-area", "occupancy-certificate"],
  },
  "hra-calculator-rent-receipts": {
    services: ["rentals"],
    articles: ["rent-deposit-months-western-suburbs", "can-we-rent-mhada-flat"],
  },
  "interior-scope-builder": {
    services: ["interiors"],
    articles: ["choosing-an-interior-designer-in-borivali", "carpet-area-vs-built-up-area"],
  },
  "capital-gains-calculator-property": {
    services: ["resale-flats", "investment-advisory"],
    articles: ["what-a-sale-deed-contains", "index-2-property-document"],
  },
  "bmc-property-tax-calculator": {
    services: ["commercial-plots", "resale-flats"],
    articles: ["bmc-property-tax", "mutation-of-property"],
  },
  "rental-yield-calculator": {
    services: ["rentals", "investment-advisory"],
    articles: ["rental-yield-mumbai", "rental-income-property-mumbai"],
  },
};

const CATEGORY_MAP: Record<string, { services: string[]; tools: string[] }> = {
  Investing: { services: ["investment-advisory", "commercial-plots"], tools: ["rental-yield-calculator", "capital-gains-calculator-property"] },
  Paperwork: { services: ["resale-flats", "mhada-paperwork"], tools: ["stamp-duty-calculator-mumbai", "bmc-property-tax-calculator"] },
  MHADA: { services: ["mhada-paperwork", "resale-flats"], tools: ["stamp-duty-calculator-mumbai", "capital-gains-calculator-property"] },
  Buying: { services: ["resale-flats", "new-project-bookings"], tools: ["carpet-area-calculator", "home-loan-emi-calculator"] },
  Interiors: { services: ["interiors"], tools: ["interior-scope-builder", "carpet-area-calculator"] },
  Renting: { services: ["rentals"], tools: ["hra-calculator-rent-receipts", "rental-yield-calculator"] },
};

/** Where an article has an obvious tool of its own, it goes first. */
const ARTICLE_TOOL: Record<string, string> = {
  "stamp-duty-and-registration-charges-mumbai": "stamp-duty-calculator-mumbai",
  "ready-reckoner-rate-mumbai": "stamp-duty-calculator-mumbai",
  "carpet-area-vs-built-up-area": "carpet-area-calculator",
  "bmc-property-tax": "bmc-property-tax-calculator",
  "rental-yield-mumbai": "rental-yield-calculator",
  "rental-income-property-mumbai": "rental-yield-calculator",
  "rent-deposit-months-western-suburbs": "hra-calculator-rent-receipts",
  "choosing-an-interior-designer-in-borivali": "interior-scope-builder",
  "under-construction-vs-ready-to-move-flat": "home-loan-emi-calculator",
  "how-to-invest-in-real-estate-india": "rental-yield-calculator",
  "reit-vs-buying-a-flat-india": "rental-yield-calculator",
  "what-a-sale-deed-contains": "capital-gains-calculator-property",
};

function uniq(xs: string[]): string[] {
  return xs.filter((x, i) => xs.indexOf(x) === i);
}

function toolCards(slugs: string[]): LinkCard[] {
  return uniq(slugs)
    .map((s) => getTool(s))
    .filter((t): t is NonNullable<typeof t> => !!t)
    .map((t) => ({
      kind: "tool" as const,
      href: `/tools/${t.slug}`,
      title: t.title,
      hook: TOOL_HOOKS[t.slug] ?? t.answer,
      englishOnly: true,
    }));
}

function areaCards(except?: string): LinkCard[] {
  return AREAS.filter((a) => a.slug !== except).map((a) => ({
    kind: "area" as const,
    href: `/areas/${a.slug}`,
    title: `${a.longName} West`,
    hook: AREA_HOOKS[a.slug] ?? "",
    englishOnly: true,
  }));
}

function serviceCards(slugs: string[], locale: string): LinkCard[] {
  return uniq(slugs)
    .map((s) => ({ slug: s, svc: getRepoService(s, locale) }))
    .filter((x): x is { slug: string; svc: NonNullable<ReturnType<typeof getRepoService>> } => !!x.svc)
    .map(({ slug, svc }) => ({
      kind: "service" as const,
      href: `/services/${slug}`,
      title: svc.heroHeading,
      hook: SERVICE_HOOKS[slug] ?? svc.heroSubheading,
      englishOnly: false,
    }));
}

function articleCards(slugs: string[]): LinkCard[] {
  const all = getAllPosts();
  return uniq(slugs)
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({
      kind: "article" as const,
      href: `/blog/${p.slug}`,
      title: p.title,
      hook: p.answer ?? "",
      englishOnly: true,
    }));
}

export function interlinksForService(slug: string, locale: string): Interlinks {
  const r = SERVICE_MAP[slug] ?? { tools: [], articles: [], services: [] };
  return {
    tools: toolCards(r.tools),
    areas: areaCards(),
    articles: articleCards(r.articles),
    services: serviceCards(r.services, locale),
  };
}

export function interlinksForArea(slug: string, locale: string): Interlinks {
  return {
    services: serviceCards(AREA_RECIPE.services, locale),
    tools: toolCards(AREA_RECIPE.tools),
    articles: articleCards(AREA_RECIPE.articles),
    areas: areaCards(slug),
  };
}

export function interlinksForTool(slug: string, locale: string): Interlinks {
  const r = TOOL_MAP[slug] ?? { services: [], articles: [] };
  return {
    services: serviceCards(r.services, locale),
    areas: areaCards(),
    articles: articleCards(r.articles),
    tools: [],
  };
}

export function interlinksForArticle(post: { slug: string; category?: string }, locale: string): Interlinks {
  const r = CATEGORY_MAP[post.category ?? ""] ?? { services: [], tools: [] };
  const own = ARTICLE_TOOL[post.slug];
  return {
    services: serviceCards(r.services, locale),
    tools: toolCards([...(own ? [own] : []), ...r.tools]).slice(0, 2),
    areas: areaCards(),
    articles: [],
  };
}
