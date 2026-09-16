"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Moves its child a little slower than the page as it scrolls, so a still
 * reads as a shot. Transform only, on the compositor, off under reduced
 * motion. `strength` is how many pixels the child travels across the
 * viewport; 40 is a whisper, 90 is noticeable.
 */
export function Parallax({ children, strength = 60, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 when the element's centre is at the bottom of the viewport, +1 at the top.
      const p = ((r.top + r.height / 2) / vh - 0.5) * -2;
      el.style.transform = `translate3d(0, ${(p * strength).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);
  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
