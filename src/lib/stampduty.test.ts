import { describe, it, expect } from "vitest";
import {
  calculateStampDuty,
  womanBuyerSaving,
  MUMBAI,
  RATE_SOURCES,
  RATES_VERIFIED_ON,
} from "./stampduty";

const CR = 10_000_000;

describe("Mumbai stamp duty", () => {
  it("charges a male buyer 6 percent in total, as 5 plus the 1 percent metro cess", () => {
    const r = calculateStampDuty({ agreementValue: CR, category: "male" });
    expect(r.baseDuty).toBe(500_000);
    expect(r.metroCess).toBe(100_000);
    expect(r.dutyLow).toBe(600_000);
    expect(r.isRange).toBe(false);
  });

  it("charges a sole female buyer 5 percent in total", () => {
    const r = calculateStampDuty({ agreementValue: CR, category: "female" });
    expect(r.baseDuty).toBe(400_000);
    expect(r.metroCess).toBe(100_000);
    expect(r.dutyLow).toBe(500_000);
  });

  it("charges joint male and female ownership the male rate, with no range", () => {
    // The 31 March 2021 concession order applies only where women are the
    // ONLY purchasers, so a male co owner means full Article 25(b) duty.
    // Resolved against the instrument on 16 September 2026; the earlier
    // range of 6 to 6.5 percent reflected secondary sources that were wrong.
    const r = calculateStampDuty({ agreementValue: CR, category: "joint" });
    expect(r.isRange).toBe(false);
    expect(r.dutyLow).toBe(600_000);
    expect(r.dutyHigh).toBe(600_000);
  });

  it("gives joint ownership exactly the male total", () => {
    const male = calculateStampDuty({ agreementValue: CR, category: "male" });
    const joint = calculateStampDuty({ agreementValue: CR, category: "joint" });
    expect(joint.totalLow).toBe(male.totalLow);
  });
});

describe("the ready reckoner floor", () => {
  it("charges on the reckoner value when it is higher than the price", () => {
    // The trap: a flat bought below the government valuation is still taxed on
    // the government valuation.
    const r = calculateStampDuty({
      agreementValue: 8_000_000,
      reckonerValue: CR,
      category: "male",
    });
    expect(r.chargeableValue).toBe(CR);
    expect(r.reckonerGoverns).toBe(true);
    expect(r.dutyLow).toBe(600_000);
  });

  it("charges on the price when the price is higher", () => {
    const r = calculateStampDuty({
      agreementValue: CR,
      reckonerValue: 8_000_000,
      category: "male",
    });
    expect(r.chargeableValue).toBe(CR);
    expect(r.reckonerGoverns).toBe(false);
  });

  it("ignores a missing reckoner value rather than treating it as zero", () => {
    const r = calculateStampDuty({ agreementValue: CR, category: "male" });
    expect(r.chargeableValue).toBe(CR);
    expect(r.reckonerGoverns).toBe(false);
  });
});

describe("registration", () => {
  it("is one percent below the threshold", () => {
    const r = calculateStampDuty({ agreementValue: 2_000_000, category: "male" });
    expect(r.registration).toBe(20_000);
    expect(r.registrationIsCapped).toBe(false);
  });

  it("caps at 30,000 above the threshold", () => {
    const r = calculateStampDuty({ agreementValue: CR, category: "male" });
    expect(r.registration).toBe(MUMBAI.registrationCap);
    expect(r.registrationIsCapped).toBe(true);
  });

  it("lands exactly on the cap at 30 lakh, where the two rules meet", () => {
    const r = calculateStampDuty({ agreementValue: 3_000_000, category: "male" });
    expect(r.registration).toBe(30_000);
  });
});

describe("totals and edge cases", () => {
  it("totals duty plus registration", () => {
    const r = calculateStampDuty({ agreementValue: CR, category: "male" });
    expect(r.totalLow).toBe(r.dutyLow + r.registration);
    expect(r.totalHigh).toBe(r.dutyHigh + r.registration);
  });

  it("returns zeros rather than NaN for empty input", () => {
    const r = calculateStampDuty({ agreementValue: 0, category: "male" });
    for (const v of [r.dutyLow, r.dutyHigh, r.registration, r.totalLow])
      expect(v).toBe(0);
  });

  it("never returns a negative from hostile input", () => {
    const r = calculateStampDuty({
      agreementValue: -5_000_000,
      reckonerValue: -1,
      category: "joint",
    });
    for (const v of [r.chargeableValue, r.dutyLow, r.dutyHigh, r.registration])
      expect(v).toBeGreaterThanOrEqual(0);
  });
});

describe("the woman buyer concession", () => {
  it("is worth one percent of the chargeable value", () => {
    expect(womanBuyerSaving(CR)).toBe(100_000);
    expect(womanBuyerSaving(5_000_000)).toBe(50_000);
  });
});

describe("provenance is not optional", () => {
  it("carries a verified date, because an undated rate is a liability", () => {
    expect(RATES_VERIFIED_ON).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("cites sources, including the primary one", () => {
    expect(RATE_SOURCES.length).toBeGreaterThanOrEqual(3);
    expect(RATE_SOURCES.some((s) => s.url.includes("igrmaharashtra"))).toBe(true);
    for (const s of RATE_SOURCES) expect(s.url).toMatch(/^https:\/\//);
  });
});
