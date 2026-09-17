"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * A short, silent, looping clip behind a page hero, with a still as the
 * fallback.
 *
 * The still is the page. It renders at once through next/image, sized and
 * cached like every other picture. The clip is decoration and is treated as
 * such: it is not in the page at all until the page has finished loading and
 * the browser is idle, and it never loads on a small screen, on a connection
 * that reports itself slow or metered, or under reduced motion. That keeps
 * one to three megabytes of video out of the way of everything the reader
 * came for.
 */
export function HeroVideo({
  src,
  poster,
  alt,
  priority = true,
}: {
  src: string;
  poster: string;
  alt: string;
  priority?: boolean;
}) {
  const [play, setPlay] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;
    const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (c?.saveData || (c?.effectiveType && /(^|-)2g|3g/.test(c.effectiveType))) return;

    let idle = 0;
    let timer = 0;
    const start = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idle = ric(() => setPlay(true), { timeout: 2500 });
      else timer = window.setTimeout(() => setPlay(true), 1200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (timer) window.clearTimeout(timer);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idle && cic) cic(idle);
    };
  }, []);

  return (
    <>
      <Image src={poster} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" />
      {play && (
        <video
          className="hv-video absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </>
  );
}
