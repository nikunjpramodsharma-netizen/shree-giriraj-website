/**
 * "Real estate agency in <suburb>" landing pages, one per suburb.
 *
 * WHY THEY EXIST
 *
 * Search Console (last 30 days, read 21 November 2026) showed the site ranking
 * positions 5 to 7 for MHADA and paperwork guides but absent for the
 * commercial local searches: "real estate agent in malad west" (320 a month),
 * "real estate agent in borivali west" (90) and "estate agents in kandivali
 * west" (90). The first page for those is Justdial plus small agency sites
 * whose title and H1 name the suburb and the trade. The area pages are titled
 * for property rates, and the homepage heading named no place, so no page
 * answered "who is the real estate agency in this suburb".
 *
 * WHAT IS AND IS NOT HERE
 *
 * The copy is written once per suburb, not templated with the name swapped.
 * Every fact is one the site already states: the pockets and services come
 * from areas.ts and the service pages, the money is read from flats.ts at
 * render time (nothing is typed in by hand), and the FAQ answers repeat what
 * the contact, about and flats pages already say. Our own wording is
 * "agency", never "agent". There is no rating, review count or testimonial.
 */

import { FLAT_LISTINGS, listingPath, type FlatListing } from "@/lib/flats";

export type AgencyPage = {
  /** The area slug, shared with /areas/[slug]. */
  slug: string;
  /** "Borivali West". */
  place: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** The opening answer: who we are, where the office is, what we do here. */
  answer: string;
  /** The pockets we cover, with one line each. */
  pocketsIntro: string;
  pockets: { name: string; line: string }[];
  /** Four short blocks: buy, sell, rent, MHADA. */
  services: { title: string; body: string; href: string; cta: string }[];
  /** What we ask for on WhatsApp, to complete "Tell us ..." */
  ask: string;
  howIntro: string;
  waMessage: string;
  faqs: { q: string; a: string }[];
};

const REG = "Yes. Shree Giriraj Real Estate holds MahaRERA registration A51800005726, which you can check free on the MahaRERA portal. The firm has worked in real estate since 1996 and from this office since 2005.";

