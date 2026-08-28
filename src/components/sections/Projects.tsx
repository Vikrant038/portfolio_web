"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  X,
  ExternalLink,
  Search,
  LayoutGrid,
  List,
  Heart,
  ChevronLeft,
  ChevronRight,
  Code2,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Tilt from "@/components/ui/Tilt";
import FilterTabs from "@/components/ui/FilterTabs";
import type { Project, ProjectCategory } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { setPaletteProjects } from "@/lib/palette-store";
import { useModal } from "@/lib/use-modal";

const FILTERS: Array<{ key: ProjectCategory | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI & RAG" },
  { key: "data", label: "Data Engineering" },
  { key: "ml", label: "Machine Learning" },
  { key: "fullstack", label: "Systems" },
];

const LIKES_KEY = "luxe-likes";

function readLikes(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LIKES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"year" | "tech" | "title">("year");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [active, setActive] = useState<Project | null>(null);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [slide, setSlide] = useState(0);

  const modalRef = useModal<HTMLDivElement>({
    isOpen: Boolean(active),
    onClose: () => setActive(null),
  });

  useEffect(() => setPaletteProjects(projects), [projects]);
  useEffect(() => setLikes(readLikes()), []);

  const visible = useMemo(() => {
    let list =
      filter === "all" ? [...projects] : projects.filter((p) => p.category === filter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.tech.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === "tech") list.sort((a, b) => b.tech.length - a.tech.length);
    if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "year") list.sort((a, b) => (b.year ?? "").localeCompare(a.year ?? ""));
    return list;
  }, [projects, filter, query, sort]);

  const activeIndex = active ? visible.findIndex((p) => p.id === active.id) : -1;
  const gallery = active?.gallery?.length ? active.gallery : active ? [active.image] : [];

  // reset the gallery slide whenever a new project opens
  useEffect(() => {
    setSlide(0);
  }, [active?.id]);
  const related = useMemo(() => {
    if (!active) return [];
    return projects
      .filter((p) => p.id !== active.id)
      .sort((a, b) => {
        const sa = a.tech.filter((t) => active.tech.includes(t)).length;
        const sb = b.tech.filter((t) => active.tech.includes(t)).length;
        return sb - sa;
      })
      .slice(0, 2);
  }, [active, projects]);

  function toggleLike(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const next = { ...likes, [id]: !likes[id] };
    setLikes(next);
    try {
      window.localStorage.setItem(LIKES_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  const step = (dir: 1 | -1) => {
    const list = visible.length > 0 && activeIndex !== -1 ? visible : projects;
    const idx = list.findIndex((p) => p.id === active?.id);
    if (idx === -1) return;
    const next = list[(idx + dir + list.length) % list.length];
    if (next) openProject(next);
  };

  const openProject = (p: Project) => {
    setActive(p);
    fetch("/api/projects/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id }),
    }).catch(() => {});
  };

  // Body scroll lock and Esc closes modal
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const card = (p: Project, list: boolean) =>
    list ? (
      <GlassCard glow={p.accent} rounded="2xl" className="h-full cursor-pointer transition-transform duration-300 hover:scale-[1.01]">
        <div onClick={() => openProject(p)} className="flex h-full flex-col gap-5 p-6 sm:flex-row">
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl sm:w-56">
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="(max-width: 640px) 100vw, 224px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-paper transition-colors group-hover:text-neon">{p.title}</h3>
                <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-mist">
                  {p.tagline} · {p.year}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {p.url && p.url !== "#" && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Open live demo for ${p.title}`}
                    className="grid h-9 w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-xl border border-neon/40 bg-neon/10 text-neon transition-all hover:bg-neon/20 hover:scale-105"
                    title="Live Demo"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={(e) => toggleLike(p.id, e)}
                  aria-label="Like project"
                  className={cn(
                    "grid h-9 w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-xl border transition-colors",
                    likes[p.id]
                      ? "border-rose-400/50 bg-rose-400/10 text-rose-400"
                      : "border-white/10 bg-white/[0.04] text-mist hover:text-rose-400"
                  )}
                >
                  <Heart className={cn("h-4 w-4", likes[p.id] && "fill-rose-400")} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openProject(p);
                  }}
                  aria-label={`View details for ${p.title}`}
                  className="grid h-9 w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist transition-colors hover:border-neon/40 hover:text-neon"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-[14.5px] leading-relaxed text-mist">
              {p.description}
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              {p.tech.slice(0, 4).map((t) => (
                <span key={t} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-mist">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    ) : (
      <GlassCard glow={p.accent} className="flex h-full flex-col cursor-pointer transition-transform duration-300 hover:scale-[1.01]" rounded="2xl">
        <div onClick={() => openProject(p)} className="flex h-full flex-col p-6">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="rounded-md bg-void/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mist backdrop-blur-md">
                {p.category}
              </span>
              <span className="rounded-md bg-void/80 px-2 py-0.5 font-mono text-[10px] text-mist backdrop-blur-md">
                {p.year}
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col pt-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-xl font-bold text-paper transition-colors group-hover:text-neon">{p.title}</h3>
              <div className="flex items-center gap-1.5">
                {p.url && p.url !== "#" && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Open live demo for ${p.title}`}
                    className="grid h-8 w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-lg border border-neon/40 bg-neon/10 text-neon transition-all hover:bg-neon/20 hover:scale-105"
                    title="Live Demo"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={(e) => toggleLike(p.id, e)}
                  aria-label="Like project"
                  className={cn(
                    "grid h-8 w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-lg border transition-colors",
                    likes[p.id]
                      ? "border-rose-400/50 bg-rose-400/10 text-rose-400"
                      : "border-white/10 bg-white/[0.04] text-mist hover:text-rose-400"
                  )}
                >
                  <Heart className={cn("h-3.5 w-3.5", likes[p.id] && "fill-rose-400")} />
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-mist">{p.tagline}</p>
            <p className="mt-3 line-clamp-2 text-[14.5px] leading-relaxed text-mist">{p.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
              {p.tech.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10.5px] font-medium text-mist">
                  {t}
                </span>
              ))}
              {p.tech.length > 3 && (
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10.5px] font-medium text-mist">
                  +{p.tech.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    );

  return (
    <section id="projects" className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Selected work"
          title="Featured"
          highlight="systems & tools."
          ghost="02"
        />

        {/* filter tabs */}
        <FilterTabs
          tabs={FILTERS}
          active={filter}
          onChange={setFilter}
          layoutId="projects-filter-pill"
          className="justify-center mb-8"
        />

        {/* search + sort + view */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <div className="glass flex w-full max-w-xs items-center gap-2 rounded-2xl px-4 py-2.5">
            <Search className="h-4 w-4 text-mist" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects or tech…"
              aria-label="Search projects"
              className="w-full bg-transparent text-sm text-paper outline-none placeholder:text-mist/60"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort projects"
            className="glass rounded-2xl px-4 py-2.5 text-sm text-mist outline-none"
          >
            <option value="year">Newest first</option>
            <option value="tech">Most tech</option>
            <option value="title">A → Z</option>
          </select>
          <div className="glass flex gap-1 rounded-2xl p-1.5">
            {([
              { key: "grid", icon: LayoutGrid, label: "Grid view" },
              { key: "list", icon: List, label: "List view" },
            ] as const).map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                aria-label={v.label}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-xl transition-colors",
                  view === v.key ? "bg-neon/15 text-neon" : "text-mist hover:text-paper"
                )}
              >
                <v.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* grid */}
        <div
          className={cn(
            view === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              : "grid gap-5"
          )}
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className={cn(view === "list" && "sm:col-span-2 lg:col-span-3")}
              >
                {view === "grid" ? (
                  <Tilt max={4} className="group h-full">
                    {card(p, false)}
                  </Tilt>
                ) : (
                  <div className="group h-full">{card(p, true)}</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <p className="py-16 text-center text-sm text-mist">
            No projects match “{query}”.
          </p>
        )}
      </div>

      {/* detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-void/80 p-0 sm:p-4 backdrop-blur-lg overscroll-contain"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
              data-lenis-prevent="true"
              className="glass-strong relative max-h-[90vh] sm:max-h-[88vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-3xl sm:rounded-3xl shadow-glass pb-safe"
            >
              {/* Mobile bottom sheet top drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden" aria-hidden>
                <div className="h-1.5 w-12 rounded-full bg-white/20" />
              </div>

              <div className="relative aspect-[16/9] sm:aspect-[16/8] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={gallery[slide]}
                    src={gallery[slide]}
                    alt={`${active.title} - visual ${slide + 1} of ${gallery.length}`}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-void/60 text-paper backdrop-blur-xl transition-colors hover:border-neon/50 hover:text-neon"
                >
                  <X className="h-4 w-4" />
                </button>
                {/* visual indicator dots */}
                {gallery.length > 1 && (
                  <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
                    {gallery.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlide(i)}
                        aria-label={`Go to visual ${i + 1}`}
                        className={
                          "h-1.5 rounded-full transition-all duration-300 " +
                          (i === slide
                            ? "w-6 bg-neon"
                            : "w-1.5 bg-white/40 hover:bg-white/70")
                        }
                      />
                    ))}
                  </div>
                )}
                {/* prev / next project */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                  <button
                    onClick={() => step(-1)}
                    aria-label="Previous project"
                    className="neo grid h-9 w-9 place-items-center rounded-xl bg-ink text-paper transition-colors hover:text-neon active:neo-inset"
                    title="Previous Project"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="rounded-lg bg-void/80 px-2.5 py-1 text-[11px] font-semibold text-mist backdrop-blur-md">
                    {(activeIndex !== -1 ? activeIndex : projects.findIndex((p) => p.id === active.id)) + 1} / {activeIndex !== -1 ? visible.length : projects.length}
                  </span>
                  <button
                    onClick={() => step(1)}
                    aria-label="Next project"
                    className="neo grid h-9 w-9 place-items-center rounded-xl bg-ink text-paper transition-colors hover:text-neon active:neo-inset"
                    title="Next Project"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neon">
                      {active.category} · {active.year}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-paper">
                      {active.title}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => toggleLike(active.id, e)}
                    aria-label="Like project"
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition-colors",
                      likes[active.id]
                        ? "border-rose-400/50 bg-rose-400/10 text-rose-400"
                        : "border-white/10 text-mist hover:text-rose-400"
                    )}
                  >
                    <Heart className={cn("h-5 w-5", likes[active.id] && "fill-rose-400")} />
                  </button>
                </div>
                <p className="mt-1 text-sm italic text-mist">{active.tagline}</p>
                <p className="mt-4 text-[14.5px] sm:text-[15px] leading-relaxed text-mist">
                  {active.description}
                </p>

                {/* case study */}
                {(active.challenge || active.approach || active.impact) && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      { t: "Challenge", v: active.challenge },
                      { t: "Approach", v: active.approach },
                      { t: "Impact", v: active.impact },
                    ]
                      .filter((x) => x.v)
                      .map((x) => (
                        <div key={x.t} className="glass rounded-2xl p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neon">
                            {x.t}
                          </p>
                          <p className="mt-2 text-[12.5px] leading-relaxed text-mist">
                            {x.v}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-1.5 sm:gap-2">
                  {active.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-paper"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
                  {active.url && active.url !== "#" && (
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:text-neon active:neo-inset text-center"
                    >
                      <ExternalLink className="h-4 w-4 text-neon" />
                      Live Demo
                    </a>
                  )}
                  {active.repo && active.repo !== "#" && (
                    <a
                      href={active.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-mist transition-colors hover:text-paper text-center"
                    >
                      <Code2 className="h-4 w-4" />
                      Source code
                    </a>
                  )}
                </div>

                {related.length > 0 && (
                  <div className="mt-9 border-t border-white/[0.07] pt-6">
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">
                      Keep exploring
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {related.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setActive(r)}
                          className="glass group flex items-center gap-4 rounded-2xl p-3 text-left transition-colors hover:border-neon/30"
                        >
                          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={r.image}
                              alt={r.title}
                              fill
                              sizes="80px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-paper">
                              {r.title}
                            </p>
                            <p className="text-[11px] text-mist">{r.year}</p>
                          </div>
                          <ArrowUpRight className="ml-auto h-4 w-4 text-mist transition-colors group-hover:text-neon" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
