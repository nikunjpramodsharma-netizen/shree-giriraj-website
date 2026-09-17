"use client";

import { useEffect, useState } from "react";

/**
 * "Open now" or "Closed now", worked out in India time in the reader's
 * browser, with the next change. Renders nothing on the server so the two
 * never disagree, and the hours line beside it is still there for everyone.
 */
export function OpenNow({ opens, closes }: { opens: string; closes: string }) {
  const [state, setState] = useState<{ open: boolean; minutes: number } | null>(null);

  useEffect(() => {
    const [oh, om] = opens.split(":").map(Number);
    const [ch, cm] = closes.split(":").map(Number);
    const compute = () => {
      const now = new Date();
      const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const mins = ist.getHours() * 60 + ist.getMinutes();
      const o = oh * 60 + om;
      const c = ch * 60 + cm;
      const open = mins >= o && mins < c;
      const minutes = open ? c - mins : mins < o ? o - mins : 24 * 60 - mins + o;
      setState({ open, minutes });
    };
    compute();
    const t = setInterval(compute, 60_000);
    return () => clearInterval(t);
  }, [opens, closes]);

  if (!state) return null;
  const h = Math.floor(state.minutes / 60);
  const m = state.minutes % 60;
  const span = h > 0 ? `${h} hour${h === 1 ? "" : "s"}${m ? ` ${m} min` : ""}` : `${m} min`;
  const fmt = (hhmm: string) => {
    const [hh, mm] = hhmm.split(":").map(Number);
    const ampm = hh >= 12 ? "pm" : "am";
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return mm ? `${h12}:${String(mm).padStart(2, "0")} ${ampm}` : `${h12} ${ampm}`;
  };
  return (
    <span className={`open-now inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${state.open ? "bg-emerald-50 text-emerald-800" : "bg-paper-alt text-ink/70"}`}>
      <span aria-hidden="true" className={`open-dot h-2 w-2 rounded-full ${state.open ? "bg-emerald-500" : "bg-ink/30"}`} />
      {state.open ? `Open now, closes at ${fmt(closes)} in ${span}` : `Closed now, opens at ${fmt(opens)} in ${span}`}
    </span>
  );
}
