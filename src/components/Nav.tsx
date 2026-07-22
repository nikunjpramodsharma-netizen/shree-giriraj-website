"use client";

import Link from "next/link";
import { useState } from "react";
import { site, waLink } from "@/lib/config";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-indigo/10 bg-paper/85 backdrop-blur">
      <div className="wrap flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* Replace with your logo image once added to /public */}
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold text-brand-indigo">
              Shree Giriraj
            </span>
            <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              Real Estate · Est. {site.established}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-brand-indigo/80 transition hover:text-brand-indigo"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={waLink(
              "Hi Shree Giriraj, I'd like to know more about properties in the western suburbs."
            )}
            target="_blank"
            rel="noopener"
            className="btn btn-wa"
          >
            Enquire Now
          </a>
        </nav>

        <button
          className="p-2 md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-brand-indigo" />
            <span className="block h-0.5 w-6 bg-brand-indigo" />
            <span className="block h-0.5 w-6 bg-brand-indigo" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-b border-brand-indigo/10 bg-paper px-6 py-5 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-brand-indigo"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={waLink("Hi Shree Giriraj, I'd like to enquire.")}
            target="_blank"
            rel="noopener"
            className="btn btn-wa w-fit"
          >
            Enquire Now
          </a>
        </nav>
      )}
    </header>
  );
}
