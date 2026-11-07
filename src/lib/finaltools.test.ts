import { describe, it, expect } from "vitest";
import {
  calculateCapitalGains,
  LONG_TERM_MONTHS,
  LTCG_RATE_NEW,
  CG_SOURCES,
} from "./capitalgains";
import {
  calculatePropertyTax,
  ageWeight,
  floorWeight,
  USER_WEIGHT,
  TAX_RATE_PCT,
  BUILDING_WEIGHT,
  EXEMPT_UPTO_SQFT,
  SQM_PER_SQFT,
  PT_SOURCES,
} from "./propertytax";
import {
  SCOPE,
  COST_BANDS_READY,
  defaultSelection,
  buildScope,
  scopeTotals,
  groupsOf,
} from "./interiors";

/* ------------------------------------------------------- capital gains */

const cgBase = {
  purchasePrice: 5_000_000,
  purchaseDate: "2015-06-01",
  salePrice: 12_000_000,
  saleDate: "2026-06-01",
  transferExpenses: 200_000,
  improvements: 300_000,
  isResidentIndividualOrHuf: true,
};

describe("capital gains: long and short term", () => {
  it("treats more than 24 months as long term", () => {
    const r = calculateCapitalGains(cgBase);
    expect(r.holdingMonths).toBeGreaterThan(LONG_TERM_MONTHS);
    expect(r.isLongTerm).toBe(true);
  });

  it("treats 24 months or less as short term and refuses to guess a slab", () => {
    const r = calculateCapitalGains({
      ...cgBase,
      purchaseDate: "2025-06-01",
      saleDate: "2026-06-01",
    });
    expect(r.isLongTerm).toBe(false);
    expect(r.taxPayable).toBeNull();
    expect(r.gain).toBeGreaterThan(0);
  });

  it("deducts transfer expenses and improvements from the gain", () => {
    const r = calculateCapitalGains(cgBase);
    expect(r.netCost).toBe(5_500_000);
    expect(r.gain).toBe(6_500_000);
  });

  it("taxes long term gains at 12.5 percent without indexation", () => {
    const r = calculateCapitalGains(cgBase);
    expect(r.taxNoIndexation).toBe((6_500_000 * LTCG_RATE_NEW) / 100);
  });
});

describe("capital gains: the July 2024 grandfathering", () => {
  it("offers indexation to a resident who bought before 23 July 2024", () => {
    expect(calculateCapitalGains(cgBase).indexationAvailable).toBe(true);
  });

  it("does not offer it for a purchase on or after 23 July 2024", () => {
    const r = calculateCapitalGains({ ...cgBase, purchaseDate: "2024-08-01" });
    expect(r.indexationAvailable).toBe(false);
  });

  it("does not offer it to a non resident or a company", () => {
    const r = calculateCapitalGains({
      ...cgBase,
      isResidentIndividualOrHuf: false,
    });
    expect(r.indexationAvailable).toBe(false);
  });

  it("says it needs the CII rather than silently skipping the option", () => {
    const r = calculateCapitalGains(cgBase);
    expect(r.indexationNeedsCii).toBe(true);
    expect(r.taxWithIndexation).toBeNull();
  });

  it("computes the indexed option once the CII figures are supplied", () => {
    const r = calculateCapitalGains({ ...cgBase, ciiPurchase: 254, ciiSale: 376 });
    // (50L + 3L) x 376/254 + 2L expenses
    expect(r.indexedCost).toBe(Math.round((5_300_000 * 376) / 254) + 200_000);
    expect(r.taxWithIndexation).not.toBeNull();
  });

  it("picks whichever option costs less", () => {
    const r = calculateCapitalGains({ ...cgBase, ciiPurchase: 254, ciiSale: 376 });
    expect(r.taxPayable).toBe(
      Math.min(r.taxNoIndexation!, r.taxWithIndexation!),
    );
    expect(r.bestOption).toBe(
      r.taxWithIndexation! < r.taxNoIndexation! ? "withIndexation" : "noIndexation",
    );
  });

  it("never returns a negative tax on a loss", () => {
    const r = calculateCapitalGains({ ...cgBase, salePrice: 1_000_000 });
    expect(r.gain).toBeLessThan(0);
    expect(r.taxNoIndexation).toBe(0);
  });
});

