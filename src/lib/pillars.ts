/**
 * Pillar (hub) pages.
 *
 * WHY THIS LIVES IN CODE AND NOT IN SANITY
 *
 * A pillar page is 90 percent structure and 10 percent prose: an answer block,
 * an ordered reading path, and a curated set of links. That structure changes
 * about once a year. The spokes underneath it change weekly.
 *
 * Keeping the hub here means it renders today, with no CMS write token and no
 * seeded content, while the spokes fill in underneath as they are published.
 * The alternative, a `guide` document type, would give us a hub that cannot be
 * created until the token exists, and would still need this ordering encoded
 * somewhere.
 *
 * READINESS, NOT 404s
 *
 * Every spoke below is listed whether or not the post exists yet. The page
 * resolves the slugs at request time and shows only the published ones, so a
 * reader never meets a "Soon" card and nothing links into a hole. A spoke with
 * its own href (a service or tool page) always counts as published.
 *
 * SCOPE, decided 1 September 2026
 *
 * Registration, resale, renting, first time buyers and new build. Income tax
 * procedure is deliberately out of scope. See content/drafts/_parked/README.md.
 *
 * ENGLISH ONLY. New 2026 content is not translated, so these pages declare a
 * single available locale and therefore emit a canonical with no hreflang set,
 * rather than pointing at three URLs that do not exist.
 */

export type Spoke = {
  slug: string;
  /** Used until the post is published, and as the link text after. */
  title: string;
  /** One line on why a reader would open it. Not a summary of the post. */
  blurb: string;
  /**
   * A spoke that is a service or tool page rather than a blog post. It links
   * here directly and always counts as published.
   */
  href?: string;
};

export type PillarSection = {
  heading: string;
  intro: string;
  spokes: Spoke[];
};

export type Pillar = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** 40 to 60 words, complete on its own. This is the block that gets quoted. */
  answer: string;
  intro: string[];
  image: string;
  imageAlt: string;
  sections: PillarSection[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  /** Shown on the page. Undated reference content loses to dated content. */
  sourcesCheckedOn: string;
};

