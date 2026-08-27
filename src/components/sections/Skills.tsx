"use client";

import { Code2, ServerCog, Wrench, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GlassCard from "@/components/ui/GlassCard";
import RadialProgress from "@/components/ui/RadialProgress";
import type { SkillGroup } from "@/lib/supabase";

const ICONS = {
  code: Code2,
  server: ServerCog,
  wrench: Wrench,
} as const;

const COLORS = {
  neon: "var(--neon)",
  neon2: "var(--neon2)",
  gold: "var(--gold)",
} as const;

const LEARNING = [
  "MLOps / LLMOps",
  "PyTorch",
  "Data Structures & Algorithms",
  "German (A1 → B1)",
  "Multi-Agent Systems",
  "Vector Search / Embeddings",
  "Apache Airflow",
];

interface SkillsProps {
  groups: SkillGroup[];
  now?: { role: string; focus: string; learning: string };
}

export default function Skills({ groups, now }: SkillsProps) {
  return (
    <section id="skills" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{ background: "rgb(var(--neon2) / 0.05)" }}
      />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Capabilities"
          title="A stack built for"
          highlight="velocity."
          ghost="03"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {groups.map((group, gi) => {
            const Icon = ICONS[group.icon] ?? Wrench;
            const color = COLORS[group.accent] ?? "var(--neon)";
            return (
              <Reveal key={group.category} delay={gi * 0.12}>
                <GlassCard glow={color} className="group h-full p-7 sm:p-8">
                  <div className="mb-7 flex items-center gap-4">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                      style={{
                        border: `1px solid ${color}44`,
                        background: `color-mix(in srgb, ${color} 10%, transparent)`,
                        color,
                        boxShadow: `0 0 26px -8px ${color}80`,
                      }}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-paper">
                        {group.category}
                      </h3>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-mist">
                        {group.items.length} core skills
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3">
                    {group.items.map((s) => (
                      <RadialProgress
                        key={s.name}
                        label={s.name}
                        value={s.level}
                        color={color}
                        blurb={s.blurb}
                      />
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>

        {/* Now card */}
        {now && (
          <Reveal delay={0.15}>
            <div className="glass mt-8 flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-neon/10 text-neon">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neon">
                    Now
                  </p>
                  <p className="mt-1 text-sm font-semibold text-paper">{now.role}</p>
                  <p className="text-[12.5px] text-mist">
                    Focus: {now.focus} · Learning: {now.learning}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* learning marquee */}
        <Reveal delay={0.2}>
          <div className="mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className="flex w-max animate-marquee gap-10">
              {[...LEARNING, ...LEARNING].map((t, i) => (
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
