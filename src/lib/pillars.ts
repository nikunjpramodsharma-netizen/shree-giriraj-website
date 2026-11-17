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
  /** Last edit to the hub itself, ISO date. Shown under the title and used as dateModified. */
  updatedOn: string;
};

const propertyPaperwork: Pillar = {
  slug: "property-paperwork-maharashtra",
  title: "Property paperwork in Maharashtra",
  metaTitle: "Property documents in Maharashtra, in order",
  metaDescription:
    "Every property document in a Maharashtra flat deal, in order: checks before the token, stamp duty and registration, the society transfer, renting.",
  answer:
    "A flat sale in Maharashtra is registered with the Department of Registration and Stamps. Before paying, check what is registered against the flat. At registration, stamp duty is paid on the higher of the price and the ready reckoner value. Afterwards the society transfers the share certificate, and the BMC tax record follows.",
  intro: [
    "Most people meet these documents one at a time, in the week each one is needed. This page puts them in order, so you can see each step coming.",
    "It starts with the checks made before any money moves. It ends with the records you update after you have the keys. Each section links to a fuller guide with the steps, figures and official sources.",
    "Selling a flat runs through the same papers from the other side, so there is a section for sellers too. Renting has its own short trail: a registered leave and licence and a police intimation.",
    "We are a real estate agency in Borivali West, in real estate since 1996 and at our Borivali office since 2005. We work in Borivali, Kandivali and Malad, and handle MHADA paperwork anywhere in Mumbai. Where a local detail matters more than the general rule, you will find it here.",
  ],
  image: "/premium/u/paperwork-04.jpg",
  imageAlt: "Hands smoothing out a floor plan",
  sections: [
    {
      heading: "Finding the flat",
      intro:
        "The paperwork starts with a real flat. These pages show what is on the market in the three suburbs we cover, with the asking rates by size.",
      spokes: [
        {
          slug: "flats-for-sale-borivali-west",
          title: "Flats for sale in Borivali West",
          blurb: "1, 2 and 3 BHK resale flats, with the asking rate in each pocket.",
          href: "/areas/borivali-west/flats-for-sale",
        },
        {
          slug: "flats-for-sale-kandivali",
          title: "Flats for sale in Kandivali West",
          blurb: "Charkop, Mahavir Nagar and the Link Road towers, with the asking rates.",
          href: "/areas/kandivali/flats-for-sale",
        },
        {
          slug: "flats-for-sale-malad",
          title: "Flats for sale in Malad West",
          blurb: "From Mindspace to Marve, with the asking rate by size.",
          href: "/areas/malad/flats-for-sale",
        },
        {
          slug: "buy-first-flat-in-mumbai",
          title: "Buying your first flat in Mumbai",
          blurb: "The budget, the checks and the steps, in the order they come.",
        },
      ],
    },
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
        {
          slug: "gift-deed-stamp-duty-maharashtra",
          title: "Gift deed stamp duty",
          blurb:
            "The concession for a gift within the family, and the registration steps.",
        },
      ],
    },
    {
      heading: "The society transfer",
      intro:
        "A flat in a cooperative housing society changes hands twice: once at the sub registrar, and once in the society's books. This is the second step, and it is quick when the papers are ready.",
      spokes: [
        {
          slug: "society-share-certificate-transfer-fee",
          title: "What a share certificate is",
          blurb:
            "Your proof of membership of the society, what is printed on it, and how it moves to the buyer.",
        },
        {
          slug: "society-noc-for-sale-of-flat-mumbai",
          title: "Society NOC for sale of a flat",
          blurb:
            "Not legally needed, but 15 days' notice is. The charges, the 25,000 rupee premium cap and a letter format.",
        },
      ],
    },
    {
      heading: "If you are selling",
      intro:
        "A seller who has the papers in one folder can sign the week a buyer says yes. These are the ones buyers and their banks ask for first.",
      spokes: [
        {
          slug: "resale-flats",
          title: "Selling with us",
          blurb:
            "We advise on the asking price for your pocket, bring serious buyers and line up the society NOC and the registration.",
          href: "/services/resale-flats",
        },
        {
          slug: "area-borivali-west",
          title: "Asking rates in Borivali West",
          blurb: "Pockets and asking rates, to see where your flat sits before you set a price.",
          href: "/areas/borivali-west",
        },
        {
          slug: "area-kandivali",
          title: "Asking rates in Kandivali",
          blurb: "Charkop, Mahavir Nagar and the Link Road towers, with what each costs to buy.",
          href: "/areas/kandivali",
        },
        {
          slug: "area-malad",
          title: "Asking rates in Malad",
          blurb: "Mindspace on one side, Marve on the other, and the rates in between.",
          href: "/areas/malad",
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
        {
          slug: "redevelopment-borivali-kandivali",
          title: "Redevelopment, corpus fund and rent",
          blurb:
            "The 51 percent vote, the corpus fund and the rent to agree when your building is rebuilt.",
        },
      ],
    },
    {
      heading: "If you are renting",
      intro:
        "A tenancy has a much shorter paper trail: a registered leave and licence, online, and the police intimation for the tenant.",
      spokes: [
        {
          slug: "leave-and-licence-agreement-mumbai",
          title: "Leave and licence agreement",
          blurb:
            "The 0.25 percent stamp duty with worked costs, and the online registration in ten steps.",
        },
        {
          slug: "tenant-police-verification-mumbai",
          title: "Tenant police verification",
          blurb:
            "The Mumbai Police online form, the documents and who files it.",
        },
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
      a: "Yes. The Department of Registration and Stamps runs the Leave and License 2.0 portal, so a tenancy can be registered without visiting an office. Stamp duty is 0.25 percent under Article 36A of the Maharashtra Stamp Act.",
    },
    {
      q: "What are the legal documents of a flat in Maharashtra?",
      a: "The registered agreement for sale and its Index 2 prove the purchase. The society's share certificate proves membership. The occupancy certificate shows the building may be lived in, and the BMC tax bill shows who pays the property tax.",
    },
    {
      q: "How can I check property ownership online in Maharashtra?",
      a: "Search the registered documents on the IGR Maharashtra portal and download the Index 2 for the latest sale. The name on it should match the seller, and the society's share certificate should carry the same name.",
    },
    {
      q: "Is a society NOC required to sell a flat in Mumbai?",
      a: "No. The Maharashtra model bye laws say a society's NOC is not required to transfer a flat. The seller gives 15 days' notice and pays a transfer fee, with any premium capped at 25,000 rupees in Mumbai.",
    },
    {
      q: "Is tenant police verification compulsory in Mumbai?",
      a: "Yes, while a Mumbai Police order is in force; the current one runs from 1 October to 29 November 2026. The landlord files the Tenant Information form online, and no police NOC is needed.",
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
    {
      label: "Maharashtra Stamp Act, Schedule I, Articles 25 and 36A, department master copy dated 31 July 2026",
      url: "https://igrmaharashtra.gov.in/pdf/documents/MASTER%20COPY%20OF%20SCHEDULE%20I%20%20II%20%20OF%20%20MSA%20%20PDF%20dt.31.07.2026.pdf",
    },
    {
      label: "Commissioner for Cooperation, Maharashtra, model bye laws of cooperative housing societies 2014",
      url: "https://sahakarayukta.maharashtra.gov.in/SITE/PDF/Rules_Acts_Bylaws/Model_Bye_Laws_of_Coop_Housing_Society_New_Flatowner_Type_(2-9-14)%20(1).pdf",
    },
    {
      label: "Mumbai Police, Tenant Information online form",
      url: "https://www.mumbaipolice.gov.in/TenantForm?ps_id=0",
    },
    {
      label: "Section 353A, Mumbai Municipal Corporation Act, 1888, permission to occupy",
      url: "https://indiankanoon.org/doc/67485659/",
    },
  ],
  sourcesCheckedOn: "2026-11-16",
  updatedOn: "2026-11-16",
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
