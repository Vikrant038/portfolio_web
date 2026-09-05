"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  Database,
  Users,
  ChevronDown,
  Check,
  Info,
  Layers,
  Cpu,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import AmbientGlow from "@/components/ui/AmbientGlow";
import type { SkillGroup } from "@/lib/supabase";

export type DomainCategory = "all" | "ai" | "backend" | "leadership";

interface SkillItem {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  domain: "ai" | "backend" | "leadership";
  accent: "neon" | "neon2" | "gold";
}

const ALL_SKILLS_DATA: SkillItem[] = [
  // -------------------------------------------------------------
  // 1. AI-Related Skills
  // -------------------------------------------------------------
  {
    id: "langgraph",
    name: "LangGraph",
    tag: "Orchestration",
    blurb: "Stateful cyclical graphs, human-in-the-loop checkpoints, and branching decision logic",
    domain: "ai",
    accent: "neon",
  },
  {
    id: "langchain",
    name: "LangChain & LCEL",
    tag: "Composition",
    blurb: "Declarative chain composition, document loaders, schema validation, and output parsers",
    domain: "ai",
    accent: "neon",
  },
  {
    id: "multi-agent",
    name: "Multi-Agent Swarms",
    tag: "Autonomous",
    blurb: "Supervisor-worker hierarchies, contract-driven code execution, and autonomous agent loops",
    domain: "ai",
    accent: "neon",
  },
  {
    id: "tool-calling",
    name: "Tool Calling & Structured Output",
    tag: "Deterministic",
    blurb: "Function calling with strict Pydantic/Zod schemas, JSON mode, and dynamic retry gates",
    domain: "ai",
    accent: "neon",
  },
  {
    id: "model-routing",
    name: "Model Routing & Failover",
    tag: "Resilience",
    blurb: "LiteLLM, Groq, Claude 3.5, Gemini 2.0, and OpenAI dynamic fallback chains",
    domain: "ai",
    accent: "neon",
  },
  {
    id: "cot-reasoning",
    name: "Chain-of-Thought & Reasoning",
    tag: "Reasoning",
    blurb: "Structured step-by-step reasoning prompts, self-consistency sampling, and reflection loops",
    domain: "ai",
    accent: "gold",
  },
  {
    id: "few-shot",
    name: "Few-Shot In-Context Learning",
    tag: "Optimization",
    blurb: "Optimal exemplar selection, dynamic example retrieval, and edge-case priming",
    domain: "ai",
    accent: "gold",
  },
  {
    id: "system-prompts",
    name: "System Prompt Architecture",
    tag: "Architecture",
    blurb: "Defensive role conditioning, output schema contract definition, and anti-jailbreak constraints",
    domain: "ai",
    accent: "gold",
  },
  {
    id: "context-window",
    name: "Context Window Optimization",
    tag: "Efficiency",
    blurb: "Token compression, context pruning, parent-child context stacking, and lost-in-the-middle mitigation",
    domain: "ai",
    accent: "gold",
  },
  {
    id: "json-schemas",
    name: "Deterministic JSON Schemas",
    tag: "Structured",
    blurb: "Zero-shot Pydantic models, JSON mode enforcement, and programmatic schema validation",
    domain: "ai",
    accent: "gold",
  },
  {
    id: "claude-code",
    name: "Claude Code CLI",
    tag: "CLI Agent",
    blurb: "Terminal autonomous coding agent for deep codebase exploration, multi-file refactoring, and test fixes",
    domain: "ai",
    accent: "neon2",
  },
  {
    id: "cursor-composer",
    name: "Cursor (Composer & Agents)",
    tag: "Daily Driver",
    blurb: "Multi-file contextual generation, composer loop, semantic codebase indexing, and fast prototyping",
    domain: "ai",
    accent: "neon2",
  },
  {
    id: "windsurf",
    name: "Windsurf & Cascade",
    tag: "Accelerated",
    blurb: "Cascade flows, deep repo context mapping, and prompt-driven rapid iteration",
    domain: "ai",
    accent: "neon2",
  },
  {
    id: "crag",
    name: "Corrective RAG (CRAG)",
    tag: "Active RAG",
    blurb: "Self-grading relevance gates, document transform fallbacks, and web search augmentation",
    domain: "ai",
    accent: "neon",
  },
  {
    id: "hybrid-retrieval",
    name: "Hybrid Retrieval",
    tag: "Dense + Sparse",
    blurb: "Combining dense vector embeddings (BGE-M3, OpenAI) with sparse BM25 keyword matching",
    domain: "ai",
    accent: "neon",
  },
  {
    id: "pgvector",
    name: "pgvector & Supabase",
    tag: "Vector DB",
    blurb: "High-scale HNSW indexing, Cosine/L2 distance search, and metadata pre-filtering",
    domain: "ai",
    accent: "neon",
  },
  {
    id: "cohere-rerank",
    name: "Cohere Rerank & Chunking",
    tag: "Relevance",
    blurb: "Semantic chunking, parent-document retrieval, and cross-encoder rerankers",
    domain: "ai",
    accent: "neon",
  },
  {
    id: "chromadb",
    name: "ChromaDB & Vector Stores",
    tag: "Storage",
    blurb: "Partitioned collections, embedding pipelines, and semantic similarity indexing",
    domain: "ai",
    accent: "neon",
  },
  {
    id: "ragas-trulens",
    name: "RAG Triad (Ragas & TruLens)",
    tag: "Evaluation",
    blurb: "Automated scoring of Faithfulness, Answer Relevance, and Context Precision",
    domain: "ai",
    accent: "gold",
  },
  {
    id: "langsmith",
    name: "LangSmith",
    tag: "Observability",
    blurb: "Distributed LLM execution tracing, latency/token usage monitoring, and regression benchmarking",
    domain: "ai",
    accent: "gold",
  },
  {
    id: "guardrails-ai",
    name: "Guardrails AI & Safety",
    tag: "Defense",
    blurb: "Prompt injection detection, PII masking, schema validation, and hallucination gating",
    domain: "ai",
    accent: "gold",
  },
  {
    id: "golden-datasets",
    name: "Golden Datasets & Benchmarks",
    tag: "Testing",
    blurb: "Ground-truth test suites for regression testing prompt changes and model upgrades",
    domain: "ai",
    accent: "gold",
  },
  {
    id: "cost-optimization",
    name: "Cost & Token Optimization",
    tag: "Cost Control",
    blurb: "Semantic response caching, prompt token budgets, and LLMOps performance tracking",
    domain: "ai",
    accent: "gold",
  },

  // -------------------------------------------------------------
  // 2. Technical Skills & Backend System Design
  // -------------------------------------------------------------
  {
    id: "fastapi",
    name: "Python (FastAPI, Pydantic v2)",
    tag: "Backend",
    blurb: "High-throughput asynchronous APIs, strict data validation, and automated OpenAPI contracts",
    domain: "backend",
    accent: "neon2",
  },
  {
    id: "nextjs-ts",
    name: "TypeScript & Next.js 14/15",
    tag: "Fullstack",
    blurb: "Strict typing across client/server boundaries, React Server Components, and streaming UI",
    domain: "backend",
    accent: "neon2",
  },
  {
    id: "postgres-dwh",
    name: "PostgreSQL & Data Warehousing",
    tag: "Data Eng",
    blurb: "Star schema, Bronze/Silver/Gold ETL, CTEs & window functions, and ACID transactions",
    domain: "backend",
    accent: "neon2",
  },
  {
    id: "docker",
    name: "Docker & Containerization",
    tag: "DevOps",
    blurb: "Reproducible container environments, multi-stage builds, and microservices orchestration",
    domain: "backend",
    accent: "neon2",
  },
  {
    id: "git-worktrees",
    name: "Git Worktrees & CI/CD Gates",
    tag: "Workflows",
    blurb: "Parallel agent branch development with tamper-proof automated testing pipelines",
    domain: "backend",
    accent: "neon2",
  },
  {
    id: "linux-bash",
    name: "Linux & Shell Automation",
    tag: "Automation",
    blurb: "Advanced Bash scripting, server environment orchestration, and container process control",
    domain: "backend",
    accent: "neon2",
  },
  {
    id: "medallion-etl",
    name: "Medallion Data Architecture",
    tag: "ETL Pipeline",
    blurb: "Raw source extraction to clean Silver enrichment and aggregated Gold analytics mart",
    domain: "backend",
    accent: "neon2",
  },
  {
    id: "rest-sse",
    name: "REST & Streaming Endpoints",
    tag: "Architecture",
    blurb: "SSE (Server-Sent Events) for real-time LLM token streaming and responsive client feeds",
    domain: "backend",
    accent: "neon2",
  },
  {
    id: "query-opt",
    name: "Query Optimization & Indexing",
    tag: "Performance",
    blurb: "EXPLAIN ANALYZE query planning, partial indexes, and connection pool scaling",
    domain: "backend",
    accent: "neon2",
  },

  // -------------------------------------------------------------
  // 3. Leadership and Communication
  // -------------------------------------------------------------
  {
    id: "team-lead",
    name: "Technical Team Leadership",
    tag: "Leadership",
    blurb: "Led 6-person team across MarTech & ICP labs at Deep Thought Analytics, setting direction and velocity",
    domain: "leadership",
    accent: "gold",
  },
  {
    id: "systems-thinking",
    name: "Systems Thinking & TPM",
    tag: "Frameworks",
    blurb: "PDGMS/TPM frameworks, identifying and eliminating team bottlenecks, and P&L prioritization",
    domain: "leadership",
    accent: "gold",
  },
  {
    id: "ldi-training",
    name: "LDI Training & Mentorship",
    tag: "Mentoring",
    blurb: "Moderated Leadership Development Initiative for 27 people, upskilling teammates on AI workflows",
    domain: "leadership",
    accent: "gold",
  },
  {
    id: "founder-outreach",
    name: "Founder Outreach & Relations",
    tag: "Strategy",
    blurb: "Executive communication initiative that converted 5 founders to business roundtables within one month",
    domain: "leadership",
    accent: "gold",
  },
  {
    id: "cross-functional",
    name: "Cross-Functional Direction",
    tag: "Execution",
    blurb: "Bridged business analyst interns and engineering squads to translate ambiguous goals into software",
    domain: "leadership",
    accent: "gold",
  },
  {
    id: "high-ownership",
    name: "0-to-1 Technical Ownership",
    tag: "Accountability",
    blurb: "Autonomous execution from raw idea to production architecture with rigorous test coverage",
    domain: "leadership",
    accent: "gold",
  },
];

