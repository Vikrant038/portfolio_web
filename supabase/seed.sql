-- Vikrant Yadav Portfolio — Supabase schema & seed data
-- Run this in the Supabase SQL editor, then set the env vars:
--   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
-- (The site works with built-in local data until you do this.)

create table if not exists public.projects (
  id text primary key,
  title text not null,
  tagline text,
  description text,
  category text not null,
  tech jsonb not null default '[]',
  image text,
  url text,
  year text,
  accent text default '#22d3ee'
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  icon text not null default 'code',
  accent text not null default 'neon',
  items jsonb not null default '[]',
  sort int default 0
);

create table if not exists public.experience (
  id text primary key,
  role text not null,
  company text not null,
  period text,
  description text,
  highlights jsonb not null default '[]',
  sort int default 0
);

create table if not exists public.testimonials (
  id text primary key,
  quote text not null,
  name text not null,
  role text,
  avatar text,
  rating int default 5,
  status text default 'approved',
  created_at timestamptz default now()
);

-- live "Now" card
create table if not exists public.now (
  id uuid primary key default gen_random_uuid(),
  role text,
  focus text,
  learning text,
  updated_at timestamptz default now()
);

-- project view counts
create table if not exists public.project_views (
  project_id text primary key,
  count bigint not null default 0
);

-- contact form leads (admin dashboard)
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  project_type text,
  budget text,
  timeline text,
  source text,
  created_at timestamptz default now()
);

create or replace function public.increment_project_views(project_id text)
returns void
language sql
security definer set search_path = public
as $$
  insert into public.project_views (project_id, count)
  values (project_id, 1)
  on conflict (project_id)
  do update set count = public.project_views.count + 1;
$$;

alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.experience enable row level security;
alter table public.testimonials enable row level security;
alter table public.now enable row level security;
alter table public.project_views enable row level security;
alter table public.contacts enable row level security;

-- public read for anonymous visitors
create policy "public read projects" on public.projects for select using (true);
create policy "public read skills" on public.skills for select using (true);
create policy "public read experience" on public.experience for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read now" on public.now for select using (true);

-- visitor-submitted feedback lands as pending (prevent injecting approved=true)
create policy "public insert testimonials" on public.testimonials
  for insert with check (status = 'pending');

-- leads: anyone can submit, only authenticated admins can read
create policy "public insert contacts" on public.contacts for insert with check (true);
create policy "admin read contacts" on public.contacts for select to authenticated using (true);

-- moderation: authenticated admins approve/delete testimonials
create policy "admin update testimonials" on public.testimonials for update to authenticated using (true);
create policy "admin delete testimonials" on public.testimonials for delete to authenticated using (true);

insert into public.projects (id, title, tagline, description, category, tech, image, url, year, accent) values
  ('behorden-bot', 'Behörden-Bot', 'Corrective RAG for German immigration & study', 'A production-grade Corrective RAG assistant answering German visa, APS and university-admission questions bilingually, with citations.', 'ai', '["Next.js 15","TypeScript","PostgreSQL","pgvector","Groq","BGE-M3"]', '/projects/aurora.svg', 'https://github.com/Vikrant038/Beh-rden-Bot-Advanced-CRAG', '2026', '#ff8f40'),
  ('lead-scoring-engine', 'Lead Scoring Engine', 'ICP Profiler — transparent, explainable lead scoring', 'A six-stage transparent scoring pipeline with AI-assisted outreach and multi-model failover.', 'data', '["TypeScript","Express","Drizzle/SQLite","Groq","Gemini"]', '/projects/lumen.svg', 'https://lead-scoring-engine-three.vercel.app', '2026', '#e8c98e'),
  ('multi-agent-orchestrator', 'Multi-Agent Dev Orchestrator', 'A near-free multi-agent software development system', 'A paid planner decomposes work into contracts that free-tier coding agents execute in parallel, verified by a tamper-proof test gate.', 'fullstack', '["TypeScript","Node.js","LiteLLM","SQLite","Git Worktrees"]', '/projects/noir.svg', '#', '2026', '#2dd4cd')
on conflict (id) do nothing;

insert into public.skills (category, icon, accent, items, sort) values
  ('AI, LLM & RAG', 'code', 'neon', '[{"name":"RAG / Corrective RAG","level":90},{"name":"Python","level":92},{"name":"TypeScript","level":85},{"name":"LLM APIs & Prompting","level":90}]', 1),
  ('Data & Backend', 'server', 'neon2', '[{"name":"SQL / Data Warehousing","level":88},{"name":"Node.js / Express","level":82},{"name":"scikit-learn / pandas","level":85},{"name":"PostgreSQL / Supabase","level":80}]', 2),
  ('Systems & Leadership', 'wrench', 'gold', '[{"name":"Team Leadership","level":88},{"name":"Systems Thinking","level":90},{"name":"Docker / Git / CI","level":78},{"name":"Tableau / Streamlit","level":85}]', 3)
on conflict do nothing;

insert into public.experience (id, role, company, period, description, highlights, sort) values
  ('dt-lead', 'Team Lead', 'Deep Thought Analytics', 'Mar 2026 — May 2026', 'Promoted to lead a 6-person team across two labs (MarTech + ICP).', '["Defined workflows and structured accountability across the team","Moderated an LDI session for 27 participants","Converted 5 founders to a roundtable via cold outreach"]', 1),
  ('dt-ai', 'AI Generalist Specialist', 'Deep Thought Analytics', 'Feb 2026 — May 2026', 'Built the AI and automation systems the whole team ran on.', '["Built 6+ AI tools, saving the team ~8–10 hours/day","Cut a 15–18 hour/week task down to ~30 minutes","Migrated profiling to Vertex AI, unlocking 27,000 free credits"]', 2),
  ('dt-ba', 'Business Analyst Intern', 'Deep Thought Analytics', 'Nov 2025 — Jan 2026', 'Owned the lead-data pipeline end to end.', '["Scraped and structured 20,000+ lead records","Built an ICP Profiler — ~3× faster lead evaluation","Automated phone-number cleaning — lifted data quality by 30–40%"]', 3)
on conflict (id) do nothing;

-- No seeded testimonials — real recommendations land here via the site's
-- feedback form (moderated through /admin) once they exist. Don't fabricate.

insert into public.now (role, focus, learning) values
  ('IIT Madras BS (Data Science) · Diploma stage', 'Multi-agent orchestration & RAG systems', 'MLOps, PyTorch, DSA, German (A1 → B1)');
