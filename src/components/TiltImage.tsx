"use client";

import { useRef } from "react";
import Image, { type ImageProps } from "next/image";

/** Wraps an image in a rounded tile that tilts subtly toward the cursor. No-op under prefers-reduced-motion. */
export function TiltImage(props: ImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 ease-out will-change-transform"
    >
      <Image {...props} />
    </div>
  );
}
