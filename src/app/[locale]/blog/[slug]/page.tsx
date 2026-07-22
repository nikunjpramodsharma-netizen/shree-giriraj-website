import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

export const revalidate = 60;

type Post = {
  title: string;
  excerpt?: LocalizedValue<string>;
  mainImage?: any;
  publishedAt: string;
  body?: LocalizedValue<any>;
  author?: { name: string; image?: any; bio?: string };
  categories?: string[];
};

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(postSlugsQuery);
    return (slugs || []).map((slug) => ({ slug }));
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
  return {
    title: post.title,
    description: getLocalizedField(post.excerpt, params.locale as Locale),
    openGraph: post.mainImage
      ? { images: [urlFor(post.mainImage).width(1200).height(630).url()] }
      : undefined,
  };
}

function formatDate(d: string, locale: string) {
  return new Date(d).toLocaleDateString(locale === "en" ? "en-IN" : locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

  return (
    <article className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <Link href="/blog" className="text-sm text-brand-blue hover:underline">
          {t("backLink")}
        </Link>

        {post.categories && post.categories.length > 0 && (
          <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-brass">
            {post.categories.join(" · ")}
          </div>
        )}
        <h1 className="mt-3 text-4xl text-brand-indigo md:text-5xl">{post.title}</h1>
        <div className="mt-4 text-sm text-muted">
          {post.author?.name ? `${post.author.name} · ` : ""}
          {formatDate(post.publishedAt, locale)}
        </div>

        {post.mainImage && (
          <Image
            src={urlFor(post.mainImage).width(1000).height(560).url()}
            alt={post.mainImage?.alt || post.title}
            width={1000}
            height={560}
            className="mt-8 w-full rounded-2xl object-cover"
            priority
          />
        )}

        <div className="mt-8">
          <PortableTextBody value={getLocalizedField(post.body, locale)} />
        </div>
      </div>
    </article>
  );
}
