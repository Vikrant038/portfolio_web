import { getSupabase } from "./supabase";
import type {
  ExperienceItem,
  Project,
  SkillGroup,
  Testimonial,
} from "./supabase";

/* ------------------------------------------------------------------ */
/*  Local seed content — used when Supabase is not configured or the   */
/*  tables are missing. Swap the content for your real portfolio.      */
/* ------------------------------------------------------------------ */

export const localProjects: Project[] = [
  {
    id: "aurora-dashboard",
    title: "Aurora Analytics",
    tagline: "Realtime intelligence suite",
    description:
      "A luxury analytics platform with live charts, glass panels and predictive insights. Built around a component design system shared across web and native.",
    category: "fullstack",
    tech: ["Next.js", "TypeScript", "Supabase", "Recharts", "Tailwind"],
    image: "/projects/aurora.svg",
    gallery: ["/projects/aurora.svg", "/projects/aurora-detail.svg"],
    url: "#",
    repo: "https://github.com",
    year: "2025",
    accent: "#ff8f40",
    metrics: ["61% lighter bundle", "99.9% uptime"],
    challenge:
      "The client's analytics dashboard was unusable on mobile and took 8 seconds to load.",
    approach:
      "I rebuilt it around a shared design system, edge-rendered charts and a realtime data pipeline.",
    impact:
      "Median load time dropped from 8s to 1.1s and weekly active teams grew 3x.",
  },
  {
    id: "noir-commerce",
    title: "Noir Commerce",
    tagline: "Dark-mode headless storefront",
    description:
      "A headless commerce experience with cinematic product pages, 60fps micro-interactions and a checkout that converts 38% above the category average.",
    category: "web",
    tech: ["Next.js", "Stripe", "Zod", "Framer Motion", "Postgres"],
    image: "/projects/noir.svg",
    gallery: ["/projects/noir.svg", "/projects/noir-detail.svg"],
    url: "#",
    repo: "https://github.com",
    year: "2025",
    accent: "#2dd4cd",
    metrics: ["+38% conversion", "60fps interactions"],
    challenge:
      "A fashion label needed a store that felt as premium as their flagship boutique.",
    approach:
      "Cinematic product pages, micro-interaction motion language, and a checkout flow built for speed.",
    impact: "Conversion rate rose 38% in the first quarter after launch.",
  },
  {
    id: "lumen-brand",
    title: "Lumen Identity",
    tagline: "Brand system & motion language",
    description:
      "A complete visual identity for an AI research lab — logo suite, typography scale, generative art direction and a motion language used across 40+ touchpoints.",
    category: "design",
    tech: ["Figma", "After Effects", "GLSL", "Blender"],
    image: "/projects/lumen.svg",
    gallery: ["/projects/lumen.svg", "/projects/lumen-detail.svg"],
    url: "#",
    year: "2024",
    accent: "#e8c98e",
    metrics: ["40+ touchpoints", "3 award entries"],
    challenge: "A research lab with world-class science but a forgettable brand.",
    approach:
      "A generative identity system — every asset derives from one logo algorithm.",
    impact: "The brand system now scales across 40+ touchpoints unchanged.",
  },
  {
    id: "pulse-health",
    title: "Pulse Health",
    tagline: "Patient-first telemedicine",
    description:
      "An accessible telemedicine platform with realtime waiting rooms, symptom triage and a design system that meets WCAG AAA while staying beautiful.",
    category: "fullstack",
    tech: ["React", "Node", "WebRTC", "Supabase", "Design Tokens"],
    image: "/projects/pulse.svg",
    gallery: ["/projects/pulse.svg", "/projects/pulse-detail.svg"],
    url: "#",
    repo: "https://github.com",
    year: "2024",
    accent: "#7c6cff",
    metrics: ["WCAG AAA", "2M+ consultations"],
    challenge: "Telemedicine felt cold, clinical and excluding for older patients.",
    approach:
      "A warm design system, large-type first layouts and WCAG AAA compliance throughout.",
    impact: "Consultations crossed 2M with a 96% satisfaction score.",
  },
  {
    id: "orbit-3d",
    title: "Orbit Lab",
    tagline: "WebGL product configurator",
    description:
      "An interactive 3D configurator for a luxury furniture brand — realtime materials, ray-marched shadows and a shopping flow that feels like a game.",
    category: "web",
    tech: ["Three.js", "R3F", "GLSL", "Next.js", "Vercel"],
    image: "/projects/orbit.svg",
    gallery: ["/projects/orbit.svg", "/projects/orbit-detail.svg"],
    url: "#",
    repo: "https://github.com",
    year: "2023",
    accent: "#ff5c7a",
    metrics: ["+52% configurator time", "2.4s paint"],
    challenge: "Customers couldn't imagine custom furniture in their homes.",
    approach:
      "A realtime 3D configurator with true-to-life materials and lighting.",
    impact: "Time spent configuring doubled and returns dropped sharply.",
  },
  {
    id: "mono-notes",
    title: "Mono Notes",
    tagline: "Calm, keyboard-first journaling",
    description:
      "A distraction-free journaling app with local-first sync, elegant typography and a warm dark theme — designed to be opened every single day.",
    category: "design",
    tech: ["React", "IndexedDB", "Zod", "Radix UI"],
    image: "/projects/mono.svg",
    gallery: ["/projects/mono.svg", "/projects/mono-detail.svg"],
    url: "#",
    year: "2023",
    accent: "#ffd166",
    metrics: ["4.9★ rating", "92% day-30 retention"],
    challenge: "Journaling apps felt like social feeds, not private rituals.",
    approach:
      "Local-first storage, keyboard-first flows and typography tuned for long writing sessions.",
    impact: "92% of users are still writing daily after a month.",
  },
];

