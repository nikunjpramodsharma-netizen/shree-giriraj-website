/**
 * Independent root layout for /studio. Kept outside the [locale] segment
 * on purpose. Sanity Studio is an authoring tool, not visitor facing
 * content, so it doesn't need locale routing, the marketing Nav/Footer,
 * or the site fonts.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
