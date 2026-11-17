/**
 * Flats by size, for sale and for rent, in the three West side markets.
 *
 * WHY THESE PAGES EXIST
 *
 * The DataForSEO audit of 19 September 2026 found that people in this market
 * search by flat size and suburb ("2 bhk in borivali west" 480 a month,
 * "1 bhk in borivali west" 390, "rental flats in malad west" 390, "1 bhk
 * kandivali west" 320) far more than by any phrase the service pages used,
 * over 20,000 searches a month across the three suburbs, and that no page on
 * the site answered them. These six pages do. The audit of 16 November 2026
 * added the Mumbai volumes the sale pages now lead with: "3 bhk flat in
 * borivali west" 260, "flats for sale in kandivali west" 210, "1 bhk flat in
 * kandivali" 170, "flats for sale in borivali west" 140, "2 bhk flat in
 * kandivali west" 140, "flats for sale in malad west" 110.
 *
 * WHY SIX AND NOT THIRTY SIX
 *
 * One page per suburb per intent, each covering 1, 2 and 3 BHK. A page per
 * size per side would be thin and near identical, which is what Google calls
 * a doorway page. Six pages with real, different content are worth more.
 *
 * THE FIGURES (read again 16 November 2026)
 *
 * Every rate is a portal's published asking rate, with the portal and month
 * named next to it. Square Yards' Borivali West page (September 2026) and
 * Kandivali West page (October 2026) were read on 16 November 2026, as were
 * its Malad West overview (28,250) and its Kandivali East page, which lists
 * Malad West at 30,800 for September 2026. NoBroker's Borivali West rates
 * page, published 25 May 2026, was still live with the same pocket figures
 * and the 1, 2 and 3 BHK price bands quoted here. Mahavir Nagar and
 * Dahanukarwadi are Square Yards figures read in September 2026 for the area
 * guide. Nothing is estimated beyond one multiplication: a rate times a size.
 *
 * THE SIZES
 *
 * 1 BHK: 400 to 450 sq ft carpet, the size the resale flats service page and
 * the 1 BHK price article already use. 2 BHK about 700 sq ft and 3 BHK about
 * 950 sq ft, the sizes of 2 and 3 BHK homes in the new projects on this site.
 * Portals do not always quote on the same area basis, so the pages say so.
 */

export type ListingIntent = "sale" | "rent";

export type FlatSize = {
  size: "1 BHK" | "2 BHK" | "3 BHK";
  /** The sourced figure, written out, or null where none is published. */
  figure: string | null;
  /** Qualifies the figure: which side, which source. */
  figureNote?: string;
  suits: string;
  check: string;
};

export type EstimatorPocket = { label: string; low: number; high: number; note: string };

export type FlatListing = {
  area: string;
  intent: ListingIntent;
  place: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  answer: string;
  intro: string;
  /** The day the figures on the page were last read against their sources. */
  updatedOn: string;
  /** The figure for each size, shown in the first lines of the page. */
  quick: { size: string; figure: string; basis?: string }[];
  /** What the quick figures are, with the source and date. */
  quickNote: string;
  image: { src: string; alt: string };
  sizes: FlatSize[];
  figuresNote: string;
  /** For sale pages: asking rates by pocket, fed to the estimator and the BHK table. */
  pockets?: EstimatorPocket[];
  checks: string[];
  faqs: { q: string; a: string }[];
  waMessage: string;
  sources: { label: string; url: string }[];
};

/** The sizes the BHK by pocket table multiplies the rates by. */
export const BHK_SIZES: { size: "1 BHK" | "2 BHK" | "3 BHK"; low: number; high: number; label: string }[] = [
  { size: "1 BHK", low: 400, high: 450, label: "400 to 450 sq ft" },
  { size: "2 BHK", low: 700, high: 700, label: "about 700 sq ft" },
  { size: "3 BHK", low: 950, high: 950, label: "about 950 sq ft" },
];

function money(rupees: number): string {
  if (rupees >= 1e7) return `₹${(rupees / 1e7).toFixed(2)} Cr`;
  return `₹${Math.round(rupees / 1e5)} L`;
}

/** A rate range times a size range, written the way the page shows prices. */
export function bhkBudget(rateLow: number, rateHigh: number, sizeLow: number, sizeHigh: number): string {
  const lo = money(rateLow * sizeLow);
  const hi = money(rateHigh * sizeHigh);
  return lo === hi ? lo : `${lo} to ${hi}`;
}

const UPDATED = "16 November 2026";

const RENT_FAQ_DEPOSIT = {
  q: "How much deposit will I pay on a flat here?",
  a: "Two to three months' rent in most newer societies, and that is what we negotiate towards. The amount, the refund date and what can be deducted are written into the registered agreement. Both sides then know where they stand at the end of the licence.",
};
const RENT_FAQ_AGREEMENT = {
  q: "Does the rent agreement have to be registered?",
  a: "Yes. In Maharashtra a leave and licence agreement has to be registered under section 55 of the Maharashtra Rent Control Act 1999. We arrange the registration, online with biometrics, so the tenant and the owner sign once and leave with a registered copy.",
};
const RENT_FAQ_POLICE = {
  q: "Is tenant police verification needed?",
  a: "Yes, it is compulsory in Maharashtra, and most societies ask for it before the keys change hands. We tell you the society's own requirements before the visit, and we file the verification alongside the agreement.",
};
const SALE_FAQ_DUTY = {
  q: "What will stamp duty and registration add to the price?",
  a: "In Mumbai, stamp duty is 6 percent for a man buying alone or a couple buying jointly. That includes the 1 percent metro cess. It is 5 percent where the only buyers are women. Registration is 1 percent, capped at 30,000 rupees. Duty is charged on the agreement value or the ready reckoner value, whichever is higher. The ready reckoner is the government's rate list for property. The stamp duty calculator on this site works out the exact figure.",
};
const SALE_FAQ_ASKING = {
  q: "Are the rates on this page what flats actually sell for?",
  a: "They are asking rates published by the portals, with the month and the source named. The price a flat registers at is usually lower, and it moves with the building's age, the floor and how the society is run. Tell us the building and we will tell you what similar flats in it have really gone for.",
};
const SALE_FAQ_SHORTLIST = {
  q: "How quickly will I get a shortlist?",
  a: "Usually the same day. Send the size, the budget and the pocket on WhatsApp. We reply with the flats that fit, each with its asking price and a word on the society, and line up the viewings for one visit.",
};

