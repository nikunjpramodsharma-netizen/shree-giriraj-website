"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { GTM_ID, clickLocation, pageInfo, track } from "@/lib/analytics";

/**
 * Google Tag Manager, and the events the site raises for it.
 *
 * The container loads after the page is interactive, so it never delays the
 * first paint. Three things happen here that GTM cannot see on its own in a
 * Next.js app:
 *
 *  1. Page views on client side navigation. Moving between pages does not
 *     reload the document, so the container would count only the first page
 *     a visitor lands on. Every route change pushes `page_view`.
 *  2. WhatsApp, phone, email and directions clicks, caught once at the
 *     document so every link on every page is covered, including ones added
 *     later. Only the destination type and where on the page it sat are sent.
 *
 * Campaign parameters are already kept by lib/attribution.ts and sent with
 * the enquiry itself, so they are not repeated here.
 */
export function Gtm() {
  const pathname = usePathname();
  const search = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    // GTM fires its own page view for the first load; only later ones are ours.
    if (first.current) {
      first.current = false;
      return;
    }
    track("page_view", { page_location: window.location.href, page_title: document.title });
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const where = clickLocation(a);
      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)/.test(href)) {
        track("whatsapp_click", { click_location: where, link_text: a.textContent?.trim().slice(0, 60) });
      } else if (href.startsWith("tel:")) {
        track("phone_click", { click_location: where });
      } else if (href.startsWith("mailto:")) {
        track("email_click", { click_location: where });
      } else if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|\/maps\?cid=/.test(href)) {
        track("directions_click", { click_location: where });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GTM_ID) return null;
  const info = pageInfo(pathname);

  return (
    <>
      <Script id="gtm-datalayer" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; window.dataLayer.push(${JSON.stringify(info)});`}
      </Script>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
