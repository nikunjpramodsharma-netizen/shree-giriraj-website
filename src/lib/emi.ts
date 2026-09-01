/**
 * Home loan maths.
 *
 * Pure functions, no React, so they can be tested properly. Everything here is
 * standard reducing balance arithmetic, which is what every Indian lender uses
 * for a home loan.
 *
 * WHY THIS TOOL EXISTS, given that the query is unwinnable
 *
 * "home loan emi calculator" is 673,000 a month and owned by HDFC, Bajaj,
 * BankBazaar and Groww. We will not rank for it and plan/14-free-tools.md says
 * so plainly. This is built for the conversion moment, not for traffic.
 *
 * THE DIFFERENTIATOR
 *
 * Every calculator surveyed (HDFC, Groww, Fundulator, PolicyBazaar) answers
 * "what is my EMI". Not one answers the question that actually stops a
 * purchase: **how much cash do I need before I get the keys.**
 *
 * That gap exists because a lender has no reason to mention it. Stamp duty and
 * registration cannot be funded by the home loan, and neither can brokerage,
 * society transfer or interiors. A buyer who has budgeted a 20 percent down
 * payment is routinely short by lakhs and finds out late.
 *
 * So EMI here is one output among several, and the headline number is the cash
 * required on day one.
 */

export type Money = number;

/** Round to whole rupees. Paise in a loan estimate are false precision. */
const r0 = (n: number) => Math.round(n);

/**
 * Monthly instalment on a reducing balance loan.
 *
 * EMI = P * i * (1+i)^n / ((1+i)^n - 1), where i is the MONTHLY rate.
 *
 * A zero rate is handled separately because the formula divides by zero there.
 * It is not a realistic home loan rate, but a slider can reach it and the page
 * must not render NaN.
 */
export function emi(
  principal: Money,
  annualRatePct: number,
  months: number,
): Money {
  if (principal <= 0 || months <= 0) return 0;
  const i = annualRatePct / 12 / 100;
  if (i === 0) return r0(principal / months);
  const f = Math.pow(1 + i, months);
  return r0((principal * i * f) / (f - 1));
}

export type YearRow = {
  year: number;
  principalPaid: Money;
  interestPaid: Money;
  /** Balance at the end of the year. */
  balance: Money;
};

export type Schedule = {
  emi: Money;
  totalInterest: Money;
  totalPaid: Money;
  months: number;
  years: YearRow[];
};

/**
 * Full amortisation, aggregated by year.
 *
 * `extraPerMonth` and `lumpSum` model prepayment. Both reduce the balance,
 * which shortens the loan rather than lowering the instalment: that is the
 * "reduce tenure" option, and it is the one that saves more interest.
 */
export function schedule(
  principal: Money,
  annualRatePct: number,
  months: number,
  opts: { extraPerMonth?: Money; lumpSum?: Money; lumpSumAtMonth?: number } = {},
): Schedule {
  const instalment = emi(principal, annualRatePct, months);
  const i = annualRatePct / 12 / 100;
  const extra = Math.max(0, opts.extraPerMonth ?? 0);
  const lump = Math.max(0, opts.lumpSum ?? 0);
  const lumpAt = Math.max(1, opts.lumpSumAtMonth ?? 12);

  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  const years: YearRow[] = [];
  let yPrincipal = 0;
  let yInterest = 0;
  let m = 0;

  // The cap is a runaway guard. A tiny instalment against a large balance can
  // fail to amortise at all, and this must terminate rather than hang the page.
  const CAP = Math.max(months, 1) * 2 + 1200;

  while (balance > 0 && m < CAP) {
    m += 1;
    const interest = balance * i;
    let principalPart = instalment - interest + extra;
    if (m === lumpAt) principalPart += lump;

    // The instalment does not cover the interest, so the loan never clears.
    if (principalPart <= 0) break;

    // FINAL INSTALMENT ADJUSTMENT.
    //
    // emi() rounds to whole rupees, so a loan rounded down leaves a few rupees
    // outstanding after the last scheduled month and spills into an extra
    // month. That produced a 241st month and a junk 21st year on a 20 year
    // loan, which is both wrong looking and wrong.
    //
    // Lenders resolve this by adjusting the last instalment, so the same is
    // done here. Only a residual no larger than one instalment is absorbed,
    // so a genuinely unamortised loan still reports honestly rather than being
    // silently closed.
    const residual = balance - principalPart;
    if (m === months && residual > 0 && residual <= instalment) {
      principalPart = balance;
    }

    if (principalPart > balance) principalPart = balance;

    balance -= principalPart;
    totalInterest += interest;
    totalPaid += principalPart + interest;
    yPrincipal += principalPart;
    yInterest += interest;

    if (m % 12 === 0 || balance <= 0) {
      years.push({
        year: Math.ceil(m / 12),
        principalPaid: r0(yPrincipal),
        interestPaid: r0(yInterest),
        balance: r0(Math.max(0, balance)),
      });
      yPrincipal = 0;
      yInterest = 0;
    }
  }

  return {
    emi: instalment,
    totalInterest: r0(totalInterest),
    totalPaid: r0(totalPaid),
    months: m,
    years,
  };
}

