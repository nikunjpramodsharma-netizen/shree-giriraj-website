import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

/**
 * Canonical origin. Everything (canonicals, hreflang, sitemap, JSON-LD @id)
 * must agree on this exact string, protocol and host included. A mismatch
 * between any two of them makes Google discard the whole hreflang cluster.
 */
function resolveSiteUrl(): string {
  // An explicit value always wins. This is what production will set once a
  // domain exists.
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  // On Vercel with no domain yet, use the deployment's own hostname so a
  // preview self canonicalises instead of pointing every canonical, hreflang
  // entry and JSON-LD @id at a domain that does not exist. Both of these are
  // bare hostnames with no protocol.
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "https://www.shreegiriraj.in";
}

/**
 * NOTE ON THE FALLBACK: shreegiriraj.in is not registered yet, so the last
 * resort here is a domain that does not resolve. That is deliberate. It is the
 * agreed name, and the Vercel branches above mean a real deployment never has
 * to rely on it.
 */
export const SITE_URL = resolveSiteUrl().replace(/\/$/, "");

/**
 * `localePrefix` is "as-needed", so English lives at the root and the other
 * three are prefixed. Every URL builder has to respect that or the canonical
 * and the real URL drift apart.
 */
export function localePath(locale: string, path = "/"): string {
  const clean = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

export function absoluteUrl(locale: string, path = "/"): string {
  const p = localePath(locale, path);
  return `${SITE_URL}${p === "/" ? "" : p}` || SITE_URL;
}

/**
 * Build the canonical plus the hreflang set for one page.
 *
 * Three rules this exists to enforce, all of which are silent failures:
 *
 * 1. Every page self canonicalises. Never canonical across locales, which
 *    would suppress the non canonical locale entirely.
 * 2. The hreflang set MUST include a self referencing entry. Next does not add
 *    one for you, and without it Google ignores the entire cluster.
 * 3. hreflang is only emitted for locales that genuinely exist for this URL.
 *    Pointing at three URLs that 404 is worse than emitting nothing.
 *
 * Pass `availableLocales` for content that exists in fewer than all four, for
 * example an English only blog post, which should carry no hreflang at all.
 */
export function buildAlternates(
  locale: string,
  path = "/",
  availableLocales: readonly string[] = routing.locales,
): NonNullable<Metadata["alternates"]> {
  const canonical = absoluteUrl(locale, path);

  // A single locale means no cluster. Emitting a one entry set is noise.
  if (availableLocales.length < 2) return { canonical };

  const languages: Record<string, string> = {};
  for (const l of availableLocales) {
    languages[l] = absoluteUrl(l, path);
  }
  // x-default points at the default locale version of this same page.
  if (availableLocales.includes(routing.defaultLocale)) {
    languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  }

  return { canonical, languages };
}

/**
 * The default social card, used by every page that does not override it.
 *
 * A page with no og:image gets a bare grey box when it is pasted into
 * WhatsApp, which is how most of this business actually travels. The card is
 * a real Mumbai skyline under the site's own indigo wash with the name, the
 * three suburbs and the MahaRERA number on it, so a shared link is legible
 * even before anybody taps it.
 *
 * Relative on purpose. Next resolves it against metadataBase, which is the
 * same resolveSiteUrl above, so the card follows the site to its real domain
 * without an edit here.
 */
export const OG_IMAGE = {
  url: "/og/default.jpg",
  width: 1200,
  height: 630,
  alt: "Shree Giriraj Real Estate, resale, rentals and property investment advice in Borivali, Kandivali and Malad",
} as const;

/**
 * Canonical, hreflang and og:url from a single call.
 *
 * These three have to describe the same URL, and when they were assembled
 * separately og:url was simply forgotten on all sixteen page templates. Taking
 * one path argument and deriving all of it removes the chance of them
 * disagreeing.
 *
 * Spread it, do not nest it: `...pageUrls(locale, "/about", ["en"])`. A page
 * that wants its own social image should spread this first and then set its
 * own `openGraph`, merging in `url` from here.
 *
 * The default card is repeated here rather than left to the layout. Next does
 * not deep merge metadata: a page that sets `openGraph` at all replaces the
 * layout's whole object. So the first version of this helper, which returned
 * only `url`, silently removed the site card from every page that used it,
 * which was all of them. Carrying the image alongside the URL keeps the two
 * from being separable.
 */
export function pageUrls(
  locale: string,
  path = "/",
  availableLocales: readonly string[] = routing.locales,
): {
  alternates: NonNullable<Metadata["alternates"]>;
  openGraph: { url: string; images: (typeof OG_IMAGE)[] };
} {
  return {
    alternates: buildAlternates(locale, path, availableLocales),
    openGraph: { url: absoluteUrl(locale, path), images: [OG_IMAGE] },
  };
}

/** Sitemap entries need the same alternates, in the shape Next's sitemap wants. */
export function sitemapAlternates(
  path = "/",
  availableLocales: readonly string[] = routing.locales,
): { languages: Record<string, string> } | undefined {
  if (availableLocales.length < 2) return undefined;
  const languages: Record<string, string> = {};
  for (const l of availableLocales) {
    languages[l] = absoluteUrl(l, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return { languages };
}

/**
 * Sections that exist in English only. A link to one of these from a page
 * rendered under /hi, /mr or /gu must NOT carry the locale prefix, because
 * /hi/tools/... is not a route and returns 404.
 *
 * Found the hard way: the repo backed service pages render in all four
 * locales, their markdown bodies link to the rental yield calculator, and the
 * locale aware Link dutifully produced three dead URLs. The crawler caught it,
 * not the diff.
 */
export const ENGLISH_ONLY_PREFIXES = ["/tools", "/guides", "/blog", "/areas", "/about", "/contact"] as const;

export function isEnglishOnlyPath(path: string): boolean {
  return ENGLISH_ONLY_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

/** Routes that must never be indexed. Kept in one place so robots and sitemap agree. */
export const NOINDEX_PREFIXES = ["/studio", "/lp/", "/api/"] as const;

/** The seven service slugs are fixed and shared by the sitemap and the nav. */
export const SERVICE_SLUGS = [
  "resale-flats",
  "rentals",
  "new-project-bookings",
  "investment-advisory",
  "commercial-plots",
  "interiors",
  "mhada-paperwork",
] as const;
