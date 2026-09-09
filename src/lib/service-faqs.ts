/**
 * Questions and answers for the seven service pages.
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
 * words. Where it could not (typical rent per month, expected returns,
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

  "investment-advisory": [
    {
      q: "Is real estate a good investment in Mumbai?",
      a: "It can be, and it is not automatic. A flat here produces rent while you hold it and whatever the resale market gives you when you sell. The rent is measurable before you buy; the resale is not. What decides the outcome is usually the specific building, the pocket and the price you paid, not the city.",
    },
    {
      q: "What return should I expect on a flat in Borivali, Kandivali or Malad?",
      a: "We do not publish an expected return, and it is worth being careful with anybody who does. Yields vary by building, floor, pocket and the price you actually negotiate, so a figure quoted for a whole suburb tells you nothing about the flat in front of you. We do the arithmetic on the specific property instead.",
      href: "/tools/rental-yield-calculator",
      hrefLabel: "Work out the gross yield on a flat you are considering",
    },
    {
      q: "What is the 2% rule for properties?",
      a: "An American rule of thumb suggesting monthly rent should be about two percent of the purchase price. It does not translate to Mumbai, where capital values are high relative to rents, and applying it here would rule out essentially every flat in the city. Judge a property on its own arithmetic instead.",
    },
    {
      q: "Can an NRI buy investment property in these suburbs?",
      a: "Yes. Under the Reserve Bank of India's rules on acquisition and transfer of immovable property, a non resident Indian or overseas citizen of India may buy residential or commercial property in India. The restriction is on agricultural land, plantation property and farmhouses, which cannot be bought this way.",
    },
    {
      q: "Should an investor buy under construction or ready possession?",
      a: "They are different risks rather than one being better. Ready possession earns rent immediately and you can see exactly what you are buying. Under construction ties up capital with no income until handover and carries delivery risk, which is why the MahaRERA registration and the developer's completion record matter more than the brochure.",
    },
  ],
  "commercial-plots": [
    {
      q: "Can residential property be used as commercial in Mumbai?",
      a: "Generally no. A flat is sanctioned for residential use, and running a shop or a general office from it is a change of use the building was not approved for. Certain professionals may use part of their own residence for their practice, subject to the society's bye laws, but that does not extend to retail or to a business bringing customers through a residential lobby.",
    },
    {
      q: "How much is GST on commercial property in Mumbai?",
      a: "Renting commercial premises is a taxable supply of services, charged at eighteen percent where the landlord is liable to be registered. A completed commercial unit sold after its completion certificate does not attract GST on the sale; an under construction one does. Ask whether a quoted rent is inclusive or exclusive before you compare two units.",
    },
    {
      q: "Is stamp duty different on commercial property?",
      a: "The base rate is the same, but the 1 percent concession for a woman buyer applies only to residential property, so a shop or office pays the full rate whoever buys it. Duty is still charged on the agreement value or the ready reckoner value, whichever is higher.",
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
  ],
  "mhada-paperwork": [
    {
      q: "Can I sell a MHADA flat after 5 years?",
      a: "Five years from allotment is the point at which the society may permit a transfer under the 1981 Regulations, but the Board's written permission is still required, the buyer has to fall in the same income group as the scheme, and all dues must be paid. Selling without that permission can void the sale.",
      href: "/blog/can-we-sell-mhada-flat",
      hrefLabel: "The full rules on selling a MHADA flat",
    },
    {
      q: "What are the MHADA name transfer fees?",
      a: "The Mumbai Board's published schedule for transfer of tenancy rights is 45 rupees per square foot for LIG capped at 15,000 rupees, 55 for MIG capped at 25,000, and 60 for HIG capped at 35,000, as published on mhada.gov.in and checked on 9 September 2026. The Board may also ask for a share of the unearned increase on a sale. Confirm the current schedule before paying.",
    },
    {
      q: "Can we transfer a MHADA flat to another person?",
      a: "Yes, with the previous written permission of the Board and of the society where one exists. Within a family, and to a legal heir on death, the Regulations provide for transfer in the name of a family member. Outside the family it is a sale, with the five year, income group and dues conditions attached.",
    },
    {
      q: "Can I rent out a MHADA flat?",
      a: "Yes, with a no objection certificate for rent from the Mumbai Board. It is a notified Right to Public Services item with an eight day time limit and the Estate Manager as the designated officer. Once you have it, register the leave and licence agreement under section 55 of the Rent Control Act as for any flat.",
      href: "/blog/can-we-rent-mhada-flat",
      hrefLabel: "How the NOC for rent works",
    },
    {
      q: "What is a MHADA NOC?",
      a: "A no objection certificate from the Board for a specific act: selling the flat, letting it, or mortgaging it to a lender. Each is a separate application to the Estate Manager with its own documents. A lender will not sanction a loan on a MHADA flat without the mortgage NOC, and a sale or tenancy without the relevant one puts the allotment at risk.",
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
