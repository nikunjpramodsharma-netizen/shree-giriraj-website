/**
 * Stamp duty and registration, Mumbai.
 *
 * SCOPE IS DELIBERATELY MUMBAI ONLY.
 *
 * Borivali, Kandivali and Malad are all inside the BMC area, which is the
 * market this business works in. Pune, Thane and Nagpur carry an additional
 * local body tax and rural areas are lower again, and I could not confirm
 * those to the same standard. Covering them badly would undo the only
 * advantage this calculator has over a national one, which is being right
 * about one place. The UI says plainly that it is Mumbai only.
 *
 * PROVENANCE
 *
 * Rates below were cross checked against three independent sources on
 * 1 September 2026. All three agree on the male, female and registration
 * figures and on the valuation basis.
 *
 * None of them is a primary source. The primary source is the Maharashtra
 * Stamp Act as notified by the Department of Registration and Stamps, and
 * these rates should be confirmed against it before launch. See
 * content/PLACEHOLDERS.md.
 *
 * WHERE THE SOURCES DISAGREE, AND WHAT IS DONE ABOUT IT
 *
 * Joint ownership by a man and a woman. Two sources say the male rate applies
 * in full, giving 6 percent. One sets a blended base of 5.5 percent, giving
 * 6.5 percent. That is a real conflict on a real number, so it is NOT
 * averaged, guessed at or silently resolved. Joint ownership returns a range,
 * and the page tells the reader why and to confirm it at the sub registrar.
 *
 * A calculator that admits an ambiguity is more useful than one that invents
 * certainty, because the reader can budget for the top of the range.
 */

export const RATES_VERIFIED_ON = "2026-09-01";

export const RATE_SOURCES: { label: string; url: string }[] = [
  {
    label: "Department of Registration and Stamps, Government of Maharashtra",
    url: "https://igrmaharashtra.gov.in/",
  },
  {
    label: "HomeFirst India, stamp duty and registration charges in Maharashtra",
    url: "https://homefirstindia.com/blog/article/stamp-duty-registration-charges-maharashtra",
  },
  {
    label: "Kalpataru, stamp duty and registration charges in Mumbai",
    url: "https://www.kalpataru.com/blogs/stamp-duty-and-registration-charges-mumbai",
  },
];

export type BuyerCategory = "male" | "female" | "joint";

/**
 * Percentages, as whole percent.
 *
 * The metro cess is a separate 1 percent levy on top of the base duty. It is
 * broken out rather than folded in, because a reader who has been quoted "six
 * percent" should be able to see where the sixth point comes from.
 */
export const MUMBAI = {
  baseMale: 5,
  baseFemale: 4,
  /** Joint male and female: sources conflict. Both ends are carried. */
  baseJointLow: 5,
  baseJointHigh: 5.5,
  metroCess: 1,
  /** Registration is one percent, capped. */
  registrationPct: 1,
  registrationCap: 30_000,
} as const;

export type StampDutyInput = {
  agreementValue: number;
  /** The ready reckoner value for the property, if known. Optional. */
  reckonerValue?: number;
  category: BuyerCategory;
};

export type StampDutyResult = {
  /** Duty is charged on the higher of the two values. */
  chargeableValue: number;
  /** True when the reckoner value, not the price, set the chargeable value. */
  reckonerGoverns: boolean;
  basePct: number;
  basePctHigh: number;
  metroCessPct: number;
  baseDuty: number;
  metroCess: number;
  /** Total duty. When a range applies, low and high differ. */
  dutyLow: number;
  dutyHigh: number;
  isRange: boolean;
  registration: number;
  registrationIsCapped: boolean;
  totalLow: number;
  totalHigh: number;
};

const r0 = (n: number) => Math.round(n);

export function calculateStampDuty(inp: StampDutyInput): StampDutyResult {
  const agreement = Math.max(0, inp.agreementValue || 0);
  const reckoner = Math.max(0, inp.reckonerValue || 0);

  // The rule every source agrees on, and the one buyers are caught by: duty is
  // charged on the higher of the agreed price and the government's own
  // valuation, so a bargain does not reduce the duty.
  const chargeableValue = Math.max(agreement, reckoner);
  const reckonerGoverns = reckoner > agreement;

  let basePct: number;
  let basePctHigh: number;
  if (inp.category === "female") {
    basePct = MUMBAI.baseFemale;
    basePctHigh = MUMBAI.baseFemale;
  } else if (inp.category === "joint") {
    basePct = MUMBAI.baseJointLow;
    basePctHigh = MUMBAI.baseJointHigh;
  } else {
    basePct = MUMBAI.baseMale;
    basePctHigh = MUMBAI.baseMale;
  }

  const baseDuty = r0((chargeableValue * basePct) / 100);
  const baseDutyHigh = r0((chargeableValue * basePctHigh) / 100);
  const metroCess = r0((chargeableValue * MUMBAI.metroCess) / 100);

  const dutyLow = baseDuty + metroCess;
  const dutyHigh = baseDutyHigh + metroCess;

  const uncapped = r0((chargeableValue * MUMBAI.registrationPct) / 100);
  const registration = Math.min(uncapped, MUMBAI.registrationCap);

  return {
    chargeableValue,
    reckonerGoverns,
    basePct,
    basePctHigh,
    metroCessPct: MUMBAI.metroCess,
    baseDuty,
    metroCess,
    dutyLow,
    dutyHigh,
    isRange: dutyHigh !== dutyLow,
    registration,
    registrationIsCapped: uncapped > MUMBAI.registrationCap,
    totalLow: dutyLow + registration,
    totalHigh: dutyHigh + registration,
  };
}

/** What a female sole buyer saves against the male rate, in rupees. */
export function womanBuyerSaving(chargeableValue: number): number {
  const male = calculateStampDuty({ agreementValue: chargeableValue, category: "male" });
  const female = calculateStampDuty({ agreementValue: chargeableValue, category: "female" });
  return Math.max(0, male.dutyLow - female.dutyLow);
}
