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
 * the site answered them. These six pages do.
 *
 * WHY SIX AND NOT THIRTY SIX
 *
 * One page per suburb per intent, each covering 1, 2 and 3 BHK. A page per
 * size per side would be thin and near identical, which is what Google calls
 * a doorway page. Six pages with real, different content are worth more.
 *
 * THE FIGURES
 *
 * Every number here is one already published on the area guides (areas.ts),
 * with the same source and month, or from Broker Network's July 2026 Malad
 * West guide, which the Malad guide already cites. Nothing is estimated. Where
 * a figure is for the whole suburb or the other side of the tracks, the label
 * says so, and where no West side figure exists the page says that too.
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
  /** The figure for each size, shown in the first lines of the page. */
  quick: { size: string; figure: string; basis?: string }[];
  /** What the quick figures are, with the source and date. */
  quickNote: string;
  image: { src: string; alt: string };
  sizes: FlatSize[];
  figuresNote: string;
  /** For sale pages: asking rates by pocket, fed to the estimator. */
  pockets?: EstimatorPocket[];
  checks: string[];
  faqs: { q: string; a: string }[];
  waMessage: string;
  sources: { label: string; url: string }[];
};

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

const BORIVALI_SOURCES = [
  { label: "NoBroker, property rates in Borivali West by pocket, 25 May 2026", url: "https://www.nobroker.in/blog/property-rates-in-borivali-west" },
  { label: "Square Yards, Borivali West property rates, June 2026", url: "https://www.squareyards.com/property-rates/borivali-west-mumbai" },
];
const KANDIVALI_SOURCES = [
  { label: "Square Yards, Kandivali West property rates, 2026", url: "https://www.squareyards.com/property-rates/kandivali-west-mumbai" },
  { label: "NoBroker, Kandivali West locality report, rents, 2026", url: "https://www.nobroker.in/locality-iq/kandivali-west-mumbai-liqlt" },
];
const MALAD_SOURCES = [
  { label: "Broker Network, Malad West property rates and locality guide, updated July 2026", url: "https://brokernetwork.in/malad-west-mumbai-property-rates-locality-guide-pros-cons-2026/" },
  { label: "Square Yards, Malad West overview and rates, 9 September 2026", url: "https://www.squareyards.com/malad-west-in-mumbai-overview-924" },
  { label: "NoBroker, Malad East locality report, April 2026", url: "https://www.nobroker.in/locality-iq/malad-east-malad-mumbai-liqlt" },
];

