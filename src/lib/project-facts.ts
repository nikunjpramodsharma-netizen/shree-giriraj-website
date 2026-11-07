import { JJ } from "@/lib/projects/jaswanti-jewel";

/**
 * Plain facts about each project, for the at a glance block, the FAQs and the
 * comparison table on /projects.
 *
 * Every line below restates something the project's own page already says
 * (the CMS entry for the four CMS projects, src/lib/projects/jaswanti-jewel.ts
 * for Jewel). Nothing is added from outside. Where the page does not say
 * something, the table says "Ask us" rather than guess.
 *
 * Prices are rough "from about" figures built from the masked values, as the
 * owner decided on 7 November 2026. Jewel's price is exact and stays exact.
 *
 * Blissful Living and Luxury Living are NOT on MahaRERA (owner, 7 November
 * 2026). They carry no booking, EOI booking, price or base rate language
 * anywhere. They are "register your interest for updates" pages.
 */

export type MahaReraState = "registered" | "awaited" | "ask";

export type ProjectFacts = {
  slug: string;
  name: string;
  suburb: "Kandivali West" | "Borivali West";
  /** Where on the table and the cards the street is named. */
  street: string;
  bhk: string;
  /** The table cell for "from about". */
  fromAbout: string;
  /** Possession, only where the project page states it. */
  possession: string;
  rera: MahaReraState;
  reraText: string;
  /** 40 to 60 words, shown first on the project page. */
  answer: string;
  glance: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
};

export const INTEREST_NOTE =
  "MahaRERA registration awaited. Register your interest and we will send details once it is registered.";

export const INTEREST_WA = (name: string) =>
  `Hi Shree Giriraj, please register my interest in ${name} and send me the details once it is registered with MahaRERA.`;

export { registrationAwaited, REGISTRATION_AWAITED } from "@/lib/project-links";

