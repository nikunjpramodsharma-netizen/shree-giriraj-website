"use client";

import { useState } from "react";
import { ShareIcon } from "./icons";

/**
 * Opens the phone's own share sheet. Where there is none, as on most desktop
 * browsers, it copies the link instead and says so.
 */
export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // The visitor closed the share sheet. Nothing to do.
    }
  }

  return (
    <button type="button" className="vc-share" onClick={share}>
      <ShareIcon /> {copied ? "Link copied" : "Share"}
    </button>
  );
}
