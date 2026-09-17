"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that rolls to its new value instead of jumping. The calculators
 * recompute on every keystroke; this tweens from the last shown value to the
 * next one over a few hundred milliseconds, so a result feels weighed rather
 * than swapped. Renders the final value on the server, and shows it at once
 * under reduced motion.
 */
export function RollNumber({
  value,
  format,
  duration = 450,
  className = "",
}: {
  value: number;
  format: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!Number.isFinite(value)) {
      setShown(value);
      return;
    }
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fromRef.current = value;
      setShown(value);
      return;
    }
    const from = fromRef.current;
    if (from === value) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      const v = from + (value - from) * e;
      setShown(v);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <span className={`tabular-nums ${className}`}>{format(shown)}</span>;
}
