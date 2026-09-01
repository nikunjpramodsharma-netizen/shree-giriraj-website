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
  component:
    | "emi"
    | "stampDuty"
    | "area"
    | "hra"
    | "interiors"
    | "capitalGains"
    | "propertyTax";
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

const areaTool: Tool = {
  slug: "carpet-area-calculator",
  component: "area",
  title: "Carpet area and loading calculator",
  metaTitle: "Carpet area calculator: what you actually get for the price",
  metaDescription:
    "Turn a super built up listing into the carpet area you can stand on, see the real rate per usable square foot, and compare two flats properly.",
  answer:
    "Carpet area is the usable floor space inside a flat. Super built up adds your share of lobbies, lifts and amenities, and it is the figure prices are quoted against. Loading is the gap, taken on the carpet area, so carpet equals super built up divided by one plus the loading.",
  intro: [
    "Every flat has three areas and a brochure leads with the largest one. You pay on super built up and you live on carpet, and in Mumbai the gap between them is the widest in India, commonly 40 to 50 percent.",
    "That matters in one specific way people miss. Because the rate is quoted against super built up, two flats at the same rate can give you very different homes, and the cheaper looking one is often the worse buy. A flat at a higher rate with low loading regularly beats one advertised for less with heavy loading.",
    "So this does two things. It turns a listing into the area you can actually stand on, and it compares two flats on the rate per carpet foot, which is the only number that is comparable.",
  ],
  limits: [
    "It works from the loading figure you enter. If you do not know it, ask for the carpet area in writing: under RERA it has to be stated in the agreement for a registered project.",
    "Built up area is approximate, because the allowance for walls and balcony varies. It is an input here rather than a fixed assumption.",
    "It does not tell you whether the loading is fair, only how it compares with what is normal. What the loading buys you, in amenities and common space, is a judgement call.",
  ],
  faqs: [
    {
      q: "How do I calculate carpet area from super built up area?",
      a: "Divide the super built up area by one plus the loading. A 1,400 sq ft flat at 40 percent loading gives 1,000 sq ft of carpet. Taking 40 percent off the super built up figure instead would give 840, which is wrong by 160 sq ft.",
    },
    {
      q: "What is a normal loading percentage?",
      a: "Nationally 25 to 35 percent is described as normal and above 40 percent as high. Mumbai runs the highest loading in India at roughly 40 to 50 percent, so a Mumbai figure that looks high by national standards may be ordinary here.",
    },
    {
      q: "Do builders have to tell me the carpet area?",
      a: "Under RERA a registered project has to declare carpet area and state it in the agreement. Nothing stops a price being advertised against super built up, which is why both numbers keep appearing side by side.",
    },
    {
      q: "Why compare flats on carpet area rather than the quoted rate?",
      a: "Because the quoted rate is per super built up foot, and the share of that you can actually use differs from flat to flat. Dividing the total price by the carpet area gives one number that is comparable across buildings.",
    },
  ],
  readNext: [
    { label: "Stamp duty and registration, Mumbai", href: "/tools/stamp-duty-calculator-mumbai" },
    { label: "Home loan EMI and cost of buying", href: "/tools/home-loan-emi-calculator" },
    { label: "Property paperwork in Maharashtra", href: "/guides/property-paperwork-maharashtra" },
  ],
};

const hraTool: Tool = {
  slug: "hra-calculator-rent-receipts",
  component: "hra",
  title: "HRA exemption calculator and rent receipt generator",
  metaTitle: "HRA calculator and free rent receipt generator",
  metaDescription:
    "Work out your HRA exemption on the least of three rule, then generate and print rent receipts for the financial year. Nothing is stored or sent anywhere.",
  answer:
    "HRA exemption is the least of three figures: the HRA you actually receive, the rent you pay less 10 percent of basic pay, and 50 percent of basic pay in a metro such as Mumbai. It is available only under the old tax regime.",
  intro: [
    "Two jobs on one page, because they are the same errand. You work out what you can claim, then you need the paper to claim it, and most tools do only one of those.",
    "The receipts are generated in your browser and printed from it. Nothing is stored, nothing is emailed, and no account is required. A rent receipt has your name, your landlord's name and their PAN on it, which is not information anybody should have to hand to a website to get a printable form.",
  ],
  limits: [
    "HRA exemption applies only under the old tax regime. On the new regime you cannot claim it at all.",
    "Salary here means basic pay plus dearness allowance forming part of retirement benefits, not gross pay. Using gross is the most common error.",
    "It is an estimate to help you plan and produce paperwork, not tax advice. Your employer and your chartered accountant have the final say.",
    "Your landlord's PAN is required once annual rent passes one lakh, and a receipt without it may be rejected.",
  ],
  faqs: [
    {
      q: "How is HRA exemption calculated?",
      a: "As the least of three figures: the HRA actually received, the rent paid less 10 percent of basic pay plus DA, and 50 percent of that salary in a metro or 40 percent elsewhere. Whichever is smallest is your exemption.",
    },
    {
      q: "Is Mumbai a metro for HRA?",
      a: "Yes. Mumbai, Delhi, Kolkata and Chennai are treated as metros, so the 50 percent limb applies rather than 40 percent.",
    },
    {
      q: "Do I need my landlord's PAN?",
      a: "Once annual rent passes one lakh rupees, yes. If your landlord does not have a PAN, a signed declaration giving their name and address is used instead.",
    },
    {
      q: "Can I claim HRA under the new tax regime?",
      a: "No. The exemption is available only under the old regime, so the calculation is worth doing only if you are on it or comparing the two.",
    },
  ],
  readNext: [
    { label: "Carpet area and loading", href: "/tools/carpet-area-calculator" },
    { label: "Property paperwork in Maharashtra", href: "/guides/property-paperwork-maharashtra" },
    { label: "Talk to us about renting", href: "/contact" },
  ],
};

