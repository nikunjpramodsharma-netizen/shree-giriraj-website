import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { projectBySlugQuery, projectSlugsQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import { waLink } from "@/lib/config";

export const revalidate = 60;

type Config = { type?: string; displayPrice?: string; note?: string };
type Project = {
  name: string;
  developer?: string;
  status?: string;
  location?: string;
  rera?: string;
  coverImage?: any;
  gallery?: any[];
  summary?: string;
  configurations?: Config[];
  amenities?: string[];
  body?: any;
};

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(projectSlugsQuery);
    return (slugs || []).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await client.fetch<Project>(projectBySlugQuery, {
    slug: params.slug,
  });
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    openGraph: project.coverImage
      ? { images: [urlFor(project.coverImage).width(1200).height(630).url()] }
      : undefined,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await client.fetch<Project>(projectBySlugQuery, {
    slug: params.slug,
  });
  if (!project) notFound();

  return (
    <>
      <section className="bg-brand-indigo-deep py-16 text-paper">
        <div className="wrap grid items-center gap-12 md:grid-cols-[1fr_0.9fr]">
          <div>
            <Link
              href="/projects"
              className="text-sm text-paper/60 hover:text-white"
            >
              ← All projects
            </Link>
            <h1 className="mt-5 text-4xl md:text-5xl">{project.name}</h1>
            {project.location && (
              <p className="mt-2 text-paper/70">{project.location}</p>
            )}
            {project.developer && (
              <p className="mt-1 text-sm text-paper/60">
                Developer: {project.developer}
              </p>
            )}
            {project.summary && (
              <p className="mt-5 max-w-[40em] text-paper/80">{project.summary}</p>
            )}
            <div className="mt-7 flex flex-wrap gap-3.5">
              <a
                href={waLink(
                  `Hi Shree Giriraj, I'm interested in ${project.name}. Please share the current price sheet, floor availability and a site visit slot.`
                )}
                target="_blank"
                rel="noopener"
                className="btn btn-brass"
              >
                Get price &amp; site visit
              </a>
            </div>
            {project.rera && (
              <p className="mt-6 text-xs text-paper/50">
                MahaRERA No. {project.rera}
              </p>
            )}
          </div>

          {project.coverImage && (
            <div className="overflow-hidden rounded-2xl border border-brass/30 shadow-2xl">
              <Image
                src={urlFor(project.coverImage).width(760).height(950).url()}
                alt={project.coverImage?.alt || project.name}
                width={760}
                height={950}
                className="aspect-[4/5] w-full object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Configurations */}
      {project.configurations && project.configurations.length > 0 && (
        <section className="py-16">
          <div className="wrap">
            <div className="eyebrow">Configurations &amp; pricing</div>
            <h2 className="mt-3 text-3xl text-brand-indigo">
              Homes at {project.name}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {project.configurations.map((c, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-brand-indigo/10 bg-white p-6"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-brass">
                    {c.type}
                  </div>
                  <div className="my-2 font-display text-2xl text-brand-indigo">
                    {c.displayPrice}
                  </div>
                  <div className="text-sm text-muted">{c.note}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">
              Exact all-inclusive pricing &amp; floor-wise availability shared on
              request —{" "}
              <a
                href={waLink(
                  `Hi Shree Giriraj, please share the live price sheet for ${project.name}.`
                )}
                target="_blank"
                rel="noopener"
                className="font-medium text-brand-blue underline"
              >
                message us for the live price sheet
              </a>
              .
            </p>
          </div>
        </section>
      )}

      {/* Amenities */}
      {project.amenities && project.amenities.length > 0 && (
        <section className="bg-paper-alt py-16">
          <div className="wrap">
            <div className="eyebrow">Amenities</div>
            <h2 className="mt-3 text-3xl text-brand-indigo">
              Life at {project.name}
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {project.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-brand-indigo/15 bg-white px-4 py-2 text-sm text-brand-indigo"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      {project.body && (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <PortableTextBody value={project.body} />
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="pb-20">
          <div className="wrap">
            <div className="eyebrow">Gallery</div>
            <h2 className="mt-3 mb-8 text-3xl text-brand-indigo">Take a look</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((img, i) => (
                <Image
                  key={i}
                  src={urlFor(img).width(600).height(450).url()}
                  alt={img?.alt || `${project.name} photo ${i + 1}`}
                  width={600}
                  height={450}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
