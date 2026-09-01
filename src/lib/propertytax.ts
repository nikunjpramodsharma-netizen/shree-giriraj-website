/**
 * BMC property tax, Mumbai.
 *
 * THE FORMULA, capital value system, in use since 2015
 *
 *   Capital Value = Ready Reckoner rate
 *                 x Carpet area
 *                 x Construction type weight
 *                 x Age weight
 *                 x User category weight
 *
 *   Property Tax  = Applicable tax rate x Capital Value
 *
 * WHAT IS VERIFIED AND WHAT IS NOT
 *
 * The structure and the weights below were checked on 1 September 2026 and are
 * consistent across sources.
 *
 * The APPLICABLE TAX RATE is not. It varies by ward and user category under
 * Schedule A, and I could not confirm a figure I would be willing to publish.
 * So it is an input, taken from the reader's own bill, and the page says why.
 * Everything else is computed exactly.
 *
 * THE PART THAT ACTUALLY MATTERS
 *
 * Residential flats of 500 sq ft carpet or less have been fully exempt since
 * 1 January 2022. In Borivali, Kandivali and Malad a great many flats fall
 * under that line and plenty of owners do not know it. The check needs no tax
 * rate at all, which is why the tool leads with it.
 *
 * The 500 to 700 band is a separate matter and is NOT applied. See below.
 */

export const PT_VERIFIED_ON = "2026-09-01";

export const PT_SOURCES: { label: string; url: string }[] = [
  {
    label: "Department of Registration and Stamps, ready reckoner (e-ASR)",
    url: "https://igrmaharashtra.gov.in/",
  },
  {
    label: "ClearTax, property tax in Mumbai",
    url: "https://cleartax.in/s/property-tax-mumbai",
  },
  {
    label: "HomeFirst India, BMC Mumbai property tax",
    url: "https://homefirstindia.com/blog/article/bmc-mumbai-property-tax",
  },
];

export const EXEMPT_UPTO_SQFT = 500;

/**
 * THE 500 TO 700 BAND IS NOT CONFIRMED.
 *
 * One secondary source said flats in this band "may receive" a 60 percent
 * concession. A dedicated search for it found nothing, and every source that
 * describes the relief in detail describes only the 500 sq ft exemption.
 *
 * So it is NOT applied to the computed tax. Telling somebody their bill should
 * be 60 percent lower on a single hedged source could have them disputing a
 * correct bill, which is worse than saying nothing. The band is still surfaced,
 * as something to ask the ward office about, which is honest and still useful.
 *
 * Set CONCESSION_VERIFIED to true only once it is confirmed against the BMC.
 */
export const CONCESSION_UPTO_SQFT = 700;
export const CONCESSION_PCT = 60;
export const CONCESSION_VERIFIED = false;

export type ConstructionType = "rcc" | "nonRcc" | "underConstruction";
export type AgeBand = "pre1945" | "y1945to1985" | "post1985";
export type UserCategory = "residential" | "commercial";

/** Weights, verified across sources. */
export const CONSTRUCTION_WEIGHT: Record<ConstructionType, number> = {
  rcc: 1,
  nonRcc: 0.6,
  underConstruction: 0.5,
};

export const AGE_WEIGHT: Record<AgeBand, number> = {
  pre1945: 0.8,
  y1945to1985: 0.9,
  post1985: 1,
};

export const CONSTRUCTION_LABEL: Record<ConstructionType, string> = {
  rcc: "RCC or bungalow",
  nonRcc: "Chawl or semi permanent",
  underConstruction: "Under construction or vacant",
};

export const AGE_LABEL: Record<AgeBand, string> = {
  pre1945: "Before 1945",
  y1945to1985: "1945 to 1985",
  post1985: "After 1985",
};

const r0 = (n: number) => Math.round(n);
const safe = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export type PtInput = {
  /** Carpet area in square feet. */
  carpetSqft: number;
  /** Ready reckoner rate per square foot for the locality. */
  reckonerRatePerSqft: number;
  construction: ConstructionType;
  age: AgeBand;
  user: UserCategory;
  /**
   * The rate applied to capital value, as a percentage, from your own bill.
   * Zero means not supplied, and the tool reports capital value only.
   */
  taxRatePct: number;
};

export type ExemptionStatus = "exempt" | "possibleConcession" | "none";

export type PtResult = {
  capitalValue: number;
  constructionWeight: number;
  ageWeight: number;
  exemption: ExemptionStatus;
  /**
   * Applied to the tax. Zero for the 500 to 700 band while that concession is
   * unverified, so the figure shown is never lower than the bill might be.
   */
  concessionPct: number;
  /** Null when no tax rate was supplied. */
  taxBeforeRelief: number | null;
  taxPayable: number | null;
  hasTaxRate: boolean;
};

export function calculatePropertyTax(inp: PtInput): PtResult {
  const carpet = safe(inp.carpetSqft);
  const rate = safe(inp.reckonerRatePerSqft);
  const cw = CONSTRUCTION_WEIGHT[inp.construction];
  const aw = AGE_WEIGHT[inp.age];

  const capitalValue = r0(rate * carpet * cw * aw);

  // The size relief is residential only.
  let exemption: ExemptionStatus = "none";
  let concessionPct = 0;
  if (inp.user === "residential" && carpet > 0) {
    if (carpet <= EXEMPT_UPTO_SQFT) {
      exemption = "exempt";
      concessionPct = 100;
    } else if (carpet <= CONCESSION_UPTO_SQFT) {
      exemption = "possibleConcession";
      // Deliberately not discounted while unverified. See the note above.
      concessionPct = CONCESSION_VERIFIED ? CONCESSION_PCT : 0;
    }
  }

  const hasTaxRate = safe(inp.taxRatePct) > 0;
  if (!hasTaxRate) {
    return {
      capitalValue,
      constructionWeight: cw,
      ageWeight: aw,
      exemption,
      concessionPct,
      taxBeforeRelief: null,
      taxPayable: null,
      hasTaxRate: false,
    };
  }

  const taxBeforeRelief = r0((capitalValue * safe(inp.taxRatePct)) / 100);
  const taxPayable = r0(taxBeforeRelief * (1 - concessionPct / 100));

  return {
    capitalValue,
    constructionWeight: cw,
    ageWeight: aw,
    exemption,
    concessionPct,
    taxBeforeRelief,
    taxPayable,
    hasTaxRate: true,
  };
}
