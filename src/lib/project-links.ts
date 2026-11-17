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
 * are rough "from about" figures; exact sheets stay on WhatsApp. Blissful Living
 * and Luxury Living are not on MahaRERA, so their text never sells a booking.
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
  /**
   * Meta descriptions for the translated pages, where the CMS summary alone
   * is too short to earn the click (technical crawl, 16 November 2026). Each
   * restates the facts the English description already carries.
   */
  localeMetaDescription?: Partial<Record<"hi" | "mr" | "gu", string>>;
};

export const PROJECT_LINKS: ProjectLink[] = [
  { slug: "jaswanti-jewel", name: "Jaswanti Jewel", area: "kandivali" },
  {
    slug: "blissful-living",
    name: "Blissful Living",
    area: "kandivali",
    metaTitle: "Blissful Living Kandivali West, upcoming",
    metaDescription:
      "Upcoming project on Ext. Mathuradas Road, Kandivali West. MahaRERA registration awaited. Register your interest, or compare launches nearby.",
  },
  {
    slug: "the-landmark-borivali-west",
    name: "The Landmark, Borivali West",
    area: "borivali-west",
    // Searchers type "landmark building borivali west" (77 impressions at
    // position 5, no clicks, Aug to Nov 2026); some mean an older building of
    // that name, so the snippet answers both.
    metaTitle: "Landmark building, Borivali West: 2 to 3 BHK",
    metaDescription:
      "The Landmark, S.V. Road, Borivali West: three 40 storey towers, 2 to 3 BHK from about ₹2 Cr. Another Landmark building? We find resale flats there.",
  },
  {
    slug: "veena-celestia",
    name: "Veena Celestia",
    area: "borivali-west",
    metaTitle: "Veena Celestia, Chandavarkar Lane, Borivali",
    metaDescription:
      "New launch on Chandavarkar Lane, Borivali West, with RERA received and bookings open. Base rate ₹41,000++ per sq ft. Price sheet on WhatsApp.",
    localeMetaDescription: {
      hi: "बोरिवली वेस्ट के चंदावरकर लेन पर नया लॉन्च, RERA मिल चुका है और बुकिंग शुरू है। बेस रेट ₹41,000++ प्रति वर्ग फुट। प्राइस शीट और RERA नंबर WhatsApp पर पाएं।",
      mr: "बोरिवली वेस्टमध्ये चंदावरकर लेनवर नवीन लॉन्च, RERA मिळाले, बुकिंग सुरू. बेस रेट ₹41,000++ प्रति चौ. फूट. प्राइस शीट आणि RERA क्रमांक WhatsApp वर मिळवा.",
      gu: "બોરીવલી વેસ્ટના ચંદાવરકર લેન પર નવો લોન્ચ, RERA મળી ગયું છે અને બુકિંગ શરૂ છે. બેઝ રેટ ₹41,000++ પ્રતિ ચો. ફૂટ. પ્રાઇસ શીટ અને RERA નંબર WhatsApp પર મેળવો.",
    },
  },
  {
    slug: "luxury-living-punit-nagar",
    name: "Luxury Living (Punit Nagar)",
    area: "borivali-west",
    metaTitle: "Luxury Living, Punit Nagar, Borivali West",
    metaDescription:
      "Upcoming project in Punit Nagar, Saibaba Nagar, Borivali West. MahaRERA registration awaited. Register your interest and compare the launches nearby.",
  },
];

export function getProjectLink(slug: string): ProjectLink | undefined {
  return PROJECT_LINKS.find((p) => p.slug === slug);
}

export function projectsInArea(area: string): ProjectLink[] {
  return PROJECT_LINKS.filter((p) => p.area === area);
}

/**
 * Projects with no MahaRERA number yet (owner, 7 November 2026). No booking,
 * price or base rate language for these anywhere on the site.
 */
export const REGISTRATION_AWAITED = new Set(["blissful-living", "luxury-living-punit-nagar"]);

export function registrationAwaited(slug: string): boolean {
  return REGISTRATION_AWAITED.has(slug);
}
