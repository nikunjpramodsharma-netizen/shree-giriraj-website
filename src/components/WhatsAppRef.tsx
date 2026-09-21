"use client";

import { useEffect } from "react";
import { captureAttribution, getAttribution } from "@/lib/attribution";
import { refLine, withRef } from "@/lib/whatsapp-ref";

/**
 * Adds the "(Ref: page, source)" line to every WhatsApp link on the site at
 * the moment it is used, so no button has to know about it and a new one gets
 * it for free.
 *
 * It rewrites the link on pointerdown as well as click: pointerdown lands
 * before a middle click or a long press opens the link elsewhere, and click
 * covers the keyboard. The rewrite is idempotent, so both firing is harmless.
 *
 * It also records where the visitor came from on arrival. Until now that only
 * happened on pages carrying the enquiry form, so someone who landed from an
 * ad and went straight to WhatsApp lost the credit.
 */
export function WhatsAppRef() {
  useEffect(() => {
    captureAttribution();

    const tag = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const next = withRef(href, refLine(window.location.pathname, getAttribution()));
      if (next !== href) a.setAttribute("href", next);
    };

    document.addEventListener("pointerdown", tag, { capture: true });
    document.addEventListener("click", tag, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", tag, { capture: true });
      document.removeEventListener("click", tag, { capture: true });
    };
  }, []);

  return null;
}
