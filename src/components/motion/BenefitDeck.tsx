"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LineIcon, type IconName } from "@/components/motion/LineIcon";

/**
 * "What you get", in one screen instead of a wall of cards.
 *
 * The short titles sit in a list on the left; one panel on the right shows
 * the detail of whichever title is lit. It walks through them on its own
 * every few seconds, with a thin bar filling under the lit title so the
 * reader can see the next change coming. Choosing a title holds it for a
 * while, then the walk resumes. Every panel is in the page for search and
 * for a reader without scripts; they share one grid cell, so the block is
 * always the height of its longest panel and never jumps.
 */
export type Benefit = { title: string; icon: IconName; body: ReactNode };

export function BenefitDeck({ items, interval = 4500 }: { items: Benefit[]; interval?: number }) {
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
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible && !hold && !still && items.length > 1;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setI((x) => (x + 1) % items.length), interval);
    return () => window.clearTimeout(t);
  }, [running, i, items.length, interval]);

  const choose = (k: number) => {
    setI(k);
    setHold(true);
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setHold(false), 9000);
  };

  return (
    <div ref={ref} className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-8">
      {/* Titles */}
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:gap-1.5" role="tablist" aria-label="What you get">
        {items.map((it, k) => {
          const on = k === i;
          return (
            <li key={k}>
              <button
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => choose(k)}
                className={`relative flex h-full w-full items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-3 text-left transition duration-300 ${
                  on ? "border-brand-indigo bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20" : "border-line bg-white text-ink hover:border-brand-indigo/40"
                }`}
              >
                <span className={`text-xs font-bold tabular-nums ${on ? "text-bronze" : "text-bronze-deep"}`}>{String(k + 1).padStart(2, "0")}</span>
                <span className="text-[0.92rem] font-semibold leading-snug">{it.title}</span>
                {on && running && (
                  <span
                    key={`${i}-bar`}
                    aria-hidden="true"
                    className="deck-bar absolute bottom-0 left-0 h-[3px] bg-bronze"
                    style={{ animationDuration: `${interval}ms` }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Panel */}
      <div className="grid rounded-2xl border border-line bg-white p-6 shadow-xl shadow-brand-indigo/5 md:p-8">
        {items.map((it, k) => (
          <div
            key={k}
            role="tabpanel"
            aria-hidden={k !== i}
            className={`col-start-1 row-start-1 flex flex-col ${k === i ? "scene-in" : "invisible"}`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-indigo text-bronze">
                <LineIcon key={k === i ? `on-${i}` : "off"} name={it.icon} className={k === i ? "deck-draw" : ""} />
              </span>
              <span className="text-xs font-semibold tabular-nums text-muted">
                {String(k + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 font-display text-xl text-brand-indigo md:text-2xl">{it.title}</h3>
            <div className="mt-3 text-[1rem] leading-relaxed text-ink/80">{it.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
