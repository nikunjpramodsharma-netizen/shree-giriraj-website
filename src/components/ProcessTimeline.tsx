"use client";

import { useEffect, useRef, useState } from "react";

/** Animated step timeline: a connecting line draws in and each marker lights up in sequence once scrolled into view. */
export function ProcessTimeline({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="absolute bottom-6 left-6 top-6 w-0.5 bg-brand-indigo/10 md:hidden" />
      <div
        className="absolute left-6 top-6 w-0.5 bg-brass transition-[height] duration-1000 ease-out motion-reduce:transition-none md:hidden"
        style={{ height: visible ? "calc(100% - 3rem)" : "0%" }}
      />
      <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-brand-indigo/10 md:block" />
      <div
        className="absolute left-0 top-6 hidden h-0.5 bg-brass transition-[width] duration-1000 ease-out motion-reduce:transition-none md:block"
        style={{ width: visible ? "100%" : "0%" }}
      />
      <div className="grid gap-8 md:grid-cols-3 md:gap-10">
        {steps.map((step, i) => (
          <div
            key={step}
            className="relative flex items-start gap-4 md:flex-col md:items-center md:text-center"
          >
            <div
              className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-display text-lg font-semibold transition-all duration-500 motion-reduce:transition-none ${
                visible
                  ? "border-brass bg-brass text-brand-indigo-deep"
                  : "border-brand-indigo/15 bg-white text-muted"
              }`}
              style={{ transitionDelay: visible ? `${i * 200}ms` : "0ms" }}
            >
              {i + 1}
            </div>
            <p className="pt-2.5 text-[0.96rem] text-muted md:mt-4 md:pt-0">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
