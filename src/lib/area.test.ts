import { describe, it, expect } from "vitest";
import {
  carpetFromSuper,
  superFromCarpet,
  loadingPercent,
  builtUpFromCarpet,
  pricePerCarpetFoot,
  analyse,
  compare,
  loadingVerdict,
  sqftToSqm,
  sqmToSqft,
  LOADING_BENCHMARKS,
  AREA_SOURCES,
} from "./area";

describe("the loading convention", () => {
  it("matches the standard worked example: 1400 at 40 percent gives 1000 carpet", () => {
    // This is the test that pins the convention down. Loading is divided by
    // CARPET. If it were taken on the super built up figure this would return
    // 840, and every other number in the tool would be wrong.
    expect(carpetFromSuper(1400, 40)).toBe(1000);
  });

  it("is not the same as taking the percentage off the super built up figure", () => {
    expect(carpetFromSuper(1400, 40)).not.toBe(1400 * 0.6);
  });

  it("round trips both ways", () => {
    expect(superFromCarpet(1000, 40)).toBe(1400);
    expect(carpetFromSuper(superFromCarpet(850, 32), 32)).toBe(850);
  });

  it("derives the loading from two real areas", () => {
    expect(loadingPercent(1000, 1400)).toBe(40);
    expect(loadingPercent(700, 1000)).toBeCloseTo(42.86, 1);
  });

  it("returns zero rather than NaN or Infinity for empty input", () => {
    expect(carpetFromSuper(0, 40)).toBe(0);
    expect(loadingPercent(0, 1400)).toBe(0);
    expect(loadingPercent(1000, 0)).toBe(0);
    expect(pricePerCarpetFoot(10_000_000, 0)).toBe(0);
  });

  it("treats zero loading as carpet equal to super", () => {
    expect(carpetFromSuper(1000, 0)).toBe(1000);
  });
});

describe("built up", () => {
  it("sits between carpet and super built up", () => {
    const carpet = 1000;
    const built = builtUpFromCarpet(carpet, 12);
    expect(built).toBeGreaterThan(carpet);
    expect(built).toBeLessThan(superFromCarpet(carpet, 40));
  });
});

describe("comparing two flats, which is the point of the tool", () => {
  // The case from our own carpet area draft: the flat with the LOWER headline
  // rate is the worse buy once loading is accounted for.
  const cheaperHeadline = {
    label: "B",
    price: 24_000 * 1000,
    superArea: 1000,
    loadingPct: 40,
  };
  const dearerHeadline = {
    label: "A",
    price: 25_000 * 1000,
    superArea: 1000,
    loadingPct: 25,
  };

  it("prices each flat per carpet foot", () => {
    const a = analyse(dearerHeadline);
    expect(a.ratePerSuperFoot).toBe(25_000);
    expect(a.carpet).toBe(800);
    expect(a.ratePerCarpetFoot).toBe(31_250);
  });

  it("picks the flat that is better value per usable foot", () => {
    const c = compare(dearerHeadline, cheaperHeadline);
    expect(c.betterValue).toBe("a");
  });

  it("flags when the cheaper looking flat is actually the worse buy", () => {
    const c = compare(dearerHeadline, cheaperHeadline);
    expect(c.headlineMisleads).toBe(true);
  });

  it("does not cry wolf when the cheaper flat is genuinely better", () => {
    const c = compare(
      { label: "A", price: 25_000 * 1000, superArea: 1000, loadingPct: 40 },
      { label: "B", price: 24_000 * 1000, superArea: 1000, loadingPct: 25 },
    );
    expect(c.betterValue).toBe("b");
    expect(c.headlineMisleads).toBe(false);
  });

  it("reports no winner when two flats are identical", () => {
    const f = { label: "A", price: 10_000_000, superArea: 1000, loadingPct: 30 };
    const c = compare(f, { ...f, label: "B" });
    expect(c.betterValue).toBeNull();
    expect(c.headlineMisleads).toBe(false);
    expect(c.carpetRateGap).toBe(0);
  });

  it("reports the extra usable space the better flat gives", () => {
    const c = compare(dearerHeadline, cheaperHeadline);
    // 800 carpet against roughly 714.
    expect(c.carpetGap).toBeGreaterThan(80);
  });
});

describe("loading verdict", () => {
  it("grades against the published benchmarks", () => {
    expect(loadingVerdict(20)).toBe("low");
    expect(loadingVerdict(30)).toBe("normal");
    expect(loadingVerdict(45)).toBe("high");
    expect(loadingVerdict(60)).toBe("very high");
  });

  it("puts the Mumbai range above normal, which is the local point", () => {
    expect(loadingVerdict(LOADING_BENCHMARKS.mumbaiLow)).toBe("high");
    expect(LOADING_BENCHMARKS.mumbaiLow).toBeGreaterThan(
      LOADING_BENCHMARKS.normalHigh,
    );
  });
});

describe("units", () => {
  it("converts both ways", () => {
    expect(sqmToSqft(100)).toBe(1076);
    expect(sqftToSqm(1076)).toBeCloseTo(99.96, 1);
  });
});

describe("provenance", () => {
  it("cites sources for the benchmarks", () => {
    expect(AREA_SOURCES.length).toBeGreaterThanOrEqual(2);
    for (const s of AREA_SOURCES) expect(s.url).toMatch(/^https:\/\//);
  });
});
