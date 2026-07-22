import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shreegiriraj.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shree Giriraj Real Estate — Homes in Borivali, Kandivali & Malad",
    template: "%s | Shree Giriraj Real Estate",
  },
  description:
    "25+ years of trusted property advice in Borivali West. Resale, rentals & new project bookings across Borivali, Kandivali and Malad. MahaRERA A51800005726.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Shree Giriraj Real Estate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
