-- Luxe Portfolio — Supabase schema & seed data
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

-- visitor-submitted feedback lands as pending
create policy "public insert testimonials" on public.testimonials for insert with check (true);

-- leads: anyone can submit, only authenticated admins can read
create policy "public insert contacts" on public.contacts for insert with check (true);
create policy "admin read contacts" on public.contacts for select to authenticated using (true);

-- moderation: authenticated admins approve/delete testimonials
create policy "admin update testimonials" on public.testimonials for update to authenticated using (true);
create policy "admin delete testimonials" on public.testimonials for delete to authenticated using (true);

-- public brief-upload bucket + policies
insert into storage.buckets (id, name, public) values ('briefs', 'briefs', true)
on conflict (id) do nothing;
create policy "public upload briefs" on storage.objects for insert with check (bucket_id = 'briefs');
create policy "public read briefs" on storage.objects for select using (bucket_id = 'briefs');

insert into public.projects (id, title, tagline, description, category, tech, image, url, year, accent) values
  ('aurora-dashboard', 'Aurora Analytics', 'Realtime intelligence suite', 'A luxury analytics platform with live charts, glass panels and predictive insights.', 'fullstack', '["Next.js","TypeScript","Supabase","Recharts","Tailwind"]', '/projects/aurora.svg', '#', '2025', '#22d3ee'),
  ('noir-commerce', 'Noir Commerce', 'Dark-mode headless storefront', 'A headless commerce experience with cinematic product pages and 60fps micro-interactions.', 'web', '["Next.js","Stripe","Zod","Framer Motion","Postgres"]', '/projects/noir.svg', '#', '2025', '#e879f9'),
  ('lumen-brand', 'Lumen Identity', 'Brand system & motion language', 'A complete visual identity for an AI research lab — logo suite, typography and generative art direction.', 'design', '["Figma","After Effects","GLSL","Blender"]', '/projects/lumen.svg', '#', '2024', '#e6c98b')
on conflict (id) do nothing;

insert into public.skills (category, icon, accent, items, sort) values
  ('Frontend', 'code', 'neon', '[{"name":"React / Next.js","level":95},{"name":"TypeScript","level":92},{"name":"Three.js / WebGL","level":84},{"name":"Tailwind / CSS","level":96}]', 1),
  ('Backend', 'server', 'neon2', '[{"name":"Node / APIs","level":88},{"name":"Postgres / Supabase","level":85},{"name":"Auth & Security","level":80},{"name":"Serverless / Edge","level":78}]', 2),
  ('Tools & Craft', 'wrench', 'gold', '[{"name":"UI / Motion Design","level":93},{"name":"Design Systems","level":90},{"name":"Figma / Blender","level":82},{"name":"Performance / SEO","level":86}]', 3)
on conflict do nothing;

insert into public.experience (id, role, company, period, description, highlights, sort) values
  ('lead-1', 'Senior Product Engineer', 'Northstar Studio', '2023 — Present', 'Leading a 6-person product squad building the studio flagship analytics suite.', '["Shipped the design system used across 4 products","Cut bundle size 61%","Mentored 3 engineers"]', 1),
  ('mid-1', 'Creative Technologist', 'Vantablack Labs', '2021 — 2023', 'Bridged design and engineering for interactive campaigns and 3D web experiences.', '["12 WebGL campaigns, 2 award winners","Built in-house motion-tooling pipeline"]', 2)
on conflict (id) do nothing;

insert into public.testimonials (id, quote, name, role, avatar, rating, status) values
  ('t1', 'Ariadne doesn''t just build interfaces — she builds the entire experience.', 'Maya Chen', 'VP Product, Northstar Studio', '/avatars/maya.svg', 5, 'approved'),
  ('t2', 'The fastest, most meticulous engineer I''ve ever worked with.', 'Jonas Weber', 'Creative Director, Vantablack Labs', '/avatars/jonas.svg', 5, 'approved')
on conflict (id) do nothing;

insert into public.now (role, focus, learning) values
  ('Senior Product Engineer @ Northstar Studio', '3D interfaces & design systems', 'WebGPU, Rust, spatial UI');
