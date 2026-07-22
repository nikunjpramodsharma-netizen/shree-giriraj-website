import Link from "next/link";
import { site, waLink } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-brand-indigo py-14 text-paper/75">
      <div className="wrap">
        <div className="grid gap-10 border-b border-white/10 pb-9 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold text-white">
              {site.name}
            </p>
            <p className="mt-2 max-w-[26em] text-sm">
              Interior &amp; Civil Work · Flat, Shop, Plot &amp; Bungalow
              Re-Development. Trusted property advice in Borivali West since{" "}
              {site.established}.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#services" className="hover:text-white">Services</Link></li>
              <li><Link href="/projects" className="hover:text-white">Projects</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
              Get in touch
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href={`tel:${site.phonePrimary}`} className="hover:text-white">{site.phonePrimary}</a></li>
              <li><a href={`tel:${site.phoneSecondary}`} className="hover:text-white">{site.phoneSecondary}</a></li>
              <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
              <li>
                <a href={waLink("Hi Shree Giriraj!")} target="_blank" rel="noopener" className="hover:text-white">
                  WhatsApp us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name} · Borivali · Kandivali · Malad
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            MahaRERA Reg. No. {site.rera}
          </span>
        </div>
      </div>
    </footer>
  );
}