export const localSkillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    icon: "code",
    accent: "neon",
    items: [
      { name: "React / Next.js", level: 95, blurb: "App Router, server components, RSC data patterns" },
      { name: "TypeScript", level: 92, blurb: "Strict typing, generics, design-time safety at scale" },
      { name: "Three.js / WebGL", level: 84, blurb: "R3F scenes, shaders, 60fps product configurators" },
      { name: "Tailwind / CSS", level: 96, blurb: "Design tokens, custom utilities, animation systems" },
    ],
  },
  {
    category: "Backend",
    icon: "server",
    accent: "neon2",
    items: [
      { name: "Node / APIs", level: 88, blurb: "REST + tRPC, rate limiting, observability hooks" },
      { name: "Postgres / Supabase", level: 85, blurb: "RLS, realtime, migrations, edge functions" },
      { name: "Auth & Security", level: 80, blurb: "OTP flows, RBAC, OWASP basics, safe secrets" },
      { name: "Serverless / Edge", level: 78, blurb: "ISR, edge caching, cold-start-aware design" },
    ],
  },
  {
    category: "Tools & Craft",
    icon: "wrench",
    accent: "gold",
    items: [
      { name: "UI / Motion Design", level: 93, blurb: "Framer Motion, springs, choreographed transitions" },
      { name: "Design Systems", level: 90, blurb: "Tokens, primitives, docs, adoption across products" },
      { name: "Figma / Blender", level: 82, blurb: "Component libraries, 3D art direction, prototyping" },
      { name: "Performance / SEO", level: 86, blurb: "Core Web Vitals, LCP budgets, structured data" },
    ],
  },
];

