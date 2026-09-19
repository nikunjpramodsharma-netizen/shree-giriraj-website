"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Every project, one at a time, across the full width of the homepage. It
 * turns every two seconds and stops the moment a cursor rests on it, a
 * finger touches it or a control inside it takes focus, so whoever is reading
 * a slide can finish it; it starts again when they leave. All the slides are
 * in the page and share one grid cell, so the section keeps one height. Only
 * the picture on show and its neighbours are fetched.
 */
export type ProjectSlide = {
  slug: string;
  name: string;
  location?: string;
  image: string;
  configs: { type: string; price?: string }[];
};

export function ProjectCarousel({
  slides,
  labels,
  interval = 2000,
}: {
  slides: ProjectSlide[];
  labels: { eyebrow: string; note: string; see: string; viewAll: string };
  interval?: number;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [still, setStill] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const n = slides.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || still || !visible || n < 2) return;
    const t = window.setTimeout(() => setI((x) => (x + 1) % n), interval);
    return () => window.clearTimeout(t);
  }, [paused, still, visible, i, n, interval]);

  if (n === 0) return null;
  const near = (k: number) => k === i || k === (i + 1) % n || k === (i - 1 + n) % n;
  const running = !paused && !still && visible && n > 1;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-brand-indigo-deep text-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => window.setTimeout(() => setPaused(false), 4000)}
      aria-roledescription="carousel"
    >
      <div className="absolute inset-0">
        {slides.map((s, k) =>
          near(k) ? (
            <Image
              key={s.slug}
              src={s.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover transition-opacity duration-700"
              style={{ opacity: k === i ? 0.4 : 0 }}
            />
          ) : null,
        )}
      </div>

      <div className="wrap relative py-20 md:py-24">
        <div className="grid">
          {slides.map((s, k) => (
            <div key={s.slug} aria-hidden={k !== i} className={`col-start-1 row-start-1 max-w-3xl ${k === i ? "scene-in" : "invisible"}`}>
              <span className="inline-block rounded-sm bg-bronze px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-brand-indigo-deep">
                {labels.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl text-white md:text-5xl">{s.name}</h2>
              {s.location && <p className="mt-2 text-paper/70">{s.location}</p>}

              {s.configs.length > 0 && (
                <div className="mt-7 grid max-w-2xl grid-cols-2 gap-2.5 md:grid-cols-4">
                  {s.configs.slice(0, 4).map((c, ci) => (
                    <div key={`${c.type}-${ci}`} className="rounded-lg border border-bronze/25 bg-white/5 p-3.5">
                      <div className="text-[0.62rem] uppercase tracking-[0.12em] text-bronze">{c.type}</div>
                      {c.price && <div className="mt-1 font-display text-base text-white">{c.price}</div>}
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-6 max-w-[52ch] text-[0.84rem] text-paper/50">{labels.note}</p>

              <div className="mt-6 flex flex-wrap gap-3.5">
                <Link prefetch={false} href={`/projects/${s.slug}`} tabIndex={k === i ? 0 : -1} className="btn btn-brass">
                  {labels.see}
                </Link>
                <Link prefetch={false} href="/projects" tabIndex={k === i ? 0 : -1} className="btn btn-outline border-paper/40 text-paper">
                  {labels.viewAll}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {n > 1 && (
          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Projects">
              {slides.map((s, k) => (
                <button
                  key={s.slug}
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  aria-label={s.name}
                  onClick={() => setI(k)}
                  className={`relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all ${k === i ? "w-10" : "w-3 hover:bg-white/50"}`}
                >
                  {k === i && running && (
                    <span key={`bar-${i}`} aria-hidden="true" className="deck-bar absolute inset-y-0 left-0 bg-bronze" style={{ animationDuration: `${interval}ms` }} />
                  )}
                  {k === i && !running && <span aria-hidden="true" className="absolute inset-0 bg-bronze" />}
                </button>
              ))}
            </div>
            <span className="text-xs tabular-nums text-paper/55">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