const BORIVALI_SOURCES = [
  { label: "Square Yards, Borivali West property rates: average asking rate 30,750 rupees per sq ft and average rents by size, September 2026 (read 16 November 2026)", url: "https://www.squareyards.com/property-rates/borivali-west-mumbai" },
  { label: "NoBroker, property rates in Borivali West by pocket and 1, 2 and 3 BHK price bands, published 25 May 2026 (still live 16 November 2026)", url: "https://www.nobroker.in/blog/property-rates-in-borivali-west" },
];
const KANDIVALI_SOURCES = [
  { label: "Square Yards, Kandivali West property rates: average 26,800 rupees per sq ft (27,200 for apartments), Charkop sectors and average rents by size, October 2026 (read 16 November 2026)", url: "https://www.squareyards.com/property-rates/kandivali-west-mumbai" },
  { label: "NoBroker, Kandivali West locality report, rents, 2026", url: "https://www.nobroker.in/locality-iq/kandivali-west-mumbai-liqlt" },
];
const MALAD_SOURCES = [
  { label: "Square Yards, Malad West overview: average sale price 28,250 rupees per sq ft and average rent 93 rupees per sq ft a month (read 16 November 2026)", url: "https://www.squareyards.com/malad-west-in-mumbai-overview-924" },
  { label: "Square Yards, Kandivali East property rates page, which lists Malad West at 30,800 and Malad East at 30,400 rupees per sq ft, September 2026", url: "https://www.squareyards.com/property-rates/kandivali-east-mumbai" },
  { label: "Broker Network, Malad West property rates and locality guide: new and resale rates per sq ft, 2 and 3 BHK rents, July 2026 (read 16 November 2026)", url: "https://brokernetwork.in/malad-west-mumbai-property-rates-locality-guide-pros-cons-2026/" },
  { label: "NoBroker, Malad East locality report, April 2026", url: "https://www.nobroker.in/locality-iq/malad-east-malad-mumbai-liqlt" },
];

