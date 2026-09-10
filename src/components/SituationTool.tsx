"use client";

import Image from "next/image";
import { useState } from "react";
import { waLink } from "@/lib/config";
import { tr } from "@/lib/copy-i18n";
import type { Situation, PropertyType } from "@/lib/homepage-content";

/**
 * The answer to a portal's search box, for a firm with no inventory to search.
 * A few taps, then something genuinely useful, then a WhatsApp message already
 * written.
 *
 * No email field and no submit. The value is given before anything is asked
 * for, which is the opposite of a gated form.
 *
 * THREE ROWS, NOT TWO
 *
 * Intent and property type used to sit in one row, so "Buy" and "Plot" were
 * offered as if they answered the same question. They do not. Splitting them
 * asks one thing at a time, and it means the message that reaches us says what
 * somebody wants AND what kind of property, from clicks alone.
 *
 * The type row only appears for buy, rent and sell. Asking a society what type
 * of property it is redeveloping would be noise.
 *
 * LOCALE. The situations and types arrive already translated by the page
 * (localizeDeep), keyed on stable English keys. The area list stays English
 * because "Not sure yet" is compared by value; it is translated for display
 * and for the WhatsApp message here, with tr().
 */
export function SituationTool({
  situations,
  types,
  typedIntents,
  areas,
  locale = "en",
}: {
  situations: Situation[];
  types: PropertyType[];
  typedIntents: readonly string[];
  areas: readonly string[];
  locale?: string;
}) {
  const [intent, setIntent] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);

  const chosen = situations.find((s) => s.key === intent);
  const chosenType = types.find((t) => t.key === type);
  const needsType = intent !== null && typedIntents.includes(intent);
  const areaLabel =
    area === "Not sure yet" ? tr(locale, "the western suburbs") : area ? tr(locale, area) : area;

  // The result waits for a type only where a type is a real question.
  const ready = Boolean(chosen && area && (!needsType || chosenType));

  const message =
    chosen && area
      ? (needsType && chosenType
          ? tr(locale, "Hi Shree Giriraj, I am looking to {intent} {type} in {area}. Can you help?")
          : tr(locale, "Hi Shree Giriraj, I am looking to {intent} in {area}. Can you help?")
        )
          .replace("{intent}", locale === "en" ? chosen.label.toLowerCase() : chosen.label)
          .replace("{type}", chosenType ? tr(locale, chosenType.phrase) : "")
          // areaLabel, not area: "Not sure yet" reads as "the western
          // suburbs" in the message too, in every language.
          .replace("{area}", areaLabel ?? "")
      : "";

  const pill = (on: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition ${
      on
        ? "border-ink bg-ink text-paper"
        : "border-line bg-paper text-ink hover:border-muted"
    }`;

  const legend =
    "mb-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted";

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper-alt">
      <div className="grid lg:grid-cols-[1fr_.8fr]">
        <div className="p-8">
          <fieldset className="mb-6">
            <legend className={legend}>{tr(locale, "I am looking to")}</legend>
            <div className="flex flex-wrap gap-2">
              {situations.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={intent === s.key}
                  onClick={() => {
                    setIntent(s.key);
                    // Clear a type that no longer applies, or a stale answer
                    // would ride along into the message.
                    if (!typedIntents.includes(s.key)) setType(null);
                  }}
                  className={pill(intent === s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>

          {needsType && (
            <fieldset className="mb-6">
              <legend className={legend}>{tr(locale, "What kind of property")}</legend>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={type === t.key}
                    onClick={() => setType(t.key)}
                    className={pill(type === t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="mb-6">
            <legend className={legend}>{tr(locale, "In")}</legend>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={area === a}
                  onClick={() => setArea(a)}
                  className={pill(area === a)}
                >
                  {tr(locale, a)}
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

                {/* The type note sits with the intent guidance rather than
                    replacing it, so a buyer gets both what buying involves and
                    what this kind of property involves. */}
                {chosenType && (
                  <p className="mb-3 text-[0.96rem] text-muted">
                    <b className="text-ink">{chosenType.label}.</b>{" "}
                    {chosenType.note}
                  </p>
                )}

                <p className="border-l-2 border-brass pl-3.5 text-[0.94rem] text-muted">
                  <b className="text-ink">{tr(locale, "Where we come in:")}</b>{" "}
                  {chosen.help}
                </p>
                <a
                  href={waLink(message)}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-wa mt-5"
                >
                  {tr(locale, "Send this to us on WhatsApp")}
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
