import { NextResponse } from "next/server";
import { site } from "@/lib/config";
import { subjectFor, textFor, htmlFor, type Lead } from "@/lib/lead-email";

export const runtime = "nodejs";

/**
 * Receives an enquiry and emails it.
 *
 * WHAT CHANGED AND WHY
 *
 * This route used to write leads into Sanity. That was wrong for a reason
 * worth recording: the free Sanity plan only offers PUBLIC datasets, and this
 * project's dataset was confirmed readable with no credentials at all. Storing
 * enquiries there would have exposed every name, phone number and email to
 * anyone who knows the project id, which ships to every browser by design.
 *
 * Email is private, instant, free, and arrives where the owner already looks.
 * It also removes the write token from the critical path entirely.
 *
 * NOTHING IS STORED. The email is the record. If a searchable history is ever
 * wanted, that needs a private dataset, which is a paid plan.
 *
 * Sent through Resend's REST API directly rather than its SDK, so there is no
 * dependency to install or keep current for one HTTP call.
 *
 * Configuration:
 *   RESEND_API_KEY    required, or the route returns 503 rather than pretending
 *   LEAD_TO_EMAIL     where enquiries go, defaults to the site email
 *   LEAD_FROM_EMAIL   the sender, defaults to Resend's shared test sender
 *
 * A note on the sender. Resend normally wants a verified domain, and this
 * business does not own one yet. The default falls back to Resend's shared
 * address so the route works today, and becomes one variable to change once a
 * domain exists. Mail from a shared sender is more likely to be filtered, so
 * verifying a domain is worth doing when there is one to verify.
 */

const RESEND_KEY = process.env.RESEND_API_KEY;
const TO = process.env.LEAD_TO_EMAIL || site.email;
const FROM = process.env.LEAD_FROM_EMAIL || "Enquiries <onboarding@resend.dev>";

/** Trim, cap length, and drop anything that is not a string. */
function clean(v: unknown, max = 500): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (!t) return undefined;
  return t.slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot. Real people leave it empty; most bots fill every field.
  if (clean(body.company)) {
    // Pretend success so the bot does not learn to work around it.
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160);

  // A name plus one way to reach them is the minimum that makes a lead useful.
  if (!name || (!phone && !email)) {
    return NextResponse.json(
      {
        error: "missing_fields",
        message: "Name and either a phone number or an email are required.",
      },
      { status: 400 },
    );
  }

  const lead: Lead = {
    name,
    phone,
    email,
    intent: clean(body.intent, 80),
    area: clean(body.area, 80),
    message: clean(body.message, 2000),
    locale: clean(body.locale, 8),
    sourcePage: clean(body.sourcePage, 300),
    formLocation: clean(body.formLocation, 60),
    gclid: clean(body.gclid, 200),
    utmSource: clean(body.utmSource, 120),
    utmMedium: clean(body.utmMedium, 120),
    utmCampaign: clean(body.utmCampaign, 160),
    utmContent: clean(body.utmContent, 160),
    utmTerm: clean(body.utmTerm, 160),
    landingPage: clean(body.landingPage, 300),
    referrer: clean(body.referrer, 300),
  };

  if (!RESEND_KEY) {
    // Never a silent success. A lost enquiry is worse than a visible error,
    // and the form falls back to showing the phone number and WhatsApp.
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Enquiry delivery is not configured. Set RESEND_API_KEY so enquiries are emailed.",
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject: subjectFor(lead),
        text: textFor(lead),
        html: htmlFor(lead),
        // So hitting reply goes to the person who enquired, not to Resend.
        ...(email ? { reply_to: email } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      // The lead itself is never logged. An error is worth recording; a
      // stranger's phone number in a log file is not.
      console.error("[lead] resend rejected the send", res.status, detail.slice(0, 300));
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] failed to send enquiry", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}
