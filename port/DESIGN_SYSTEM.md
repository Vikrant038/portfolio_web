# Design System — Luxe Portfolio

A guide to the visual language, tokens and components used across the site.
The system deliberately mixes **three** design languages on a canvas so each
UI element earns its style instead of following one rigid school.

**Themes.** Every token is a CSS variable driven by `data-theme="dark" | "light"`
on `<html>`. The default follows the OS preference and is persisted in
`localStorage` (`luxe-theme`). A boot script in `<head>` applies the theme
before first paint to avoid flash.

---

## 1. The three design languages

### 🧊 Glassmorphism
**Where:** section backgrounds, project cards, contact form, navbar, modal.
**Recipe:** translucent surface + heavy blur + hairline border.

```css
.glass {
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.045);
  backdrop-filter: blur(24px);
  box-shadow: 0 24px 60px -24px rgba(0,0,0,0.7);
}
```

Glass gives the site its depth and lets the 3D scene and neon glows bleed
through the surface.

### 🔘 Neumorphism
**Where:** buttons, social icons, nav "Hire Me", skill category tiles.
**Recipe:** same-color surface + dual soft shadows (dark + faint light) + inset
shadow on active.

```css
.neo { box-shadow: 6px 6px 14px rgba(0,0,0,0.55), -6px -6px 14px rgba(255,255,255,0.05); }
.neo-inset { box-shadow: inset 3px 3px 8px rgba(0,0,0,0.6), inset -3px -3px 8px rgba(255,255,255,0.04); }
```

On a near-black canvas the light side of the shadow is kept very subtle to
preserve contrast and the luxury feel.

### 🌆 Cyberpunk neon
**Where:** headings, filter pills, skill rings, cursor, scroll spine, hover
states.
**Recipe:** electric accents + glow halos + gradients.

```css
.text-gradient { background: linear-gradient(100deg, #22d3ee, #7dd3fc, #e879f9, #f0abfc); -webkit-background-clip: text; }
.text-neon { text-shadow: 0 0 12px rgba(34,211,238,0.8), 0 0 42px rgba(34,211,238,0.35); }
```

Neon is used **sparingly** — on interactive moments and focal points — so it
reads as luxury energy, not a light show.

---

## 2. Tokens

## Noir Lagoon palette

A deliberately **out-of-the-box** scheme — tangerine sun, lagoon teal and
champagne gold instead of the usual cyan/purple neon.

| Token | Dark | Light | Usage |
|---|---|---|---|
| `void` (bg) | `#090B13` midnight indigo | `#F6F4EE` warm ivory | Page background |
| `ink` (surface) | `#0F121E` | `#FFFFFC` | Buttons, raised surfaces |
| `surface` (card) | `#151928` | `#FFFFFF` | Cards on glass |
| `neon` | `#FF8F40` tangerine | `#D3571A` deep tangerine | Primary accent |
| `neon2` | `#2DD4CD` lagoon | `#088A85` deep teal | Secondary accent |
| `gold` | `#E8C98E` champagne | `#A8762C` bronze | Serif headings, stars |
| `mist` | `#949AB2` | `#60677A` | Muted body text |
| `paper` | `#EEF0F8` | `#181B26` ink | Primary text |

Token colors are Tailwind classes backed by RGB CSS vars, so `text-neon`,
`bg-void/70`, `border-neon/25` all work in both themes with alpha support.

**Typography**
- `--font-sans` → **Space Grotesk** (UI, body, labels)
- `--font-serif` → **Playfair Display** (display headings, pull-quotes)

**Type scale:** display 4xl–6xl serif · h2 serif 4xl–6xl · body 13–16px sans ·
labels 10–12px uppercase tracking `0.18em–0.3em`.

---

## 3. Components

