"use client";

import Image from "next/image";
import { useState } from "react";
import { waLink } from "@/lib/config";
import type { Situation } from "@/lib/homepage-content";

/**
 * Section 04. The answer to a portal's search box for a firm with no inventory
 * to search. Two taps, then something genuinely useful, then a WhatsApp
 * message already written.
 *
 * No email field and no submit. The value is given before anything is asked
 * for, which is the opposite of a gated form.
 */
export function SituationTool({
  situations,
  areas,
}: {
  situations: Situation[];
  areas: readonly string[];
}) {
  const [intent, setIntent] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);

  const chosen = situations.find((s) => s.key === intent);
  const areaLabel = area === "Not sure yet" ? "the western suburbs" : area;
  const ready = Boolean(chosen && area);

  const message =
    chosen && area
      ? `Hi Shree Giriraj, I am looking to ${chosen.label.toLowerCase()} in ${area}. Can you help?`
      : "";

  const pill = (on: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition ${
      on
        ? "border-ink bg-ink text-paper"
        : "border-line bg-paper text-ink hover:border-muted"
    }`;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper-alt">
      <div className="grid lg:grid-cols-[1fr_.8fr]">
        <div className="p-8">
          <fieldset className="mb-6">
            <legend className="mb-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">
              I am looking to
            </legend>
            <div className="flex flex-wrap gap-2">
              {situations.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={intent === s.key}
                  onClick={() => setIntent(s.key)}
                  className={pill(intent === s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mb-6">
            <legend className="mb-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">
              In
            </legend>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={area === a}
                  onClick={() => setArea(a)}
                  className={pill(area === a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </fieldset>

          <div aria-live="polite">
            {ready && chosen && (
              <div className="border-t border-line pt-6">
                <h3 className="mb-2.5 font-display text-xl text-brand-indigo">
                  {chosen.heading.replace("{area}", areaLabel ?? "")}
                </h3>
                <p className="mb-3 text-[0.96rem] text-muted">{chosen.body}</p>
                <p className="border-l-2 border-brass pl-3.5 text-[0.94rem] text-muted">
                  <b className="text-ink">Usually goes wrong:</b> {chosen.warning}
                </p>
                <a
                  href={waLink(message)}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-wa mt-5"
                >
                  Send this to us on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="relative min-h-[260px]">
          <Image
            src="/sections/situation.jpg"
            alt="A couple in discussion with a property adviser"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
