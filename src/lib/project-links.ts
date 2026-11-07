/**
 * The projects on the site, by suburb, for the "New projects here" links on
 * the area guides, the flats for sale pages and each project page.
 *
 * Project content itself lives in the CMS (Jaswanti Jewel in code). This list
 * holds only what the links need: the slug, the name as the page shows it, and
 * the area guide the project sits in. The meta title and description for the
 * CMS projects live here too, because the CMS write token is retired and the
 * CMS only gives a page its bare name as a title.
 *
 * Every line of meta text restates what the project page already says. Prices
 * stay masked: only the owner's published base rates appear.
 */

export type ProjectLink = {
  slug: string;
  name: string;
  /** Area guide slug in areas.ts. */
  area: "borivali-west" | "kandivali";
  /** Title tag, 44 characters at most (the site adds " | Shree Giriraj"). */
  metaTitle?: string;
  /** Meta description, 150 characters at most. */
  metaDescription?: string;
};

export const PROJECT_LINKS: ProjectLink[] = [
  { slug: "jaswanti-jewel", name: "Jaswanti Jewel", area: "kandivali" },
  {
    slug: "blissful-living",
    name: "Blissful Living",
    area: "kandivali",
    metaTitle: "Blissful Living, Kandivali West",
    metaDescription:
      "Upcoming project on Ext. Mathuradas Road, Kandivali West, open for Expression of Interest. Base rate ₹26,000++ per sq ft. Price sheet on WhatsApp.",
  },
  {
    slug: "the-landmark-borivali-west",
    name: "The Landmark, Borivali West",
    area: "borivali-west",
    metaTitle: "The Landmark Borivali West: 2, 2.5, 3 BHK",
    metaDescription:
      "A 40 storey tower on S.V. Road, Borivali West, with 2, 2.5 and 3 BHK homes from the 10th to 40th floor. Price sheet and site visit on WhatsApp.",
  },
  {
    slug: "veena-celestia",
    name: "Veena Celestia",
    area: "borivali-west",
    metaTitle: "Veena Celestia, Borivali West",
    metaDescription:
      "New launch on Chandavarkar Lane, Borivali West, with RERA received and bookings open. Base rate ₹41,000++ per sq ft. Price sheet on WhatsApp.",
  },
  {
    slug: "luxury-living-punit-nagar",
    name: "Luxury Living (Punit Nagar)",
    area: "borivali-west",
    metaTitle: "Luxury Living, Punit Nagar, Borivali",
    metaDescription:
      "Upcoming project in Punit Nagar, Borivali West, open for Expression of Interest. Base rate ₹35,000++ per sq ft. Price sheet on WhatsApp.",
  },
];

export function getProjectLink(slug: string): ProjectLink | undefined {
  return PROJECT_LINKS.find((p) => p.slug === slug);
}

export function projectsInArea(area: string): ProjectLink[] {
  return PROJECT_LINKS.filter((p) => p.area === area);
}
