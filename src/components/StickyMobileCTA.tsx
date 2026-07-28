import { getTranslations } from "next-intl/server";
import { site, waLink } from "@/lib/config";

export async function StickyMobileCTA({ locale }: { locale: string }) {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "stickyCta" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-brand-indigo/10 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden">
      <a
        href={`tel:${site.phonePrimary}`}
        className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-brand-indigo"
      >
        {t("callLabel")}
      </a>
      <a
        href={waLink(tNav("whatsappEnquireMessage"))}
        target="_blank"
        rel="noopener"
        className="flex flex-1 items-center justify-center gap-2 bg-whatsapp py-3.5 text-sm font-semibold text-white"
      >
        {t("whatsappLabel")}
      </a>
    </div>
  );
}
