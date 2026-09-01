/**
 * Capital gains on the sale of a property.
 *
 * THE RULES, as they stand after 23 July 2024
 *
 * Property held for more than 24 months is a long term capital asset.
 *
 * On a transfer made on or after 23 July 2024, long term gains are taxed at
 * 12.5 percent WITHOUT indexation.
 *
 * A grandfathering applies where a resident individual or HUF acquired land or
 * building BEFORE 23 July 2024. They may choose whichever is lower: 12.5
 * percent without indexation, or 20 percent with indexation.
 *
 * Property held for 24 months or less is short term and taxed at slab rates,
 * which depend on total income, so this reports the gain and stops there
 * rather than guessing at a slab.
 *
 * WHY THE COST INFLATION INDEX IS AN INPUT AND NOT A TABLE
 *
 * The indexed option needs the CII for the year of purchase and the year of
 * sale. That is a published annual series of about twenty five values, and a
 * single wrong one produces a confidently wrong tax figure. They are not
 * hardcoded here. The tool asks for them and links to where they are
 * published, which keeps the arithmetic exact and the data the reader's own.
 *
 * Verified 1 September 2026. This is tax, so the page says to confirm with a
 * chartered accountant and does not pretend to be advice.
 */

export const CG_VERIFIED_ON = "2026-09-01";

export const CG_SOURCES: { label: string; url: string }[] = [
  {
    label: "Income Tax Department, tax on long term capital gains",
    url: "https://www.incometaxindia.gov.in/w/tax-on-long-term-capital-gains%E2%80%8B",
  },
  {
    label: "Income Tax Department, capital gains",
    url: "https://www.incometaxindia.gov.in/w/capital-gain",
  },
  {
    label: "ClearTax, long term capital gains rates and calculation",
    url: "https://cleartax.in/s/long-term-capital-gains-ltcg-tax",
  },
];

/** Property becomes long term after this many months. */
export const LONG_TERM_MONTHS = 24;
export const LTCG_RATE_NEW = 12.5;
export const LTCG_RATE_INDEXED = 20;
/** The date the regime changed. Acquisition before this can be grandfathered. */
export const REGIME_CHANGE = "2024-07-23";

const r0 = (n: number) => Math.round(n);
const safe = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export type CgInput = {
  purchasePrice: number;
  purchaseDate: string;
  salePrice: number;
  saleDate: string;
  /** Brokerage, legal fees and anything else spent on the transfer. */
  transferExpenses: number;
  /** Capital improvements, not repairs. */
  improvements: number;
  /** The grandfathered option is for resident individuals and HUFs. */
  isResidentIndividualOrHuf: boolean;
  /** Cost inflation index for the year of purchase and of sale. Optional. */
  ciiPurchase?: number;
  ciiSale?: number;
};

export type CgResult = {
  holdingMonths: number;
  isLongTerm: boolean;
  netCost: number;
  gain: number;
  /** Whether the grandfathered 20 percent with indexation option is available. */
  indexationAvailable: boolean;
  /** True when indexation is available but the CII figures were not supplied. */
  indexationNeedsCii: boolean;
  indexedCost: number | null;
  indexedGain: number | null;
  taxNoIndexation: number | null;
  taxWithIndexation: number | null;
  /** The cheaper of the two, when both are computable. */
  bestOption: "noIndexation" | "withIndexation" | null;
  taxPayable: number | null;
  saving: number;
};

function monthsBetween(a: string, b: string): number {
  const d1 = new Date(a);
  const d2 = new Date(b);
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return 0;
  let m =
    (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  if (d2.getDate() < d1.getDate()) m -= 1;
  return Math.max(0, m);
}

export function calculateCapitalGains(inp: CgInput): CgResult {
  const purchase = safe(inp.purchasePrice);
  const sale = safe(inp.salePrice);
  const expenses = safe(inp.transferExpenses);
  const improvements = safe(inp.improvements);

  const holdingMonths = monthsBetween(inp.purchaseDate, inp.saleDate);
  const isLongTerm = holdingMonths > LONG_TERM_MONTHS;

  const netCost = r0(purchase + expenses + improvements);
  const gain = r0(sale - netCost);

  // Short term: slab rates, which depend on total income. Not guessed at.
  if (!isLongTerm) {
    return {
      holdingMonths,
      isLongTerm: false,
      netCost,
      gain,
      indexationAvailable: false,
      indexationNeedsCii: false,
      indexedCost: null,
      indexedGain: null,
      taxNoIndexation: null,
      taxWithIndexation: null,
      bestOption: null,
      taxPayable: null,
      saving: 0,
    };
  }

  const acquiredBeforeChange =
    new Date(inp.purchaseDate).getTime() < new Date(REGIME_CHANGE).getTime();
  const indexationAvailable =
    acquiredBeforeChange && inp.isResidentIndividualOrHuf;

  const taxableGain = Math.max(0, gain);
  const taxNoIndexation = r0((taxableGain * LTCG_RATE_NEW) / 100);

  const cp = safe(inp.ciiPurchase ?? 0);
  const cs = safe(inp.ciiSale ?? 0);
  const haveCii = cp > 0 && cs > 0;

  let indexedCost: number | null = null;
  let indexedGain: number | null = null;
  let taxWithIndexation: number | null = null;

  if (indexationAvailable && haveCii) {
    // Only the acquisition cost and improvements are indexed. Transfer
    // expenses are deducted as spent, not indexed.
    indexedCost = r0(((purchase + improvements) * cs) / cp + expenses);
    indexedGain = r0(sale - indexedCost);
    taxWithIndexation = r0((Math.max(0, indexedGain) * LTCG_RATE_INDEXED) / 100);
  }

  let bestOption: CgResult["bestOption"] = "noIndexation";
  let taxPayable = taxNoIndexation;
  if (taxWithIndexation !== null && taxWithIndexation < taxNoIndexation) {
    bestOption = "withIndexation";
    taxPayable = taxWithIndexation;
  }

  return {
    holdingMonths,
    isLongTerm: true,
    netCost,
    gain,
    indexationAvailable,
    indexationNeedsCii: indexationAvailable && !haveCii,
    indexedCost,
    indexedGain,
    taxNoIndexation,
    taxWithIndexation,
    bestOption,
    taxPayable,
    saving:
      taxWithIndexation !== null
        ? Math.abs(taxNoIndexation - taxWithIndexation)
        : 0,
  };
}

/**
 * Reliefs worth knowing about. Deliberately listed rather than computed: each
 * carries conditions and time limits that a calculator would misrepresent.
 */
export const CG_RELIEFS = [
  {
    section: "Section 54",
    what: "Reinvesting the gain in another residential property, within the prescribed time limits.",
  },
  {
    section: "Section 54EC",
    what: "Investing the gain in specified bonds within six months, subject to a cap.",
  },
  {
    section: "Capital Gains Account Scheme",
    what: "Parking the gain in a designated account if you cannot reinvest before the filing due date.",
  },
];
