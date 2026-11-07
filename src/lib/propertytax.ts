/**
 * BMC property tax, Mumbai.
 *
 * THE FORMULA, MCGM's own rules, in force since 1 April 2015
 *
 * Rule 21(2) of the Rules for Fixation of Capital Value 2015:
 *
 *   CV = BV x UC x NTB x AF x FF x CA
 *
 *   BV  = ready reckoner rate for the zone, rupees per square metre
 *   UC  = user category weight, Schedule A (residential user 0.50,
 *         commercial user 0.80)
 *   NTB = nature and type of building, Schedule B (RCC 1.00, pucca other
 *         than a chawl 0.70, semi permanent or kachha including chawl 0.50)
 *   AF  = age of the building, Schedule C (1.00 falling to 0.50)
 *   FF  = floor factor, Schedule D, for an RCC building with a lift only
 *   CA  = carpet area, square metres
 *
 *   Property tax = CV x the rate table total for the user category
 *
 * The rate tables, "Rates of Taxation on Capital Value with effect from
 * 01.04.2015", Table No.1 (residential) and Table No.2 (commercial), add up to
 * 0.775 percent and 1.900 percent of capital value a year.
 *
 * Every weight and rate below was read from the two MCGM PDFs on the property
 * tax portal on 7 November 2026. The blog post content/drafts/bmc-property-tax.md
 * cites the same documents and the same figures: keep the two in step.
 *
 * WHAT THE CALCULATOR CANNOT KNOW
 *
 * Capital value is fixed for five years at a time (section 154 of the Act) and
 * increases are capped (section 140A), so a real bill can rest on an older,
 * lower base value. MCGM's own calculator also asks whether the water
 * connection is metered, which changes the water lines. The page says so.
 *
 * THE EXEMPTION
 *
 * Residential flats of 500 sq ft carpet or less have been exempt since
 * 1 January 2022. The check needs no rate at all, so the tool leads with it.
 * No other size relief is applied: an earlier version flagged a "500 to 700
 * sq ft concession" from one hedged secondary source, which could not be
 * verified, so it has been removed.
 */

export const PT_VERIFIED_ON = "2026-11-07";

export const PT_SOURCES: { label: string; url: string }[] = [
  {
    label:
      "MCGM, Rules for Fixation of Capital Value 2015: formula and Schedules A to D",
    url: "https://ptaxportal.mcgm.gov.in/CitizenPortal/taxdocument/pdf/english/RulesForFixationOfCapitalValue/Rules%20For%20fixation%20of%20Capital%20Value%202015-16%20to%202019-20--English.pdf",
  },
  {
    label: "MCGM, Rates of Taxation on Capital Value from 1 April 2015",
    url: "https://ptaxportal.mcgm.gov.in/CitizenPortal/taxdocument/pdf/english/RulesForFixationOfCapitalValue/Rates%20of%20Taxation%20on%20Capital%20Value%20w.e.f.1.4.2015-English.pdf",
  },
  {
    label: "Department of Registration and Stamps, ready reckoner (e-ASR)",
    url: "https://igrmaharashtra.gov.in/",
  },
];

export const EXEMPT_UPTO_SQFT = 500;

/** One square foot in square metres. */
export const SQM_PER_SQFT = 0.09290304;

export type BuildingType = "rcc" | "pucca" | "chawl";
export type UserCategory = "residential" | "commercial";

/** Schedule A, Parts II and III: residential user and commercial user. */
export const USER_WEIGHT: Record<UserCategory, number> = {
  residential: 0.5,
  commercial: 0.8,
};

/** Rate tables 1 and 2, in percent of capital value a year. */
export const TAX_RATE_PCT: Record<UserCategory, number> = {
  residential: 0.775,
  commercial: 1.9,
};

/** Schedule B. */
export const BUILDING_WEIGHT: Record<BuildingType, number> = {
  rcc: 1,
  pucca: 0.7,
  chawl: 0.5,
};

export const BUILDING_LABEL: Record<BuildingType, string> = {
  rcc: "RCC building",
  pucca: "Pucca, not a chawl",
  chawl: "Chawl or semi permanent",
};

export const USER_LABEL: Record<UserCategory, string> = {
  residential: "Home",
  commercial: "Shop or office",
};

