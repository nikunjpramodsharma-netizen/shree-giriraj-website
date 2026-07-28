import type { LocalizedValue } from "./i18n-content";

type Config = {
  type?: string;
  displayPrice?: string;
  note?: LocalizedValue<string>;
};

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
