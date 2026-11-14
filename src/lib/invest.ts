import { site, waLink } from "@/lib/config";

/**
 * The /invest page. English only, noindex until every [[PLACEHOLDER]] is gone.
 *
 * LINKING TO DO once the page goes live (owner said not yet, 14 Nov 2026):
 *  - add /invest to the sitemap and remove the noindex in the page metadata
 *  - link it from the homepage "Invest in property here" option
 *  - link it from /services/investment-advisory
 *  - add a short "Buying at launch to sell before possession" link block at
 *    the end of /blog/how-to-invest-in-real-estate-india and
 *    /blog/best-area-to-invest-in-mumbai
 *  - add the five "New projects and launches" guides as their own section on
 *    /guides, beside Paperwork, Buying, Renting and MHADA (not under Buying)
 *  - flip LIVE_GUIDES below as each guide is published
 */

/** The investor line. One place, from the site config. Every CTA on the page uses it. */
export const INVESTOR_WHATSAPP = site.investWhatsapp;

export function investWaLink(message: string): string {
  return waLink(message, INVESTOR_WHATSAPP);
}

export const MSG_SHEET = "Hi Shree Giriraj, please send me the current launch sheet.";
export const MSG_PLACE =
  "Hi Shree Giriraj, I am looking to invest about ___ and I am based in ___. Please send the current launch sheet.";

/** Guides that exist today. A guide not listed here renders as plain text. */
export const LIVE_GUIDES: Record<string, boolean> = {
  "/guides/nri-book-under-construction-flat-mumbai": false,
  "/guides/allotment-letter-under-construction-flat": false,
  "/guides/new-projects-borivali-west": true,
  "/guides/stamp-duty-gst-under-construction-maharashtra": true,
  "/guides/how-to-check-a-builder-rera-page": true,
};

export type InvestFaq = {
  question: string;
  answer: string;
  link?: { text: string; href: string };
};

export const INVEST_FAQS: InvestFaq[] = [
  {
    question: "What is the smallest amount I can start with?",
    answer:
      "One unit, which in these suburbs starts around ₹1 Cr. Two or three units in one launch is the allocation we usually suggest.",
  },
  {
    question: "How long is the money in?",
    answer:
      "A cycle runs from launch to exit before possession. Plan for two to three years and be pleased if it is shorter.",
  },
  {
    question: "Do I have to be in Mumbai?",
    answer: "No. NRIs book, sign through a power of attorney, and exit without visiting.",
    link: { text: "How an NRI books from abroad", href: "/guides/nri-book-under-construction-flat-mumbai" },
  },
  {
    question: "Can I see the papers before I decide?",
    answer: "Yes. The full file for each project goes to you before you pay anything.",
  },
  {
    question: "What returns can I expect?",
    answer:
      "We do not put a number on it, because we would be guessing and you would hold us to it. We show you the actual revision history of the project and the arithmetic on your unit, and you decide.",
  },
  {
    question: "What happens after my first exit?",
    answer:
      "The money is yours. If you want it back in, the next launch sheet is ready. The programme is built to run cycle after cycle, with the profit taken out or left in as you choose.",
  },
];

/** Questions safe for the FAQPage markup: no unfilled placeholder in the question or answer. */
export function schemaFaqs(faqs: InvestFaq[] = INVEST_FAQS) {
  return faqs
    .filter((f) => !/\[\[/.test(f.question + f.answer))
    .map((f) => ({ question: f.question, answer: f.answer }));
}
