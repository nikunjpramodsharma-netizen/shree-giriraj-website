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
    body: "We get the Board's NOC for rent for MHADA flats anywhere in Mumbai, and in Borivali, Kandivali and Malad we also find the tenant and register the agreement.",
    whatsapp:
      "Hi Shree Giriraj, I want to rent out my MHADA flat in ___. Can you help with the NOC and finding a tenant?",
    button: "Ask about renting it out",
    intentKey: "intentRent",
  },
  "can-we-sell-mhada-flat": {
    heading: "Planning to sell your MHADA flat?",
    body: "We prepare the permission file for the Board and the society for MHADA flats anywhere in Mumbai, and in Borivali, Kandivali and Malad we also find the buyer.",
    whatsapp:
      "Hi Shree Giriraj, I want to sell my MHADA flat in ___. Can you help with the permissions and finding a buyer?",
    button: "Ask about selling it",
    intentKey: "intentSell",
  },
  "mhada-transfer-on-death": {
    heading: "Need the flat transferred into your name?",
    body: "We put together the file the Estate Manager asks for and follow it through with the Board until the tenement is in your name, for flats anywhere in Mumbai.",
    whatsapp:
      "Hi Shree Giriraj, I need help transferring a MHADA flat into my name after a death in the family. The flat is in ___.",
    button: "Ask about the transfer",
    intentKey: "intentMhada",
  },
  "how-to-buy-mhada-flat-in-resale": {
    heading: "Looking to buy a MHADA flat?",
    body: "We check the allotment, the five years and the permissions before you pay a token, and share MHADA resale flats in Borivali, Kandivali and Malad that fit your budget.",
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
    body: "We prepare the file against the Board's own list, take it to the right Estate Manager and follow it through, for MHADA flats anywhere in Mumbai.",
    whatsapp:
      "Hi Shree Giriraj, I need help with MHADA paperwork for my flat in ___. It is for a ___ (transfer, NOC for rent or NOC for sale).",
    button: "Ask us to handle it",
    intentKey: "intentMhada",
  },
  "mhada-noc-online": {
    heading: "Want the NOC handled for you?",
    body: "We prepare the application and the file, apply through the right route and follow it until the certificate is issued, for MHADA flats anywhere in Mumbai.",
    whatsapp:
      "Hi Shree Giriraj, I need a MHADA NOC for ___ for my flat in ___.",
    button: "Ask about your NOC",
    intentKey: "intentMhada",
  },

  // Paperwork. These readers are usually in the middle of a purchase or a
  // sale, so the offer is the check or the step the post explains, done for
  // them as part of the deal. Never a standalone document service.
  "igr-maharashtra-explained": {
    heading: "Buying or selling a flat?",
    body: "We search the registered record on the flat before you pay a token, and walk you through stamp duty and registration in rupees.",
    whatsapp:
      "Hi Shree Giriraj, I am planning to buy a flat in ___. Can you help with the checks and registration?",
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
    body: "We pull Index 2 and the rest of the registered record for you, find the buyer and keep the paperwork moving until the sale is registered.",
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
    body: "We check the OC and the rest of the building's papers before you pay or take the keys, and share flats in Borivali, Kandivali and Malad that already have theirs.",
    whatsapp:
      "Hi Shree Giriraj, I am buying a flat in ___ and would like the OC and the papers checked.",
    button: "Get the papers checked",
    intentKey: "intentBuy",
  },
  "ready-reckoner-rate-mumbai": {
    heading: "Agreeing a price on a flat?",
    body: "We work out the stamp duty on both the agreed price and the reckoner value before you commit, so you know the full cost up front.",
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
    heading: "Buying or selling a flat?",
    body: "We check the BMC tax record and the other dues on the flat as part of every purchase, so everything is settled when it changes hands.",
    whatsapp:
      "Hi Shree Giriraj, I am buying a flat in ___ and would like the dues and the paperwork checked.",
    button: "Ask about your flat",
    intentKey: "intentBuy",
  },

  // Buying and renting.
  "carpet-area-vs-built-up-area": {
    heading: "Comparing flats?",
    body: "We check the carpet area on the flats you shortlist and work out the rate per usable square foot, so you compare like with like.",
    whatsapp:
      "Hi Shree Giriraj, I am looking for a flat in ___. My budget is about ___.",
    button: "Get flats that fit",
    intentKey: "intentBuy",
  },
  "rent-deposit-months-western-suburbs": {
    heading: "Looking for a flat to rent?",
    body: "We find owner verified flats in Borivali, Kandivali and Malad, put the deposit and its refund date in writing and register the leave and licence agreement for you.",
    whatsapp:
      "Hi Shree Giriraj, I am looking for a ___ BHK to rent in ___. My budget is about ___ a month.",
    button: "Find flats to rent",
    intentKey: "intentRent",
  },
  "under-construction-vs-ready-to-move-flat": {
    heading: "Deciding between new and ready?",
    body: "We share new launches and ready flats in Borivali, Kandivali and Malad side by side, with the MahaRERA details and the paperwork checked.",
    whatsapp:
      "Hi Shree Giriraj, I am deciding between a new launch and a ready flat in ___. My budget is about ___.",
    button: "Compare your options",
    intentKey: "intentNewProject",
  },
  "choosing-an-interior-designer-in-borivali": {
    heading: "Planning interiors for your flat?",
    body: "We give you an itemised estimate before work starts and take care of the society's permission, with design and execution under one roof.",
    whatsapp:
      "Hi Shree Giriraj, I am planning interiors for my flat in ___. Can you share an estimate?",
    button: "Ask for an estimate",
  },

  // Investing. The firm advises on flats and shops it can show; it does not
  // sell REIT units or fractional shares, so those readers are offered the
  // direct route the posts compare against.
  "commercial-property-investment-mumbai": {
    heading: "Looking at a shop or office?",
    body: "We find shops and offices in Borivali, Kandivali and Malad and check the approved use, society rules and frontage before you commit.",
    whatsapp:
      "Hi Shree Giriraj, I am looking for a shop or office in ___. My budget is about ___.",
    button: "Find shops and offices",
    intentKey: "intentInvest",
  },
  "best-area-to-invest-in-mumbai": {
    heading: "Weighing up where to invest?",
    body: "We compare pockets in Borivali, Kandivali and Malad on rent, tenants and resale, and work out the yield on the flats you shortlist.",
    whatsapp:
      "Hi Shree Giriraj, I want to invest in a flat in ___. My budget is about ___.",
    button: "Talk about investing",
    intentKey: "intentInvest",
  },
  "how-to-invest-in-real-estate-india": {
    heading: "Thinking of buying to invest?",
    body: "We help first investors choose the pocket and the flat, work out the real yield and check the title before you commit.",
    whatsapp:
      "Hi Shree Giriraj, I want to invest in a flat in ___. My budget is about ___.",
    button: "Talk about investing",
    intentKey: "intentInvest",
  },
  "fractional-ownership-real-estate-india": {
    heading: "Prefer a flat you own outright?",
    body: "We help investors find flats in Borivali, Kandivali and Malad that let well, with the rent and the yield worked out before you buy.",
    whatsapp:
      "Hi Shree Giriraj, I want to invest in a flat in ___. My budget is about ___.",
    button: "Talk about investing",
    intentKey: "intentInvest",
  },
  "reit-vs-buying-a-flat-india": {
    heading: "Leaning towards a flat?",
    body: "We help you find a flat in Borivali, Kandivali or Malad that lets well, with the rent and the yield worked out before you decide.",
    whatsapp:
      "Hi Shree Giriraj, I want to invest in a flat in ___. My budget is about ___.",
    button: "Talk about investing",
    intentKey: "intentInvest",
  },
  "rental-income-property-mumbai": {
    heading: "Buying a flat to let?",
    body: "We match the flat to the tenant pool in each pocket, work out the net yield, and find your first tenant once you own it.",
    whatsapp:
      "Hi Shree Giriraj, I want to buy a flat to let in ___. My budget is about ___.",
    button: "Talk about buying to let",
    intentKey: "intentInvest",
  },
  "rental-yield-mumbai": {
    heading: "Want the yield on a real flat?",
    body: "Send us the flat you are looking at and we will work out its gross and net yield using local rents for that pocket.",
    whatsapp:
      "Hi Shree Giriraj, I am looking at a flat in ___ as an investment. Can you work out its rental yield?",
    button: "Get the yield worked out",
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
    heading: "Selling a flat instead?",
    body: "We advise on the asking price for your pocket, prepare the papers buyers ask for and bring you serious buyers, through to registration.",
    whatsapp: "Hi Shree Giriraj, I want to sell my ___ BHK flat in ___.",
    button: "Ask about selling",
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
