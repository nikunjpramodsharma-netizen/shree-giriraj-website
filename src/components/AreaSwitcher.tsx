"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { AREA_PAGES_READY, type AreaPanel } from "@/lib/homepage-content";

/**
 * Section 03. Sits third rather than seventh because "do you cover where I am
 * looking" is the earliest real question a visitor has, and because this is the
 * main internal link hub into the area pages.
 */
export function AreaSwitcher({ panels }: { panels: AreaPanel[] }) {
  const [active, setActive] = useState(0);
  const panel = panels[active];

  return (
    <div>
      <div className="mb-7 flex flex-wrap gap-2.5" role="tablist" aria-label="Choose a suburb">
        {panels.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              i === active
                ? "border-brass bg-brass text-brand-indigo-deep"
                : "border-paper/30 text-paper/80 hover:border-paper/60"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-[1.1fr_.9fr] md:items-center md:gap-12">
        <div>
          <h3 className="font-display text-2xl text-white md:text-3xl">{panel.name}</h3>
          <p className="mt-3.5 text-paper/70">{panel.body}</p>

          <dl className="mt-6 flex flex-wrap gap-8 border-t border-paper/15 pt-5">
            {panel.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-xl text-white">{s.value}</dd>
                <dd className="text-xs uppercase tracking-[0.1em] text-paper/55">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 border-l-2 border-brass pl-3.5 text-[0.94rem] text-paper/70">
            <b className="text-white">What to watch:</b> {panel.watch}
          </p>

          {AREA_PAGES_READY && (
            <Link
              href={`/areas/${panel.slug}`}
              className="btn btn-outline mt-6 border-paper/40 text-paper"
            >
              See {panel.name} in detail
            </Link>
          )}
        </div>

        <div className="relative aspect-[11/8] overflow-hidden rounded-xl">
          {panels.map((p, i) => (
            <Image
              key={p.slug}
              src={p.image}
              alt={`Property in ${p.name}`}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover transition-opacity duration-500"
              style={{ opacity: i === active ? 1 : 0 }}
              priority={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
