import type { Tool } from "@/lib/tools";

/**
 * The rent agreement (leave and licence) stamp duty tool, kept in its own
 * module so the registry in tools.ts only gains one import and one list entry.
 *
 * Search demand, about 2,250 a month across the cluster: leave and license
 * agreement stamp duty 590, rent agreement online mumbai 590, rent agreement
 * registration charges 390, the same in mumbai 260, rent agreement stamp duty
 * calculator 210, leave and license stamp duty calculator 210. Landlords and
 * tenants, which feeds the rentals service.
 *
 * Every figure in the copy below was read on 7 November 2026 from Article
 * 36A of the Maharashtra Stamp Act (department master copy of Schedule I)
 * and the department's Leave and License 2.0 calculator. See
 * lib/rentagreement.ts for the detail.
 */
export const rentAgreementTool: Tool = {
  slug: "rent-agreement-stamp-duty-calculator-mumbai",
  component: "rentAgreement",
  title: "Rent agreement stamp duty and registration calculator, Mumbai",
  metaTitle: "Rent agreement stamp duty calculator Mumbai",
  metaDescription:
    "Work out stamp duty, registration fee and handling charge on a Mumbai leave and licence agreement, on the IGR formula for rent and deposit.",
  answer:
    "Stamp duty on a Mumbai leave and licence agreement is 0.25 percent of the rent for the whole term, plus any non refundable amount, plus 10 percent a year notional interest on the refundable deposit. The minimum is 100 rupees. Registration is 1,000 rupees in an urban area, plus a 300 rupee document handling charge.",
  introHeading: "How is stamp duty calculated on a rent agreement in Mumbai?",
  intro: [
    "In Maharashtra a rent agreement is usually a leave and licence agreement. Its stamp duty is set by Article 36A of the Maharashtra Stamp Act.",
    "The duty is 0.25 percent of three amounts added together: the rent for the whole term, any non refundable amount, and notional interest on the deposit.",
    "The interest is 10 percent a year on the refundable deposit. The department's own calculator counts a part year as a full year.",
    "Registration adds 1,000 rupees for property in an urban area such as Mumbai, and the document handling charge adds 300 rupees.",
  ],
  limits: [
    "It covers terms of up to 60 months. A longer agreement pays lease duty under Article 36, which this tool does not compute.",
    "It shows government charges only. A drafting or doorstep service fee is separate.",
    "A yearly increase is applied at the start of each new year of the term, rounded to the rupee.",
    "It is an estimate for planning. The figure on the IGR portal when you register is the one you pay.",
  ],
  faqs: [
    {
      q: "How is stamp duty on a leave and licence agreement calculated?",
      a: "Under Article 36A of the Maharashtra Stamp Act, it is 0.25 percent of the total rent for the term, plus any non refundable deposit or premium, plus interest at 10 percent a year on the refundable deposit. The department's calculator applies a minimum of 100 rupees.",
    },
    {
      q: "How is the security deposit counted for stamp duty?",
      a: "A refundable deposit is not taxed in full. Interest at 10 percent a year is added instead, and the department's calculator counts a part year as a full year. On an 11 month agreement, a 1 lakh deposit adds 10,000 rupees, which is 25 rupees of duty.",
    },
    {
      q: "What are rent agreement registration charges in Mumbai?",
      a: "The Department of Registration and Stamps calculator shows a registration fee of 1,000 rupees for property in an urban area such as Mumbai, and 500 rupees in a rural one. A document handling charge of 300 rupees is added on top.",
    },
    {
      q: "What if the agreement is longer than 60 months?",
      a: "Article 36A covers terms of up to 60 months. A longer leave and licence agreement pays the same duty as a lease under Article 36, which is worked out on the market value of the property instead.",
    },
  ],
  readNext: [
    { label: "How much rent deposit is normal", href: "/blog/rent-deposit-months-western-suburbs" },
    { label: "HRA calculator and rent receipts", href: "/tools/hra-calculator-rent-receipts" },
    { label: "Flats on rent with us", href: "/services/rentals" },
  ],
};
