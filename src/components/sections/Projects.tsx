"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import FilterTabs from "@/components/ui/FilterTabs";
import Tilt from "@/components/ui/Tilt";
import type { Project, ProjectCategory } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { setPaletteProjects } from "@/lib/palette-store";
import ProjectCard from "@/components/sections/projects/ProjectCard";
import ProjectToolbar from "@/components/sections/projects/ProjectToolbar";
import ProjectModal from "@/components/sections/projects/ProjectModal";
import { useLikes } from "@/components/sections/projects/useLikes";

const FILTERS: Array<{ key: ProjectCategory | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI & RAG" },
  { key: "data", label: "Data Engineering" },
  { key: "ml", label: "Machine Learning" },
  { key: "fullstack", label: "Systems" },
];

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"year" | "tech" | "title">("year");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [active, setActive] = useState<Project | null>(null);

  const { likes, toggleLike } = useLikes();

  useEffect(() => setPaletteProjects(projects), [projects]);

  const visible = useMemo(() => {
    let list =
      filter === "all" ? [...projects] : projects.filter((p) => p.category === filter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.tech.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (sort === "tech") list.sort((a, b) => b.tech.length - a.tech.length);
    if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "year") list.sort((a, b) => (b.year ?? "").localeCompare(a.year ?? ""));
    return list;
  }, [projects, filter, query, sort]);

  const openProject = (p: Project) => {
    setActive(p);
    fetch("/api/projects/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id }),
    }).catch(() => {});
  };

  return (
    <section id="projects" className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Selected work"
          title="Featured"
          highlight="systems & tools."
          ghost="02"
        />

        <FilterTabs
          tabs={FILTERS}
          active={filter}
          onChange={setFilter}
          layoutId="projects-filter-pill"
          className="justify-start sm:justify-center mb-8"
        />

        <ProjectToolbar
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
        />

        {/* Project grid / list */}
        <div
          className={cn(
            view === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              : "grid gap-5",
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
                    <ProjectCard
                      project={p}
                      view="grid"
                      liked={Boolean(likes[p.id])}
                      onToggleLike={toggleLike}
                      onOpen={openProject}
                    />
                  </Tilt>
                ) : (
                  <div className="group h-full">
                    <ProjectCard
                      project={p}
                      view="list"
                      liked={Boolean(likes[p.id])}
                      onToggleLike={toggleLike}
                      onOpen={openProject}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <p className="py-16 text-center text-sm text-mist">
            No projects match &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <ProjectModal
            project={active}
            projects={projects}
            visible={visible}
            liked={Boolean(likes[active.id])}
            onToggleLike={toggleLike}
            onOpen={openProject}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
