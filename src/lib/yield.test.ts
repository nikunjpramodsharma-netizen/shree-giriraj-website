import { describe, it, expect } from "vitest";
import { computeYield, rentForTargetNetYield, type YieldInput } from "./yield";

const base: YieldInput = {
  price: 20_000_000,
  monthlyRent: 50_000,
  monthlyMaintenance: 5_000,
  annualPropertyTax: 12_000,
  annualOtherCosts: 20_000,
  vacancyWeeks: 4,
  acquisitionCosts: 1_400_000,
};

describe("rental yield arithmetic", () => {
  it("computes gross yield on the price alone", () => {
    const r = computeYield(base);
    // 50,000 x 12 = 600,000 on 2,00,00,000 is exactly 3 percent.
    expect(r.grossAnnualRent).toBe(600_000);
    expect(r.grossYieldPct).toBeCloseTo(3, 10);
  });

  it("takes vacancy off the rent actually collected", () => {
    const r = computeYield(base);
    expect(r.collectedAnnualRent).toBeCloseTo(600_000 * (48 / 52), 6);
    expect(r.collectedAnnualRent).toBeLessThan(r.grossAnnualRent);
  });

  it("counts acquisition costs as capital that has to earn its return", () => {
    const r = computeYield(base);
    expect(r.totalCapital).toBe(21_400_000);
    const withoutCosts = computeYield({ ...base, acquisitionCosts: 0 });
    expect(withoutCosts.netYieldPct).toBeGreaterThan(r.netYieldPct);
  });

  it("always reports net below gross once there are costs", () => {
    const r = computeYield(base);
    expect(r.netYieldPct).toBeLessThan(r.grossYieldPct);
    expect(r.yieldGapPct).toBeGreaterThan(0);
  });

  it("matches gross and net exactly when nothing is deducted", () => {
    const r = computeYield({
      ...base,
      monthlyMaintenance: 0,
      annualPropertyTax: 0,
      annualOtherCosts: 0,
      vacancyWeeks: 0,
      acquisitionCosts: 0,
    });
    expect(r.netYieldPct).toBeCloseTo(r.grossYieldPct, 10);
    expect(r.yieldGapPct).toBeCloseTo(0, 10);
  });

  it("does not divide by zero on an empty form", () => {
    const r = computeYield({
      price: 0,
      monthlyRent: 0,
      monthlyMaintenance: 0,
      annualPropertyTax: 0,
      annualOtherCosts: 0,
      vacancyWeeks: 0,
      acquisitionCosts: 0,
    });
    expect(Number.isFinite(r.grossYieldPct)).toBe(true);
    expect(Number.isFinite(r.netYieldPct)).toBe(true);
    expect(r.grossYieldPct).toBe(0);
  });

  it("treats negative input as zero rather than producing nonsense", () => {
    const r = computeYield({ ...base, monthlyRent: -50_000, price: -1 });
    expect(r.grossAnnualRent).toBe(0);
    expect(r.grossYieldPct).toBe(0);
  });

  it("reports payback as infinite when the flat loses money", () => {
    const r = computeYield({ ...base, monthlyRent: 1_000 });
    expect(r.netAnnualIncome).toBeLessThan(0);
    expect(r.paybackYears).toBe(Number.POSITIVE_INFINITY);
  });

  it("caps vacancy at a full year rather than going negative", () => {
    const r = computeYield({ ...base, vacancyWeeks: 80 });
    expect(r.collectedAnnualRent).toBe(0);
  });
});

describe("working backwards to the rent a target needs", () => {
  it("returns a rent that reproduces the target when fed back in", () => {
    const target = 2.5;
    const rent = rentForTargetNetYield(base, target);
    expect(rent).not.toBeNull();
    const check = computeYield({ ...base, monthlyRent: rent! });
    expect(check.netYieldPct).toBeCloseTo(target, 6);
  });

  it("needs a higher rent for a higher target", () => {
    const low = rentForTargetNetYield(base, 2)!;
    const high = rentForTargetNetYield(base, 4)!;
    expect(high).toBeGreaterThan(low);
  });

  it("returns null when there is no capital to earn on", () => {
    expect(
      rentForTargetNetYield({ ...base, price: 0, acquisitionCosts: 0 }, 3),
    ).toBeNull();
  });

  it("returns null when the flat is empty all year", () => {
    expect(rentForTargetNetYield({ ...base, vacancyWeeks: 52 }, 3)).toBeNull();
  });
});
