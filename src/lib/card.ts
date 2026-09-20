import { site, waLink } from "./config";
import { SITE_URL } from "./seo";

/**
 * The digital visiting card at /card, and the contact file it hands out.
 *
 * Every number, address and link comes from config.ts, so the card can never
 * disagree with the rest of the site. Only what is particular to the card
 * lives here: whose card it is, and the short lines of copy.
 */
export const CARD = {
  path: "/card",
  vcfPath: "/card/pramod-sharma.vcf",
  person: "Pramod Sharma",
  givenName: "Pramod",
  familyName: "Sharma",
  role: "Founder",
  photo: "/team/pramod-sharma-card.jpg",
  whatsappMessage: "Hello, I have your card and would like to ask about a property.",
  services: [
    "Buy a home",
    "Sell a flat",
    "Rent",
    "New projects",
    "Commercial and plots",
    "Interiors and civil work",
    "Investment advice",
  ],
} as const;

export function cardWhatsAppLink() {
  return waLink(CARD.whatsappMessage);
}

/** +919324974133 becomes +91 93249 74133. Anything else is returned as it came. */
export function showPhone(e164: string): string {
  const m = /^\+91(\d{5})(\d{5})$/.exec(e164);
  return m ? `+91 ${m[1]} ${m[2]}` : e164;
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** RFC 2426 folding: 75 characters a line, continuation lines start with a space. */
function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  let first = true;
  while (rest.length > 0) {
    const n = first ? 75 : 74;
    out.push((first ? "" : " ") + rest.slice(0, n));
    rest = rest.slice(n);
    first = false;
  }
  return out.join("\r\n");
}

/**
 * The contact file behind Save Contact. Version 3.0 because both iOS and
 * Android read its PHOTO field, which they do not reliably do for 4.0.
 */
export function buildVCard(photoBase64?: string): string {
  // The master address, split the way ADR wants it: street; city; region; code; country.
  const [shop, society, locality, suburb, cityAndPin] = site.address.split(", ");
  const [city, pin] = cityAndPin.split(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${CARD.familyName};${CARD.givenName};;;`,
    `FN:${CARD.person}`,
    `ORG:${esc(site.name)}`,
    `TITLE:${CARD.role}`,
    `TEL;TYPE=CELL,VOICE,PREF:${site.phonePrimary}`,
    `TEL;TYPE=WORK,VOICE:${site.phoneSecondary}`,
    `EMAIL;TYPE=INTERNET,WORK:${site.email}`,
    `ADR;TYPE=WORK:;;${esc(`${shop}, ${society}, ${locality}`)};${esc(`${suburb}, ${city}`)};Maharashtra;${pin};India`,
    `URL:${SITE_URL}/`,
    `NOTE:${esc(`MahaRERA ${site.rera}. Real estate, interiors and civil work in ${site.areas.slice(0, -1).join(", ")} and ${site.areas.at(-1)}. Open ${site.hours.label}.`)}`,
    ...(photoBase64 ? [`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`] : []),
    "END:VCARD",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
