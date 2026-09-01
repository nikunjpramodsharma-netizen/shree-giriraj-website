import { describe, it, expect } from "vitest";
import {
  emi,
  schedule,
  prepaymentImpact,
  upfront,
  affordability,
  inr,
  inrShort,
  monthsToYears,
} from "./emi";

describe("emi", () => {
  it("matches the standard published figure for a real loan", () => {
    // 50 lakh at 8.5% over 20 years is quoted at roughly Rs 43,391 by every
    // lender's own calculator. If this drifts, the formula is wrong, not the
    // published figure.
    expect(emi(5_000_000, 8.5, 240)).toBeGreaterThan(43_300);
    expect(emi(5_000_000, 8.5, 240)).toBeLessThan(43_480);
  });

  it("falls back to simple division at a zero rate instead of dividing by zero", () => {
    expect(emi(1_200_000, 0, 12)).toBe(100_000);
    expect(Number.isNaN(emi(1_200_000, 0, 12))).toBe(false);
  });

  it("returns zero rather than NaN for degenerate input", () => {
    expect(emi(0, 8.5, 240)).toBe(0);
    expect(emi(5_000_000, 8.5, 0)).toBe(0);
    expect(emi(-1, 8.5, 240)).toBe(0);
  });

  it("costs more per month over a shorter tenure", () => {
    expect(emi(5_000_000, 8.5, 120)).toBeGreaterThan(emi(5_000_000, 8.5, 240));
  });
});

describe("schedule", () => {
  const P = 5_000_000;

  it("clears the loan and lands exactly on zero", () => {
    const s = schedule(P, 8.5, 240);
    expect(s.months).toBe(240);
    expect(s.years.at(-1)?.balance).toBe(0);
  });

  it("total paid equals principal plus interest, within rounding", () => {
    const s = schedule(P, 8.5, 240);
    expect(Math.abs(s.totalPaid - (P + s.totalInterest))).toBeLessThan(5);
  });

  it("charges more interest than principal early on, which is the point", () => {
    // Year one of a 20 year loan at 8.5% is roughly 80% interest. This is the
    // single most useful thing the schedule shows a first time buyer.
    const y1 = schedule(P, 8.5, 240).years[0];
    expect(y1.interestPaid).toBeGreaterThan(y1.principalPaid * 2);
  });

  it("reverses that ratio by the end of the loan", () => {
    const last = schedule(P, 8.5, 240).years.at(-1)!;
    expect(last.principalPaid).toBeGreaterThan(last.interestPaid * 2);
  });

  it("produces one row per year", () => {
    expect(schedule(P, 8.5, 240).years).toHaveLength(20);
  });

  it("terminates instead of hanging when the instalment cannot cover interest", () => {
    // A pathological case a slider can reach. It must return, not spin.
    const s = schedule(100_000_000, 15, 1);
    expect(s.months).toBeLessThan(4000);
  });
});

describe("prepayment", () => {
  const P = 5_000_000;

  it("changes nothing when nothing is prepaid", () => {
    const p = prepaymentImpact(P, 8.5, 240, {});
    expect(p.monthsSaved).toBe(0);
    expect(p.interestSaved).toBe(0);
  });

  it("shortens the loan and saves interest with a monthly top up", () => {
    const p = prepaymentImpact(P, 8.5, 240, { extraPerMonth: 5_000 });
    expect(p.monthsSaved).toBeGreaterThan(24);
    expect(p.interestSaved).toBeGreaterThan(500_000);
    expect(p.newMonths).toBeLessThan(240);
  });

  it("saves more from a bigger lump sum", () => {
    const small = prepaymentImpact(P, 8.5, 240, { lumpSum: 200_000 });
    const big = prepaymentImpact(P, 8.5, 240, { lumpSum: 1_000_000 });
    expect(big.interestSaved).toBeGreaterThan(small.interestSaved);
  });

  it("saves more from an earlier lump sum than a later one of the same size", () => {
    const early = prepaymentImpact(P, 8.5, 240, {
      lumpSum: 500_000,
      lumpSumAtMonth: 12,
    });
    const late = prepaymentImpact(P, 8.5, 240, {
      lumpSum: 500_000,
      lumpSumAtMonth: 120,
    });
    expect(early.interestSaved).toBeGreaterThan(late.interestSaved);
  });
});

describe("upfront cash, the part no bank calculator shows", () => {
  const base = {
    price: 10_000_000,
    downPaymentPct: 20,
    stampDutyPct: 6,
    registration: 30_000,
    brokeragePct: 1,
    interiors: 800_000,
    otherCosts: 50_000,
  };

  it("splits price into down payment and loan", () => {
    const u = upfront(base);
    expect(u.downPayment).toBe(2_000_000);
    expect(u.loanAmount).toBe(8_000_000);
  });

  it("counts everything the loan will not cover", () => {
    const u = upfront(base);
    // 6L duty + 30k registration + 1L brokerage + 8L interiors + 50k other
    expect(u.beyondDownPayment).toBe(1_580_000);
    expect(u.cashNeeded).toBe(u.downPayment + u.beyondDownPayment);
  });

  it("shows cash needed well above the down payment, which is the whole point", () => {
    const u = upfront(base);
    expect(u.cashNeeded).toBeGreaterThan(u.downPayment * 1.5);
  });

  it("never returns a negative from hostile input", () => {
    const u = upfront({
      ...base,
      price: -5,
      registration: -100,
      interiors: -1,
      downPaymentPct: -10,
      stampDutyPct: 999,
    });
    for (const v of Object.values(u)) expect(v).toBeGreaterThanOrEqual(0);
  });
});

describe("affordability", () => {
  it("applies FOIR and subtracts existing obligations", () => {
    // 50% of 200000 is 100000, less a 20000 existing EMI.
    expect(affordability(200_000, 20_000, 8.5, 240).maxEmi).toBe(80_000);
  });

  it("returns zero when obligations already exceed capacity", () => {
    const a = affordability(100_000, 90_000, 8.5, 240);
    expect(a.maxEmi).toBe(0);
    expect(a.indicativeLoan).toBe(0);
  });

  it("round trips against emi(), which cross checks both formulas", () => {
    const a = affordability(200_000, 0, 8.5, 240);
    const back = emi(a.indicativeLoan, 8.5, 240);
    expect(Math.abs(back - a.maxEmi)).toBeLessThan(5);
  });
});

describe("formatting", () => {
  it("groups digits the Indian way", () => {
    expect(inr(4_500_000)).toBe("₹45,00,000");
  });

  it("shortens to lakh and crore", () => {
    expect(inrShort(4_500_000)).toBe("₹45 L");
    expect(inrShort(12_500_000)).toBe("₹1.25 Cr");
    expect(inrShort(5_000)).toBe("₹5,000");
  });

  it("reads months back as years and months", () => {
    expect(monthsToYears(240)).toBe("20 years");
    expect(monthsToYears(18)).toBe("1 yr 6 mo");
    expect(monthsToYears(7)).toBe("7 months");
  });
});
