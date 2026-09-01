/**
 * Carpet, built up, super built up, and what you are actually paying for.
 *
 * THE CONVENTION, because getting it backwards changes the answer
 *
 *   Loading % = (Super built up - Carpet) / Carpet x 100
 *
 * Divided by CARPET, not by super built up. Verified against the standard
 * worked example: 1,400 sq ft super built up at 40 percent loading gives
 * exactly 1,000 sq ft carpet. If loading were taken on the super built up
 * figure the same flat would give 840, which is a 160 sq ft difference on one
 * flat, so this is worth being sure about.
 *
 * Rearranged, that means:
 *   carpet = super / (1 + loading/100)
 *   super  = carpet * (1 + loading/100)
 *
 * THE DIFFERENTIATOR
 *
 * Every other carpet area calculator converts one number into another. That is
 * useful and it is not the decision anyone is actually making.
 *
 * The decision is which of two flats is better value, and the headline rate
 * cannot answer it, because the rate is quoted on super built up while you
 * live on carpet. A flat at a higher rate with low loading routinely beats a
 * cheaper looking one with high loading. So this compares two flats on price
 * per carpet foot, which is the only comparable number.
 *
 * BENCHMARKS, sourced not invented
 * 25 to 35 percent is widely described as normal and above 40 percent as high.
 * Mumbai runs the highest loading in India at roughly 40 to 50 percent, which
 * is exactly why this tool matters more here than it would elsewhere.
 */

export const LOADING_BENCHMARKS = {
  normalLow: 25,
  normalHigh: 35,
  highThreshold: 40,
  mumbaiLow: 40,
  mumbaiHigh: 50,
} as const;

export const AREA_SOURCES: { label: string; url: string }[] = [
  {
    label: "Kalpataru, what is loading factor in real estate",
    url: "https://www.kalpataru.com/blogs/what-is-loading-factor-in-real-estate",
  },
  {
    label: "NoBroker, super built up area versus carpet area",
    url: "https://www.nobroker.in/blog/super-built-up-area-vs-carpet-area-calculation-guide/",
  },
];

export const AREA_SOURCES_CHECKED_ON = "2026-09-01";

const r0 = (n: number) => Math.round(n);
const r2 = (n: number) => Math.round(n * 100) / 100;
const safe = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Carpet area implied by a quoted super built up figure and a loading percent. */
export function carpetFromSuper(superArea: number, loadingPct: number): number {
  const s = safe(superArea);
  const l = Math.max(0, loadingPct);
  if (s === 0) return 0;
  return r0(s / (1 + l / 100));
}

/** Super built up implied by a carpet figure and a loading percent. */
export function superFromCarpet(carpet: number, loadingPct: number): number {
  const c = safe(carpet);
  return c === 0 ? 0 : r0(c * (1 + Math.max(0, loadingPct) / 100));
}

/** The loading actually being applied, when both real numbers are known. */
export function loadingPercent(carpet: number, superArea: number): number {
  const c = safe(carpet);
  const s = safe(superArea);
  if (c === 0 || s === 0) return 0;
  return r2(((s - c) / c) * 100);
}

/**
 * Built up area: carpet plus wall thickness, and usually a share of the
 * balcony.
 *
 * The percentage is a caller supplied input rather than a constant, because
 * the commonly quoted 10 to 15 percent is a rule of thumb that has not been
 * verified for this site. See content/drafts/carpet-area-vs-built-up-area.md.
 */
export function builtUpFromCarpet(carpet: number, wallPct: number): number {
  const c = safe(carpet);
  return c === 0 ? 0 : r0(c * (1 + Math.max(0, wallPct) / 100));
}

/** What you pay for each square foot you can actually stand on. */
export function pricePerCarpetFoot(price: number, carpet: number): number {
  const c = safe(carpet);
  return c === 0 ? 0 : r0(safe(price) / c);
}

export type Flat = {
  label: string;
  /** The quoted price for the whole flat. */
  price: number;
  /** The area the price is quoted against, normally super built up. */
  superArea: number;
  loadingPct: number;
};

export type FlatResult = Flat & {
  carpet: number;
  ratePerSuperFoot: number;
  ratePerCarpetFoot: number;
};

export function analyse(flat: Flat): FlatResult {
  const carpet = carpetFromSuper(flat.superArea, flat.loadingPct);
  return {
    ...flat,
    carpet,
    ratePerSuperFoot: pricePerCarpetFoot(flat.price, flat.superArea),
    ratePerCarpetFoot: pricePerCarpetFoot(flat.price, carpet),
  };
}

export type Comparison = {
  a: FlatResult;
  b: FlatResult;
  /** Which is better value per carpet foot, or null when they are level. */
  betterValue: "a" | "b" | null;
  /** True when the flat with the LOWER headline rate is the worse buy. */
  headlineMisleads: boolean;
  /** Difference in rate per carpet foot. */
  carpetRateGap: number;
  /** Extra usable space the better flat gives, in square feet. */
  carpetGap: number;
};

/**
 * Compare two flats on the only basis that is comparable.
 *
 * `headlineMisleads` is the finding worth surfacing: it is true when the flat
 * advertised at the lower rate per square foot is the one that costs more per
 * square foot you can actually use.
 */
export function compare(a: Flat, b: Flat): Comparison {
  const ra = analyse(a);
  const rb = analyse(b);

  let betterValue: "a" | "b" | null = null;
  if (ra.ratePerCarpetFoot > 0 && rb.ratePerCarpetFoot > 0) {
    if (ra.ratePerCarpetFoot < rb.ratePerCarpetFoot) betterValue = "a";
    else if (rb.ratePerCarpetFoot < ra.ratePerCarpetFoot) betterValue = "b";
  }

  let cheaperHeadline: "a" | "b" | null = null;
  if (ra.ratePerSuperFoot > 0 && rb.ratePerSuperFoot > 0) {
    if (ra.ratePerSuperFoot < rb.ratePerSuperFoot) cheaperHeadline = "a";
    else if (rb.ratePerSuperFoot < ra.ratePerSuperFoot) cheaperHeadline = "b";
  }

  return {
    a: ra,
    b: rb,
    betterValue,
    headlineMisleads:
      betterValue !== null &&
      cheaperHeadline !== null &&
      betterValue !== cheaperHeadline,
    carpetRateGap: Math.abs(ra.ratePerCarpetFoot - rb.ratePerCarpetFoot),
    carpetGap: Math.abs(ra.carpet - rb.carpet),
  };
}

export type LoadingVerdict = "low" | "normal" | "high" | "very high";

/** Where a loading figure sits against what is normal, and against Mumbai. */
export function loadingVerdict(pct: number): LoadingVerdict {
  if (pct < LOADING_BENCHMARKS.normalLow) return "low";
  if (pct <= LOADING_BENCHMARKS.normalHigh) return "normal";
  if (pct <= LOADING_BENCHMARKS.mumbaiHigh) return "high";
  return "very high";
}

/* --------------------------------------------------------------- units */

const SQFT_PER_SQM = 10.7639;

export function sqftToSqm(sqft: number): number {
  return r2(safe(sqft) / SQFT_PER_SQM);
}

export function sqmToSqft(sqm: number): number {
  return r0(safe(sqm) * SQFT_PER_SQM);
}
