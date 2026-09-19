"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * The article grid with one row of category chips above it. Everything is
 * rendered on the server first with every article showing, so search and a
 * reader without JavaScript see the whole list; the chips only hide cards.
 * Counts sit in the chips so a reader knows what is behind each one.
 */

export type BlogCard = {
  slug: string;
  title: string;
  category?: string;
  answer?: string;
  readingMinutes: number;
  image: string;
  alt: string;
};

export function BlogFilter({ cards }: { cards: BlogCard[] }) {
  const [active, setActive] = useState<string>("All");
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of cards) if (c.category) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [cards]);
  const shown = active === "All" ? cards : cards.filter((c) => c.category === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter articles by topic">
        {[["All", cards.length] as [string, number], ...categories].map(([cat, n]) => {
          const on = cat === active;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                on ? "border-brand-indigo bg-brand-indigo text-white" : "border-line bg-white text-ink/75 hover:border-brand-indigo/50 hover:text-brand-indigo"
              }`}
            >
              {cat} <span className={`ml-1 text-xs ${on ? "text-white/70" : "text-muted"}`}>{n}</span>
            </button>
          );
        })}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" key={active}>
        {shown.map((c, i) => (
          <Link prefetch={false}
            key={c.slug}
            href={`/blog/${c.slug}`}
            style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            className="scene-in group flex flex-col overflow-hidden rounded-2xl border border-brand-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={c.image} alt={c.alt} width={700} height={440} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              {c.category && <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-bronze-deep">{c.category}</div>}
              <h2 className="text-xl text-brand-indigo">{c.title}</h2>
              {c.answer && <p className="mt-2 flex-1 text-sm text-muted">{c.answer}</p>}
              <div className="mt-4 text-xs text-muted">{c.readingMinutes} min read</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
