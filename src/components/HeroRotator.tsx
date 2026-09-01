"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroSlide = { src: string; alt: string };
export type HeroOpener = { src: string; poster: string };

/**
 * Cross fading background for the hero.
 *
 * Optionally opens on a short video, which plays once and then hands over to
 * the stills. It never loops back, so the wide-to-close narrowing happens on
 * first load and the page does not replay a film at somebody reading minute
 * four.
 *
 * Only the backdrop moves. The headline and CTA sit above this and never
 * change, so nobody misses anything by scrolling before the next image.
 *
 * Timing note: HOLD_MS and FADE_MS are coupled. The fade has to finish
 * comfortably inside the hold or the images never settle and the hero reads as
 * frantic rather than calm. At a 2s hold the fade cannot exceed ~0.8s.
 */
const HOLD_MS = 2000;
const FADE_MS = 700;
const DRIFT_MS = 3000;

/** Cap on how long the opener holds the screen before the stills start. */
const OPENER_MS = 5000;

/**
 * The opener is desktop only. It is a ~4MB download, and autoplaying that on
 * Indian mobile data for something most visitors scroll past in seconds is a
 * bad trade. Set to 0 to run it on every screen size.
 */
const OPENER_MIN_WIDTH = 768;

type Phase = "deciding" | "opener" | "stills";

export function HeroRotator({
  slides,
  opener,
}: {
  slides: HeroSlide[];
  opener?: HeroOpener;
}) {
  const [phase, setPhase] = useState<Phase>("deciding");
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Index 0 is the opener when it is showing, so stills are offset by one.
  const showingOpener = phase === "opener";
  const offset = showingOpener ? 1 : 0;

  const stopRotation = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startRotation = useCallback(
    (base: number) => {
      stopRotation();
      if (slides.length < 2) return;
      timerRef.current = setInterval(() => {
        // Wrap back to the first still, never to the opener.
        setActive((i) => (i + 1 >= slides.length + base ? base : i + 1));
      }, HOLD_MS);
    },
    [slides.length, stopRotation],
  );

  // 1. Decide whether the opener runs at all. This has to settle before the
  //    video element exists in the DOM, which is why playback lives in its own
  //    effect below rather than here.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.innerWidth >= OPENER_MIN_WIDTH;
    const wantsOpener = Boolean(opener) && !reduce && wide;

    setAnimate(!reduce);
    setPhase(wantsOpener ? "opener" : "stills");
    setActive(0);

    if (!wantsOpener && !reduce) startRotation(0);
    return stopRotation;
  }, [opener, startRotation, stopRotation]);

  // 2. Once the opener is actually mounted, play it and arrange the handover.
  useEffect(() => {
    if (phase !== "opener") return;
    const video = videoRef.current;

    const handOver = () => {
      setPhase("stills");
      setActive(0);
      startRotation(0);
    };

    // Whichever lands first: the clip ending, the cap, or autoplay being
    // refused. A blocked autoplay leaves the poster up, which is a fine
    // fallback, so we just move on.
    const cap = setTimeout(handOver, OPENER_MS);
    video?.addEventListener("ended", handOver, { once: true });
    video?.play().catch(() => {
      /* autoplay refused; the cap above still hands over */
    });

    return () => {
      clearTimeout(cap);
      video?.removeEventListener("ended", handOver);
    };
  }, [phase, startRotation]);

  // Don't burn cycles or data while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        stopRotation();
        videoRef.current?.pause();
      } else if (phase === "stills" && animate) {
        startRotation(0);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [phase, animate, startRotation, stopRotation]);

  const layerStyle = (on: boolean) => ({
    opacity: on ? 1 : 0,
    filter: on ? "blur(0px)" : "blur(12px)",
    transform: on ? "scale(1.02)" : "scale(1.08)",
    transition: `opacity ${FADE_MS}ms ease, filter ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
    zIndex: on ? 2 : 1,
  });

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {opener && showingOpener && (
        <div className="absolute inset-0" style={layerStyle(true)}>
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={opener.poster}
            // autoPlay covers the browser's own path; the play() call in the
            // effect above covers the case where React mounts after the
            // browser has already decided. Muted + playsInline is what makes
            // autoplay permissible at all.
            autoPlay
            muted
            playsInline
            preload="auto"
          >
            <source src={opener.src} type="video/mp4" />
          </video>
        </div>
      )}

      {slides.map((slide, n) => {
        const on = !showingOpener && n === active;
        // The first still is the LCP element whenever the opener is not
        // carrying first paint.
        const eager = n === 0;
        return (
          <div
            key={slide.src}
            className="absolute inset-0"
            style={layerStyle(on)}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={eager}
              loading={eager ? undefined : "lazy"}
              sizes="100vw"
              className="object-cover"
              style={
                animate && on
                  ? { animation: `hero-drift ${DRIFT_MS}ms ease-out forwards` }
                  : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
}
