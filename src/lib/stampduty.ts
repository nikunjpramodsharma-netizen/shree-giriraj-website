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
 * PROVENANCE, 16 SEPTEMBER 2026
 *
 * The rates below were traced to the government instruments themselves:
 *
 * - 5 percent base duty: Schedule I, Article 25(b) of the Maharashtra Stamp
 *   Act 1958, for immovable property inside a municipal corporation.
 * - 1 percent metro cess: section 144F of the Mumbai Municipal Corporation
 *   Act 1888 (inserted 2018), applied to Mumbai's notified metro projects;
 *   suspended April 2020 to March 2022 and in force again from 1 April 2022.
 * - Women's concession of 1 percent: Revenue and Forests Department order
 *   Mudrank-2021/UOR.12/CR.107/M-1 (Policy) of 31 March 2021, residential
 *   only, and only where women are the ONLY purchasers. Its fifteen year
 *   bar on resale to a man was deleted by the order of 26 May 2023.
 * - Registration at 1 percent capped at 30,000 rupees: the Department of
 *   Registration and Stamps' Table of Fees, Article I, unchanged by the
 *   September 2026 amendment which touched only searches and copies.
 *
 * JOINT OWNERSHIP, RESOLVED
 *
 * Until 16 September 2026 this file carried a range for a man and a woman
 * buying together, because secondary sources disagreed (6 percent against a
 * blended 6.5). The 2021 order settles it in its own Explanation: the
 * concession applies only where women are the only purchasers, so a male
 * co owner takes the transaction out of the order and the full Article
 * 25(b) rate applies. Joint ownership is 6 percent, the same as a male
 * buyer, and the range is gone. The sites still quoting 5.5 or 6.5 percent
 * for joint ownership are wrong on the instrument.
 */

export const RATES_VERIFIED_ON = "2026-09-16";

export const RATE_SOURCES: { label: string; url: string }[] = [
  {
    label: "Government of Maharashtra, Revenue and Forests Department, order of 31 March 2021 reducing stamp duty by one percent for women purchasers of residential units (Article 25(b) cross referenced)",
    url: "https://cdn.taxguru.in/wp-content/uploads/2021/04/Stamp-Duty-Concession-for-Womens-31-03-2021.pdf",
  },
  {
    label: "Department of Registration and Stamps, Maharashtra, Table of Fees: registration at one percent, maximum 30,000 rupees",
    url: "https://igrmaharashtra.gov.in/pdf/documents/Registration%20fee%20table.pdf",
  },
  {
    label: "Urban Development Department notification of 1 March 2017 declaring Mumbai Metro lines vital urban transport projects, the basis of the one percent metro cess",
    url: "https://igrmaharashtra.gov.in/pdf/documents/6.Mumbai_Metro_Notification_01032017.pdf",
  },
  {
    label: "Home First Finance, stamp duty and registration charges in Maharashtra, updated 11 June 2026, confirming 6, 5 and 6 percent for male, female and joint buyers",
    url: "https://www.homefirstindia.com/blog/article/stamp-duty-registration-charges-maharashtra",
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
  /**
   * Joint male and female: the male rate. The women's concession order of
   * 31 March 2021 applies only where women are the only purchasers. The
   * low and high are kept as fields so the result shape is unchanged, and
   * they are equal.
   */
  baseJointLow: 5,
  baseJointHigh: 5,
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
