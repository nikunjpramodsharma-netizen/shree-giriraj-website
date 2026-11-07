import { describe, it, expect } from "vitest";
import { stampRatesTable, stampExamples, yieldExample } from "./tool-examples";
import { TOOL_AUDIENCE, TOOLS_HUB_FAQS } from "./tool-audience";
import { TOOLS } from "./tools";

describe("stamp duty page tables", () => {
  it("shows 6, 5 and 6 percent with the duty on one crore", () => {
    expect(stampRatesTable()).toEqual([
      { buyer: "Man", ratePct: 6, dutyOnCrore: 600_000 },
      { buyer: "Woman, sole name", ratePct: 5, dutyOnCrore: 500_000 },
      { buyer: "Man and woman jointly", ratePct: 6, dutyOnCrore: 600_000 },
    ]);
  });
  it("works the three examples", () => {
    const ex = stampExamples();
    expect(ex.manFlat.dutyLow).toBe(720_000);
    expect(ex.manFlat.registration).toBe(30_000);
    expect(ex.womanFlat.dutyLow).toBe(600_000);
    expect(ex.saving).toBe(120_000);
    expect(ex.withReckoner.chargeableValue).toBe(5_200_000);
    expect(ex.withReckoner.dutyLow).toBe(312_000);
    expect(ex.withoutReckoner.dutyLow).toBe(270_000);
  });
});

describe("rental yield example", () => {
  it("is the page's default figures", () => {
    const { result } = yieldExample();
    expect(result.grossYieldPct).toBeCloseTo(3, 5);
    expect(result.netYieldPct).toBeGreaterThan(0);
    expect(result.netYieldPct).toBeLessThan(result.grossYieldPct);
  });
});

describe("hub copy", () => {
  it("has a line for every tool that exists today it knows about", () => {
    for (const k of Object.keys(TOOL_AUDIENCE)) expect(TOOLS.some((t) => t.slug === k)).toBe(true);
  });
  it("has three questions and no dashes", () => {
    expect(TOOLS_HUB_FAQS).toHaveLength(3);
    const all = JSON.stringify([TOOL_AUDIENCE, TOOLS_HUB_FAQS]);
    expect(all).not.toMatch(/[—–]/);
    expect(all).not.toMatch(/\bagent\b/i);
  });
});
