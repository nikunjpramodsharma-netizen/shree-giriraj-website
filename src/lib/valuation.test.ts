import { describe, it, expect } from "vitest";
import { VALUATION_SUBURBS, askingRange, rangeText, valuationMessage, VALUATION_SOURCES } from "./valuation";

describe("flat valuation data", () => {
  it("covers Borivali, Kandivali and Malad with sourced pockets", () => {
    expect(VALUATION_SUBURBS.map((s) => s.key)).toEqual(["borivali-west", "kandivali", "malad"]);
    for (const s of VALUATION_SUBURBS) {
      expect(s.pockets.length).toBeGreaterThanOrEqual(3);
      expect(s.salePath).toMatch(/^\/areas\/[a-z-]+\/flats-for-sale$/);
      for (const p of s.pockets) {
        expect(p.low).toBeGreaterThan(5000);
        expect(p.high).toBeGreaterThanOrEqual(p.low);
        expect(p.note).toMatch(/20\d\d|undated/);
      }
    }
  });

  it("leads Borivali West with the resale carpet median used on the resale page", () => {
    expect(VALUATION_SUBURBS[0].pockets[0].low).toBe(36228);
  });
});

describe("asking range", () => {
  it("multiplies the rate by the area", () => {
    expect(askingRange({ low: 30000, high: 33000 }, 650)).toEqual({ low: 19_500_000, high: 21_450_000 });
    expect(rangeText({ low: 19_500_000, high: 21_450_000 })).toBe("₹1.95 crore to ₹2.15 crore");
    expect(rangeText({ low: 9_250_000, high: 9_250_000 })).toBe("₹92.5 lakh");
  });

  it("refuses an implausible area", () => {
    expect(askingRange({ low: 30000, high: 30000 }, 50)).toBeNull();
    expect(askingRange({ low: 30000, high: 30000 }, Number.NaN)).toBeNull();
  });
});

describe("seller message", () => {
  const msg = valuationMessage({
    place: "Kandivali West",
    pocket: "Mahavir Nagar",
    sqft: 700,
    age: "10 to 25 years",
    floor: "4th to 10th",
    lift: "Yes",
    range: { low: 25_515_000, high: 25_515_000 },
  });

  it("carries the inputs and asks for registered sales", () => {
    expect(msg).toContain("Area: Kandivali West. Rate I used: Mahavir Nagar.");
    expect(msg).toContain("700 sq ft");
    expect(msg).toContain("₹2.55 crore");
    expect(msg).toContain("registered sales near my building");
    expect(msg).toContain("Society: ___");
  });

  it("has no dashes and never calls the firm an agent", () => {
    const all = JSON.stringify([msg, VALUATION_SOURCES.map((s) => s.label), VALUATION_SUBURBS]);
    expect(all).not.toMatch(/[—–]/);
    expect(all).not.toMatch(/\bagent\b/i);
  });
});
