/**
 * 1, 2 and 3 BHK flats for sale, one page per size per suburb:
 * /areas/{area}/{n}-bhk-flats-for-sale. Batch 3 of the buying and selling
 * leads work (17 November 2026).
 *
 * WHY THESE PAGES. "3 bhk flat in borivali west" runs about 260 searches a
 * month in Mumbai, "1 bhk flat in kandivali west" and "3 bhk flat in kandivali
 * west" about 170 each, and all nine size and suburb pairs together about
 * 1,200 (DataForSEO, 17 November 2026). The results are portal listing pages.
 * The flats for sale page answers all three sizes at once; a buyer who typed
 * one size wants that size, pocket by pocket, and a shortlist for it.
 *
 * NOTHING NEW IS STATED HERE. Every figure is derived from the sourced data
 * in flats.ts (pocket rates, size bands, rents) or from the stamp duty rules
 * the site already publishes, so a correction there corrects these pages too.
 */

import { BHK_SIZES, FLAT_LISTINGS, bhkBudget, listingPath, type EstimatorPocket, type FlatListing } from "@/lib/flats";

export type BhkSize = "1 BHK" | "2 BHK" | "3 BHK";

export type BhkPage = {
  area: string;
  place: string;
  size: BhkSize;
  /** "2-bhk-flats-for-sale" */
  segment: string;
  path: string;
  salePath: string;
  rentPath: string | null;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** 40 to 60 words, the same sentence the flats for sale page gives for this size. */
  answer: string;
  intro: string;
  /** The headline asking figure, for example "about ₹2.15 crore". */
  quickFigure: string;
  quickBasis: string;
  quickNote: string;
  sizeLabel: string;
  sizeLow: number;
  sizeHigh: number;
  /** The published band for this size, with its source. */
  band: { figure: string | null; note?: string };
  suits: string;
  check: string;
  checks: string[];
  /** Each pocket's asking budget for this size. */
  pocketRows: { label: string; rate: string; note: string; budget: string }[];
  /** Stamp duty and registration on the headline figure. */
  cashOnTop: { priceLow: number; priceHigh: number; dutyLow: number; dutyHigh: number; registration: number };
  rentLine: string | null;
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  updatedOn: string;
};

export const BHK_LIST: BhkSize[] = ["1 BHK", "2 BHK", "3 BHK"];

export function bhkSegment(size: BhkSize): string {
  return `${size[0]}-bhk-flats-for-sale`;
}

/** Stamp duty for most buyers (a man alone, or a couple jointly), metro cess included. */
const DUTY_PCT = 6;
/** Registration is 1 percent, capped at 30,000 rupees. */
const REG_CAP = 30_000;

