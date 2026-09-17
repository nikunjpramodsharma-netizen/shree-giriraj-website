"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Scene = {
  title: string;
  text: string;
  image?: { src: string; alt: string };
  /** Small line above the title, e.g. "West" or a rate. */
  kicker?: string;
};

/**
 * A panel that changes on its own every two seconds with a crossfade. It
 * never stops for a hovering cursor; a touch holds it for five seconds. The dots beneath show
 * where in the sequence it is; tapping one jumps there. Under reduced motion
 * it shows the first scene and the dots still work.
 */
export function AutoScene({
  scenes,
  interval = 2000,
  tone = "light",
  aspect = "aspect-[4/3]",
  stacked = false,
}: {
  scenes: Scene[];
  interval?: number;
  tone?: "light" | "dark";
  aspect?: string;
  /** Image above the text instead of beside it, for a narrow column. */
  stacked?: boolean;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible || scenes.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % scenes.length), interval);
    return () => clearInterval(t);
  }, [paused, visible, scenes.length, interval]);

  const dark = tone === "dark";
  const s = scenes[i];

  return (
    <div
      ref={ref}
      onTouchStart={() => {
        // A touch holds the card for a few seconds so it can be read, then
        // the rotation picks up again on its own.
        setPaused(true);
        window.setTimeout(() => setPaused(false), 5000);
      }}
      className={`overflow-hidden rounded-2xl border ${dark ? "border-white/10 bg-white/5" : "border-line bg-white"}`}
    >
      <div className={stacked ? "grid" : "grid md:grid-cols-[1.1fr_.9fr]"}>
        <div className={stacked ? "relative aspect-[16/9]" : `relative ${aspect} md:aspect-auto md:min-h-[260px]`}>
          {scenes.map((sc, k) =>
            sc.image ? (
              <Image
                key={sc.title}
                src={sc.image.src}
                alt={k === i ? sc.image.alt : ""}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover transition-opacity duration-700"
                style={{ opacity: k === i ? 1 : 0 }}
              />
            ) : null,
          )}
        </div>
        <div className={`flex flex-col justify-between p-6 md:p-7 ${stacked ? "min-h-[15rem]" : ""}`}>
          <div key={s.title} className="scene-in">
            {s.kicker && (
              <div className={`text-[0.62rem] font-bold uppercase tracking-[0.16em] ${dark ? "text-brass-bright" : "text-brass"}`}>
                {s.kicker}
              </div>
            )}
            <h3 className={`mt-2 font-display text-xl ${dark ? "text-white" : "text-brand-indigo"} md:text-2xl`}>{s.title}</h3>
            <p className={`mt-3 text-[0.97rem] ${dark ? "text-paper/80" : "text-ink/80"}`}>{s.text}</p>
          </div>
          <div className="mt-6 flex items-center gap-2" role="tablist">
            {scenes.map((sc, k) => (
              <button
                key={sc.title}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={sc.title}
                onClick={() => {
                  setI(k);
                  setPaused(true);
                  window.setTimeout(() => setPaused(false), 5000);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  k === i ? "w-7 bg-brass" : `w-2.5 ${dark ? "bg-white/25" : "bg-brand-indigo/15"}`
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
