import { describe, it, expect } from "vitest";
import {
  calculateHra,
  buildReceipts,
  financialYearLabel,
  LANDLORD_PAN_THRESHOLD,
  METRO_PCT,
  NON_METRO_PCT,
  HRA_SOURCES,
  HRA_VERIFIED_ON,
} from "./hra";

const base = {
  monthlyBasic: 50_000,
  monthlyHra: 20_000,
  monthlyRent: 25_000,
  isMetro: true,
};

describe("the least of three rule", () => {
  it("computes all three limbs on annual figures", () => {
    const r = calculateHra(base);
    expect(r.limbHraReceived).toBe(240_000); // 20k x 12
    expect(r.limbRentLessTenPct).toBe(240_000); // 300k rent less 60k
    expect(r.limbSalaryPct).toBe(300_000); // 50% of 600k
  });

  it("takes the least of the three", () => {
    const r = calculateHra(base);
    expect(r.exempt).toBe(240_000);
    expect(r.exempt).toBe(
      Math.min(r.limbHraReceived, r.limbRentLessTenPct, r.limbSalaryPct),
    );
  });

  it("uses 50 percent in a metro and 40 percent elsewhere", () => {
    expect(calculateHra(base).salaryPctUsed).toBe(METRO_PCT);
    expect(calculateHra({ ...base, isMetro: false }).salaryPctUsed).toBe(
      NON_METRO_PCT,
    );
  });

  it("leaves the rest of the HRA taxable", () => {
    const r = calculateHra({ ...base, monthlyRent: 10_000 });
    // Rent limb: 120k less 60k = 60k, which binds.
    expect(r.exempt).toBe(60_000);
    expect(r.taxable).toBe(240_000 - 60_000);
  });

  it("never returns a negative exemption when rent is low against salary", () => {
    // Rent below 10 percent of salary makes the second limb negative.
    const r = calculateHra({ ...base, monthlyRent: 1_000 });
    expect(r.limbRentLessTenPct).toBe(0);
    expect(r.exempt).toBe(0);
    expect(r.taxable).toBe(240_000);
  });

  it("names the limb that bound the answer, so the reader knows what to change", () => {
    expect(calculateHra(base).bindingLimb).toBe("hra");
    expect(calculateHra({ ...base, monthlyRent: 10_000 }).bindingLimb).toBe("rent");
    expect(
      calculateHra({ ...base, monthlyHra: 40_000, monthlyRent: 60_000 })
        .bindingLimb,
    ).toBe("salary");
  });

  it("returns zeros rather than NaN for empty input", () => {
    const r = calculateHra({
      monthlyBasic: 0,
      monthlyHra: 0,
      monthlyRent: 0,
      isMetro: true,
    });
    expect(r.exempt).toBe(0);
    expect(r.taxable).toBe(0);
  });

  it("ignores hostile negative input", () => {
    const r = calculateHra({ ...base, monthlyRent: -50_000 });
    expect(r.exempt).toBeGreaterThanOrEqual(0);
  });
});

describe("landlord PAN", () => {
  it("is required above one lakh of annual rent", () => {
    // 8,334 x 12 is 100,008, just over.
    expect(calculateHra({ ...base, monthlyRent: 8_334 }).panRequired).toBe(true);
  });

  it("is not required at or below the threshold", () => {
    // 8,333 x 12 is 99,996.
    expect(calculateHra({ ...base, monthlyRent: 8_333 }).panRequired).toBe(false);
  });

  it("uses the documented threshold", () => {
    expect(LANDLORD_PAN_THRESHOLD).toBe(100_000);
  });
});

describe("rent receipts", () => {
  it("produces twelve monthly receipts across the financial year", () => {
    const r = buildReceipts(25_000, "monthly", 2026);
    expect(r).toHaveLength(12);
    expect(r[0].label).toBe("April 2026");
    expect(r[11].label).toBe("March 2027");
  });

  it("rolls into the next calendar year in January, as an Indian FY does", () => {
    const r = buildReceipts(25_000, "monthly", 2026);
    expect(r[8].label).toBe("December 2026");
    expect(r[9].label).toBe("January 2027");
  });

  it("produces four quarterly receipts covering the right months", () => {
    const r = buildReceipts(25_000, "quarterly", 2026);
    expect(r).toHaveLength(4);
    expect(r[0].fromMonth).toBe("April 2026");
    expect(r[0].toMonth).toBe("June 2026");
    expect(r[3].fromMonth).toBe("January 2027");
    expect(r[3].toMonth).toBe("March 2027");
  });

  it("charges three months of rent on a quarterly receipt", () => {
    expect(buildReceipts(25_000, "quarterly", 2026)[0].amount).toBe(75_000);
  });

  it("totals the same either way", () => {
    const m = buildReceipts(25_000, "monthly", 2026).reduce((s, r) => s + r.amount, 0);
    const q = buildReceipts(25_000, "quarterly", 2026).reduce((s, r) => s + r.amount, 0);
    expect(m).toBe(q);
    expect(m).toBe(300_000);
  });

  it("produces nothing for a zero rent instead of blank receipts", () => {
    expect(buildReceipts(0, "monthly", 2026)).toEqual([]);
  });
});

describe("financial year label", () => {
  it("writes the year the way it is written here", () => {
    expect(financialYearLabel(2026)).toBe("2026-27");
    expect(financialYearLabel(2099)).toBe("2099-00");
  });
});

describe("provenance", () => {
  it("carries a verified date and sources", () => {
    expect(HRA_VERIFIED_ON).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(HRA_SOURCES.length).toBeGreaterThanOrEqual(2);
  });
});
