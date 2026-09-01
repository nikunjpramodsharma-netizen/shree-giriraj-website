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
 * resolves the slugs against Sanity at request time and renders a published
 * spoke as a link and an unpublished one as plain text. Same pattern as
 * AREA_PAGES_READY on the homepage: show the shape of the thing, never link
 * into a hole.
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
  metaTitle: "Property paperwork in Maharashtra: the complete guide",
  metaDescription:
    "Every document in a Maharashtra property transaction, in the order you will meet it. The checks before you pay, stamp duty and registration, and what to do after.",
  answer:
    "Property transactions in Maharashtra run through the Department of Registration and Stamps. Before you pay, you check what is already registered against the property. At registration you pay stamp duty on the higher of the agreed price or the ready reckoner rate. Afterwards you update the municipal record into your own name.",
  intro: [
    "Most people meet these documents one at a time, in the week each one becomes urgent, which is the worst possible way to learn them. By the time you find out what an encumbrance certificate is, you have usually already paid a token.",
    "This page puts them in the order you will actually meet them, from the checks that happen before any money moves to the ones that come months after you have the keys. Each section links to a fuller explanation.",
    "We work in Borivali, Kandivali and Malad, so where a local specific matters more than the general rule, that is what you will find.",
  ],
  image: "/blog/paperwork.jpg",
  imageAlt: "Hands stamping an official property document",
  sections: [
    {
      heading: "Before you pay anything",
      intro:
        "These are the cheapest steps in the whole transaction and the ones most often skipped. Every one of them belongs before a token, not after.",
      spokes: [
        {
          slug: "encumbrance-certificate",
          title: "Encumbrance certificate",
          blurb:
            "What is registered against the property, and why a clear certificate is necessary but not sufficient.",
        },
        {
          slug: "index-2-property-document",
          title: "Index 2",
          blurb:
            "The one page summary that proves a transaction was registered. Every lender and society asks for it.",
        },
        {
          slug: "occupancy-certificate",
          title: "Occupancy certificate",
          blurb:
            "Why taking possession before the OC is issued moves the builder's risk onto you.",
        },
        {
          slug: "conveyance-and-deemed-conveyance",
          title: "Conveyance and deemed conveyance",
          blurb:
            "Owning a flat does not mean your society owns the land under it. The first question in any redevelopment.",
        },
      ],
    },
    {
      heading: "Registering the transaction",
      intro:
        "Stamp duty and registration are two different charges that arrive together. The number they are calculated on is not always the price you negotiated.",
      spokes: [
        {
          slug: "stamp-duty-and-registration-charges-mumbai",
          title: "Stamp duty and registration charges in Mumbai",
          blurb:
            "What each charge is, what it is calculated on, and when it falls due.",
        },
        {
          slug: "ready-reckoner-rate-mumbai",
          title: "Ready reckoner rates",
          blurb:
            "The government's own valuation. If it sits above your agreed price, your stamp duty is calculated on it.",
        },
        {
          slug: "what-a-sale-deed-contains",
          title: "What a sale deed contains",
          blurb:
            "Clause by clause, and the two you should read yourself before signing anything.",
        },
        {
          slug: "igr-maharashtra-explained",
          title: "Using the IGR Maharashtra portal",
          blurb:
            "Valuation, document search, appointment booking and certified copies, and which service does what.",
        },
      ],
    },
    {
      heading: "After the keys",
      intro:
        "Registration puts your transaction on the state record. It does not put your name on the municipal one, and people routinely stop at the first.",
      spokes: [
        {
          slug: "mutation-of-property",
          title: "Mutation of property",
          blurb:
            "Why your tax bill still goes to the previous owner, and what it takes to fix five years later.",
        },
        {
          slug: "bmc-property-tax",
          title: "BMC property tax",
          blurb:
            "How it is worked out, and why arrears matter to a buyer as much as to an owner.",
        },
      ],
    },
    {
      heading: "If you are renting",
      intro:
        "A tenancy has its own much shorter paper trail, and one part of it can now be done without going anywhere.",
      spokes: [
        {
          slug: "rent-agreement-mumbai",
          title: "Rent agreements in Mumbai",
          blurb:
            "What has to be in writing, and what a verbal understanding will not survive.",
        },
        {
          slug: "leave-and-license-agreement-format",
          title: "Leave and licence agreements",
          blurb:
            "The standard instrument for a Mumbai tenancy, and why it is not a lease.",
        },
        {
          slug: "the-ten-month-deposit-in-borivali",
          title: "The ten month deposit",
          blurb:
            "What the norm actually is in the western suburbs, and when there is room to move on it.",
        },
      ],
    },
    {
      heading: "If you are buying your first flat",
      intro:
        "One number on a brochure causes more confusion than every legal document put together.",
      spokes: [
        {
          slug: "carpet-area-vs-built-up-area",
          title: "Carpet, built up and super built up area",
          blurb:
            "You pay on one and live on another. The arithmetic that makes two flats comparable.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Do I need a lawyer to buy a flat in Mumbai?",
      a: "You are not required to have one. Whether you want one depends on the property rather than the price. An older building, an unclear title chain, or a society without conveyance are the situations where it pays for itself.",
    },
    {
      q: "What is the difference between registration and mutation?",
      a: "Registration records your transaction with the state. Mutation updates the municipal record so property tax is billed to you. They are separate records held by separate bodies, and doing one does not do the other.",
    },
    {
      q: "Is stamp duty calculated on the price I agreed?",
      a: "On the agreed price or the ready reckoner value, whichever is higher. If the reckoner rate for that building sits above your price, duty is charged on the reckoner rate instead.",
    },
    {
      q: "Can a rent agreement be registered online?",
      a: "Yes. The Department of Registration and Stamps runs an online leave and licence service, so a tenancy can be registered without attending an office.",
    },
  ],
  sources: [
    {
      label: "Department of Registration and Stamps, Government of Maharashtra",
      url: "https://igrmaharashtra.gov.in/",
    },
  ],
  sourcesCheckedOn: "2026-09-01",
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
