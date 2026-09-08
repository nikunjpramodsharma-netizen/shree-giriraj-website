/**
 * Rental yield arithmetic.
 *
 * WHAT THIS IS AND IS NOT
 *
 * Every number this produces is arithmetic on figures the user typed. It is
 * not a forecast, not a benchmark, and not a claim about what any building in
 * Borivali, Kandivali or Malad actually yields. The site publishes no expected
 * return, on the owner's instruction of 8 September 2026, because no citable
 * source for western suburbs yields has been verified and a figure quoted for
 * a whole suburb tells a buyer nothing about the flat in front of them.
 *
 * So there is deliberately no "good yield" threshold in here, and no verdict
 * copy that says a number is strong or weak. The calculator's job is to make
 * the reader's own arithmetic honest, chiefly by insisting on the two things
 * that quietly ruin a yield calculation:
 *
 *   1. Gross yield ignores what ownership costs. Society maintenance, property
 *      tax, insurance and repairs come off the rent before it is income, and in
 *      an older Mumbai society maintenance alone is not a rounding error.
 *   2. The purchase price is not the price. Stamp duty, registration, brokerage
 *      and the fit out needed to let the flat are all capital that has to earn
 *      its return, and leaving them out flatters the yield.
 *
 * Net yield here is a cash figure before income tax and before any loan. A
 * geared return is a different calculation and this tool does not attempt it,
 * because it would need assumptions about the loan that the reader has not
 * given us.
 */

export type YieldInput = {
  /** Agreed price of the flat, rupees. */
  price: number;
  /** Monthly rent the flat can realistically command today, rupees. */
  monthlyRent: number;
  /** Monthly society maintenance, rupees. */
  monthlyMaintenance: number;
  /** Annual property tax, rupees. */
  annualPropertyTax: number;
  /** Annual repairs, insurance and the rest, rupees. */
  annualOtherCosts: number;
  /** Weeks a year the flat is expected to sit empty between tenants. */
  vacancyWeeks: number;
  /** One off costs on top of the price: duty, registration, brokerage, fit out. */
  acquisitionCosts: number;
};

export type YieldResult = {
  /** Rent for a full year with no vacancy and nothing deducted. */
  grossAnnualRent: number;
  /** Rent actually collected once expected vacancy is taken off. */
  collectedAnnualRent: number;
  /** Everything that comes off the rent in a year. */
  annualCosts: number;
  /** Collected rent less annual costs. Before income tax, before any loan. */
  netAnnualIncome: number;
  /** Price plus the one off costs of acquiring the flat. */
  totalCapital: number;
  /** Gross annual rent over the price alone, as a percentage. */
  grossYieldPct: number;
  /** Net income over total capital, as a percentage. */
  netYieldPct: number;
  /** How many percentage points the gross figure overstates the net one. */
  yieldGapPct: number;
  /** Years of net income to recover the capital. Infinity if income is zero or less. */
  paybackYears: number;
};

const WEEKS_IN_YEAR = 52;

function safeDiv(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0;
}

export function computeYield(input: YieldInput): YieldResult {
  const price = Math.max(0, input.price);
  const rent = Math.max(0, input.monthlyRent);
  const vacancyWeeks = Math.min(Math.max(0, input.vacancyWeeks), WEEKS_IN_YEAR);

  const grossAnnualRent = rent * 12;
  const occupiedShare = (WEEKS_IN_YEAR - vacancyWeeks) / WEEKS_IN_YEAR;
  const collectedAnnualRent = grossAnnualRent * occupiedShare;

  const annualCosts =
    Math.max(0, input.monthlyMaintenance) * 12 +
    Math.max(0, input.annualPropertyTax) +
    Math.max(0, input.annualOtherCosts);

  const netAnnualIncome = collectedAnnualRent - annualCosts;
  const totalCapital = price + Math.max(0, input.acquisitionCosts);

  const grossYieldPct = safeDiv(grossAnnualRent, price) * 100;
  const netYieldPct = safeDiv(netAnnualIncome, totalCapital) * 100;

  return {
    grossAnnualRent,
    collectedAnnualRent,
    annualCosts,
    netAnnualIncome,
    totalCapital,
    grossYieldPct,
    netYieldPct,
    yieldGapPct: grossYieldPct - netYieldPct,
    paybackYears:
      netAnnualIncome > 0 ? totalCapital / netAnnualIncome : Number.POSITIVE_INFINITY,
  };
}

/**
 * The rent a flat would need to command to hit a target net yield, holding
 * every cost constant.
 *
 * This is the question the calculator is really for. A reader who knows what
 * return they need can work backwards to the rent that delivers it, and then
 * ask whether the flat can genuinely command that. It answers "what would have
 * to be true" without the site ever asserting what the yield will be.
 *
 * Returns null when the target cannot be reached at any rent, which happens
 * only when there is no capital to earn on.
 */
export function rentForTargetNetYield(
  input: YieldInput,
  targetNetYieldPct: number,
): number | null {
  const totalCapital = Math.max(0, input.price) + Math.max(0, input.acquisitionCosts);
  if (totalCapital <= 0) return null;

  const annualCosts =
    Math.max(0, input.monthlyMaintenance) * 12 +
    Math.max(0, input.annualPropertyTax) +
    Math.max(0, input.annualOtherCosts);

  const vacancyWeeks = Math.min(Math.max(0, input.vacancyWeeks), WEEKS_IN_YEAR);
  const occupiedShare = (WEEKS_IN_YEAR - vacancyWeeks) / WEEKS_IN_YEAR;
  if (occupiedShare <= 0) return null;

  const requiredNetIncome = totalCapital * (targetNetYieldPct / 100);
  const requiredCollectedRent = requiredNetIncome + annualCosts;
  const requiredGrossRent = requiredCollectedRent / occupiedShare;
  return Math.max(0, requiredGrossRent / 12);
}