/* -------------------------------------------------------- property tax */

const ptBase = {
  carpetSqft: 650,
  reckonerRatePerSqm: 103_630,
  building: "rcc" as const,
  ageYears: 18,
  floor: 3,
  hasLift: true,
  user: "residential" as const,
};

describe("BMC property tax: MCGM's official weights and rates", () => {
  it("uses the Schedule A user weights and the rate table totals", () => {
    expect(USER_WEIGHT.residential).toBe(0.5);
    expect(USER_WEIGHT.commercial).toBe(0.8);
    expect(TAX_RATE_PCT.residential).toBe(0.775);
    expect(TAX_RATE_PCT.commercial).toBe(1.9);
  });

  it("uses the Schedule B building weights", () => {
    expect(BUILDING_WEIGHT).toEqual({ rcc: 1, pucca: 0.7, chawl: 0.5 });
  });

  it("uses the Schedule C age bands", () => {
    expect(ageWeight(0)).toBe(1);
    expect(ageWeight(5)).toBe(1);
    expect(ageWeight(6)).toBe(0.95);
    expect(ageWeight(18)).toBe(0.85);
    expect(ageWeight(30)).toBe(0.75);
    expect(ageWeight(49)).toBe(0.55);
    expect(ageWeight(50)).toBe(0.5);
  });

  it("applies the Schedule D floor factor only to an RCC building with a lift", () => {
    expect(floorWeight(0, "rcc", true)).toBe(1);
    expect(floorWeight(4, "rcc", true)).toBe(1);
    expect(floorWeight(5, "rcc", true)).toBe(1.05);
    expect(floorWeight(20, "rcc", true)).toBe(1.1);
    expect(floorWeight(31, "rcc", true)).toBe(1.2);
    expect(floorWeight(101, "rcc", true)).toBe(1.35);
    expect(floorWeight(-1, "rcc", true)).toBe(0.7);
    expect(floorWeight(12, "rcc", false)).toBe(1);
    expect(floorWeight(12, "pucca", true)).toBe(1);
  });

  it("cites MCGM's own documents", () => {
    expect(PT_SOURCES.some((s) => s.url.includes("ptaxportal.mcgm.gov.in"))).toBe(true);
  });
});

describe("BMC property tax: capital value and tax", () => {
  it("reproduces the worked example in the blog post", () => {
    // 1,03,630 x 0.50 x 1.00 x 0.85 x 1.00 x 650 sq ft in sq m
    const r = calculatePropertyTax(ptBase);
    const cv = Math.round(103_630 * 0.5 * 1 * 0.85 * 1 * 650 * SQM_PER_SQFT);
    expect(r.capitalValue).toBe(cv);
    expect(r.capitalValue).toBeGreaterThan(2_650_000);
    expect(r.capitalValue).toBeLessThan(2_670_000);
    expect(r.taxPayable).toBe(Math.round((cv * 0.775) / 100));
    expect(Math.round(r.taxPayable / 100) * 100).toBe(20_600);
  });

  it("applies the building, age and floor weights", () => {
    const r = calculatePropertyTax({
      ...ptBase,
      building: "chawl",
      ageYears: 60,
      floor: 12,
    });
    expect(r.buildingWeight).toBe(0.5);
    expect(r.ageWeight).toBe(0.5);
    expect(r.floorWeight).toBe(1);
    expect(r.capitalValue).toBe(
      Math.round(103_630 * 0.5 * 0.5 * 0.5 * 650 * SQM_PER_SQFT),
    );
  });

  it("charges a shop or office the commercial weight and rate", () => {
    const r = calculatePropertyTax({ ...ptBase, user: "commercial" });
    expect(r.userWeight).toBe(0.8);
    expect(r.taxRatePct).toBe(1.9);
    expect(r.taxPayable).toBe(Math.round((r.capitalValue * 1.9) / 100));
  });
});

