import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AREA_PHOTO_CREDITS } from "@/lib/area-photo-credits";
import { pageUrls } from "@/lib/seo";

/**
 * /photo-credits. The photographs of real places on the area pages come from
 * Wikimedia Commons under licences that require the photographer to be named.
 * They are named here, once, instead of on the photographs themselves. The
 * page is English only and kept out of search; it exists to honour the
 * licences, not to be found.
 */
const LOCALE = "en";

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return params.locale === LOCALE ? [{}] : [];
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (params.locale !== LOCALE) return {};
  return {
    title: "Photo credits",
    description: "Photographers and licences for the photographs of Borivali, Kandivali and Malad used on this site.",
    robots: { index: false, follow: true },
    ...pageUrls(params.locale, "/photo-credits", [LOCALE]),
  };
}

export default function PhotoCreditsPage({ params }: { params: { locale: string } }) {
  if (params.locale !== LOCALE) notFound();
  const photos = Object.values(AREA_PHOTO_CREDITS);
  return (
    <article className="wrap py-16">
      <h1 className="text-3xl text-brand-indigo md:text-4xl">Photo credits</h1>
      <p className="mt-4 max-w-[62ch] text-ink/75">
        Some photographs of places on this site come from Wikimedia Commons and are used under the licences shown, resized and
        recompressed. Our thanks to the photographers. All other photographs are used under the Pexels licence.
      </p>
      <ul className="mt-8 max-w-[62ch] divide-y divide-line border-y border-line text-sm">
        {photos.map((ph) => (
          <li key={ph.src} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
            <a href={ph.page} target="_blank" rel="noopener noreferrer" className="text-brand-indigo underline underline-offset-4">
              {ph.artist}
            </a>
            <a href={ph.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-ink/70 underline underline-offset-4">
              {ph.license}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