const propertyPaperwork: Pillar = {
  slug: "property-paperwork-maharashtra",
  title: "Property paperwork in Maharashtra",
  metaTitle: "Property paperwork in Maharashtra: a guide",
  metaDescription:
    "Every document in a Maharashtra property deal, in order: the checks before you pay, stamp duty and registration, then the steps after.",
  answer:
    "Property transactions in Maharashtra run through the Department of Registration and Stamps. Before you pay, you check what is already registered against the flat. At registration you pay stamp duty on the higher of the agreed price or the ready reckoner value. Afterwards you update the BMC property tax record into your own name.",
  intro: [
    "Most people meet these documents one at a time, in the week each one is needed. This page puts them in order, so you can see each step coming.",
    "It starts with the checks made before any money moves. It ends with the records you update after you have the keys. Each section links to a fuller guide with the steps, figures and official sources.",
    "We work in Borivali, Kandivali and Malad, and handle MHADA paperwork anywhere in Mumbai. Where a local detail matters more than the general rule, you will find it here.",
  ],
  image: "/premium/u/paperwork-04.jpg",
  imageAlt: "Hands smoothing out a floor plan",
  sections: [
    {
      heading: "Before you pay anything",
      intro:
        "These are the cheapest steps in the whole purchase, and the ones that give you the most confidence. Every one of them belongs before a token, not after.",
      spokes: [
        {
          slug: "encumbrance-certificate",
          title: "Encumbrance certificate",
          blurb:
            "What is registered against the flat, how to run the search in six steps, and what to read alongside it.",
        },
        {
          slug: "index-2-property-document",
          title: "Index 2",
          blurb:
            "The one page proof that a document was registered. Download it free in six steps.",
        },
        {
          slug: "occupancy-certificate",
          title: "Occupancy certificate",
          blurb:
            "What an OC unlocks for you: a lawful move in, the final part of your home loan and a clean resale.",
        },
        {
          slug: "conveyance-and-deemed-conveyance",
          title: "Conveyance and deemed conveyance",
          blurb:
            "How a society comes to own the land under its building, and why it matters for redevelopment.",
        },
      ],
    },
    {
      heading: "Registering the purchase",
      intro:
        "Stamp duty and registration are two charges paid together. Both are worked out on the higher of the agreed price and the government's own value for the flat.",
      spokes: [
        {
          slug: "stamp-duty-and-registration-charges-mumbai",
          title: "Stamp duty and registration charges in Mumbai",
          blurb:
            "The rates for a man, a woman and joint buyers, with the full cost from 50 lakh to 2 crore.",
        },
        {
          slug: "ready-reckoner-rate-mumbai",
          title: "Ready reckoner rates",
          blurb:
            "The 2026 to 2027 rates for Borivali, Kandivali and Malad, zone by zone, from the official e-ASR.",
        },
        {
          slug: "what-a-sale-deed-contains",
          title: "What a sale deed contains",
          blurb:
            "Clause by clause, and the ones to read yourself before you sign.",
        },
        {
          slug: "igr-maharashtra-explained",
          title: "Using the IGR Maharashtra portal",
          blurb:
            "How to search a property, check a rate and book a registration token, step by step.",
        },
      ],
    },
    {
      heading: "After the keys",
      intro:
        "Registration puts your purchase on the state record. The municipal record is a separate one, and a quick check makes sure it follows.",
      spokes: [
        {
          slug: "mutation-of-property",
          title: "Mutation of property",
          blurb:
            "Getting the property tax bill into your name, in six steps on the MCGM portal.",
        },
        {
          slug: "bmc-property-tax",
          title: "BMC property tax",
          blurb:
            "The official rate, the formula, a worked example and the 500 sq ft exemption.",
        },
      ],
    },
    {
      heading: "If you are renting",
      intro:
        "A tenancy has a much shorter paper trail, and the agreement can now be registered online.",
      spokes: [
        {
          slug: "rent-deposit-months-western-suburbs",
          title: "How many months of deposit is normal",
          blurb:
            "What the norm is in the western suburbs, and when there is room to move on it.",
        },
        {
          slug: "rent-agreement-stamp-duty-calculator-mumbai",
          title: "Rent agreement stamp duty calculator",
          blurb:
            "The stamp duty and registration fee on a leave and licence agreement in Mumbai, worked out in a minute.",
          href: "/tools/rent-agreement-stamp-duty-calculator-mumbai",
        },
        {
          slug: "rentals",
          title: "Finding a flat to rent",
          blurb:
            "Owner verified flats in Borivali, Kandivali and Malad, with the agreement registered for you.",
          href: "/services/rentals",
        },
      ],
    },
    {
      heading: "If you are buying your first flat",
      intro:
        "One number on a brochure decides how much home you get. These guides show how to read it.",
      spokes: [
        {
          slug: "carpet-area-vs-built-up-area",
          title: "Carpet, built up and super built up area",
          blurb:
            "You pay on one and live on another. The arithmetic that makes two flats comparable.",
        },
        {
          slug: "under-construction-vs-ready-to-move-flat",
          title: "Under construction or ready to move",
          blurb:
            "How to choose between a new launch and a ready flat in Borivali, Kandivali and Malad.",
        },
      ],
    },
    {
      heading: "MHADA paperwork",
      intro:
        "A MHADA flat has its own permissions from the Mumbai Board. We handle this paperwork for MHADA flats anywhere in Mumbai.",
      spokes: [
        {
          slug: "mhada-paperwork",
          title: "MHADA paperwork service",
          blurb:
            "Transfers, NOCs and permissions with the Mumbai Board, prepared and followed through for you.",
          href: "/services/mhada-paperwork",
        },
        {
          slug: "mhada-flat-transfer",
          title: "MHADA flat transfer",
          blurb:
            "The process, the transfer fees and the documents the Board asks for.",
        },
        {
          slug: "mhada-noc-online",
          title: "MHADA NOC online",
          blurb:
            "Which NOCs you can apply for online, and how long the Board has to decide.",
        },
        {
          slug: "how-to-buy-mhada-flat-in-resale",
          title: "Buying a MHADA flat in resale",
          blurb: "The checks that protect the buyer, made before the token.",
        },
        {
          slug: "can-we-rent-mhada-flat",
          title: "Renting out a MHADA flat",
          blurb: "The NOC for rent, and how letting works once you have it.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Do I need a lawyer to buy a flat in Mumbai?",
      a: "You are not required to have one. Whether you want one depends on the property rather than the price. An older building, a long title chain, or a society without conveyance are where a lawyer adds the most.",
    },
    {
      q: "What is the difference between registration and mutation?",
      a: "Registration records your purchase with the state. Mutation updates the BMC record so property tax is billed to you. They are separate records held by separate bodies. In Mumbai, since March 2019, BMC usually updates its record automatically after registration.",
    },
    {
      q: "Is stamp duty calculated on the price I agreed?",
      a: "On the agreed price or the ready reckoner value, whichever is higher. If the reckoner value for the flat sits above your price, duty is charged on the reckoner value instead.",
    },
    {
      q: "What is the stamp duty in Mumbai?",
      a: "6 percent for a male buyer and 5 percent for a woman buying in her sole name, both including the 1 percent metro cess. A man and a woman buying jointly pay 6 percent. Registration is 1 percent, capped at 30,000 rupees.",
    },
    {
      q: "Can a rent agreement be registered online?",
      a: "Yes. The Department of Registration and Stamps runs an online leave and licence service, so a tenancy can be registered without visiting an office.",
    },
  ],
  sources: [
    {
      label: "Department of Registration and Stamps, Government of Maharashtra",
      url: "https://igrmaharashtra.gov.in/",
    },
    {
      label: "Municipal Corporation of Greater Mumbai, property tax portal",
      url: "https://ptaxportal.mcgm.gov.in/CitizenPortal/",
    },
  ],
  sourcesCheckedOn: "2026-11-07",
};

export const PILLARS: Pillar[] = [propertyPaperwork];

export const PILLAR_SLUGS = PILLARS.map((p) => p.slug);

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

/** Every spoke slug in one pillar, deduplicated. Used to resolve which exist. */
export function pillarSpokeSlugs(pillar: Pillar): string[] {
  return Array.from(
    new Set(pillar.sections.flatMap((s) => s.spokes.map((x) => x.slug))),
  );
}
