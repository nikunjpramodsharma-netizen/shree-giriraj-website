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
    body: "We meet the owner and see the ownership document before you see the flat, so the person you sign with is the person entitled to let it.",
  },
  {
    n: "02",
    title: "Whether the society will register you",
    body: "Some older societies in Chikoowadi have their own views on tenants, single people included. We ask the society before the first visit, so the buildings you see are ones that will welcome you.",
  },
  {
    n: "03",
    title: "Water timing, not water supply",
    body: "Every building has water. We tell you at what hour and for how long before you visit, because it is the thing you will notice every morning.",
  },
  {
    n: "04",
    title: "What the parking allotment really is",
    body: "We confirm the parking the society will actually allot you, in writing, so the space in the brochure is the space you park in.",
  },
  {
    n: "05",
    title: "Where redevelopment really stands",
    body: "Every suburb has buildings where redevelopment has been next year for a while. We tell you what stage a building is genuinely at, because it changes what the flat is worth and what you should pay.",
  },
  {
    n: "06",
    title: "What the deposit actually means here",
    body: "Two to three months' rent is the norm in newer societies here, more in some older buildings. We tell you the going rate for the building before you negotiate, so you pay what the street pays and not a rupee more.",
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

export type AreaPanel = {
  slug: string;
  name: string;
  image: string;
  body: string;
  stats: { value: string; label: string }[];
  watch: string;
};

/**
 * Section 03. The tiles used to show DataForSEO search volumes and ad costs,
 * which are planning data for us and meaningless to a visitor ("140/mo,
 * searches, Borivali West" answered a question nobody on the page had). They
 * now show what a buyer actually wants at a glance: the resale asking rate
 * per square foot of carpet (Mumbai Property Exchange, median of listings
 * over the 18 months to July 2026) and the new launch asking band
 * (Mumbai Property Exchange and PropertyPistol, September 2026). Asking, not
 * registered, and the labels say so. Every panel shows both sides of its
 * suburb; "Since 1996" was dropped from the Borivali row because the site
 * header already says it and it left East uncovered. Refresh when the blog's carpet area
 * table is refreshed; the two must agree.
 */
export const AREA_PANELS: AreaPanel[] = [
  {
    slug: "borivali-west",
    name: "Borivali",
    image: "/sections/area-borivali.jpg",
    body: "Our home turf. Resale, rentals and investment advice across Borivali West and East, from Chikoowadi to the station belt. The pocket you choose matters more here than the building does.",
    stats: [
      { value: "₹31,200", label: "Resale asking, per sq ft carpet, West" },
      { value: "₹31,400", label: "Resale asking, per sq ft carpet, East" },
      { value: "₹25k to 35k", label: "New launch asking, per sq ft, both sides" },
    ],
    watch:
      "The station belt and the Link Road side are two different markets at the same price. We help you pick the one that fits how you actually live.",
  },
  {
    slug: "kandivali",
    name: "Kandivali",
    image: "/sections/area-kandivali.jpg",
    body: "Premium new launches and family homes off M.G. Road and Link Road, including Jaswanti Jewel. The strongest new build activity of the three, which means the widest choice for a first buyer.",
    stats: [
      { value: "₹25,400", label: "Resale asking, per sq ft carpet, West" },
      { value: "₹26,400", label: "Resale asking, per sq ft carpet, East" },
      { value: "₹24k to 45k", label: "New launch asking, per sq ft, East" },
    ],
    watch:
      "In a tall tower the floor band changes the price more than the carpet area does. We show you the view at your floor, not at the sample flat.",
  },
  {
    slug: "malad",
    name: "Malad",
    image: "/sections/area-malad.jpg",
    body: "Growing residential and commercial options near Mindspace and the Link Road corridor. More investor money here than in the other two, which moves the price differently.",
    stats: [
      { value: "₹27,000", label: "Resale asking, per sq ft carpet, West" },
      { value: "₹24,000", label: "Resale asking, per sq ft carpet, East" },
      { value: "₹24k to 33k", label: "New launch asking, per sq ft, West" },
    ],
    watch:
      "The Mindspace corridor keeps rental demand steady. We tell you who the realistic tenant is and what they pay, so the yield you plan on is the one you get.",
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
 *
 * IMAGES. Each panel now carries a different photograph from the service page
 * it opens, so the click shows the reader something new rather than the same
 * picture again. See HERO_IMAGE in the service route for how the pairs were
 * chosen.
 *
 * The panel shape does the choosing as much as the subject does. The track
 * renders one open panel of roughly square proportion and six vertical strips
 * about a fifth as wide, so an image has to survive being cut to a narrow
 * centre slice. That is why the panels are the simpler, more vertical half of
 * each pair, and the page heroes carry the wider scenes.
 *
 * All seven are 1100 by 1375, four to five, which gives the open panel width to
 * show and the strips height to keep. Pexels, 8 September 2026.
 *
 * Resale took four attempts. A close crop of a facade read as a wall, blocks
 * at dusk read as tired, a facade hung with laundry was honest and unsellable,
 * and a courtyard was handsome but empty. The brief that settled it came from
 * the owner: a big building, fifteen to twenty floors, a proper garden, and
 * life in it. The panel is now a tall Indian tower at golden hour and the page
 * carries the garden.
 */
export const SERVICE_PANELS: ServicePanel[] = [
  {
    n: "01",
    slug: "resale-flats",
    title: "Resale flats",
    image: "/sections/svc-resale.jpg",
    lead: "Our main business since 1996.",
    body: "Buying or selling ready to move homes across Borivali, Kandivali and Malad. Title chain, society NOC and dues checked before a price is agreed, so the deal completes on the date you planned.",
  },
  {
    n: "02",
    slug: "rentals",
    title: "Rentals",
    image: "/sections/svc-rentals.jpg",
    lead: "The busiest thing we do, and how most people meet us first.",
    body: "Tenants and owners matched across all three suburbs, with a registered leave and licence agreement handled for you. We confirm the owner and the society's welcome before your first visit.",
  },
  {
    n: "03",
    slug: "new-project-bookings",
    title: "New project bookings",
    image: "/sections/svc-new-projects.jpg",
    lead: "Early access, and the floor that is worth it.",
    body: "Launch access through developers we deal with directly, with the current price sheet and a straight answer on which floor and view are worth the money.",
  },
  {
    n: "04",
    slug: "interiors",
    title: "Interiors and civil work",
    image: "/sections/svc-interiors.jpg",
    lead: "After the keys, the home you actually wanted.",
    body: "Fit outs and civil work once the flat is yours, with an itemised estimate before you commit and the society's permission handled, so the design that is drawn is the one that gets built.",
  },
  {
    n: "05",
    slug: "investment-advisory",
    title: "Investment advisory",
    image: "/sections/svc-investment.jpg",
    lead: "For buying to hold, not to live in.",
    body: "Which pocket, which building, and what the flat actually earns at the price being asked. We do the arithmetic on the real property, so you buy on numbers rather than on a suburb's reputation.",
  },
  {
    n: "06",
    slug: "commercial-plots",
    title: "Commercial and plots",
    image: "/sections/svc-commercial.jpg",
    lead: "Shops, offices and the rare genuine plot.",
    body: "Commercial space across Borivali, Kandivali and Malad, for businesses that need premises here and investors buying a unit to let. Approved use, society rules and frontage checked before you commit.",
  },
  {
    n: "07",
    slug: "mhada-paperwork",
    title: "MHADA paperwork",
    image: "/sections/svc-mhada.jpg",
    lead: "Transfer, NOC, heirs, regularisation.",
    body: "The permissions a MHADA flat needs before it can be sold, let, mortgaged or passed to an heir, taken from the Board's own rules, filed as one complete application and followed through with the Estate Manager until it is done.",
  },
];

export type Situation = {
  key: string;
  label: string;
  heading: string;
  body: string;
  /** What we handle for the reader in this situation. Used to be a warning. */
  help: string;
};

/** Section 04. The answer to a portal search box when you have no inventory to search. */
export const SITUATIONS: Situation[] = [
  {
    key: "buy",
    label: "Buy",
    heading: "Buying in {area}",
    body: "A resale flat comes with an established society and immediate possession. We check the title chain and the society position before a price is agreed, so the deal you shake on is the deal that completes.",
    help:
      "We line up the society's no objection before you agree a price, which is what keeps a good deal on track.",
  },
  {
    key: "rent",
    label: "Rent",
    heading: "Renting in {area}",
    body: "Two to three months' deposit is the norm in newer societies here. We match you with owners we know and buildings that will register you, so the first flat you see is one you can actually take.",
    help:
      "We verify who owns the flat and who is entitled to let it, so your agreement is with the right person from day one.",
  },
  {
    key: "sell",
    label: "Sell",
    heading: "Selling in {area}",
    body: "A flat with its paperwork ready sells faster and closer to the asking price. We get the file in order before we list, so a serious buyer can move the day they appear.",
    help:
      "Society NOC and dues sorted before listing. That is what turns an offer into a registration.",
  },
  {
    key: "invest",
    label: "Invest in property here",
    heading: "Investing in {area}",
    body: "The same rate per square foot buys very different flats in different pockets. We show you what each one actually rents for, and to whom, so the numbers work before you commit.",
    help:
      "We compare buildings on rent, resale demand and the society, not on the rate alone.",
  },
  {
    key: "interiors",
    label: "Do interiors",
    heading: "Interiors in {area}",
    body: "You get an itemised estimate before any work starts, and we handle the society permission, so the design that is drawn is the design that gets built.",
    help:
      "We check the society's rules first, so nothing is drawn that cannot be built.",
  },
];

/**
 * The middle row: what kind of property.
 *
 * Kept separate from intent on purpose. "Buy" and "Plot" are answers to two
 * different questions, and putting them in one row asked the reader to hold
 * both at once. Splitting them also means the lead that reaches us says what
 * somebody wants AND what kind of thing it is, from clicks alone.
 *
 * `phrase` exists because the WhatsApp message is a sentence. "a flat" reads,
 * "a something else" does not.
 */
export type PropertyType = {
  key: string;
  label: string;
  phrase: string;
  note: string;
};

export const PROPERTY_TYPES: PropertyType[] = [
  {
    key: "flat",
    label: "Flat",
    phrase: "a flat",
    note: "A good society is half of a good flat. We tell you about the dues, the rules and the neighbours before you decide.",
  },
  {
    key: "bungalow",
    label: "Bungalow",
    phrase: "a bungalow",
    note: "With a bungalow you are buying the land as much as the house. We check the land title first, because that is where the value is.",
  },
  {
    key: "shop",
    label: "Shop or office",
    phrase: "a shop or office",
    note: "A shop or office is priced on what it can earn. We confirm the approved use and the frontage, so the unit works for the business you have in mind.",
  },
  {
    key: "plot",
    label: "Plot",
    phrase: "a plot",
    note: "With a plot the value is in the title, the zoning and what you may build. We check all three before you pay a token.",
  },
  {
    key: "other",
    label: "Something else",
    phrase: "something else",
    note: "Godown, garage, a share in a family property, something that does not fit a box. Tell us what it is and we will tell you what to check.",
  },
];

/** Property type is only a meaningful question for these three intents. */
export const TYPED_INTENTS = ["buy", "rent", "sell"] as const;

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

/**
 * Section 08. PLACEHOLDER NAMES. Nothing renders until real names replace
 * these, because an invented team is worse than no team section.
 */
export type TeamMember = { name: string; role: string };
export const TEAM: TeamMember[] = [
  { name: "[ NAME ]", role: "Founder. In Borivali property since 1996." },
  { name: "[ NAME ]", role: "Rentals and tenant relations." },
  { name: "[ NAME ]", role: "Investment advisory and society liaison." },
];

/** True once real names are in. Gates the team list so placeholders never ship. */
export const TEAM_IS_REAL = TEAM.every((m) => !m.name.includes("["));