export const AGENCY_PAGES: AgencyPage[] = [
  {
    slug: "borivali-west",
    place: "Borivali West",
    metaTitle: "Real estate agency in Borivali West",
    metaDescription:
      "A family run real estate agency in Chikoowadi, Borivali West, in real estate since 1996. Buy, sell or rent a flat. Same day shortlist on WhatsApp.",
    h1: "Real estate agency in Borivali West",
    answer:
      "Shree Giriraj Real Estate is a family run, MahaRERA registered real estate agency with its office in Chikoowadi, so in Borivali West we are your neighbours, not visitors. We have worked in real estate since 1996 and from this office since 2005. We help you buy a resale flat or book in a new project, sell your flat, rent a home or let yours, and settle MHADA paperwork. The person who answers is the person handling your file.",
    pocketsIntro:
      "Borivali West is a set of very different pockets, and the right one depends on the school run and the commute. These are the ones we walk every week.",
    pockets: [
      { name: "Chikoowadi", line: "older cooperative societies beside newer towers, near the Shimpoli metro. It is our own pocket and the one we know best." },
      { name: "Shimpoli and Yogi Nagar", line: "newer towers near the metro, and the pockets that ask the most in the West." },
      { name: "I.C. Colony", line: "the East Indian heart of Borivali, where the price swings with the age of the building." },
      { name: "L.T. Road and Chandavarkar Road", line: "the station belt, with the market and the shopping lanes, for anyone who commutes by train." },
      { name: "Eksar Road and the Gorai stretch", line: "pockets that ask less per square foot, towards the creek." },
    ],
    services: [
      {
        title: "Buying",
        body: "A resale flat is ready to move into and priced against the building next door. A new project lets you pay in stages and choose the floor. We show you both, and read the MahaRERA record with you.",
        href: "/services/resale-flats",
        cta: "Resale flats",
      },
      {
        title: "Selling",
        body: "We price your flat against what similar flats in your pocket ask and register for, prepare the papers a careful buyer will ask for, and show it only to buyers who can complete. The price opinion is free.",
        href: "/services/resale-flats",
        cta: "Sell your flat",
      },
      {
        title: "Renting",
        body: "We shortlist around your commute, tell you the society's rules for tenants before you visit, and arrange a registered leave and licence agreement with police verification.",
        href: "/services/rentals",
        cta: "Rentals",
      },
      {
        title: "MHADA paperwork",
        body: "A MHADA colony stands beside the Borivali West metro. We handle transfers and no objection certificates for MHADA flats, here and anywhere in Mumbai.",
        href: "/services/mhada-paperwork",
        cta: "MHADA paperwork",
      },
    ],
    ask: "the size, your budget and the pocket you like",
    howIntro:
      "Portals show you every flat that is listed. We send you only the ones that match, so your weekend goes on flats worth seeing.",
    waMessage:
      "Hi Shree Giriraj, I am looking to buy or rent a ___ BHK in Borivali West. My budget is about ___. Can you send me what fits?",
    faqs: [
      { q: "Is Shree Giriraj a registered real estate agency in Borivali West?", a: REG },
      {
        q: "Do you charge for a first conversation?",
        a: "No. The first conversation is free, whether on WhatsApp, by phone or at the office. It usually happens the same day, and there is no obligation.",
      },
      {
        q: "Where is your office, and when are you open?",
        a: "Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092. The commercial complex is known locally as Garden Groove Shopping Centre. We are open 9 am to 9 pm, all seven days.",
      },
      {
        q: "How quickly will I get a shortlist?",
        a: "Usually the same day. Send the size, the budget and the pocket on WhatsApp. We reply with the flats that fit, each with its asking price and a word on the society, and line up the viewings for one visit.",
      },
      {
        q: "Can you help with MHADA paperwork for a flat in Borivali West?",
        a: "Yes. MHADA paperwork we handle anywhere in Mumbai, because every Mumbai Board file goes to the same office in Bandra East.",
      },
    ],
  },
  {
    slug: "kandivali",
    place: "Kandivali West",
    metaTitle: "Real estate agency in Kandivali West",
    metaDescription:
      "Real estate agency for Kandivali West since 1996, from Mahavir Nagar to Charkop. Buy, sell or rent a flat, with a same day shortlist on WhatsApp.",
    h1: "Real estate agency in Kandivali West",
    answer:
      "Kandivali West is the next suburb south of our Chikoowadi office, and Metro Line 2A links the two. Shree Giriraj Real Estate is a family run, MahaRERA registered real estate agency, in real estate since 1996, and Kandivali West is part of our everyday patch. We help you buy a resale flat or a new launch, sell your flat, rent or let a home, and handle the MHADA permissions that Charkop flats need.",
    pocketsIntro:
      "Kandivali West runs from family societies near the metro to the planned MHADA sectors of Charkop. We know each of them by building, not just by name.",
    pockets: [
      { name: "Mahavir Nagar", line: "the Gujarati heart of the West, about 450 metres from the Kandivali West metro, with good schools and a row of food lanes." },
      { name: "Charkop", line: "MHADA sectors laid out since 1986, with a 53 society complex heading for cluster redevelopment." },
      { name: "Dahanukarwadi", line: "more space for the money, a short ride from Mahavir Nagar." },
      { name: "The Link Road towers", line: "the newer buildings, where we check the occupancy certificate and the maintenance first." },
    ],
    services: [
      {
        title: "Buying",
        body: "Kandivali is where much of the new launch activity in our patch sits. We compare the launches with resale flats in the same pocket, and read each project's MahaRERA record with you before you book.",
        href: "/projects",
        cta: "New projects",
      },
      {
        title: "Selling",
        body: "Send us the building's name and we tell you what it would ask this month, free. We prepare the papers a careful buyer will ask for and show the flat only to buyers who can complete.",
        href: "/services/resale-flats",
        cta: "Sell your flat",
      },
      {
        title: "Renting",
        body: "From Mahavir Nagar's family societies to the Link Road towers and Charkop's quieter sectors, we shortlist around your commute, so every visit is worth the trip.",
        href: "/services/rentals",
        cta: "Rentals",
      },
      {
        title: "MHADA paperwork",
        body: "A Charkop flat needs the Board's permissions. We check the transfer history and the society's position before a token is paid, and handle the paperwork as part of the purchase.",
        href: "/services/mhada-paperwork",
        cta: "MHADA paperwork",
      },
    ],
    ask: "the size, your budget and whether Mahavir Nagar, Dahanukarwadi or Charkop appeals",
    howIntro:
      "Send us what you want once and we do the searching. You see only the Kandivali West flats that match, and each comes with an honest word on its society.",
    waMessage:
      "Hi Shree Giriraj, I am looking to buy or rent a ___ BHK in Kandivali West. My budget is about ___. Can you send me what fits?",
    faqs: [
      { q: "Is Shree Giriraj a registered real estate agency for Kandivali West?", a: REG },
      {
        q: "Is there a cost to work with you?",
        a: "Nothing to start. The first conversation and the price opinion are free, and brokerage is agreed in writing before we begin. On a rental, there is nothing to pay until the tenancy completes.",
      },
      {
        q: "Where do I find you, if I live in Kandivali West?",
        a: "Our office is at Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092, open 9 am to 9 pm, all seven days. Most of what we do runs on WhatsApp, so you can start without a visit.",
      },
      {
        q: "How quickly will I get a shortlist?",
        a: "Usually the same day. Send the size, the budget and the pocket on WhatsApp. We reply with the flats that fit, each with its asking price and a word on the society, and line up the viewings for one visit.",
      },
      {
        q: "Can I buy a MHADA flat in Charkop?",
        a: "Yes, with the Board's permissions in order. We check the transfer history and the society's position before a token is paid, and handle the MHADA paperwork as part of the purchase.",
      },
    ],
  },
  {
    slug: "malad",
    place: "Malad West",
    metaTitle: "Real estate agency in Malad West",
    metaDescription:
      "Real estate agency for Malad West since 1996, from Evershine Nagar to Orlem. Buy, let or rent a flat, with a same day shortlist on WhatsApp.",
    h1: "Real estate agency in Malad West",
    answer:
      "Malad West is two suburbs south of our Chikoowadi office, and part of our everyday patch. Shree Giriraj Real Estate is a family run, MahaRERA registered real estate agency, in real estate since 1996. Malad West is the most investor driven of the three suburbs we work in, so we help you buy to live in or to let, find tenants for your flat, rent a home near your office, and sell with the rent in mind.",
    pocketsIntro:
      "Malad West splits into an office district, a premium pocket and an old village, and each rents and sells differently.",
    pockets: [
      { name: "Mindspace and the Link Road belt", line: "the office district, which keeps a large, steady population of renters close by." },
      { name: "Evershine Nagar", line: "newer premium buildings near New Link Road and the Malad West metro." },
      { name: "Orlem and Marve Road", line: "a settled community with its own character, and often more space for the money." },
      { name: "Jankalyan Nagar", line: "where the asking rates run lowest, for buyers watching the budget." },
    ],
    services: [
      {
        title: "Buying",
        body: "Whether you buy to live in or to let, every building we send comes with the rent it realistically earns. We work out the net figure on the actual flat before you commit.",
        href: "/services/resale-flats",
        cta: "Resale flats",
      },
      {
        title: "Selling",
        body: "We price your flat against what similar flats have really registered for. For a flat with a tenant in it, we show it to investors who value the rent.",
        href: "/services/resale-flats",
        cta: "Sell your flat",
      },
      {
        title: "Renting and letting",
        body: "Tenants are the part of this market we know best: Mindspace professionals, families and company leases. We shortlist around where you work, and for owners we find the tenant and handle the agreement.",
        href: "/services/rentals",
        cta: "Rentals",
      },
      {
        title: "MHADA paperwork",
        body: "If your flat or file sits with the Mumbai Board, we handle transfers and no objection certificates for it, wherever in Mumbai it is.",
        href: "/services/mhada-paperwork",
        cta: "MHADA paperwork",
      },
    ],
    ask: "the size, your budget and whether you will live in the flat or let it",
    howIntro:
      "Say what you need once, and we send you only the Malad West flats that fit, from a pocket we have checked.",
    waMessage:
      "Hi Shree Giriraj, I am looking to buy or rent a ___ BHK in Malad West. My budget is about ___. Can you send me what fits?",
    faqs: [
      { q: "Is Shree Giriraj a registered real estate agency in Malad West?", a: REG },
      {
        q: "Is there a cost to list my flat for sale or rent?",
        a: "Nothing to start. The first conversation and the price opinion are free, and brokerage is agreed in writing before we begin. On a rental, there is nothing to pay until the tenancy completes.",
      },
      {
        q: "When are you open?",
        a: "We are open 9 am to 9 pm, all seven days, at our office in Chikoowadi, Borivali West. WhatsApp is the quickest way to reach us from Malad West.",
      },
      {
        q: "How quickly will I get a shortlist?",
        a: "Usually the same day. Send the size, the budget and the pocket on WhatsApp. We reply with the flats that fit, each with its asking price and a word on the society, and line up the viewings for one visit.",
      },
      {
        q: "Can you sell a flat that has a tenant in it?",
        a: "Yes. For a flat with a tenant in it, we show it to investors who value the rent. Send us the building's name and we will tell you what it would ask this month, free.",
      },
    ],
  },
];

