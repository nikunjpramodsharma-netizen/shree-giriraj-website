/**
 * Copy for the homepage sections added in the 2026 rebuild.
 *
 * LOCALE NOTE. This content is deliberately English only and lives here rather
 * than in `messages/*.json`. Duplicating several hundred words of English into
 * hi, mr and gu just to keep the shape symmetrical would give three locales a
 * homepage that is half translated and hide the fact that it is untranslated.
 * Keeping it in one typed file makes the translation job a single visible
 * task later, either by moving these strings into `messages/` or into Sanity
 * so they can be edited without a deploy.
 *
 * The older sections (services intro, compare, areas headings, FAQ, lead form)
 * remain on next-intl and are translated in all four locales.
 *
 * PLACEHOLDER PHOTOGRAPHY throughout `/public/sections`. Stock images, not
 * Borivali, Kandivali or Malad. Replace before launch.
 */

export type Check = { n: string; title: string; body: string };

/** Section 02. The payoff for the hero's claim. Written to be replaced with the owner's own words. */
export const CHECKS: Check[] = [
  {
    n: "01",
    title: "Who actually owns it",
    body: "More rental disputes in Borivali start with a flat let out by a family member who was not authorised to let it than with anything else. We see the ownership document, not a photograph of it.",
  },
  {
    n: "02",
    title: "Whether the society will register you",
    body: "Some of the older buildings in Chikoowadi still resist non member tenants, particularly single tenants. Better to know in week one than after you have paid the deposit.",
  },
  {
    n: "03",
    title: "Water timing, not water supply",
    body: "Almost every building has water. The question is at what hour and for how long. You will hear it from us before you see the flat.",
  },
  {
    n: "04",
    title: "What the parking allotment really is",
    body: "A parking space in the brochure and a parking space the society will actually allot you are two different things, and the gap is where arguments start.",
  },
  {
    n: "05",
    title: "Redevelopment that has been starting next year for six years",
    body: "Every suburb has buildings where redevelopment is permanently imminent. It changes what the flat is worth and whether you should buy it at all.",
  },
  {
    n: "06",
    title: "What the deposit actually means here",
    body: "Ten months is common in this belt. If somebody asks for less, there is usually a reason, and it is worth knowing what it is.",
  },
];

/**
 * Route readiness gates. The homepage links into /areas/[slug] and
 * /blog/[slug] as part of its internal linking job, but those pages do not
 * exist yet and shipping links to 404s is worse than shipping no link.
 * Flip each to true in the same commit that creates the pages.
 */
// The /areas/[slug] pages exist as of 1 September 2026. Several are still
// drafts and carry noindex on the page itself, but they are real pages and
// linking to them beats the switcher going nowhere.
export const AREA_PAGES_READY = true;
export const JOURNAL_POSTS_READY = false;

export type AreaPanel = {
  slug: string;
  name: string;
  image: string;
  body: string;
  stats: { value: string; label: string }[];
  watch: string;
};

/**
 * Section 03. Stats are real DataForSEO figures pulled 25 August 2026, not
 * illustrative. See plan/03-content-plan.md for the full dataset.
 */
export const AREA_PANELS: AreaPanel[] = [
  {
    slug: "borivali-west",
    name: "Borivali",
    image: "/sections/area-borivali.jpg",
    body: "Our home turf. Resale, rentals and society redevelopment across Borivali West and East, from Chikoowadi to the station belt. The pocket you choose matters more here than the building does.",
    stats: [
      { value: "140/mo", label: "Searches, Borivali West" },
      { value: "High", label: "Competition" },
      { value: "Since 1996", label: "We have been here" },
    ],
    watch:
      "The station belt and the Link Road side are two different markets at the same price. People conflate them and overpay on the wrong one.",
  },
  {
    slug: "kandivali",
    name: "Kandivali",
    image: "/sections/area-kandivali.jpg",
    body: "Premium new launches and family homes off M.G. Road and Link Road, including Jaswanti Jewel. The strongest new build activity of the three, and the most room to get the floor wrong.",
    stats: [
      { value: "390/mo", label: "Searches, Kandivali West" },
      { value: "Medium", label: "Competition" },
      { value: "720/mo", label: "Jaswanti Jewel alone" },
    ],
    watch:
      "In a G+37 tower the floor band changes the price more than the carpet area does. Ask what the view actually is at your floor, not at the sample flat.",
  },
  {
    slug: "malad",
    name: "Malad",
    image: "/sections/area-malad.jpg",
    body: "Growing residential and commercial options near Mindspace and the Link Road corridor. More investor money here than in the other two, which moves the price differently.",
    stats: [
      { value: "110/mo", label: "Searches, Malad West" },
      { value: "High", label: "Competition" },
      { value: "Rs 345", label: "Cost per ad click" },
    ],
    watch:
      "The Mindspace pull makes rental yields look better on paper than they hold up over three years. Check who the actual tenant will be.",
  },
];

export type ServicePanel = {
  n: string;
  slug: string;
  title: string;
  image: string;
  lead: string;
  body: string;
};

/**
 * Section 05. Order is commercial, not search driven: resale leads because it
 * is the main business. Rentals and interiors carry more search volume and
 * lead on the service pages and in ads instead.
 */
