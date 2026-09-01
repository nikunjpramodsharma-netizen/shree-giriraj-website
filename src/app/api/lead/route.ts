import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const runtime = "nodejs";

/**
 * Receives an enquiry and stores it.
 *
 * Sanity is the destination because the owner already works in Studio, so
 * there is no second place to check and no extra service to pay for.
 *
 * REQUIRES `SANITY_API_WRITE_TOKEN` in the environment. Without it this route
 * returns 503 and the form falls back to showing the phone number and email,
 * so a visitor is never left with a dead end. It does NOT silently pretend to
 * have saved the lead, because a lost enquiry is worse than a visible error.
 */

const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

const writeClient = WRITE_TOKEN
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token: WRITE_TOKEN,
      useCdn: false,
    })
  : null;

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
      { error: "missing_fields", message: "Name and either a phone number or an email are required." },
      { status: 400 },
    );
  }

  if (!writeClient) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Lead storage is not configured. Set SANITY_API_WRITE_TOKEN so enquiries are saved.",
      },
      { status: 503 },
    );
  }

  try {
    await writeClient.create({
      _type: "lead",
      name,
      phone,
      email,
      intent: clean(body.intent, 80),
      area: clean(body.area, 80),
      message: clean(body.message, 2000),
      status: "new",
      submittedAt: new Date().toISOString(),
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
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] failed to store enquiry", err);
    return NextResponse.json({ error: "store_failed" }, { status: 500 });
  }
}
