"use client";

import { useState } from "react";
import type { Check } from "@/lib/homepage-content";

/**
 * Section 02. The payoff for the hero's claim, so it sells nothing and has no
 * CTA on purpose. One open at a time keeps the sticky image beside it aligned.
 */
export function ChecksAccordion({ checks }: { checks: Check[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col">
      {checks.map((c, i) => {
        const isOpen = i === open;
        return (
          <div key={c.n} className="border-t border-line last:border-b">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-baseline gap-3.5 py-5 text-left"
              >
                <span className="pt-1 font-mono text-xs font-medium text-brass">
                  {c.n}
                </span>
                <span className="flex-1 font-display text-lg text-brand-indigo">
                  {c.title}
                </span>
                <span
                  aria-hidden="true"
                  className={`text-muted transition-transform duration-200 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>
            </h3>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="ml-[2.1rem] pb-5 text-[0.97rem] text-muted">{c.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
