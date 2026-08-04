import { createClient } from "@supabase/supabase-js";

export type ProjectCategory = "web" | "design" | "fullstack";

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  tech: string[];
  image: string;
  gallery?: string[];
  url?: string | null;
  repo?: string | null;
  year: string;
  accent: string;
  metrics?: string[];
  challenge?: string;
  approach?: string;
  impact?: string;
  likes?: number;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  blurb?: string;
}

export interface SkillGroup {
  category: string;
  icon: "code" | "server" | "wrench";
  accent: "neon" | "neon2" | "gold";
  items: Skill[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  video?: string | null;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Lazily-initialised Supabase client. Returns null when the project
 * has not been configured with Supabase env vars yet — callers fall back
 * to local seed data so the site always renders.
 */
export function getSupabase() {
  if (!url || !anonKey) return null;
  try {
    return createClient(url, anonKey);
  } catch {
    return null;
  }
}
