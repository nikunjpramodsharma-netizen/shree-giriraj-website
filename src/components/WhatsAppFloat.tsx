"use client";

import { useTranslations } from "next-intl";
import { waLink } from "@/lib/config";

export function WhatsAppFloat() {
  const t = useTranslations("whatsappFloat");

  return (
    <a
      href={waLink(t("message"))}
      target="_blank"
      rel="noopener"
      aria-label={t("ariaLabel")}
      className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition hover:scale-105 md:flex"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.6-1.5-.9-2-.2-.5-.4-.4-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2z" />
      </svg>
    </a>
  );
}
