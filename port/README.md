# Luxe Portfolio

A luxury single-page portfolio built with **Next.js 14 (App Router)**, **TypeScript** and **Tailwind CSS** — mixing three design languages cohesively:

- **Glassmorphism** — translucent, blurred surfaces (`GlassCard`, contact form, nav)
- **Neumorphism** — soft extruded buttons with inset active states
- **Cyberpunk neon** — glow gradients, electric accents and grid backdrops

Plus a **Three.js / react-three-fiber** animated background, Lenis smooth scrolling, a custom cursor, scroll-reveal motion and a working contact form.

**Theme system:** light & dark modes (persisted, follows system by default) built on the **Noir Lagoon** palette — tangerine × lagoon teal × champagne gold on midnight indigo (dark) or warm ivory (light). Toggle lives in the navbar; a motion-intensity setting (full/reduced) is in the floating gauge button.

---

## ✨ Features

| Area | Details |
|---|---|
| Hero | Typing-effect intro, gradient headline, 3D particle field, stat counters, click-burst, magnetic CTAs |
| About | Glass monogram frame with orbiting rings, serif pull-quotes, resume download |
| Projects | Filter + search + sort, grid/list toggle, tilt cards, case-study modal (prev/next, metrics, related, likes) |
| Skills | Radial tick rings (percentage-complete lines, glowing filled ticks), “Now” card, learning marquee |
| Experience | Alternating timeline, expandable nodes, years counter |
| Testimonials | Snap carousel with autoplay, dots, share-quote, aggregate rating, feedback form |
| Contact | 3-step form (type → budget/timeline → details), draft autosave, on-blur validation, honeypot + rate limiting → **Plunk** email with auto-reply |
| Chrome | ⌘K command palette, scroll progress, section stepper, back-to-top, keyboard shortcuts, privacy consent banner |
| Polish | Preloader (short for return visitors), Lenis, custom cursor, 3D tilt, blur-in reveals, light/dark themes |
| SEO | Metadata + OG, JSON-LD, `sitemap.xml`, `robots.txt`, ISR, cache headers, WebP formats |

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run seed       # placeholder — see scripts/ for tooling
```

## 🔐 Environment variables

Create `.env.local` (already provided in this workspace). The site is fully
functional without any of them — it falls back to built-in seed content and
logs form submissions to the console.

| Variable | Service | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Read projects / skills / experience / testimonials |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Public read client key |
| `PLUNK_API_KEY` | Plunk | Send contact-form emails |
| `CONTACT_EMAIL` | Plunk (optional) | Where contact messages are delivered |
| `CLARITY_ID` / `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity | Session recordings + heatmaps |
| `NEXT_PUBLIC_SITE_URL` | SEO (optional) | Canonical / sitemap base URL |
| `NOTIFY_WEBHOOK_URL` | Notifications (optional) | Slack/Telegram-style webhook pinged on new leads |
| `DIGEST_TOKEN` | Digest (optional) | Shared secret guarding `POST /api/digest` (cron trigger) |

### Supabase setup (optional)

1. Create a project, open the SQL editor and run [`supabase/seed.sql`](./supabase/seed.sql) — it creates `projects`, `skills`, `experience`, `testimonials` (with moderation), `now`, `project_views`, `contacts` (leads), the `increment_project_views` function, and the public `briefs` storage bucket, with RLS policies.
2. Add a user under **Supabase Auth → Users** — that email unlocks the admin dashboard at `/admin` (magic-link sign-in, leads inbox, testimonial approval).
2. Copy the project URL and anon key into the env vars above.
3. The data layer tries Supabase first and silently falls back to local content.

### Plunk setup (optional)

1. Create a Plunk account, add the **API key** as `PLUNK_API_KEY`.
2. Optionally set `CONTACT_EMAIL` to receive the messages (defaults to the sender).
3. Without a key the API route logs the message server-side so the form still "works" in dev.

### Admin dashboard, digest & ops

- **`/admin`** — Supabase Auth (email OTP) gate, then: contact-form leads, and pending testimonials to approve/reject. Runs `supabase/seed.sql` first.
- **`/career`** — printable CV page; content flows from the same data layer.
- **`/api/digest`** — weekly lead summary via Plunk; trigger from a cron with the `x-digest-token` header (`DIGEST_TOKEN`).
- **`/api/health`** — uptime check for monitors (Better Stack, UptimeRobot…).
- **`/api/vitals`** — Core Web Vitals endpoint; the app reports CLS/LCP/INP/TTFB etc. automatically.
- **Sound design** — opt-in WebAudio (clicks, section whooshes, ambient hum behind the 3D scene) in the settings (gauge) button.
- **Brief attachments** — the contact form can upload a PDF/image to the public `briefs` bucket when Supabase is configured; the link is appended to the email.

### Microsoft Clarity (optional)

1. Create a project at clarity.microsoft.com and copy the project ID.
2. Set it as `CLARITY_ID` (or `NEXT_PUBLIC_CLARITY_ID`).

## 🗂 Project structure

```
src/
  app/               # layout, home page, /api/contact, sitemap, robots
  components/
    sections/        # Hero, About, Projects, Skills, Experience, Testimonials, Contact, Footer, Navbar
    three/           # Three.js background scene (lazy-loaded)
    ui/              # Design-system primitives (see DESIGN_SYSTEM.md)
    providers/       # Lenis smooth scroll, Microsoft Clarity
  lib/               # supabase client, data layer, plunk email helper
public/              # thumbnails, avatars, icons, resume placeholder
supabase/seed.sql    # schema + seed data
```

## 📄 Documentation

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for the design-language guide and
component reference.

## 🛠 Tech stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Three.js + react-three-fiber + drei · Framer Motion · Lenis · Zod · @supabase/supabase-js · Plunk (REST) · Microsoft Clarity · sonner

## ☁️ Deployment

Deploy on **Vercel** by importing the repo. No build config needed — the
standard `next build` output is used. Remember to set the production env vars
listed above in the Vercel dashboard.
