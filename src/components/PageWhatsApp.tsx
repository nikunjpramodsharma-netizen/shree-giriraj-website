/**
 * Declares this page's own WhatsApp message. The site wide buttons (floating,
 * menu, bottom bar) pick it up when tapped, through WhatsAppRef, so a seller
 * reading a seller's page is not handed a buyer's message.
 */
export function PageWhatsApp({ message }: { message: string }) {
  return <span hidden data-wa-message={message} />;
}
