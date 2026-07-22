export const site = {
  name: "Shree Giriraj Real Estate",
  tagline: "Real Estate · Interior & Civil Work",
  established: "1996",
  rera: "A51800005726",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919324974133",
  phonePrimary: process.env.NEXT_PUBLIC_PHONE_PRIMARY || "+919324974133",
  phoneSecondary: process.env.NEXT_PUBLIC_PHONE_SECONDARY || "+919223594133",
  email: process.env.NEXT_PUBLIC_EMAIL || "shreegiriraj1224@gmail.com",
  address:
    "11, Garden Groove Shopping Centre, Chikuwadi, Borivali (W), Mumbai 400092",
  areas: ["Borivali", "Kandivali", "Malad"],
};

/** Build a wa.me link with a pre-filled message. */
export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
