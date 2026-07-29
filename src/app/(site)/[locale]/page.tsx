import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  featuredProjectsGridQuery,
  featuredTestimonialsQuery,
  faqsQuery,
} from "@/sanity/queries";
import { site, waLink } from "@/lib/config";
import { LeadForm } from "@/components/LeadForm";
import { FAQSection } from "@/components/FAQSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";
import { getLowestPriceConfig } from "@/lib/project-helpers";

// Re-fetch content periodically so CMS edits show up without a redeploy.
export const revalidate = 60;

type Config = { type?: string; displayPrice?: string; note?: LocalizedValue<string> };
type GridProject = {
  _id: string;
  name: string;
  slug: { current: string };
  location?: string;
  coverImage?: any;
  configurations?: Config[];
};

type Testimonial = {
  _id: string;
  quote: LocalizedValue<string>;
  author: string;
  role?: LocalizedValue<string>;
  rating?: number;
};

type Faq = {
  _id: string;
  question: LocalizedValue<string>;
  answer: LocalizedValue<string>;
  category?: string;
};

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;

  const [projects, testimonials, faqs, tHero, tServices, tProjectsGrid, tTestimonials, tAreas, tFaq, tLeadForm] =
    await Promise.all([
      client.fetch<GridProject[]>(featuredProjectsGridQuery),
      client.fetch<Testimonial[]>(featuredTestimonialsQuery),
      client.fetch<Faq[]>(faqsQuery),
      getTranslations({ locale, namespace: "hero" }),
      getTranslations({ locale, namespace: "services" }),
      getTranslations({ locale, namespace: "projectsGrid" }),
      getTranslations({ locale, namespace: "testimonials" }),
      getTranslations({ locale, namespace: "areas" }),
      getTranslations({ locale, namespace: "faq" }),
      getTranslations({ locale, namespace: "leadForm" }),
    ]);

  const services = [
    { slug: "resale-flats", title: tServices("resaleTitle"), body: tServices("resaleBody") },
    { slug: "rentals", title: tServices("rentalsTitle"), body: tServices("rentalsBody") },
    { slug: "new-project-bookings", title: tServices("newProjectTitle"), body: tServices("newProjectBody") },
    { slug: "redevelopment", title: tServices("redevelopmentTitle"), body: tServices("redevelopmentBody") },
    { slug: "shops-plots", title: tServices("shopsTitle"), body: tServices("shopsBody") },
    { slug: "interiors", title: tServices("interiorsTitle"), body: tServices("interiorsBody") },
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
        <div className="wrap py-24">
          <div className="max-w-3xl">
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
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="block rounded-2xl border border-brand-indigo/10 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="text-xl text-brand-indigo">{s.title}</h3>
                <p className="mt-2.5 text-[0.96rem] text-muted">{s.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS GRID */}
      {projects && projects.length > 0 && (
        <section className="py-24">
          <div className="wrap">
            <div className="mb-13 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="eyebrow">{tProjectsGrid("eyebrow")}</div>
                <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
                  {tProjectsGrid("heading")}
                </h2>
              </div>
              <Link href="/projects" className="text-sm font-semibold text-brand-blue">
                {tProjectsGrid("viewAll")}
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {projects.map((project) => {
                const lowest = getLowestPriceConfig(project.configurations);
                return (
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
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl text-brand-indigo">{project.name}</h3>
                      {project.location && (
                        <p className="mt-1 text-sm text-muted">{project.location}</p>
                      )}
                      {lowest?.displayPrice && (
                        <p className="mt-3 font-display text-lg text-brand-indigo">
                          {lowest.displayPrice}
                        </p>
                      )}
                      <span className="mt-4 text-sm font-semibold text-brand-blue">
                        {tProjectsGrid("viewDetails")}
                      </span>
                    </div>
                  </Link>
                );
              })}
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
            <div className="mt-10">
              <TestimonialCarousel testimonials={testimonials} locale={locale} />
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

      {/* FAQ */}
      <FAQSection
        faqs={faqs}
        locale={locale}
        eyebrow={tFaq("eyebrow")}
        heading={tFaq("heading")}
      />

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
