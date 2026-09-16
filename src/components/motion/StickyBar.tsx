"use client";

import { useEffect, useState } from "react";
import { site, waLink } from "@/lib/config";

/**
 * On phones, a slim WhatsApp and Call bar slides up once the reader has
 * scrolled past the hero, so the two ways to reach the firm are never more
 * than a thumb away. Hidden on wider screens where the hero buttons are in
 * view for longer and the form is a scroll away.
 */
export function StickyBar({ message, callLabel, waLabel }: { message: string; callLabel: string; waLabel: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-brand-indigo-deep/95 p-3 backdrop-blur transition-transform duration-500 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="mx-auto flex max-w-content gap-3">
        <a href={waLink(message)} target="_blank" rel="noopener" className="btn btn-wa flex-1 justify-center py-2.5 text-sm">
          {waLabel}
        </a>
        <a href={`tel:${site.phonePrimary}`} className="btn btn-brass flex-1 justify-center py-2.5 text-sm">
          {callLabel}
        </a>
      </div>
    </div>
  );
}
