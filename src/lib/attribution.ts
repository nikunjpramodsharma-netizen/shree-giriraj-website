"use client";

/**
 * Captures where a visitor came from, on their first page, and keeps it until
 * they convert.
 *
 * This exists because of one hard constraint: a lead submitted without a
 * stored `gclid` can never be attributed back to the ad that produced it, and
 * that is not recoverable later. Somebody arrives on an ad, browses four
 * pages, then fills the form. By then the URL has no gclid in it, so reading
 * the current URL at submit time captures nothing.
 *
 * So it is read once on entry, written to a first party cookie, and read back
 * at submit.
 */

const COOKIE = "sg_attr";
const DAYS = 90;

export type Attribution = {
  gclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
  referrer?: string;
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  const expires = new Date(Date.now() + DAYS * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Call once per page load. First touch wins: if attribution is already stored
 * we keep it, so an ad click followed by a direct return visit still credits
 * the ad rather than overwriting it with nothing.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const existing = readCookie(COOKIE);
  const params = new URLSearchParams(window.location.search);
  const incoming: Attribution = {};

  const gclid = params.get("gclid");
  if (gclid) incoming.gclid = gclid;
  const map: Record<string, keyof Attribution> = {
    utm_source: "utmSource",
    utm_medium: "utmMedium",
    utm_campaign: "utmCampaign",
    utm_content: "utmContent",
    utm_term: "utmTerm",
  };
  for (const [param, key] of Object.entries(map)) {
    const v = params.get(param);
    if (v) incoming[key] = v;
  }

  const hasNew = Object.keys(incoming).length > 0;

  // Nothing new and something already stored: leave first touch alone.
  if (existing && !hasNew) return;

  const base: Attribution = existing ? safeParse(existing) : {};
  const merged: Attribution = {
    ...(hasNew ? {} : base),
    ...(hasNew ? incoming : {}),
    landingPage: base.landingPage || window.location.pathname,
    referrer: base.referrer || document.referrer || undefined,
  };

  writeCookie(COOKIE, JSON.stringify(merged));
}

export function getAttribution(): Attribution {
  const raw = readCookie(COOKIE);
  return raw ? safeParse(raw) : {};
}

function safeParse(s: string): Attribution {
  try {
    return JSON.parse(s) as Attribution;
  } catch {
    return {};
  }
}