const interiorsTool: Tool = {
  slug: "interior-scope-builder",
  component: "interiors",
  title: "Interior scope builder",
  metaTitle: "Interior design scope builder: get quotes you can compare",
  metaDescription:
    "Build a scope in quantities for your flat, then take it to three designers and get back quotes that can actually be compared against each other.",
  answer:
    "A quote you can judge has three things in it: quantities, specifications and exclusions. Twelve running feet of wardrobe in a named board, not bedroom wardrobes. This builds that list for your flat so the quotes you get back are comparable.",
  intro: [
    "Most interior quotes arrive as a single number for the whole flat. That number cannot be compared against another single number, because you cannot see what either one contains, and the cheaper one automatically looks better whether it is or not.",
    "The other calculators on this subject give you a price estimate in exchange for your phone number. This gives you a document instead. Take it to three designers and the quotes that come back can be laid side by side.",
    "There are no prices on it, and that is deliberate rather than a gap. We have not published cost bands we can stand behind, and an invented range would anchor you on a number that is not real. Ask us what these quantities cost in Borivali right now and you will get a real answer for your flat.",
  ],
  limits: [
    "It produces a scope, not a quotation. Only a designer who has seen the flat can price it.",
    "Quantities are your estimate until somebody measures. Treat them as a brief, not a contract.",
    "It does not cover structural work, which needs society permission and often an architect.",
  ],
  faqs: [
    {
      q: "Why does this not show me a price?",
      a: "Because we have not published cost bands we can stand behind, and a made up range is worse than none: you would anchor on it and then be surprised. The quantities are the part that protects you, and they are what a designer needs to quote properly.",
    },
    {
      q: "What should an interior quote include?",
      a: "Quantities in running feet, square feet and unit counts, the specification for each item including board and hardware brands, and an explicit list of what is excluded. Without those three a quote cannot be compared with another.",
    },
    {
      q: "How much advance is normal for interior work?",
      a: "Advances are normal, large advances before anything physical arrives on site are not. A payment schedule tied to delivered stages rather than to dates protects both sides: money moves when something arrives or is installed.",
    },
    {
      q: "Do I need society permission for interior work?",
      a: "In most Mumbai societies yes, and the rules on working hours, lift use and debris removal are set locally. Ask before work starts rather than after it is stopped halfway.",
    },
  ],
  readNext: [
    { label: "Carpet area and loading", href: "/tools/carpet-area-calculator" },
    { label: "Talk to us about interiors", href: "/contact" },
  ],
};

