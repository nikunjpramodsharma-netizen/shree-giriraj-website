/**
 * Rent agreement (leave and licence) stamp duty and registration, Mumbai.
 *
 * PROVENANCE, READ 7 NOVEMBER 2026
 *
 * - The duty: Schedule I, Article 36A(a) of the Maharashtra Stamp Act 1958,
 *   as substituted by Mah. Act 8 of 2013 (w.e.f. 1 May 2013), in the
 *   department's master copy of Schedules I and II dated 31 July 2026
 *   (modified up to 13 July 2026). For a term not exceeding sixty months it
 *   is 0.25 percent of the total of (i) the licence fee or rent payable
 *   under the agreement, (ii) any non refundable deposit, money advanced or
 *   premium, and (iii) interest at 10 percent per annum on the refundable
 *   security deposit. Article 36A(b): a term over sixty months pays lease
 *   duty under Article 36 instead, which this module does not compute.
 *
 * - How the department applies it: the official Leave and License 2.0 stamp
 *   duty calculator on leaveandlicense.igrmaharashtra.gov.in, whose page
 *   script (function calculatestampduty) computes
 *     ((rent x months) + deposit x 0.10 x years + non refundable) x 0.25 / 100
 *   where years is 1 for 1 to 12 months, 2 for 13 to 24, and so on up to 5,
 *   so a part year of interest counts as a full year. It floors the duty at
 *   100 rupees and rounds to the rupee. For varying rent it sums the rent
 *   slab by slab, which is what the yearly increase below does.
 *
 * - Registration fee and handling charge: the same official calculator shows
 *   a registration fee of 1,000 rupees for property in an urban area (500 in
 *   a rural one) and a document handling charge (DHC) of 300 rupees. Mumbai
 *   is urban, so the tool uses 1,000.
 *
 * Nothing here is taken from a secondary site.
 */

export const RENT_AGREEMENT_VERIFIED_ON = "2026-11-07";

export const RENT_AGREEMENT_SOURCES: { label: string; url: string }[] = [
  {
    label:
      "Maharashtra Stamp Act, Schedule I, Article 36A (leave and licence agreement), department master copy dated 31 July 2026",
    url: "https://igrmaharashtra.gov.in/pdf/documents/MASTER%20COPY%20OF%20SCHEDULE%20I%20%20II%20%20OF%20%20MSA%20%20PDF%20dt.31.07.2026.pdf",
  },
  {
    label:
      "Department of Registration and Stamps, Leave and License 2.0 stamp duty calculator: the formula, the 100 rupee minimum, registration fee and handling charge",
    url: "https://leaveandlicense.igrmaharashtra.gov.in/Fees/calculator_sd",
  },
];

export const LEAVE_LICENCE = {
  /** Article 36A(a): 0.25 percent. */
  dutyPct: 0.25,
  /** Article 36A(a)(iii): interest at 10 percent a year on the refundable deposit. */
  depositInterestPct: 10,
  /** The department's calculator never charges less than this. */
  minDuty: 100,
  /** Urban area, which covers Mumbai, per the department's calculator. */
  registrationFee: 1_000,
  /** Document handling charge, per the department's calculator. */
  handlingCharge: 300,
  /** Article 36A(a) covers terms not exceeding sixty months. */
  maxMonths: 60,
} as const;

export type RentAgreementInput = {
  monthlyRent: number;
  /** Term of the agreement in months, 1 to 60. */
  months: number;
  /** Percent increase in the monthly rent at the start of each new year of the term. */
  yearlyIncreasePct?: number;
  refundableDeposit?: number;
  /** Non refundable deposit, money advanced or premium. */
  nonRefundable?: number;
};

export type RentYear = { year: number; months: number; monthlyRent: number; rent: number };

export type RentAgreementResult = {
  months: number;
  schedule: RentYear[];
  /** Rent for the whole term. */
  totalRent: number;
  /** Years of deposit interest counted: each part year counts as a full year. */
  interestYears: number;
  notionalInterest: number;
  nonRefundable: number;
  /** The sum the 0.25 percent is charged on. */
  dutiableAmount: number;
  stampDuty: number;
  /** True when the 100 rupee minimum set the duty. */
  minimumApplied: boolean;
  registrationFee: number;
  handlingCharge: number;
  total: number;
};

const clampMonths = (m: number) =>
  Math.min(LEAVE_LICENCE.maxMonths, Math.max(1, Math.round(m || 0)));
const nonNeg = (n: number | undefined) => Math.max(0, Number(n) || 0);

export function calculateRentAgreement(inp: RentAgreementInput): RentAgreementResult {
  const months = clampMonths(inp.months);
  const baseRent = nonNeg(inp.monthlyRent);
  const inc = nonNeg(inp.yearlyIncreasePct);
  const deposit = nonNeg(inp.refundableDeposit);
  const nonRefundable = Math.round(nonNeg(inp.nonRefundable));

  // Rent year by year. An agreement states rent in whole rupees, so each
  // year's increased rent is rounded to the rupee before it is summed.
  const schedule: RentYear[] = [];
  for (let y = 0; y * 12 < months; y += 1) {
    const m = Math.min(12, months - y * 12);
    const monthlyRent = Math.round(baseRent * Math.pow(1 + inc / 100, y));
    schedule.push({ year: y + 1, months: m, monthlyRent, rent: monthlyRent * m });
  }
  const totalRent = schedule.reduce((s, r) => s + r.rent, 0);

  const interestYears = Math.ceil(months / 12);
  // Kept unrounded for the duty, as the department's calculator does, and
  // rounded only for display.
  const interestExact = deposit * (LEAVE_LICENCE.depositInterestPct / 100) * interestYears;
  const notionalInterest = Math.round(interestExact);

  const dutiableAmount = Math.round(totalRent + nonRefundable + interestExact);
  const raw = Math.round(((totalRent + nonRefundable + interestExact) * LEAVE_LICENCE.dutyPct) / 100);
  const minimumApplied = raw < LEAVE_LICENCE.minDuty;
  const stampDuty = minimumApplied ? LEAVE_LICENCE.minDuty : raw;

  return {
    months,
    schedule,
    totalRent,
    interestYears,
    notionalInterest,
    nonRefundable,
    dutiableAmount,
    stampDuty,
    minimumApplied,
    registrationFee: LEAVE_LICENCE.registrationFee,
    handlingCharge: LEAVE_LICENCE.handlingCharge,
    total: stampDuty + LEAVE_LICENCE.registrationFee + LEAVE_LICENCE.handlingCharge,
  };
}
