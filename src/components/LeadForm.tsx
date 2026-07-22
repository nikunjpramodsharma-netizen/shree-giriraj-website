"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { waLink } from "@/lib/config";

export function LeadForm() {
  const t = useTranslations("leadForm");
  const intents = [
    t("intentBuy"),
    t("intentSell"),
    t("intentRent"),
    t("intentNewProject"),
    t("intentRedevelopment"),
  ];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState(intents[0]);
  const [area, setArea] = useState("");

  function handleSubmit() {
    const message =
      `${t("whatsappGreeting")}\n` +
      `${t("whatsappNameLabel")}: ${name || "-"}\n` +
      `${t("whatsappIntentLabel")}: ${intent}\n` +
      `${t("whatsappAreaLabel")}: ${area || "-"}\n` +
      `${t("whatsappPhoneLabel")}: ${phone || "-"}`;
    window.open(waLink(message), "_blank", "noopener");
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-paper/40 outline-none focus:border-brass";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
      <div className="space-y-3.5">
        <input
          className={field}
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={field}
          placeholder={t("phonePlaceholder")}
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
        <button onClick={handleSubmit} className="btn btn-brass w-full justify-center">
          {t("submit")}
        </button>
        <p className="text-center text-xs text-paper/50">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
