import { buildVCard } from "@/lib/card";
import { CARD_PHOTO_B64 } from "@/lib/card-photo";

/**
 * The file behind Save Contact. Built once at build time: nothing in it
 * changes between deploys. `inline` lets an iPhone open its Add Contact sheet
 * straight away; Android downloads the file and offers Contacts to open it.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildVCard(CARD_PHOTO_B64), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="Pramod Sharma.vcf"',
      "X-Robots-Tag": "noindex",
    },
  });
}
