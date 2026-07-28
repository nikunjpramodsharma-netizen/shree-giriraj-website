"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

const ROTATE_INTERVAL_MS = 6000;

type Testimonial = {
  _id: string;
  quote: LocalizedValue<string>;
  author: string;
  role?: LocalizedValue<string>;
  rating?: number;
};

export function TestimonialCarousel({
  testimonials,
  locale,
}: {
  testimonials: Testimonial[];
  locale: Locale;
}) {
  const t = useTranslations("testimonials");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[index];

  function goPrev() {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }

  function goNext() {
    setIndex((i) => (i + 1) % testimonials.length);
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <figure
        key={current._id}
        aria-live="polite"
        className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm"
      >
        <div className="mb-3 text-brass">{"★".repeat(current.rating || 5)}</div>
        <blockquote className="font-display text-lg text-brand-indigo">
          “{getLocalizedField(current.quote, locale)}”
        </blockquote>
        <figcaption className="mt-4 text-sm text-muted">
          <span className="block font-semibold text-ink">{current.author}</span>
          {getLocalizedField(current.role, locale)}
        </figcaption>
      </figure>

      {testimonials.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label={t("prevAriaLabel")}
            onClick={goPrev}
            className="rounded-full border border-brand-indigo/15 p-2 text-brand-indigo transition hover:bg-brand-indigo/5"
          >
            ←
          </button>
          <button
            type="button"
            aria-label={t("nextAriaLabel")}
            onClick={goNext}
            className="rounded-full border border-brand-indigo/15 p-2 text-brand-indigo transition hover:bg-brand-indigo/5"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