export const FLAT_LISTINGS: FlatListing[] = [
  {
    area: "borivali-west",
    intent: "sale",
    place: "Borivali West",
    metaTitle: "Flats for sale in Borivali West: 1, 2, 3 BHK",
    metaDescription:
      "Flats for sale in Borivali West: 1, 2 and 3 BHK prices by pocket, checked November 2026. Send size and budget on WhatsApp for a same day shortlist.",
    h1: "Flats for sale in Borivali West: 1, 2 and 3 BHK",
    answer:
      "A 2 BHK of about 700 sq ft in Borivali West asks about ₹2.15 crore, and a 3 BHK of about 950 sq ft about ₹2.92 crore. A 1 BHK of 400 to 450 sq ft asks ₹1.23 to ₹1.38 crore. That is Square Yards' September 2026 average of 30,750 rupees per sq ft. Chikoowadi and Gorai ask less.",
    intro:
      "We have sold flats in Borivali West since 1996, from our office in Chikoowadi since 2005. Every flat we send comes with what the society is like to live in.",
    updatedOn: UPDATED,
    quick: [
      { size: "1 BHK", figure: "₹1.23 to ₹1.38 crore", basis: "400 to 450 sq ft" },
      { size: "2 BHK", figure: "about ₹2.15 crore", basis: "about 700 sq ft" },
      { size: "3 BHK", figure: "about ₹2.92 crore", basis: "about 950 sq ft" },
    ],
    quickNote: "Asking figures, not prices paid. Each is Square Yards' Borivali West average of 30,750 rupees per sq ft (September 2026) times the size shown.",
    image: {
      src: "/premium/flats/borivali-west-towers.jpg",
      alt: "A residential tower rising above tree covered Borivali West, with the creek and the pagoda on the horizon",
    },
    sizes: [
      {
        size: "1 BHK",
        figure: "74.6 lakh to ₹1.85 crore",
        figureNote: "NoBroker, May 2026: Gorai 1 and 2 at the low end, premium societies at the top",
        suits: "First homes, single buyers, and buyers who may let the flat out later.",
        check: "The society's no objection for a sale. And whether the building is heading for redevelopment, because that changes what the flat is worth.",
      },
      {
        size: "2 BHK",
        figure: "1.50 crore to ₹2.72 crore",
        figureNote: "NoBroker, May 2026: Shimpoli and Gorai from ₹1.50 crore, high end societies to ₹2.72 crore",
        suits: "The usual family size. Yogi Nagar and Shimpoli ask the most; in I.C. Colony the rate varies most with the age of the building.",
        check: "Carpet area as RERA defines it against the area on the listing, and the parking the society will allot in writing.",
      },
      {
        size: "3 BHK",
        figure: "2.29 crore to ₹4.04 crore",
        figureNote: "NoBroker, May 2026: Gorai and Eksar Road from ₹2.29 crore, luxury towers to ₹4.04 crore",
        suits: "Larger families and buyers upgrading within Borivali, often in the newer buildings on the Link Road side.",
        check: "Water pressure on the upper floors in the morning and the monthly maintenance, which rises with the amenities.",
      },
    ],
    figuresNote: "Price bands by size from NoBroker's Borivali West rates page, published 25 May 2026 and still live on 16 November 2026. Asking is not the registered price.",
    pockets: [
      { label: "Borivali West average", low: 30750, high: 30750, note: "Square Yards, September 2026" },
      { label: "Yogi Nagar", low: 27000, high: 33800, note: "NoBroker, May 2026" },
      { label: "Shimpoli", low: 27500, high: 30500, note: "NoBroker, May 2026" },
      { label: "Chikoowadi", low: 25000, high: 26000, note: "NoBroker, May 2026" },
      { label: "I.C. Colony", low: 19000, high: 31500, note: "NoBroker, May 2026, by building age" },
      { label: "Eksar Road", low: 13000, high: 26000, note: "NoBroker, May 2026" },
      { label: "Gorai stretch", low: 10900, high: 23200, note: "NoBroker, May 2026" },
    ],
    checks: [
      "The title chain and the Index 2 of every earlier sale",
      "The society's no objection and its dues, before a price is agreed",
      "Carpet area as RERA defines it",
      "Where any redevelopment has really reached",
      "The occupancy certificate, for anything built in the last twenty years",
    ],
    faqs: [
      {
        q: "How much does a 3 BHK flat cost in Borivali West?",
        a: "A 3 BHK of about 950 sq ft in Borivali West asks about ₹2.92 crore at Square Yards' September 2026 average of 30,750 rupees per sq ft. NoBroker's May 2026 bands run from ₹2.29 crore in Gorai and Eksar Road to ₹4.04 crore in luxury towers. Stamp duty and registration come on top.",
      },
      {
        q: "How much does a 2 BHK flat cost in Borivali West?",
        a: "A 2 BHK of about 700 sq ft in Borivali West asks about ₹2.15 crore at the September 2026 average of 30,750 rupees per sq ft. In Chikoowadi, at 25,000 to 26,000 per sq ft, the same flat asks about ₹1.75 to ₹1.82 crore. NoBroker's May 2026 bands run from ₹1.50 crore to ₹2.72 crore.",
      },
      {
        q: "How much does a 1 BHK flat cost in Borivali West?",
        a: "A 1 BHK of 400 to 450 sq ft in Borivali West asks about ₹1.23 to ₹1.38 crore at the September 2026 average. NoBroker's May 2026 band starts at ₹74.6 lakh in Gorai 1 and 2. Our 1 BHK price guide adds the down payment, the EMI and the income a bank looks for.",
      },
      {
        q: "Which pocket of Borivali West asks the least, and which the most?",
        a: "On NoBroker's May 2026 figures, Yogi Nagar asks the most of the main pockets, at 27,000 to 33,800 rupees per square foot. Chikoowadi asks 25,000 to 26,000. Eksar Road (13,000 to 26,000) and the Gorai stretch (10,900 to 23,200) ask less.",
      },
      SALE_FAQ_ASKING,
      SALE_FAQ_DUTY,
      {
        q: "Which pocket of Borivali West is best for a family?",
        a: "Shimpoli and Yogi Nagar suit families who want newer towers near the metro. Chikoowadi suits a quieter established society, and I.C. Colony larger flats and a strong community. The right one depends on the school run and the commute, which is the first thing we ask.",
      },
      {
        q: "Can I buy a resale flat in an older society safely?",
        a: "Yes, and many of the best value flats in Borivali West are exactly that. What makes it safe is reading the title chain, the society's records and the redevelopment position before any money moves. That is the work we do before a token is paid.",
      },
      {
        q: "Do you also help me sell my flat here?",
        a: "Yes. We price it against what similar flats have really registered for. We prepare the papers a careful buyer will ask for, and we show it only to buyers who can complete. Send us the building's name and we will tell you what it would ask this month, free.",
      },
      SALE_FAQ_SHORTLIST,
    ],
    waMessage: "Hi Shree Giriraj, I am looking to buy a ___ BHK in Borivali West. My budget is about ___. Can you send me what fits?",
    sources: BORIVALI_SOURCES,
  },
  {
    area: "borivali-west",
    intent: "rent",
    place: "Borivali West",
    metaTitle: "Flats for rent in Borivali West: 1, 2, 3 BHK",
    metaDescription:
      "Flats for rent in Borivali West: 1, 2 and 3 BHK rents checked November 2026, with deposits. WhatsApp your size and budget for flats that fit today.",
    h1: "Flats for rent in Borivali West: 1, 2 and 3 BHK",
    answer:
      "A 1 BHK in Borivali West rents for about ₹32,800 a month on average, a 2 BHK ₹49,600 and a 3 BHK ₹73,850, on Square Yards' September 2026 figures. NoBroker's 2026 asking ranges run from ₹22,000 for a 1 BHK to ₹1 lakh for a 3 BHK. Deposits in newer societies run two to three months.",
    intro:
      "We have let flats in Borivali West since 1996. We know which societies welcome tenants, what their rules are, and which owners keep their flats well. We shortlist around your commute, so you only visit flats that work for your day.",
    updatedOn: UPDATED,
    quick: [
      { size: "1 BHK", figure: "₹22,000 to ₹40,000 a month", basis: "average ₹32,800 (Square Yards, September 2026)" },
      { size: "2 BHK", figure: "₹35,000 to ₹65,000 a month", basis: "average ₹49,600" },
      { size: "3 BHK", figure: "₹55,000 to ₹1 lakh a month", basis: "average ₹73,850" },
    ],
    quickNote: "Ranges are NoBroker's 2026 asking rents for Borivali; averages are Square Yards, Borivali West, September 2026. Deposit: two to three months' rent in newer societies.",
    image: {
      src: "/premium/u/interior-05.jpg",
      alt: "A large white kitchen with an island and a marble floor",
    },
    sizes: [
      {
        size: "1 BHK",
        figure: "22,000 to 40,000 a month",
        figureNote: "Borivali, NoBroker 2026",
        suits: "Working professionals and couples who want the station or the metro within a walk.",
        check: "Whether the society allows the tenant profile you are, and the water timing.",
      },
      {
        size: "2 BHK",
        figure: "35,000 to 65,000 a month",
        figureNote: "Borivali, NoBroker 2026",
        suits: "Families, often moving for the schools.",
        check: "The society's move in rules and charges, and the parking that comes with the flat.",
      },
      {
        size: "3 BHK",
        figure: "55,000 to 1 lakh a month",
        figureNote: "Borivali, NoBroker 2026",
        suits: "Larger families and company leases, often in the newer buildings on the Link Road side.",
        check: "What is included in the rent, from the furniture to the club house, written into the agreement.",
      },
    ],
    figuresNote: "Asking rent ranges for Borivali as a whole, NoBroker 2026. Deposits run two to three months in newer societies.",
    checks: [
      "That the person letting the flat is the owner, or holds a registered power of attorney",
      "The society's rules for tenants, before you visit",
      "A registered leave and licence agreement",
      "Tenant police verification, filed with the agreement",
      "The deposit and the refund date, in writing",
    ],
    faqs: [
      {
        q: "What is the rent of a 1 BHK in Borivali West?",
        a: "A 1 BHK in Borivali West rents for about ₹32,800 a month on average, on Square Yards' September 2026 figures. NoBroker's 2026 asking range is ₹22,000 to ₹40,000. The deposit in newer societies is two to three months' rent. Near the station or the metro costs more.",
      },
      {
        q: "What is the rent of a 2 BHK in Borivali West?",
        a: "A 2 BHK in Borivali West rents for about ₹49,600 a month on average, on Square Yards' September 2026 figures. NoBroker's 2026 asking range is ₹35,000 to ₹65,000. Newer towers sit at the top of the range.",
      },
      {
        q: "What is the rent of a 3 BHK in Borivali West?",
        a: "A 3 BHK in Borivali West rents for about ₹73,850 a month on average, on Square Yards' September 2026 figures. NoBroker's 2026 asking range is ₹55,000 to ₹1 lakh. What is included in the rent is written into the agreement.",
      },
      RENT_FAQ_DEPOSIT,
      RENT_FAQ_AGREEMENT,
      RENT_FAQ_POLICE,
      {
        q: "Which part of Borivali West is best for renting?",
        a: "Choose near the station and Chandavarkar Road if you commute by train. Choose Shimpoli and the Link Road side if you use the metro or drive. Choose Chikoowadi or I.C. Colony for a quieter lane. Tell us where you work and we will narrow it down.",
      },
      {
        q: "Do you help owners let their flats too?",
        a: "Yes. We find the tenant, check them, and handle the agreement and the police verification. We keep the owner updated on WhatsApp throughout, which is how many of our owners who live abroad work with us.",
      },
      {
        q: "How soon can I move in?",
        a: "Often within a week of choosing the flat, once the agreement is registered and the society has the paperwork it needs. We line these up in parallel so nothing waits on anything else.",
      },
    ],
    waMessage: "Hi Shree Giriraj, I am looking to rent a ___ BHK in Borivali West. My budget is about ___ a month and I work near ___. Can you help?",
    sources: BORIVALI_SOURCES,
  },
  {
    area: "kandivali",
    intent: "sale",
    place: "Kandivali West",
    metaTitle: "Flats for sale in Kandivali West, 1 to 3 BHK",
    metaDescription:
      "Flats for sale in Kandivali West: 1, 2 and 3 BHK prices from Mahavir Nagar to Charkop, checked November 2026. WhatsApp for a same day shortlist.",
    h1: "Flats for sale in Kandivali West: 1, 2 and 3 BHK",
    answer:
      "A 1 BHK of 400 to 450 sq ft in Kandivali West asks about ₹1.09 to ₹1.22 crore. A 2 BHK of about 700 sq ft asks about ₹1.90 crore, and a 3 BHK of about 950 sq ft about ₹2.58 crore. That is Square Yards' October 2026 apartment average of 27,200 rupees per sq ft. Mahavir Nagar asks more.",
    intro:
      "Kandivali West is a market we have worked since 1996, from the Gujarati heart of Mahavir Nagar to Charkop's MHADA sectors. Every building we send comes with an honest word on its society.",
    updatedOn: UPDATED,
    quick: [
      { size: "1 BHK", figure: "₹1.09 to ₹1.22 crore", basis: "400 to 450 sq ft" },
      { size: "2 BHK", figure: "about ₹1.90 crore", basis: "about 700 sq ft" },
      { size: "3 BHK", figure: "about ₹2.58 crore", basis: "about 950 sq ft" },
    ],
    quickNote: "Asking figures, not prices paid. Each is Square Yards' Kandivali West apartment average of 27,200 rupees per sq ft (October 2026) times the size shown.",
    image: {
      src: "/premium/towers-night-water.jpg",
      alt: "Residential towers lit at night, reflected in still water",
    },
    sizes: [
      {
        size: "1 BHK",
        figure: "1.04 crore to ₹1.64 crore",
        figureNote: "400 to 450 sq ft, from Charkop Sectors 2 and 4 to Mahavir Nagar, Square Yards rates",
        suits: "First buyers and investors. In Charkop's MHADA sectors, the Board's permissions are part of every purchase.",
        check: "For a MHADA flat, the transfer history and the Board's permissions, which we check before anything is signed.",
      },
      {
        size: "2 BHK",
        figure: "1.82 crore to ₹2.55 crore",
        figureNote: "About 700 sq ft, from Charkop Sectors 2 and 4 to Mahavir Nagar, Square Yards rates",
        suits: "Families who want Mahavir Nagar's schools and food lanes, or more space for the money in Dahanukarwadi.",
        check: "Carpet area as RERA defines it, and the floor, which moves the price more than the size does in a tall tower.",
      },
      {
        size: "3 BHK",
        figure: "2.47 crore to ₹3.46 crore",
        figureNote: "About 950 sq ft, from Charkop Sectors 2 and 4 to Mahavir Nagar, Square Yards rates",
        suits: "Upgrading families, mostly in the newer towers on the Link Road side.",
        check: "The occupancy certificate and the society's maintenance, before the price is agreed.",
      },
    ],
    figuresNote: "Pocket rates from Square Yards: Charkop October 2026, Mahavir Nagar and Dahanukarwadi read September 2026. Rate times size. Asking is not the registered price.",
    pockets: [
      { label: "Kandivali West average, apartments", low: 27200, high: 27200, note: "Square Yards, October 2026" },
      { label: "Mahavir Nagar", low: 36450, high: 36450, note: "Square Yards, read September 2026" },
      { label: "Dahanukarwadi", low: 27750, high: 27750, note: "Square Yards, read September 2026" },
      { label: "Charkop Sector 3", low: 27700, high: 27700, note: "Square Yards, October 2026" },
      { label: "Charkop Sectors 2 and 4", low: 25950, high: 26150, note: "Square Yards, October 2026" },
    ],
    checks: [
      "The title chain and the Index 2 of every earlier sale",
      "For MHADA layouts, the transfer and permissions history",
      "Carpet area as RERA defines it",
      "The occupancy certificate on newer towers",
      "Where any cluster redevelopment in Charkop has really reached",
    ],
    faqs: [
      {
        q: "How much does a 1 BHK flat cost in Kandivali West?",
        a: "A 1 BHK of 400 to 450 sq ft in Kandivali West asks about ₹1.09 to ₹1.22 crore. That is Square Yards' October 2026 apartment average of 27,200 rupees per sq ft. In Charkop Sectors 2 and 4, at 25,950 to 26,150, it asks about ₹1.04 to ₹1.18 crore. A Charkop MHADA flat needs the Board's permissions, which we handle.",
      },
      {
        q: "How much does a 2 BHK flat cost in Kandivali West?",
        a: "A 2 BHK of about 700 sq ft in Kandivali West asks about ₹1.90 crore at the October 2026 average of 27,200 rupees per sq ft. In Mahavir Nagar, near 36,450 per sq ft, it asks about ₹2.55 crore. In Charkop Sectors 2 and 4 it asks about ₹1.82 to ₹1.83 crore.",
      },
      {
        q: "How much does a 3 BHK flat cost in Kandivali West?",
        a: "A 3 BHK of about 950 sq ft in Kandivali West asks about ₹2.58 crore at the October 2026 average of 27,200 rupees per sq ft. Mahavir Nagar takes the same flat to about ₹3.46 crore. Stamp duty and registration come on top.",
      },
      {
        q: "Which pocket of Kandivali West asks the least, and which the most?",
        a: "On Square Yards' figures, Mahavir Nagar asks the most, near 36,450 rupees per square foot (read September 2026). Charkop Sector 2 asks the least of the main pockets, at 25,950 in October 2026. Dahanukarwadi and Charkop Sector 3 sit near 27,700.",
      },
      {
        q: "Which new projects are there in Kandivali West?",
        a: "Jaswanti Jewel off M. G. Road is registered on MahaRERA, with 2 to 5 BHK homes from ₹2.92 crore as of October 2026 and possession from March 2027. Blissful Living on Ext. Mathuradas Road is awaiting MahaRERA registration. Our projects page compares them side by side.",
      },
      SALE_FAQ_ASKING,
      SALE_FAQ_DUTY,
      {
        q: "Is Mahavir Nagar worth the higher price?",
        a: "For many families, yes: it is about 450 metres from the Kandivali West metro, with good schools and the food lanes on the doorstep. If the budget is tighter, Dahanukarwadi and Charkop give more space for the money a short ride away.",
      },
      {
        q: "Can I buy a MHADA flat in Charkop?",
        a: "Yes, with the Board's permissions in order. We check the transfer history and the society's position before a token is paid, and handle the MHADA paperwork as part of the purchase.",
      },
      {
        q: "Do you also help me sell my flat here?",
        a: "Yes. We price it against what similar flats have really registered for. We prepare the papers a careful buyer will ask for, and we show it only to buyers who can complete. Send us the building's name and we will tell you what it would ask this month, free.",
      },
    ],
    waMessage: "Hi Shree Giriraj, I am looking to buy a ___ BHK in Kandivali West. My budget is about ___. Can you send me what fits?",
    sources: KANDIVALI_SOURCES,
  },
  {
    area: "kandivali",
    intent: "rent",
    place: "Kandivali West",
    metaTitle: "Flats for rent in Kandivali West, 1 to 3 BHK",
    metaDescription:
      "Flats for rent in Kandivali West: 1, 2 and 3 BHK rents checked November 2026, with deposits. WhatsApp your size and budget for flats that fit today.",
    h1: "Flats for rent in Kandivali West: 1, 2 and 3 BHK",
    answer:
      "A 1 BHK in Kandivali West rents for about ₹35,200 a month on average, a 2 BHK ₹52,850 and a 3 BHK ₹82,200, on Square Yards' October 2026 figures. NoBroker's 2026 asking range for a 1 BHK is ₹18,000 to ₹35,000. Deposits in newer societies run two to three months.",
    intro:
      "We have let flats across Kandivali since 1996, from Mahavir Nagar's family societies to the Link Road towers and Charkop's quieter sectors. We shortlist around your commute, so every visit is worth the trip.",
    updatedOn: UPDATED,
    quick: [
      { size: "1 BHK", figure: "₹18,000 to ₹35,000 a month", basis: "average ₹35,200 (Square Yards, October 2026)" },
      { size: "2 BHK", figure: "₹35,000 to ₹65,000 a month", basis: "average ₹52,850" },
      { size: "3 BHK", figure: "₹60,000 to ₹95,000 a month", basis: "average ₹82,200" },
    ],
    quickNote: "Ranges are NoBroker's 2026 asking rents: the 1 BHK for the West, the 2 and 3 BHK for Kandivali as a whole. Averages are Square Yards, Kandivali West, October 2026. Deposit: two to three months' rent in newer societies.",
    image: {
      src: "/premium/u/interior-06.jpg",
      alt: "A modular kitchen with dark glass upper cabinets and under cabinet lighting",
    },
    sizes: [
      {
        size: "1 BHK",
        figure: "18,000 to 35,000 a month",
        figureNote: "Kandivali West, NoBroker 2026",
        suits: "Professionals and couples, especially near the Kandivali West and Dahanukarwadi metro stations.",
        check: "The society's rules for tenants and the water timing.",
      },
      {
        size: "2 BHK",
        figure: "35,000 to 65,000 a month",
        figureNote: "Kandivali, NoBroker 2026",
        suits: "Families, often for the schools around Mahavir Nagar and Charkop.",
        check: "Move in charges, parking, and what the maintenance covers.",
      },
      {
        size: "3 BHK",
        figure: "60,000 to 95,000 a month",
        figureNote: "Kandivali, NoBroker 2026",
        suits: "Larger families and company leases in the newer Link Road towers.",
        check: "What is included in the rent, written into the agreement.",
      },
    ],
    figuresNote: "Asking rent ranges, NoBroker 2026. The 1 BHK figure is for the West; the 2 and 3 BHK figures are for Kandivali as a whole.",
    checks: [
      "That the person letting the flat is the owner, or holds a registered power of attorney",
      "The society's rules for tenants, before you visit",
      "A registered leave and licence agreement",
      "Tenant police verification, filed with the agreement",
      "The deposit and the refund date, in writing",
    ],
    faqs: [
      {
        q: "What is the rent of a 1 BHK in Kandivali West?",
        a: "A 1 BHK in Kandivali West rents for about ₹35,200 a month on average, on Square Yards' October 2026 figures. NoBroker's 2026 asking range is ₹18,000 to ₹35,000. Flats near the Kandivali West and Dahanukarwadi metro stations ask more.",
      },
      {
        q: "What is the rent of a 2 BHK in Kandivali West?",
        a: "A 2 BHK in Kandivali West rents for about ₹52,850 a month on average, on Square Yards' October 2026 figures. NoBroker's 2026 asking range for Kandivali is ₹35,000 to ₹65,000. Move in charges and parking are worth asking about.",
      },
      {
        q: "What is the rent of a 3 BHK in Kandivali West?",
        a: "A 3 BHK in Kandivali West rents for about ₹82,200 a month on average, on Square Yards' October 2026 figures. NoBroker's 2026 asking range for Kandivali is ₹60,000 to ₹95,000. What is included in the rent is written into the agreement.",
      },
      RENT_FAQ_DEPOSIT,
      RENT_FAQ_AGREEMENT,
      RENT_FAQ_POLICE,
      {
        q: "Which part of Kandivali West is best for renting?",
        a: "Choose Mahavir Nagar for schools and food within a walk. Choose the Link Road towers for newer buildings and parking. Choose Charkop for quieter lanes and more space for the rent. Tell us where you work and we will narrow it down.",
      },
      {
        q: "Do you help owners let their flats too?",
        a: "Yes. We find and check the tenant, handle the agreement and the police verification, and keep the owner updated on WhatsApp from start to finish.",
      },
      {
        q: "How soon can I move in?",
        a: "Often within a week of choosing the flat, once the agreement is registered and the society has its paperwork. We run these in parallel so nothing waits.",
      },
    ],
    waMessage: "Hi Shree Giriraj, I am looking to rent a ___ BHK in Kandivali West. My budget is about ___ a month and I work near ___. Can you help?",
    sources: KANDIVALI_SOURCES,
  },
  {
    area: "malad",
    intent: "sale",
    place: "Malad West",
    metaTitle: "Flats for sale in Malad West: 1, 2, 3 BHK",
    metaDescription:
      "Flats for sale in Malad West: 1, 2 and 3 BHK prices from Evershine Nagar to Orlem, checked November 2026. WhatsApp for a same day shortlist.",
    h1: "Flats for sale in Malad West: 1, 2 and 3 BHK",
    answer:
      "A 1 BHK of 400 to 450 sq ft in Malad West asks about ₹1.13 to ₹1.39 crore. A 2 BHK of about 700 sq ft asks ₹1.98 to ₹2.16 crore, and a 3 BHK of about 950 sq ft ₹2.68 to ₹2.93 crore. That uses Square Yards' 28,250 to 30,800 rupees per sq ft. Resale flats ask less.",
    intro:
      "Malad West is the most investor driven of the three suburbs we work in, and we have sold here since 1996. Whether you are buying to live in or to let, every building we send comes with the rent it realistically earns.",
    updatedOn: UPDATED,
    quick: [
      { size: "1 BHK", figure: "₹1.13 to ₹1.39 crore", basis: "400 to 450 sq ft" },
      { size: "2 BHK", figure: "₹1.98 to ₹2.16 crore", basis: "about 700 sq ft" },
      { size: "3 BHK", figure: "₹2.68 to ₹2.93 crore", basis: "about 950 sq ft" },
    ],
    quickNote: "Asking figures, not prices paid. Square Yards lists Malad West at 30,800 rupees per sq ft (September 2026) and 28,250 on its overview (read 16 November 2026). Resale flats alone ask about 27,000 per sq ft carpet (Mumbai Property Exchange and PropertyPistol, July and September 2026).",
    image: {
      src: "/premium/u/complex-05.jpg",
      alt: "A polished lobby with artwork and warm lighting",
    },
    sizes: [
      {
        size: "1 BHK",
        figure: "56 lakh to ₹1.44 crore",
        figureNote: "400 to 450 sq ft, from resale at 14,000 per sq ft (Broker Network, July 2026) to Evershine Nagar at 32,000 (Dwello)",
        suits: "Investors buying to let to Mindspace professionals, and first buyers who work nearby.",
        check: "The realistic tenant and rent for the building, before the purchase, so the yield is real.",
      },
      {
        size: "2 BHK",
        figure: "98 lakh to ₹2.24 crore",
        figureNote: "About 700 sq ft, from resale at 14,000 per sq ft to Evershine Nagar at 32,000",
        suits: "Families and investors alike, in Evershine Nagar, Orlem and along Link Road.",
        check: "Carpet area as RERA defines it, and the society's rules on letting if you plan to rent it out.",
      },
      {
        size: "3 BHK",
        figure: "1.33 crore to ₹3.04 crore",
        figureNote: "About 950 sq ft, from resale at 14,000 per sq ft to Evershine Nagar at 32,000",
        suits: "Families upgrading into the larger newer complexes on the Link Road belt.",
        check: "The occupancy certificate and the maintenance, which rises with the amenities.",
      },
    ],
    figuresNote: "Asking rates per square foot as reported, with the source and month, times the size shown. Asking is not the registered price.",
    pockets: [
      { label: "Malad West average", low: 28250, high: 30800, note: "Square Yards, September to November 2026" },
      { label: "Resale, per sq ft carpet", low: 27000, high: 27000, note: "Mumbai Property Exchange and PropertyPistol, July and September 2026" },
      { label: "Evershine Nagar", low: 32000, high: 32000, note: "Dwello, 2026" },
      { label: "New flats, Malad West", low: 18000, high: 30000, note: "Broker Network, July 2026" },
      { label: "Resale flats, Malad West", low: 14000, high: 24000, note: "Broker Network, July 2026" },
      { label: "Jankalyan Nagar", low: 10666, high: 23846, note: "NoBroker, undated" },
    ],
    checks: [
      "The title chain and the Index 2 of every earlier sale",
      "The society's rules on letting, for investors",
      "The realistic rent, net of maintenance and property tax",
      "Carpet area as RERA defines it",
      "The occupancy certificate on newer towers",
    ],
    faqs: [
      {
        q: "How much does a 1 BHK flat cost in Malad West?",
        a: "A 1 BHK of 400 to 450 sq ft in Malad West asks about ₹1.13 to ₹1.39 crore, at Square Yards' 28,250 to 30,800 rupees per sq ft. Resale buildings ask less: Broker Network's July 2026 resale range of 14,000 to 24,000 per sq ft puts a 1 BHK at about ₹56 lakh to ₹1.08 crore.",
      },
      {
        q: "How much does a 2 BHK flat cost in Malad West?",
        a: "A 2 BHK of about 700 sq ft in Malad West asks about ₹1.98 to ₹2.16 crore at Square Yards' 28,250 to 30,800 rupees per sq ft. In Evershine Nagar, near 32,000 per sq ft on Dwello's figures, it asks about ₹2.24 crore. It is an asking figure, not a price paid.",
      },
      {
        q: "How much does a 3 BHK flat cost in Malad West?",
        a: "A 3 BHK of about 950 sq ft in Malad West asks about ₹2.68 to ₹2.93 crore at Square Yards' rates. Evershine Nagar takes it to about ₹3.04 crore. Stamp duty and registration come on top.",
      },
      {
        q: "Are there new projects in Malad West?",
        a: "Yes. Square Yards listed 10 newly launched and 17 under construction projects in Malad West when read on 16 November 2026. Our projects page covers Kandivali West and Borivali West. For Malad West, send us your budget and we share the launches that fit, each with its MahaRERA registration checked.",
      },
      {
        q: "Are new or resale flats cheaper in Malad West?",
        a: "Resale. Broker Network's July 2026 guide puts resale flats at 14,000 to 24,000 rupees per square foot and new flats at 18,000 to 30,000. Resale buying needs the usual title and society checks, which we do for you.",
      },
      SALE_FAQ_ASKING,
      SALE_FAQ_DUTY,
      {
        q: "Is Malad West a good place to buy a flat to rent out?",
        a: "It is one of the strongest in the western suburbs for it. The Mindspace office district keeps a large, steady population of renters close by. Yields are reported at 3 to 4 percent gross. We work out the net figure on the actual flat before you commit.",
      },
      {
        q: "Evershine Nagar or Orlem?",
        a: "Evershine Nagar suits buyers who want newer premium buildings near New Link Road and the metro. Orlem suits buyers who want a settled community with its own character, and often more space for the money.",
      },
      {
        q: "Do you also help me sell my flat here?",
        a: "Yes. We price it against what similar flats have really registered for. For a flat with a tenant in it, we show it to investors who value the rent. Send us the building's name and we will tell you what it would ask this month, free.",
      },
    ],
    waMessage: "Hi Shree Giriraj, I am looking to buy a ___ BHK in Malad West, to live in / to let. My budget is about ___. Can you send me what fits?",
    sources: MALAD_SOURCES,
  },
  {
    area: "malad",
    intent: "rent",
    place: "Malad West",
    metaTitle: "Flats for rent in Malad West: 1, 2, 3 BHK",
    metaDescription:
      "Flats for rent in Malad West near Mindspace: 1, 2 and 3 BHK rents checked November 2026, with deposits. WhatsApp your size and budget today.",
    h1: "Flats for rent in Malad West: 1, 2 and 3 BHK",
    answer:
      "A 2 BHK in Malad West asks about ₹42,000 to ₹65,000 a month and a 3 BHK ₹60,000 to ₹1 lakh, on Broker Network's July 2026 figures. A 1 BHK works out near ₹37,000 to ₹42,000 at Square Yards' average rent of ₹93 per sq ft. Deposits run two to three months.",
    intro:
      "Malad West's tenants are the part of this market we know best. We have let flats here since 1996, to Mindspace professionals, families and company leases. We shortlist around where you work, so the commute is settled before you visit.",
    updatedOn: UPDATED,
    quick: [
      { size: "1 BHK", figure: "about ₹37,000 to ₹42,000 a month", basis: "400 to 450 sq ft at ₹93 per sq ft (Square Yards, read 16 November 2026)" },
      { size: "2 BHK", figure: "₹42,000 to ₹65,000 a month" },
      { size: "3 BHK", figure: "₹60,000 to ₹1 lakh a month" },
    ],
    quickNote: "2 and 3 BHK: asking rents for Malad West, Broker Network, July 2026. 1 BHK: Square Yards' average rent per sq ft times the size. Deposit: two to three months' rent in newer societies.",
    image: {
      src: "/premium/u/handover-06.jpg",
      alt: "Two people at a window looking out at the city at dusk",
    },
    sizes: [
      {
        size: "1 BHK",
        figure: "37,000 to 42,000 a month",
        figureNote: "400 to 450 sq ft at Square Yards' Malad West average of ₹93 per sq ft, read 16 November 2026",
        suits: "Mindspace professionals and couples who want to walk or take a short auto ride to work.",
        check: "The society's rules for tenants, and the walk to the office or the metro.",
      },
      {
        size: "2 BHK",
        figure: "42,000 to 65,000 a month",
        figureNote: "Malad West, Broker Network, July 2026",
        suits: "Families and sharing professionals, in Evershine Nagar, Orlem and along Link Road.",
        check: "Move in charges, parking, and what the maintenance covers.",
      },
      {
        size: "3 BHK",
        figure: "60,000 to 1 lakh a month",
        figureNote: "Malad West, Broker Network, July 2026",
        suits: "Larger families and company leases in the Link Road complexes.",
        check: "What is included in the rent, written into the agreement.",
      },
    ],
    figuresNote: "Asking rents, Broker Network July 2026 for Malad West, and Square Yards' average rent per sq ft for the 1 BHK.",
    checks: [
      "That the person letting the flat is the owner, or holds a registered power of attorney",
      "The society's rules for tenants, before you visit",
      "A registered leave and licence agreement",
      "Tenant police verification, filed with the agreement",
      "The deposit and the refund date, in writing",
    ],
    faqs: [
      {
        q: "What is the rent of a 1 BHK in Malad West?",
        a: "A 1 BHK of 400 to 450 sq ft in Malad West works out near ₹37,000 to ₹42,000 a month. That uses Square Yards' average rent of ₹93 per sq ft, read 16 November 2026. Malad East asks ₹25,000 to ₹50,000 on NoBroker's April 2026 figures. The deposit in newer societies is two to three months' rent.",
      },
      {
        q: "What is the rent of a 2 BHK in Malad West?",
        a: "A 2 BHK in Malad West asks about ₹42,000 to ₹65,000 a month on Broker Network's July 2026 figures. The deposit in newer societies is two to three months' rent. Flats within a short ride of Mindspace let fastest.",
      },
      {
        q: "What is the rent of a 3 BHK in Malad West?",
        a: "A 3 BHK in Malad West asks about ₹60,000 to ₹1 lakh a month on Broker Network's July 2026 figures. The deposit in newer societies is two to three months' rent. What is included in the rent is written into the agreement.",
      },
      RENT_FAQ_DEPOSIT,
      RENT_FAQ_AGREEMENT,
      RENT_FAQ_POLICE,
      {
        q: "How close to Mindspace can I rent?",
        a: "Evershine Nagar and the Link Road belt are the closest residential pockets, a short auto ride away. Orlem and Marve Road are a little further and often give more space for the rent.",
      },
      {
        q: "Do you arrange company leases?",
        a: "Yes. We work with the company's requirements on the agreement, the deposit and the documents. We work with the owner on the terms. The lease is then registered in the right name.",
      },
      {
        q: "How soon can I move in?",
        a: "Often within a week of choosing the flat, once the agreement is registered and the society has its paperwork. We run these in parallel so nothing waits.",
      },
    ],
    waMessage: "Hi Shree Giriraj, I am looking to rent a ___ BHK in Malad West. My budget is about ___ a month and I work near ___. Can you help?",
    sources: MALAD_SOURCES,
  },
];

export const LISTING_SEGMENT: Record<ListingIntent, string> = {
  sale: "flats-for-sale",
  rent: "flats-for-rent",
};

export function listingPath(l: Pick<FlatListing, "area" | "intent">): string {
  return `/areas/${l.area}/${LISTING_SEGMENT[l.intent]}`;
}

export function getListing(area: string, segment: string): FlatListing | undefined {
  const intent = (Object.keys(LISTING_SEGMENT) as ListingIntent[]).find((k) => LISTING_SEGMENT[k] === segment);
  return intent ? FLAT_LISTINGS.find((l) => l.area === area && l.intent === intent) : undefined;
}

export function listingsFor(intent: ListingIntent): FlatListing[] {
  return FLAT_LISTINGS.filter((l) => l.intent === intent);
}
