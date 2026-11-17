/**
 * The step after the number. Each tool serves one reader (buyer, seller or
 * renter), so each gets one warm, no obligation offer for that reader and the
 * pages that follow from it. Paths are English only (/areas, /tools, /blog),
 * so they are rendered with the plain Next link. The service pages are the
 * only locale aware paths here and the tool pages are English, so they are
 * plain links too.
 */

export type ToolNextStep = {
  heading: string;
  body: string;
  button: string;
  message: string;
  links: { label: string; href: string }[];
};

const BUY_LINKS = [
  { label: "Flats for sale in Borivali West", href: "/areas/borivali-west/flats-for-sale" },
  { label: "Flats for sale in Kandivali", href: "/areas/kandivali/flats-for-sale" },
  { label: "Flats for sale in Malad", href: "/areas/malad/flats-for-sale" },
];

const SELL_LINKS = [
  { label: "Sell your flat with us", href: "/services/resale-flats" },
  { label: "Flats for sale in Borivali West", href: "/areas/borivali-west/flats-for-sale" },
];

const RENT_LINKS = [
  { label: "Flats for rent in Borivali West", href: "/areas/borivali-west/flats-for-rent" },
  { label: "Flats for rent in Kandivali", href: "/areas/kandivali/flats-for-rent" },
  { label: "Flats for rent in Malad", href: "/areas/malad/flats-for-rent" },
];

const BUYER = (heading: string, body: string): ToolNextStep => ({
  heading,
  body,
  button: "Get a shortlist on WhatsApp",
  message:
    "Hi Shree Giriraj, I am looking to buy a flat in ___ (Borivali, Kandivali or Malad). Size ___, budget ___, preferred pocket ___. Please send the flats that fit.",
  links: BUY_LINKS,
});

const SELLER = (heading: string, body: string): ToolNextStep => ({
  heading,
  body,
  button: "Ask for a fair price opinion",
  message:
    "Hi Shree Giriraj, I am thinking of selling my flat in ___ (society ___, size ___). Please tell me a fair listing price and what the papers need first.",
  links: SELL_LINKS,
});

const RENTER = (heading: string, body: string): ToolNextStep => ({
  heading,
  body,
  button: "Find a flat on rent",
  message:
    "Hi Shree Giriraj, I am looking for a flat on rent in ___ (Borivali, Kandivali or Malad). Budget ___, size ___. Please send the flats that fit.",
  links: RENT_LINKS,
});

export const TOOL_NEXT_STEP: Record<string, ToolNextStep> = {
  "property-valuation-calculator-mumbai": SELLER(
    "Ready to sell? We find the buyer and line up the papers",
    "Tell us the society, size and floor. We reply with recent registered sales near your building and a fair listing price, then bring buyers we have already checked. Buying your next flat too? We shortlist that in the same chat. Free, with no obligation.",
  ),
  "stamp-duty-calculator-mumbai": BUYER(
    "Know the cash? Now see the flats that fit it",
    "Tell us your size, budget and pocket on WhatsApp and we send the flats that fit, usually the same day, with the duty and registration worked out for each. Free, with no obligation.",
  ),
  "carpet-area-calculator": BUYER(
    "Comparing flats? We check the carpet area for you",
    "Send us the size, budget and pocket you have in mind and we shortlist flats with the carpet area read from the agreement or the RERA record, usually the same day. Free, with no obligation.",
  ),
  "home-loan-emi-calculator": BUYER(
    "Know your EMI? Now see the flats that suit it",
    "Send your budget and the EMI you are comfortable with on WhatsApp. We send the flats in Borivali, Kandivali and Malad that fit, usually the same day, with the cash needed on top of the loan for each. Free, with no obligation.",
  ),
  "rental-yield-calculator": BUYER(
    "Buying to let? We find the flat and the tenant",
    "Tell us your budget and the pocket you prefer. We shortlist flats that let well in Borivali, Kandivali and Malad, and we can find the tenant afterwards. Free, with no obligation.",
  ),
  "interior-scope-builder": BUYER(
    "Still choosing the flat? Start with the right one",
    "Send us your size, budget and pocket on WhatsApp and we send the flats that fit, usually the same day. Once you have the keys, we can take this scope to interior quotes. Free, with no obligation.",
  ),
  "bmc-property-tax-calculator": SELLER(
    "Selling or buying a flat? We line up the paperwork",
    "Selling a flat? Tell us the society, size and floor, and we tell you a fair listing price and what the file needs first, such as the last paid property tax receipt. Buying? The same message gets you a shortlist. Free, with no obligation.",
  ),
  "capital-gains-calculator-property": SELLER(
    "Selling this flat? We find the buyer",
    "Tell us the society, size and floor and we give you a fair listing price, then find buyers we have already checked and line up the paperwork. Free, with no obligation.",
  ),
  "hra-calculator-rent-receipts": RENTER(
    "Looking for a flat on rent? Tell us your budget",
    "Send your budget, size and pocket on WhatsApp and we send the rental flats that fit, usually the same day, with the deposit and the rent agreement cost explained. Free, with no obligation.",
  ),
  "rent-agreement-stamp-duty-calculator-mumbai": RENTER(
    "Need a flat, or a tenant? Message us",
    "Tenants: send your budget, size and pocket and we send flats that fit. Landlords: tell us about your flat and we find a tenant and register the agreement. Free to ask, with no obligation.",
  ),
};