| Component | File | Notes |
|---|---|---|
| `GlassCard` | `components/ui/GlassCard.tsx` | `backdrop-blur` panel; cursor-following radial glow via CSS vars `--gx/--gy`; spring hover lift |
| `NeumorphicButton` | `components/ui/NeumorphicButton.tsx` | `neo` shadow, `active:neo-inset`, variants `primary`/`ghost`, optional icon, `whileTap` scale |
| `SectionHeading` | `components/ui/SectionHeading.tsx` | Eyebrow pill, serif title with gradient highlight, animated gradient underline |
| `CustomCursor` | `components/ui/CustomCursor.tsx` | Spring-following ring + dot; expands over `a, button, input…`; auto-disabled on coarse pointers |
| `PageTransition` | `components/ui/PageTransition.tsx` | `AnimatePresence` wrapper keyed on pathname |
| `Preloader` | `components/ui/Preloader.tsx` | Morphing shape + shimmer line; slides away into the hero |
| `Tilt` | `components/ui/Tilt.tsx` | Mouse-position 3D tilt via motion springs |
| `Reveal` | `components/ui/Reveal.tsx` | Scroll-triggered blur + fade + rise |
| `RadialProgress` / `TickRing` | `components/ui/RadialProgress.tsx` / `TickRing.tsx` | Skill rings rendered as percentage-complete tick lines — filled ticks glow in the category accent, the remainder is barely-there so completion reads at a glance |
| `PortfolioScene` | `components/three/PortfolioScene.tsx` | Lazy-loaded R3F scene: torus knot, wireframe icosahedron, octahedron, particle field, mouse parallax, scroll reactivity, pause-when-hidden, low-power guard, theme-aware palette |
| `ScrollProgress` | `components/ui/ScrollProgress.tsx` | Gradient reading-progress bar |
| `SectionStepper` | `components/ui/SectionStepper.tsx` | Desktop section dock with scroll-spy |
| `CommandPalette` | `components/ui/CommandPalette.tsx` | ⌘K quick-jump to sections/projects/actions |
| `ConsentBanner` | `components/ui/ConsentBanner.tsx` | Privacy consent gating Clarity |
| `CountUp` / `Magnetic` | `components/ui/` | Animated counters; magnetic buttons |

---

## 4. Theme switching

- Theme state lives in `SettingsProvider` (`src/lib/settings.tsx`) alongside a
  **motion intensity** setting (`full` | `reduced`).
- The 3D scene reads the palette from CSS variables, so it recolors instantly
  on theme swap.
- Reduced motion: Lenis smoothing off, preloader simplified, cursor kept,
  parallax capped, scene detail lowered. It also follows `prefers-reduced-motion`.

## 5. Motion & interaction rules

- **Duration:** micro-interactions 150–350ms; section reveals 400–900ms.
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; spring `{ type: "spring", stiffness: 260–500, damping: 22–30 }` for physical feedback.
- **Scroll:** Lenis smooth scrolling (`lerp: 0.09`); all reveals use `whileInView` with `viewport={{ once: true }}`.
- **Respect the user:** `prefers-reduced-motion` is intentionally kept simple — reveals are brief and never loop aggressively; the custom cursor only exists on `pointer: fine` devices.
- **Performance:** the WebGL scene renders behind `pointer-events-none` content, is lazy-loaded via `next/dynamic`, and uses `dpr={[1, 1.5]}` + `powerPreference: "high-performance"`.

---

## 5b. Extended surfaces

- **Sound design** — opt-in WebAudio in the settings popover: UI clicks, section whooshes, and a quiet ambient hum that the 3D scene visualizes (analyzer-driven emissive). Nothing plays until the user enables it.
- **Admin** — `/admin` is gated by Supabase Auth (email OTP). It lists contact leads and lets you approve/reject visitor testimonials (moderation status).
- **Career page** — `/career` is a print-optimized CV generated from the same data layer (ISR).
- **Brief uploads** — the contact form can attach a file to the public `briefs` Supabase Storage bucket; the link rides along in the Plunk email.
- **View Transitions** — route changes use the native View Transitions API when supported, with the Framer `PageTransition` as fallback.

## 6. Editing content

Content lives in `src/lib/data.ts` (local seed) and optionally in Supabase
(`supabase/seed.sql`). The data layer prefers Supabase and falls back to local
data, so you can edit one place and see the site change instantly.

Projects support richer fields: `metrics`, `challenge`/`approach`/`impact`
(case study), `repo`, `likes`. Testimonials fetched from Supabase are filtered
by `status = 'approved'`, so visitor-submitted feedback can be moderated.
