"use client";

import {
  Bot,
  Terminal,
  Database,
  ShieldCheck,
  Layers,
  Code2,
  ServerCog,
  Wrench,
  Sparkles,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GlassCard from "@/components/ui/GlassCard";
import AmbientGlow from "@/components/ui/AmbientGlow";
import type { SkillGroup } from "@/lib/supabase";

const ICONS = {
  code: Bot,
  terminal: Terminal,
  server: Database,
  shield: ShieldCheck,
  wrench: Layers,
} as const;

const COLORS = {
  neon: "var(--neon)",
  neon2: "var(--neon2)",
  gold: "var(--gold)",
} as const;

const STACK_MARQUEE = [
  "LangGraph",
  "Claude Code CLI",
  "Cursor Composer",
  "Corrective RAG (CRAG)",
  "LangSmith Tracing",
  "Ragas & TruLens",
  "Multi-Agent Swarms",
  "pgvector & Supabase",
  "Python & FastAPI",
  "BGE-M3 Embeddings",
  "Cohere Rerank",
  "Next.js 15 & TypeScript",
  "Pydantic v2",
  "Docker & Worktrees",
];

interface SkillsProps {
  groups: SkillGroup[];
  now?: { role: string; focus: string; learning: string };
}

export default function Skills({ groups, now }: SkillsProps) {
  return (
    <section id="skills" className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden">
      <AmbientGlow color="neon2" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={520} />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Capabilities & Stack"
          title="Applied AI, Agentic Systems &"
          highlight="engineering stack."
          ghost="03"
        />

        {/* Bento Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
          {groups.map((group, gi) => {
            const Icon = (ICONS as any)[group.icon] ?? Code2;
            const color = COLORS[group.accent] ?? "var(--neon)";
            // First 2 cards take 3 columns each on desktop; next 3 cards take 2 columns each
            const colSpan = gi < 2 ? "lg:col-span-3" : "lg:col-span-2";

            return (
              <Reveal key={group.category} delay={gi * 0.1} className={colSpan}>
                <GlassCard glow={color} className="group flex h-full flex-col justify-between p-6 sm:p-7">
                  <div>
                    {/* Card Header */}
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <span
                          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6"
                          style={{
                            border: `1px solid ${color}44`,
                            background: `color-mix(in srgb, ${color} 10%, transparent)`,
                            color,
                            boxShadow: `0 0 26px -8px ${color}80`,
                          }}
                        >
                          <Icon size={22} />
                        </span>
                        <div>
                          <h3 className="font-serif text-lg font-bold leading-tight text-paper sm:text-xl">
                            {group.category}
                          </h3>
                          {group.tagline && (
                            <p className="mt-0.5 text-[11px] text-mist/80">
                              {group.tagline}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className="hidden rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider sm:inline-block"
                        style={{
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          color: "rgb(var(--mist))",
                        }}
                      >
                        {group.items.length} tools
                      </span>
                    </div>

                    {/* Skill items capsules */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {group.items.map((s) => (
                        <div
                          key={s.name}
                          className="relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-lg"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[13px] font-semibold text-paper group-hover:text-white">
                                {s.name}
                              </span>
                              {s.tag && (
                                <span
                                  className="shrink-0 rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider"
                                  style={{
                                    border: `1px solid ${color}35`,
                                    background: `color-mix(in srgb, ${color} 12%, transparent)`,
                                    color,
                                  }}
                                >
                                  {s.tag}
                                </span>
                              )}
                            </div>
                            {s.blurb && (
                              <p className="mt-1.5 text-[11px] leading-relaxed text-mist">
                                {s.blurb}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>

        {/* Now live card */}
        {now && (
          <Reveal delay={0.15}>
            <div className="glass mt-8 flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-neon/10 text-neon">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neon">
                    Current Focus & Learning
                  </p>
                  <p className="mt-1 text-sm font-semibold text-paper">{now.role}</p>
                  <p className="text-[12.5px] text-mist">
                    Focus: <span className="text-paper">{now.focus}</span> · Learning: <span className="text-paper">{now.learning}</span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Active stack highlights marquee */}
        <Reveal delay={0.2}>
          <div className="mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className="flex w-max animate-marquee gap-10">
              {[...STACK_MARQUEE, ...STACK_MARQUEE].map((t, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 whitespace-nowrap text-sm font-medium tracking-wide text-mist"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-neon/70 shadow-[0_0_8px_rgb(var(--neon)/0.8)]" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