const DROPDOWN_OPTIONS: {
  key: DomainCategory;
  label: string;
  shortLabel: string;
  icon: any;
  count: number;
}[] = [
  {
    key: "all",
    label: "All Capabilities & Skills",
    shortLabel: "All Skills",
    icon: Layers,
    count: ALL_SKILLS_DATA.length,
  },
  {
    key: "ai",
    label: "AI-Related Skills",
    shortLabel: "AI & Agentic Skills",
    icon: Bot,
    count: ALL_SKILLS_DATA.filter((s) => s.domain === "ai").length,
  },
  {
    key: "backend",
    label: "Technical & Backend System Design",
    shortLabel: "Backend & Systems",
    icon: Database,
    count: ALL_SKILLS_DATA.filter((s) => s.domain === "backend").length,
  },
  {
    key: "leadership",
    label: "Leadership & Communication",
    shortLabel: "Leadership & Comm",
    icon: Users,
    count: ALL_SKILLS_DATA.filter((s) => s.domain === "leadership").length,
  },
];

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
  groups?: SkillGroup[];
  now?: { role: string; focus: string; learning: string };
}

export default function Skills({ now }: SkillsProps) {
  const [selectedDomain, setSelectedDomain] = useState<DomainCategory>("all");
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter skills based on selected domain
  const filteredSkills = useMemo(() => {
    if (selectedDomain === "all") return ALL_SKILLS_DATA;
    return ALL_SKILLS_DATA.filter((s) => s.domain === selectedDomain);
  }, [selectedDomain]);

  // Dynamically break skills into alternating, aesthetically patterned lines
  // Some lines have more skills, some have fewer, creating a balanced organic tapestry
  const skillLines = useMemo(() => {
    const total = filteredSkills.length;
    if (total === 0) return [];

    // Line distribution patterns for different counts
    let lineSizes: number[] = [];
    if (selectedDomain === "leadership") {
      // 6 items -> 3, 3
      lineSizes = [3, 3];
    } else if (selectedDomain === "backend") {
      // 9 items -> 4, 5
      lineSizes = [4, 5];
    } else if (selectedDomain === "ai") {
      // 23 items -> 5, 6, 4, 5, 3
      lineSizes = [5, 6, 4, 5, 3];
    } else {
      // All (38 items) -> 5, 6, 4, 6, 5, 6, 6
      lineSizes = [5, 6, 4, 6, 5, 6, 6];
    }

    const lines: SkillItem[][] = [];
    let currentIndex = 0;
    let sizeIndex = 0;

    while (currentIndex < total) {
      const size = lineSizes[sizeIndex % lineSizes.length] || 5;
      const chunk = filteredSkills.slice(currentIndex, currentIndex + size);
      if (chunk.length > 0) {
        lines.push(chunk);
      }
      currentIndex += size;
      sizeIndex++;
    }

    return lines;
  }, [filteredSkills, selectedDomain]);

  const activeOption =
    DROPDOWN_OPTIONS.find((opt) => opt.key === selectedDomain) ?? DROPDOWN_OPTIONS[0];
  const DropdownIcon = activeOption.icon;

  return (
    <section id="skills" className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden">
      <AmbientGlow
        color={selectedDomain === "backend" ? "neon2" : selectedDomain === "leadership" ? "gold" : "neon"}
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 pointer-events-none"
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
        {/* Top Control Bar: Filter Dropdown & Spotlight Indicator        */}
        {/* Positioned at the top, right below the main topic             */}
        {/* ------------------------------------------------------------- */}
        <Reveal delay={0.06}>
          <div className="my-6 sm:my-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            {/* Active Skill Spotlight / Guide Notice */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-neon/10 text-neon border border-neon/20">
                <Info size={15} />
              </span>
              <div className="min-w-0">
                {hoveredSkill ? (
                  <p className="text-xs sm:text-sm text-paper truncate">
                    <strong className="text-neon font-semibold">{hoveredSkill.name}</strong>:{" "}
                    <span className="text-mist">{hoveredSkill.blurb}</span>
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-mist/80">
                    Hover or tap any skill box to inspect its practical production engineering role.
                  </p>
                )}
              </div>
            </div>

            {/* Top Dropdown Filter Option */}
            <div className="relative shrink-0 w-full sm:w-auto" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2.5 text-xs sm:text-sm font-medium text-paper transition-all duration-200 backdrop-blur-xl hover:border-white/20 focus-visible:ring-2 focus-visible:ring-neon select-none"
              >
                <div className="flex items-center gap-2">
                  <DropdownIcon size={16} className="text-neon" />
                  <span className="font-semibold">{activeOption.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-mist">
                    {activeOption.count}
                  </span>
                  <motion.span
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-mist"
                  >
                    <ChevronDown size={14} />
                  </motion.span>
                </div>
              </button>

              {/* Luxury Glass Dropdown Menu (opens downward) */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 z-50 w-full sm:w-80 rounded-2xl border border-white/15 bg-[#0e101c]/95 p-2 backdrop-blur-2xl shadow-2xl"
                    style={{
                      boxShadow: "0 24px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px -10px rgba(255, 143, 64, 0.25)",
                    }}
                    role="listbox"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-mist/60 border-b border-white/[0.06] mb-1">
                      Filter Capabilities
                    </div>

                    {DROPDOWN_OPTIONS.map((opt) => {
                      const isSelected = opt.key === selectedDomain;
                      const Icon = opt.icon;

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSelectedDomain(opt.key);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-left text-xs sm:text-sm font-medium transition-all duration-200 ${
                            isSelected
                              ? "bg-neon/15 text-neon font-semibold"
                              : "text-mist hover:text-paper hover:bg-white/[0.05]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon size={16} className={isSelected ? "text-neon" : "text-mist"} />
                            <span className="truncate">{opt.label}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-mist">
                              {opt.count}
                            </span>
                            {isSelected && <Check size={14} className="text-neon" />}
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------- */}
        {/* Full-Page Skills Canvas (No Enclosing Box)                    */}
        {/* Staggered Alternating Line Pattern with Hover One-Liner Reveal*/}
        {/* ------------------------------------------------------------- */}
        <Reveal delay={0.08}>
          <div className="relative my-4 sm:my-6 w-full">
            <motion.div
              layout
              className="flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 md:gap-4.5"
            >
              <AnimatePresence mode="popLayout">
                {skillLines.map((line, lineIdx) => (
                  <motion.div
                    key={`line-${selectedDomain}-${lineIdx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, delay: lineIdx * 0.04 }}
                    className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3.5 md:gap-4 w-full"
                  >
                    {line.map((skill) => {
                      const skillColor = COLORS[skill.accent] ?? "var(--neon)";
                      const isHovered = hoveredSkill?.id === skill.id;

                      return (
                        <div
                          key={skill.id}
                          className="relative"
                          onMouseEnter={() => setHoveredSkill(skill)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          onClick={() => setHoveredSkill(isHovered ? null : skill)}
                        >
                          {/* Small Rectangular Box */}
                          <motion.div
                            whileHover={{ y: -3, scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className={`relative flex items-center gap-2 sm:gap-2.5 rounded-xl border px-3.5 py-2 sm:px-4 sm:py-2.5 cursor-pointer select-none transition-all duration-300 backdrop-blur-md ${
                              isHovered
                                ? "bg-white/[0.08] shadow-lg"
                                : "bg-white/[0.025] hover:bg-white/[0.05]"
                            }`}
                            style={{
                              borderColor: isHovered
                                ? `color-mix(in srgb, ${skillColor} 60%, rgba(255, 255, 255, 0.2))`
                                : "rgba(255, 255, 255, 0.08)",
                              boxShadow: isHovered
                                ? `0 10px 24px -6px rgba(0,0,0,0.5), 0 0 20px -6px color-mix(in srgb, ${skillColor} 40%, transparent)`
                                : undefined,
                            }}
                          >
                            {/* Color Dot Indicator */}
                            <span
                              className="h-2 w-2 shrink-0 rounded-full transition-all duration-300"
                              style={{
                                background: isHovered ? skillColor : `color-mix(in srgb, ${skillColor} 65%, white)`,
                                boxShadow: isHovered ? `0 0 10px ${skillColor}` : "none",
                              }}
                            />

                            {/* Skill Name */}
                            <span className="text-[13px] sm:text-[14px] font-semibold tracking-tight text-paper transition-colors duration-200">
                              {skill.name}
                            </span>

                            {/* Domain / Specialty Tag */}
                            {skill.tag && (
                              <span
                                className="rounded-md px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-mono font-medium tracking-wide uppercase transition-colors"
                                style={{
                                  border: `1px solid color-mix(in srgb, ${skillColor} 30%, transparent)`,
                                  background: `color-mix(in srgb, ${skillColor} 10%, transparent)`,
                                  color: skillColor,
                                }}
                              >
                                {skill.tag}
                              </span>
                            )}
                          </motion.div>

                          {/* Floating Luxury Glass Tooltip (Revealed on Hover/Tap) */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.94 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-72 sm:w-80 pointer-events-none"
                              >
                                <div
                                  className="relative rounded-2xl border border-white/[0.15] bg-[#0c0e18]/95 p-3.5 sm:p-4 backdrop-blur-2xl shadow-2xl"
                                  style={{
                                    boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 24px -6px color-mix(in srgb, ${skillColor} 35%, transparent)`,
                                    borderColor: `color-mix(in srgb, ${skillColor} 45%, rgba(255, 255, 255, 0.15))`,
                                  }}
                                >
                                  {/* Tooltip Header */}
                                  <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-2 mb-2">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ background: skillColor }}
                                      />
                                      <span className="text-xs font-bold text-white tracking-tight">
                                        {skill.name}
                                      </span>
                                    </div>
                                    <span
                                      className="text-[9.5px] font-mono uppercase px-1.5 py-0.5 rounded"
                                      style={{
                                        color: skillColor,
                                        background: `color-mix(in srgb, ${skillColor} 12%, transparent)`,
                                      }}
                                    >
                                      {skill.tag}
                                    </span>
                                  </div>

                                  {/* Tooltip One-Liner Description */}
                                  <p className="text-xs sm:text-[12.5px] leading-relaxed text-paper/95 font-normal">
                                    {skill.blurb}
                                  </p>

                                  {/* Downward Pointer Arrow */}
                                  <div
                                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 bg-[#0c0e18] border-r border-b"
                                    style={{
                                      borderColor: `color-mix(in srgb, ${skillColor} 45%, rgba(255, 255, 255, 0.15))`,
                                    }}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------- */}
        {/* Now Live Card                                                 */}
        {/* ------------------------------------------------------------- */}
        {now && (
          <Reveal delay={0.15}>
            <div className="glass mt-12 flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
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
