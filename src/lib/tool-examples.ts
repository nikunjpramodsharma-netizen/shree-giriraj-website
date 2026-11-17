import { calculateStampDuty, womanBuyerSaving, MUMBAI } from "@/lib/stampduty";
import { computeYield, type YieldInput } from "@/lib/yield";
import { superFromCarpet, builtUpFromCarpet, carpetFromSuper, sqftToSqm } from "@/lib/area";
import { emi, upfront } from "@/lib/emi";
import { calculatePropertyTax, EXEMPT_UPTO_SQFT, type PtInput } from "@/lib/propertytax";
import { calculateRentAgreement } from "@/lib/rentagreement";
import { calculateHra } from "@/lib/hra";

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

/* ---------------------------------------------------------------- area */

/** One flat taken through every conversion, with the same functions the calculator runs. */
export function areaExample() {
  const carpet = 700;
  const loading = 40;
  const wallPct = 12;
  const superArea = superFromCarpet(carpet, loading);
  const builtUp = builtUpFromCarpet(carpet, wallPct);
  const backToCarpet = carpetFromSuper(superArea, loading);
  const superMid = 1000;
  return {
    carpet,
    loading,
    wallPct,
    superArea,
    builtUp,
    backToCarpet,
    carpetSqm: Math.round(sqftToSqm(carpet) * 10) / 10,
    carpetFrom1000: carpetFromSuper(superMid, loading),
    superMid,
    // A MOFA era figure that counted a 40 sq ft balcony, shown as an arithmetic example only.
    mofaCarpet: 650,
    balcony: 40,
    reraCarpet: 650 - 40,
  };
}

/* ----------------------------------------------------------------- emi */

export function emiExample() {
  const price = 12_000_000;
  const down = upfront({
    price,
    downPaymentPct: 20,
    stampDutyPct: 6,
    registration: 30_000,
    brokeragePct: 0,
    interiors: 0,
    otherCosts: 0,
  });
  return {
    price,
    loan: down.loanAmount,
    downPayment: down.downPayment,
    stampDuty: down.stampDuty,
    registration: down.registration,
    emi: emi(down.loanAmount, 8.5, 240),
    cashNeeded: down.cashNeeded,
  };
}

/* ------------------------------------------------------------ property tax */

export function propertyTaxExample() {
  const input: PtInput = {
    carpetSqft: 650,
    reckonerRatePerSqm: 150_000,
    building: "rcc",
    ageYears: 12,
    floor: 5,
    hasLift: true,
    user: "residential",
  };
  return { input, result: calculatePropertyTax(input), exemptBelow: EXEMPT_UPTO_SQFT };
}

/* ------------------------------------------------------------ rent agreement */

export function rentAgreementExample() {
  const input = { monthlyRent: 40_000, months: 11, refundableDeposit: 120_000 };
  return { input, result: calculateRentAgreement(input) };
}

/* -------------------------------------------------------------------- hra */

export function hraExample() {
  const input = { monthlyBasic: 60_000, monthlyHra: 24_000, monthlyRent: 30_000, isMetro: true };
  return { input, result: calculateHra(input) };
}
