import { AREA_PANELS, type AreaPanel } from "@/lib/homepage-content";

/**
 * Area pages: /areas/[slug].
 *
 * These are the core of the local SEO plan. A national portal can out rank us
 * on "flats in Borivali" forever, but it cannot say which side of the station
 * floods, so that is what these pages are for.
 *
 * WHAT IS REAL AND WHAT IS NOT
 *
 * The stats and the `watch` lines come from AREA_PANELS, which are measured
 * DataForSEO figures and judgement already written and approved. Everything
 * marked NEEDS_INPUT below is a placeholder: the page renders it visibly
 * flagged, and any page still carrying one is served noindex.
 *
 * That combination is deliberate. It lets the page be reviewed for layout on a
 * preview deployment without a single invented claim about a suburb reaching a
 * search engine.
 */

export const NEEDS_INPUT = "NEEDS YOUR INPUT" as const;

/** A block only the user can write. `prompts` are the questions to answer. */
export type InputBlock = {
  kind: typeof NEEDS_INPUT;
  heading: string;
  prompts: string[];
};

export type AreaSection = { heading: string; body: string } | InputBlock;

export function isInputBlock(s: AreaSection): s is InputBlock {
  return (s as InputBlock).kind === NEEDS_INPUT;
}

export type AreaPage = {
  slug: string;
  name: string;
  /** Full name for headings and title tags, where the panel name is short. */
  longName: string;
  metaTitle: string;
  metaDescription: string;
  answer: string;
  intro: string[];
  sections: AreaSection[];
  faqs: { q: string; a: string }[];
};

