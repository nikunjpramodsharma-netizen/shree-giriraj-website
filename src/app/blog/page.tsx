import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { postsQuery } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Property insights for the western suburbs",
  description:
    "Guides, market notes and buying tips for Borivali, Kandivali and Malad from Shree Giriraj Real Estate.",
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  author?: string;
  categories?: string[];
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await client.fetch<Post[]>(postsQuery);

  return (
    <>
      <section className="bg-brand-indigo-deep py-20 text-paper">
        <div className="wrap">
          <div className="eyebrow text-brass-bright">Blog</div>
          <h1 className="mt-3.5 text-4xl md:text-5xl">
            Property insights for the western suburbs
          </h1>
          <p className="mt-4 max-w-[40em] text-paper/75">
            Practical guides on buying, selling and renting in Borivali,
            Kandivali and Malad — plus notes on the local market.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          {(!posts || posts.length === 0) && (
            <p className="text-muted">
              No posts published yet. Add your first article in the{" "}
              <Link href="/studio" className="text-brand-blue underline">
                Studio
              </Link>
              .
            </p>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                    <p className="mt-2 flex-1 text-sm text-muted">{post.excerpt}</p>
                  )}
                  <div className="mt-4 text-xs text-muted">
                    {post.author ? `${post.author} · ` : ""}
                    {formatDate(post.publishedAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
