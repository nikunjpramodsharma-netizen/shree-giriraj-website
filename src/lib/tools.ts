/**
 * Free tools: /tools/[slug].
 *
 * A registry rather than a one off page, because plan/14-free-tools.md lists
 * six more that share this exact shell: stamp duty and registration, carpet
 * area and loading, interior cost, HRA and rent receipt, BMC property tax, and
 * capital gains. Each of those is metadata plus one component.
 *
 * A tool is not a blog post. A reader arrives wanting a number, and the moment
 * they get it is the only moment they are fully engaged with the cost of
 * buying. That is where the CTA belongs, which is why it sits directly under
 * the calculator rather than in the footer.
 *
 * NEVER GATE A TOOL. No email wall, no signup. Gating destroys the traffic
 * that justified building it.
 */

export type ToolFaq = { q: string; a: string };

export type Tool = {
  slug: string;
  /** Which component renders. Kept as a key so the registry stays data only. */
  component: "emi" | "stampDuty";
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** 40 to 60 words. Must answer the question even if the reader never touches the tool. */
  answer: string;
  intro: string[];
  /** What the tool deliberately does not do. Honesty here builds more trust than features. */
  limits: string[];
  faqs: ToolFaq[];
  /** Slugs of related posts or guides. Rendered only if the target exists. */
  readNext: { label: string; href: string }[];
};

const emiTool: Tool = {
  slug: "home-loan-emi-calculator",
  component: "emi",
  title: "Home loan EMI and cost of buying calculator",
  metaTitle: "Home loan EMI calculator, plus the cash you actually need",
  metaDescription:
    "Work out your EMI, then the part no bank calculator shows: the cash you need before you get the keys, including the costs a home loan will not cover.",
  answer:
    "Your EMI is only half the question. A home loan funds a share of the flat's price, but stamp duty, registration, brokerage and interiors cannot be added to it, so they come out of your own pocket alongside the down payment. This calculator shows both numbers together.",
  intro: [
    "Every bank runs an EMI calculator and they all do the same thing: three inputs, a monthly figure, and an amortisation table. That figure is genuinely useful and it is not the number that stops a purchase.",
    "What stops a purchase is the cash needed on the day. A buyer who has saved a twenty percent down payment often has not counted the stamp duty, the registration, the brokerage or the furnishing, and discovers the gap in the week before registration. A lender has no reason to mention it. We do.",
  ],
  limits: [
    "It is an estimate for planning, not a quotation and not an offer of credit.",
    "Your actual rate and eligibility are set by your lender, after checking your credit history, age and the property itself.",
    "Stamp duty and registration are set by the state and change. Set the rate that applies to you rather than trusting the default.",
    "It assumes a normal reducing balance loan with a fixed rate. A floating rate will move, and an under construction purchase disburses in stages, which changes the early payments.",
  ],
  faqs: [
    {
      q: "Can stamp duty be included in a home loan?",
      a: "Generally no. Lenders fund a share of the property's agreement value, and stamp duty and registration sit outside it. That is why they have to be budgeted as cash, and it is the most common reason a buyer is short at the last moment.",
    },
    {
      q: "How much down payment do I need?",
      a: "Lenders fund a proportion of the value rather than all of it, so the rest is yours to find. The practical number to plan around is not the down payment alone but the down payment plus every cost the loan will not cover.",
    },
    {
      q: "Is it better to reduce the EMI or the tenure when I prepay?",
      a: "Reducing the tenure saves more interest, because the interest is charged on the outstanding balance for fewer months. Reducing the EMI gives you more monthly room. The prepayment tab here models the tenure reduction.",
    },
    {
      q: "Why is so much of my early EMI going to interest?",
      a: "Interest is charged on the balance outstanding, and the balance is at its largest at the start. In the first year of a twenty year loan the large majority of each instalment is interest, and the ratio only reverses in the later years. The year by year tab shows this on your own numbers.",
    },
  ],
  readNext: [
    {
      label: "Property paperwork in Maharashtra",
      href: "/guides/property-paperwork-maharashtra",
    },
    { label: "Talk to us about a specific flat", href: "/contact" },
  ],
};

const stampDutyTool: Tool = {
  slug: "stamp-duty-calculator-mumbai",
  component: "stampDuty",
  title: "Stamp duty and registration calculator, Mumbai",
  metaTitle: "Stamp duty calculator Mumbai: duty, metro cess and registration",
  metaDescription:
    "Work out stamp duty and registration on a Mumbai flat, on the ready reckoner value where that is higher, with the metro cess shown separately.",
  answer:
    "Stamp duty in Mumbai is 6 percent of the chargeable value for a male buyer and 5 percent for a female buyer in sole name, both including the 1 percent metro cess. Registration is 1 percent capped at 30,000 rupees. Duty is charged on the agreement value or the ready reckoner value, whichever is higher.",
  intro: [
    "National calculators handle Maharashtra badly, because they treat stamp duty as one number per state. Mumbai is not one number: the metro cess sits on top of the base rate, a woman buying in her sole name pays a point less, and the value the duty is charged on is often not the price you negotiated.",
    "That last point catches more buyers than anything else. If the ready reckoner rate for the building is above your agreed price, duty is charged on the reckoner rate. The saving you negotiated does not reduce the tax.",
    "Where the sources genuinely disagree, which is joint ownership by a man and a woman, this shows a range instead of inventing a figure. Budget for the top of it.",
  ],
  limits: [
    "Mumbai only, inside the BMC area. Pune, Thane and Nagpur add a local body tax and rural rates are lower.",
    "Rates were cross checked against three sources and are dated on the page. They change, so confirm before you budget on them.",
    "It does not cover gift, lease, mortgage or commercial instruments, which are charged differently.",
    "It is an estimate for planning, not a valuation and not a quotation.",
  ],
  faqs: [
    {
      q: "Is stamp duty calculated on the agreement value or the ready reckoner rate?",
      a: "On whichever is higher. If a flat sells below the government valuation for the area, duty is still charged on that valuation, so buying cheaply does not reduce the duty.",
    },
    {
      q: "How much stamp duty does a woman pay in Mumbai?",
      a: "One percentage point less than a male buyer, so 5 percent against 6 percent, on a residential property held in her sole name. Adding a male co owner removes the concession.",
    },
    {
      q: "What is the metro cess?",
      a: "A 1 percent levy on top of the base stamp duty, used to fund the metro rail. It is why the headline figure in Mumbai is 6 percent rather than the 5 percent base rate.",
    },
    {
      q: "Can stamp duty be paid from the home loan?",
      a: "Generally no. Lenders fund a share of the agreement value, and stamp duty and registration sit outside it, so both have to be found in cash on top of the down payment.",
    },
  ],
  readNext: [
    { label: "Property paperwork in Maharashtra", href: "/guides/property-paperwork-maharashtra" },
    { label: "Home loan EMI and cost of buying", href: "/tools/home-loan-emi-calculator" },
    { label: "Talk to us about a specific flat", href: "/contact" },
  ],
};

export const TOOLS: Tool[] = [stampDutyTool, emiTool];

export const TOOL_SLUGS = TOOLS.map((t) => t.slug);

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
