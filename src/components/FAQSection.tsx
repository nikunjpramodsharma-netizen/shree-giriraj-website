import { getLocalizedField, type Locale, type LocalizedValue } from "@/lib/i18n-content";

type Faq = {
  _id: string;
  question: LocalizedValue<string>;
  answer: LocalizedValue<string>;
  category?: string;
};

export function FAQSection({
  faqs,
  locale,
  eyebrow,
  heading,
}: {
  faqs: Faq[];
  locale: Locale;
  eyebrow: string;
  heading: string;
}) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24">
      <div className="wrap">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-3.5 text-3xl text-brand-indigo md:text-4xl">{heading}</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq._id}
              className="group rounded-2xl border border-brand-indigo/10 bg-white p-6 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none text-lg font-medium text-brand-indigo marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {getLocalizedField(faq.question, locale)}
                  <span className="shrink-0 text-brass transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted">
                {getLocalizedField(faq.answer, locale)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
