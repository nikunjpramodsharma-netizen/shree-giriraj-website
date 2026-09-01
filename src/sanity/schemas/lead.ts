import { defineField, defineType } from "sanity";

/**
 * An enquiry from the site's contact form.
 *
 * Leads land in Studio because that is where the owner already works. No new
 * service, no second login, and nothing to forget to check.
 *
 * Why this document exists at all: before it, the only "form" on the site
 * opened WhatsApp with a prefilled message. That meant two problems. Anyone
 * who does not use WhatsApp had no way to get in touch, and no lead was ever
 * stored, so there was nothing to attach a Google click id to and therefore no
 * way to ever run offline conversion import.
 *
 * The attribution fields are the reason this is worth doing properly. A lead
 * without a stored gclid can never be attributed back to the ad that produced
 * it, and that cannot be fixed retroactively.
 */
export default defineType({
  name: "lead",
  title: "Enquiry",
  type: "document",
  // Read only in Studio. These are submissions, not content to be authored.
  readOnly: true,
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "intent",
      title: "What they need",
      type: "string",
    }),
    defineField({ name: "area", title: "Area", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text", rows: 4 }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description:
        "Used for the weekly offline conversion upload to Google Ads. Only leads marked Qualified should be uploaded.",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Qualified", value: "qualified" },
          { title: "Not a fit", value: "unqualified" },
        ],
        layout: "radio",
      },
      initialValue: "new",
      readOnly: false,
    }),

    defineField({ name: "submittedAt", title: "Submitted at", type: "datetime" }),
    defineField({ name: "locale", title: "Locale", type: "string" }),
    defineField({ name: "sourcePage", title: "Page", type: "string" }),
    defineField({ name: "formLocation", title: "Form location", type: "string" }),

    // --- Attribution. Captured on first visit, submitted with the lead. ---
    defineField({
      name: "gclid",
      title: "Google click id",
      type: "string",
      description:
        "Required for offline conversion import. Cannot be recovered later if missing.",
    }),
    defineField({ name: "utmSource", title: "utm_source", type: "string" }),
    defineField({ name: "utmMedium", title: "utm_medium", type: "string" }),
    defineField({ name: "utmCampaign", title: "utm_campaign", type: "string" }),
    defineField({ name: "utmContent", title: "utm_content", type: "string" }),
    defineField({ name: "utmTerm", title: "utm_term", type: "string" }),
    defineField({ name: "landingPage", title: "Landing page", type: "string" }),
    defineField({ name: "referrer", title: "Referrer", type: "string" }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", phone: "phone", intent: "intent", at: "submittedAt" },
    prepare({ title, phone, intent, at }) {
      const when = at ? new Date(at).toLocaleDateString("en-IN") : "";
      return {
        title: title || phone || "Enquiry",
        subtitle: [intent, phone, when].filter(Boolean).join(" · "),
      };
    },
  },
});