export type PrepaymentImpact = {
  monthsSaved: number;
  interestSaved: Money;
  newMonths: number;
};

/** What a prepayment actually buys you, against the same loan without one. */
export function prepaymentImpact(
  principal: Money,
  annualRatePct: number,
  months: number,
  opts: { extraPerMonth?: Money; lumpSum?: Money; lumpSumAtMonth?: number },
): PrepaymentImpact {
  const base = schedule(principal, annualRatePct, months);
  const withPre = schedule(principal, annualRatePct, months, opts);
  return {
    monthsSaved: Math.max(0, base.months - withPre.months),
    interestSaved: Math.max(0, r0(base.totalInterest - withPre.totalInterest)),
    newMonths: withPre.months,
  };
}

/**
 * Costs that the loan does NOT cover.
 *
 * This is the part no bank calculator shows. Stamp duty and registration are
 * paid to the state and cannot be added to the loan, so they come out of the
 * buyer's own pocket on top of the down payment.
 *
 * RATES ARE NOT HARDCODED. `stampDutyPct` is supplied by the caller and the UI
 * makes the reader confirm it, because the Maharashtra rate has not been
 * verified for this site and a wrong duty figure here would be worse than no
 * figure at all. See content/PLACEHOLDERS.md.
 */
export type UpfrontInput = {
  price: Money;
  downPaymentPct: number;
  stampDutyPct: number;
  registration: Money;
  brokeragePct: number;
  interiors: Money;
  otherCosts: Money;
};

export type UpfrontResult = {
  downPayment: Money;
  loanAmount: Money;
  stampDuty: Money;
  registration: Money;
  brokerage: Money;
  interiors: Money;
  otherCosts: Money;
  /** Everything the loan will not pay for. The number that matters. */
  cashNeeded: Money;
  /** Cash needed beyond the down payment alone, which is the usual shock. */
  beyondDownPayment: Money;
  totalCostOfBuying: Money;
};

export function upfront(inp: UpfrontInput): UpfrontResult {
  const price = Math.max(0, inp.price);
  const downPayment = r0((price * clampPct(inp.downPaymentPct)) / 100);
  const loanAmount = r0(price - downPayment);
  const stampDuty = r0((price * clampPct(inp.stampDutyPct)) / 100);
  const brokerage = r0((price * clampPct(inp.brokeragePct)) / 100);
  const registration = Math.max(0, inp.registration);
  const interiors = Math.max(0, inp.interiors);
  const otherCosts = Math.max(0, inp.otherCosts);

  const beyondDownPayment = r0(
    stampDuty + registration + brokerage + interiors + otherCosts,
  );
  return {
    downPayment,
    loanAmount,
    stampDuty,
    registration,
    brokerage,
    interiors,
    otherCosts,
    cashNeeded: r0(downPayment + beyondDownPayment),
    beyondDownPayment,
    totalCostOfBuying: r0(price + beyondDownPayment),
  };
}

function clampPct(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, 100);
}

/**
 * How much a lender is likely to advance, from income.
 *
 * FOIR (fixed obligation to income ratio) is the standard test: total monthly
 * obligations including the new EMI, as a share of net monthly income. 50
 * percent is a common working assumption and is used as the default, but it is
 * a rule of thumb and the UI says so. Actual sanction depends on the lender,
 * the credit score, the age and the property.
 */
export function affordability(
  netMonthlyIncome: Money,
  existingEmis: Money,
  annualRatePct: number,
  months: number,
  foirPct = 50,
): { maxEmi: Money; indicativeLoan: Money } {
  const capacity = r0(
    (Math.max(0, netMonthlyIncome) * clampPct(foirPct)) / 100 -
      Math.max(0, existingEmis),
  );
  const maxEmi = Math.max(0, capacity);
  if (maxEmi <= 0 || months <= 0) return { maxEmi: 0, indicativeLoan: 0 };

  const i = annualRatePct / 12 / 100;
  if (i === 0) return { maxEmi, indicativeLoan: r0(maxEmi * months) };
  const f = Math.pow(1 + i, months);
  return { maxEmi, indicativeLoan: r0((maxEmi * (f - 1)) / (i * f)) };
}

/** Indian digit grouping, which is what a reader here expects. */
export function inr(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

/** Compact form for headline figures: 45,00,000 becomes 45 L. */
export function inrShort(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e7) return "₹" + (n / 1e7).toFixed(2).replace(/\.00$/, "") + " Cr";
  if (a >= 1e5) return "₹" + (n / 1e5).toFixed(2).replace(/\.00$/, "") + " L";
  return inr(n);
}

export function monthsToYears(m: number): string {
  const y = Math.floor(m / 12);
  const mm = m % 12;
  if (y === 0) return `${mm} month${mm === 1 ? "" : "s"}`;
  if (mm === 0) return `${y} year${y === 1 ? "" : "s"}`;
  return `${y} yr ${mm} mo`;
}
