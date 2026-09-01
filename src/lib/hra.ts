/**
 * HRA exemption and rent receipts.
 *
 * THE RULE, Section 10(13A) read with Rule 2A
 *
 * The exemption is the LEAST of three figures:
 *   1. the HRA actually received
 *   2. rent paid, less 10 percent of salary
 *   3. 50 percent of salary in a metro, 40 percent elsewhere
 *
 * "Salary" here means basic pay plus dearness allowance that forms part of
 * retirement benefits, plus any commission calculated as a fixed percentage of
 * turnover. It is not gross pay, and using gross pay is the single most common
 * mistake in a DIY calculation.
 *
 * Mumbai is a metro, so 50 percent applies.
 *
 * THE CAVEAT THAT MATTERS MOST
 *
 * HRA exemption exists only under the OLD tax regime. Anyone on the new regime
 * gets nothing from this, whatever the arithmetic says. That is stated at the
 * top of the tool rather than buried in a footnote, because it is the
 * difference between a useful number and a misleading one.
 *
 * Verified 1 September 2026. This is statutory and far more stable than the
 * stamp duty rates, but it is still tax, so the page says to confirm with a
 * chartered accountant and does not pretend to be advice.
 */

export const HRA_VERIFIED_ON = "2026-09-01";

export const HRA_SOURCES: { label: string; url: string }[] = [
  {
    label: "ClearTax, HRA exemption rules and calculation",
    url: "https://cleartax.in/s/hra-house-rent-allowance",
  },
  {
    label: "Motilal Oswal, HRA exemption and calculation guide",
    url: "https://www.motilaloswal.com/personal-finance/tax/what-is-house-rent-allowance-hra-exemption-and-calculation",
  },
];

/** Landlord PAN is required above this annual rent. CBDT Circular 8/2013. */
export const LANDLORD_PAN_THRESHOLD = 100_000;

export const METRO_PCT = 50;
export const NON_METRO_PCT = 40;

const r0 = (n: number) => Math.round(n);
const safe = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export type HraInput = {
  /** Basic pay plus DA, per month. NOT gross salary. */
  monthlyBasic: number;
  /** HRA component actually received, per month. */
  monthlyHra: number;
  /** Rent actually paid, per month. */
  monthlyRent: number;
  isMetro: boolean;
};

export type HraResult = {
  annualBasic: number;
  annualHra: number;
  annualRent: number;
  /** The three limbs, annual. */
  limbHraReceived: number;
  limbRentLessTenPct: number;
  limbSalaryPct: number;
  /** Which limb bound the answer. Useful, because it tells you what to change. */
  bindingLimb: "hra" | "rent" | "salary";
  exempt: number;
  taxable: number;
  salaryPctUsed: number;
  /** Landlord PAN needed on the receipts. */
  panRequired: boolean;
};

export function calculateHra(inp: HraInput): HraResult {
  const annualBasic = safe(inp.monthlyBasic) * 12;
  const annualHra = safe(inp.monthlyHra) * 12;
  const annualRent = safe(inp.monthlyRent) * 12;
  const pct = inp.isMetro ? METRO_PCT : NON_METRO_PCT;

  const limbHraReceived = r0(annualHra);
  // This limb can go negative when rent is low against salary. A negative
  // exemption is meaningless, so it floors at zero.
  const limbRentLessTenPct = Math.max(0, r0(annualRent - annualBasic * 0.1));
  const limbSalaryPct = r0((annualBasic * pct) / 100);

  const exempt = Math.min(limbHraReceived, limbRentLessTenPct, limbSalaryPct);

  let bindingLimb: HraResult["bindingLimb"] = "hra";
  if (exempt === limbRentLessTenPct) bindingLimb = "rent";
  if (exempt === limbSalaryPct) bindingLimb = "salary";
  // Ties resolve to the most actionable explanation: if HRA received is the
  // binding one, that is what the reader should be told.
  if (exempt === limbHraReceived) bindingLimb = "hra";

  return {
    annualBasic,
    annualHra,
    annualRent,
    limbHraReceived,
    limbRentLessTenPct,
    limbSalaryPct,
    bindingLimb,
    exempt,
    taxable: Math.max(0, r0(annualHra - exempt)),
    salaryPctUsed: pct,
    panRequired: annualRent > LANDLORD_PAN_THRESHOLD,
  };
}

/* ------------------------------------------------------- rent receipts */

export type ReceiptPeriod = "monthly" | "quarterly";

export type Receipt = {
  index: number;
  label: string;
  amount: number;
  fromMonth: string;
  toMonth: string;
};

const MONTHS = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

/**
 * Receipts across an Indian financial year, which runs April to March.
 *
 * Quarterly receipts are what most employers accept and they are four pieces
 * of paper instead of twelve, so they are offered as the default alternative.
 */
export function buildReceipts(
  monthlyRent: number,
  period: ReceiptPeriod,
  fyStartYear: number,
): Receipt[] {
  const rent = safe(monthlyRent);
  if (rent === 0) return [];

  const yearFor = (i: number) => (i < 9 ? fyStartYear : fyStartYear + 1);

  if (period === "monthly") {
    return MONTHS.map((m, i) => ({
      index: i,
      label: `${m} ${yearFor(i)}`,
      amount: r0(rent),
      fromMonth: `${m} ${yearFor(i)}`,
      toMonth: `${m} ${yearFor(i)}`,
    }));
  }

  return [0, 3, 6, 9].map((start, q) => ({
    index: q,
    label: `Quarter ${q + 1}`,
    amount: r0(rent * 3),
    fromMonth: `${MONTHS[start]} ${yearFor(start)}`,
    toMonth: `${MONTHS[start + 2]} ${yearFor(start + 2)}`,
  }));
}

/** "2026-27", the way a financial year is written here. */
export function financialYearLabel(startYear: number): string {
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}
