import type { Fact } from "@/components/motion/FactChips";

/**
 * The motion data behind each service page: the three chips that count up
 * under the hero, the numbers strip with its sources, the worked example
 * that does one sum in front of the reader, and the photographs the body
 * scenes alternate with.
 *
 * Every figure is one already sourced on the site (stamp duty and
 * registration from the Maharashtra instruments, RERA sections, the MHADA
 * Mumbai Board schedule, section 55 of the Rent Control Act, the deposit
 * norm confirmed by the owner). The worked examples use round illustrative
 * inputs and say so on the page; they exist to show the arithmetic, not to
 * quote a price.
 */

export type NumberTile = Fact & { source: string };

export type WorkedExample = {
  title: string;
  /** The illustrative input, stated plainly. */
  given: string;
  rows: { label: string; value: number; prefix?: string; suffix?: string; decimals?: number; note?: string }[];
  caption: string;
  /** Path to the full tool, if one exists. */
  tool?: { href: string; label: string };
};

export type ServiceScene = {
  facts: Fact[];
  numbers: NumberTile[];
  example?: WorkedExample;
  images: { src: string; alt: string }[];
  /** Pre written WhatsApp message for the sticky bar and the closing scene. */
  message: string;
};

export const SERVICE_SCENES: Record<string, ServiceScene> = {
  "resale-flats": {
    facts: [
      { value: 6, suffix: "%", label: "stamp duty, male buyer" },
      { value: 5, suffix: "%", label: "stamp duty, woman in sole name" },
      { value: 30000, prefix: "₹", label: "registration, maximum" },
    ],
    numbers: [
      { value: 6, suffix: "%", label: "Stamp duty for a male buyer, including the metro cess", source: "Maharashtra Stamp Act, Article 25(b), plus the 1 percent metro cess" },
      { value: 5, suffix: "%", label: "For a woman buying in her sole name", source: "Revenue Department order of 31 March 2021" },
      { value: 1, suffix: "%", label: "Registration, capped at 30,000 rupees", source: "Department of Registration and Stamps, Table of Fees" },
      { text: "1996", label: "The year we started selling resale flats here", source: "Shree Giriraj Real Estate" },
    ],
    example: {
      title: "What buying a 1.5 crore flat costs at the sub registrar",
      given: "An illustrative agreement value of 1.5 crore rupees, at or above the ready reckoner value.",
      rows: [
        { label: "Stamp duty, male buyer, 6 percent", value: 900000, prefix: "₹" },
        { label: "Stamp duty, woman in her sole name, 5 percent", value: 750000, prefix: "₹" },
        { label: "Registration, 1 percent capped", value: 30000, prefix: "₹" },
      ],
      caption: "Illustrative figures for the arithmetic only. Duty is charged on the higher of the price and the ready reckoner value.",
      tool: { href: "/tools/stamp-duty-calculator-mumbai", label: "Run your own number" },
    },
    images: [
      { src: "/sections/svc-resale.jpg", alt: "A tall residential tower at golden hour" },
      { src: "/areas/borivali-aerial.jpg", alt: "Mumbai's suburban rooftops among trees, from above" },
      { src: "/blog/sale-deed.jpg", alt: "A property agreement being signed" },
      { src: "/areas/kandivali-green.jpg", alt: "Residential buildings among mature trees" },
    ],
    message: "Hi Shree Giriraj, I am looking at resale flats in Borivali, Kandivali or Malad. Can you help?",
  },
  rentals: {
    facts: [
      { text: "2 to 3", label: "months' deposit in newer societies" },
      { text: "Section 55", label: "registered agreement, every time" },
      { text: "Same day", label: "first shortlist, usually" },
    ],
    numbers: [
      { text: "2 to 3", label: "Months' rent as deposit in newer societies here, more in some older buildings", source: "Shree Giriraj Real Estate, the going rate confirmed 9 September 2026" },
      { text: "Section 55", label: "Every leave and licence agreement in writing and registered; the duty sits with the landlord", source: "Maharashtra Rent Control Act 1999" },
      { value: 15, suffix: " to 30 days", label: "The deposit return period we write into every agreement", source: "Common practice, written into the agreement" },
      { text: "Before the visit", label: "When we confirm the owner and the society's welcome", source: "Shree Giriraj Real Estate" },
    ],
    example: {
      title: "What moving into a 40,000 rupee flat costs on day one",
      given: "An illustrative rent of 40,000 rupees a month in a newer society.",
      rows: [
        { label: "Deposit at two months", value: 80000, prefix: "₹" },
        { label: "Deposit at three months", value: 120000, prefix: "₹" },
        { label: "First month's rent", value: 40000, prefix: "₹" },
      ],
      caption: "Illustrative. The deposit is a term of the agreement and negotiable; we tell you the going rate for the building before you offer.",
    },
    images: [
      { src: "/sections/svc-rentals.jpg", alt: "A set of keys" },
      { src: "/services/hero-rentals.jpg", alt: "An empty flat with the balcony door open to the light" },
      { src: "/blog/deposit-keys.jpg", alt: "Keys on a rental agreement" },
      { src: "/areas/train.jpg", alt: "A Mumbai suburban train at a busy platform" },
    ],
    message: "Hi Shree Giriraj, I am looking to rent in Borivali, Kandivali or Malad. Can you help?",
  },
  "new-project-bookings": {
    facts: [
      { value: 70, suffix: "%", label: "of buyers' money kept in the project's account" },
      { value: 5, suffix: " years", label: "defect liability after possession" },
      { text: "2017", label: "MahaRERA in force since 1 May" },
    ],
    numbers: [
      { value: 70, suffix: "%", label: "Of what buyers pay must sit in a separate account for that project's construction", source: "RERA Act 2016, section 4(2)(l)(D)" },
      { value: 5, suffix: " years", label: "Structural and workmanship defects are the developer's to fix after possession", source: "RERA Act 2016, section 14(3)" },
      { text: "Public", label: "Every project's registration, possession date and sanctioned plan", source: "MahaRERA register" },
      { text: "Direct", label: "Our relationships with a small number of developers, which is what gets you in early", source: "Shree Giriraj Real Estate" },
    ],
    example: {
      title: "Where your money sits while the tower rises",
      given: "An illustrative 1 crore rupees paid across the construction stages.",
      rows: [
        { label: "Ring fenced for this project's construction and land", value: 7000000, prefix: "₹" },
        { label: "GST on an under construction flat, 5 percent", value: 500000, prefix: "₹", note: "1 percent for affordable housing" },
        { label: "Stamp duty at registration, male buyer, 6 percent", value: 600000, prefix: "₹" },
      ],
      caption: "Illustrative. The payment plan follows the construction stages and each demand letter is checked against them.",
      tool: { href: "/tools/home-loan-emi-calculator", label: "Work out the EMI" },
    },
    images: [
      { src: "/sections/svc-new-projects.jpg", alt: "New residential towers" },
      { src: "/blog/under-construction.jpg", alt: "A tower under construction with a crane" },
      { src: "/areas/kandivali-towers.jpg", alt: "Mumbai's towers and residential blocks from above" },
      { src: "/sections/project-jaswanti.jpg", alt: "A residential project" },
    ],
    message: "Hi Shree Giriraj, I am interested in a new launch in Borivali, Kandivali or Malad. Can you help?",
  },
  "investment-advisory": {
    facts: [
      { value: 3, label: "suburbs, pocket by pocket" },
      { text: "Net", label: "yield on the actual flat, not the suburb" },
      { text: "Since 1996", label: "walking these buildings" },
    ],
    numbers: [
      { text: "Gross", label: "A year of rent over the price: the brochure number", source: "Rental yield article" },
      { text: "Net", label: "After society charges, tax, vacancy, and with duty, registration and fit out added to the capital", source: "Rental yield article" },
      { value: 7, suffix: "%", label: "Roughly what stamp duty, registration and brokerage add to a Mumbai purchase before a loan", source: "Maharashtra Stamp Act, Table of Fees" },
      { text: "No figure", label: "We publish no projected return; we do the arithmetic on your flat", source: "Owner's rule, September 2026" },
    ],
    example: {
      title: "Gross yield on a 2 crore flat letting at 50,000 a month",
      given: "Illustrative: a 2 crore rupee flat, 50,000 rupees a month in rent.",
      rows: [
        { label: "Rent a year", value: 600000, prefix: "₹" },
        { label: "Gross yield", value: 3, suffix: "%", decimals: 1 },
        { label: "Duty, registration and brokerage added to the capital, roughly", value: 1400000, prefix: "₹" },
      ],
      caption: "Illustrative arithmetic. Net yield subtracts outgoings and vacancy and is always lower; the calculator does the full sum.",
      tool: { href: "/tools/rental-yield-calculator", label: "Try the yield calculator" },
    },
    images: [
      { src: "/sections/svc-investment.jpg", alt: "A tall tower by day" },
      { src: "/blog/invest-area.jpg", alt: "Mumbai residential towers" },
      { src: "/areas/malad-towers.jpg", alt: "Modern towers seen across greenery" },
      { src: "/blog/rental-yield.jpg", alt: "A calculator and keys beside an agreement" },
    ],
    message: "Hi Shree Giriraj, I am looking to invest in property in Borivali, Kandivali or Malad. Can you help?",
  },
  "commercial-plots": {
    facts: [
      { value: 18, suffix: "%", label: "GST on commercial rent" },
      { value: 20, suffix: " lakh", label: "landlord's GST registration threshold" },
      { value: 3, label: "suburbs, both sides" },
    ],
    numbers: [
      { value: 18, suffix: "%", label: "GST on renting commercial property", source: "CGST, SAC 997212" },
      { value: 20, suffix: " lakh", label: "Aggregate turnover above which a landlord must register", source: "CGST Act, section 22" },
      { text: "Reverse charge", label: "When the landlord is unregistered and the tenant is registered, the tenant pays", source: "Notification 09/2024 Central Tax (Rate), entry 5AB" },
      { text: "Approved use", label: "Confirmed before you commit, so the unit you take is the unit you can trade from", source: "Shree Giriraj Real Estate" },
    ],
    example: {
      title: "GST on a shop let at 1 lakh a month",
      given: "Illustrative: 1 lakh rupees a month, landlord registered for GST.",
      rows: [
        { label: "Rent a month", value: 100000, prefix: "₹" },
        { label: "GST at 18 percent", value: 18000, prefix: "₹" },
        { label: "Invoice total", value: 118000, prefix: "₹" },
      ],
      caption: "Illustrative. Ask whether a quoted rent is inclusive of GST and whether the tenant is registered before comparing two units.",
    },
    images: [
      { src: "/sections/svc-commercial.jpg", alt: "Retail units on a plaza" },
      { src: "/services/hero-commercial.jpg", alt: "Shoppers in a covered arcade of glass shopfronts" },
      { src: "/blog/commercial-investment.jpg", alt: "A commercial street" },
      { src: "/blog/reit-office.jpg", alt: "A glass office facade" },
    ],
    message: "Hi Shree Giriraj, I am looking for commercial space in Borivali, Kandivali or Malad. Can you help?",
  },
  "mhada-paperwork": {
    facts: [
      { value: 45, prefix: "₹", label: "per sq ft, LIG transfer charge" },
      { value: 55, prefix: "₹", label: "per sq ft, MIG" },
      { value: 60, prefix: "₹", label: "per sq ft, HIG" },
    ],
    numbers: [
      { value: 15000, prefix: "₹", label: "Cap on the transfer charge for a Low Income Group flat", source: "MHADA Mumbai Board schedule, checked 9 September 2026" },
      { value: 25000, prefix: "₹", label: "Cap for Middle Income Group", source: "MHADA Mumbai Board schedule" },
      { value: 35000, prefix: "₹", label: "Cap for High Income Group", source: "MHADA Mumbai Board schedule" },
      { value: 8, suffix: " days", label: "Time limit for the no objection certificate for rent", source: "Maharashtra Right to Public Services Act notification" },
    ],
    example: {
      title: "Transfer charge on a 600 square foot LIG flat",
      given: "Illustrative: a 600 square foot Low Income Group flat, transfer of tenancy rights.",
      rows: [
        { label: "600 square feet at 45 rupees", value: 27000, prefix: "₹" },
        { label: "Capped for LIG at", value: 15000, prefix: "₹" },
      ],
      caption: "Illustrative. The Board may also ask for a share of the unearned increase on a sale; we confirm both for your scheme before you agree a price.",
    },
    images: [
      { src: "/sections/svc-mhada.jpg", alt: "Documents on a desk" },
      { src: "/blog/mhada-sell.jpg", alt: "A MHADA layout building" },
      { src: "/blog/mhada-heir.jpg", alt: "A hand signing a document" },
      { src: "/blog/mhada-resale.jpg", alt: "Stamped forms with a pen and a calculator" },
    ],
    message: "Hi Shree Giriraj, I need help with MHADA paperwork for a flat in Borivali, Kandivali or Malad.",
  },
  interiors: {
    facts: [
      { text: "Itemised", label: "estimate before any work starts" },
      { text: "Bye law 46", label: "society permission, in writing" },
      { value: 0, prefix: "₹", label: "advance until the scope is agreed" },
    ],
    numbers: [
      { text: "Itemised", label: "An estimate you can change line by line before you commit", source: "Shree Giriraj Real Estate" },
      { text: "Bye law 46", label: "Society permission in writing before work starts", source: "Model bye laws for cooperative housing societies" },
      { text: "Section 342", label: "Structural changes need the BMC as well", source: "Mumbai Municipal Corporation Act 1888" },
      { value: 18, suffix: "%", label: "GST on interior work, on top of the estimate", source: "CGST" },
    ],
    images: [
      { src: "/sections/svc-interiors.jpg", alt: "A fitted kitchen" },
      { src: "/services/hero-interiors.jpg", alt: "A furnished living room in a Mumbai flat" },
      { src: "/blog/interiors.jpg", alt: "Interior work in progress" },
      { src: "/blog/interior-designer.jpg", alt: "An interior designer's drawings" },
    ],
    message: "Hi Shree Giriraj, I am planning interiors for a flat in Borivali, Kandivali or Malad. Can you help?",
  },
};
