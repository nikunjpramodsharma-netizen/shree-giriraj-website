/**
 * Who each calculator is for, one line each, and the short questions for the
 * /tools hub. Kept apart from tools.ts so the hub copy can change without
 * touching the registry.
 */

export const TOOL_AUDIENCE: Record<string, string> = {
  "property-valuation-calculator-mumbai": "For owners in Borivali, Kandivali and Malad who want to know what their flat would ask before they list it.",
  "stamp-duty-calculator-mumbai": "For anyone buying a flat in Mumbai who wants the cash needed for duty and registration.",
  "carpet-area-calculator": "For buyers comparing listings who want the area they can actually use.",
  "bmc-property-tax-calculator": "For owners and buyers in Mumbai checking whether the 500 sq ft exemption applies.",
  "rental-yield-calculator": "For investors and owners weighing what a flat really earns as rent.",
  "home-loan-emi-calculator": "For first time and upgrading buyers planning the EMI and the cash on the day.",
  "capital-gains-calculator-property": "For owners planning to sell who want to see the tax before they list.",
  "hra-calculator-rent-receipts": "For salaried tenants claiming HRA who need the exemption and the rent receipts.",
  "interior-scope-builder": "For new owners about to brief designers who want quotes they can compare.",
  "rent-agreement-stamp-duty-calculator-mumbai": "For landlords and tenants in Mumbai who want the full cost of registering a rent agreement.",
};

export const TOOLS_HUB_FAQS: { q: string; a: string }[] = [
  {
    q: "How is stamp duty calculated in Mumbai?",
    a: "As of November 2026, stamp duty in Mumbai is 6 percent for a male buyer and 5 percent for a woman buying in her sole name, both including the 1 percent metro cess. It is charged on the agreement value or the ready reckoner value, whichever is higher. Registration is 1 percent, capped at 30,000 rupees. The stamp duty calculator works it out for your flat.",
  },
  {
    q: "How do I calculate carpet area from super built up area?",
    a: "Divide the super built up area by one plus the loading. A 1,400 sq ft flat at 40 percent loading has 1,000 sq ft of carpet. The carpet area calculator also converts carpet to built up and super built up, and shows the real rate per carpet foot.",
  },
  {
    q: "How much EMI is there on a 50 lakh home loan?",
    a: "At 8.5 percent, the EMI on a 50 lakh rupee loan is about 43,400 rupees a month over 20 years, 49,200 over 15 years and 40,300 over 25 years. The rate is an illustration, so enter your bank's rate in the home loan EMI calculator. It also shows the cash you need on top of the loan.",
  },
  {
    q: "Is there BMC property tax on a flat of 500 sq ft?",
    a: "No. A home with a carpet area of 500 sq ft or less has been exempt from BMC property tax since 1 January 2022. For a larger flat, the BMC property tax calculator works out the tax on MCGM's own formula.",
  },
  {
    q: "How much does it cost to register a rent agreement in Mumbai?",
    a: "Stamp duty on a leave and licence agreement is 0.25 percent of the rent for the term plus deposit interest, with a minimum of 100 rupees. Registration is 1,000 rupees in an urban area, plus a 300 rupee handling charge. The rent agreement calculator adds it up.",
  },
  {
    q: "What do these calculators cover?",
    a: "The numbers around buying, owning, renting and selling a flat in Mumbai: stamp duty, rent agreement costs, carpet area, property tax, rental yield, home loan EMI, capital gains, HRA and an interior scope. Each page says what it covers and what it leaves out.",
  },
  {
    q: "Are the calculators free?",
    a: "Yes. They are free, with no signup and no email. Nothing sits behind a form, and you can copy the link to a result for some of them.",
  },
  {
    q: "How do I get a figure checked?",
    a: "Tap the WhatsApp button under any result and your inputs go into the message. We reply the same day, free and with no obligation. For tax questions, a chartered accountant should confirm the final figure.",
  },
];