export const localExperience: ExperienceItem[] = [
  {
    id: "lead-1",
    role: "Senior Product Engineer",
    company: "Northstar Studio",
    period: "2023 — Present",
    description:
      "Leading a 6-person product squad building the studio's flagship analytics suite. Own architecture, the component design system and developer experience.",
    highlights: [
      "Shipped the design system used across 4 products",
      "Cut bundle size 61% with edge-first rendering",
      "Mentored 3 engineers into senior roles",
    ],
  },
  {
    id: "mid-1",
    role: "Creative Technologist",
    company: "Vantablack Labs",
    period: "2021 — 2023",
    description:
      "Bridged design and engineering for interactive campaigns and 3D web experiences for brands like Audi and Nike.",
    highlights: [
      "Delivered 12 WebGL campaigns, 2 award winners",
      "Built an in-house motion-tooling pipeline",
    ],
  },
  {
    id: "mid-2",
    role: "Frontend Engineer",
    company: "Helio Fintech",
    period: "2019 — 2021",
    description:
      "Built customer-facing banking experiences used by 2M+ people, with a focus on accessibility and performance.",
    highlights: [
      "Raised Lighthouse performance from 72 to 98",
      "Introduced TypeScript across the frontend monorepo",
    ],
  },
  {
    id: "junior-1",
    role: "Freelance Web Developer",
    company: "Independent",
    period: "2017 — 2019",
    description:
      "Designed and built marketing sites, portfolios and e-commerce stores for 30+ small businesses.",
    highlights: ["100% client satisfaction across 30+ engagements"],
  },
];

export const localTestimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Aria doesn't just build interfaces — she builds the entire experience. The analytics suite she led felt like a product from ten years in the future.",
    name: "Maya Chen",
    role: "VP Product, Northstar Studio",
    avatar: "/avatars/maya.svg",
    rating: 5,
  },
  {
    id: "t2",
    quote:
      "The fastest, most meticulous engineer I've ever worked with. Her 3D campaigns are the reason our agency kept winning awards.",
    name: "Jonas Weber",
    role: "Creative Director, Vantablack Labs",
    avatar: "/avatars/jonas.svg",
    rating: 5,
  },
  {
    id: "t3",
    quote:
      "Aria took our muddled brand and turned it into a living, breathing design language. Sales have never looked better.",
    name: "Priya Nair",
    role: "Founder, Lumen Research",
    avatar: "/avatars/priya.svg",
    rating: 5,
  },
  {
    id: "t4",
    quote:
      "Rare mix of taste and rigor. Aria's code is as elegant as her interfaces — every review ended with 'that's exactly right'.",
    name: "Daniel Okafor",
    role: "Staff Engineer, Helio Fintech",
    avatar: "/avatars/daniel.svg",
    rating: 5,
  },
];

/** "Now" card — live status pulled from Supabase when configured. */
export const localNow = {
  role: "Senior Product Engineer @ Northstar Studio",
  focus: "3D interfaces & design systems",
  learning: "WebGPU, Rust, spatial UI",
};

/* ------------------------------------------------------------------ */
/*  Data access — Supabase first, local fallback.                      */
/* ------------------------------------------------------------------ */

export async function getProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("year", { ascending: false });
      if (!error && data && data.length > 0) return data as Project[];
    } catch {
      /* fall through */
    }
  }
  return localProjects;
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("sort", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          category: row.category,
          icon: row.icon,
          accent: row.accent,
          items: row.items,
        })) as SkillGroup[];
      }
    } catch {
      /* fall through */
    }
  }
  return localSkillGroups;
}

export async function getExperience(): Promise<ExperienceItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("sort", { ascending: true });
      if (!error && data && data.length > 0) return data as ExperienceItem[];
    } catch {
      /* fall through */
    }
  }
  return localExperience;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: true });
      if (!error && data && data.length > 0) return data as Testimonial[];
    } catch {
      /* fall through */
    }
  }
  return localTestimonials;
}

export async function getNow() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("now")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) {
        const row = data[0] as any;
        return {
          role: row.role ?? localNow.role,
          focus: row.focus ?? localNow.focus,
          learning: row.learning ?? localNow.learning,
        };
      }
    } catch {
      /* fall through */
    }
  }
  return localNow;
}
