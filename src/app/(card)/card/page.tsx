import type { Metadata } from "next";
import Image from "next/image";
import QRCode from "qrcode";
import { site } from "@/lib/config";
import { SITE_URL } from "@/lib/seo";
import { CARD, cardWhatsAppLink, showPhone } from "@/lib/card";
import { LogoMark, Blades } from "@/components/card/LogoMark";
import { ShareButton } from "@/components/card/ShareButton";
import {
  PhoneIcon,
  WhatsAppIcon,
  MailIcon,
  PinIcon,
  GlobeIcon,
  ClockIcon,
  InstagramIcon,
  FacebookIcon,
  StarIcon,
  SaveContactIcon,
  ShieldIcon,
} from "@/components/card/icons";

const CARD_URL = `${SITE_URL}${CARD.path}`;
const TITLE = `${CARD.person}, ${site.name}`;

/**
 * noindex on purpose. The card repeats the contact page's details and exists
 * to be opened from a QR code or a shared link, not to be found in search,
 * where it would only compete with /contact. It is left crawlable so the tag
 * can be read, which is why robots.ts does not disallow it.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: `Call, WhatsApp or save the contact of ${CARD.person}, ${CARD.role} of ${site.name}. In real estate since ${site.established}.`,
  alternates: { canonical: CARD_URL },
  robots: { index: false, follow: true },
  openGraph: {
    type: "profile",
    url: CARD_URL,
    title: TITLE,
    description: `${site.tagline}. Tap to call, WhatsApp or save the contact.`,
    siteName: site.name,
    images: [{ url: "/card-og.png", width: 1200, height: 686, alt: site.name }],
  },
};

/** The QR code of the card's own address, drawn as one SVG path at build time. */
function qrPath(text: string): { size: number; d: string } {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" });
  let d = "";
  for (let y = 0; y < modules.size; y++) {
    for (let x = 0; x < modules.size; x++) {
      if (modules.get(x, y)) d += `M${x},${y}h1v1h-1z`;
    }
  }
  return { size: modules.size, d };
}

export default function CardPage() {
  const qr = qrPath(CARD_URL);
  const hours = site.hours.label.charAt(0).toUpperCase() + site.hours.label.slice(1);

  return (
    <article className="vc">
      <header className="vc-top">
        <Blades className="vc-blades" />
        <div className="vc-brand">
          <div className="vc-logo">
            <LogoMark className="mark" />
          </div>
          <div>
            <b>{site.name}</b>
            <span>{site.tagline}</span>
          </div>
        </div>
        <div className="vc-photo">
          <Image src={CARD.photo} alt={CARD.person} width={260} height={260} priority />
        </div>
        <h1 className="vc-name">{CARD.person}</h1>
        <p className="vc-role">{CARD.role}</p>
        <div className="vc-meta">
          <span>Since {site.established}</span>
          <span>
            <ShieldIcon /> MahaRERA {site.rera}
          </span>
        </div>
        <nav className="vc-actions" aria-label="Get in touch">
          <a href={`tel:${site.phonePrimary}`}>
            <i>
              <PhoneIcon />
            </i>
            Call
          </a>
          <a href={cardWhatsAppLink()} target="_blank" rel="noopener">
            <i>
              <WhatsAppIcon />
            </i>
            WhatsApp
          </a>
          <a href={`mailto:${site.email}`}>
            <i>
              <MailIcon />
            </i>
            Email
          </a>
          <a href={site.social.google} target="_blank" rel="noopener">
            <i>
              <PinIcon />
            </i>
            Directions
          </a>
        </nav>
      </header>

      <div className="vc-body">
        <a className="vc-save" href={CARD.vcfPath} data-event="save_contact">
          <SaveContactIcon /> Save Contact
        </a>
        <div className="vc-rows">
          <div className="vc-row">
            <PhoneIcon />
            <p>
              <a href={`tel:${site.phonePrimary}`}>{showPhone(site.phonePrimary)}</a>
              <a href={`tel:${site.phoneSecondary}`}>{showPhone(site.phoneSecondary)}</a>
            </p>
          </div>
          <div className="vc-row">
            <MailIcon />
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <div className="vc-row">
            <PinIcon />
            <p>
              <a href={site.social.google} target="_blank" rel="noopener">
                {site.address}
              </a>
            </p>
          </div>
          <div className="vc-row">
            <ClockIcon />
            <p>{hours}</p>
          </div>
        </div>
      </div>

      <nav className="vc-social" aria-label="Find us online">
        <a href="/" aria-label="Website">
          <GlobeIcon />
        </a>
        <a href={site.social.instagram} target="_blank" rel="noopener" aria-label="Instagram">
          <InstagramIcon />
        </a>
        <a href={site.social.facebook} target="_blank" rel="noopener" aria-label="Facebook">
          <FacebookIcon />
        </a>
        <a href={site.social.google} target="_blank" rel="noopener" aria-label="Google reviews">
          <StarIcon />
        </a>
        <ShareButton title={TITLE} url={CARD_URL} />
      </nav>

      {/* Folded away so the card fits one phone screen; opened when someone
          wants to scan it from this phone. */}
      <details className="vc-qr">
        <summary>Show QR code</summary>
        <div className="tile">
          <svg className="qr" viewBox={`0 0 ${qr.size} ${qr.size}`} role="img" aria-label="QR code for this card" shapeRendering="crispEdges">
            <path fill="#151b3d" d={qr.d} />
          </svg>
        </div>
      </details>

      <p className="vc-foot">
        {site.name} · {site.areas.join(" · ")}
      </p>
    </article>
  );
}
