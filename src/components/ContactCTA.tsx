"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { site, waLink } from "@/lib/config";
import { captureAttribution, getAttribution } from "@/lib/attribution";

/**
 * Two ways to get in touch, both explicit about what they do.
 *
 * The old form was a WhatsApp composer wearing a form's clothes: it collected
 * four fields and then opened WhatsApp. That left two gaps.
 *
 * 1. Anyone without WhatsApp, or unwilling to hand over a personal number to
 *    an unknown business, had no route at all.
 * 2. Nothing was ever stored, so no lead could carry a Google click id, and
 *    offline conversion import was impossible.
 *
 * So: one green button that says plainly it opens WhatsApp, and one real form
 * that captures name, phone, email and requirement and posts them to the site.
 * Neither pretends to be the other.
 *
 * LOCALE NOTE: labels that already existed reuse the translated `leadForm`
 * namespace. The strings new to this component are English only for now, in
 * line with the rest of the 2026 rebuild.
 */

type Props = {
  /** Where on the site this instance sits. Recorded with the lead. */
  formLocation: string;
  locale: string;
  /** Show the form expanded rather than behind the second button. */
  defaultOpen?: boolean;
  tone?: "light" | "dark";
  /**
   * Prefill the intent select from a service page. A translation KEY, not a
   * literal, or the prefill would silently fail on every non English locale
   * because the option values are translated.
   */
  presetIntentKey?:
    | "intentBuy"
    | "intentSell"
    | "intentRent"
    | "intentNewProject"
    | "intentRedevelopment";
  presetArea?: string;
};

type State = "idle" | "sending" | "done" | "error" | "unconfigured";

export function ContactCTA({
  formLocation,
  locale,
  defaultOpen = false,
  tone = "dark",
  presetIntentKey,
  presetArea,
}: Props) {
  const t = useTranslations("leadForm");
  const [open, setOpen] = useState(defaultOpen);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState(t(presetIntentKey ?? "intentBuy"));
  const [area, setArea] = useState(presetArea ?? "");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  // First touch attribution has to be captured on arrival, not at submit.
  useEffect(() => {
    captureAttribution();
  }, []);

  const intents = [
    t("intentBuy"),
    t("intentSell"),
    t("intentRent"),
    t("intentNewProject"),
    t("intentRedevelopment"),
  ];

  const dark = tone === "dark";
  const field = dark
    ? "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-paper/40 outline-none focus:border-brass"
    : "w-full rounded-xl border border-line bg-paper-alt px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-brass";
  const label = dark ? "text-paper/60" : "text-muted";

  const waMessage =
    `${t("whatsappGreeting")}\n` +
    `${t("whatsappNameLabel")}: ${name || "-"}\n` +
    `${t("whatsappIntentLabel")}: ${intent}\n` +
    `${t("whatsappAreaLabel")}: ${area || "-"}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || (!phone.trim() && !email.trim())) {
      setError("Please add your name and either a phone number or an email.");
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          intent,
          area,
          message,
          company,
          locale,
          formLocation,
          sourcePage: window.location.pathname,
          ...getAttribution(),
        }),
      });
      if (res.ok) {
        setState("done");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setState(data?.error === "not_configured" ? "unconfigured" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div
        className={`rounded-2xl border p-8 ${
          dark ? "border-white/10 bg-white/5" : "border-line bg-paper-alt"
        }`}
      >
        <h3 className={`font-display text-2xl ${dark ? "text-white" : "text-brand-indigo"}`}>
          Thank you, that has reached us.
        </h3>
        <p className={`mt-3 text-sm ${dark ? "text-paper/75" : "text-muted"}`}>
          We reply during working hours, usually within the hour. If it is urgent,
          call {site.phonePrimary}.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 ${
        dark ? "border-white/10 bg-white/5 backdrop-blur" : "border-line bg-paper-alt"
      }`}
    >
      {/* --- Route one: WhatsApp, labelled as such --- */}
      <a
        href={waLink(waMessage)}
        target="_blank"
        rel="noopener"
        className="btn btn-wa w-full justify-center"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 5 5.1-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.3-5-4.5-.1-.2-1.1-1.5-1.1-2.9s.7-2 .9-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 2 .9 2.1c.1.1.1.3 0 .5s-.2.4-.3.5l-.4.5c-.1.1-.3.3-.1.6s.6 1.1 1.4 1.8c1 .9 1.8 1.1 2.1 1.3s.4.1.6-.1.7-.8.9-1.1.4-.2.6-.1 1.5.7 1.8.9.4.2.5.3.1.6-.1 1.3z" />
        </svg>
        Message us on WhatsApp
      </a>
      <p className={`mt-2 text-center text-xs ${label}`}>
        Opens WhatsApp in a new tab. Fastest reply.
      </p>

      {/* --- Route two: a real form, for everyone else --- */}
      {!open ? (
        <div className="mt-5 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`btn w-full justify-center ${
              dark
                ? "btn-outline border-paper/40 text-paper"
                : "btn-outline border-brand-indigo text-brand-indigo"
            }`}
          >
            Rather not use WhatsApp? Send your details
          </button>
          <p className={`mt-2 text-center text-xs ${label}`}>
            We will call or email you back instead.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-3.5 border-t border-white/10 pt-5">
          <p className={`text-xs ${label}`}>
            Prefer a call or an email? Leave your details and we will come back to you.
          </p>

          <input
            className={field}
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
          <input
            className={field}
            placeholder={t("phonePlaceholder")}
            inputMode="tel"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
          <input
            className={field}
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <select
            className={field}
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
          >
            {intents.map((i) => (
              <option key={i} value={i} className="bg-brand-indigo-deep">
                {i}
              </option>
            ))}
          </select>
          <input
            className={field}
            placeholder={t("areaPlaceholder")}
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <textarea
            className={field}
            rows={3}
            placeholder="Anything else we should know (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Honeypot. Hidden from people, tempting to bots. */}
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <button
            type="submit"
            disabled={state === "sending"}
            className="btn btn-brass w-full justify-center disabled:opacity-60"
          >
            {state === "sending" ? "Sending..." : "Send my details"}
          </button>

          <div aria-live="polite">
            {error && <p className="text-center text-xs text-red-300">{error}</p>}
            {state === "error" && (
              <p className="text-center text-xs text-red-300">
                Something went wrong. Please call {site.phonePrimary} or email{" "}
                {site.email}.
              </p>
            )}
            {state === "unconfigured" && (
              <p className="text-center text-xs text-red-300">
                We could not save that just now. Please call {site.phonePrimary} or
                email {site.email} and we will pick it up straight away.
              </p>
            )}
          </div>

          <p className={`text-center text-xs ${label}`}>
            No spam, ever. We use your details only to answer this enquiry.
          </p>
        </form>
      )}
    </div>
  );
}
