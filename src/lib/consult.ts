/**
 * The paid consultation offer.
 *
 * WHAT THIS IS
 *
 * A chargeable call with us about a property problem, for people who are not
 * buying or selling through us and just need someone who knows the ground to
 * look at their situation. It monetises the reference traffic the guides pull
 * in, which is traffic that would otherwise never convert because most of it
 * is not in our three suburbs.
 *
 * HOW IT IS DELIBERATELY WORDED
 *
 * As property consultation, not legal advice, and not "we have a lawyer".
 *
 * Two reasons, and both are real rather than cautious. Advocates in India are
 * restricted in how they may advertise and solicit work, and a property firm
 * advertising a lawyer's time for an hourly fee sits close to that line. There
 * is also a plain accuracy problem: we are estate agents, and what we are
 * genuinely expert in is property in Borivali, Kandivali and Malad, not law.
 *
 * So the offer is our own expertise, priced. Where something needs a lawyer we
 * say so on the call and refer out. That is both the safer position and the
 * true one, and it is worth more to a caller than a vague promise of legal help.
 *
 * BEFORE THIS GOES LIVE, see CONSULT_READY below.
 */

export type ConsultOffer = {
  /**
   * The hourly fee, in rupees. NULL until confirmed.
   *
   * Nothing invents a number here. While this is null the band renders without
   * a price and says the fee is confirmed before booking, which is honest and
   * still converts. A wrong price is worse than no price.
   */
  feePerHour: number | null;
  /** Minimum billable slot, in minutes. */
  slotMinutes: number;
  what: string[];
  whatNot: string[];
};

export const CONSULT: ConsultOffer = {
  feePerHour: null,
  slotMinutes: 30,
  what: [
    "A document you have been sent and do not want to sign blind",
    "A society, redevelopment or conveyance position you cannot read",
    "A flat you are about to commit to, and a second opinion on it",
    "A deposit, agreement or handover dispute with a landlord or tenant",
  ],
  whatNot: [
    "Legal representation, drafting or anything filed on your behalf",
    "A valuation you can rely on for a bank or a court",
    "Tax advice, which belongs with a chartered accountant",
  ],
};

/**
 * Until this is true the band stays off the site entirely, rather than
 * advertising a service nobody can buy.
 *
 * A PRICE IS NOT REQUIRED TO GO LIVE. Decided 1 September 2026: no fee is
 * being set for now. The null branch in ConsultCTA is a real launch mode, not
 * a placeholder, and it says the fee is agreed before anything is booked.
 * Quoting on enquiry is normal for advisory work and lets the number vary with
 * how much is actually involved, which a published hourly rate cannot.
 *
 * So the only genuine blocker is operational:
 *   1. Agreed what happens when someone books, and who takes the call
 *   2. Decided whether the fee is credited back if they transact with us
 *
 * Set CONSULT.feePerHour later only if a fixed public rate is wanted.
 */
export const CONSULT_READY = false;
