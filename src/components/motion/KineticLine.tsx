"use client";

import { useEffect, useState } from "react";

/**
 * One line that cycles through a few alternatives with a rise and fade,
 * the way a person might finish the sentence differently each time:
 * "a 2 BHK in Chikoowadi", "a shop on L.T. Road". Under reduced motion it
 * shows the first phrase and stays.
 */
export function KineticLine({ phrases, interval = 2600, className = "" }: { phrases: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    const t = setInterval(() => setI((x) => (x + 1) % phrases.length), interval);
    return () => clearInterval(t);
  }, [phrases.length, interval]);
  return (
    <span className={`relative inline-block ${className}`} aria-live="off">
      <span key={still ? "still" : i} className="kinetic inline-block">
        {phrases[still ? 0 : i]}
      </span>
    </span>
  );
}
