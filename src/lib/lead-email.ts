/**
 * Turning an enquiry into an email.
 *
 * WHY EMAIL AND NOT THE CMS
 *
 * The original route wrote leads into Sanity. Two problems with that, and the
 * second is the serious one.
 *
 * The free Sanity plan only offers PUBLIC datasets, which was confirmed by
 * querying this project's dataset with no credentials at all and getting the
 * content back. Writing enquiries there would have put every name, phone
 * number and email address in the open for anyone who knows the project id,
 * and the project id ships to every visitor's browser by design.
 *
 * The lesser problem: a lead sitting in a CMS is a lead nobody sees until they
 * next open the CMS. For a business whose whole advantage is answering
 * quickly, that is the wrong shape.
 *
 * So an enquiry becomes an email. Private, instant, free, and it arrives
 * somewhere the owner already looks.
 *
 * The formatting lives here rather than in the route so it can be tested
 * without standing up a server or sending anything.
 */

export type Lead = {
  name: string;
  phone?: string;
  email?: string;
  intent?: string;
  area?: string;
  message?: string;
  locale?: string;
  sourcePage?: string;
  formLocation?: string;
  gclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
  referrer?: string;
};

/**
 * A subject line that can be triaged from a notification, without opening it.
 *
 * "New enquiry" alone tells the owner nothing while he is driving. The name
 * and what they want tell him whether it can wait.
 */
export function subjectFor(lead: Lead): string {
  const bits = [lead.intent, lead.area].filter(Boolean).join(", ");
  return bits
    ? `New enquiry: ${lead.name}, ${bits}`
    : `New enquiry: ${lead.name}`;
}

const LABELS: [keyof Lead, string][] = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["intent", "Looking to"],
  ["area", "Area"],
  ["message", "Message"],
];

const SOURCE_LABELS: [keyof Lead, string][] = [
  ["formLocation", "Form"],
  ["sourcePage", "Page"],
  ["landingPage", "Landed on"],
  ["referrer", "Referrer"],
  ["gclid", "Google click id"],
  ["utmSource", "utm_source"],
  ["utmMedium", "utm_medium"],
  ["utmCampaign", "utm_campaign"],
  ["utmContent", "utm_content"],
  ["utmTerm", "utm_term"],
  ["locale", "Language"],
];

/** Plain text, because it is the version that always renders. */
export function textFor(lead: Lead): string {
  const lines: string[] = [];
  for (const [k, label] of LABELS) {
    const v = lead[k];
    if (v) lines.push(`${label}: ${v}`);
  }

  const source = SOURCE_LABELS.filter(([k]) => lead[k]).map(
    ([k, label]) => `${label}: ${lead[k]}`,
  );
  if (source.length) {
    lines.push("", "Where this came from", ...source);
  }

  // A gclid is what makes an offline conversion import possible later, so it
  // is called out rather than buried in the list above.
  if (lead.gclid) {
    lines.push(
      "",
      "This enquiry carries a Google click id, so if it becomes a client it can be reported back to Google Ads as a conversion.",
    );
  }
  return lines.join("\n");
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** HTML version. Deliberately plain: this is a notification, not a newsletter. */
export function htmlFor(lead: Lead): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#5c6072;font:600 12px system-ui;text-transform:uppercase;letter-spacing:.06em;vertical-align:top">${esc(
      label,
    )}</td><td style="padding:6px 0;color:#1a1c28;font:400 15px/1.5 system-ui">${esc(
      value,
    )}</td></tr>`;

  const main = LABELS.filter(([k]) => lead[k])
    .map(([k, label]) => row(label, String(lead[k])))
    .join("");

  const source = SOURCE_LABELS.filter(([k]) => lead[k])
    .map(([k, label]) => row(label, String(lead[k])))
    .join("");

  // Tel and mailto links, so the owner can act from the email on a phone.
  const actions = [
    lead.phone
      ? `<a href="tel:${esc(lead.phone)}" style="display:inline-block;padding:10px 18px;background:#1c2450;color:#fff;border-radius:8px;text-decoration:none;font:600 14px system-ui">Call ${esc(lead.name)}</a>`
      : "",
    lead.phone
      ? `<a href="https://wa.me/${esc(lead.phone.replace(/[^0-9]/g, ""))}" style="display:inline-block;padding:10px 18px;background:#1c8f4d;color:#fff;border-radius:8px;text-decoration:none;font:600 14px system-ui;margin-left:8px">WhatsApp</a>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  return [
    '<div style="background:#f6f3ec;padding:24px;font-family:system-ui,sans-serif">',
    '<div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #e3ddcd;border-radius:14px;padding:26px">',
    `<div style="font:700 11px system-ui;letter-spacing:.18em;text-transform:uppercase;color:#c9a24b">New enquiry</div>`,
    `<h1 style="margin:8px 0 18px;font:600 24px system-ui;color:#1c2450">${esc(subjectFor(lead))}</h1>`,
    `<table cellpadding="0" cellspacing="0">${main}</table>`,
    actions ? `<div style="margin-top:22px">${actions}</div>` : "",
    source
      ? `<div style="margin-top:26px;border-top:1px solid #e3ddcd;padding-top:16px"><div style="font:700 11px system-ui;letter-spacing:.18em;text-transform:uppercase;color:#5c6072;margin-bottom:8px">Where this came from</div><table cellpadding="0" cellspacing="0">${source}</table></div>`
      : "",
    "</div></div>",
  ].join("");
}
