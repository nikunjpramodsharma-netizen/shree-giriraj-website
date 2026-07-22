import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  featuredProjectQuery,
  featuredTestimonialsQuery,
} from "@/sanity/queries";
import { site, waLink } from "@/lib/config";
import { LeadForm } from "@/components/LeadForm";

// Re-fetch content periodically so CMS edits show up without a redeploy.
export const revalidate = 60;

type Config = { type?: string; displayPrice?: string; note?: string };
type FeaturedProject = {
  name: string;
  slug: { current: string };
  developer?: string;
  location?: string;
  rera?: string;
  coverImage?: any;
  summary?: string;
  configurations?: Config[];
  amenities?: string[];
} | null;

type Testimonial = {
  _id: string;
  quote: string;
  author: string;
  role?: string;
  rating?: number;
};

const services = [
  { title: "Resale flats", body: "Buy or sell ready-to-move homes across Borivali, Kandivali and Malad, with fair pricing and clear title checks." },
  { title: "Rentals", body: "Tenants and owners matched quickly — from starter homes to premium family residences, with agreements sorted." },
  { title: "New project bookings", body: "Early access to upcoming launches through our direct builder network — often before they hit the open market." },
  { title: "Redevelopment", body: "Guidance for societies and owners through redevelopment — from developer selection to occupancy." },
  { title: "Shops & plots", body: "Commercial shops, offices and plots for investors and business owners looking to expand in the suburbs." },
  { title: "Interiors & civil work", body: "Once you have the keys, our team helps with fit-outs and civil work to get your home move-in ready." },
];

export default async function HomePage() {
  const [project, testimonials] = await Promise.all([
    client.fetch<FeaturedProject>(featuredProjectQuery),
    client.fetch<Testimonial[]>(featuredTestimonialsQuery),
  ]);

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
              Your address in the western suburbs,{" "}
              <em className="italic text-brass-bright">found the right way.</em>
            </h1>
            <p className="mt-6 max-w-[30em] text-lg text-paper/80">
              For over 25 years, families across Borivali have trusted us to buy,
              sell and rent homes — and to get first access to the suburb&apos;s
              most sought-after new launches.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href="#enquire" className="btn btn-brass">Book a consultation</a>
              <a
                href={waLink("Hi Shree Giriraj, I'd like to enquire.")}
                target="_blank"
                rel="noopener"
                className="btn btn-outline border-paper/40 text-paper"
              >
                Chat on WhatsApp
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { n: "25+", l: "Years in Borivali West" },
                { n: "3", l: "Suburbs covered" },
                { n: "4.8★", l: "Client rating" },
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
                  Now Booking · Featured
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
            <div className="eyebrow">What we do</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              One team for every kind of move
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
                  Now Booking
                </span>
              </div>
            )}
            <div>
              <div className="eyebrow">Featured Launch · Now Booking Through Us</div>
              <h2 className="mb-1.5 mt-4 text-4xl md:text-5xl">{project.name}</h2>
              <p className="mb-4 text-paper/70">{project.location}</p>
              {project.summary && (
                <p className="mb-6 max-w-[38em] text-paper/80">{project.summary}</p>
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
                      <div className="text-sm text-paper/80">{c.note}</div>
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
                    `Hi Shree Giriraj, I'm interested in ${project.name}. Please share the current price sheet, floor availability and a site visit slot.`
                  )}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-brass"
                >
                  Get price &amp; site visit
                </a>
                <Link
                  href={`/projects/${project.slug.current}`}
                  className="btn btn-outline border-paper/40 text-paper"
                >
                  View project
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
            <div className="eyebrow">What clients say</div>
            <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
              Trusted by families across the suburbs
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t._id}
                  className="rounded-2xl bg-white p-8 shadow-sm"
                >
                  <div className="mb-3 text-brass">
                    {"★".repeat(t.rating || 5)}
                  </div>
                  <blockquote className="font-display text-lg text-brand-indigo">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-muted">
                    <span className="block font-semibold text-ink">{t.author}</span>
                    {t.role}
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
          <div className="eyebrow">Where we work</div>
          <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">
            Across the western suburbs
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { name: "Borivali", body: "Our home turf. Resale, rentals and redevelopment across Borivali West and East." },
              { name: "Kandivali", body: "Premium new launches and family homes off M.G. Road and Link Road." },
              { name: "Malad", body: "Growing residential and commercial options near Mindspace and the Link Road corridor." },
            ].map((a) => (
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
            <div className="eyebrow text-brass-bright">Let&apos;s talk</div>
            <h2 className="mt-3.5 text-3xl md:text-4xl">
              Tell us what you&apos;re{" "}
              <em className="italic text-brass-bright">looking for.</em>
            </h2>
            <p className="mt-4 text-paper/75">
              Share a few details and we&apos;ll get back with matching options,
              honest pricing and the next available site visit — usually the same day.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <p><a href={`tel:${site.phonePrimary}`} className="font-medium text-white">{site.phonePrimary}</a> · <a href={`tel:${site.phoneSecondary}`} className="font-medium text-white">{site.phoneSecondary}</a></p>
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
