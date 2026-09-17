import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const SERVICE_SLUGS = [
  "resale-flats",
  "rentals",
  "new-project-bookings",
  "investment-advisory",
  "commercial-plots",
  "interiors",
  "mhada-paperwork",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    const group = SERVICE_SLUGS.join("|");
    return [
      // The service pages live at /services/[slug]. Bare slugs used to resolve
      // too, giving every service two self canonicalising URLs per locale.
      // 301 rather than 404 so any link that already exists keeps its value.
      {
        source: `/:slug(${group})`,
        destination: "/services/:slug",
        permanent: true,
      },
      {
        source: `/:locale(hi|mr|gu)/:slug(${group})`,
        destination: "/:locale/services/:slug",
        permanent: true,
      },
      // Redevelopment advisory was replaced by investment advisory on
      // 8 September 2026. The two serve different buyers and the new page is
      // written from scratch, so this is a replacement rather than a rename.
      //
      // The redirect is insurance rather than SEO recovery: the site has never
      // been live (no domain, no DNS, canonicals still resolve to localhost),
      // so nothing was ever indexed and there is no equity to carry over. It
      // costs nothing and catches any link that was shared from a preview
      // deployment. The bare slug /redevelopment is caught by the group rule
      // above only while the slug is in SERVICE_SLUGS, which it no longer is,
      // so both forms are handled explicitly here.
      // Shops and plots became commercial and plots on 9 September 2026, with
      // the page rewritten around commercial space rather than renamed.
      { source: "/shops-plots", destination: "/services/commercial-plots", permanent: true },
      { source: "/services/shops-plots", destination: "/services/commercial-plots", permanent: true },
      {
        source: "/:locale(hi|mr|gu)/shops-plots",
        destination: "/:locale/services/commercial-plots",
        permanent: true,
      },
      {
        source: "/:locale(hi|mr|gu)/services/shops-plots",
        destination: "/:locale/services/commercial-plots",
        permanent: true,
      },
      { source: "/redevelopment", destination: "/services/investment-advisory", permanent: true },
      { source: "/services/redevelopment", destination: "/services/investment-advisory", permanent: true },
      {
        source: "/:locale(hi|mr|gu)/redevelopment",
        destination: "/:locale/services/investment-advisory",
        permanent: true,
      },
      {
        source: "/:locale(hi|mr|gu)/services/redevelopment",
        destination: "/:locale/services/investment-advisory",
        permanent: true,
      },
      // English is unprefixed under localePrefix "as-needed", so /en/* would
      // otherwise become a complete duplicate of the English site.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  images: {
    // Optimised photographs were expiring after the default sixty seconds, so
    // Vercel kept rebuilding them and pages stalled waiting. File names change
    // when a picture changes, so a month is safe.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    formats: ["image/webp"],
    // Fewer widths means fewer variants to build the first time each is seen.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [96, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
