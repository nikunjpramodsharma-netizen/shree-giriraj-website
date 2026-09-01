import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ContactCTA } from "@/components/ContactCTA";
import { MarkdownBody } from "@/components/MarkdownBody";
import { graph, breadcrumbNode, blogPostingNode } from "@/lib/schema";
import { categoryVisual, formatDate } from "@/lib/blog";
import { displayDate, getRelated, type Post } from "@/lib/posts";

/**
 * A blog post rendered from markdown in the repo.
 *
 * Same furniture as the Sanity template: hero, answer block, table of
 * contents, sources with a checked date, related posts, then the CTA. What it
 * adds is honesty about its own state. A post that still carries review
 * markers shows a draft banner and is served noindex by the route, so it can
 * be read and corrected on the deployment without competing for its query.
 */
export function MarkdownPost({
  post,
  locale,
}: {
  post: Post;
  locale: string;
}) {
  const visual = categoryVisual(post.category ? [post.category] : undefined);
  const headings = post.blocks.filter(
    (b): b is Extract<typeof b, { t: "h2" }> => b.t === "h2",
  );
  const showToc = headings.length >= 3;
  const related = getRelated(post, 3);
  const checked = displayDate(post.sourcesCheckedOn);

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <article>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          // Only a finished post is marked up as an article. Advertising a
          // draft to Google as publishable content would undo the noindex.
          post.isReady
            ? blogPostingNode({
                locale,
                title: post.title,
                slug: post.slug,
                description: post.answer,
                image: visual.image,
                published: checked ?? new Date().toISOString(),
              })
            : null,
        )}
      />

      <header className="relative overflow-hidden bg-brand-indigo-deep text-paper">
        <Image
          src={visual.image}
          alt={visual.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
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
          {post.category && (
            <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
              {post.category}
            </div>
          )}
          <h1 className="mt-3 max-w-[24ch] text-3xl text-white md:text-5xl">
            {post.title}
          </h1>
          {/* Reading time and a checked date only. Search volume is internal
              planning data and has no business on a page a client reads. */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-paper/70">
            <span>{post.readingMinutes} min read</span>
            {checked && <span>Checked {formatDate(checked, locale)}</span>}
          </div>
        </div>
      </header>

      <div className="wrap grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_210px] lg:gap-14">
        <div className="min-w-0">
          {!post.isReady && (
            <div className="mb-8 rounded-xl border border-brass/40 bg-brass/10 px-5 py-4 text-sm text-ink">
              <b>Draft.</b> {post.openMarkers.length} item
              {post.openMarkers.length === 1 ? "" : "s"} still need attention,
              marked through the article. This page is served noindex until they
              are resolved, so it will not appear in search in this state.
            </div>
          )}

          {/* The most extracted element on the page, so it sits first and is
              complete on its own. */}
          {post.answer && (
            <div className="mb-9 rounded-r-xl border-l-[3px] border-brass bg-paper-alt px-6 py-5">
              <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
                The short answer
              </div>
              <p className="mt-2.5 max-w-[62ch] text-lg text-ink">
                {post.answer}
              </p>
            </div>
          )}

          <MarkdownBody blocks={post.blocks} />

          {post.sources.length > 0 && (
            <div className="mt-12 max-w-[68ch] rounded-xl border border-line p-5">
              <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
                Sources
                {checked && `, last checked ${formatDate(checked, locale)}`}
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {post.sources.map((s) => (
                  <li key={s.label}>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-indigo underline underline-offset-4"
                      >
                        {s.label}
                      </a>
                    ) : (
                      <span className="text-ink/70">{s.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {showToc && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-muted">
                On this page
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="text-ink/70 hover:text-brand-indigo"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <div className="wrap pb-12">
          <h2 className="text-2xl text-ink md:text-3xl">Read next</h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="group block h-full rounded-xl border border-line bg-paper p-5 transition-colors hover:bg-paper-alt"
                >
                  {r.category && (
                    <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass">
                      {r.category}
                    </div>
                  )}
                  <div className="mt-2 font-semibold text-ink group-hover:text-brand-indigo">
                    {r.title}
                  </div>
                  {r.answer && (
                    <p className="mt-2 line-clamp-3 text-sm text-ink/70">
                      {r.answer}
                    </p>
                  )}
                  {!r.isReady && (
                    <span className="mt-3 inline-block rounded-full border border-line px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-muted">
                      Draft
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ContactCTA locale={locale} formLocation={`post-${post.slug}`} />
    </article>
  );
}
