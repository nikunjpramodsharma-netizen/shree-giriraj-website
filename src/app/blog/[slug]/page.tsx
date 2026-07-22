import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/queries";
import { PortableTextBody } from "@/components/PortableTextBody";

export const revalidate = 60;

type Post = {
  title: string;
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  body?: any;
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
  params: { slug: string };
}): Promise<Metadata> {
  const post = await client.fetch<Post>(postBySlugQuery, { slug: params.slug });
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.mainImage
      ? { images: [urlFor(post.mainImage).width(1200).height(630).url()] }
      : undefined,
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await client.fetch<Post>(postBySlugQuery, { slug: params.slug });
  if (!post) notFound();

  return (
    <article className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <Link href="/blog" className="text-sm text-brand-blue hover:underline">
          ← Back to blog
        </Link>

        {post.categories && post.categories.length > 0 && (
          <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-brass">
            {post.categories.join(" · ")}
          </div>
        )}
        <h1 className="mt-3 text-4xl text-brand-indigo md:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 text-sm text-muted">
          {post.author?.name ? `${post.author.name} · ` : ""}
          {formatDate(post.publishedAt)}
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
          <PortableTextBody value={post.body} />
        </div>
      </div>
    </article>
  );
}
