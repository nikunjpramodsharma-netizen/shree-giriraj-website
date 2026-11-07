import type { LocalizedValue } from "./i18n-content";

type Config = {
  type?: string;
  displayPrice?: string;
  note?: LocalizedValue<string>;
};

/** What stands in for a masked price. The owner keeps real prices off the site. */
export const PRICE_SHEET_TEXT = "Price sheet on WhatsApp";

/**
 * A price as the public should see it. A masked entry such as "From ₹2.** Cr"
 * says nothing and reads as a mistake, so it becomes a pointer to the price
 * sheet. A real base rate such as "₹41,000++ per sq.ft" passes through.
 */
export function publicPrice(price: string | undefined): string | undefined {
  if (!price) return price;
  return price.includes("*") ? PRICE_SHEET_TEXT : price;
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
