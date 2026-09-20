import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

// /card is the digital visiting card: English only, its own root layout,
// outside the locale routes, so the locale middleware must not touch it.
export const config = {
  matcher: ["/((?!api|_next|_vercel|studio|card(?:/|$)|.*\\..*).*)"],
};
