import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { isEnglishOnlyPath } from "./lib/seo";

/**
 * Locale handling, with one exception for the English only sections.
 *
 * The default middleware redirects an unprefixed URL to the visitor's
 * language, read from the NEXT_LOCALE cookie or the browser's Accept-Language
 * header. That is right for the home page and the services, which exist in
 * all four languages. It was wrong for /tools, /guides, /blog/<slug>, /areas,
 * /about and /contact, which exist in English only: a reader whose phone is
 * set to Hindi who tapped a Google result for /blog/mhada-flat-transfer was
 * sent to /hi/blog/mhada-flat-transfer, which is a 404. So was anyone who had
 * opened one Gujarati page and then followed a link to a calculator (found by
 * the 16 November 2026 crawl). Those sections now skip language detection
 * entirely and are always served in English.
 *
 * A prefixed URL into an English only section (/hi/tools/...) has nothing to
 * serve, so it is sent permanently to the English page rather than left as a
 * 404. /blog is excluded: the blog index is translated, and a Sanity post may
 * have a body in that language.
 */
const localized = createMiddleware(routing);
const englishOnly = createMiddleware({ ...routing, localeDetection: false });

const PREFIXED = /^\/(hi|mr|gu)(\/.*)$/;

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const m = PREFIXED.exec(pathname);
  if (m && isEnglishOnlyPath(m[2]) && !m[2].startsWith("/blog")) {
    const url = req.nextUrl.clone();
    url.pathname = m[2];
    return NextResponse.redirect(url, 308);
  }

  if (isEnglishOnlyPath(pathname)) return englishOnly(req);
  return localized(req);
}

// /card is the digital visiting card: English only, its own root layout,
// outside the locale routes, so the locale middleware must not touch it.
export const config = {
  matcher: ["/((?!api|_next|_vercel|studio|card(?:/|$)|.*\\..*).*)"],
};
