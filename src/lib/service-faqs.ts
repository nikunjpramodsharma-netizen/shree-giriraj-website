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
 * words. Where it could not (expected returns, "best builders"), it is not,
 * rather than answered with a guess.
 *
 * 7 November 2026: answers cut to short sentences for the readability batch,
 * same facts. The interiors cost answer quotes the sourced Mumbai market
 * range on the interiors page (service-content-core.ts), not a price list.
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
      a: "Resale flats offered in Borivali West asked a median of 36,228 rupees per square foot of carpet. That is Mumbai Property Exchange, week ending 15 November 2026. New projects there asked a median of 34,157. A 650 square foot 2 BHK at the resale median is roughly 2.35 crore. Square Yards' average across all listings is lower, 30,750 for September 2026. Stamp duty adds 6 percent for most buyers, and registration up to 30,000 rupees. Older buildings and upper floors sit either side of that. Tell us the number you can spend and we will tell you what it opens.",
      href: "/blog/carpet-area-vs-built-up-area",
      hrefLabel: "What flats cost per carpet foot across the six sub localities",
    },
    {
      q: "What is the price of a resale 1 BHK in Borivali West?",
      a: "A resale 1 BHK of 400 to 450 square feet carpet in Borivali West asks about 1.23 to 1.38 crore rupees. That is Square Yards' September 2026 average of 30,750 rupees per square foot. Older buildings ask less. Asking is not the registered price. The gap between buildings in one locality is wider than the gap between localities, so the building matters more than the suburb.",
    },
    {
      q: "What should I check before buying a resale flat?",
      a: "Before buying a resale flat, check the chain of title over thirty years. That means the past sale deeds that prove ownership, with the Index 2 for each. Then the society share certificate and its no objection letter. Then the latest property tax bill in the seller's name and the building's occupancy certificate. If the seller had a loan, ask for the lender's closure letter. An encumbrance search, a check for loans or claims, is one item in that stack, never the whole of it.",
      href: "/blog/encumbrance-certificate",
      hrefLabel: "What we pull alongside the encumbrance certificate",
    },
    {
      q: "What do I pay on top of the price?",
      a: "Stamp duty is 6 percent for a male buyer, or 5 percent for a woman buying in her sole name. Both include the metro cess. Duty is charged on the agreed price or the government's ready reckoner value, whichever is higher. Registration is 1 percent, capped at 30,000 rupees. Then come the society's transfer charges. Brokerage we agree in writing before we start, never after.",
      href: "/tools/stamp-duty-calculator-mumbai",
      hrefLabel: "Stamp duty and registration calculator",
    },
    {
      q: "Which is the better side of Borivali West to buy in?",
      a: "In Borivali West, the station belt and the Link Road side are two different markets at about the same price. The station side has older buildings and a shorter walk to the train. The Link Road side has newer buildings and a longer commute. Which is better depends on who is living there and how they travel. That is the first thing we ask.",
    },
    {
      q: "What is my flat worth? Do you value it free?",
      a: "The first price opinion on your flat is free. Send the building, floor, size and pocket on WhatsApp, and we reply with a fair listing price, usually the same day. It is a market opinion from current asking rates and the buildings we know. It is not a formal valuation report for a bank or a court. The ready reckoner rate is the government's floor for stamp duty, not the market price.",
      href: "/blog/ready-reckoner-rate-mumbai",
      hrefLabel: "What the ready reckoner rate is, and what it is not",
    },
    {
      q: "How do I sell my flat faster in Borivali, Kandivali or Malad?",
      a: "A flat sells faster when it is priced at the going rate for its building and its papers are ready before the first viewing. We do both. Most of our sellers own flats in buildings we already know, and we bring buyers we have already met. A buyer's bank and lawyer then find the file in order, so an offer moves to registration without a pause.",
    },
    {
      q: "What documents do I need to sell my flat?",
      a: "To sell a flat in Mumbai you need the documents a buyer's bank and lawyer ask for. That means the share certificate, the past sale deeds with their Index 2, and the society's no objection letter. Add the latest maintenance and property tax receipts. If the flat had a loan, add the lender's closure letter. We list what your file has and what it still needs before the flat is shown.",
      href: "/blog/society-noc-for-sale-of-flat-mumbai",
      hrefLabel: "How the society NOC for a sale works",
    },
  ],

  rentals: [
    {
      q: "How many months of deposit will I pay in Borivali or Kandivali?",
      a: "Two to three months' rent is the norm for a deposit in newer societies in Borivali and Kandivali. Some older buildings and premium pockets ask for more. No Maharashtra law caps the deposit. The two month limit quoted online comes from a central model law the state has not adopted. So the deposit is a term of the agreement, and it can be negotiated.",
      href: "/blog/rent-deposit-months-western-suburbs",
      hrefLabel: "How many months of deposit is normal, and when it is negotiable",
    },
    {
      q: "Does a rent agreement have to be registered?",
      a: "A rent agreement in Maharashtra must be in writing and registered. Section 55 of the Maharashtra Rent Control Act makes this compulsory. The duty to register it sits with the landlord. If it is not registered, a court goes by the tenant's account of the terms. Every agreement we draft is registered, for both sides' sake.",
    },
    {
      q: "What do I need to rent a flat here?",
      a: "To rent a flat in Borivali, Kandivali or Malad you need identity and address proof, and proof of income. Salary slips or an employer letter will do. Then the deposit and the first month's rent. Tenant police verification is compulsory in Maharashtra, and most societies ask for it before the keys change hands. We tell you the society's own requirements before the visit.",
    },
    {
      q: "What should the agreement say about the deposit?",
      a: "A rent agreement should state the deposit amount, the deductions the landlord may make, and the date it comes back. Ordinary wear and tear, including repainting after normal use, is not a deduction the law allows. Courts treat fifteen to thirty days from handing back the keys as a reasonable return window. That is the number to write in.",
    },
    {
      q: "I own a flat here. What does listing it with you involve?",
      a: "Listing a flat for rent with us gets you a verified tenant, a registered agreement and fewer vacant months. You tell us the rent and the date the flat is free. We bring tenants we have met, with documents we have checked. Then we handle the agreement through registration.",
    },
    {
      q: "Do I pay anything before I find a flat?",
      a: "A tenant pays us nothing until the tenancy actually completes. Tell us the budget and the move in date. We show you only flats where the owner is verified and the society will register you.",
    },
  ],

  "new-project-bookings": [
    {
      q: "What do new launches cost per square foot in Kandivali and Borivali?",
      a: "New projects ask a median of about 29,000 to 34,000 rupees per square foot of carpet across these suburbs. In the week ending 15 November 2026, Mumbai Property Exchange put Borivali West at 34,157 and Borivali East at 31,265. Kandivali West was 29,721 and Kandivali East 32,590. Malad West was 29,691 and Malad East 28,939. Quoted ranges run far wider, up to 59,000 in Borivali West. These are asking rates, not registered prices.",
      href: "/blog/carpet-area-vs-built-up-area",
      hrefLabel: "The full table, with the quoted range in each sub locality",
    },
    {
      q: "Which projects are launching in Kandivali and Borivali right now?",
      a: "Launches listed in Kandivali and Borivali in September 2026 include Kalpataru Vienta, Godrej Bliss and Shapoorji Sarova in Kandivali East. Ruparel Palacio and Zen Gardens in Kandivali West. Rishabraj Agnel, Royal Eksar and Kamla Prasanna Jeevan in Borivali West. Rustomjee Summit, Chandak Greenairy and Oberoi Sky City in Borivali East. Inventory and price sheets change weekly, so ask us for the current one.",
    },
    {
      q: "What should I check before booking a new flat?",
      a: "Before booking a new flat, check its MahaRERA registration number and project page. The page shows the carpet area, the promised possession date and any loan or claim on the land. Then the title report, and the approvals the project holds today. Section 13 of RERA also helps you: a developer may not take more than 10 percent of the price before a registered agreement for sale. A larger demand is your cue to ask why.",
    },
    {
      q: "When do I pay stamp duty on an under construction flat?",
      a: "Stamp duty on an under construction flat in Maharashtra is paid when the agreement for sale is signed, not at possession. The Supreme Court held in 2024 that the duty falls on the agreement. Paying late attracts a penalty of 2 percent a month. So keep the duty and registration money ready at the booking stage, on top of the 10 percent.",
      href: "/blog/stamp-duty-and-registration-charges-mumbai",
      hrefLabel: "Stamp duty and registration charges in Mumbai",
    },
    {
      q: "How does early access actually work?",
      a: "Developers show floor plans and launch prices to agencies they know before the public launch. We pass that on to clients who have told us their budget and suburb. You choose from the full inventory rather than what is left. The RERA checks above apply to a launch just as much as to a resale.",
    },
    {
      q: "Is the sample flat a fair guide to the flat I will get?",
      a: "A sample flat shows the finish and the layout, but not your floor, your view or your carpet area as the law defines it. So we take you to the floors you are considering. We read the carpet area on the MahaRERA page with you, and compare the two before you book.",
    },
  ],

  "investment-advisory": [
    {
      q: "Is real estate a good investment in Mumbai?",
      a: "Real estate in Mumbai can be a good investment. The result depends more on the building, the pocket and the price paid than on the city. A flat here earns rent while you hold it, and whatever the resale market gives you when you sell. You can measure the rent before you buy; the resale you cannot.",
    },
    {
      q: "What return should I expect on a flat in Borivali, Kandivali or Malad?",
      a: "Shree Giriraj does not publish an expected return, because yields vary by building, floor, pocket and the price you negotiate. A figure for a whole suburb tells you little about the flat in front of you. We do the sums on the specific property, which is the number worth deciding on.",
      href: "/tools/rental-yield-calculator",
      hrefLabel: "Work out the gross yield on a flat you are considering",
    },
    {
      q: "What is the 2% rule for properties?",
      a: "The 2% rule is an American rule of thumb: monthly rent should be about two percent of the purchase price. It does not translate to Mumbai, where prices are high next to rents. Applied here, it would rule out almost every flat in the city. Judge a property on its own sums instead.",
    },
    {
      q: "Can an NRI buy investment property in these suburbs?",
      a: "A non resident Indian or an overseas citizen of India may buy residential or commercial property in India, under the Reserve Bank of India's rules. The limit is on agricultural land, plantation property and farmhouses. Those cannot be bought this way.",
    },
    {
      q: "Should an investor buy under construction or ready possession?",
      a: "Under construction and ready flats suit different investor plans, rather than one being better. A ready flat earns rent at once, and you can see exactly what you are buying. An under construction flat ties up money with no income until handover. That is why the MahaRERA registration and the developer's completion record matter more than the brochure.",
    },
    {
      q: "Will you tell me if a flat is not worth buying?",
      a: "We tell you plainly when a flat is not worth buying. Advice is only useful if it can say no. We work out the rent the flat can realistically earn, and what that is on the price asked. We check the building and the paperwork. If it does not add up, we say so and help you find one that does.",
    },
  ],
  "commercial-plots": [
    {
      q: "Can residential property be used as commercial in Mumbai?",
      a: "A residential flat in Mumbai generally cannot be used as a shop or general office. A flat is approved for living in, and running a shop or general office from it changes that use. Some professionals may use part of their own home for their practice, if the society's bye laws allow it. That does not stretch to a shop, or to a business bringing customers through a residential lobby.",
    },
    {
      q: "How much is GST on commercial property in Mumbai?",
      a: "Rent on a shop or office in Mumbai carries GST at 18 percent once the landlord must register. That happens when yearly turnover passes 20 lakh rupees. A commercial unit sold after its completion certificate carries no GST on the sale. An under construction one does. Ask whether a quoted rent includes GST before you compare two units.",
    },
    {
      q: "Is stamp duty different on commercial property?",
      a: "Stamp duty on a shop or office in Mumbai is charged at the same base rate as on a home. But the 1 percent concession for a woman buyer applies only to homes, so a shop or office pays the full rate whoever buys it. Duty is still charged on the agreement value or the ready reckoner value, whichever is higher.",
      href: "/tools/stamp-duty-calculator-mumbai",
      hrefLabel: "Stamp duty and registration calculator",
    },
    {
      q: "Can a shop or office be taken on leave and licence?",
      a: "A shop or office in Mumbai is usually taken on a leave and licence agreement. It must be registered under section 55 of the Rent Control Act, exactly like a home. Deposits on commercial premises are negotiated and often run higher than on flats. Maharashtra has no legal cap on either.",
    },
    {
      q: "Are there actually plots for sale in Borivali, Kandivali or Malad?",
      a: "Plots for sale in Borivali, Kandivali and Malad are rare, and rarely small. Most plots here are old bungalow plots or society plots heading for redevelopment. Others are land whose building potential depends on its reservation in the city's development plan. We tell you what genuinely exists at any time, and list nothing that does not.",
    },
    {
      q: "What do you check before I take a shop or an office?",
      a: "Before you take a shop or an office, we check three things. That the use you have in mind is approved for the premises. What the society's own rules say about business use and signage. And that the title is clear. Only then do we negotiate, and we take the agreement or sale deed through registration with you.",
    },
  ],
  "mhada-paperwork": [
    {
      q: "Can I sell a MHADA flat after 5 years?",
      a: "A MHADA flat can be sold after five years, with the written permission of the Board and the society. Five years from allotment is when the society may permit a transfer under the 1981 Regulations. The Board's written permission is still required. The buyer must fall in the scheme's income group, and all dues must be paid. With those in place, the sale goes through cleanly. If the flat is in Borivali, Kandivali or Malad, we can also find the buyer.",
      href: "/blog/can-we-sell-mhada-flat",
      hrefLabel: "The full rules on selling a MHADA flat",
    },
    {
      q: "What are the MHADA name transfer fees?",
      a: "The Mumbai Board's schedule for transfer of tenancy rights is 45 rupees per square foot for LIG, capped at 15,000 rupees. MIG is 55, capped at 25,000. HIG is 60, capped at 35,000. That is as published on mhada.gov.in and checked on 9 September 2026. On a sale the Board may also ask for a share of the profit, called the unearned increase.",
    },
    {
      q: "Can we transfer a MHADA flat to another person?",
      a: "A MHADA flat can be transferred to another person with the previous written permission of the Board, and of the society where there is one. Within a family, and to a legal heir on death, the Regulations allow transfer to a family member. Outside the family it is a sale, with the five year, income group and dues conditions.",
    },
    {
      q: "Can I rent out a MHADA flat?",
      a: "A MHADA flat can be rented out once the Mumbai Board issues a no objection certificate for rent. It is a notified public service with an eight day time limit, and the Estate Manager is the officer responsible. In our experience it comes through in about eight days. Then register the leave and licence agreement under section 55 of the Rent Control Act, as for any flat.",
      href: "/blog/can-we-rent-mhada-flat",
      hrefLabel: "How the NOC for rent works",
    },
    {
      q: "What is a MHADA NOC?",
      a: "A MHADA NOC is a no objection certificate from the Board for one specific act. That act is selling the flat, letting it, or taking a loan on it. Each is a separate application to the Estate Manager with its own documents. A bank needs the loan certificate before it lends on a MHADA flat. We file the right one for what you plan to do.",
    },
    {
      q: "Which MHADA paperwork do you handle?",
      a: "We handle every MHADA permission a flat owner needs: transfer of tenement, and the no objection certificates for sale, rent and a loan. Transfer on the death of the original allottee. Regularisation, where a flat changed hands without the Board's permission. And the society's lease and land transfer papers. Tell us what you hold and we will tell you which of these you need.",
    },
  ],
  interiors: [
    {
      q: "What does a 2 BHK interior cost in Mumbai?",
      a: "Published Mumbai cost guides put a 2 BHK at about 5.5 to 7 lakh rupees for basic work. Mid level runs 7 to 12 lakh, and premium 12 lakh and above. That is the market's range from Design Cafe, Livspace and Asian Paints Beautiful Homes, read on 7 November 2026, not our price list. GST at 18 percent may be extra. We give you an itemised estimate for your own flat.",
    },
    {
      q: "Do you work in Kandivali and Malad?",
      a: "Shree Giriraj does interiors across Borivali, Kandivali and Malad, on both the west and east sides. Our office is in Chikoowadi, Borivali West, so a first walk through anywhere in the three suburbs is easy to arrange. Send 3 photos of your flat on WhatsApp and we will set a time.",
    },
    {
      q: "How does an interior designer in Borivali charge?",
      a: "An interior designer in Borivali, as across Mumbai, charges in one of two ways. The large organised firms fold the design fee into the package price. Independent designers charge per square foot or a percentage of the project value, and the spread is wide. We quote design and execution together, itemised, before any work starts.",
      href: "/blog/choosing-an-interior-designer-in-borivali",
      hrefLabel: "What to ask an interior designer before you pay an advance",
    },
    {
      q: "How much advance is normal?",
      a: "The largest organised firms take about 10 percent to book. The large payments fall only after the design and quantities are signed off and a works contract exists. We take no advance until the scope is agreed in writing.",
    },
    {
      q: "Do I need society permission for interior work?",
      a: "Interior work in a Mumbai housing society needs the society's written permission before it starts, under bye law 46 of the model bye laws. Structural work also needs the BMC's permission, under the Mumbai Municipal Corporation Act. That includes touching a column or beam, merging flats, moving a bathroom or kitchen, or enclosing a balcony. We handle the society application and its rules on hours, lift use and debris.",
    },
    {
      q: "What is the 70/30 rule in interior design?",
      a: "The 70/30 rule is a designer's rule of thumb, not a regulation. Keep about 70 percent of a room in one main style or a neutral palette. Use the other 30 percent for accent, colour and contrast. It stops a flat looking like a showroom of everything at once.",
    },
    {
      q: "Can I see what needs doing before I ask for a quote?",
      a: "Our free interior scope builder lets you go room by room and note what you want done. That way the estimate you receive is for the right job. We then walk through the flat with you and give an itemised estimate before any work begins.",
      href: "/tools/interior-scope-builder",
      hrefLabel: "Open the interior scope builder",
    },
    {
      q: "Do you only do interiors for flats you sold?",
      a: "We do interiors for any flat in the three suburbs, not only flats we sold. Interiors began because our resale clients kept asking whom to trust once the keys were theirs. Today it is a service of its own, for new and resale flats across Borivali, Kandivali and Malad. Wherever you bought, send 3 photos of the flat on WhatsApp and we will arrange a walk through.",
    },
  ],
};

export function getServiceFaqs(slug: string): ServiceFaq[] {
  return SERVICE_FAQS[slug] ?? [];
}
