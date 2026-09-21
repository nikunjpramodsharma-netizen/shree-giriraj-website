import type { Attribution } from "@/lib/attribution";

/**
 * A short line added to the end of every WhatsApp message the site writes, so
 * the owner can see at a glance where a chat came from:
 *
 *   (Ref: Borivali West sale page, Google ad)
 *
 * WhatsApp is the firm's main enquiry route, and a chat never passes through
 * the website, so nothing else can record which page or which ad produced it.
 * The line costs the visitor nothing and they can delete it; most will not.
 *
 * Pure functions only. The click handling that applies them lives in
 * components/WhatsAppRef.tsx.
 */

const WA_HOST = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//;
const REF_MARK = "(Ref:";

function words(slug: string): string {
  const s = decodeURIComponent(slug).replace(/[-_]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function titleWords(slug: string): string {
  return decodeURIComponent(slug)
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Which page a path is, in words the owner recognises. */
export function pageLabel(pathname: string): string {
  const path = pathname.replace(/^\/(hi|mr|gu)(?=\/|$)/, "") || "/";
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 0) return "Homepage";
  const [a, b, c] = seg;
  if (a === "areas" && b && c) {
    const intent = c === "flats-for-rent" ? "rent" : c === "flats-for-sale" ? "sale" : words(c);
    return `${titleWords(b)} ${intent} page`;
  }
  if (a === "areas" && b) return `${titleWords(b)} area page`;
  if (a === "areas") return "Areas page";
  if (a === "services" && b) return `${words(b)} service`;
  if (a === "projects" && b) return `${titleWords(b)} project`;
  if (a === "blog" && b) return `Article: ${words(b)}`;
  if (a === "guides" && b) return `Guide: ${words(b)}`;
  if (a === "tools" && b) return `Tool: ${words(b)}`;
  if (a === "card") return "Visiting card";
  return words(a);
}

/** How the visitor first arrived, from the stored first touch. */
export function sourceLabel(attr: Attribution): string {
  if (attr.gclid) return "Google ad";
  if (attr.utmSource) return attr.utmMedium ? `${attr.utmSource} ${attr.utmMedium}` : attr.utmSource;
  return "website";
}

export function refLine(pathname: string, attr: Attribution): string {
  return `${REF_MARK} ${pageLabel(pathname)}, ${sourceLabel(attr)})`;
}

/**
 * The same WhatsApp link with the reference added to its message. Anything
 * that is not a WhatsApp link, or already carries a reference, comes back
 * unchanged, so applying it twice is harmless.
 */
export function withRef(href: string, ref: string): string {
  if (!WA_HOST.test(href)) return href;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  const text = url.searchParams.get("text") ?? "";
  if (text.includes(REF_MARK)) return href;
  const next = text ? `${text}\n\n${ref}` : ref;
  // Rebuilt by hand rather than with searchParams.set, which writes spaces as
  // "+". WhatsApp reads %20 reliably and "+" not always.
  return `${url.origin}${url.pathname}?text=${encodeURIComponent(next)}`;
}
