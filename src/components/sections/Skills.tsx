"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Terminal,
  Database,
  ShieldCheck,
  Layers,
  Sparkles,
  Code2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Info,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import AmbientGlow from "@/components/ui/AmbientGlow";
import type { SkillGroup } from "@/lib/supabase";

const ICONS = {
  code: Bot,
  sparkles: Sparkles,
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

const COLOR_RGB = {
  neon: "255 143 64",
  neon2: "45 212 205",
  gold: "232 201 142",
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
  const [activeTab, setActiveTab] = useState(0);
  // Map of skill names to expanded boolean state
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const activeGroup = groups[activeTab] ?? groups[0];
  const activeColor = COLORS[activeGroup?.accent ?? "neon"] ?? "var(--neon)";
  const activeRgb = COLOR_RGB[activeGroup?.accent ?? "neon"] ?? "255 143 64";
  const ActiveIcon = (ICONS as any)[activeGroup?.icon] ?? Code2;

  // Check if all items in the current active group are expanded
  const areAllExpanded =
    activeGroup?.items.length > 0 &&
    activeGroup.items.every((item) => expandedMap[item.name]);

  const toggleSkill = (name: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const toggleExpandAll = () => {
    if (!activeGroup) return;
    const newState = !areAllExpanded;
    setExpandedMap((prev) => {
      const next = { ...prev };
      activeGroup.items.forEach((item) => {
        next[item.name] = newState;
      });
      return next;
    });
  };

  const scrollToTab = (index: number) => {
    setActiveTab(index);
    if (tabsContainerRef.current) {
      const tabButton = tabsContainerRef.current.children[index] as HTMLElement;
      if (tabButton) {
        tabButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  const handlePrev = () => {
    const nextIndex = activeTab === 0 ? groups.length - 1 : activeTab - 1;
    scrollToTab(nextIndex);
  };

  const handleNext = () => {
    const nextIndex = activeTab === groups.length - 1 ? 0 : activeTab + 1;
    scrollToTab(nextIndex);
  };

  return (
    <section id="skills" className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden">
      <AmbientGlow
        color={activeGroup?.accent === "neon2" ? "neon2" : activeGroup?.accent === "gold" ? "gold" : "neon"}
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
        size={540}
      />

      <div className="section-shell">
        <SectionHeading
          eyebrow="Capabilities & Stack"
          title="Applied AI, Agentic Systems &"
          highlight="engineering stack."
          ghost="03"
        />

        {/* ------------------------------------------------------------- */}
        {/* Horizontal Category Navigation Bar (Tab Deck)                 */}
        {/* ------------------------------------------------------------- */}
        <Reveal delay={0.05}>
          <div className="relative mb-6">
            {/* Desktop Left/Right quick nav arrows */}
            <div className="hidden lg:flex items-center justify-between absolute -top-11 right-0 gap-2 z-10">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous tech category"
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-paper"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next tech category"
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mist transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-paper"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Horizontal Scroll Track with mobile touch momentum */}
            <div className="relative overflow-hidden rounded-2xl p-1.5 sm:p-2 border border-white/[0.08] bg-black/40 backdrop-blur-xl">
              <div
                ref={tabsContainerRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 snap-x snap-mandatory"
                role="tablist"
                aria-label="Tech Stack Categories"
              >
                {groups.map((group, index) => {
                  const Icon = (ICONS as any)[group.icon] ?? Code2;
                  const isActive = index === activeTab;
                  const groupColor = COLORS[group.accent] ?? "var(--neon)";

                  return (
                    <button
                      key={group.category}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`panel-${index}`}
                      id={`tab-${index}`}
                      onClick={() => scrollToTab(index)}
                      className={`relative flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 snap-start select-none outline-none focus-visible:ring-2 focus-visible:ring-neon ${
                        isActive
                          ? "text-paper font-semibold shadow-sm"
                          : "text-mist/80 hover:text-paper hover:bg-white/[0.04]"
                      }`}
                    >
                      {/* Active sliding background pill */}
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryPill"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: `color-mix(in srgb, ${groupColor} 14%, rgba(255, 255, 255, 0.04))`,
                            border: `1px solid color-mix(in srgb, ${groupColor} 45%, transparent)`,
                            boxShadow: `0 0 24px -6px color-mix(in srgb, ${groupColor} 50%, transparent)`,
                          }}
                        />
                      )}

                      <span
                        className="relative z-10 grid h-6 w-6 place-items-center rounded-lg transition-transform duration-300"
                        style={{
                          color: isActive ? groupColor : "inherit",
                        }}
                      >
                        <Icon size={16} />
                      </span>

                      <span className="relative z-10">{group.category}</span>

                      <span
                        className="relative z-10 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium transition-colors"
                        style={{
                          background: isActive
                            ? `color-mix(in srgb, ${groupColor} 20%, transparent)`
                            : "rgba(255, 255, 255, 0.06)",
                          color: isActive ? groupColor : "rgb(var(--mist))",
                        }}
                      >
                        {group.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------- */}
        {/* Active Category Stage (Horizontal Presentation)               */}
        {/* ------------------------------------------------------------- */}
        <AnimatePresence mode="wait">
          {activeGroup && (
            <motion.div
              key={activeGroup.category}
              id={`panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative rounded-3xl border border-white/[0.09] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 sm:p-7 md:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden"
              style={{
                boxShadow: `0 24px 60px -20px rgba(0, 0, 0, 0.6), 0 0 40px -15px color-mix(in srgb, ${activeColor} 20%, transparent)`,
              }}
            >
              {/* Category Showcase Header */}
              <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.07] pb-5 sm:pb-6">
                <div className="flex items-start sm:items-center gap-4">
                  <span
                    className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl transition-transform duration-300"
                    style={{
                      border: `1px solid ${activeColor}44`,
                      background: `color-mix(in srgb, ${activeColor} 12%, transparent)`,
                      color: activeColor,
                      boxShadow: `0 0 30px -8px ${activeColor}88`,
                    }}
                  >
                    <ActiveIcon size={26} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-paper">
                        {activeGroup.category}
                      </h3>
                      <span className="text-[11px] font-mono text-mist/60">
                        {String(activeTab + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}
                      </span>
                    </div>
                    {activeGroup.tagline && (
                      <p className="mt-1 text-xs sm:text-sm text-mist/85 max-w-2xl leading-relaxed">
                        {activeGroup.tagline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Header Action Tools: Expand All + Helper Badge */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-1 sm:pt-0">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-mist/70">
                    <Info size={13} className="text-mist/50" />
                    <span className="hidden sm:inline">Tap any card to view one-liner detail</span>
                    <span className="sm:hidden">Tap card for details</span>
                  </span>

                  <button
                    type="button"
                    onClick={toggleExpandAll}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-paper transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    {areAllExpanded ? (
                      <>
                        <Minimize2 size={13} />
                        <span>Collapse All</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 size={13} />
                        <span>Expand All</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* --------------------------------------------------------- */}
              {/* Technology Stack Items Grid (Click to reveal one-liner)   */}
              {/* --------------------------------------------------------- */}
              <div className="grid gap-3 sm:gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {activeGroup.items.map((s, idx) => {
                  const isExpanded = !!expandedMap[s.name];

                  return (
                    <motion.div
                      key={s.name}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      onClick={() => toggleSkill(s.name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleSkill(s.name);
                        }
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 p-4 sm:p-4.5 cursor-pointer outline-none select-none text-left ${
                        isExpanded
                          ? "bg-white/[0.06] shadow-lg"
                          : "bg-white/[0.025] hover:bg-white/[0.05] hover:-translate-y-0.5"
                      }`}
                      style={{
                        borderColor: isExpanded
                          ? `color-mix(in srgb, ${activeColor} 45%, rgba(255, 255, 255, 0.12))`
                          : "rgba(255, 255, 255, 0.08)",
                        boxShadow: isExpanded
                          ? `0 12px 28px -10px rgba(0, 0, 0, 0.5), 0 0 20px -8px color-mix(in srgb, ${activeColor} 30%, transparent)`
                          : undefined,
                      }}
                    >
                      {/* Compact Header Row (Always Visible) */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full transition-all duration-300"
                            style={{
                              background: isExpanded ? activeColor : `color-mix(in srgb, ${activeColor} 50%, white)`,
                              boxShadow: isExpanded ? `0 0 8px ${activeColor}` : "none",
                            }}
                          />
                          <span className="truncate text-sm sm:text-[14.5px] font-semibold tracking-tight text-paper group-hover:text-white">
                            {s.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {s.tag && (
                            <span
                              className="rounded-md px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide uppercase"
                              style={{
                                border: `1px solid color-mix(in srgb, ${activeColor} 30%, transparent)`,
                                background: `color-mix(in srgb, ${activeColor} 10%, transparent)`,
                                color: activeColor,
                              }}
                            >
                              {s.tag}
                            </span>
                          )}

                          {/* Smooth rotation chevron */}
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="grid h-6 w-6 place-items-center rounded-lg bg-white/[0.04] text-mist group-hover:text-paper group-hover:bg-white/[0.08]"
                          >
                            <ChevronDown size={14} />
                          </motion.span>
                        </div>
                      </div>

                      {/* Expandable One-Liner Detail (Revealed on Click) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && s.blurb && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-start gap-2 text-xs sm:text-[12.5px] leading-relaxed text-mist">
                              <span
                                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ background: activeColor }}
                              />
                              <p className="font-normal text-paper/90">{s.blurb}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Category Footer Navigation Pager */}
              <div className="mt-7 sm:mt-8 pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs text-mist">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 font-medium hover:text-paper transition-colors py-1"
                >
                  <ChevronLeft size={14} />
                  <span>
                    Previous:{" "}
                    <strong className="text-paper font-semibold">
                      {groups[activeTab === 0 ? groups.length - 1 : activeTab - 1]?.category.split("&")[0].trim()}
                    </strong>
                  </span>
                </button>

                <div className="flex items-center gap-1.5">
                  {groups.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToTab(i)}
                      aria-label={`Go to category ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeTab ? "w-6 bg-neon" : "w-1.5 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 font-medium hover:text-paper transition-colors py-1"
                >
                  <span>
                    Next:{" "}
                    <strong className="text-paper font-semibold">
                      {groups[activeTab === groups.length - 1 ? 0 : activeTab + 1]?.category.split("&")[0].trim()}
                    </strong>
                  </span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------- */}
        {/* Now Live Card                                                 */}
        {/* ------------------------------------------------------------- */}
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
                    Focus: <span className="text-paper">{now.focus}</span> · Learning:{" "}
                    <span className="text-paper">{now.learning}</span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Active Stack Highlights Marquee                               */}
        {/* ------------------------------------------------------------- */}
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
