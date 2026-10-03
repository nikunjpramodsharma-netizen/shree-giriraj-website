"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Img } from "@/lib/projects/jaswanti-jewel";

/**
 * The moving parts of a project page. Everything here is transform and
 * opacity only, honours prefers-reduced-motion, and renders its final state
 * in the server markup so nothing important waits on JavaScript.
 */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Small caption that labels every project image honestly. */
export function ImgNote({ note, dark = true }: { note?: string; dark?: boolean }) {
  if (!note) return null;
  return (
    <span
      className={`pointer-events-none absolute bottom-2 right-2 rounded px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider ${
        dark ? "bg-black/45 text-white/85" : "bg-white/80 text-ink/70"
      }`}
    >
      {note}
    </span>
  );
}

/**
 * Hero media: the tower at dusk with a slow push in on wide screens, and a
 * muted loop from the vertical sample flat video on phones, which was shot
 * upright and fills a phone screen.
 */
export function HeroMedia({ still, loop }: { still: Img; loop: string }) {
  const reduced = useReducedMotion();
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 767px)");
    setPhone(m.matches);
    const on = () => setPhone(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden md:left-[38%]">
      <Image
        src={still.src}
        alt={still.alt}
        fill
        priority
        sizes="100vw"
        className="hero-kenburns object-cover object-[50%_30%]"
      />
      {phone && !reduced && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={loop}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/** Adds `.in` once the element is on screen; the CSS does the rest. */
function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/**
 * A day at the project: the picture stays pinned while short chapters scroll
 * past, and the picture crossfades to match the chapter in view. On phones
 * each chapter carries its own picture instead.
 */
export function StoryScroll({ steps }: { steps: { img: Img; title: string; text: string }[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-14">
      <div className="relative hidden md:block">
        <div className="sticky top-24 aspect-[4/5] overflow-hidden rounded-2xl bg-brand-indigo-deep shadow-2xl">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`absolute inset-0 transition-all duration-[1100ms] ease-out ${
                i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
              }`}
            >
              <Image src={s.img.src} alt={s.img.alt} fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
              <ImgNote note={s.img.note} />
            </div>
          ))}
          <div className="absolute left-4 top-4 flex gap-1.5">
            {steps.map((s, i) => (
              <span key={s.title} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-bronze" : "w-3 bg-white/50"}`} />
            ))}
          </div>
        </div>
      </div>
      <div>
        {steps.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-i={i}
            className="flex flex-col justify-center py-7 md:min-h-[80vh] md:py-8"
          >
            <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl md:hidden">
              <Image src={s.img.src} alt={s.img.alt} fill sizes="100vw" className="object-cover" />
              <ImgNote note={s.img.note} />
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-bronze">{String(i + 1).padStart(2, "0")}</div>
            <h3
              className={`mt-2 font-display text-3xl text-white transition-all duration-700 md:text-4xl ${
                i === active ? "opacity-100" : "md:opacity-40"
              }`}
            >
              {s.title}
            </h3>
            <p className={`mt-3 max-w-md text-lg text-paper/75 transition-opacity duration-700 ${i === active ? "opacity-100" : "md:opacity-40"}`}>
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A slim tower beside the page that fills floor by floor as the visitor
 * scrolls the section, with markers at the club and the rooftop.
 */
export function TowerClimb({ floors = 38, markers }: { floors?: number; markers: { floor: number; label: string }[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      setP(1);
      return;
    }
    const on = () => {
      const el = ref.current?.parentElement;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.4;
      const done = Math.min(Math.max((window.innerHeight * 0.6 - r.top) / Math.max(total, 1), 0), 1);
      setP(done);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [reduced]);
  const lit = Math.round(p * floors);
  return (
    <div ref={ref} className="pointer-events-none sticky top-28 hidden h-[70vh] w-24 shrink-0 lg:block" aria-hidden="true">
      <div className="relative mx-auto flex h-full w-8 flex-col-reverse gap-[2px] rounded-t-md border border-bronze/40 p-[3px]">
        {Array.from({ length: floors }, (_, i) => (
          <span key={i} className={`flex-1 rounded-[1px] transition-colors duration-300 ${i < lit ? "bg-bronze" : "bg-white/10"}`} />
        ))}
        {markers.map((m) => (
          <span
            key={m.label}
            className={`absolute left-10 whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-wider transition-opacity duration-500 ${
              lit >= m.floor ? "text-bronze opacity-100" : "text-white/40 opacity-60"
            }`}
            style={{ bottom: m.floor >= floors ? "calc(100% + 6px)" : `${(m.floor / floors) * 100}%` }}
          >
            {m.label}
          </span>
        ))}
      </div>
      <div className="mt-2 text-center font-display text-sm text-bronze">{lit === floors ? "Rooftop" : `Floor ${lit}`}</div>
    </div>
  );
}

/** Full screen viewer for a set of images. */
function Lightbox({ images, index, onClose, onMove }: { images: Img[]; index: number; onClose: () => void; onMove: (d: number) => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [onClose, onMove]);
  const img = images[index];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="relative h-[80vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-contain" />
        <ImgNote note={img.note} />
      </div>
      <button aria-label="Close" onClick={onClose} className="absolute right-5 top-5 h-11 w-11 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">
        ×
      </button>
      <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); onMove(-1); }} className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">
        ‹
      </button>
      <button aria-label="Next" onClick={(e) => { e.stopPropagation(); onMove(1); }} className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">
        ›
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/70">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

/**
 * One large picture per amenity. Cards rise in as they arrive, the picture
 * eases in on hover, a tap opens the full screen viewer, and on phones the
 * row swipes sideways.
 */
/**
 * Laptop layout on a four column grid so every group fills its rows with no
 * holes: five or more is one large card and the rest in pairs, three is one
 * large and two wide, two is two halves, one is the full width.
 */
function bento(k: number, n: number) {
  if (n === 1) return "md:col-span-4 md:row-span-2";
  if (n === 2) return "md:col-span-2 md:row-span-2";
  if (n === 3) return k === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-2";
  if (n === 4) return "md:col-span-2";
  return k === 0 ? "md:col-span-2 md:row-span-2" : "";
}

export function AmenityCards({ groups }: { groups: { title: string; items: { name: string; img: Img }[] }[] }) {
  const all = groups.flatMap((g) => g.items.map((it) => ({ ...it.img, alt: `${it.name}: ${it.img.alt}` })));
  const [open, setOpen] = useState<number | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  let n = -1;
  return (
    <div ref={ref}>
      {groups.map((g) => (
        <div key={g.title} className="mt-12 first:mt-0">
          <h3 className="mb-5 font-display text-xl text-white md:text-2xl">{g.title}</h3>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:mx-0 md:grid md:auto-rows-[200px] md:grid-cols-4 md:overflow-visible md:px-0 lg:auto-rows-[230px] [&::-webkit-scrollbar]:hidden">
            {g.items.map((it, k) => {
              n += 1;
              const idx = n;
              return (
                <button
                  key={it.name}
                  onClick={() => setOpen(idx)}
                  className={`group relative aspect-[4/3] w-[82vw] shrink-0 snap-center overflow-hidden rounded-xl text-left shadow-xl transition-all duration-700 ease-out md:w-auto ${
                    inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  } md:aspect-auto ${bento(k, g.items.length)}`}
                  style={{ transitionDelay: `${(idx % 6) * 90}ms` }}
                >
                  <Image src={it.img.src} alt={it.img.alt} fill sizes="(min-width: 768px) 40vw, 82vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <span className="absolute bottom-3 left-4 right-4 font-display text-lg text-white md:text-xl">{it.name}</span>
                  <ImgNote note={it.img.note} />
                  <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100">View</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {open !== null && (
        <Lightbox images={all} index={open} onClose={() => setOpen(null)} onMove={(d) => setOpen((o) => (o === null ? null : (o + d + all.length) % all.length))} />
      )}
    </div>
  );
}

/** A simple photo grid with the same full screen viewer. */
export function PhotoGrid({ images }: { images: Img[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((img, i) => (
          <button key={img.src} onClick={() => setOpen(i)} className={`group relative overflow-hidden rounded-lg ${i === 0 ? "col-span-2 row-span-2 aspect-[16/10] md:aspect-auto" : "aspect-[16/10]"}`}>
            <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            {i === 0 && <ImgNote note={img.note} />}
          </button>
        ))}
      </div>
      {open !== null && (
        <Lightbox images={images} index={open} onClose={() => setOpen(null)} onMove={(d) => setOpen((o) => (o === null ? null : (o + d + images.length) % images.length))} />
      )}
    </>
  );
}

/** Floor plans by configuration, with the plan zoomable on tap. */
export function FloorPlanTabs({
  plans,
}: {
  plans: { key: string; label: string; img: Img; units: { name: string; carpet: string }[]; rooms: string[] }[];
}) {
  const [k, setK] = useState(plans[0].key);
  const [zoom, setZoom] = useState(false);
  const plan = plans.find((p) => p.key === k)!;
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist">
        {plans.map((p) => (
          <button
            key={p.key}
            role="tab"
            aria-selected={p.key === k}
            onClick={() => setK(p.key)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              p.key === k ? "border-brand-indigo bg-brand-indigo text-white" : "border-line text-brand-indigo hover:border-brand-indigo"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <button onClick={() => setZoom(true)} className="group relative aspect-[1.61] w-full overflow-hidden rounded-xl border border-line bg-white">
          <Image key={plan.img.src} src={plan.img.src} alt={plan.img.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="animate-[scene-in_.5s_ease-out] object-contain p-2" />
          <span className="absolute bottom-3 left-3 rounded-full bg-brand-indigo/85 px-3 py-1 text-xs text-white">Tap to zoom</span>
        </button>
        <div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <th className="py-2 font-semibold">Home</th>
                <th className="py-2 font-semibold">RERA carpet</th>
              </tr>
            </thead>
            <tbody>
              {plan.units.map((u) => (
                <tr key={u.name} className="border-b border-line">
                  <td className="py-3 text-ink">{u.name}</td>
                  <td className="py-3 font-semibold text-brand-indigo">{u.carpet}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="mt-5 space-y-2 text-sm text-ink/80">
            {plan.rooms.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {zoom && <Lightbox images={[plan.img]} index={0} onClose={() => setZoom(false)} onMove={() => {}} />}
    </div>
  );
}

/** Travel time rings that pulse out from the tower once in view. */
export function TravelRings({ times }: { times: { place: string; min: number }[] }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const max = Math.max(...times.map((t) => t.min));
  return (
    <div ref={ref}>
    {/* Phones: a clear list, the minutes counting the eye down the column. */}
    <ul className="grid grid-cols-2 gap-3 md:hidden">
      {times.map((t, i) => (
        <li
          key={t.place}
          className={`rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: `${i * 120}ms` }}
        >
          <div className="font-display text-3xl text-bronze">
            {t.min}
            <span className="ml-1 text-sm text-paper/60">min</span>
          </div>
          <div className="mt-1 text-sm text-paper/85">{t.place}</div>
        </li>
      ))}
    </ul>
    <div className="relative mx-auto hidden aspect-square w-full max-w-md md:block">
      {times.map((t, i) => {
        const size = 28 + (t.min / max) * 70;
        return (
          <div
            key={t.place}
            className={`absolute left-1/2 top-1/2 rounded-full border border-bronze/50 transition-all duration-[1200ms] ease-out ${inView ? "opacity-100" : "opacity-0"}`}
            style={{ width: `${size}%`, height: `${size}%`, transform: `translate(-50%, -50%) scale(${inView ? 1 : 0.3})`, transitionDelay: `${i * 220}ms` }}
          >
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand-indigo-deep px-2.5 py-1 text-[0.7rem] text-paper ring-1 ring-bronze/50"
              style={(() => {
                // Spread the labels round their rings so near equal times never collide.
                const deg = [-55, 30, 150, 225, 300][i % 5];
                const r = (deg * Math.PI) / 180;
                return { left: `${50 + 50 * Math.sin(r)}%`, top: `${50 - 50 * Math.cos(r)}%` };
              })()}
            >
              <b className="text-bronze">{t.min} min</b> {t.place}
            </span>
          </div>
        );
      })}
      <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bronze font-display text-xs font-bold text-brand-indigo-deep shadow-lg">
        JJ
        <span className={`absolute inset-0 rounded-full bg-bronze/40 ${inView ? "animate-ping" : ""}`} />
      </div>
    </div>
    </div>
  );
}

/**
 * Laptops only: a slim menu that sticks under the site header once the hero
 * has passed, highlighting the section in view. Phones have the sticky
 * WhatsApp bar instead and need the screen for pictures.
 */
export function SectionNav({ items, cta }: { items: { id: string; label: string }[]; cta: { href: string; label: string } }) {
  const [active, setActive] = useState(items[0]?.id);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [items]);
  return (
    <nav
      aria-label="On this page"
      className={`fixed inset-x-0 top-[72px] z-30 hidden border-b border-white/10 bg-brand-indigo-deep/90 backdrop-blur transition-all duration-500 md:block ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
      }`}
    >
      <div className="wrap flex items-center justify-between gap-6">
        <ul className="flex gap-1 overflow-x-auto py-2 text-sm [scrollbar-width:none]">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`block whitespace-nowrap rounded-full px-3.5 py-1.5 transition ${
                  active === it.id ? "bg-bronze font-semibold text-brand-indigo-deep" : "text-paper/75 hover:text-white"
                }`}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={cta.href} target="_blank" rel="noopener" className="btn btn-wa shrink-0 py-1.5 text-xs">
          {cta.label}
        </a>
      </div>
    </nav>
  );
}
