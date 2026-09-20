import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { GeistSans } from "geist/font/sans";
import { Gtm } from "@/components/Gtm";
import { SITE_URL } from "@/lib/seo";
import "./card.css";

/**
 * The digital visiting card has its own root layout, like the studio does.
 * A card is opened from a QR code or a WhatsApp link and should be the card
 * and nothing else, so it carries no site header, footer or floating buttons.
 * It is English only and sits outside the locale routes; the middleware
 * matcher leaves /card alone for that reason.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  themeColor: "#151b3d",
};

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        {children}
        <Suspense fallback={null}>
          <Gtm />
        </Suspense>
      </body>
    </html>
  );
}
