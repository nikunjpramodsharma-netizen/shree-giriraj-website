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
   * The fee for one session, in rupees. Confirmed by the owner on
   * 16 September 2026: 5,000 rupees for a one hour session, the basic rate,
   * which may differ with what the matter needs. Null would render the band
   * without a price; a wrong price is worse than no price, so this is only
   * ever a number the owner has given.
   */
  feePerHour: number | null;
  /** Length of one session, in minutes. */
  slotMinutes: number;
  /**
   * Waived when the firm is involved in the transaction. Owner's decision,
   * 16 September 2026: if we are in the deal the conversation is free; the fee
   * applies only when somebody wants the advice on its own.
   */
  freeIfWeTransact: boolean;
  /**
   * How a booking runs. The owner's words, 16 September 2026: first a
   * conversation to understand exactly what the need or trouble is, then the
   * right person is connected. The band says so, because "book an hour"
   * without that step reads as a call centre.
   */
  howItRuns: string[];
  what: string[];
  whatNot: string[];
};

export const CONSULT: ConsultOffer = {
  feePerHour: 5000,
  slotMinutes: 60,
  freeIfWeTransact: true,
  howItRuns: [
    "You tell us what the matter is, on WhatsApp or by phone, in a few lines",
    "We talk it through first, free, to understand exactly what you need",
    "If it needs a session, we connect you to the right person and fix a time",
    "One hour, focused on your papers and your position, with clear next steps",
  ],
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
 * Live since 16 September 2026. The two operational questions that held it
 * back were answered by the owner that day: a conversation comes first and
 * then the right person is connected, and the fee is waived when the firm is
 * involved in the deal. The fee is 5,000 rupees for an hour, described as the
 * basic rate that may differ with the requirement, and the band says exactly
 * that.
 */
export const CONSULT_READY = true;
