import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { INVEST_FAQS, INVESTOR_WHATSAPP, investWaLink, schemaFaqs } from "./invest";
import { withNumber, withRef } from "./whatsapp-ref";

const SOURCES = [
  "src/lib/invest.ts",
  "src/app/(site)/[locale]/invest/page.tsx",
  "src/components/invest/RateGapChart.tsx",
  "src/components/invest/RateHistoryChart.tsx",
  "src/data/invest/rate-gap.json",
  "src/data/invest/rate-history.json",
  "src/data/invest/timeline.json",
];

describe("invest page", () => {
  it("uses the investor number on every link it builds", () => {
    expect(INVESTOR_WHATSAPP).toBe("917400193974");
    expect(investWaLink("Hi")).toBe("https://wa.me/917400193974?text=Hi");
  });
  it("keeps the Ref tag working on the investor number", () => {
    expect(withRef(investWaLink("Hi"), "(Ref: Invest)")).toContain("917400193974?text=Hi%0A%0A(Ref%3A%20Invest)");
  });
  it("withNumber swaps the number and keeps the message", () => {
    expect(withNumber("https://wa.me/919324974133?text=Hi%20there", "917400193974")).toBe(
      "https://wa.me/917400193974?text=Hi%20there",
    );
    expect(withNumber("tel:+919324974133", "917400193974")).toBe("tel:+919324974133");
  });
  it("leaves placeholder answers out of the markup", () => {
    expect(schemaFaqs([{ question: "q", answer: "has [[X]] in it" }, { question: "q2", answer: "fine" }])).toEqual([
      { question: "q2", answer: "fine" },
    ]);
    expect(schemaFaqs().length).toBe(INVEST_FAQS.length);
  });
  it("carries no dashes and none of the banned wording", () => {
    for (const f of SOURCES) {
      const src = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
      expect(src, f).not.toMatch(/[—–]/);
      expect(src, f).not.toMatch(/guaranteed|assured|\bminimum\b|no risk|goes wrong|go wrong|collapse|overpay|hostage|\bagent\b/i);
      expect(src, f).not.toMatch(/\b(he|his|him)\b/i);
    }
  });
});
