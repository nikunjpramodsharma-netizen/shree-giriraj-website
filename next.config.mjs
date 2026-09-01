import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const SERVICE_SLUGS = [
  "resale-flats",
  "rentals",
  "new-project-bookings",
  "redevelopment",
  "shops-plots",
  "interiors",
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
      // English is unprefixed under localePrefix "as-needed", so /en/* would
      // otherwise become a complete duplicate of the English site.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
