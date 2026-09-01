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

/** Routes that must never be indexed. Kept in one place so robots and sitemap agree. */
export const NOINDEX_PREFIXES = ["/studio", "/lp/", "/api/"] as const;

/** The six service slugs are fixed and shared by the sitemap and the nav. */
export const SERVICE_SLUGS = [
  "resale-flats",
  "rentals",
  "new-project-bookings",
  "redevelopment",
  "shops-plots",
  "interiors",
] as const;
