"use client";

import { useState, useRef, useMemo } from "react";
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
  Play,
  Pause,
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

interface FlattenedSkill {
  name: string;
  tag?: string;
  blurb?: string;
  categoryName: string;
  categoryIcon: "code" | "server" | "wrench" | "terminal" | "shield" | "sparkles";
  accent: "neon" | "neon2" | "gold";
}

export default function Skills({ groups, now }: SkillsProps) {
  // -1 indicates "All Technologies" selected
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(-1);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Flatten all skills with category metadata for the "All" view
  const allSkills = useMemo<FlattenedSkill[]>(() => {
    return groups.flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        categoryName: group.category,
        categoryIcon: group.icon,
        accent: group.accent,
      }))
    );
  }, [groups]);

  // Current active skills list based on selected category
  const activeSkills = useMemo<FlattenedSkill[]>(() => {
    if (selectedCategoryIndex === -1) {
      return allSkills;
    }
    const group = groups[selectedCategoryIndex];
    if (!group) return allSkills;
    return group.items.map((item) => ({
      ...item,
      categoryName: group.category,
      categoryIcon: group.icon,
      accent: group.accent,
    }));
  }, [selectedCategoryIndex, groups, allSkills]);

  // Ensure minimum number of items so the infinite loop never runs short on 4K/wide screens
  const infiniteTrackItems = useMemo(() => {
    if (activeSkills.length === 0) return [];
    let base = [...activeSkills];
    while (base.length < 10) {
      base = [...base, ...activeSkills];
    }
    // Duplicate exactly once for seamless left-to-right infinite loop:
    // translateX(-50%) to translateX(0%)
    return [...base, ...base];
  }, [activeSkills]);

  // Active theme color
  const activeGroup = selectedCategoryIndex >= 0 ? groups[selectedCategoryIndex] : null;
  const activeColor = activeGroup ? COLORS[activeGroup.accent] ?? "var(--neon)" : "var(--neon)";
  const ActiveHeaderIcon = activeGroup ? (ICONS as any)[activeGroup.icon] ?? Sparkles : Sparkles;

  // Track whether the marquee is paused
  const isPaused = isHovered || isManualPaused;

  // Toggle card expansion
  const toggleSkill = (name: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Check if all current active items are expanded
  const areAllExpanded =
    activeSkills.length > 0 && activeSkills.every((s) => expandedMap[s.name]);

  const toggleExpandAll = () => {
    const newState = !areAllExpanded;
    setExpandedMap((prev) => {
      const next = { ...prev };
      activeSkills.forEach((s) => {
        next[s.name] = newState;
      });
      return next;
    });
  };

  const selectCategory = (index: number) => {
    setSelectedCategoryIndex(index);
    if (tabsContainerRef.current) {
      const tabButton = tabsContainerRef.current.children[index + 1] as HTMLElement;
      if (tabButton) {
        tabButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  // Adjust animation duration depending on total count to maintain steady visual speed
  const animationDuration = selectedCategoryIndex === -1 ? "60s" : "30s";

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
        {/* Horizontal Category Filter Pills                              */}
        {/* ------------------------------------------------------------- */}
        <Reveal delay={0.05}>
          <div className="relative mb-6">
            <div className="overflow-hidden rounded-2xl p-1.5 sm:p-2 border border-white/[0.08] bg-black/40 backdrop-blur-xl">
              <div
                ref={tabsContainerRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 snap-x snap-mandatory"
                role="tablist"
                aria-label="Filter technology categories"
              >
                {/* "All Technologies" Tab */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCategoryIndex === -1}
                  onClick={() => selectCategory(-1)}
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 snap-start select-none outline-none focus-visible:ring-2 focus-visible:ring-neon ${
                    selectedCategoryIndex === -1
                      ? "text-paper font-semibold shadow-sm"
                      : "text-mist/80 hover:text-paper hover:bg-white/[0.04]"
                  }`}
                >
                  {selectedCategoryIndex === -1 && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "color-mix(in srgb, var(--neon) 14%, rgba(255, 255, 255, 0.04))",
                        border: "1px solid color-mix(in srgb, var(--neon) 45%, transparent)",
                        boxShadow: "0 0 24px -6px color-mix(in srgb, var(--neon) 50%, transparent)",
                      }}
                    />
                  )}
                  <span className="relative z-10 grid h-6 w-6 place-items-center text-neon">
                    <Sparkles size={16} />
                  </span>
                  <span className="relative z-10">All Tech Stack</span>
                  <span
                    className="relative z-10 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium"
                    style={{
                      background: selectedCategoryIndex === -1 ? "color-mix(in srgb, var(--neon) 20%, transparent)" : "rgba(255, 255, 255, 0.06)",
                      color: selectedCategoryIndex === -1 ? "var(--neon)" : "rgb(var(--mist))",
                    }}
                  >
                    {allSkills.length}
                  </span>
                </button>

                {/* Individual Category Tabs */}
                {groups.map((group, index) => {
                  const Icon = (ICONS as any)[group.icon] ?? Code2;
                  const isCurrent = index === selectedCategoryIndex;
                  const groupColor = COLORS[group.accent] ?? "var(--neon)";

                  return (
                    <button
                      key={group.category}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      onClick={() => selectCategory(index)}
                      className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 snap-start select-none outline-none focus-visible:ring-2 focus-visible:ring-neon ${
                        isCurrent
                          ? "text-paper font-semibold shadow-sm"
                          : "text-mist/80 hover:text-paper hover:bg-white/[0.04]"
                      }`}
                    >
                      {isCurrent && (
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
                        className="relative z-10 grid h-6 w-6 place-items-center transition-transform duration-300"
                        style={{
                          color: isCurrent ? groupColor : "inherit",
                        }}
                      >
                        <Icon size={16} />
                      </span>

                      <span className="relative z-10">{group.category}</span>

                      <span
                        className="relative z-10 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium"
                        style={{
                          background: isCurrent
                            ? `color-mix(in srgb, ${groupColor} 20%, transparent)`
                            : "rgba(255, 255, 255, 0.06)",
                          color: isCurrent ? groupColor : "rgb(var(--mist))",
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
        {/* The Movable Skills Box (Left-to-Right Scrolling Stream)        */}
        {/* ------------------------------------------------------------- */}
        <Reveal delay={0.1}>
          <div
            className="group relative rounded-3xl border border-white/[0.09] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl shadow-2xl overflow-hidden p-5 sm:p-7 md:p-8 transition-colors duration-500"
            style={{
              boxShadow: `0 24px 60px -20px rgba(0, 0, 0, 0.6), 0 0 40px -15px color-mix(in srgb, ${activeColor} 20%, transparent)`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => {
              // On mobile touch, resume after a gentle pause
              setTimeout(() => setIsHovered(false), 1800);
            }}
          >
            {/* Box Header: Title, Live Motion State Badge & Controls */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.07] pb-5">
              <div className="flex items-center gap-3.5">
                <span
                  className="grid h-11 w-11 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-2xl transition-all duration-300"
                  style={{
                    border: `1px solid ${activeColor}44`,
                    background: `color-mix(in srgb, ${activeColor} 12%, transparent)`,
                    color: activeColor,
                    boxShadow: `0 0 24px -6px ${activeColor}88`,
                  }}
                >
                  <ActiveHeaderIcon size={22} />
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-paper">
                      {activeGroup ? activeGroup.category : "Full Agentic & Production Stack"}
                    </h3>
                    <span className="text-[11px] font-mono text-mist/60">
                      {activeSkills.length} technologies
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-mist/85">
                    {activeGroup?.tagline ?? "Movable left-to-right stream · Hover to halt motion · Click card to reveal one-liner"}
                  </p>
                </div>
              </div>

              {/* Controls & Live Motion Status Pill */}
              <div className="flex items-center flex-wrap gap-2.5">
                {/* Live Status Pill */}
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium border transition-colors duration-300 select-none ${
                    isPaused
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                      : "border-neon/40 bg-neon/10 text-neon"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      isPaused
                        ? "bg-amber-400"
                        : "bg-neon animate-ping"
                    }`}
                  />
                  <span>
                    {isPaused ? "Motion Paused (Hover / Touch)" : "Scrolling Left → Right"}
                  </span>
                </div>

                {/* Manual Play / Pause Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsManualPaused((prev) => !prev)}
                  aria-label={isManualPaused ? "Resume scrolling motion" : "Pause scrolling motion"}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-paper transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  {isManualPaused ? (
                    <>
                      <Play size={12} className="text-neon" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause size={12} className="text-mist" />
                      <span>Pause</span>
                    </>
                  )}
                </button>

                {/* Expand / Collapse All */}
                <button
                  type="button"
                  onClick={toggleExpandAll}
                  aria-label={areAllExpanded ? "Collapse all details" : "Expand all details"}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-paper transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  {areAllExpanded ? (
                    <>
                      <Minimize2 size={12} />
                      <span className="hidden sm:inline">Collapse All</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 size={12} />
                      <span className="hidden sm:inline">Expand All</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* The Infinite Movable Track: Left-to-Right Scrolling Motion  */}
            {/* ----------------------------------------------------------- */}
            <div className="relative overflow-hidden w-full py-2 -mx-2 px-2 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
              <div
                key={`${selectedCategoryIndex}-${animationDuration}`}
                className="flex items-start gap-4 w-max animate-scroll-ltr group-hover:[animation-play-state:paused]"
                style={{
                  animationDuration,
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              >
                {infiniteTrackItems.map((s, idx) => {
                  const isExpanded = !!expandedMap[s.name];
                  const itemColor = COLORS[s.accent] ?? "var(--neon)";

                  return (
                    <div
                      key={`${s.name}-${idx}`}
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
                      className={`group/card relative w-[280px] sm:w-[320px] md:w-[350px] shrink-0 rounded-2xl border transition-all duration-300 p-4 sm:p-4.5 cursor-pointer outline-none select-none text-left ${
                        isExpanded
                          ? "bg-white/[0.07] shadow-xl"
                          : "bg-white/[0.025] hover:bg-white/[0.05] hover:-translate-y-1"
                      }`}
                      style={{
                        borderColor: isExpanded
                          ? `color-mix(in srgb, ${itemColor} 50%, rgba(255, 255, 255, 0.15))`
                          : "rgba(255, 255, 255, 0.08)",
                        boxShadow: isExpanded
                          ? `0 12px 30px -10px rgba(0, 0, 0, 0.6), 0 0 24px -8px color-mix(in srgb, ${itemColor} 35%, transparent)`
                          : undefined,
                      }}
                    >
                      {/* Category Micro-tag */}
                      {selectedCategoryIndex === -1 && (
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className="text-[10px] font-mono uppercase tracking-wider text-mist/70 truncate max-w-[200px]"
                          >
                            {s.categoryName.split("&")[0].trim()}
                          </span>
                        </div>
                      )}

                      {/* Top Header Row (Always Visible) */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full transition-all duration-300"
                            style={{
                              background: isExpanded ? itemColor : `color-mix(in srgb, ${itemColor} 55%, white)`,
                              boxShadow: isExpanded ? `0 0 8px ${itemColor}` : "none",
                            }}
                          />
                          <span className="truncate text-sm sm:text-[14.5px] font-semibold tracking-tight text-paper group-hover/card:text-white">
                            {s.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {s.tag && (
                            <span
                              className="rounded-md px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide uppercase"
                              style={{
                                border: `1px solid color-mix(in srgb, ${itemColor} 30%, transparent)`,
                                background: `color-mix(in srgb, ${itemColor} 10%, transparent)`,
                                color: itemColor,
                              }}
                            >
                              {s.tag}
                            </span>
                          )}

                          {/* Animated Chevron Indicator */}
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="grid h-6 w-6 place-items-center rounded-lg bg-white/[0.04] text-mist group-hover/card:text-paper group-hover/card:bg-white/[0.08]"
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
                                style={{ background: itemColor }}
                              />
                              <p className="font-normal text-paper/90">{s.blurb}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Interaction Guide */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-mist/70">
              <span className="flex items-center gap-1.5">
                <Info size={13} className="text-mist/50" />
                <span>Hovering over this box pauses motion immediately · Moving mouse away resumes</span>
              </span>
              <span className="hidden sm:inline font-mono text-[10px] text-mist/50">
                Direction: Left → Right
              </span>
            </div>
          </div>
        </Reveal>

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
