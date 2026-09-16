export const site = {
  name: "Shree Giriraj Real Estate",
  tagline: "Real Estate · Interior & Civil Work",
  /** In real estate since. The business claim. */
  established: "1996",
  /** At the Borivali West office since. NOT the same year, and the site must
   *  never imply the shop dates from 1996. Owner's correction, 8 Sept 2026. */
  officeSince: "2005",
  rera: "A51800005726",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919324974133",
  phonePrimary: process.env.NEXT_PUBLIC_PHONE_PRIMARY || "+919324974133",
  phoneSecondary: process.env.NEXT_PUBLIC_PHONE_SECONDARY || "+919223594133",
  email: process.env.NEXT_PUBLIC_EMAIL || "shreegiriraj1224@gmail.com",
  // Master NAP. Must match the Google Business Profile character for character.
  // "Garden Groove Shopping Centre" is the same place (it is the commercial
  // complex within Clover Grove CHS) but belongs only in "how to find us" prose,
  // never in a NAP block or a directory listing.
  address:
    "Shop No 11, Clover Grove CHS, Chikoowadi, Borivali West, Mumbai 400092",
  /** Core markets. Drives the hero eyebrow, the suburb count and the area pages. */
  areas: ["Borivali", "Kandivali", "Malad"],
  /** Served occasionally, not core. Mentioned on the areas page only, never the hero. */
  extendedAreas: ["Dahisar", "Goregaon"],
  /**
   * Opening hours, confirmed by the owner on 16 September 2026. Every day of
   * the week, 9 am to 9 pm. Used on the contact page and in the business
   * markup; change both by changing this.
   */
  hours: { opens: "09:00", closes: "21:00", days: "Monday to Sunday", label: "9 am to 9 pm, all seven days" },
  /**
   * The firm's own profiles elsewhere, for the sameAs field in the business
   * markup and the footer. Only a URL that was opened and matched on the
   * business name plus the Chikoowadi address or a phone number goes here.
   * The Google Business Profile is the Maps listing by its identifier.
   */
  sameAs: [
    "https://www.google.com/maps/place/?cid=5587711998336126142",
    // JustDial, listed as "Giriraj Real Estate Interior & Civil Work": same
    // shop, same RERA number, the secondary phone. Checked 16 September 2026.
    "https://www.justdial.com/Mumbai/Giriraj-Real-Estate-Interior-And-Civil-Works-Near-Chikuwadi-Borivali-West/022PXX22-XX22-140314134631-H1T4_BZDET",
    // Square Yards agent page for Pramod Sharma, Shree Giriraj Real Estate,
    // same RERA number. Dormant but genuine. Checked 16 September 2026.
    "https://www.squareyards.com/agent/pramod-sharma/490321",
    // No Facebook or Instagram page for this business could be found on
    // 16 September 2026; the ones that surface belong to firms in Dadar and
    // Indore. Add here only once the owner confirms a URL.
  ] as string[],
};

/** Build a wa.me link with a pre-filled message. */
export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
