import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  postBySlugQuery,
  postLocaleIndexQuery,
  relatedPostsQuery,
} from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { graph, blogPostingNode, breadcrumbNode, faqNode } from "@/lib/schema";
import { buildAlternates } from "@/lib/seo";
import {
  categoryVisual,
  readingMinutes,
  extractHeadings,
  formatDate,
  TOC_MIN_HEADINGS,
} from "@/lib/blog";
import {
  getLocalizedField,
  getLocalizedBody,
  availableLocales,
  type Locale,
  type LocalizedValue,
} from "@/lib/i18n-content";

export const revalidate = 60;

type LocaleIndexRow = { slug: string; locales: Locale[] };

type Source = { label?: string; url?: string };
type PostFaq = {
  _id: string;
  question: LocalizedValue<string>;
  answer: LocalizedValue<string>;
};
type RelatedPost = {
  title: string;
  slug: string;
  excerpt?: LocalizedValue<string>;
  mainImage?: any;
  categories?: string[];
};

type Post = {
  title: string;
  excerpt?: LocalizedValue<string>;
  answer?: LocalizedValue<string>;
  mainImage?: any;
  publishedAt: string;
  _updatedAt?: string;
  body?: LocalizedValue<any>;
  sources?: Source[];
  sourcesCheckedOn?: string;
  faqs?: PostFaq[];
  author?: { name: string; image?: any; bio?: string };
  categories?: string[];
};

/**
 * Only generate a locale route where the post genuinely has a body in that
 * locale. Returning bare slugs lets Next multiply them across all four
 * locales, which is what produced identical English bodies at four URLs.
 */
export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  try {
    const rows = await client.fetch<LocaleIndexRow[]>(postLocaleIndexQuery);
    return (rows || [])
      .filter((r) => (r.locales ?? []).includes(params.locale as Locale))
      .map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = await client.fetch<Post>(postBySlugQuery, { slug: params.slug });
  if (!post) return {};
  const locales = availableLocales(post.body);
  if (!locales.includes(params.locale as Locale)) return { robots: { index: false } };

  const visual = categoryVisual(post.categories);
  const ogImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : visual.image;

  return {
    alternates: buildAlternates(params.locale, `/blog/${params.slug}`, locales),
    title: post.title,
    description:
      getLocalizedField(post.answer, params.locale as Locale) ??
      getLocalizedField(post.excerpt, params.locale as Locale),
    openGraph: { images: [ogImage], type: "article" },
  };
}

