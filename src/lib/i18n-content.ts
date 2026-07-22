export type Locale = "en" | "hi" | "mr" | "gu";

export type LocalizedValue<T> = Partial<Record<Locale, T>>;

export function getLocalizedField<T>(
  field: LocalizedValue<T> | null | undefined,
  locale: Locale,
  fallback: Locale = "en"
): T | undefined {
  if (!field) return undefined;
  return field[locale] ?? field[fallback];
}
