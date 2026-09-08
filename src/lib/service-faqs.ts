/**
 * Questions and answers for the six service pages.
 *
 * WHY THIS IS IN THE REPO AND NOT IN SANITY
 *
 * The service pages draw their body from Sanity, which is fine for prose the
 * owner may want to edit. The questions are different: each answer carries a
 * figure or a legal point that is sourced and dated in a blog post, and the
 * two have to move together. Keeping them here means a price refreshed in the
 * carpet area article is refreshed here in the same commit, and a test can
 * hold the two to the same numbers.
 *
 * WHICH QUESTIONS
 *
 * Each service's keyword was run through Google's People Also Ask on
 * 8 September 2026 (DataForSEO). Where a question people actually type could
 * be answered from a source the site already cites, it is here in their
 * words. Where it could not (typical rent per month, redevelopment timelines,
 * "best builders"), it is not, rather than answered with a guess.
 *
 * English only. The service routes exist in four locales, but these answers
 * quote English sources and English article titles, so the page shows them
 * and marks them up only on the English route.
 */

export type ServiceFaq = { q: string; a: string; href?: string; hrefLabel?: string };

export const SERVICE_FAQS: Record<string, ServiceFaq[]> = {
  "resale-flats": [
    {
      q: "What does a resale flat in Borivali West cost right now?",
      a: "Resale asking rates in Borivali West sat at a median of about 31,200 rupees per square foot of carpet over the eighteen months to July 2026, level with new launches there. A 650 square foot 2 BHK at that rate is roughly 2 crore before stamp duty and registration add about 7 percent. Older buildings and upper floors sit either side of that. Tell us the number you can spend and we will tell you what it opens.",
      href: "/blog/carpet-area-vs-built-up-area",
      hrefLabel: "What flats cost per carpet foot across the six sub localities",
    },
    {
      q: "What is the price of a resale 1 BHK in Borivali West?",
      a: "At the same median asking rate, a 1 BHK of 400 to 450 square feet carpet works out to about 1.25 to 1.4 crore rupees asking, with older buildings below that. Asking is not the registered price, and the gap between buildings in one locality is wider than the gap between localities, so the building matters more than the suburb.",
    },
    {
      q: "What should I check before buying a resale flat?",
      a: "The chain of title over thirty years, the Index 2 for every document in it, the society share certificate and its no objection letter, the latest property tax bill in the seller's name, the building's occupancy certificate, and if the seller had a loan, the lender's closure letter. An encumbrance search is one item in that stack, never the whole of it.",
      href: "/blog/encumbrance-certificate",
      hrefLabel: "What we pull alongside the encumbrance certificate",
    },
    {
      q: "What do I pay on top of the price?",
      a: "Stamp duty at 6 percent for a male buyer or 5 percent for a woman holding in her sole name, both including the metro cess, on the higher of the agreed price and the ready reckoner value. Registration at 1 percent, capped at 30,000 rupees. The society's transfer charges. And brokerage, which we agree in writing before we start, never after.",
      href: "/tools/stamp-duty-calculator-mumbai",
      hrefLabel: "Stamp duty and registration calculator",
    },
    {
      q: "Which is the better side of Borivali West to buy in?",
      a: "The station belt and the Link Road side are two different markets at about the same price, and people conflate them and overpay on the wrong one. The station side is older stock and a shorter walk to the train; the Link Road side is newer buildings and a longer commute. Which is better depends on who is living there and how they travel, and that is the first thing we ask.",
    },
  ],

  rentals: [
    {
      q: "How many months of deposit will I pay in Borivali or Kandivali?",
      a: "Two to three months' rent is the norm in newer societies, rising to four, five or six in older buildings and premium pockets. No Maharashtra law caps it; the two month limit quoted online is a central model law the state has not enacted. So the number is a term of the agreement, and it is negotiable.",
      href: "/blog/rent-deposit-months-western-suburbs",
      hrefLabel: "How many months of deposit is normal, and when it is negotiable",
    },
    {
      q: "Does a rent agreement have to be registered?",
      a: "Yes. Section 55 of the Maharashtra Rent Control Act makes a written, registered leave and licence agreement compulsory, and puts the duty to register on the landlord. If it is not registered, the tenant's account of the terms is what a court goes by. Every agreement we draft is registered, for both sides' sake.",
    },
    {
      q: "What do I need to rent a flat here?",
      a: "Identity and address proof, something that shows income, such as salary slips or an employer letter, the deposit, and the first month's rent. Tenant police verification is compulsory in Maharashtra and most societies will ask for it before the keys change hands. We tell you the society's own requirements before the visit, not after.",
    },
    {
      q: "What should the agreement say about the deposit?",
      a: "The amount, the deductions the landlord may make, and the date it comes back. Ordinary wear and tear, including repainting after normal use, is not a deduction the law allows. Fifteen to thirty days from handing back the keys is what courts treat as a reasonable return window, and it is the number to write in.",
    },
    {
      q: "I own a flat here. What does listing it with you involve?",
      a: "A verified tenant, a registered agreement, and no vacant months waiting on portal enquiries that go nowhere. You tell us the rent and the move in date; we bring tenants we have met and documents we have checked, and we handle the agreement through registration.",
    },
  ],

  "new-project-bookings": [
    {
      q: "What do new launches cost per square foot in Kandivali and Borivali?",
      a: "On the projects listed in September 2026, asking rates ran about 25,000 to 35,000 rupees per square foot of carpet in Borivali West, 25,000 to 32,000 in Borivali East, 20,000 to 30,000 in Kandivali West and 24,000 to 34,000 in Kandivali East, with the branded towers in Kandivali East and Borivali East reaching 40,000 and above. Malad ran 22,000 to 33,000. These are developers' asking rates, not registered prices.",
      href: "/blog/carpet-area-vs-built-up-area",
      hrefLabel: "The full table, with named projects behind each band",
    },
    {
      q: "Which projects are launching in Kandivali and Borivali right now?",
      a: "Among those listed in September 2026: Kalpataru Vienta, Godrej Bliss and Shapoorji Sarova in Kandivali East; Ruparel Palacio and Zen Gardens in Kandivali West; Rishabraj Agnel, Royal Eksar and Kamla Prasanna Jeevan in Borivali West; Rustomjee Summit, Chandak Greenairy and Oberoi Sky City in Borivali East. Inventory and price sheets change weekly, so ask us for the current one rather than relying on a portal.",
    },
    {
      q: "What should I check before booking a new flat?",
      a: "The MahaRERA registration number and its page, which shows the carpet area, the promised possession date and any encumbrance on the land. The title report. The approvals the project actually holds today. And the rule in section 13 of RERA: a promoter may not take more than 10 percent of the price before a registered agreement for sale exists, so a larger booking demand is itself a warning.",
    },
    {
      q: "When do I pay stamp duty on an under construction flat?",
      a: "When the agreement for sale is signed, not at possession. The Supreme Court held in 2024 that the agreement is the document the duty falls on, and paying late attracts a penalty of 2 percent a month. So the duty and registration money has to be ready at the booking stage, on top of the 10 percent.",
      href: "/blog/stamp-duty-and-registration-charges-mumbai",
      hrefLabel: "Stamp duty and registration charges in Mumbai",
    },
    {
      q: "How does early access actually work?",
      a: "Developers open floor plans and launch pricing to agents they know before the public launch, and we pass that on to clients who have told us their budget and suburb. It means choosing from the full inventory rather than what is left. It does not mean pressure: the RERA checks above apply to a launch just as much as to a resale.",
    },
  ],

  redevelopment: [
    {
      q: "How old does a building have to be for redevelopment?",
      a: "There is no fixed age in law. A society can redevelop when its general body decides to and the plot can support it. In practice the trigger is a structural audit, which the municipal corporation requires for buildings over thirty years old under section 353B of the Mumbai Municipal Corporation Act, and the free feasibility assessment we offer starts from what that audit and the plot's development potential say.",
    },
    {
      q: "Does the society need conveyance before it can redevelop?",
      a: "In practice, yes. A society signs a development agreement over land, and it cannot do that with confidence until the land is in its name. If the builder never conveyed it, the route is deemed conveyance through the District Deputy Registrar, which does not need the builder's signature and, since 31 December 2025, is open to RERA registered projects as well.",
      href: "/blog/conveyance-and-deemed-conveyance",
      hrefLabel: "Conveyance and deemed conveyance for a Mumbai society",
    },
    {
      q: "What are the rules for choosing a developer?",
      a: "The state's guidelines under section 79A of the Maharashtra Co operative Societies Act set the process: a general body decision, a project management consultant or architect appointed by the society, developer selection by open tender rather than the first offer that walks in, and the decision recorded at a meeting with the registrar's authorised officer present. Following it is what makes the eventual agreement hard to challenge.",
    },
    {
      q: "What should the redevelopment agreement cover?",
      a: "The carpet area each member gets, the corpus, the rent paid during construction and for how long, the bank guarantee, the completion date and the penalty for missing it, parking, the occupancy certificate before possession, and conveyance of the new building to the society. Signed without independent review, an agreement can lock a society into unfavourable terms for a decade. Reviewing it before signature is most of what we do.",
    },
    {
      q: "What does a feasibility report tell us?",
      a: "What the plot can realistically support under the development rules that apply to it, and therefore what a developer can honestly offer: how much additional area, whether a corpus is realistic, and whether the numbers being floated at the society meeting are numbers at all. It is the document that turns a redevelopment conversation from hope into arithmetic, and it is free from us.",
    },
  ],

  "shops-plots": [
    {
      q: "What should I check before buying a shop in a residential building?",
      a: "Whether the unit is sanctioned for commercial use, whether the society's bye laws and the committee permit the kind of business you intend, and what the society's no objection will cost. Then the frontage and the footfall on that stretch, which is the part a portal listing cannot tell you. Registration under the Maharashtra Shops and Establishments Act follows the purchase.",
    },
    {
      q: "Is stamp duty different on commercial property?",
      a: "The base rate is the same, but the 1 percent concession for a woman buyer applies only to residential property, so a shop or office pays the full rate whoever buys it. Duty is still on the higher of the agreed price and the ready reckoner value, and reckoner rates for commercial units are set separately from residential ones and usually run higher.",
      href: "/tools/stamp-duty-calculator-mumbai",
      hrefLabel: "Stamp duty and registration calculator",
    },
    {
      q: "Can a shop or office be taken on leave and licence?",
      a: "Yes, and it is the usual instrument. The agreement has to be registered under section 55 of the Rent Control Act exactly as a residential one does. Deposits on commercial premises are negotiated and commonly run higher than on flats; there is no statutory cap in Maharashtra for either.",
    },
    {
      q: "Are there actually plots for sale in Borivali, Kandivali or Malad?",
      a: "Rarely, and rarely small. Most of what is called a plot in these suburbs is an old bungalow plot, a society plot heading for redevelopment, or land with a development potential that depends on its reservation in the development plan. We will tell you what genuinely exists at any given time rather than list something that does not.",
    },
    {
      q: "What decides what a plot is worth?",
      a: "Its development potential more than its area: the floor space index that applies, any transferable development rights it can absorb, what the development plan reserves it for, and whether the title is clean enough for a lender. Two plots of the same size on the same road can differ several times over on those four points.",
    },
  ],

  interiors: [
    {
      q: "How much does an interior designer charge in Mumbai?",
      a: "Two ways. The large organised firms fold the design fee into the package price and charge nothing separately. Independent designers charge per square foot, anywhere from 40 or 50 rupees to 500 with 100 to 150 the usual middle, or a percentage of the project value. We quote design and execution together, itemised, before any work starts.",
      href: "/blog/choosing-an-interior-designer-in-borivali",
      hrefLabel: "What to ask an interior designer before you pay an advance",
    },
    {
      q: "What does a 2 BHK fit out cost here?",
      a: "Roughly 7 to 10 lakh rupees for a full home at a sensible specification and 12 to 15 lakh for premium finishes, plus 18 percent GST, on the Mumbai figures the large firms publish. The three big pieces alone, a kitchen and two wardrobes with a TV unit, run from about 3.4 to 5.8 lakh. A quote well below that has left something out.",
    },
    {
      q: "How much advance is normal?",
      a: "About 10 percent to book, which is what the largest organised firms take, with the large payments falling only after the design and the quantities are signed off and a works contract exists. More than that before anything is in writing is the point to ask what the money buys.",
    },
    {
      q: "Do I need society permission for interior work?",
      a: "Yes, in writing, before work starts, under bye law 46 of the model bye laws. Anything structural, such as touching a column or beam, merging flats, moving a bathroom or kitchen, or enclosing a balcony, needs the BMC as well under section 342 of the Municipal Corporation Act. We handle the society application and its conditions on working hours, lift use and debris as part of the job.",
    },
    {
      q: "What is the 70/30 rule in interior design?",
      a: "A designer's rule of thumb, not a regulation: keep about 70 percent of a room in one dominant style or a neutral palette and use the other 30 percent for accent, colour and contrast. It is a way of stopping a flat from looking like a showroom of everything at once. It says nothing about cost, which is the question that actually matters.",
    },
  ],
};

export function getServiceFaqs(slug: string): ServiceFaq[] {
  return SERVICE_FAQS[slug] ?? [];
}
