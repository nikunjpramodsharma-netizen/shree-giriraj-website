/**
 * "What is my flat worth?" for sellers in Borivali, Kandivali and Malad.
 *
 * The numbers are the same sourced asking rates the flats for sale pages
 * already publish (src/lib/flats.ts), pocket by pocket, with the source and
 * month on every row. Nothing new is invented here: the tool multiplies a
 * published rate by the seller's own area and says plainly that the answer is
 * an asking range, not a valuation.
 *
 * WHY THE EXTRA QUESTIONS ARE NOT IN THE SUM. Age, floor and a lift move a
 * flat within its pocket's range, but no source publishes by how much for
 * these suburbs, so the tool does not pretend to know. They go into the
 * WhatsApp message instead, where the firm answers with registered sales near
 * the seller's own building. That reply is the real valuation, and it is the
 * reason the seller writes to us.
 */

import { listingsFor, listingPath, type EstimatorPocket } from "@/lib/flats";

export const VALUATION_CHECKED_ON = "17 November 2026";

export type ValuationSuburb = {
  /** The area slug, for example "borivali-west". */
  key: string;
  place: string;
  /** The flats for sale page for this suburb. */
  salePath: string;
  pockets: EstimatorPocket[];
};

/**
 * Mumbai Property Exchange's resale median for Borivali West is on carpet
 * area, the figure most sellers have on their agreement, so it leads that
 * suburb's list. Same figure and date as the resale service page.
 */
const BORIVALI_RESALE_CARPET: EstimatorPocket = {
  label: "Borivali West resale median, carpet",
  low: 36228,
  high: 36228,
  note: "Mumbai Property Exchange, week ending 15 November 2026",
};

export const VALUATION_SUBURBS: ValuationSuburb[] = listingsFor("sale")
  .filter((l) => l.pockets && l.pockets.length > 0)
  .map((l) => ({
    key: l.area,
    place: l.place,
    salePath: listingPath(l),
    pockets: l.area === "borivali-west" ? [BORIVALI_RESALE_CARPET, ...(l.pockets ?? [])] : [...(l.pockets ?? [])],
  }));

export const AGE_BANDS = ["Under 10 years", "10 to 25 years", "Over 25 years", "Not sure"] as const;
export const FLOOR_BANDS = ["Ground to 3rd", "4th to 10th", "11th and above"] as const;
export const LIFT_CHOICES = ["Yes", "No"] as const;

export type AgeBand = (typeof AGE_BANDS)[number];
export type FloorBand = (typeof FLOOR_BANDS)[number];
export type LiftChoice = (typeof LIFT_CHOICES)[number];

export const MIN_SQFT = 150;
export const MAX_SQFT = 10000;

/** The asking range for a flat of `sqft` at a pocket's published rate. Null when the area is not plausible. */
export function askingRange(pocket: Pick<EstimatorPocket, "low" | "high">, sqft: number): { low: number; high: number } | null {
  if (!Number.isFinite(sqft) || sqft < MIN_SQFT || sqft > MAX_SQFT) return null;
  return { low: Math.round(pocket.low * sqft), high: Math.round(pocket.high * sqft) };
}

/** "1.85 crore" or "92.5 lakh", the way prices are said here. */
export function lakhOrCrore(n: number): string {
  if (n >= 1e7) return `${(n / 1e7).toFixed(2)} crore`;
  return `${(n / 1e5).toFixed(1)} lakh`;
}

export function rangeText(r: { low: number; high: number }): string {
  return r.low === r.high ? `₹${lakhOrCrore(r.low)}` : `₹${lakhOrCrore(r.low)} to ₹${lakhOrCrore(r.high)}`;
}

export type ValuationInput = {
  place: string;
  pocket: string;
  sqft: number | null;
  age: AgeBand;
  floor: FloorBand;
  lift: LiftChoice;
  range: { low: number; high: number } | null;
};

/**
 * The seller's WhatsApp message. Blanks (___) are left for the two things the
 * site never asks for in a form, the society name and the BHK, so the seller
 * types them in their own chat.
 */
export function valuationMessage(v: ValuationInput): string {
  const size = v.sqft ? `${v.sqft.toLocaleString("en-IN")} sq ft` : "___ sq ft";
  const lines = [
    "Hi Shree Giriraj, I am thinking of selling my flat and would like a fair price opinion.",
    `Area: ${v.place}. Rate I used: ${v.pocket}. Society: ___.`,
    `Size: ${size}, ___ BHK. Building age: ${v.age.toLowerCase()}. Floor: ${v.floor}. Lift: ${v.lift.toLowerCase()}.`,
  ];
  if (v.range) {
    const what = v.range.low === v.range.high ? "an asking price of about" : "an asking range of";
    lines.push(`Your calculator shows ${what} ${rangeText(v.range)}.`);
  }
  lines.push("Please send recent registered sales near my building.");
  return lines.join("\n");
}

export const VALUATION_SOURCES: { label: string; url: string }[] = [
  {
    label: "Mumbai Property Exchange, Borivali West resale and new project medians, week ending 15 November 2026",
    url: "https://www.mumbaipropertyexchange.com/projects-new-homes/borivali-west",
  },
  { label: "Square Yards, Borivali West property rates, September 2026", url: "https://www.squareyards.com/property-rates/borivali-west-mumbai" },
  { label: "NoBroker, property rates in Borivali West by pocket, May 2026", url: "https://www.nobroker.in/blog/property-rates-in-borivali-west" },
  { label: "Square Yards, Kandivali West property rates, October 2026", url: "https://www.squareyards.com/property-rates/kandivali-west-mumbai" },
  { label: "Square Yards, Malad West overview, 2026", url: "https://www.squareyards.com/malad-west-in-mumbai-overview-924" },
];