export default async function PostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;
  const [post, t] = await Promise.all([
    client.fetch<Post>(postBySlugQuery, { slug: params.slug }),
    getTranslations({ locale, namespace: "blogPost" }),
  ]);
  if (!post) notFound();

  // Deliberately no English fallback. A 404 is a clean signal to Google; a
  // duplicate English body under a Marathi URL is a site wide quality problem.
  const body = getLocalizedBody(post.body, locale);
  if (!body) notFound();

  const answer = getLocalizedField(post.answer, locale);
  const visual = categoryVisual(post.categories);
  const headings = extractHeadings(body);
  const showToc = headings.length >= TOC_MIN_HEADINGS;
  const minutes = readingMinutes(body);

  const related = await client
    .fetch<{ sameCategory: RelatedPost[]; fallback: RelatedPost[] }>(relatedPostsQuery, {
      slug: params.slug,
      categoryIds: [],
    })
    .catch(() => ({ sameCategory: [], fallback: [] }));
  const readNext = (related.sameCategory?.length ? related.sameCategory : related.fallback) ?? [];

  const faqPairs = (post.faqs ?? []).map((f) => ({
    question: getLocalizedField(f.question, locale) ?? "",
    answer: getLocalizedField(f.answer, locale) ?? "",
  }));

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${params.slug}` },
  ];

  const heroSrc = post.mainImage
    ? urlFor(post.mainImage).width(1600).height(900).url()
    : visual.image;
  const heroAlt = post.mainImage?.alt || visual.alt;

  return (
    <article>
      <JsonLd
        data={graph(
          blogPostingNode({
            locale,
            title: post.title,
            slug: params.slug,
            description: answer ?? getLocalizedField(post.excerpt, locale),
            image: heroSrc,
            published: post.publishedAt,
            modified: post._updatedAt,
            authorName: post.author?.name,
          }),
          breadcrumbNode(locale, trail),
          // Only marked up because the questions are rendered below.
          faqPairs.length > 0 ? faqNode(faqPairs) : null,
        )}
      />

      {/* HERO. The post's own image always wins; the category image is the
          fallback and is chosen to match the subject, never for decoration. */}
      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src={heroSrc}
          alt={heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,27,61,.55) 0%, rgba(21,27,61,.35) 40%, rgba(21,27,61,.92) 100%)",
          }}
        />
        <div className="wrap relative py-14 md:py-20">
          <Breadcrumbs trail={trail} tone="dark" />
          {post.categories && post.categories.length > 0 && (
            <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
              {post.categories.join(" · ")}
            </div>
          )}
          <h1 className="mt-3 max-w-[22ch] text-3xl text-white md:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-paper/70">
            {post.author?.name && (
              <span className="flex items-center gap-2.5">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(64).height(64).url()}
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                )}
                <span>
                  By <b className="font-semibold text-white">{post.author.name}</b>
                </span>
              </span>
            )}
            <span>{formatDate(post.publishedAt, locale)}</span>
            {post._updatedAt && (
              <span className="text-white">
                Updated {formatDate(post._updatedAt, locale)}
              </span>
            )}
            <span>{minutes} min read</span>
          </div>
        </div>
      </header>

      <div className="wrap grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_210px] lg:gap-14">
        <div className="min-w-0">
          {/* ANSWER BLOCK. The most extracted element on the page, so it sits
              first and is complete on its own. */}
          {answer && (
            <div className="mb-9 rounded-r-xl border-l-[3px] border-brass bg-paper-alt px-6 py-5">
              <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
                The short answer
              </div>
              <p className="mt-2.5 max-w-[62ch] text-lg text-ink">{answer}</p>
            </div>
          )}

          <div className="max-w-[68ch]">
            <PortableTextBody value={body} />
          </div>

          {post.sources && post.sources.length > 0 && (
            <div className="mt-10 max-w-[68ch] rounded-xl border border-line p-5">
              <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
                Sources
                {post.sourcesCheckedOn &&
                  `, last checked ${formatDate(post.sourcesCheckedOn, locale)}`}
              </div>
              <ul className="mt-2.5 list-disc space-y-1 pl-5 text-sm text-muted">
                {post.sources.map((s) => (
                  <li key={s.url ?? s.label}>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener"
                        className="text-brand-blue underline underline-offset-2"
                      >
                        {s.label ?? s.url}
                      </a>
                    ) : (
                      s.label
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {faqPairs.length > 0 && (
            <section className="mt-10 max-w-[68ch]">
              <h2 className="font-display text-2xl text-brand-indigo">
                Common questions
              </h2>
              <dl className="mt-4">
                {faqPairs.map((f) => (
                  <div key={f.question} className="border-b border-line py-4">
                    <dt className="font-display text-lg text-brand-indigo">
                      {f.question}
                    </dt>
                    <dd className="mt-1.5 text-[0.95rem] text-muted">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* AUTHOR BOX. Named authorship is the largest E-E-A-T signal
              available and no competitor has one. Hidden until real. */}
          {post.author?.name && (
            <div className="mt-10 flex max-w-[68ch] items-start gap-4 rounded-xl border border-line bg-paper-alt p-5">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(120).height(120).url()}
                  alt=""
                  width={56}
                  height={56}
                  className="shrink-0 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-display text-lg text-brand-indigo">
                  {post.author.name}
                </div>
                {post.author.bio && (
                  <p className="mt-1 text-[0.9rem] text-muted">{post.author.bio}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* TABLE OF CONTENTS. Long posts only. */}
        {showToc && (
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-24">
              <div className="mb-3 text-[0.56rem] font-bold uppercase tracking-[0.16em] text-muted">
                On this page
              </div>
              <ul className="space-y-0.5 text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className={`block border-l-2 border-line py-1.5 text-muted hover:text-brand-indigo ${
                        h.level === 3 ? "pl-6" : "pl-3"
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>

      {/* READ NEXT, then the CTA. Deliberately in that order: a reader who has
          finished an article is likelier to read another than to enquire. */}
      <section className="bg-paper-alt py-14">
        <div className="wrap">
          {readNext.length > 0 && (
            <>
              <h2 className="font-display text-2xl text-brand-indigo">
                {t("backLink") ? "Read next" : "Read next"}
              </h2>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {readNext.slice(0, 3).map((r) => {
                  const rv = categoryVisual(r.categories);
                  const img = r.mainImage
                    ? urlFor(r.mainImage).width(760).height(490).url()
                    : rv.image;
                  return (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="group block overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative aspect-[14/9] overflow-hidden">
                        <Image
                          src={img}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        {r.categories?.[0] && (
                          <div className="text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-brass">
                            {r.categories[0]}
                          </div>
                        )}
                        <h3 className="mt-2 font-display text-lg text-brand-indigo">
                          {r.title}
                        </h3>
                        {getLocalizedField(r.excerpt, locale) && (
                          <p className="mt-1.5 text-[0.88rem] text-muted">
                            {getLocalizedField(r.excerpt, locale)}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-2xl text-brand-indigo md:text-3xl">
                Buying, renting or redeveloping in the western suburbs?
              </h2>
              <p className="mt-3 text-muted">
                Thirty years in Borivali, Kandivali and Malad. We will tell you what
                is wrong with a flat before you fall in love with it.
              </p>
            </div>
            <ContactCTA
              formLocation={`blog_${params.slug}`}
              locale={locale}
              tone="light"
            />
          </div>
        </div>
      </section>
    </article>
  );
}