const capitalGainsTool: Tool = {
  slug: "capital-gains-calculator-property",
  component: "capitalGains",
  title: "Capital gains calculator for a property sale",
  metaTitle: "Capital gains on property: 12.5% or 20% with indexation",
  metaDescription:
    "Work out long term capital gains on a property sale, and compare 12.5 percent without indexation against 20 percent with it where you still have the choice.",
  answer:
    "Property held more than 24 months is a long term capital asset. Gains are taxed at 12.5 percent without indexation. If you are a resident individual or HUF who bought before 23 July 2024, you may instead pay 20 percent with indexation, whichever is lower.",
  intro: [
    "The rules changed on 23 July 2024, and the change left a choice in place for people who already owned property. If you bought before that date you can take 12.5 percent flat or 20 percent with indexation, and which is cheaper depends entirely on how much inflation ran over your holding period.",
    "Most calculators pick one method and show it. This shows both and names the cheaper one, because on a long held flat the gap between them is real money.",
  ],
  limits: [
    "This is tax and tax is not our trade. Confirm any figure with a chartered accountant before filing on it.",
    "Short term gains are taxed at your slab rate, which depends on your total income, so they are reported as a gain rather than a tax figure.",
    "The cost inflation index is not hardcoded. One wrong value would produce a confidently wrong tax number, so the index for both years is asked for instead.",
    "Reliefs under sections 54 and 54EC are listed but not computed, because each carries conditions and time limits a calculator would misrepresent.",
  ],
  faqs: [
    {
      q: "How long must I hold a property for a long term gain?",
      a: "More than 24 months. At 24 months or less the gain is short term and is added to your income and taxed at your slab rate, which is usually a great deal more.",
    },
    {
      q: "Is indexation still available on property?",
      a: "Only as a grandfathered choice. A resident individual or HUF who acquired the property before 23 July 2024 may choose 20 percent with indexation or 12.5 percent without, whichever gives the lower tax. For anything acquired after that date, only the 12.5 percent option applies.",
    },
    {
      q: "What can I deduct from the sale price?",
      a: "The cost of acquisition, the cost of capital improvements, and expenses incurred wholly for the transfer such as brokerage and legal fees. Repairs and repainting are not improvements.",
    },
    {
      q: "Can I avoid capital gains tax by buying another house?",
      a: "Section 54 provides relief where the gain is reinvested in another residential property within prescribed time limits, and section 54EC covers specified bonds. Both have conditions, so take advice rather than assuming.",
    },
  ],
  readNext: [
    { label: "Stamp duty and registration, Mumbai", href: "/tools/stamp-duty-calculator-mumbai" },
    { label: "Property paperwork in Maharashtra", href: "/guides/property-paperwork-maharashtra" },
  ],
};

const propertyTaxTool: Tool = {
  slug: "bmc-property-tax-calculator",
  component: "propertyTax",
  title: "BMC property tax calculator, Mumbai",
  metaTitle: "BMC property tax calculator: is your flat exempt?",
  metaDescription:
    "Work out the capital value of a Mumbai flat and check whether the 500 sq ft carpet area exemption applies to you.",
  answer:
    "BMC property tax is charged on capital value, which is the ready reckoner rate times the carpet area times weights for construction type, age and use. Residential flats with a carpet area of 500 sq ft or less have been fully exempt from BMC property tax since 1 January 2022.",
  intro: [
    "The exemption is the reason this page exists. A residential flat with a carpet area of 500 sq ft or less pays no BMC property tax at all, and in Borivali, Kandivali and Malad a great many flats sit under that line while their owners have never checked.",
    "That check needs no tax rate and no arithmetic, which is why it comes first here and the calculation comes second.",
  ],
  limits: [
    "The tax rate applied to capital value varies by ward and category, and we have not confirmed a figure we would publish. Enter the rate from your own bill for a rupee figure, or leave it blank for capital value only.",
    "It is an estimate. The bill issued by the BMC is the authority.",
    "The size relief is for residential use. Commercial property does not qualify.",
    "Some reports describe a concession between 500 and 700 sq ft. We could not verify it, so it is flagged but never applied to the figures.",
  ],
  faqs: [
    {
      q: "Is my flat exempt from BMC property tax?",
      a: "Residential flats with a carpet area of 500 sq ft or less have been fully exempt since 1 January 2022. It is measured on carpet area, not super built up, so check the carpet figure in your agreement rather than the area in the listing.",
    },
    {
      q: "How is BMC property tax calculated?",
      a: "On capital value, not rateable value. Capital value is the ready reckoner rate for the locality times the carpet area, times weights for construction type, age of the building and how it is used. The tax is a percentage of that.",
    },
    {
      q: "Does unpaid property tax affect a sale?",
      a: "Yes. Arrears attach to the property rather than the person, so a buyer who does not check inherits them. Ask for the last paid receipt before you pay a token.",
    },
  ],
  readNext: [
    { label: "Carpet area and loading", href: "/tools/carpet-area-calculator" },
    { label: "Property paperwork in Maharashtra", href: "/guides/property-paperwork-maharashtra" },
  ],
};

export const TOOLS: Tool[] = [
  stampDutyTool,
  areaTool,
  hraTool,
  interiorsTool,
  propertyTaxTool,
  capitalGainsTool,
  emiTool,
];

export const TOOL_SLUGS = TOOLS.map((t) => t.slug);

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
