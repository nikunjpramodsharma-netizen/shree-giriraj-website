import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { projectsQuery } from "@/sanity/queries";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";
import { buildAlternates } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "projectsPage" });
  return {
    alternates: buildAlternates(params.locale, "/projects"),
    title: t("heading"),
    description: t("body"),
  };
}

type Project = {
  _id: string;
  name: string;
  slug: { current: string };
  developer?: string;
  status?: string;
  location?: string;
  area?: string;
  featured?: boolean;
  coverImage?: any;
  summary?: LocalizedValue<string>;
};

export default async function ProjectsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const [projects, t] = await Promise.all([
    client.fetch<Project[]>(projectsQuery),
    getTranslations({ locale, namespace: "projectsPage" }),
  ]);

  const statusLabel: Record<string, string> = {
    booking: t("statusBooking"),
    upcoming: t("statusUpcoming"),
    sold: t("statusSold"),
  };

  return (
    <>
      <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src="/hero-skyline.jpg"
          alt="New residential towers on the Mumbai skyline"
          fill
          priority
          sizes="100vw"
          className="hero-kenburns object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(100deg, rgba(21,27,61,.92) 0%, rgba(21,27,61,.74) 45%, rgba(21,27,61,.34) 78%, rgba(21,27,61,.55) 100%), linear-gradient(180deg, rgba(21,27,61,.5) 0%, rgba(21,27,61,0) 32%, rgba(21,27,61,.85) 100%)" }}
        />
        <div className="wrap relative z-10 py-20 md:py-28">
          <div className="eyebrow text-brass-bright">{t("eyebrow")}</div>
          <h1 className="mt-3.5 max-w-[20ch] text-4xl text-white md:text-6xl">
            {t("heading")}
          </h1>
          <p className="mt-4 max-w-[40em] text-paper/75">{t("body")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          {(!projects || projects.length === 0) && (
            <p className="text-muted">
              {t("emptyState")}
              <Link href="/studio" className="text-brand-blue underline">
                {t("studioLink")}
              </Link>
              .
            </p>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project) => (
              <Link
                key={project._id}
                href={`/projects/${project.slug.current}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                {project.coverImage && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={urlFor(project.coverImage).width(700).height(525).url()}
                      alt={project.coverImage?.alt || project.name}
                      width={700}
                      height={525}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {project.status && (
                      <span className="absolute left-3 top-3 rounded-full bg-brass px-3 py-1 text-[0.66rem] font-bold uppercase tracking-wider text-brand-indigo-deep">
                        {statusLabel[project.status] || project.status}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl text-brand-indigo">{project.name}</h2>
                  {project.location && (
                    <p className="mt-1 text-sm text-muted">{project.location}</p>
                  )}
                  {project.summary && (
                    <p className="mt-3 flex-1 text-sm text-muted line-clamp-3">
                      {getLocalizedField(project.summary, locale)}
                    </p>
                  )}
                  <span className="mt-4 text-sm font-semibold text-brand-blue">
                    {t("viewDetails")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
