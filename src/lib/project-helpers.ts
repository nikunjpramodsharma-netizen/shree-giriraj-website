import type { LocalizedValue } from "./i18n-content";

type Config = {
  type?: string;
  displayPrice?: string;
  note?: LocalizedValue<string>;
};

/**
 * A price as the public should see it. The owner keeps exact prices off the
 * site, so a masked entry such as "From ₹2.** Cr" becomes a rough
 * "From about ₹2 Cr", built only from the digits the mask leaves visible.
 * Exact sheets stay on WhatsApp. A real base rate such as
 * "₹41,000++ per sq.ft" passes through, and so does an exact figure.
 */
export function publicPrice(price: string | undefined): string | undefined {
  if (!price) return price;
  if (!price.includes("*")) return price;
  const m = price.match(/₹\s*(\d+)/);
  return m ? `From about ₹${m[1]} Cr` : price.replace(/\.?\*+/g, "").trim();
}

/**
 * Masked prices always follow the "₹<digit>.** Cr" pattern (e.g. "From ₹2.** Cr").
 * Parses the leading digit to pick the cheapest configuration for a project card.
 * Falls back to the first configuration if no price can be parsed.
 */
export function getLowestPriceConfig(
  configurations: Config[] | undefined
): Config | undefined {
  if (!configurations || configurations.length === 0) return undefined;

  let lowest: Config | undefined;
  let lowestValue = Infinity;

  for (const config of configurations) {
    const match = config.displayPrice?.match(/₹\s*([\d.]+)/);
    if (!match) continue;
    const value = parseFloat(match[1]);
    if (!Number.isNaN(value) && value < lowestValue) {
      lowestValue = value;
      lowest = config;
    }
  }

  return lowest ?? configurations[0];
}
