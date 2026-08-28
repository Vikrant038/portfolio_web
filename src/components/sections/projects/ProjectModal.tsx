"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Code2,
  Heart,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/supabase";

interface ProjectModalProps {
  project: Project;
  projects: Project[];
  visible: Project[];
  liked: boolean;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onOpen: (p: Project) => void;
  onClose: () => void;
  modalRef?: React.RefObject<HTMLDivElement>;
}

export default function ProjectModal({
  project,
  projects,
  visible,
  liked,
  onToggleLike,
  onOpen,
  onClose,
}: ProjectModalProps) {
  const [slide, setSlide] = useState(0);

  const gallery = project.gallery?.length ? project.gallery : [project.image];
  const activeIndex = visible.findIndex((p) => p.id === project.id);

  // Reset gallery slide when project changes
  useEffect(() => {
    setSlide(0);
  }, [project.id]);

  const related = useMemo(() => {
    return projects
      .filter((p) => p.id !== project.id)
      .sort((a, b) => {
        const sa = a.tech.filter((t) => project.tech.includes(t)).length;
        const sb = b.tech.filter((t) => project.tech.includes(t)).length;
        return sb - sa;
      })
      .slice(0, 2);
  }, [project, projects]);

  const step = (dir: 1 | -1) => {
    const list = visible.length > 0 && activeIndex !== -1 ? visible : projects;
    const idx = list.findIndex((p) => p.id === project.id);
    if (idx === -1) return;
    const next = list[(idx + dir + list.length) % list.length];
    if (next) onOpen(next);
  };

  return (
    <Modal
      isOpen={Boolean(project)}
      onClose={onClose}
      title={project.title}
      ariaLabel={project.title}
      maxWidth="2xl"
      showCloseButton={true}
    >
      {/* Gallery */}
      <div className="relative aspect-[16/9] sm:aspect-[16/8] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={gallery[slide]}
            src={gallery[slide]}
            alt={`${project.title} - visual ${slide + 1} of ${gallery.length}`}
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />

        {/* Gallery dots */}
        {gallery.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Go to visual ${i + 1}`}
                className={
                  "h-1.5 rounded-full transition-all duration-300 " +
                  (i === slide ? "w-6 bg-neon" : "w-1.5 bg-white/40 hover:bg-white/70")
                }
              />
            ))}
          </div>
        )}

        {/* Prev / next project navigation */}
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
            {(activeIndex !== -1 ? activeIndex : projects.findIndex((p) => p.id === project.id)) + 1} / {activeIndex !== -1 ? visible.length : projects.length}
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

      {/* Project info */}
      <div className="p-5 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neon">
              {project.category} · {project.year}
            </p>
            <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-paper">
              {project.title}
            </h3>
          </div>
          <button
            onClick={(e) => onToggleLike(project.id, e)}
            aria-label="Like project"
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition-colors",
              liked
                ? "border-rose-400/50 bg-rose-400/10 text-rose-400"
                : "border-white/10 text-mist hover:text-rose-400",
            )}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-rose-400")} />
          </button>
        </div>
        <p className="mt-1 text-sm italic text-mist">{project.tagline}</p>
        <p className="mt-4 text-[14.5px] sm:text-[15px] leading-relaxed text-mist">
          {project.description}
        </p>

        {/* Case study blocks */}
        {(project.challenge || project.approach || project.impact) && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {([
              { t: "Challenge", v: project.challenge },
              { t: "Approach", v: project.approach },
              { t: "Impact", v: project.impact },
            ] as const)
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

        {/* Tech tags */}
        <div className="mt-6 flex flex-wrap gap-1.5 sm:gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-paper"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Action links */}
        <div className="mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
          {project.url && project.url !== "#" && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="neo flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:text-neon active:neo-inset text-center"
            >
              <ExternalLink className="h-4 w-4 text-neon" />
              Live Demo
            </a>
          )}
          {project.repo && project.repo !== "#" && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="glass flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-mist transition-colors hover:text-paper text-center"
            >
              <Code2 className="h-4 w-4" />
              Source code
            </a>
          )}
        </div>

        {/* Related projects */}
        {related.length > 0 && (
          <div className="mt-9 border-t border-white/[0.07] pt-6">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">
              Keep exploring
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onOpen(r)}
                  className="glass group flex items-center gap-4 rounded-2xl p-3 text-left transition-colors hover:border-neon/30"
                >
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="80px"
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-paper">{r.title}</p>
                    <p className="text-[11px] text-mist">{r.year}</p>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4 text-mist transition-colors group-hover:text-neon" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
