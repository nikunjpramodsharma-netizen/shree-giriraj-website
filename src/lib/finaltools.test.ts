import { describe, it, expect } from "vitest";
import {
  calculateCapitalGains,
  LONG_TERM_MONTHS,
  LTCG_RATE_NEW,
  CG_SOURCES,
} from "./capitalgains";
import {
  calculatePropertyTax,
  CONSTRUCTION_WEIGHT,
  AGE_WEIGHT,
  EXEMPT_UPTO_SQFT,
  CONCESSION_UPTO_SQFT,
  CONCESSION_PCT,
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
  carpetSqft: 800,
  reckonerRatePerSqft: 20_000,
  construction: "rcc" as const,
  age: "post1985" as const,
  user: "residential" as const,
  taxRatePct: 0,
};

describe("BMC property tax: capital value", () => {
  it("multiplies reckoner rate, carpet area and the weights", () => {
    const r = calculatePropertyTax(ptBase);
    expect(r.capitalValue).toBe(800 * 20_000 * 1 * 1);
  });

  it("applies the construction and age weights", () => {
    const r = calculatePropertyTax({
      ...ptBase,
      construction: "nonRcc",
      age: "pre1945",
    });
    expect(r.constructionWeight).toBe(CONSTRUCTION_WEIGHT.nonRcc);
    expect(r.ageWeight).toBe(AGE_WEIGHT.pre1945);
    expect(r.capitalValue).toBe(Math.round(800 * 20_000 * 0.6 * 0.8));
  });
});

describe("BMC property tax: the size relief, which is the point", () => {
  it("exempts a residential flat of 500 sq ft or less", () => {
    const r = calculatePropertyTax({ ...ptBase, carpetSqft: 500 });
    expect(r.exemption).toBe("exempt");
    expect(r.concessionPct).toBe(100);
  });

  it("gives a 60 percent concession between 500 and 700 sq ft", () => {
    const r = calculatePropertyTax({ ...ptBase, carpetSqft: 650 });
    expect(r.exemption).toBe("concession");
    expect(r.concessionPct).toBe(CONCESSION_PCT);
  });

  it("gives nothing above 700 sq ft", () => {
    expect(calculatePropertyTax({ ...ptBase, carpetSqft: 701 }).exemption).toBe(
      "none",
    );
  });

  it("does not apply the relief to commercial property", () => {
    const r = calculatePropertyTax({
      ...ptBase,
      carpetSqft: 400,
      user: "commercial",
    });
    expect(r.exemption).toBe("none");
  });

  it("uses the documented thresholds", () => {
    expect(EXEMPT_UPTO_SQFT).toBe(500);
    expect(CONCESSION_UPTO_SQFT).toBe(700);
  });
});

describe("BMC property tax: the unverified rate is an input, not a guess", () => {
  it("reports capital value only when no tax rate is supplied", () => {
    const r = calculatePropertyTax(ptBase);
    expect(r.hasTaxRate).toBe(false);
    expect(r.taxPayable).toBeNull();
    expect(r.capitalValue).toBeGreaterThan(0);
  });

  it("computes the tax once a rate is supplied", () => {
    const r = calculatePropertyTax({ ...ptBase, taxRatePct: 0.5 });
    expect(r.taxBeforeRelief).toBe(Math.round(16_000_000 * 0.005));
    expect(r.taxPayable).toBe(r.taxBeforeRelief);
  });

  it("applies the concession to the computed tax", () => {
    const r = calculatePropertyTax({
      ...ptBase,
      carpetSqft: 650,
      taxRatePct: 0.5,
    });
    expect(r.taxPayable).toBe(Math.round(r.taxBeforeRelief! * 0.4));
  });

  it("charges nothing on an exempt flat", () => {
    const r = calculatePropertyTax({
      ...ptBase,
      carpetSqft: 450,
      taxRatePct: 0.5,
    });
    expect(r.taxPayable).toBe(0);
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
