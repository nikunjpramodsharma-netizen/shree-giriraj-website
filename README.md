# Shree Giriraj Real Estate — Website

A full website with a blog and CMS, built on **Next.js 14 (App Router) + Sanity CMS + Tailwind CSS**, ready to deploy on **Vercel**.

Content (blog posts, projects, testimonials, pages) is edited from a built-in Sanity Studio at **/studio** — no code changes needed to publish.

---

## What's already built

- **Homepage** (`/`) — hero, services, a 3-project grid (featured projects from CMS), an auto-rotating testimonial carousel (from CMS), an FAQ section (from CMS), areas, and a lead form that opens WhatsApp pre-filled.
- **Blog** — listing at `/blog`, articles at `/blog/[slug]`.
- **Projects** — listing at `/projects`, detail pages at `/projects/[slug]` with configurations, masked pricing, amenities and a gallery.
- **Flexible pages** — e.g. `/about`, editable entirely from the CMS.
- **Sticky mobile Call/WhatsApp bar** — fixed to the bottom of the screen on mobile only; the floating WhatsApp button is hidden on mobile to avoid duplicating it.
- **Sanity Studio** — at `/studio`, with six content types: Blog Post, Project, Testimonial, Page, FAQ, and Team Member (the last one isn't used on any page yet — added for a future `/about` page).
- All content is localized into English, Hindi, Marathi and Gujarati.
- Brand colours, fonts, contact details, and MahaRERA number are baked in.

---

## The stack, and how the pieces fit

- **GitHub** — stores the code.
- **Vercel** — hosts the site, auto-deploys on every push to GitHub. Gives you CDN, SSL and DDoS protection out of the box.
- **Sanity** — the CMS. Free tier is plenty to start.
- **Domain** — from Namecheap or GoDaddy, pointed at Vercel.
- **Cloudflare** — *not needed at launch.* Vercel already covers CDN/SSL. You can add it later.

---

## Step-by-step: getting it live

You can do these yourself, or paste the "Claude Code brief" at the bottom into Claude Code and let it walk you through.

### 1. Install and run locally
```bash
npm install
cp .env.local.example .env.local
```

### 2. Create your Sanity project
1. Go to <https://www.sanity.io/manage> and sign in.
2. Create a new project. Give it a name (e.g. "Shree Giriraj"), dataset = **production**.
3. Copy the **Project ID**.
4. Paste it into `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
5. Fill in the other values in `.env.local` (site URL, WhatsApp number, etc. — defaults are already your details).

### 3. Add CORS + run
In <https://www.sanity.io/manage> → your project → **API → CORS origins**, add:
- `http://localhost:3000` (tick "Allow credentials")
- your future Vercel URL and custom domain (add these once you have them)

Then:
```bash
npm run dev
```
- Site: <http://localhost:3000>
- Studio: <http://localhost:3000/studio> (log in with the same Sanity account)

### 4. Add your first content (important)
In the Studio:
- Create at least **one Project** (up to 3 shown) and tick **"Feature on homepage?"** — the homepage grid pulls featured projects in `order` order, so without this the grid stays empty.
- Add a few **Testimonials** and tick "Show on homepage?" — these feed the auto-rotating carousel.
- Add a few **FAQs** — these populate the homepage FAQ section.
- Create a **Page** with slug `about` so the `/about` link works.
- Write a **Blog Post** or two.

> Masked pricing: in a Project's **Configurations**, put the teaser in **Display price**, e.g. `₹2.** Cr`. Only what you type here is ever shown — exact figures never touch the site.

### 5. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
```
Create an empty repo on GitHub, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/shree-giriraj-web.git
git branch -M main
git push -u origin main
```

### 6. Deploy on Vercel
1. Go to <https://vercel.com>, sign in with GitHub, **Add New → Project**, import the repo.
2. Under **Environment Variables**, add every line from your `.env.local`
   (Vercel does not read `.env.local` — you must add them here too).
3. Click **Deploy**. You'll get a `something.vercel.app` URL.
4. Add that URL to Sanity CORS origins (step 3).

### 7. Connect your domain
1. Buy the domain (Namecheap or GoDaddy).
2. In Vercel → your project → **Settings → Domains**, add your domain.
3. Vercel shows you the DNS records to set. In your registrar's DNS settings:
   - Add the **A record** / **CNAME** exactly as Vercel specifies.
4. Wait for DNS to propagate (minutes to a few hours). Vercel issues SSL automatically.
5. Add the custom domain to Sanity CORS origins.
6. Update `NEXT_PUBLIC_SITE_URL` in Vercel to your real domain and redeploy.

Done — you're live, and you can publish blog posts and projects anytime from `/studio`.

---

## Environment variables

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | From sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-01` (leave as-is) |
| `NEXT_PUBLIC_SITE_URL` | Your final domain |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919324974133` |
| `NEXT_PUBLIC_PHONE_PRIMARY` | `+919324974133` |
| `NEXT_PUBLIC_PHONE_SECONDARY` | `+919223594133` |
| `NEXT_PUBLIC_EMAIL` | `shreegiriraj1224@gmail.com` |

---

## Adding your logo
Drop your logo file into `public/` (e.g. `public/logo.png`) and swap the text placeholder in `src/components/Nav.tsx` for a `next/image`.

---

## i18n smoke test (do this once, after your first real deploy)

The site was localized into English, Hindi, Marathi and Gujarati (routes: `/`, `/hi`, `/mr`, `/gu`) in an environment with no live Sanity project, so `npm run build` was never run against real content during that work — only `npx tsc --noEmit`. Once you've created your Sanity project and filled in `.env.local` (see above), run `npm run build` for the first time and then manually check:

1. `npm run dev`, visit `http://localhost:3000/` — loads in English, no `/en` in the URL.
2. Change your browser's language preference to Hindi (or clear cookies and set `Accept-Language: hi`), reload `/` — redirects to `/hi`.
3. Click "मराठी" or "ગુજરાતી" in the nav language toggle — URL becomes `/mr/...` or `/gu/...`, all static copy (nav, hero, services, footer) switches language.
4. Visit `/hi/projects`, `/hi/blog`, `/hi/about` (after adding an `about` Page in Studio) — confirm each renders without `[object Object]` anywhere, and CMS text falls back to English where a translation hasn't been entered yet.
5. Visit `/studio` — confirm it still loads and is NOT wrapped in the site's Nav/Footer/WhatsApp button.
6. In Studio, open a Project and confirm the Summary/Full description fields now show English/Hindi/Marathi/Gujarati tabs, and the Testimonial's Quote/Role fields do the same.

---

## Notes
- The `next/font/google` fonts (Fraunces, Inter) download at build time — this needs internet access, which Vercel and your own machine have.
- If you ever add Cloudflare, set SSL mode to **Full (strict)** to avoid redirect loops with Vercel.
- Jaswanti Jewel imagery: get the developer's OK before publishing their renders.

---

## Claude Code brief (paste this in)

> I have a Next.js 14 (App Router) + Sanity + Tailwind project (this repo). Help me get it live. Specifically:
> 1. Run `npm install` and confirm it builds.
> 2. Walk me through creating a Sanity project at sanity.io/manage and filling in `.env.local` from `.env.local.example`.
> 3. Help me add CORS origins in Sanity for localhost, my Vercel URL, and my domain.
> 4. Start the dev server and confirm the site and `/studio` both load.
> 5. Guide me to seed content: one Project marked featured, a few Testimonials marked featured, an `about` Page, and a sample Blog Post.
> 6. Help me push to GitHub, import into Vercel, add the same env vars in Vercel, and deploy.
> 7. Walk me through pointing my Namecheap/GoDaddy domain at Vercel and updating `NEXT_PUBLIC_SITE_URL`.
> Ask me for any values you need (project ID, domain, GitHub username) as we go.
