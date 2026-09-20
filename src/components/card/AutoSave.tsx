"use client";

import { useEffect, useState } from "react";
import { SaveContactIcon } from "./icons";

const SEEN_KEY = "sg-card-contact-offered";

/** Phones only: a desktop visitor has no contacts app to hand the file to. */
export function shouldOfferContact(ua: string, touchPoints: number, alreadyOffered: boolean): boolean {
  return !alreadyOffered && touchPoints > 0 && /Android|iPhone|iPad|iPod/i.test(ua);
}

/**
 * The printed card says "Scan to save contact", so a phone that opens this
 * page is offered the contact file straight away: an iPhone shows its Add
 * Contact sheet, Android downloads the file and offers Contacts to open it.
 *
 * Once per device. Somebody who comes back to call or find the office should
 * not be handed the same file again; the Save Contact button is always there.
 */
export function AutoSave({ href, name }: { href: string; name: string }) {
  const [offered, setOffered] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Private browsing can refuse storage. Offer the file anyway.
    }
    if (!shouldOfferContact(navigator.userAgent, navigator.maxTouchPoints, seen)) return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(SEEN_KEY, "1");
      } catch {
        // As above.
      }
      setOffered(true);
      window.location.assign(href);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [href]);

  if (!offered) return null;
  return (
    <div className="vc-note" role="status">
      <SaveContactIcon />
      <span>Open the contact file to add {name} to your phone.</span>
      <button type="button" aria-label="Dismiss" onClick={() => setOffered(false)}>
        ×
      </button>
    </div>
  );
}
