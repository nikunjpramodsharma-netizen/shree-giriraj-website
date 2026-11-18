/**
 * The offer a reader of a particular post is most likely to want.
 *
 * WHY THIS EXISTS
 *
 * On 3 October 2026 the MHADA posts were bringing about seventy percent of the
 * site's search visitors, and almost none of them were buyers. Someone asking
 * "can we rent out a MHADA flat" owns one and is about to let it. Yet every
 * post ended with the same buyer's WhatsApp message ("I am looking for ___ in
 * ___. My budget is about ___."), which that reader has no reason to send.
 *
 * So a post can name the job its reader actually has, say plainly that the
 * firm does it, and open WhatsApp with a message written for that job. Posts
 * without an entry keep the general contact block and nothing else changes.
 * Every promise here must be something a service page already says the firm
 * does; a test fails if a new post is published without an offer.
 */

export type PostOffer = {
  heading: string;
  body: string;
  /** Pre filled WhatsApp text. Blanks are ___ so the reader fills them in. */
  whatsapp: string;
  button: string;
  /** Prefill for the enquiry form further down the page. Interiors has no option, so it is left unset. */
  intentKey?:
    | "intentBuy"
    | "intentSell"
    | "intentRent"
    | "intentNewProject"
    | "intentInvest"
    | "intentMhada";
};