describe("BMC property tax: the 500 sq ft exemption", () => {
  it("exempts a home of 500 sq ft carpet or less", () => {
    const r = calculatePropertyTax({ ...ptBase, carpetSqft: 500 });
    expect(r.exempt).toBe(true);
    expect(r.taxPayable).toBe(0);
    expect(r.taxBeforeExemption).toBeGreaterThan(0);
  });

  it("charges the full tax above 500 sq ft, with no unverified concession", () => {
    const r = calculatePropertyTax({ ...ptBase, carpetSqft: 501 });
    expect(r.exempt).toBe(false);
    expect(r.taxPayable).toBe(r.taxBeforeExemption);
  });

  it("does not exempt a small shop or office", () => {
    const r = calculatePropertyTax({
      ...ptBase,
      carpetSqft: 400,
      user: "commercial",
    });
    expect(r.exempt).toBe(false);
    expect(r.taxPayable).toBeGreaterThan(0);
  });

  it("uses the documented threshold", () => {
    expect(EXEMPT_UPTO_SQFT).toBe(500);
  });
});

/* ----------------------------------------------------------- interiors */

describe("interiors scope builder", () => {
  it("publishes no invented cost bands", () => {
    expect(COST_BANDS_READY).toBe(false);
    for (const item of SCOPE) expect(item.band).toBeNull();
  });

  it("reports no total while there are no bands, rather than a zero", () => {
    const t = scopeTotals(buildScope(defaultSelection()));
    expect(t.priced).toBe(false);
    expect(t.low).toBeNull();
  });

  it("drops anything with no quantity against it", () => {
    const lines = buildScope({ wardrobe: 12 });
    expect(lines).toHaveLength(1);
    expect(lines[0].item.id).toBe("wardrobe");
  });

  it("gives every item a specification prompt, which is the whole point", () => {
    for (const item of SCOPE) expect(item.specPrompt.length).toBeGreaterThan(10);
  });

  it("groups lines for a readable scope document", () => {
    expect(groupsOf(buildScope(defaultSelection())).length).toBeGreaterThan(1);
  });
});

describe("provenance on both tax tools", () => {
  it("cites primary sources", () => {
    expect(CG_SOURCES.some((s) => s.url.includes("incometaxindia.gov.in"))).toBe(
      true,
    );
    expect(PT_SOURCES.some((s) => s.url.includes("igrmaharashtra"))).toBe(true);
  });
});

import { ciiForDate, financialYearOf, CII_TABLE } from "./capitalgains";
import { allAreas } from "./area";

describe("cost inflation index table", () => {
  it("finds the financial year of a date", () => {
    expect(financialYearOf("2015-06-01")).toBe("2015-16");
    expect(financialYearOf("2026-03-31")).toBe("2025-26");
    expect(financialYearOf("2026-04-01")).toBe("2026-27");
    expect(financialYearOf("1999-12-31")).toBe("1999-00");
  });
  it("returns the notified values, and nothing outside the table", () => {
    expect(ciiForDate("2015-06-01")).toBe(254);
    expect(ciiForDate("2024-07-22")).toBe(363);
    expect(ciiForDate("2026-06-01")).toBe(384);
    expect(ciiForDate("2000-06-01")).toBeUndefined();
    expect(Object.keys(CII_TABLE)).toHaveLength(26);
  });
});

describe("allAreas, every direction", () => {
  it("starts from super built up", () => {
    expect(allAreas("super", 1400, 40, 12)).toEqual({ carpet: 1000, builtUp: 1120, superArea: 1400 });
  });
  it("starts from carpet", () => {
    expect(allAreas("carpet", 1000, 40, 12)).toEqual({ carpet: 1000, builtUp: 1120, superArea: 1400 });
  });
  it("starts from built up", () => {
    expect(allAreas("builtUp", 1120, 40, 12)).toEqual({ carpet: 1000, builtUp: 1120, superArea: 1400 });
  });
  it("returns zeros for no input", () => {
    expect(allAreas("carpet", 0, 40, 12)).toEqual({ carpet: 0, builtUp: 0, superArea: 0 });
  });
});