export function lakhOrCrore(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} crore`;
  return `₹${(n / 1e5).toFixed(1)} lakh`;
}

function rateText(p: EstimatorPocket): string {
  const lo = p.low.toLocaleString("en-IN");
  return p.low === p.high ? `₹${lo}` : `₹${lo} to ₹${p.high.toLocaleString("en-IN")}`;
}

function faqFor(l: FlatListing | undefined, test: (q: string) => boolean): { q: string; a: string } | undefined {
  return l?.faqs.find((f) => test(f.q));
}

const SALE_FAQ_ASKING_Q = "Are the rates on this page what flats actually sell for?";
const SALE_FAQ_SHORTLIST_Q = "How quickly will I get a shortlist?";

function build(sale: FlatListing, size: BhkSize): BhkPage {
  const rent = FLAT_LISTINGS.find((x) => x.area === sale.area && x.intent === "rent");
  const dims = BHK_SIZES.find((s) => s.size === size)!;
  const n = size[0];
  const segment = bhkSegment(size);
  const path = `/areas/${sale.area}/${segment}`;
  const pockets = sale.pockets ?? [];
  const avg = pockets[0];
  const quick = sale.quick.find((q) => q.size === size)!;
  const sizeEntry = sale.sizes.find((s) => s.size === size)!;

  const priceLow = avg.low * dims.low;
  const priceHigh = avg.high * dims.high;
  const cashOnTop = {
    priceLow,
    priceHigh,
    dutyLow: Math.round((priceLow * DUTY_PCT) / 100),
    dutyHigh: Math.round((priceHigh * DUTY_PCT) / 100),
    registration: REG_CAP,
  };

  const costFaq = faqFor(sale, (q) => q.startsWith(`How much does a ${size} flat cost`))!;
  const pocketFaq = faqFor(sale, (q) => q.startsWith("Which pocket") && q.includes("least"));
  const rentFaq = faqFor(rent, (q) => q.startsWith(`What is the rent of a ${size}`));
  const asking = faqFor(sale, (q) => q === SALE_FAQ_ASKING_Q);
  const shortlist = faqFor(sale, (q) => q === SALE_FAQ_SHORTLIST_Q);

  const dutyText =
    cashOnTop.dutyLow === cashOnTop.dutyHigh
      ? `about ${lakhOrCrore(cashOnTop.dutyLow)}`
      : `about ${lakhOrCrore(cashOnTop.dutyLow)} to ${lakhOrCrore(cashOnTop.dutyHigh)}`;

  const faqs: { q: string; a: string }[] = [
    costFaq,
    {
      q: `How much cash do I need on top of the price of a ${size} in ${sale.place}?`,
      a: `At the average asking figure of ${quick.figure.replace(/^about /, "about ")}, stamp duty at 6 percent comes to ${dutyText}, and registration is capped at 30,000 rupees. That is for a man buying alone or a couple buying jointly; where the only buyers are women the duty is 5 percent. A home loan does not cover either, so both come from your own cash with the down payment.`,
    },
    ...(pocketFaq ? [pocketFaq] : []),
    {
      q: `What size is a ${size} flat in ${sale.place}?`,
      a: `The prices on this page use ${dims.label} of carpet for a ${size}. ${
        size === "1 BHK"
          ? "That is the 1 BHK carpet size our resale service quotes."
          : `That is the ${size} size in the new projects on this site.`
      } Older buildings and newer towers differ, so tell us the area on the listing and we work out the price on it.`,
    },
    ...(rentFaq ? [{ q: rentFaq.q, a: `${rentFaq.a} Weighing renting against buying? Our rent or buy guide works out the break even.` }] : []),
    ...(asking ? [asking] : []),
    {
      q: `Do you also help me sell a ${size} in ${sale.place}?`,
      a: `Yes. The free flat valuation calculator on this site shows what your ${size} would ask in its pocket today. Send us the society name and we reply with recent registered sales near your building, then bring buyers who can complete. No obligation.`,
    },
    ...(shortlist ? [shortlist] : []),
  ];

  const lowest = [...pockets.slice(1)].sort((a, b) => a.low - b.low)[0];
  const highest = [...pockets.slice(1)].sort((a, b) => b.high - a.high)[0];

  const intro = `${sizeEntry.suits} Below is what a ${size} asks in each pocket of ${sale.place}, from ${lowest.label} at the low end to ${highest.label} at the top, with the source and month on every row. Tell us your budget and we send the ${size} flats that fit, usually the same day.`;

  const metaDescription = trimTo(
    `${size} flats for sale in ${sale.place} ask ${quick.figure.replace(/^about /, "about ")} for ${dims.label}. Prices by pocket, checked ${sale.updatedOn.replace(/^\d+ /, "")}, and a same day shortlist.`,
    150,
  );

  return {
    area: sale.area,
    place: sale.place,
    size,
    segment,
    path,
    salePath: listingPath(sale),
    rentPath: rent ? listingPath(rent) : null,
    h1: `${size} flats for sale in ${sale.place}`,
    metaTitle: `${n} BHK flats in ${sale.place}: prices 2026`,
    metaDescription,
    // The answer box wants 40 to 60 words. The shared FAQ is shorter for one
    // size, so the page's own promise completes it.
    answer:
      costFaq.a.split(/\s+/).length < 40
        ? `${costFaq.a} Tell us your budget and we send the ${size} flats that fit, usually the same day.`
        : costFaq.a,
    intro,
    quickFigure: quick.figure,
    quickBasis: quick.basis ?? dims.label,
    quickNote: sale.quickNote,
    sizeLabel: dims.label,
    sizeLow: dims.low,
    sizeHigh: dims.high,
    band: { figure: sizeEntry.figure, note: sizeEntry.figureNote },
    suits: sizeEntry.suits,
    check: sizeEntry.check,
    checks: sale.checks,
    pocketRows: pockets.map((p) => ({
      label: p.label,
      rate: rateText(p),
      note: p.note,
      budget: bhkBudget(p.low, p.high, dims.low, dims.high),
    })),
    cashOnTop,
    rentLine: rentFaq ? rentFaq.a : null,
    faqs,
    sources: [...sale.sources, ...(rent ? rent.sources.filter((s) => !sale.sources.some((x) => x.url === s.url)) : [])],
    updatedOn: sale.updatedOn,
  };
}

function trimTo(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.replace(", and a same day shortlist.", ".").slice(0, max);
}

export const BHK_PAGES: BhkPage[] = FLAT_LISTINGS.filter((l) => l.intent === "sale" && l.pockets && l.pockets.length > 1).flatMap(
  (l) => BHK_LIST.map((size) => build(l, size)),
);

export function getBhkPage(area: string, segment: string): BhkPage | undefined {
  return BHK_PAGES.find((p) => p.area === area && p.segment === segment);
}

export function bhkPagesFor(area: string): BhkPage[] {
  return BHK_PAGES.filter((p) => p.area === area);
}

export function bhkPagePath(area: string, size: BhkSize): string {
  return `/areas/${area}/${bhkSegment(size)}`;
}
