"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { ServicePanel } from "@/lib/homepage-content";

/**
 * Section 05. Deliberately not a card grid, and deliberately a different
 * mechanic from the AreaSwitcher tabs so the page does not repeat one
 * interaction pattern twice.
 *
 * Wide screens: six panels share a row, the open one takes most of the width.
 * Narrow screens: the same track goes vertical and the open panel grows in
 * height, so there is no horizontal scrolling on a phone.
 *
 * Markup note: the expand control is a button layered over the panel rather
 * than wrapping it, because the open panel contains a link and a link inside a
 * button is invalid HTML.
 */
export function ServiceTrack({ panels }: { panels: ServicePanel[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto flex max-w-content flex-col gap-1.5 px-6 md:h-[520px] md:flex-row">
      {panels.map((p, i) => {
        const isOpen = i === open;
        return (
          <div
            key={p.slug}
            className={`group relative overflow-hidden rounded-xl bg-brand-indigo-deep text-paper transition-all duration-500 ease-out md:min-h-0 ${
              isOpen ? "min-h-[380px]" : "min-h-[104px]"
            }`}
            style={{ flex: isOpen ? "4.4 1 0%" : "1 1 0%" }}
          >
            <Image
              src={p.image}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              priority={i === 0}
              className={`object-cover transition-all duration-500 ${
                isOpen
                  ? "scale-[1.04] brightness-[.72] grayscale-0"
                  : "brightness-[.55] grayscale-[.55] group-hover:brightness-[.68] group-hover:grayscale-[.2]"
              }`}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(21,27,61,.15) 0%, rgba(21,27,61,.35) 45%, rgba(21,27,61,.92) 100%)",
              }}
            />

            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-expanded={isOpen}
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brass"
            >
              <span className="sr-only">{p.title}</span>
            </button>

            <div className="pointer-events-none relative z-20 flex h-full flex-col justify-end gap-1.5 p-6">
              <span className="font-mono text-[0.64rem] tracking-[0.1em] text-brass-bright">
                {p.n}
              </span>
              <h3 className="font-display text-xl leading-tight text-white md:text-2xl">
                {p.title}
              </h3>
              <div
                className={`grid max-w-[46ch] transition-all duration-500 ${
                  isOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <b className="mb-1.5 block font-semibold text-brass-bright">{p.lead}</b>
                  <p className="text-[0.95rem] text-paper/80">{p.body}</p>
                  <Link
                    href={`/services/${p.slug}`}
                    tabIndex={isOpen ? 0 : -1}
                    className="pointer-events-auto mt-3.5 inline-block text-sm font-semibold text-brass-bright underline decoration-brass/40 underline-offset-4"
                  >
                    More on {p.title.toLowerCase()}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