/** The date the three pages went live; the sitemap lastmod. */
export const AGENCY_LASTMOD = "2026-11-21";

export const AGENCY_SLUGS = AGENCY_PAGES.map((p) => p.slug);

export function agencyPagePath(slug: string): string {
  return `/areas/${slug}/real-estate-agency`;
}

export function getAgencyPage(slug: string): AgencyPage | undefined {
  return AGENCY_PAGES.find((p) => p.slug === slug);
}

/**
 * The price and rent rows, read from the flats data so nothing is typed twice.
 * Returns the sale and rent listing for the suburb, if both exist.
 */
export function priceRows(slug: string): {
  size: string;
  buy: { figure: string; basis?: string };
  rent: { figure: string; basis?: string };
}[] {
  const sale: FlatListing | undefined = FLAT_LISTINGS.find((l) => l.area === slug && l.intent === "sale");
  const rent: FlatListing | undefined = FLAT_LISTINGS.find((l) => l.area === slug && l.intent === "rent");
  if (!sale || !rent) return [];
  return sale.quick.map((q) => {
    const r = rent.quick.find((x) => x.size === q.size);
    return {
      size: q.size,
      buy: { figure: q.figure, basis: q.basis },
      rent: { figure: r?.figure ?? "", basis: r?.basis },
    };
  });
}

export function agencyListingLinks(slug: string): { sale: string | null; rent: string | null } {
  const sale = FLAT_LISTINGS.find((l) => l.area === slug && l.intent === "sale");
  const rent = FLAT_LISTINGS.find((l) => l.area === slug && l.intent === "rent");
  return { sale: sale ? listingPath(sale) : null, rent: rent ? listingPath(rent) : null };
}
