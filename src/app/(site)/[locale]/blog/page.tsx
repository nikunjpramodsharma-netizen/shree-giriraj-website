import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { postsQuery } from "@/sanity/queries";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";
import { buildAlternates } from "@/lib/seo";
import { categoryVisual } from "@/lib/blog";
import { getAllPosts, type Post as MdPost } from "@/lib/posts";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "blogPage" });
  return {
    alternates: buildAlternates(params.locale, "/blog"),
    title: t("heading"),
    description: t("body"),
  };
}

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: LocalizedValue<string>;
  mainImage?: any;
  publishedAt: string;
  author?: string;
  categories?: string[];
};

function formatDate(d: string, locale: string) {
  return new Date(d).toLocaleDateString(locale === "en" ? "en-IN" : locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const [posts, t] = await Promise.all([
    client.fetch<Post[]>(postsQuery).catch(() => [] as Post[]),
    getTranslations({ locale, namespace: "blogPage" }),
  ]);

  /**
   * Markdown posts are English only and live in the repo. Without this the
   * index read from Sanity alone and said "no posts published yet" while
   * thirteen drafts sat one route away, which is exactly the sort of dead end
   * the rest of the site is built to avoid.
   */
  const mdPosts: MdPost[] = locale === "en" ? getAllPosts() : [];
  const ready = mdPosts.filter((p) => p.isReady);
  const drafts = mdPosts.filter((p) => !p.isReady);
  const nothingAtAll = (!posts || posts.length === 0) && mdPosts.length === 0;

  return (
    <>
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
          <div className="eyebrow text-brass-bright">{t("eyebrow")}</div>
          <h1 className="mt-3.5 text-4xl md:text-5xl">{t("heading")}</h1>
          <p className="mt-4 max-w-[40em] text-paper/75">{t("body")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          {nothingAtAll && (
            <p className="text-muted">
              {t("emptyState")}
              <Link href="/studio" className="text-brand-blue underline">
                {t("studioLink")}
              </Link>
              .
            </p>
          )}

          {(ready.length > 0 || (posts && posts.length > 0)) && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {ready.map((p) => (
                <MarkdownCard key={p.slug} post={p} />
              ))}
              {posts?.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {post.mainImage && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={urlFor(post.mainImage).width(700).height(440).url()}
                        alt={post.mainImage?.alt || post.title}
                        width={700}
                        height={440}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.categories && post.categories.length > 0 && (
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-brass">
                        {post.categories[0]}
                      </div>
                    )}
                    <h2 className="text-xl text-brand-indigo">{post.title}</h2>
                    {post.excerpt && (
                      <p className="mt-2 flex-1 text-sm text-muted">
                        {getLocalizedField(post.excerpt, locale)}
                      </p>
                    )}
                    <div className="mt-4 text-xs text-muted">
                      {post.author ? `${post.author} · ` : ""}
                      {formatDate(post.publishedAt, locale)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Drafts are listed separately and plainly labelled. They are all
              noindex, so this section is for the owner reviewing on the
              deployment rather than for a visitor arriving from search. */}
          {drafts.length > 0 && (
            <div className={ready.length > 0 ? "mt-16" : ""}>
              <h2 className="text-2xl text-ink">In progress</h2>
              <p className="mt-2 max-w-[60ch] text-sm text-muted">
                {drafts.length} article{drafts.length === 1 ? "" : "s"} written
                and waiting on the local detail only we can add. Each is set to
                noindex until it is finished.
              </p>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
                {drafts.map((p) => (
                  <li key={p.slug} className="bg-paper">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex h-full flex-col p-5 transition-colors hover:bg-paper-alt"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-ink group-hover:text-brand-indigo">
                          {p.title}
                        </span>
                        <span className="mt-0.5 shrink-0 rounded-full border border-line px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-muted">
                          {p.openMarkers.length} open
                        </span>
                      </div>
                      {p.answer && (
                        <p className="mt-2 line-clamp-3 text-sm text-ink/70">
                          {p.answer}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function MarkdownCard({ post }: { post: MdPost }) {
  const visual = categoryVisual(post.category ? [post.category] : undefined);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={visual.image}
          alt={visual.alt}
          width={700}
          height={440}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        {post.category && (
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-brass">
            {post.category}
          </div>
        )}
        <h2 className="text-xl text-brand-indigo">{post.title}</h2>
        {post.answer && (
          <p className="mt-2 flex-1 text-sm text-muted">{post.answer}</p>
        )}
        <div className="mt-4 text-xs text-muted">
          {post.readingMinutes} min read
        </div>
      </div>
    </Link>
  );
}
