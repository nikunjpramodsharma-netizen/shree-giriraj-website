/**
 * A project with no cover of its own still opens on a photograph, and each
 * gets a different one. The project's page and its slide on the homepage use
 * the same picture on purpose: it is that project's picture. The real cover
 * replaces it the moment one is uploaded to the CMS.
 */
export const PROJECT_FALLBACK: Record<string, string> = {
  "the-landmark-borivali-west": "/premium/p/p1.jpg",
  "veena-celestia": "/premium/p/p3.jpg",
  "luxury-living-punit-nagar": "/premium/p/p4.jpg",
  "blissful-living": "/premium/p/p5.jpg",
  "jaswanti-jewel": "/premium/p/p7.jpg",
};

export function projectFallback(slug: string): string {
  return PROJECT_FALLBACK[slug] ?? "/premium/u/tower-07.jpg";
}