const WITH_CMS: Record<string, ProjectFacts> = {
  "the-landmark-borivali-west": {
    slug: "the-landmark-borivali-west",
    name: "The Landmark, Borivali West",
    suburb: "Borivali West",
    street: "S.V. Road, near Vijay Sales",
    bhk: "2, 2.5, 3 BHK",
    fromAbout: "From about ₹2 Cr",
    possession: "Ask us",
    rera: "ask",
    reraText: "Ask us for the current status",
    answer:
      "The Landmark is an upcoming project of three 40 storey towers on S.V. Road, Borivali West, near Vijay Sales. It offers 2, 2.5 and 3 BHK homes from the 10th to the 40th floor, from about ₹2 Cr. Borivali station is three minutes away. Ask us for the price sheet.",
    glance: [
      { label: "Where", value: "Near Vijay Sales, S.V. Road, Borivali West" },
      { label: "Borivali station", value: "3 minutes" },
      { label: "New Link Road metro", value: "5 minutes" },
      { label: "Towers", value: "3 towers of 40 storeys on a 3 acre site" },
      { label: "Homes", value: "2, 2.5 and 3 BHK, from the 10th to the 40th floor" },
      { label: "Sizes", value: "686 to 1,181 sq ft" },
      { label: "From about", value: "₹2 Cr for a 2 BHK, ₹3 Cr for a 3 BHK" },
      { label: "Amenity deck", value: "9th level, 1,25,000 sq ft" },
      { label: "Also", value: "Podium parking, retail on the ground and first levels" },
    ],
    faqs: [
      {
        q: "What sizes and configurations does The Landmark offer?",
        a: "The 2 BHK homes are 686, 704 and 746 sq ft. The 2.5 BHK is 837 sq ft. The 3 BHK homes are 900, 950 and 1,181 sq ft.",
      },
      {
        q: "How many towers and floors are there?",
        a: "There are three towers of 40 storeys each on a 3 acre site. Homes run from the 10th to the 40th floor.",
      },
      {
        q: "What amenities does The Landmark have?",
        a: "A 9th level amenity deck of 1,25,000 sq ft, podium parking, and retail on the ground and first levels.",
      },
      {
        q: "How close is The Landmark to Borivali station?",
        a: "It is about three minutes from Borivali station and five minutes from the new Link Road metro, near Vijay Sales on S.V. Road.",
      },
      {
        q: "What does a home at The Landmark cost?",
        a: "2 and 2.5 BHK homes start from about ₹2 Cr. 3 BHK homes start from about ₹3 Cr, and the largest 3 BHK from about ₹4 Cr. These are rough figures. Message us for the price sheet.",
      },
    ],
  },
  "veena-celestia": {
    slug: "veena-celestia",
    name: "Veena Celestia",
    suburb: "Borivali West",
    street: "Chandavarkar Lane",
    bhk: "Ask us",
    fromAbout: "Base rate ₹41,000++ per sq ft",
    possession: "Ask us",
    rera: "registered",
    reraText: "RERA registered, number on request",
    answer:
      "Veena Celestia is a new residential project on Chandavarkar Lane, Borivali West. RERA registration is in place and bookings are open. The base rate is ₹41,000++ per sq ft. We can share the live price sheet, the RERA number and current availability on request.",
    glance: [
      { label: "Where", value: "Chandavarkar Lane, Borivali West" },
      { label: "Status", value: "New launch, bookings open" },
      { label: "RERA", value: "Registration in place, number on request" },
      { label: "Base rate", value: "₹41,000++ per sq ft" },
      { label: "On request", value: "Live price sheet, RERA number and availability" },
    ],
    faqs: [
      {
        q: "Where is Veena Celestia?",
        a: "On Chandavarkar Lane in Borivali West.",
      },
      {
        q: "Is Veena Celestia registered under RERA?",
        a: "Yes. RERA registration is in place. Message us and we will share the RERA number.",
      },
      {
        q: "What is the base rate at Veena Celestia?",
        a: "The base rate is ₹41,000++ per sq ft. Message us for the live price sheet.",
      },
      {
        q: "Are bookings open?",
        a: "Yes. Bookings have started, which gives early buyers a choice of floor and configuration. Ask us for current availability.",
      },
    ],
  },
  "blissful-living": {
    slug: "blissful-living",
    name: "Blissful Living",
    suburb: "Kandivali West",
    street: "Ext. Mathuradas Road",
    bhk: "To follow",
    fromAbout: "Shared once registered",
    possession: "To follow",
    rera: "awaited",
    reraText: "Registration awaited",
    answer:
      "Blissful Living is an upcoming residential project on Ext. Mathuradas Road in Kandivali West. MahaRERA registration awaited. Register your interest and we will send details once it is registered. You can also compare it with the other new projects in Kandivali West on our projects page.",
    glance: [
      { label: "Where", value: "Ext. Mathuradas Road, Kandivali West" },
      { label: "Type", value: "Upcoming residential project" },
      { label: "MahaRERA", value: "Registration awaited" },
      { label: "Next step", value: "Register your interest for updates" },
    ],
    faqs: [
      {
        q: "Where is Blissful Living?",
        a: "On Ext. Mathuradas Road in Kandivali West.",
      },
      {
        q: "Is Blissful Living registered with MahaRERA?",
        a: "MahaRERA registration awaited. Register your interest and we will send details once it is registered.",
      },
      {
        q: "How do I register my interest?",
        a: "Message us on WhatsApp with your name and the size you are looking for. We will send you details once the project is registered.",
      },
      {
        q: "Is Blissful Living open for sale yet?",
        a: "Not yet. Since 1 May 2017, a project of this size in Maharashtra must be registered with MahaRERA before it is sold. Register your interest, and we will send the details and the MahaRERA number once Blissful Living is registered.",
      },
      {
        q: "What does MahaRERA registration give a buyer?",
        a: "A public record of the project with its promised completion date. The developer must keep 70 percent of buyers' money in a separate account for that project. Carpet area has one legal meaning. And for five years after possession, structural defects are the developer's to fix.",
      },
      {
        q: "Which registered new projects are nearby?",
        a: "In Kandivali West, Jaswanti Jewel off M.G. Road is registered, with 2, 3, 4 and 5 BHK homes from ₹2.92 Cr. Our projects page compares every new project in Kandivali West and Borivali West side by side.",
      },
    ],
  },
  "luxury-living-punit-nagar": {
    slug: "luxury-living-punit-nagar",
    name: "Luxury Living (Punit Nagar)",
    suburb: "Borivali West",
    street: "Punit Nagar, Saibaba Nagar",
    bhk: "To follow",
    fromAbout: "Shared once registered",
    possession: "To follow",
    rera: "awaited",
    reraText: "Registration awaited",
    answer:
      "Luxury Living is an upcoming residential project in Punit Nagar (Saibaba Nagar), Borivali West. MahaRERA registration awaited. Register your interest and we will send details once it is registered. You can also compare it with the other new projects in Borivali West on our projects page.",
    glance: [
      { label: "Where", value: "Punit Nagar (Saibaba Nagar), Borivali West" },
      { label: "Type", value: "Upcoming residential project" },
      { label: "MahaRERA", value: "Registration awaited" },
      { label: "Next step", value: "Register your interest for updates" },
    ],
    faqs: [
      {
        q: "Where is Luxury Living?",
        a: "In Punit Nagar (Saibaba Nagar) in Borivali West.",
      },
      {
        q: "Is Luxury Living registered with MahaRERA?",
        a: "MahaRERA registration awaited. Register your interest and we will send details once it is registered.",
      },
      {
        q: "How do I register my interest?",
        a: "Message us on WhatsApp with your name and the size you are looking for. We will send you details once the project is registered.",
      },
      {
        q: "Is Luxury Living open for sale yet?",
        a: "Not yet. Since 1 May 2017, a project of this size in Maharashtra must be registered with MahaRERA before it is sold. Register your interest, and we will send the details and the MahaRERA number once Luxury Living is registered.",
      },
      {
        q: "What does MahaRERA registration give a buyer?",
        a: "A public record of the project with its promised completion date. The developer must keep 70 percent of buyers' money in a separate account for that project. Carpet area has one legal meaning. And for five years after possession, structural defects are the developer's to fix.",
      },
      {
        q: "Which new projects are nearby?",
        a: "In Borivali West, Veena Celestia on Chandavarkar Lane is registered. The Landmark on S.V. Road has 2, 2.5 and 3 BHK homes from about ₹2 Cr. Our projects page compares them side by side.",
      },
    ],
  },
};

export function getProjectFacts(slug: string): ProjectFacts | undefined {
  return WITH_CMS[slug];
}

/** Jewel's row, built from its own page data so the two cannot disagree. */
const JEWEL: ProjectFacts = {
  slug: JJ.slug,
  name: JJ.name,
  suburb: "Kandivali West",
  street: JJ.locality,
  bhk: "2, 3, 4, 5 BHK",
  fromAbout: `From ${JJ.startingPrice}`,
  possession: `From ${JJ.possession.developer} (MahaRERA date ${JJ.possession.rera})`,
  rera: "registered",
  reraText: `Registered, ${JJ.rera}`,
  answer: "",
  glance: [],
  faqs: [],
};

/** The rows of the comparison table on /projects, in suburb order. */
export const COMPARISON: ProjectFacts[] = [
  JEWEL,
  WITH_CMS["blissful-living"],
  WITH_CMS["the-landmark-borivali-west"],
  WITH_CMS["veena-celestia"],
  WITH_CMS["luxury-living-punit-nagar"],
];