const PAGES: Record<string, Omit<AreaPage, "slug" | "name">> = {
  "borivali-west": {
    longName: "Borivali",
    metaTitle: "Buying, selling and renting in Borivali: a local guide",
    metaDescription:
      "What the pockets of Borivali West and East are actually like, who buys where, and what to check before you commit. Written by an agent based here since 1996.",
    answer:
      "Borivali splits into two markets that trade at similar prices for different reasons: the station belt, which is older, denser and better connected, and the Link Road side, which is newer and quieter. Choosing the wrong one for how you actually live is the most common and most expensive mistake here.",
    intro: [
      "We have worked out of Chikoowadi since 1996, which means most of what is useful about Borivali is not on any listing site. It is knowing which buildings have water pressure problems on the upper floors, which societies actually approve interior work, and which lanes are a different proposition after dark.",
      "This page is the general shape of the place. For a specific building, ask us.",
    ],
    sections: [
      {
        kind: NEEDS_INPUT,
        heading: "The pockets, and how they differ",
        prompts: [
          "Name the pockets you actually think in: Chikoowadi, IC Colony, Gorai, Eksar, LT Road, the station belt, Shimpoli, and anything else.",
          "For each one, who lives there and what does it cost relative to the others?",
          "Which pocket is most misunderstood by buyers coming from outside?",
        ],
      },
      {
        kind: NEEDS_INPUT,
        heading: "Borivali East versus Borivali West",
        prompts: [
          "What genuinely changes when you cross the tracks: price, buyer profile, building age, commute?",
          "Is one of them better value right now, and why?",
        ],
      },
      {
        kind: NEEDS_INPUT,
        heading: "What we would check before buying here",
        prompts: [
          "The three things you personally check first in a Borivali building.",
          "Anything specific to older societies here, for example conveyance or water.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Borivali West or East better to live in?",
        a: "They suit different people rather than one being better. West is denser, closer to the station and the older market. East is generally quieter with newer stock. What matters more is the pocket within each.",
      },
      {
        q: "What is a realistic budget for a 2 BHK in Borivali?",
        a: "Prices move enough that a published figure goes stale quickly, and the range within Borivali is wide depending on the pocket and the building's age. Ask us for the current range in the specific pocket you are considering.",
      },
    ],
  },

  kandivali: {
    longName: "Kandivali",
    metaTitle: "Buying and renting in Kandivali: what to know first",
    metaDescription:
      "New launches, family homes and the towers off M.G. Road and Link Road. What changes with the floor band, and what to ask before booking.",
    answer:
      "Kandivali has the strongest new build activity of the three suburbs we cover, which makes it the easiest place to buy well and the easiest place to overpay. In a tall tower the floor band moves the price more than the carpet area does, so the number worth negotiating is not always the one on the brochure.",
    intro: [
      "Kandivali is where most of the new launch activity in our patch sits, including Jaswanti Jewel off Link Road. New build buying is a different exercise from resale: you are buying a drawing and a promise, and the checks are different ones.",
    ],
    sections: [
      {
        kind: NEEDS_INPUT,
        heading: "Kandivali West and East",
        prompts: [
          "How do the two sides differ in price, stock and who buys?",
          "Which micro markets do you actually work in: Charkop, Mahavir Nagar, Thakur Complex, Poisar, Lokhandwala Kandivali?",
        ],
      },
      {
        kind: NEEDS_INPUT,
        heading: "Buying a new launch here",
        prompts: [
          "What do you tell a first time new build buyer to check that they never think of?",
          "How do you judge whether a launch price is fair?",
          "What has gone wrong for buyers here that you have seen first hand?",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Kandivali good for a first home?",
        a: "It has the widest spread of new stock in this belt, which gives a first time buyer more to compare. The trade off is that new build buying carries risks resale does not, mostly around delivery and what is actually committed in writing.",
      },
      {
        q: "Does the floor make much difference to price?",
        a: "In a tall tower, yes, often more than a small difference in carpet area does. Ask what the view and light are at your specific floor rather than at the sample flat.",
      },
    ],
  },

  malad: {
    longName: "Malad",
    metaTitle: "Malad property: what buyers and landlords should know",
    metaDescription:
      "Residential and commercial options near Mindspace and the Link Road corridor, and why rental yields here need a closer look than the headline suggests.",
    answer:
      "Malad has more investor money in it than Borivali or Kandivali, which changes how prices move and who you are bidding against. The Mindspace office corridor supports rental demand, but it makes yields look better on paper than they tend to hold up across a full three year tenancy.",
    intro: [
      "Malad is the most investor driven of the three suburbs we work in. That is not a warning, it is just a different market: you are more often buying alongside people who will never live in the flat, and that shows up in how quickly good stock moves.",
    ],
    sections: [
      {
        kind: NEEDS_INPUT,
        heading: "Malad West and East",
        prompts: [
          "How do the two sides differ, and which do you actually transact in more?",
          "Which pockets matter: Mindspace, Malad Link Road, Kurar, Malvani, Evershine?",
        ],
      },
      {
        kind: NEEDS_INPUT,
        heading: "Buying to let here",
        prompts: [
          "Who is the realistic tenant, and what do they actually pay?",
          "What do landlords here get wrong about yield?",
          "Is commercial worth considering, given Mindspace?",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Malad a good rental investment?",
        a: "The office corridor supports demand, so vacancy is usually not the problem. The thing to check is who the realistic tenant is and what they will actually pay over three years, rather than the yield implied by the first year's rent.",
      },
      {
        q: "Is Malad more expensive than Borivali?",
        a: "They overlap enough that a blanket answer would mislead. It depends far more on the pocket and the age of the building than on the suburb name.",
      },
    ],
  },
};

export const AREAS: AreaPage[] = AREA_PANELS.map((p: AreaPanel) => ({
  slug: p.slug,
  name: p.name,
  ...PAGES[p.slug],
}));

export const AREA_SLUGS = AREAS.map((a) => a.slug);

export function getArea(slug: string): AreaPage | undefined {
  return AREAS.find((a) => a.slug === slug);
}

export function getAreaPanel(slug: string): AreaPanel | undefined {
  return AREA_PANELS.find((p) => p.slug === slug);
}

/**
 * A page with no outstanding input block is finished and may be indexed.
 * Anything still carrying one is served noindex, so a half written page can be
 * reviewed on a preview without competing for the query it is aimed at.
 */
export function areaIsComplete(a: AreaPage): boolean {
  return !a.sections.some(isInputBlock);
}
