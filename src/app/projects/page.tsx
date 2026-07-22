import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { projectsQuery } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects — New launches & bookings",
  description:
    "Explore new and upcoming residential projects across Borivali, Kandivali and Malad, booking through Shree Giriraj Real Estate.",
};

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
  summary?: string;
};

const statusLabel: Record<string, string> = {
  booking: "Now Booking",
  upcoming: "Upcoming",
  sold: "Sold Out",
};

export default async function ProjectsPage() {
  const projects = await client.fetch<Project[]>(projectsQuery);

  return (
    <>
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
          <div className="eyebrow text-brass-bright">Projects</div>
          <h1 className="mt-3.5 text-4xl md:text-5xl">
            New launches &amp; bookings
          </h1>
          <p className="mt-4 max-w-[40em] text-paper/75">
            Handpicked residential projects across the western suburbs — many
            available for booking through our direct builder relationships.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          {(!projects || projects.length === 0) && (
            <p className="text-muted">
              No projects added yet. Add your first one in the{" "}
              <Link href="/studio" className="text-brand-blue underline">
                Studio
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
                      {project.summary}
                    </p>
                  )}
                  <span className="mt-4 text-sm font-semibold text-brand-blue">
                    View details →
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
