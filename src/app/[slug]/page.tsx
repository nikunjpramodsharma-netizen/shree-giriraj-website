import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { pageBySlugQuery, pageSlugsQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";

export const revalidate = 60;

type Page = {
  title: string;
  heroHeading?: string;
  heroSubheading?: string;
  body?: any;
  seoDescription?: string;
};

// Reserved top-level routes that must NOT be handled by this catch-all.
const RESERVED = new Set(["blog", "projects", "studio"]);

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(pageSlugsQuery);
    return (slugs || [])
      .filter((slug) => !RESERVED.has(slug))
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await client.fetch<Page>(pageBySlugQuery, { slug: params.slug });
  if (!page) return {};
  return {
    title: page.title,
    description: page.seoDescription,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  if (RESERVED.has(params.slug)) notFound();

  const page = await client.fetch<Page>(pageBySlugQuery, { slug: params.slug });
  if (!page) notFound();

  return (
    <>
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
          <h1 className="text-4xl md:text-5xl">
            {page.heroHeading || page.title}
          </h1>
          {page.heroSubheading && (
            <p className="mt-4 max-w-[42em] text-lg text-paper/75">
              {page.heroSubheading}
            </p>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <PortableTextBody value={page.body} />
        </div>
      </section>
    </>
  );
}
