import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  featuredProjectQuery,
  featuredTestimonialsQuery,
} from "@/sanity/queries";
import { site, waLink } from "@/lib/config";
import { LeadForm } from "@/components/LeadForm";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

// Re-fetch content periodically so CMS edits show up without a redeploy.
export const revalidate = 60;

type Config = { type?: string; displayPrice?: string; note?: LocalizedValue<string> };
type FeaturedProject = {
  name: string;
  slug: { current: string };
  developer?: string;
  location?: string;
  rera?: string;
  coverImage?: any;
  summary?: LocalizedValue<string>;
  configurations?: Config[];
  amenities?: string[];
} | null;

type Testimonial = {
  _id: string;
  quote: LocalizedValue<string>;
  author: string;
  role?: LocalizedValue<string>;
  rating?: number;
};

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;

  const [project, testimonials, tHero, tServices, tFeatured, tTestimonials, tAreas, tLeadForm] =
    await Promise.all([
      client.fetch<FeaturedProject>(featuredProjectQuery),
      client.fetch<Testimonial[]>(featuredTestimonialsQuery),
      getTranslations({ locale, namespace: "hero" }),
      getTranslations({ locale, namespace: "services" }),
      getTranslations({ locale, namespace: "featuredProject" }),
      getTranslations({ locale, namespace: "testimonials" }),
      getTranslations({ locale, namespace: "areas" }),
      getTranslations({ locale, namespace: "leadForm" }),
    ]);

  const services = [
    { title: tServices("resaleTitle"), body: tServices("resaleBody") },
    { title: tServices("rentalsTitle"), body: tServices("rentalsBody") },
    { title: tServices("newProjectTitle"), body: tServices("newProjectBody") },
    { title: tServices("redevelopmentTitle"), body: tServices("redevelopmentBody") },
    { title: tServices("shopsTitle"), body: tServices("shopsBody") },
    { title: tServices("interiorsTitle"), body: tServices("interiorsBody") },
  ];

  const areas = [
    { name: "Borivali", body: tAreas("borivaliBody") },
    { name: "Kandivali", body: tAreas("kandivaliBody") },
    { name: "Malad", body: tAreas("maladBody") },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <div className="wrap grid items-center gap-10 py-24 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="eyebrow text-brass-bright">
              {site.areas.join(" · ")}
            </div>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl md:text-6xl">
              {tHero("headingPart1")}
              <em className="italic text-brass-bright">{tHero("headingEm")}</em>
            </h1>
            <p className="mt-6 max-w-[30em] text-lg text-paper/80">{tHero("body")}</p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href="#enquire" className="btn btn-brass">{tHero("ctaBook")}</a>
              <a
                href={waLink(tHero("whatsappMessage"))}
                target="_blank"
                rel="noopener"
                className="btn btn-outline border-paper/40 text-paper"
              >
                {tHero("ctaWhatsapp")}
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { n: "25+", l: tHero("statYears") },
                { n: "3", l: tHero("statSuburbs") },
                { n: "4.8★", l: tHero("statRating") },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-semibold text-white">{s.n}</div>
                  <div className="text-sm text-paper/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {project?.coverImage && (
            <div className="relative overflow-hidden rounded-2xl border border-brass/35 shadow-2xl">
              <Image
                src={urlFor(project.coverImage).width(800).height(1050).url()}
                alt={project.coverImage?.alt || project.name}
                width={800}
                height={1050}
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-xl border border-brass/40 bg-brand-indigo-deep/75 p-4 backdrop-blur">
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-brass-bright">
                  {tHero("featuredBadge")}
                </div>
                <div className="mt-0.5 font-display text-xl text-white">{project.name}</div>
                <div className="text-sm text-paper/70">{project.location}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24">
        <div className="wrap">
          <div className="mb-13 max-w-2xl">
            <div className="eyebrow">{tServices("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              {tServices("heading")}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-brand-indigo/10 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="text-xl text-brand-indigo">{s.title}</h3>
                <p className="mt-2.5 text-[0.96rem] text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECT */}
      {project && (
        <section className="relative overflow-hidden bg-brand-indigo-deep text-paper">
          <div className="wrap grid items-center gap-14 py-24 md:grid-cols-[0.82fr_1.18fr]">
            {project.coverImage && (
              <div className="relative overflow-hidden rounded-2xl border border-brass/30 shadow-2xl">
                <Image
                  src={urlFor(project.coverImage).width(760).height(1000).url()}
                  alt={project.coverImage?.alt || project.name}
                  width={760}
                  height={1000}
                  className="aspect-[3/4] w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-brass px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-brand-indigo-deep">
                  {tFeatured("nowBooking")}
                </span>
              </div>
            )}
            <div>
              <div className="eyebrow">{tFeatured("eyebrow")}</div>
              <h2 className="mb-1.5 mt-4 text-4xl md:text-5xl">{project.name}</h2>
              <p className="mb-4 text-paper/70">{project.location}</p>
              {project.summary && (
                <p className="mb-6 max-w-[38em] text-paper/80">
                  {getLocalizedField(project.summary, locale)}
                </p>
              )}

              {project.configurations && project.configurations.length > 0 && (
                <div className="mb-7 grid gap-3 sm:grid-cols-2">
                  {project.configurations.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-brass/20 bg-white/5 p-4 transition hover:border-brass hover:bg-brass/5"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-brass-bright">
                        {c.type}
                      </div>
                      <div className="my-1.5 font-display text-lg text-white">
                        {c.displayPrice}
                      </div>
                      <div className="text-sm text-paper/80">
                        {getLocalizedField(c.note, locale)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {project.amenities && project.amenities.length > 0 && (
                <div className="mb-7 flex flex-wrap gap-2">
                  {project.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-paper/80"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3.5">
                <a
                  href={waLink(
                    `${tFeatured("whatsappPrefix")} ${project.name}. ${tFeatured("whatsappSuffix")}`
                  )}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-brass"
                >
                  {tFeatured("ctaPrice")}
                </a>
                <Link
                  href={`/projects/${project.slug.current}`}
                  className="btn btn-outline border-paper/40 text-paper"
                >
                  {tFeatured("ctaView")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-paper-alt py-24">
          <div className="wrap">
            <div className="eyebrow">{tTestimonials("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              {tTestimonials("heading")}
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure key={testimonial._id} className="rounded-2xl bg-white p-8 shadow-sm">
                  <div className="mb-3 text-brass">{"★".repeat(testimonial.rating || 5)}</div>
                  <blockquote className="font-display text-lg text-brand-indigo">
                    “{getLocalizedField(testimonial.quote, locale)}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-muted">
                    <span className="block font-semibold text-ink">{testimonial.author}</span>
                    {getLocalizedField(testimonial.role, locale)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AREAS */}
      <section className="py-24">
        <div className="wrap">
          <div className="eyebrow">{tAreas("eyebrow")}</div>
          <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
            {tAreas("heading")}
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {areas.map((a) => (
              <div key={a.name} className="rounded-2xl border border-brand-indigo/10 bg-white p-8">
                <h3 className="text-xl text-brand-indigo">{a.name}</h3>
                <p className="mt-2 text-sm text-muted">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="enquire" className="bg-brand-indigo-deep text-paper">
        <div className="wrap grid items-center gap-14 py-24 md:grid-cols-2">
          <div>
            <div className="eyebrow text-brass-bright">{tLeadForm("eyebrow")}</div>
            <h2 className="mt-3.5 text-3xl md:text-4xl">
              {tLeadForm("headingPart1")}
              <em className="italic text-brass-bright">{tLeadForm("headingEm")}</em>
            </h2>
            <p className="mt-4 text-paper/75">{tLeadForm("body")}</p>
            <div className="mt-6 space-y-3 text-sm">
              <p>
                <a href={`tel:${site.phonePrimary}`} className="font-medium text-white">{site.phonePrimary}</a>{" "}
                ·{" "}
                <a href={`tel:${site.phoneSecondary}`} className="font-medium text-white">{site.phoneSecondary}</a>
              </p>
              <p><a href={`mailto:${site.email}`} className="text-white">{site.email}</a></p>
              <p className="text-paper/70">{site.address}</p>
            </div>
          </div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
