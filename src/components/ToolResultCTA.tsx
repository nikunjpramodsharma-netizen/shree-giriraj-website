"use client";

import { useEffect, useRef, useState } from "react";
import { waLink } from "@/lib/config";
import { track } from "@/lib/analytics";
import { buildShareQuery, type ShareValue } from "@/lib/tool-share";

/**
 * The card under a calculator's answer: one warm offer and one WhatsApp tap
 * that carries the visitor's own inputs and result.
 *
 * The link is marked data-wa-cta="result", which WhatsAppRef turns into
 * "(Ref: Tool: ..., result, source)" at tap time, so the lead sheet shows
 * which calculator brought the chat. Nothing here gates the tool.
 *
 * `inputsKey` is any string that changes when the visitor changes an input.
 * The first change fires tool_calculate once. `show` lets a tool hold the
 * card back until it has something to say.
 */
export function ToolResultCTA({
  slug,
  offer,
  message,
  inputsKey,
  share,
  show = true,
  buttonLabel = "Send this on WhatsApp",
}: {
  slug: string;
  offer: string;
  message: string;
  inputsKey: string;
  /** Inputs (numbers and choices only) for the "Copy link to this result" button. */
  share?: Record<string, ShareValue | undefined>;
  show?: boolean;
  buttonLabel?: string;
}) {
  const first = useRef<string | null>(null);
  const fired = useRef(false);
  useEffect(() => {
    if (first.current === null) {
      first.current = inputsKey;
      return;
    }
    if (!fired.current && inputsKey !== first.current) {
      fired.current = true;
      track("tool_calculate", { tool_slug: slug });
    }
  }, [inputsKey, slug]);

  if (!show) return null;

  return (
    <div className="rounded-xl border border-bronze/40 bg-bronze/10 p-5 print:hidden" data-tool-result-cta>
      <p className="max-w-[60ch] text-sm text-ink">{offer}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={waLink(message)}
          data-wa-cta="result"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("tool_result_whatsapp", { tool_slug: slug })}
          className="inline-flex rounded-full bg-brand-indigo px-5 py-2.5 text-sm font-semibold text-white"
        >
          {buttonLabel}
        </a>
        {share && <CopyResultLink params={share} />}
      </div>
    </div>
  );
}

function CopyResultLink({ params }: { params: Record<string, ShareValue | undefined> }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}?${buildShareQuery(params)}`;
    try {
      await navigator.clipboard.writeText(url);
      setState("done");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 3000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink/80 hover:bg-paper-alt"
    >
      {state === "done" ? "Link copied" : state === "failed" ? "Copy not available here" : "Copy link to this result"}
    </button>
  );
}
