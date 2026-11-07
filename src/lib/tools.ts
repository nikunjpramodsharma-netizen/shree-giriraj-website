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

import { rentAgreementTool } from "@/lib/tool-rent-agreement";

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
    | "propertyTax"
    | "rentalYield"
    | "rentAgreement";
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** 40 to 60 words. Must answer the question even if the reader never touches the tool. */
  answer: string;
  /** The H2 above the intro, a question that matches how people search. */
  introHeading: string;
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
  metaTitle: "Home loan EMI and total cost calculator",
  metaDescription:
    "Work out your EMI, then the part no bank calculator shows: the cash you need before you get the keys, including the costs a home loan will not cover.",
  answer:
    "Your EMI is only half the question. A home loan funds a share of the flat's price, but stamp duty, registration, brokerage and interiors cannot be added to it, so they come out of your own pocket alongside the down payment. This calculator shows both numbers together.",
  introHeading: "How much cash do I need to buy a flat with a home loan?",
  intro: [
    "A bank calculator gives you the monthly EMI from three inputs. This one gives you that and the cash needed on the day.",
    "The cash covers your down payment, stamp duty, registration, brokerage and furnishing. Seeing the total early lets you plan the purchase with confidence.",
  ],
  limits: [
    "It is an estimate for planning, not a quotation and not an offer of credit.",
    "Your lender sets your actual rate and eligibility after checking your credit history, age and the property.",
    "It assumes a fixed rate reducing balance loan. For a floating rate or an under construction purchase, ask us for a cost sheet.",
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
    {
      q: "What is the EMI on a 30 lakh home loan over 15 years?",
      a: "At 8.5 percent, about 29,500 rupees a month, and about 26,000 over 20 years. The rate is the illustration, not a quote: put your bank's actual rate into the calculator and it shows the EMI, the total interest and the cash you need on top of the loan for stamp duty and registration.",
    },
    {
      q: "How much home loan can I get on a 40,000 rupee salary?",
      a: "Lenders usually cap the EMI at roughly 40 to 50 percent of take home pay, so on 40,000 a month the EMI ceiling is about 16,000 to 20,000. At 8.5 percent over 20 years that supports a loan of roughly 18 to 23 lakh rupees. Each bank applies its own multiplier, so treat this as the range to plan around, not an offer.",
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
  metaTitle: "Stamp duty calculator Maharashtra, Mumbai",
  metaDescription:
    "Work out stamp duty and registration on a Mumbai flat, on the ready reckoner value where that is higher, with the metro cess shown separately.",
  answer:
    "Stamp duty in Mumbai is 6 percent of the chargeable value for a male buyer and 5 percent for a female buyer in sole name, both including the 1 percent metro cess. Registration is 1 percent capped at 30,000 rupees. Duty is charged on the agreement value or the ready reckoner value, whichever is higher.",
  introHeading: "How is stamp duty calculated in Mumbai?",
  intro: [
    "Mumbai stamp duty has three parts: the base rate, the 1 percent metro cess, and the value the duty is charged on. A woman buying in her sole name pays a point less.",
    "If the ready reckoner value is above your agreed price, duty is charged on the reckoner value, so check it before you agree a price.",
    "A man and a woman buying jointly pay 6 percent, the same as a male buyer, because the women's concession applies only where women are the only purchasers.",
  ],
  limits: [
    "This tool covers Mumbai inside the BMC area. For Pune, Thane or Nagpur, ask us.",
    "Rates were cross checked against four sources and are dated on the page. Confirm them before you budget.",
    "It does not cover gift, lease, mortgage or commercial instruments.",
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
    {
      q: "What are the stamp duty rates in Maharashtra for 2026?",
      a: "In Mumbai, 6 percent for a male buyer and 5 percent for a woman holding in her sole name, both including the 1 percent metro cess, plus registration at 1 percent capped at 30,000 rupees. Rates elsewhere in the state differ by municipal area, and this calculator is Mumbai only. Check the year on the reckoner statement, because the values it applies to change every 1 April.",
    },
    {
      q: "Stamp duty for women in Maharashtra",
      a: "For a residential property in Mumbai held in a woman's sole name, the duty is 5 percent including the metro cess, against 6 percent for a man. On ₹1 crore that is ₹1 lakh less. The concession comes from the Maharashtra government order of 31 March 2021. It applies only where women are the only purchasers, so a male co owner brings the rate back to 6 percent.",
    },
    {
      q: "Agreement value or ready reckoner value?",
      a: "Duty is charged on whichever is higher. If the ready reckoner value for your flat is above the price you agreed, the reckoner value is the one used. Enter it in the calculator and the result switches to it. You can look it up under e-ASR on the IGR portal.",
    },
    {
      q: "Can stamp duty be reduced legally?",
      a: "The rates are fixed by the state, so the reduction on offer is the women's concession: 5 percent instead of 6 for a residential flat in a woman's sole name. Registration is already capped at ₹30,000. Paying a lower price than the ready reckoner value does not lower the duty, because the higher value is used. If you are unsure which category applies to you, ask us before you sign.",
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
  metaTitle: "Carpet area calculator: built up and super",
  metaDescription:
    "Start from carpet, built up or super built up and see the other two in sq ft and sq m, with the real rate per carpet foot.",
  answer:
    "Carpet area is the usable floor space inside a flat. Super built up adds your share of lobbies, lifts and amenities, and it is the figure prices are quoted against. Loading is the gap, taken on the carpet area, so carpet equals super built up divided by one plus the loading.",
  introHeading: "What is the difference between carpet area and super built up area?",
  intro: [
    "Every flat has three areas: carpet, built up and super built up. You pay on super built up and you live on carpet.",
    "In Mumbai the gap between them is commonly 40 to 50 percent. Two flats at the same rate can therefore give you very different homes.",
    "This tool starts from whichever area you know, carpet, built up or super built up, and shows the other two. It then compares two flats on the rate per carpet foot, which is the figure you can compare fairly.",
  ],
  limits: [
    "It works from the loading figure you enter. If you do not know it, ask for the carpet area in writing: under RERA it has to be stated in the agreement for a registered project.",
    "Built up area is approximate, because the allowance for walls and balcony varies. It is an input here.",
    "It shows how your loading compares with what is normal. What the loading buys you in amenities is your call, and we are happy to talk it through.",
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
    {
      q: "How do I calculate carpet area from built up area?",
      a: "Built up area is carpet plus the external walls and usually the balcony, typically 10 to 15 percent more. So divide the built up figure by 1.10 to 1.15 for an estimate of carpet. Built up has no statutory definition, so for a resale flat the reliable number is the carpet area in the original agreement, or a measurement.",
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
  metaTitle: "HRA calculator and rent receipt generator",
  metaDescription:
    "Work out your HRA exemption on the least of three rule, then print rent receipts for the financial year. Nothing is stored or sent anywhere.",
  answer:
    "HRA exemption is the least of three figures: the HRA you actually receive, the rent you pay less 10 percent of basic pay, and 50 percent of basic pay in a metro such as Mumbai. It is available only under the old tax regime.",
  introHeading: "How is HRA exemption calculated?",
  intro: [
    "HRA exemption is the least of three figures, and this tool works it out for you. It then makes the rent receipts you need to claim it.",
    "The receipts are generated and printed in your browser. Nothing is stored or emailed, and no account is needed. Your name, your landlord's name and their PAN stay with you.",
  ],
  limits: [
    "HRA exemption applies only under the old tax regime.",
    "Salary here means basic pay plus dearness allowance forming part of retirement benefits, not gross pay.",
    "Your landlord's PAN is required once annual rent passes one lakh.",
    "It is an estimate to help you plan and produce paperwork. For tax advice, ask your employer or chartered accountant.",
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
    {
      q: "Is HRA exemption 50 percent of basic salary?",
      a: "Not on its own. Fifty percent of basic pay plus DA is one of three limbs, and the exemption is the smallest of the three: that figure, the HRA actually received, and rent paid less 10 percent of basic. In a metro such as Mumbai the limb is 50 percent; elsewhere it is 40. The calculator works all three and shows which one binds.",
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
  metaTitle: "Interior cost and scope planner, Mumbai",
  metaDescription:
    "Build a scope in quantities for your flat, then take it to three designers and get back quotes that can actually be compared against each other.",
  answer:
    "A quote you can judge has three things in it: quantities, specifications and exclusions. Twelve running feet of wardrobe in a named board, not bedroom wardrobes. This builds that list for your flat so the quotes you get back are comparable.",
  introHeading: "How do I plan the scope and cost of my flat's interiors?",
  intro: [
    "A quote you can judge lists quantities, specifications and exclusions. This tool builds that list for your flat.",
    "Take the same list to three designers and the quotes that come back can be laid side by side.",
    "There are no prices on it. Ask us what these quantities cost in Borivali right now and you will get a real answer for your flat.",
  ],
  limits: [
    "It produces a scope, not a quotation. A designer who has seen the flat can price it.",
    "Quantities are your estimate until somebody measures, so treat them as a brief.",
    "It does not cover structural work. For that, ask us.",
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
    {
      q: "How do I write a scope for an interior quote?",
      a: "Room by room, in quantities: running feet of wardrobe and kitchen, square feet of false ceiling and painting, counts of units and points, with a named material against each. That is what this tool produces. A quote given against that scope can be compared with another; a lump sum for the whole flat cannot.",
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
  metaTitle: "Capital gains calculator for property sale",
  metaDescription:
    "Work out long term capital gains on a property sale, and compare 12.5 percent without indexation against 20 percent with it where you have the choice.",
  answer:
    "Property held more than 24 months is a long term capital asset. Gains are taxed at 12.5 percent without indexation. If you are a resident individual or HUF who bought before 23 July 2024, you may instead pay 20 percent with indexation, whichever is lower.",
  introHeading: "How is capital gains tax calculated on a property sale?",
  intro: [
    "The rules changed on 23 July 2024. If you bought before that date you can take 12.5 percent without indexation, or 20 percent with indexation.",
    "Which is cheaper depends on how much inflation ran over your holding period. This tool shows both and names the cheaper one.",
  ],
  limits: [
    "This tool covers long term gains on a property sale. Confirm any figure with a chartered accountant before filing.",
    "Short term gains are taxed at your slab rate, so they are reported as a gain rather than a tax figure.",
    "The cost inflation index is filled in from the official table for the years of your dates, and you can overwrite it.",
    "Reliefs under sections 54 and 54EC are listed but not computed, because each has its own conditions and time limits.",
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
    {
      q: "Is capital gains tax on property 12.5 percent or 20 percent?",
      a: "For a property held more than 24 months, 12.5 percent without indexation. If you are a resident individual or HUF and bought before 23 July 2024, you may instead pay 20 percent with indexation, whichever is lower. Anything bought after that date has only the 12.5 percent option. The calculator shows both where the choice exists.",
    },
    {
      q: "How much tax do I pay when I sell my flat in India?",
      a: "It depends on the gain, not the price: sale price less the indexed or unindexed cost, improvements and transfer expenses. On a long term gain the tax is 12.5 percent of that figure, or 20 percent with indexation where the choice still applies. Reliefs under sections 54 and 54EC can reduce or remove it if the conditions are met.",
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
  metaTitle: "BMC property tax calculator, Mumbai",
  metaDescription:
    "Work out the capital value of a Mumbai flat and check whether the 500 sq ft carpet area exemption applies to you.",
  answer:
    "BMC property tax is charged on capital value, which is the ready reckoner rate times the carpet area times weights for construction type, age and use. Residential flats with a carpet area of 500 sq ft or less have been fully exempt from BMC property tax since 1 January 2022.",
  introHeading: "Do I have to pay BMC property tax on my flat?",
  intro: [
    "A residential flat with a carpet area of 500 sq ft or less pays no BMC property tax. In Borivali, Kandivali and Malad many flats sit under that line.",
    "So the exemption check comes first here and the capital value calculation comes second.",
  ],
  limits: [
    "The tax rate varies by ward and category. Enter the rate from your own bill for a rupee figure, or leave it blank for capital value only.",
    "It is an estimate, and the bill issued by the BMC is the authority.",
    "The size relief is for residential use only.",
    "Some reports describe a concession between 500 and 700 sq ft. It is flagged but never applied to the figures.",
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
    {
      q: "How do I calculate property tax in Mumbai?",
      a: "The BMC charges on capital value: the ready reckoner rate for the building multiplied by the carpet area and by weights for the type of construction and the age of the building, with the tax rate applied to that value. A residential flat of up to 500 square feet carpet has paid nothing since 1 January 2022. The calculator applies the published weights and shows each step.",
    },
  ],
  readNext: [
    { label: "Carpet area and loading", href: "/tools/carpet-area-calculator" },
    { label: "Property paperwork in Maharashtra", href: "/guides/property-paperwork-maharashtra" },
  ],
};

/**
 * The largest single opportunity in the investment cluster, and the reason it
 * is a tool rather than another article: "rental yield calculator" runs about
 * 1,900 searches a month in India at low competition, measured on
 * 8 September 2026, against 260 for the best keyword the advisory page itself
 * can target. People want the number, not the essay.
 *
 * It carries no benchmark and no verdict, deliberately. See src/lib/yield.ts.
 */
const rentalYieldTool: Tool = {
  slug: "rental-yield-calculator",
  component: "rentalYield",
  title: "Rental yield calculator",
  metaTitle: "Rental yield calculator: gross and net",
  metaDescription:
    "Work out the gross and net rental yield on a flat, after maintenance, property tax and vacancy, counting the stamp duty and brokerage you paid.",
  answer:
    "Gross rental yield is annual rent divided by the purchase price. Net yield divides income after society maintenance, property tax, repairs and vacancy by the price plus stamp duty, registration, brokerage and fit out. Net is the figure that matters, and on an Indian flat it is usually well below gross.",
  introHeading: "How do I work out the rental yield on a flat?",
  intro: [
    "Gross yield is annual rent divided by the price. Net yield also counts society maintenance, property tax, repairs and vacancy.",
    "It counts stamp duty, registration, brokerage and fit out as part of what you put in. This tool shows gross and net together, with the gap as its own figure.",
    "The second mode runs the question backwards. Enter the return you need and it shows the monthly rent that would reach it.",
  ],
  limits: [
    "It carries no benchmark, because yields vary by building, floor and pocket.",
    "Net income here is before income tax and before any loan.",
    "Payback is measured on rent alone, so resale is not included.",
    "It is a planning tool, not a valuation and not investment advice.",
  ],
  faqs: [
    {
      q: "What is a good rental yield in Mumbai?",
      a: "We do not publish a benchmark for Mumbai or for Borivali, Kandivali and Malad, because yields vary by building, floor and pocket. What a yield should be depends on what you paid and what else you could do with the money. Work out the net figure for the specific flat and judge it against your own alternatives. Tell us the society name and we will send the rent range from recent lettings.",
    },
    {
      q: "What is the difference between gross and net rental yield?",
      a: "Gross yield is annual rent divided by the purchase price, with nothing taken off. Net yield takes society maintenance, property tax, repairs and expected vacancy off the rent, and adds stamp duty, registration, brokerage and fit out to the capital. Net is what the flat actually pays you.",
    },
    {
      q: "How do I calculate rental yield on a flat?",
      a: "For gross yield, multiply the monthly rent by twelve and divide by the purchase price, then multiply by a hundred. For net yield, subtract a year of maintenance, property tax and repairs from the rent you expect to collect, then divide by the price plus all your buying costs.",
    },
    {
      q: "Should stamp duty be included in a rental yield calculation?",
      a: "In the net figure, yes. Stamp duty and registration in Mumbai run to several percent of the price and are paid in cash on top of it. That money is committed to the investment and cannot earn anywhere else, so leaving it out of the capital overstates the return.",
    },
    {
      q: "Does rental yield tell me whether a property is a good investment?",
      a: "Only half of it. Yield measures the income while you hold the flat. The other half is what the resale market gives you when you sell, which nobody can calculate in advance. A property can have a modest yield and still work, or a strong yield and be hard to sell.",
    },
  ],
  readNext: [
    { label: "Property investment advisory", href: "/services/investment-advisory" },
    { label: "Stamp duty and registration calculator", href: "/tools/stamp-duty-calculator-mumbai" },
    { label: "Carpet area and loading", href: "/tools/carpet-area-calculator" },
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
  rentalYieldTool,
  rentAgreementTool,
];

export const TOOL_SLUGS = TOOLS.map((t) => t.slug);

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

/** Each tool's own WhatsApp opener, picked up by the floating button through PageWhatsApp. */
export const TOOL_WHATSAPP: Record<string, string> = {
  "stamp-duty-calculator-mumbai":
    "Hi Shree Giriraj, I used your stamp duty calculator. Please send the full cost sheet for a flat I am considering in ___.",
  "carpet-area-calculator":
    "Hi Shree Giriraj, can you confirm the real carpet area of a flat I am looking at in ___?",
  "bmc-property-tax-calculator":
    "Hi Shree Giriraj, can you check the property tax on my flat in ___?",
  "rental-yield-calculator":
    "Hi Shree Giriraj, what rent would a flat in ___ society fetch?",
  "home-loan-emi-calculator":
    "Hi Shree Giriraj, please send a cost sheet for a flat in my budget of ___.",
  "capital-gains-calculator-property":
    "Hi Shree Giriraj, I am planning to sell my flat in ___. What would it fetch?",
  "hra-calculator-rent-receipts":
    "Hi Shree Giriraj, I am looking for a flat on rent in ___, budget ___.",
  "interior-scope-builder":
    "Hi Shree Giriraj, I would like an interior estimate for my flat in ___.",
  "rent-agreement-stamp-duty-calculator-mumbai":
    "Hi Shree Giriraj, I need a registered rent agreement for a flat in ___.",
};
