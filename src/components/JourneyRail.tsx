"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { JourneyEntry } from "@/lib/about";
import { railProgress, dotLit } from "@/lib/journey";

/**
 * A rail down the middle of the page that fills as the reader scrolls, and a
 * dated entry either side of it that lights when the fill reaches it.
 *
 * WHERE IT COMES FROM
 *
 * The owner asked for the About page of nextyn.com as the model, on
 * 9 September 2026. This is its journey rail rebuilt in this site's own
 * tokens: indigo and brass rather than navy and crimson, Geist rather than
 * their faces, the paper ground rather than white. The mechanism is theirs
 * and is worth keeping exactly, for three reasons they worked out the hard
 * way and wrote down in their source.
 *
 * 1. It is not a scroll driven stage. Nothing pins, nothing intercepts the
 *    wheel, nothing calls preventDefault. The page scrolls at whatever speed
 *    the reader's device gives them. All the rail does is report where they
 *    already are, as one number between 0 and 1 written into a CSS custom
 *    property that scales the fill. scaleY is a compositor transform, so the
 *    fill costs nothing to paint.
 *
 * 2. It reads a box position on a requestAnimationFrame rather than listening
 *    for scroll or waiting on an IntersectionObserver. A scroll listener only
 *    fires for the element it is bound to, and an observer only reports if the
 *    embedding context delivers its callbacks; both go silently inert inside a
 *    preview pane, which would leave every row at opacity zero with nothing in
 *    the console to say why. Reading a rect works in any scroll container.
 *    The cost is one rAF and a handful of rect reads per frame, and nothing is
 *    written unless the value actually changed, so a still page invalidates
 *    no style. rAF is paused by the browser whenever the tab is hidden.
 *
 * 3. It is reversible. Every row is re-evaluated each frame against the same
 *    trigger line the fill head uses, so scrolling back up unlights the years
 *    and the fill retreats. One trigger for both means the dot lights at the
 *    moment the head reaches it; two separate observers would have drifted a
 *    few hundred pixels apart.
 *
 * ONE ADDITION TO THEIR MECHANISM
 *
 * Browsers stop delivering requestAnimationFrame to a hidden tab entirely,
 * which is correct, but it also means a page scrolled while hidden (a
 * preview pane, a tab restored from the background, a programmatic scroll)
 * shows the rail wherever it last was until the next frame. So one
 * measurement also runs on mount, on scroll, on resize and when the tab
 * becomes visible. The listeners are passive, they only call the same
 * measurement the loop calls, and rAF remains the thing that makes it
 * smooth. The maths lives in src/lib/journey.ts so it can be tested.
 *
 * WHAT HAPPENS WITHOUT JAVASCRIPT
 *
 * Every hidden start state sits behind the `js` class, which this component
 * adds to the root before it does anything else. If the script never runs the
 * class is never added, and the whole thing is a static, fully readable list
 * with the rail drawn and nothing faded. Reduced motion gets the end state
 * directly: fill complete, every row lit, no transitions.
 */

/** Where on screen a row lights, as a share of the viewport height from the top. */
const TRIGGER = 0.62;

export function JourneyRail({ entries }: { entries: JourneyEntry[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const jr = root.current;
    if (!jr) return;
    const rail = jr.querySelector<HTMLElement>(".jr-rail");
    const rows = Array.from(jr.querySelectorAll<HTMLElement>(".jr-row"));
    const dots = rows.map((r) => r.querySelector<HTMLElement>(".jr-dot"));
    if (!rail) return;

    jr.classList.add("js");

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      jr.style.setProperty("--jp", "1");
      rows.forEach((r) => r.classList.add("on"));
      return;
    }

    const lit = rows.map(() => false);
    let last = -1;
    let raf = 0;

    const writeP = (p: number) => {
      if (Math.abs(p - last) <= 0.0004) return;
      last = p;
      jr.style.setProperty("--jp", p.toFixed(4));
      jr.classList.toggle("is-live", p > 0.004 && p < 0.996);
    };
    const light = (i: number, on: boolean) => {
      if (lit[i] === on) return;
      lit[i] = on;
      rows[i].classList.toggle("on", on);
    };

    const measure = () => {
      const r = rail.getBoundingClientRect();
      const vh = window.innerHeight;
      const state = railProgress(r, vh, TRIGGER);
      if (state.terminal === "after") {
        rows.forEach((_, i) => light(i, true));
        writeP(1);
        return;
      }
      if (state.terminal === "before") {
        rows.forEach((_, i) => light(i, false));
        writeP(0);
        return;
      }
      if (r.height <= 0) return;
      writeP(state.p);
      for (let i = 0; i < rows.length; i++) {
        const d = dots[i];
        if (!d) continue;
        const c = d.getBoundingClientRect();
        light(i, dotLit(c.top + c.height / 2, vh, TRIGGER));
      }
    };
    const frame = () => {
      raf = requestAnimationFrame(frame);
      measure();
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", measure);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", measure);
    };
  }, []);

  return (
    <div ref={root} className="jr">
      <div className="jr-rail" aria-hidden="true">
        <span className="jr-fill" />
        <span className="jr-head" />
      </div>
      {entries.map((e, i) => (
        <article key={e.when + e.title} className={`jr-row${i % 2 ? " alt" : ""}`}>
          <div className="jr-node" aria-hidden="true">
            <span className="jr-dot" />
          </div>
          <div className="jr-txt">
            <span className="jr-yr">{e.when}</span>
            <h3 className="jr-t">{e.title}</h3>
            <p className="jr-d">{e.body}</p>
            {e.chips.length > 0 && (
              <div className="jr-chips">
                {e.chips.map((c) => (
                  <span key={c} className="jr-chip">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="jr-art">
            <div className="jr-ph">
              <Image
                src={e.image.src}
                alt={e.image.alt}
                fill
                sizes="(min-width: 768px) 32rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