export const POST_OFFERS: Record<string, PostOffer> = {
  "can-we-rent-mhada-flat": {
    heading: "Renting out your MHADA flat?",
    body: "We get the Board's NOC for rent for MHADA flats anywhere in Mumbai. In Borivali, Kandivali and Malad we also find the tenant and register the agreement.",
    whatsapp:
      "Hi Shree Giriraj, I want to rent out my MHADA flat in ___. Can you help with the NOC and finding a tenant?",
    button: "Ask about renting it out",
    intentKey: "intentRent",
  },
  "can-we-sell-mhada-flat": {
    heading: "Planning to sell your MHADA flat?",
    body: "We prepare the permission file for the Board and the society, for MHADA flats anywhere in Mumbai. In Borivali, Kandivali and Malad we also price the flat and find the buyer, usually replying the same day.",
    whatsapp:
      "Hi Shree Giriraj, I want to sell my ___ BHK MHADA flat in ___. Can you help with the permissions and finding a buyer?",
    button: "Ask about selling it",
    intentKey: "intentSell",
  },
  "mhada-transfer-on-death": {
    heading: "Need the flat transferred into your name?",
    body: "We put together the file the Estate Manager asks for, for flats anywhere in Mumbai, and follow it until the flat is in your name. If the family then sells or lets it in Borivali, Kandivali or Malad, we find the buyer or tenant too.",
    whatsapp:
      "Hi Shree Giriraj, I need help transferring a MHADA flat into my name after a death in the family. The flat is in ___.",
    button: "Ask about the transfer",
    intentKey: "intentMhada",
  },
  "how-to-buy-mhada-flat-in-resale": {
    heading: "Looking to buy a MHADA flat?",
    body: "We check the allotment, the five years and the permissions before you pay a token. We also share MHADA resale flats in Borivali, Kandivali and Malad that fit your budget.",
    whatsapp:
      "Hi Shree Giriraj, I am looking for a MHADA resale flat in ___. My budget is about ___.",
    button: "Find MHADA flats",
    intentKey: "intentBuy",
  },
  "mhada-redevelopment-rules": {
    heading: "Paperwork for your MHADA flat?",
    body: "We handle NOCs, transfers and permissions with the Mumbai Board for MHADA flats anywhere in Mumbai, and keep you posted at every step.",
    whatsapp:
      "Hi Shree Giriraj, I need help with paperwork for my MHADA flat in ___.",
    button: "Ask about MHADA paperwork",
    intentKey: "intentMhada",
  },
  "mhada-office-bandra": {
    heading: "Rather not spend a day at Bandra?",
    body: "We prepare the file against the Board's own list and take it to the right Estate Manager. Then we follow it through, for MHADA flats anywhere in Mumbai.",
    whatsapp:
      "Hi Shree Giriraj, I need help with MHADA paperwork for my flat in ___. It is for a ___ (transfer, NOC for rent or NOC for sale).",
    button: "Ask us to handle it",
    intentKey: "intentMhada",
  },
  "mhada-allotment-letter": {
    heading: "Allotment letter or other papers missing?",
    body: "We prepare the Form 9 application for certified copies from the Board's file and work out what your sale, loan or transfer needs, anywhere in Mumbai. Selling in Borivali, Kandivali or Malad? We also find the buyer.",
    whatsapp:
      "Hi Shree Giriraj, my MHADA allotment letter is missing for my flat in ___.",
    button: "Ask about missing papers",
    intentKey: "intentMhada",
  },
  "home-loan-on-mhada-flat": {
    heading: "Need the MHADA NOC for your loan?",
    body: "We prepare the Form 4 file and follow the NOC until it reaches your lender, for MHADA flats anywhere in Mumbai. Buying in Borivali, Kandivali or Malad? We also share resale flats that fit your budget.",
    whatsapp:
      "Hi Shree Giriraj, I need a MHADA NOC for a home loan on my flat in ___ with ___ bank.",
    button: "Ask about your loan NOC",
    intentKey: "intentMhada",
  },
  "mhada-flat-transfer": {
    heading: "Selling or buying a MHADA flat? We do the deal and the transfer",
    body: "In Borivali, Kandivali and Malad we find the buyer or the right flat, then build the transfer file against the Board's checklist and follow it until the flat is in the new name. Transfers after a gift or a death we handle for flats anywhere in Mumbai.",
    whatsapp:
      "Hi Shree Giriraj, I need a MHADA transfer for a flat in ___. The reason is ___ (selling, buying, gift or death).",
    button: "Ask about your flat",
    intentKey: "intentSell",
  },
  "mhada-noc-online": {
    heading: "Selling your MHADA flat? We find the buyer and get the NOC",
    body: "In Borivali, Kandivali and Malad we tell you a fair price, bring a buyer who can complete and get the Board's NOC for sale in the same file. Need an NOC for rent or a loan instead? We handle those for flats anywhere in Mumbai.",
    whatsapp:
      "Hi Shree Giriraj, my MHADA flat is in ___. I need the NOC for ___ (sale, rent or loan). If selling, it is a ___ BHK.",
    button: "Sell it or get the NOC",
    intentKey: "intentSell",
  },

  // Paperwork. These readers are usually in the middle of a purchase or a
  // sale, so the offer is the check or the step the post explains, done for
  // them as part of the deal. Never a standalone document service.
  "igr-maharashtra-explained": {
    heading: "Buying or selling a flat?",
    body: "Buying, we search the registered record on the flat before you pay a token. Selling, we find the buyer and line up the paperwork to registration.",
    whatsapp:
      "Hi Shree Giriraj, I am buying or selling a flat in ___. Can you check the IGR record and help with the deal?",
    button: "Ask about your flat",
    intentKey: "intentBuy",
  },
  "encumbrance-certificate": {
    heading: "Buying a resale flat?",
    body: "We pull the registered record on the flat alongside the society's papers before you pay a token, so you know exactly what you are buying.",
    whatsapp:
      "Hi Shree Giriraj, I am looking at a resale flat in ___ and would like the paperwork checked before I pay a token.",
    button: "Get the paperwork checked",
    intentKey: "intentBuy",
  },
  "index-2-property-document": {
    heading: "Selling your flat?",
    body: "We pull Index 2 and the rest of the registered record for you. We also find the buyer and keep the paperwork moving until the sale is registered.",
    whatsapp:
      "Hi Shree Giriraj, I am planning to sell my flat in ___ and would like help with the documents and finding a buyer.",
    button: "Ask about selling",
    intentKey: "intentSell",
  },
  "what-a-sale-deed-contains": {
    heading: "About to sign for a flat?",
    body: "We read the deed with you clause by clause before you sign, and check that the title and the society's papers match it.",
    whatsapp:
      "Hi Shree Giriraj, I am buying a flat in ___ and would like the sale deed checked before I sign.",
    button: "Get it checked",
    intentKey: "intentBuy",
  },
  "mutation-of-property": {
    heading: "Buying or selling in Borivali, Kandivali or Malad?",
    body: "We handle the paperwork from the first check to registration, and tell you exactly which records to update in your name afterwards.",
    whatsapp:
      "Hi Shree Giriraj, I am buying a flat in ___ and would like help with the paperwork.",
    button: "Ask about your flat",
    intentKey: "intentBuy",
  },
  "occupancy-certificate": {
    heading: "Taking possession of a flat soon?",
    body: "We check the OC and the rest of the building's papers before you pay or take the keys. We also share flats in Borivali, Kandivali and Malad that already have an OC.",
    whatsapp:
      "Hi Shree Giriraj, I am buying a flat in ___ and would like the OC and the papers checked.",
    button: "Get the papers checked",
    intentKey: "intentBuy",
  },
  "ready-reckoner-rate-mumbai": {
    heading: "Agreeing a price on a flat?",
    body: "We work out the stamp duty on both the agreed price and the reckoner value before you commit. So you know the full cost up front.",
    whatsapp:
      "Hi Shree Giriraj, I am buying a flat in ___ and would like the stamp duty worked out before I agree a price.",
    button: "Ask about your flat",
    intentKey: "intentBuy",
  },
  "stamp-duty-and-registration-charges-mumbai": {
    heading: "Budgeting for a flat?",
    body: "We work out the stamp duty and registration on the flat you are considering, in rupees, and see the purchase through to registration with you.",
    whatsapp:
      "Hi Shree Giriraj, I am buying a flat in ___. My budget is about ___. Can you help with stamp duty and registration?",
    button: "Ask about your flat",
    intentKey: "intentBuy",
  },
  "conveyance-and-deemed-conveyance": {
    heading: "Buying in an older building?",
    body: "We check the society's conveyance position and the rest of its papers before you pay a token, so you know where the building stands.",
    whatsapp:
      "Hi Shree Giriraj, I am looking at a flat in an older building in ___ and would like the papers checked.",
    button: "Get the papers checked",
    intentKey: "intentBuy",
  },
  "bmc-property-tax": {
    heading: "Not sure if your flat is under the 500 sq ft line?",
    body: "Send us your last bill and we will check the area on it against the exemption, free. When you buy or sell, we check the tax record and dues as part of the deal.",
    whatsapp:
      "Hi Shree Giriraj, can you check my BMC property tax bill? My flat is in ___.",
    button: "Send us your bill",
  },

  // Buying and renting.
  "carpet-area-vs-built-up-area": {
    heading: "Comparing flats?",
    body: "Tell us the size, your budget and the pocket. We send the flats that fit in Borivali, Kandivali or Malad, usually the same day, with the carpet area checked and the rate per usable square foot worked out.",
    whatsapp:
      "Hi Shree Giriraj, I am looking for a ___ BHK in ___. My budget is about ___. Please share the carpet area too.",
    button: "Get flats that fit",
    intentKey: "intentBuy",
  },
  "rent-deposit-months-western-suburbs": {
    heading: "Looking for a flat to rent?",
    body: "We find owner verified flats in Borivali, Kandivali and Malad and put the deposit and its refund date in writing. Then we register the leave and licence agreement for you.",
    whatsapp:
      "Hi Shree Giriraj, I am looking for a ___ BHK to rent in ___. My budget is about ___ a month.",
    button: "Find flats to rent",
    intentKey: "intentRent",
  },
  "under-construction-vs-ready-to-move-flat": {
    heading: "Deciding between new and ready?",
    body: "Tell us the size, your budget and the pocket. We send new launches and ready flats in Borivali, Kandivali and Malad side by side, usually the same day, with the MahaRERA details and the paperwork checked.",
    whatsapp:
      "Hi Shree Giriraj, I am deciding between a new launch and a ready flat. I am looking for a ___ BHK in ___. My budget is about ___.",
    button: "Compare your options",
    intentKey: "intentNewProject",
  },
  "choosing-an-interior-designer-in-borivali": {
    heading: "Planning interiors for your flat?",
    body: "Send three photos and the area of your flat in Borivali, Kandivali or Malad. We reply with an itemised estimate, check any quote you already hold and handle the society's permission. No advance until the scope is agreed.",
    whatsapp:
      "Hi Shree Giriraj, I am planning interiors for my ___ BHK in ___. It is about ___ sq ft. Can you share an itemised estimate?",
    button: "Ask for an estimate",
  },

  // Investing. The firm advises on flats and shops it can show; it does not
  // sell REIT units or fractional shares, so those readers are offered the
  // direct route the posts compare against.
  "commercial-property-investment-mumbai": {
    heading: "Looking at a shop or office?",
    body: "Tell us the parade and your budget. We show you the shops and offices genuinely available in Borivali, Kandivali and Malad, tell you what similar units let for, and check the approved use, society rules and frontage before you commit.",
    whatsapp:
      "Hi Shree Giriraj, I am looking for a shop or office in ___. My budget is about ___.",
    button: "Find shops and offices",
    intentKey: "intentInvest",
  },
  "best-area-to-invest-in-mumbai": {
    heading: "Weighing up where to invest?",
    body: "Send your budget and the kind of tenant you want. We send the flats in Borivali, Kandivali or Malad that fit, usually the same day, with the achieved rent and the net yield on each.",
    whatsapp:
      "Hi Shree Giriraj, I want to invest in a flat in ___. My budget is about ___. Which pockets and flats fit?",
    button: "Get flats that fit",
    intentKey: "intentInvest",
  },
  "how-to-invest-in-real-estate-india": {
    heading: "Thinking of buying to invest?",
    body: "Tell us the budget and whether the money must pay monthly or grow. We send the flats in Borivali, Kandivali or Malad that fit, usually the same day, with the full cost and real yield, and check the title before you commit.",
    whatsapp:
      "Hi Shree Giriraj, I want to invest in a flat in ___. My budget is about ___ and I plan to hold for about ___ years.",
    button: "Get flats that fit",
    intentKey: "intentInvest",
  },
  "fractional-ownership-real-estate-india": {
    heading: "Leaning towards a flat?",
    body: "Tell us the amount and how long you can hold it. We set a real flat in Borivali, Kandivali or Malad beside the REIT you are weighing, with its achieved rent and outgoings, so you can choose on the numbers.",
    whatsapp:
      "Hi Shree Giriraj, I am comparing a REIT with a flat. I can invest about ___ and hold for about ___ years.",
    button: "Talk about investing",
    intentKey: "intentInvest",
  },
  "rental-yield-mumbai": {
    heading: "Want the yield on a real flat?",
    body: "Send us the building you are looking at. We work out its gross and net yield from the rent that building actually achieves, and send other flats in the pocket that let well.",
    whatsapp:
      "Hi Shree Giriraj, I am looking at a flat in ___ as an investment. Can you work out its rental yield?",
    button: "Get the yield worked out",
    intentKey: "intentInvest",
  },
  "gift-deed-stamp-duty-maharashtra": {
    heading: "Gifting a flat in the family?",
    body: "We work out the stamp duty and registration for your exact relationship and walk you through each step to registration, for flats in Borivali, Kandivali and Malad.",
    whatsapp:
      "Hi Shree Giriraj, I want to gift my flat in ___ to my ___. Can you tell me the stamp duty and the steps?",
    button: "Ask about a gift deed",
  },
  "tenant-police-verification-mumbai": {
    heading: "Letting your flat?",
    body: "We find the tenant, register the leave and licence and file the police intimation, so a landlord in Borivali, Kandivali or Malad has one clean set of papers.",
    whatsapp:
      "Hi Shree Giriraj, I am letting my flat in ___. Can you help with the agreement and the police intimation?",
    button: "Ask about letting it",
    intentKey: "intentRent",
  },
  "leave-and-licence-agreement-mumbai": {
    heading: "Letting a flat in Borivali, Kandivali or Malad?",
    body: "We draft the leave and licence, run the online registration with both sides and file the police intimation, and send you the exact stamp duty first.",
    whatsapp:
      "Hi Shree Giriraj, I need a registered leave and licence for my flat in ___. Rent is ___ and deposit is ___.",
    button: "Get the exact duty",
    intentKey: "intentRent",
  },
  "property-rates-borivali-kandivali-malad": {
    heading: "Turn these rates into a real price",
    body: "Buying? Send your size, budget and pocket and we send the flats that fit, usually the same day. Selling? Tell us the society and we reply with recent registered sales near your building. Borivali, Kandivali and Malad.",
    whatsapp:
      "Hi Shree Giriraj, I read your price report. I want to ___ (buy or sell) a ___ BHK in ___. My budget or society is ___.",
    button: "Get a real price",
    intentKey: "intentBuy",
  },
  "sell-flat-in-mumbai": {
    heading: "Selling your flat? Start with the registered sales near it",
    body: "Send us the society, size and floor. We reply with recent registered sales near your building and a fair listing price, then bring buyers who can complete and prepare the papers their bank asks for. Borivali, Kandivali and Malad.",
    whatsapp:
      "Hi Shree Giriraj, I want to sell my ___ BHK flat in ___ society, ___. It is on the ___ floor. Please send recent registered sales near my building.",
    button: "Get a fair listing price",
    intentKey: "intentSell",
  },
  "society-noc-for-sale-of-flat-mumbai": {
    heading: "Selling your flat? We find the buyer and line up the NOC",
    body: "We advise on the asking price, bring you serious buyers and prepare the society notice and the NOC the buyer's bank asks for, through to registration, for flats in Borivali, Kandivali and Malad.",
    whatsapp:
      "Hi Shree Giriraj, I want to sell my ___ BHK flat in ___ society, ___. Can you find a buyer and help with the society NOC?",
    button: "Get a price view",
    intentKey: "intentSell",
  },
  "society-share-certificate-transfer-fee": {
    heading: "Buying or selling a flat in a society?",
    body: "We check the share certificate, the society's records and the dues before the token, and line up the transfer with the secretary. Selling? We also bring you buyers in Borivali, Kandivali and Malad.",
    whatsapp:
      "Hi Shree Giriraj, I am ___ (buying or selling) a flat in ___ society. Can you check the share certificate and the transfer papers?",
    button: "Ask about your flat",
    intentKey: "intentSell",
  },
  "redevelopment-borivali-kandivali": {
    heading: "Where will your family live during redevelopment?",
    body: "We find owner verified rental flats near your society in Borivali, Kandivali and Malad, register the agreement, and can line up several families in the same weeks.",
    whatsapp:
      "Hi Shree Giriraj, our society in ___ is going for redevelopment. We need rental flats nearby for ___ families.",
    button: "Find rental flats nearby",
    intentKey: "intentRent",
  },
  "mhada-lottery-2026-mumbai": {
    heading: "Won a MHADA lottery flat?",
    body: "We read your Provisional Offer Letter with you, line up the documents for verification and the loan NOC, and follow the paperwork through, for MHADA flats anywhere in Mumbai.",
    whatsapp:
      "Hi Shree Giriraj, I won a flat in the MHADA Mumbai lottery in ___. Can you walk me through the next steps?",
    button: "Ask about the next steps",
    intentKey: "intentMhada",
  },
  "mhada-dues-lease-rent-property-tax": {
    heading: "Need your MHADA dues checked?",
    body: "We check what is due to the Board, the society and the BMC, gather the receipts and take the file to the Estate Manager, for MHADA flats anywhere in Mumbai. Selling in Borivali, Kandivali or Malad? We also find the buyer.",
    whatsapp:
      "Hi Shree Giriraj, I want to check the dues on my MHADA flat in ___ before a ___ (sale, rent or transfer).",
    button: "Ask for a dues check",
    intentKey: "intentMhada",
  },
  "2-bhk-interior-cost-mumbai": {
    heading: "Want an itemised estimate for your flat?",
    body: "Send three photos and the carpet area of your 2 BHK in Borivali, Kandivali or Malad. We reply with an itemised estimate, room by room, with GST shown and the society's permission handled.",
    whatsapp:
      "Hi Shree Giriraj, I am planning interiors for my 2 BHK in ___. It is about ___ sq ft. Can you share an itemised estimate?",
    button: "Ask for an estimate",
  },
  "modular-kitchen-cost-mumbai": {
    heading: "Planning a new kitchen?",
    body: "Send a photo and the kitchen's size. We reply with an itemised estimate by layout, board and finish, with GST shown, and handle the society's permission.",
    whatsapp:
      "Hi Shree Giriraj, I want a modular kitchen estimate for my flat in ___. The kitchen is about ___ ft by ___ ft.",
    button: "Ask for a kitchen estimate",
  },
  "can-nri-buy-property-in-india": {
    heading: "Buying from abroad?",
    body: "Send your country, the size and your budget. We send resale flats and new projects in Borivali, Kandivali and Malad that fit, usually the same day, show them on a video call and read the papers with you.",
    whatsapp:
      "Hi Shree Giriraj, I live in ___ and I am looking for a flat in ___. My budget is about ___.",
    button: "Send us your budget",
    intentKey: "intentBuy",
  },
  "buy-flat-in-mumbai-from-abroad": {
    heading: "Buying a Mumbai flat from abroad?",
    body: "Tell us your city, the size and your budget. We shortlist two or three flats in Borivali, Kandivali and Malad, usually the same day, show them on a video call and read the papers before a price is agreed.",
    whatsapp:
      "Hi Shree Giriraj, I live in ___ and I want to buy a flat in ___. My budget is about ___.",
    button: "Share your budget",
    intentKey: "intentBuy",
  },
  "buy-first-flat-in-mumbai": {
    heading: "Buying your first flat?",
    body: "Tell us the size, your budget and the pocket. We send two or three flats that fit, usually the same day, check the building and the papers before you pay a token, and stay with you through registration.",
    whatsapp:
      "Hi Shree Giriraj, I am buying my first flat. I am looking for a ___ BHK in ___. My budget is about ___.",
    button: "Plan my first flat",
    intentKey: "intentBuy",
  },
  "1-bhk-price-borivali-kandivali-malad": {
    heading: "Looking for a 1 BHK to live in?",
    body: "Send us your budget and the suburb you prefer. We share three 1 BHKs in Borivali, Kandivali or Malad that fit it, with the building checked and the stamp duty worked out in rupees, usually the same day.",
    whatsapp:
      "Hi Shree Giriraj, I am looking for a 1 BHK to live in, in ___. My budget is about ___.",
    button: "Get three 1 BHKs that fit",
    intentKey: "intentBuy",
  },
  "rent-or-buy-borivali-kandivali-malad": {
    heading: "Weighing renting against buying?",
    body: "Send us the suburb, your budget and how long you expect to stay. We work out renting against buying for a flat you are considering, using this week's asking rents, then find the flat itself in Borivali, Kandivali or Malad, to rent or to buy.",
    whatsapp:
      "Hi Shree Giriraj, I am deciding whether to rent or buy in ___. My budget is about ___ and I expect to stay about ___ years. Can you work the numbers with me?",
    button: "Work out rent or buy",
    intentKey: "intentBuy",
  },
  "first-investment-flat-small-budget-mumbai": {
    heading: "Planning a first flat to let out?",
    body: "Send us your own money and the suburb you like. We share three 1 BHKs in Kandivali or Malad that fit, tell you who rents in those buildings and at what, and work the year one sum before you pay a token. We also find the tenant and register the agreement.",
    whatsapp:
      "Hi Shree Giriraj, I want to buy a first flat to let out in ___. My own money is about ___ and I can top up about ___ a month. Can you shortlist 1 BHKs?",
    button: "Get three 1 BHKs to let",
    intentKey: "intentInvest",
  },
};

/**
 * The other side of a two sided service. The resale page is written for the
 * buyer and the rentals page for the tenant, which left the seller and the
 * landlord, the people who bring the listings, with no route of their own.
 */
export const SERVICE_OTHER_SIDE: Record<string, PostOffer> = {
  "resale-flats": {
    heading: "Selling your flat? Start with a free price opinion",
    body: "Send the building, floor and size. We reply with a fair listing price for your pocket, usually the same day, then prepare the papers buyers ask for and bring you buyers we have already met, through to registration.",
    whatsapp: "Hi Shree Giriraj, I want to sell my ___ BHK flat in ___ (building ___, floor ___). What is a fair listing price?",
    button: "Get a free price opinion",
    intentKey: "intentSell",
  },
  rentals: {
    heading: "Letting out your flat?",
    body: "We find a verified tenant, register the leave and licence agreement and file the police verification for you.",
    whatsapp: "Hi Shree Giriraj, I want to rent out my ___ BHK flat in ___.",
    button: "Ask about letting it",
    intentKey: "intentRent",
  },
};

export function offerFor(slug: string): PostOffer | undefined {
  return POST_OFFERS[slug];
}
