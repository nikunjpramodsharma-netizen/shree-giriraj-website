/**
 * The one door to the data layer.
 *
 * Every measurement on the site goes through Google Tag Manager, and every
 * event the site raises goes through this file, so the names stay the ones
 * the analytics plan lists (plan/07-analytics-ga4.md) and nobody pushes a
 * name, a phone number or an email address by accident: only the fields
 * named here are sent.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** The GTM container. Overridable per environment, so a preview can point at a test container. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TLGL2SJP";

export type PageType =
  | "home" | "service_index" | "service_detail" | "area_index" | "area_detail" | "project_index" | "project_detail"
  | "blog_index" | "blog_post" | "guide" | "tool" | "about" | "contact" | "landing_page" | "other";

/** What kind of page a path is, and the path without its locale prefix. */
export function pageInfo(pathname: string): { page_type: PageType; page_slug: string; locale: string } {
  const m = pathname.match(/^\/(hi|mr|gu)(\/|$)/);
  const locale = m ? m[1] : "en";
  const slug = m ? pathname.slice(m[1].length + 1) || "/" : pathname || "/";
  const seg = slug.split("/").filter(Boolean);
  let page_type: PageType = "other";
  if (seg.length === 0) page_type = "home";
  else if (seg[0] === "services") page_type = seg.length > 1 ? "service_detail" : "service_index";
  else if (seg[0] === "areas") page_type = seg.length > 1 ? "area_detail" : "area_index";
  else if (seg[0] === "projects") page_type = seg.length > 1 ? "project_detail" : "project_index";
  else if (seg[0] === "blog") page_type = seg.length > 1 ? "blog_post" : "blog_index";
  else if (seg[0] === "guides") page_type = "guide";
  else if (seg[0] === "tools") page_type = "tool";
  else if (seg[0] === "about") page_type = "about";
  else if (seg[0] === "contact") page_type = "contact";
  else if (seg[0] === "lp") page_type = "landing_page";
  return { page_type, page_slug: slug, locale };
}

type EventParams = Record<string, string | number | boolean | undefined>;

/** Push one event. Safe to call anywhere on the client; a no op on the server. */
export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  const clean: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") clean[k] = v;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...pageInfo(window.location.pathname), ...clean });
}

/**
 * Where on the page a click came from, read off the nearest landmark so the
 * links themselves need no extra markup.
 */
export function clickLocation(el: Element): string {
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  if (el.closest("form")) return "form";
  if (el.closest("[data-sticky-bar]")) return "sticky_bar";
  if (el.closest("[data-float]")) return "float";
  if (el.closest("article a, li a, .group")) return "card";
  if (el.closest("h1, .hero, [data-hero]")) return "hero";
  return "section_cta";
}