/**
 * Schedule C. Each entry is the upper limit of the band in years and its
 * weight: "0 to 5 years" is 1.00, "more than 5 up to 10" is 0.95, and so on.
 */
export const AGE_BANDS: { upTo: number; weight: number }[] = [
  { upTo: 5, weight: 1.0 },
  { upTo: 10, weight: 0.95 },
  { upTo: 15, weight: 0.9 },
  { upTo: 20, weight: 0.85 },
  { upTo: 25, weight: 0.8 },
  { upTo: 30, weight: 0.75 },
  { upTo: 35, weight: 0.7 },
  { upTo: 40, weight: 0.65 },
  { upTo: 45, weight: 0.6 },
  { upTo: 49, weight: 0.55 },
];
export const AGE_WEIGHT_OVER_49 = 0.5;

/**
 * Schedule D, RCC building with a lift. Floor 0 is the ground floor, a
 * negative floor is a basement (0.70).
 */
export const FLOOR_BANDS: { upTo: number; weight: number }[] = [
  { upTo: 4, weight: 1.0 },
  { upTo: 10, weight: 1.05 },
  { upTo: 20, weight: 1.1 },
  { upTo: 30, weight: 1.15 },
  { upTo: 50, weight: 1.2 },
  { upTo: 75, weight: 1.25 },
  { upTo: 100, weight: 1.3 },
];
export const FLOOR_WEIGHT_BASEMENT = 0.7;
export const FLOOR_WEIGHT_OVER_100 = 1.35;

export function ageWeight(years: number): number {
  const y = Number.isFinite(years) && years > 0 ? years : 0;
  for (const b of AGE_BANDS) if (y <= b.upTo) return b.weight;
  return AGE_WEIGHT_OVER_49;
}

/** The floor factor applies only to an RCC building with a lift. */
export function floorWeight(
  floor: number,
  building: BuildingType,
  hasLift: boolean,
): number {
  if (building !== "rcc" || !hasLift) return 1;
  const f = Number.isFinite(floor) ? Math.floor(floor) : 0;
  if (f < 0) return FLOOR_WEIGHT_BASEMENT;
  for (const b of FLOOR_BANDS) if (f <= b.upTo) return b.weight;
  return FLOOR_WEIGHT_OVER_100;
}

const r0 = (n: number) => Math.round(n);
const safe = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export type PtInput = {
  /** Carpet area in square feet. */
  carpetSqft: number;
  /** Ready reckoner rate for the zone, rupees per square metre, from e-ASR. */
  reckonerRatePerSqm: number;
  building: BuildingType;
  /** Age of the building in years. */
  ageYears: number;
  /** 0 for ground, negative for a basement. */
  floor: number;
  hasLift: boolean;
  user: UserCategory;
};

export type PtResult = {
  carpetSqm: number;
  userWeight: number;
  buildingWeight: number;
  ageWeight: number;
  floorWeight: number;
  capitalValue: number;
  taxRatePct: number;
  /** Tax on the capital value before the exemption. */
  taxBeforeExemption: number;
  exempt: boolean;
  taxPayable: number;
};

export function calculatePropertyTax(inp: PtInput): PtResult {
  const carpet = safe(inp.carpetSqft);
  const rate = safe(inp.reckonerRatePerSqm);
  const carpetSqm = carpet * SQM_PER_SQFT;
  const uw = USER_WEIGHT[inp.user];
  const bw = BUILDING_WEIGHT[inp.building];
  const aw = ageWeight(inp.ageYears);
  const fw = floorWeight(inp.floor, inp.building, inp.hasLift);

  const capitalValue = r0(rate * uw * bw * aw * fw * carpetSqm);
  const taxRatePct = TAX_RATE_PCT[inp.user];
  const taxBeforeExemption = r0((capitalValue * taxRatePct) / 100);

  // The size exemption is for homes only.
  const exempt =
    inp.user === "residential" && carpet > 0 && carpet <= EXEMPT_UPTO_SQFT;

  return {
    carpetSqm: Math.round(carpetSqm * 100) / 100,
    userWeight: uw,
    buildingWeight: bw,
    ageWeight: aw,
    floorWeight: fw,
    capitalValue,
    taxRatePct,
    taxBeforeExemption,
    exempt,
    taxPayable: exempt ? 0 : taxBeforeExemption,
  };
}
