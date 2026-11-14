/**
 * Declares this page's own WhatsApp message, and optionally its own number.
 * The site wide buttons (floating, menu, bottom bar) pick them up when tapped,
 * through WhatsAppRef, so a seller reading a seller's page is not handed a
 * buyer's message, and the /invest page keeps its separate line.
 */
export function PageWhatsApp({ message, number }: { message: string; number?: string }) {
  return <span hidden data-wa-message={message} data-wa-number={number} />;
}
