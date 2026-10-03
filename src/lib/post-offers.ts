/**
 * The offer a reader of a particular post is most likely to want.
 *
 * WHY THIS EXISTS
 *
 * On 3 October 2026 the MHADA posts were bringing about seventy percent of the
 * site's search visitors, and almost none of them were buyers. Someone asking
 * "can we rent out a MHADA flat" owns one and is about to let it. Yet every
 * post ended with the same buyer's WhatsApp message ("I am looking for ___ in
 * ___. My budget is about ___."), which that reader has no reason to send.
 *
 * So a post can name the job its reader actually has, say plainly that the
 * firm does it, and open WhatsApp with a message written for that job. Posts
 * without an entry keep the general contact block and nothing else changes.
 */

export type PostOffer = {
  heading: string;
  body: string;
  /** Pre filled WhatsApp text. Blanks are ___ so the reader fills them in. */
  whatsapp: string;
  button: string;
  /** Prefill for the enquiry form further down the page. */
  intentKey: "intentBuy" | "intentSell" | "intentRent" | "intentMhada";
};

export const POST_OFFERS: Record<string, PostOffer> = {
  "can-we-rent-mhada-flat": {
    heading: "Renting out your MHADA flat?",
    body: "We apply for the Board's NOC for rent, find a verified tenant and register the leave and licence agreement, so you hand over the keys with every paper in place.",
    whatsapp:
      "Hi Shree Giriraj, I want to rent out my MHADA flat in ___. Can you help with the NOC and finding a tenant?",
    button: "Ask about renting it out",
    intentKey: "intentRent",
  },
  "can-we-sell-mhada-flat": {
    heading: "Planning to sell your MHADA flat?",
    body: "We prepare the permission file for the Board and the society, find a buyer who qualifies for the scheme and see the sale through to registration.",
    whatsapp:
      "Hi Shree Giriraj, I want to sell my MHADA flat in ___. Can you help with the permissions and finding a buyer?",
    button: "Ask about selling it",
    intentKey: "intentSell",
  },
  "mhada-transfer-on-death": {
    heading: "Need the flat transferred into your name?",
    body: "We put together the file the Estate Manager asks for and follow it through with the Board until the tenement is recorded in your name.",
    whatsapp:
      "Hi Shree Giriraj, I need help transferring a MHADA flat into my name after a death in the family. The flat is in ___.",
    button: "Ask about the transfer",
    intentKey: "intentMhada",
  },
  "how-to-buy-mhada-flat-in-resale": {
    heading: "Looking to buy a MHADA flat?",
    body: "We check the allotment, the five years and the permissions before you pay a token, and share MHADA resale flats in Borivali, Kandivali and Malad that fit your budget.",
    whatsapp:
      "Hi Shree Giriraj, I am looking for a MHADA resale flat in ___. My budget is about ___.",
    button: "Find MHADA flats",
    intentKey: "intentBuy",
  },
  "mhada-redevelopment-rules": {
    heading: "Paperwork for your MHADA flat?",
    body: "We handle NOCs, transfers and permissions with the Mumbai Board for flats in Borivali, Kandivali and Malad, and keep you posted at every step.",
    whatsapp:
      "Hi Shree Giriraj, I need help with paperwork for my MHADA flat in ___.",
    button: "Ask about MHADA paperwork",
    intentKey: "intentMhada",
  },
};

export function offerFor(slug: string): PostOffer | undefined {
  return POST_OFFERS[slug];
}
