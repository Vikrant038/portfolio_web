"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  ExternalLink,
  Heart,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { Project } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  view: "grid" | "list";
  liked: boolean;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onOpen: (p: Project) => void;
}

/* ------------------------------------------------------------------ */
/*  Grid variant — image on top, compact card layout                   */
/* ------------------------------------------------------------------ */

function GridCard({ project: p, liked, onToggleLike, onOpen }: Omit<ProjectCardProps, "view">) {
  return (
    <GlassCard
      glow={p.accent}
      className="flex h-full flex-col cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
      rounded="2xl"
    >
      <div onClick={() => onOpen(p)} className="flex h-full flex-col p-6">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
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
            <h3 className="font-serif text-xl font-bold text-paper transition-colors group-hover:text-neon">
              {p.title}
            </h3>
            <div className="relative z-30 flex items-center gap-1.5 pointer-events-auto">
              {p.url && p.url !== "#" && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Open live demo for ${p.title}`}
                  className="grid h-8 w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-lg border border-neon/40 bg-neon/10 text-neon transition-all hover:bg-neon/20 hover:scale-105 active:scale-95"
                  title="Live Demo"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={(e) => onToggleLike(p.id, e)}
                aria-label="Like project"
                className={cn(
                  "grid h-8 w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-lg border transition-colors active:scale-95",
                  liked
                    ? "border-rose-400/50 bg-rose-400/10 text-rose-400"
                    : "border-white/10 bg-white/[0.04] text-mist hover:text-rose-400",
                )}
              >
                <Heart className={cn("h-3.5 w-3.5", liked && "fill-rose-400")} />
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
}

/* ------------------------------------------------------------------ */
/*  List variant — horizontal layout with image on left                */
/* ------------------------------------------------------------------ */

function ListCard({ project: p, liked, onToggleLike, onOpen }: Omit<ProjectCardProps, "view">) {
  return (
    <GlassCard glow={p.accent} rounded="2xl" className="h-full cursor-pointer transition-transform duration-300 hover:scale-[1.01]">
      <div onClick={() => onOpen(p)} className="flex h-full flex-col gap-5 p-6 sm:flex-row">
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
              <h3 className="font-serif text-xl font-bold text-paper transition-colors group-hover:text-neon">
                {p.title}
              </h3>
              <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-mist">
                {p.tagline} · {p.year}
              </p>
            </div>
            <div className="relative z-30 flex items-center gap-2 pointer-events-auto">
              {p.url && p.url !== "#" && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Open live demo for ${p.title}`}
                  className="grid h-9 w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-xl border border-neon/40 bg-neon/10 text-neon transition-all hover:bg-neon/20 hover:scale-105 active:scale-95"
                  title="Live Demo"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                type="button"
                onClick={(e) => onToggleLike(p.id, e)}
                aria-label="Like project"
                className={cn(
                  "grid h-9 w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-xl border transition-colors active:scale-95",
                  liked
                    ? "border-rose-400/50 bg-rose-400/10 text-rose-400"
                    : "border-white/10 bg-white/[0.04] text-mist hover:text-rose-400",
                )}
              >
                <Heart className={cn("h-4 w-4", liked && "fill-rose-400")} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(p);
                }}
                aria-label={`View details for ${p.title}`}
                className="grid h-9 w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist transition-colors hover:border-neon/40 hover:text-neon active:scale-95"
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
  );
}

/* ------------------------------------------------------------------ */
/*  Public API — dispatches to the correct variant                     */
/* ------------------------------------------------------------------ */

export default function ProjectCard(props: ProjectCardProps) {
  return props.view === "grid" ? (
    <GridCard {...props} />
  ) : (
    <ListCard {...props} />
  );
}