export const FLAT_LISTINGS: FlatListing[] = [
  {
    area: "borivali-west",
    intent: "sale",
    place: "Borivali West",
    metaTitle: "Flats for sale in Borivali West: 1, 2, 3 BHK",
    metaDescription:
      "1, 2 and 3 BHK flats for sale in Borivali West, with asking rates by pocket. WhatsApp your size and budget for flats that fit, usually the same day.",
    h1: "1, 2 and 3 BHK flats for sale in Borivali West",
    answer:
      "A 2 BHK of about 700 sq ft in Borivali West asks about ₹2.10 to ₹2.19 crore. A 3 BHK of about 950 sq ft asks about ₹2.85 to ₹2.97 crore. Both use the mid 2026 average of 30,000 to 31,300 rupees per square foot. The pocket moves the price more than the size does, so decide the pocket first.",
    intro:
      "We have sold flats in Borivali West since 1996, from our office in Chikoowadi since 2005. Every flat we send comes with what the society is like to live in.",
    quick: [
      { size: "2 BHK", figure: "₹2.10 to ₹2.19 crore", basis: "about 700 sq ft" },
      { size: "3 BHK", figure: "₹2.85 to ₹2.97 crore", basis: "about 950 sq ft" },
      { size: "1 BHK", figure: "Ask us", basis: "send the size you want" },
    ],
    quickNote: "Asking figures, mid 2026, not prices paid. The rate is the 30,000 to 31,300 rupees per sq ft average (NoBroker, May 2026, and Square Yards, June 2026). It is multiplied by about 700 and 950 sq ft, the sizes of 2 and 3 BHK homes in new projects on this site.",
    image: {
      src: "/premium/flats/borivali-west-towers.jpg",
      alt: "A residential tower rising above tree covered Borivali West, with the creek and the pagoda on the horizon",
    },
    sizes: [
      {
        size: "1 BHK",
        figure: null,
        suits: "First homes, single buyers, and buyers who may let the flat out later.",
        check: "The society's no objection for a sale. And whether the building is heading for redevelopment, because that changes what the flat is worth.",
      },
      {
        size: "2 BHK",
        figure: null,
        suits: "The usual family size. Yogi Nagar and Shimpoli ask the most; in I.C. Colony the rate varies most with the age of the building.",
        check: "Carpet area as RERA defines it against the area on the listing, and the parking the society will allot in writing.",
      },
      {
        size: "3 BHK",
        figure: null,
        suits: "Larger families and buyers upgrading within Borivali, often in the newer buildings on the Link Road side.",
        check: "Water pressure on the upper floors in the morning and the monthly maintenance, which rises with the amenities.",
      },
    ],
    figuresNote: "Asking rates per square foot by pocket, NoBroker, May 2026. Asking is not the registered price.",
    pockets: [
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
      SALE_FAQ_ASKING,
      SALE_FAQ_DUTY,
      {
        q: "Which pocket of Borivali West is best for a family?",
        a: "Shimpoli and Yogi Nagar for newer towers near the metro, Chikoowadi for quieter established societies, and I.C. Colony for larger flats and a strong community. The right one depends on the school run and the commute, which is the first thing we ask.",
      },
      {
        q: "Can I buy a resale flat in an older society safely?",
        a: "Yes, and many of the best value flats in Borivali West are exactly that. What makes it safe is reading the title chain, the society's records and the redevelopment position before any money moves. That is the work we do before a token is paid.",
      },
      {
        q: "Do you also help me sell my flat here?",
        a: "Yes. We price it against what similar flats have really registered for. We prepare the papers a careful buyer will ask for. We show it only to buyers who can complete.",
      },
      {
        q: "How quickly can I see flats?",
        a: "Usually within a day or two. Send the size, the budget and the pocket on WhatsApp. We will line up the viewings together, so you can see several flats in one visit.",
      },
      {
        q: "How much does a 2 BHK cost in Borivali West?",
        a: "A 2 BHK of about 700 sq ft asks about ₹2.10 to ₹2.19 crore. That uses the mid 2026 average asking rate of 30,000 to 31,300 rupees per square foot. It is an asking figure, not a price paid. The pocket changes it. Chikoowadi asks 25,000 to 26,000 per square foot and Yogi Nagar 27,000 to 33,800.",
      },
      {
        q: "How much does a 3 BHK cost in Borivali West?",
        a: "At the same average, a 3 BHK of about 950 sq ft asks about ₹2.85 to ₹2.97 crore. Stamp duty and registration come on top. Send us the pocket and the size and we will give you the figure for the building.",
      },
      {
        q: "Which pocket of Borivali West asks the least, and which the most?",
        a: "On NoBroker's May 2026 figures, Yogi Nagar asks the most of the main pockets, at 27,000 to 33,800 rupees per square foot. Chikoowadi asks 25,000 to 26,000. Eksar Road (13,000 to 26,000) and the Gorai stretch (10,900 to 23,200) ask less.",
      },
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
      "1, 2 and 3 BHK flats for rent in Borivali West, with 2026 rents and deposits. WhatsApp your size and budget for flats that fit, usually the same day.",
    h1: "1, 2 and 3 BHK flats for rent in Borivali West",
    answer:
      "A 1 BHK in Borivali asks about ₹22,000 to ₹40,000 a month. A 2 BHK asks ₹35,000 to ₹65,000 and a 3 BHK ₹55,000 to ₹1 lakh. These are NoBroker's 2026 asking figures. The deposit in newer societies runs two to three months. The pocket, the building's age and the floor explain the spread inside each size.",
    intro:
      "We have let flats in Borivali West since 1996. We know which societies welcome tenants, what their rules are, and which owners keep their flats well. We shortlist around your commute, so you only visit flats that work for your day.",
    quick: [
      { size: "1 BHK", figure: "₹22,000 to ₹40,000 a month" },
      { size: "2 BHK", figure: "₹35,000 to ₹65,000 a month" },
      { size: "3 BHK", figure: "₹55,000 to ₹1 lakh a month" },
    ],
    quickNote: "Asking rents for Borivali as a whole, NoBroker, 2026. Deposit: two to three months' rent in newer societies.",
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
    figuresNote: "Midpoint ranges of asking rents for Borivali as a whole, NoBroker 2026. Deposits run two to three months in newer societies.",
    checks: [
      "That the person letting the flat is the owner, or holds a registered power of attorney",
      "The society's rules for tenants, before you visit",
      "A registered leave and licence agreement",
      "Tenant police verification, filed with the agreement",
      "The deposit and the refund date, in writing",
    ],
    faqs: [
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
      {
        q: "What is the rent of a 1 BHK in Borivali West?",
        a: "A 1 BHK in Borivali asks about ₹22,000 to ₹40,000 a month on NoBroker's 2026 asking figures. The deposit in newer societies is two to three months' rent. Near the station or the metro costs more.",
      },
      {
        q: "What is the rent of a 2 BHK in Borivali West?",
        a: "A 2 BHK in Borivali asks about ₹35,000 to ₹65,000 a month on NoBroker's 2026 asking figures. The deposit in newer societies is two to three months' rent. Newer towers sit at the top of the range.",
      },
      {
        q: "What is the rent of a 3 BHK in Borivali West?",
        a: "A 3 BHK in Borivali asks about ₹55,000 to ₹1 lakh a month on NoBroker's 2026 asking figures. The deposit in newer societies is two to three months' rent. What is included in the rent is written into the agreement.",
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
      "1, 2 and 3 BHK flats for sale in Kandivali West, with asking rates by pocket. WhatsApp your size and budget for flats that fit, usually the same day.",
    h1: "1, 2 and 3 BHK flats for sale in Kandivali West",
    answer:
      "A 2 BHK of about 700 sq ft in Kandivali West asks about ₹1.75 to ₹1.89 crore. A 3 BHK of about 950 sq ft asks about ₹2.38 to ₹2.57 crore. Both use the mid 2026 average of 25,000 to 27,000 rupees per square foot. Mahavir Nagar asks more, near 36,450. The Charkop sectors ask less.",
    intro:
      "Kandivali West is a market we have worked since 1996, from the Gujarati heart of Mahavir Nagar to Charkop's MHADA sectors. Every building we send comes with an honest word on its society.",
    quick: [
      { size: "2 BHK", figure: "₹1.75 to ₹1.89 crore", basis: "about 700 sq ft" },
      { size: "3 BHK", figure: "₹2.38 to ₹2.57 crore", basis: "about 950 sq ft" },
      { size: "1 BHK", figure: "Ask us", basis: "send the size you want" },
    ],
    quickNote: "Asking figures, mid 2026, not prices paid. The rate is the 25,000 to 27,000 rupees per sq ft average (Square Yards, 2026). It is multiplied by about 700 and 950 sq ft, the sizes of 2 and 3 BHK homes in new projects on this site.",
    image: {
      src: "/premium/towers-night-water.jpg",
      alt: "Residential towers lit at night, reflected in still water",
    },
    sizes: [
      {
        size: "1 BHK",
        figure: null,
        suits: "First buyers and investors. In Charkop's MHADA sectors, the Board's permissions are part of every purchase.",
        check: "For a MHADA flat, the transfer history and the Board's permissions, which we check before anything is signed.",
      },
      {
        size: "2 BHK",
        figure: null,
        suits: "Families who want Mahavir Nagar's schools and food lanes, or more space for the money in Dahanukarwadi.",
        check: "Carpet area as RERA defines it, and the floor, which moves the price more than the size does in a tall tower.",
      },
      {
        size: "3 BHK",
        figure: null,
        suits: "Upgrading families, mostly in the newer towers on the Link Road side.",
        check: "The occupancy certificate and the society's maintenance, before the price is agreed.",
      },
    ],
    figuresNote: "Asking rates per square foot as reported by Square Yards, 2026. Asking is not the registered price.",
    pockets: [
      { label: "Mahavir Nagar", low: 36450, high: 36450, note: "Square Yards, 2026" },
      { label: "Dahanukarwadi", low: 27750, high: 27750, note: "Square Yards, 2026" },
      { label: "Charkop sectors", low: 23350, high: 26150, note: "Square Yards, 2026" },
    ],
    checks: [
      "The title chain and the Index 2 of every earlier sale",
      "For MHADA layouts, the transfer and permissions history",
      "Carpet area as RERA defines it",
      "The occupancy certificate on newer towers",
      "Where any cluster redevelopment in Charkop has really reached",
    ],
    faqs: [
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
        a: "Yes. We price it against what similar flats have really registered for. We prepare the papers a careful buyer will ask for. We show it only to buyers who can complete.",
      },
      {
        q: "How quickly can I see flats?",
        a: "Usually within a day or two. Send the size, the budget and the pocket on WhatsApp and we will line up several viewings for one visit.",
      },
      {
        q: "How much does a 2 BHK cost in Kandivali West?",
        a: "A 2 BHK of about 700 sq ft asks about ₹1.75 to ₹1.89 crore. That uses the mid 2026 average asking rate of 25,000 to 27,000 rupees per square foot. It is an asking figure, not a price paid. Mahavir Nagar asks near 36,450 per square foot, so the same flat there asks more.",
      },
      {
        q: "How much does a 3 BHK cost in Kandivali West?",
        a: "At the same average, a 3 BHK of about 950 sq ft asks about ₹2.38 to ₹2.57 crore. Stamp duty and registration come on top. Send us the pocket and the size and we will give you the figure for the building.",
      },
      {
        q: "Which pocket of Kandivali West asks the least, and which the most?",
        a: "On Square Yards' 2026 figures, Mahavir Nagar asks the most, near 36,450 rupees per square foot. Dahanukarwadi asks about 27,750. The Charkop sectors ask the least, at 23,350 to 26,150.",
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
      "1, 2 and 3 BHK flats for rent in Kandivali West, with 2026 rents and deposits. WhatsApp your size and budget for flats that fit, usually the same day.",
    h1: "1, 2 and 3 BHK flats for rent in Kandivali West",
    answer:
      "A 1 BHK in Kandivali West asks about ₹18,000 to ₹35,000 a month. A 2 BHK in Kandivali asks ₹35,000 to ₹65,000 and a 3 BHK ₹60,000 to ₹95,000. These are NoBroker's 2026 asking figures. Deposits in newer societies run two to three months. Kandivali gives more space for the rent than Borivali.",
    intro:
      "We have let flats across Kandivali since 1996, from Mahavir Nagar's family societies to the Link Road towers and Charkop's quieter sectors. We shortlist around your commute, so every visit is worth the trip.",
    quick: [
      { size: "1 BHK", figure: "₹18,000 to ₹35,000 a month", basis: "Kandivali West" },
      { size: "2 BHK", figure: "₹35,000 to ₹65,000 a month", basis: "Kandivali" },
      { size: "3 BHK", figure: "₹60,000 to ₹95,000 a month", basis: "Kandivali" },
    ],
    quickNote: "Asking rents, NoBroker, 2026. The 1 BHK figure is for the West; the 2 and 3 BHK figures are for Kandivali as a whole. Deposit: two to three months' rent in newer societies.",
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
    figuresNote: "Midpoint ranges of asking rents, NoBroker 2026. The 1 BHK figure is for the West; the 2 and 3 BHK figures are for Kandivali as a whole.",
    checks: [
      "That the person letting the flat is the owner, or holds a registered power of attorney",
      "The society's rules for tenants, before you visit",
      "A registered leave and licence agreement",
      "Tenant police verification, filed with the agreement",
      "The deposit and the refund date, in writing",
    ],
    faqs: [
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
      {
        q: "What is the rent of a 1 BHK in Kandivali West?",
        a: "A 1 BHK in Kandivali West asks about ₹18,000 to ₹35,000 a month on NoBroker's 2026 asking figures. The deposit in newer societies is two to three months' rent. Flats near the Kandivali West and Dahanukarwadi metro stations ask more.",
      },
      {
        q: "What is the rent of a 2 BHK in Kandivali West?",
        a: "A 2 BHK in Kandivali asks about ₹35,000 to ₹65,000 a month on NoBroker's 2026 asking figures. The deposit in newer societies is two to three months' rent. Move in charges and parking are worth asking about.",
      },
      {
        q: "What is the rent of a 3 BHK in Kandivali West?",
        a: "A 3 BHK in Kandivali asks about ₹60,000 to ₹95,000 a month on NoBroker's 2026 asking figures. The deposit in newer societies is two to three months' rent. What is included in the rent is written into the agreement.",
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
      "1, 2 and 3 BHK flats for sale in Malad West, with 2026 asking rates by pocket. WhatsApp your size and budget for flats that fit, usually the same day.",
    h1: "1, 2 and 3 BHK flats for sale in Malad West",
    answer:
      "A 2 BHK of about 700 sq ft in Malad West asks about ₹2.03 to ₹2.16 crore. A 3 BHK of about 950 sq ft asks about ₹2.76 to ₹2.93 crore. Both use the 2026 average of 29,000 to 30,800 rupees per square foot. Evershine Nagar asks more, near 32,000. Many buyers here are investors.",
    intro:
      "Malad West is the most investor driven of the three suburbs we work in, and we have sold here since 1996. Whether you are buying to live in or to let, every building we send comes with the rent it realistically earns.",
    quick: [
      { size: "2 BHK", figure: "₹2.03 to ₹2.16 crore", basis: "about 700 sq ft" },
      { size: "3 BHK", figure: "₹2.76 to ₹2.93 crore", basis: "about 950 sq ft" },
      { size: "1 BHK", figure: "Ask us", basis: "send the size you want" },
    ],
    quickNote: "Asking figures, 2026, not prices paid. The rate is the 29,000 to 30,800 rupees per sq ft average (Square Yards, September 2026). It is multiplied by about 700 and 950 sq ft, the sizes of 2 and 3 BHK homes in new projects on this site.",
    image: {
      src: "/premium/u/complex-05.jpg",
      alt: "A polished lobby with artwork and warm lighting",
    },
    sizes: [
      {
        size: "1 BHK",
        figure: null,
        suits: "Investors buying to let to Mindspace professionals, and first buyers who work nearby.",
        check: "The realistic tenant and rent for the building, before the purchase, so the yield is real.",
      },
      {
        size: "2 BHK",
        figure: null,
        suits: "Families and investors alike, in Evershine Nagar, Orlem and along Link Road.",
        check: "Carpet area as RERA defines it, and the society's rules on letting if you plan to rent it out.",
      },
      {
        size: "3 BHK",
        figure: null,
        suits: "Families upgrading into the larger newer complexes on the Link Road belt.",
        check: "The occupancy certificate and the maintenance, which rises with the amenities.",
      },
    ],
    figuresNote: "Asking rates per square foot as reported, with the source and month. Asking is not the registered price.",
    pockets: [
      { label: "Evershine Nagar", low: 32000, high: 32000, note: "Dwello, 2026" },
      { label: "Malad West average", low: 30800, high: 30800, note: "Square Yards, September 2026" },
      { label: "New flats, Malad West", low: 18000, high: 30000, note: "Broker Network, July 2026" },
      { label: "Resale flats, Malad West", low: 14000, high: 24000, note: "Broker Network, July 2026" },
      { label: "Jankalyan Nagar", low: 10666, high: 23846, note: "NoBroker, 2026" },
    ],
    checks: [
      "The title chain and the Index 2 of every earlier sale",
      "The society's rules on letting, for investors",
      "The realistic rent, net of maintenance and property tax",
      "Carpet area as RERA defines it",
      "The occupancy certificate on newer towers",
    ],
    faqs: [
      SALE_FAQ_ASKING,
      SALE_FAQ_DUTY,
      {
        q: "Is Malad West a good place to buy a flat to rent out?",
        a: "It is one of the strongest in the western suburbs for it. The Mindspace office district keeps a large, steady population of renters close by. Yields are reported at 3 to 4 percent gross. We work out the net figure on the actual flat before you commit.",
      },
      {
        q: "Evershine Nagar or Orlem?",
        a: "Evershine Nagar for newer premium buildings near New Link Road and the metro. Orlem for a settled community with its own character, and often more space for the money.",
      },
      {
        q: "Do you also help me sell my flat here?",
        a: "Yes. We price it against what similar flats have really registered for. For a flat with a tenant in it, we show it to investors who value the rent.",
      },
      {
        q: "How quickly can I see flats?",
        a: "Usually within a day or two. Send the size, the budget and whether it is to live in or to let, and we will line up several viewings for one visit.",
      },
      {
        q: "How much does a 2 BHK cost in Malad West?",
        a: "A 2 BHK of about 700 sq ft asks about ₹2.03 to ₹2.16 crore. That uses the 2026 average asking rate of 29,000 to 30,800 rupees per square foot. It is an asking figure, not a price paid. Evershine Nagar asks near 32,000 per square foot.",
      },
      {
        q: "How much does a 3 BHK cost in Malad West?",
        a: "At the same average, a 3 BHK of about 950 sq ft asks about ₹2.76 to ₹2.93 crore. Stamp duty and registration come on top. Send us the pocket and the size and we will give you the figure for the building.",
      },
      {
        q: "Are new or resale flats cheaper in Malad West?",
        a: "Resale. Broker Network's July 2026 guide puts resale flats at 14,000 to 24,000 rupees per square foot and new flats at 18,000 to 30,000. Resale buying needs the usual title and society checks, which we do for you.",
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
      "1, 2 and 3 BHK flats for rent in Malad West near Mindspace, with 2026 rents and deposits. WhatsApp us your size and budget for flats that fit.",
    h1: "1, 2 and 3 BHK flats for rent in Malad West",
    answer:
      "A 2 BHK in Malad West asks about ₹42,000 to ₹65,000 a month. A 3 BHK asks ₹60,000 to ₹1 lakh. These are Broker Network's July 2026 asking figures. For a 1 BHK we quote from the flats available this week. Deposits in newer societies run two to three months. Flats near Mindspace let fastest.",
    intro:
      "Malad West's tenants are the part of this market we know best. We have let flats here since 1996, to Mindspace professionals, families and company leases. We shortlist around where you work, so the commute is settled before you visit.",
    quick: [
      { size: "1 BHK", figure: "Ask us", basis: "no West side figure is published; Malad East asks ₹25,000 to ₹50,000" },
      { size: "2 BHK", figure: "₹42,000 to ₹65,000 a month" },
      { size: "3 BHK", figure: "₹60,000 to ₹1 lakh a month" },
    ],
    quickNote: "Asking rents for Malad West, Broker Network, July 2026. The Malad East 1 BHK figure is NoBroker, April 2026. Deposit: two to three months' rent in newer societies.",
    image: {
      src: "/premium/u/handover-06.jpg",
      alt: "Two people at a window looking out at the city at dusk",
    },
    sizes: [
      {
        size: "1 BHK",
        figure: null,
        figureNote: "No West side figure is published; Malad East asks 25,000 to 50,000 on NoBroker, April 2026",
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
    figuresNote: "Asking rents, Broker Network July 2026 for Malad West. For a 1 BHK we quote from the flats available this week.",
    checks: [
      "That the person letting the flat is the owner, or holds a registered power of attorney",
      "The society's rules for tenants, before you visit",
      "A registered leave and licence agreement",
      "Tenant police verification, filed with the agreement",
      "The deposit and the refund date, in writing",
    ],
    faqs: [
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
      {
        q: "What is the rent of a 1 BHK in Malad West?",
        a: "No West side figure is published. Malad East asks about ₹25,000 to ₹50,000 a month on NoBroker's April 2026 figures. We quote a 1 BHK in the West from the flats available this week. The deposit in newer societies is two to three months' rent.",
      },
      {
        q: "What is the rent of a 2 BHK in Malad West?",
        a: "A 2 BHK in Malad West asks about ₹42,000 to ₹65,000 a month on Broker Network's July 2026 figures. The deposit in newer societies is two to three months' rent. Flats within a short ride of Mindspace let fastest.",
      },
      {
        q: "What is the rent of a 3 BHK in Malad West?",
        a: "A 3 BHK in Malad West asks about ₹60,000 to ₹1 lakh a month on Broker Network's July 2026 figures. The deposit in newer societies is two to three months' rent. What is included in the rent is written into the agreement.",
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
