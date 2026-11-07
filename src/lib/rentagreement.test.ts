import { describe, it, expect } from "vitest";
import { calculateRentAgreement, LEAVE_LICENCE } from "./rentagreement";
import { mhadaTransferFee, MHADA_TRANSFER_RATES } from "./mhada-transfer-fee";

/* -------------------------------------------- rent agreement, Article 36A */

describe("leave and licence stamp duty", () => {
  it("charges 0.25 percent of rent plus 10 percent interest on the deposit", () => {
    // 30,000 x 11 = 3,30,000 rent; 90,000 x 10% x 1 year = 9,000 interest.
    const r = calculateRentAgreement({ monthlyRent: 30_000, months: 11, refundableDeposit: 90_000 });
    expect(r.totalRent).toBe(330_000);
    expect(r.interestYears).toBe(1);
    expect(r.notionalInterest).toBe(9_000);
    expect(r.dutiableAmount).toBe(339_000);
    expect(r.stampDuty).toBe(848); // 847.5 rounds to 848
    expect(r.minimumApplied).toBe(false);
  });

  it("adds the registration fee and handling charge to the total", () => {
    const r = calculateRentAgreement({ monthlyRent: 30_000, months: 11, refundableDeposit: 90_000 });
    expect(r.registrationFee).toBe(1_000);
    expect(r.handlingCharge).toBe(300);
    expect(r.total).toBe(848 + 1_000 + 300);
  });

  it("counts a part year of deposit interest as a full year, as the IGR calculator does", () => {
    const at = (months: number) =>
      calculateRentAgreement({ monthlyRent: 0, months, refundableDeposit: 100_000 }).interestYears;
    expect(at(1)).toBe(1);
    expect(at(12)).toBe(1);
    expect(at(13)).toBe(2);
    expect(at(24)).toBe(2);
    expect(at(25)).toBe(3);
    expect(at(49)).toBe(5);
    expect(at(60)).toBe(5);
  });

  it("counts a non refundable amount in full", () => {
    const r = calculateRentAgreement({ monthlyRent: 20_000, months: 12, nonRefundable: 40_000 });
    expect(r.dutiableAmount).toBe(240_000 + 40_000);
    expect(r.stampDuty).toBe(700);
  });

  it("sums a yearly increase year by year, with a short final year", () => {
    const r = calculateRentAgreement({
      monthlyRent: 25_000,
      months: 30,
      yearlyIncreasePct: 5,
      refundableDeposit: 150_000,
    });
    expect(r.schedule).toEqual([
      { year: 1, months: 12, monthlyRent: 25_000, rent: 300_000 },
      { year: 2, months: 12, monthlyRent: 26_250, rent: 315_000 },
      { year: 3, months: 6, monthlyRent: 27_563, rent: 165_378 },
    ]);
    expect(r.totalRent).toBe(780_378);
    expect(r.notionalInterest).toBe(45_000); // 1,50,000 x 10% x 3 years
    // (7,80,378 + 45,000) x 0.25% = 2,063.445
    expect(r.stampDuty).toBe(2_063);
  });

  it("matches the official formula for a 24 month fixed rent", () => {
    // ((rent x months) + deposit x 0.10 x years + non refundable) x 0.25 / 100
    const rent = 45_000, months = 24, dep = 135_000, nonRef = 10_000;
    const official = Math.round(((rent * months + dep * 0.1 * 2 + nonRef) * 0.25) / 100);
    const r = calculateRentAgreement({
      monthlyRent: rent,
      months,
      refundableDeposit: dep,
      nonRefundable: nonRef,
    });
    expect(r.stampDuty).toBe(official);
  });

  it("never charges less than the 100 rupee minimum", () => {
    const r = calculateRentAgreement({ monthlyRent: 2_000, months: 11 });
    // 22,000 x 0.25% = 55
    expect(r.stampDuty).toBe(LEAVE_LICENCE.minDuty);
    expect(r.minimumApplied).toBe(true);
  });

  it("keeps the term between 1 and 60 months", () => {
    expect(calculateRentAgreement({ monthlyRent: 10_000, months: 72 }).months).toBe(60);
    expect(calculateRentAgreement({ monthlyRent: 10_000, months: 0 }).months).toBe(1);
  });

  it("treats blank or negative inputs as zero", () => {
    const r = calculateRentAgreement({
      monthlyRent: NaN,
      months: 11,
      refundableDeposit: -5,
      nonRefundable: undefined,
      yearlyIncreasePct: -10,
    });
    expect(r.totalRent).toBe(0);
    expect(r.notionalInterest).toBe(0);
    expect(r.stampDuty).toBe(100);
  });
});

/* ------------------------------------------------ MHADA transfer charges */

describe("MHADA transfer fee", () => {
  it("uses the guide's rates and caps", () => {
    expect(MHADA_TRANSFER_RATES.LIG).toMatchObject({ ratePerSqft: 45, cap: 15_000 });
    expect(MHADA_TRANSFER_RATES.MIG).toMatchObject({ ratePerSqft: 55, cap: 25_000 });
    expect(MHADA_TRANSFER_RATES.HIG).toMatchObject({ ratePerSqft: 60, cap: 35_000 });
  });

  it("reproduces the guide's four worked examples", () => {
    expect(mhadaTransferFee("LIG", 250).charge).toBe(11_250);
    const lig400 = mhadaTransferFee("LIG", 400);
    expect(lig400.uncapped).toBe(18_000);
    expect(lig400.charge).toBe(15_000);
    expect(lig400.capApplied).toBe(true);
    expect(mhadaTransferFee("MIG", 420).charge).toBe(23_100);
    const hig650 = mhadaTransferFee("HIG", 650);
    expect(hig650.uncapped).toBe(39_000);
    expect(hig650.charge).toBe(35_000);
  });

  it("does not apply the cap below it, and reaches it where the guide says", () => {
    expect(mhadaTransferFee("LIG", 333).capApplied).toBe(false); // 14,985
    expect(mhadaTransferFee("LIG", 334).charge).toBe(15_000); // 15,030 capped
    expect(mhadaTransferFee("MIG", 455).charge).toBe(25_000); // 25,025 capped
    expect(mhadaTransferFee("HIG", 584).charge).toBe(35_000); // 35,040 capped
    expect(mhadaTransferFee("HIG", 583).capApplied).toBe(false); // 34,980
  });

  it("returns zero for a blank or negative area", () => {
    expect(mhadaTransferFee("MIG", NaN).charge).toBe(0);
    expect(mhadaTransferFee("MIG", -100).charge).toBe(0);
  });
});
