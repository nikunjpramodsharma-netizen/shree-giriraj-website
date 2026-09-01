export const site = {
  name: "Shree Giriraj Real Estate",
  tagline: "Real Estate · Interior & Civil Work",
  established: "1996",
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
};

/** Build a wa.me link with a pre-filled message. */
export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
