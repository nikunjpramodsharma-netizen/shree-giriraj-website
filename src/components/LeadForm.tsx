"use client";

import { useState } from "react";
import { waLink } from "@/lib/config";

const intents = ["Buy", "Sell", "Rent", "New project", "Redevelopment"];

export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState(intents[0]);
  const [area, setArea] = useState("");

  function handleSubmit() {
    const message =
      `Hi Shree Giriraj, I'd like to enquire.\n` +
      `Name: ${name || "-"}\n` +
      `Looking to: ${intent}\n` +
      `Area: ${area || "-"}\n` +
      `Phone: ${phone || "-"}`;
    window.open(waLink(message), "_blank", "noopener");
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-paper/40 outline-none focus:border-brass";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
      <div className="space-y-3.5">
        <input
          className={field}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={field}
          placeholder="Phone number"
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
          placeholder="Preferred area (e.g. Borivali West)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <button onClick={handleSubmit} className="btn btn-brass w-full justify-center">
          Send enquiry on WhatsApp
        </button>
        <p className="text-center text-xs text-paper/50">
          Opens WhatsApp with your details filled in. No spam, ever.
        </p>
      </div>
    </div>
  );
}
