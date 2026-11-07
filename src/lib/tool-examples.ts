import { calculateStampDuty, womanBuyerSaving, MUMBAI } from "@/lib/stampduty";
import { computeYield, type YieldInput } from "@/lib/yield";

/**
 * Worked examples and tables shown under the calculators. Every figure is
 * computed here from the same functions the calculators use, so a page can
 * never show a number the tool would not give.
 */

const CRORE = 10_000_000;
const LAKH = 100_000;

export function stampRatesTable() {
  const rows = [
    { buyer: "Man", category: "male" as const },
    { buyer: "Woman, sole name", category: "female" as const },
    { buyer: "Man and woman jointly", category: "joint" as const },
  ];
  return rows.map((r) => {
    const res = calculateStampDuty({ agreementValue: CRORE, category: r.category });
    return {
      buyer: r.buyer,
      ratePct: res.basePct + res.metroCessPct,
      dutyOnCrore: res.dutyLow,
    };
  });
}

export function stampExamples() {
  const manFlat = calculateStampDuty({ agreementValue: 12 * CRORE / 10, category: "male" });
  const womanFlat = calculateStampDuty({ agreementValue: 12 * CRORE / 10, category: "female" });
  const withReckoner = calculateStampDuty({
    agreementValue: 45 * LAKH,
    reckonerValue: 52 * LAKH,
    category: "male",
  });
  const withoutReckoner = calculateStampDuty({ agreementValue: 45 * LAKH, category: "male" });
  return {
    manFlat,
    womanFlat,
    saving: womanBuyerSaving(12 * CRORE / 10),
    withReckoner,
    withoutReckoner,
    registrationOnCrore: Math.min(
      Math.round((CRORE * MUMBAI.registrationPct) / 100),
      MUMBAI.registrationCap,
    ),
  };
}

/** The page's own default figures, labelled illustrative where shown. */
export const YIELD_EXAMPLE_INPUT: YieldInput = {
  price: 20_000_000,
  monthlyRent: 50_000,
  monthlyMaintenance: 5_000,
  annualPropertyTax: 12_000,
  annualOtherCosts: 20_000,
  vacancyWeeks: 4,
  acquisitionCosts: 1_400_000,
};

export function yieldExample() {
  return { input: YIELD_EXAMPLE_INPUT, result: computeYield(YIELD_EXAMPLE_INPUT) };
}
