"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Adds a class to its element once it scrolls into view, and nothing else.
 *
 * Every staggered entrance on the site is CSS keyed off `.in`: the cascade
 * of cards, the drawing lines, the growing bars. Keeping the trigger in one
 * tiny component and the motion in CSS means the pages stay light and the
 * reduced motion rule lives in one place (globals.css, MOTION SCENES).
 */
export function InView({
  as = "div",
  className = "",
  children,
  threshold = 0.25,
  once = true,
  style,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  threshold?: number;
  once?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          if (once) io.disconnect();
        } else if (!once) {
          el.classList.remove("in");
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  const Tag = as as ElementType;
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
