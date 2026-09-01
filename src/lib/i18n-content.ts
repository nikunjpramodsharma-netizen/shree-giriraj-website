export type Locale = "en" | "hi" | "mr" | "gu";

export const LOCALES: Locale[] = ["en", "hi", "mr", "gu"];

export type LocalizedValue<T> = Partial<Record<Locale, T>>;

/**
 * For UI chrome and short metadata, where falling back to English is correct
 * and harmless. A translated nav around an English label is fine.
 *
 * Do NOT use this for page bodies. See getLocalizedBody below.
 */
export function getLocalizedField<T>(
  field: LocalizedValue<T> | null | undefined,
  locale: Locale,
  fallback: Locale = "en"
): T | undefined {
  if (!field) return undefined;
  return field[locale] ?? field[fallback];
}

/**
 * For page bodies. Deliberately does NOT fall back.
 *
 * The silent English fallback is the single biggest SEO risk in this codebase.
 * With four locales and English only content, falling back renders identical
 * English body text at four URLs with only the nav and footer translated.
 * Google treats that as duplicate content, and because the helpful content
 * system is site wide, thin locale pages drag down the strong English pages
 * too.
 *
 * Returning undefined lets the route call notFound(). A 404 is a clean signal.
 * A duplicate is a penalty.
 */
export function getLocalizedBody<T>(
  field: LocalizedValue<T> | null | undefined,
  locale: Locale
): T | undefined {
  if (!field) return undefined;
  const value = field[locale];
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  if (Array.isArray(value) && value.length === 0) return undefined;
  return value;
}

/**
 * Which locales this piece of content genuinely exists in.
 *
 * Drives two things that have to agree: which locale routes get generated, and
 * which hreflang entries get emitted. If they disagree, hreflang points at
 * 404s and Google discards the cluster.
 */
export function availableLocales<T>(
  field: LocalizedValue<T> | null | undefined
): Locale[] {
  return LOCALES.filter((l) => getLocalizedBody(field, l) !== undefined);
}
