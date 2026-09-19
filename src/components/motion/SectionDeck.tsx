"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The middle of a service page in one block. Each section used to be a full
 * screen of its own, text on one side and a photograph on the other, stacked
 * three or four deep. Here their headings are tabs across the top, and one
 * panel beneath shows the chosen section with its photograph. It moves on by
 * itself at a reading pace, a bar under the lit tab shows the change coming,
 * and choosing a tab holds it. All the text stays in the page; the panels
 * share one grid cell so the block is as tall as its longest section, once.
 */
export type DeckSection = { id: string; heading: string; body: ReactNode; image: { src: string; alt: string } };

export function SectionDeck({ sections, interval = 9000 }: { sections: DeckSection[]; interval?: number }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [visible, setVisible] = useState(false);
  const [still, setStill] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const holdTimer = useRef(0);

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

  // A link to one of these sections (from the contents or another page) opens it.
  useEffect(() => {
    const open = () => {
      const k = sections.findIndex((s) => `#${s.id}` === window.location.hash);
      if (k >= 0) {
        setI(k);
        setHold(true);
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [sections]);

  const running = visible && !hold && !still && sections.length > 1;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setI((x) => (x + 1) % sections.length), interval);
    return () => window.clearTimeout(t);
  }, [running, i, sections.length, interval]);

  const choose = (k: number) => {
    setI(k);
    setHold(true);
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setHold(false), 25000);
  };

  return (
    <div ref={ref}>
      {sections.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2" role="tablist">
          {sections.map((s, k) => {
            const on = k === i;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => choose(k)}
                className={`relative overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
                  on ? "border-brand-indigo bg-brand-indigo text-white" : "border-line bg-white text-ink/75 hover:border-brand-indigo/40 hover:text-brand-indigo"
                }`}
              >
                {s.heading}
                {on && running && (
                  <span key={`${i}-bar`} aria-hidden="true" className="deck-bar absolute bottom-0 left-0 h-[3px] bg-bronze" style={{ animationDuration: `${interval}ms` }} />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid items-stretch gap-8 rounded-3xl border border-line bg-white p-6 shadow-xl shadow-brand-indigo/5 md:grid-cols-[1.1fr_.9fr] md:gap-10 md:p-9">
        <div className="grid">
          {sections.map((s, k) => (
            <div key={s.id} id={s.id} role="tabpanel" aria-hidden={k !== i} className={`col-start-1 row-start-1 scroll-mt-28 ${k === i ? "scene-in" : "invisible"}`}>
              <h2 className="text-2xl text-brand-indigo md:text-3xl">{s.heading}</h2>
              {s.body}
            </div>
          ))}
        </div>
        <div className="relative min-h-[220px] overflow-hidden rounded-2xl md:min-h-[320px]">
          {sections.map((s, k) =>
            k === i || k === (i + 1) % sections.length || k === (i - 1 + sections.length) % sections.length ? (
            <Image
              key={s.id}
              src={s.image.src}
              alt={k === i ? s.image.alt : ""}
              fill
              sizes="(min-width: 1024px) 480px, (min-width: 768px) 40vw, 100vw"
              className="object-cover transition-opacity duration-700"
              style={{ opacity: k === i ? 1 : 0 }}
            />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