export const SERVICE_PANELS: ServicePanel[] = [
  {
    n: "01",
    slug: "resale-flats",
    title: "Resale flats",
    image: "/sections/svc-resale.jpg",
    lead: "Our main business, and where walking these buildings since 1996 actually pays.",
    body: "Buying or selling ready to move homes across Borivali, Kandivali and Malad. Title chain, society NOC and outstanding dues sorted before a price is agreed, which is the difference between a sale and a sale that collapses three weeks in.",
  },
  {
    n: "02",
    slug: "rentals",
    title: "Rentals",
    image: "/sections/svc-rentals.jpg",
    lead: "The busiest thing we do, and how most people meet us first.",
    body: "Tenants and owners matched across all three suburbs, with the leave and licence agreement drawn and registered properly. We check who actually owns the flat and whether the society will register you, before you see it.",
  },
  {
    n: "03",
    slug: "new-project-bookings",
    title: "New project bookings",
    image: "/sections/svc-new-projects.jpg",
    lead: "The price is the same. What changes is what you know.",
    body: "Early access through developers we deal with directly. We will tell you which floor band is overpriced for what it is, and what the view actually becomes once the next tower goes up.",
  },
  {
    n: "04",
    slug: "interiors",
    title: "Interiors and civil work",
    image: "/sections/svc-interiors.jpg",
    lead: "What happens after the keys, and the least understood work on this list.",
    body: "Fit outs and civil work once the flat is yours. You get a real cost band before you commit, not after, and we tell you what the society will not permit before a designer draws it.",
  },
  {
    n: "05",
    slug: "redevelopment",
    title: "Redevelopment advisory",
    image: "/sections/svc-redevelopment.jpg",
    lead: "For societies and owners, not for developers.",
    body: "Feasibility, developer shortlisting, the corpus fund, the rent during construction, and the clauses your committee will otherwise argue about for six months. We are paid by the society, which is why the advice can be blunt.",
  },
  {
    n: "06",
    slug: "shops-plots",
    title: "Shops and plots",
    image: "/sections/svc-shops.jpg",
    lead: "Quietest service, most repeat business.",
    body: "Commercial shops, offices and plots for investors and business owners across the western suburbs. Mostly people we have already sold a home to.",
  },
];

export type Situation = {
  key: string;
  label: string;
  heading: string;
  body: string;
  warning: string;
};

/** Section 04. The answer to a portal search box when you have no inventory to search. */
export const SITUATIONS: Situation[] = [
  {
    key: "buy",
    label: "Buy",
    heading: "Buying in {area}",
    body: "The two things that decide whether this goes smoothly are the title chain and the society, and neither is visible in a listing.",
    warning:
      "The society NOC. People sort it after agreeing a price instead of before, and that is when deals collapse at the last minute.",
  },
  {
    key: "rent",
    label: "Rent",
    heading: "Renting in {area}",
    body: "Deposits in this belt run to around ten months, and the society decides whether you are acceptable before the owner does.",
    warning:
      "The owner is not the person authorised to let the flat. Ask for the ownership document, not a photograph of it.",
  },
  {
    key: "sell",
    label: "Sell",
    heading: "Selling in {area}",
    body: "What you get depends less on the asking price than on how ready the paperwork is when a serious buyer appears.",
    warning:
      "The society NOC and the outstanding dues surface three weeks in, and the buyer walks. Sort them before listing.",
  },
  {
    key: "redevelop",
    label: "Redevelop our society",
    heading: "Redevelopment in {area}",
    body: "The corpus fund and the rent during construction are where committees spend six months arguing. Both are negotiable and most societies negotiate them badly.",
    warning:
      "The developer is chosen on the highest offer rather than on delivery record. The highest offer is not the offer that gets built.",
  },
  {
    key: "interiors",
    label: "Do interiors",
    heading: "Interiors in {area}",
    body: "A 2 BHK fit out has a real cost band, and anyone refusing to give you one before a site visit is managing you, not quoting you.",
    warning:
      "The society rules. Find out what you are allowed to move before you pay a designer to draw it.",
  },
];

export const SITUATION_AREAS = [
  "Borivali",
  "Kandivali",
  "Malad",
  "Not sure yet",
] as const;

export type JournalTeaser = {
  kicker: string;
  title: string;
  blurb: string;
  image: string;
  slug: string;
};

/** Section 11. Placeholders until the real posts exist. Slugs match plan/03-content-plan.md. */
export const JOURNAL_TEASERS: JournalTeaser[] = [
  {
    kicker: "Paperwork",
    title: "Stamp duty and registration in Mumbai, 2026",
    blurb: "What you pay, on what basis, and the number most buyers get wrong.",
    image: "/sections/journal-1.jpg",
    slug: "stamp-duty-in-mumbai",
  },
  {
    kicker: "Buying",
    title: "What to check before you buy a resale flat in Borivali",
    blurb: "The order we do it in, and the two checks people skip.",
    image: "/sections/journal-2.jpg",
    slug: "what-to-check-resale-flat-borivali",
  },
  {
    kicker: "Redevelopment",
    title: "Corpus fund: how it is calculated and what is fair",
    blurb: "The number your committee will argue about for six months.",
    image: "/sections/journal-3.jpg",
    slug: "corpus-fund-in-redevelopment",
  },
];

/**
 * Section 08. PLACEHOLDER NAMES. Nothing renders until real names replace
 * these, because an invented team is worse than no team section.
 */
export type TeamMember = { name: string; role: string };
export const TEAM: TeamMember[] = [
  { name: "[ NAME ]", role: "Founder. In Borivali property since 1996." },
  { name: "[ NAME ]", role: "Rentals and tenant relations." },
  { name: "[ NAME ]", role: "Redevelopment and society liaison." },
];

/** True once real names are in. Gates the team list so placeholders never ship. */
export const TEAM_IS_REAL = TEAM.every((m) => !m.name.includes("["));
