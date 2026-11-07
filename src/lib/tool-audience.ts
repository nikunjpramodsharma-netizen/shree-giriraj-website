/**
 * Who each calculator is for, one line each, and the short questions for the
 * /tools hub. Kept apart from tools.ts so the hub copy can change without
 * touching the registry.
 */

export const TOOL_AUDIENCE: Record<string, string> = {
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
