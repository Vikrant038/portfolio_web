import { getSupabase } from "./supabase";
import type {
  ExperienceItem,
  Project,
  SkillGroup,
  Testimonial,
} from "./supabase";

/* ------------------------------------------------------------------ */
/*  Local seed content - Vikrant Yadav's real portfolio content.       */
/*  Used when Supabase is not configured or the tables are missing.    */
/* ------------------------------------------------------------------ */

export const localProjects: Project[] = [
  {
    id: "behorden-bot",
    title: "Behörden-Bot",
    tagline: "Corrective RAG for German immigration & study",
    description:
      "A production-grade Corrective RAG (CRAG) assistant answering German visa, APS, blocked-account, and university-admission questions in English and German - with citations and a fail-closed safety guardrail. Evolved through three measured generations: naive dense retrieval → hybrid (dense + BM25 with reciprocal rank fusion) → corrective RAG with a self-graded relevance gate and GDPR-compliant PII masking.",
    category: "ai",
    tech: ["Next.js 15", "TypeScript", "PostgreSQL", "pgvector", "Groq", "BGE-M3"],
    image: "/projects/aurora.svg",
    gallery: ["/projects/aurora.svg", "/projects/aurora-detail.svg"],
    url: "https://guiding-star-bot-advanced-crag.vercel.app/",
    repo: "https://github.com/Vikrant038/Beh-rden-Bot-Advanced-CRAG",
    year: "2026",
    accent: "#ff8f40",
    metrics: ["MRR@10 75.6% → 97.5%", "+26.9% answer relevance", "898 tests passing"],
    challenge:
      "Applying to a German university means navigating dozens of official, mostly-German sources (BAMF, DAAD, uni-assist) - and a confident wrong answer about a visa rule can void a semester.",
    approach:
      "Built a hybrid retrieval pipeline (dense + BM25 + reranking), then added a Corrective RAG relevance gate that judges its own retrieval before answering - refusing honestly instead of hallucinating - plus bilingual sub-query expansion and PII masking for GDPR.",
    impact:
      "Fine-tuning the embedding model on 150 domain triples lifted retrieval MRR@10 from 75.6% to 97.5%; the full CRAG pipeline beat the naive baseline by +26.9% on answer relevance, measured with an LLM-as-judge evaluation harness.",
  },
  {
    id: "multi-agent-orchestrator",
    title: "Multi-Agent Dev Orchestrator",
    tagline: "A near-free multi-agent software development system",
    description:
      "One paid planner model (DeepSeek V4) decomposes a feature request into frozen, non-overlapping task contracts - interfaces and tests written first. Free-tier coding-agent workers then execute tasks in parallel, isolated git worktrees, routed through a self-hosted LiteLLM gateway with automatic fallback across five-plus free providers.",
    category: "fullstack",
    tech: ["TypeScript", "Node.js", "LiteLLM", "SQLite", "Git Worktrees"],
    image: "/projects/noir.svg",
    gallery: ["/projects/noir.svg", "/projects/noir-detail.svg"],
    url: "#",
    repo: "#",
    year: "2026",
    accent: "#2dd4cd",
    metrics: ["Cents/day to run", "Tamper-proof PR gate", "3 phases shipped"],
    challenge:
      "Frontier AI coding models are expensive and free-tier models drift and rate-limit unpredictably - the goal was near-frontier output using only free APIs plus one cheap planner.",
    approach:
      "Every worker attempt passes a tamper-proof verification gate - frozen test hashes, clean-checkout re-runs, a diff-reject on any edit to the protected test surface - before a PR is ever opened, with an automated repair loop before escalating to a stronger model.",
    impact:
      "Phase 0 (foundation), Phase 1 (planning + adversarial critique) and Phase 2 (single-agent loop) are implemented and passing their exit criteria; Phase 3 (parallel orchestration) is in progress. Designed so quality comes from verification loops, not bigger models.",
  },
  {
    id: "lead-scoring-engine",
    title: "Lead Scoring Engine",
    tagline: "ICP Profiler - transparent, explainable lead scoring",
    description:
      "A six-stage transparent scoring pipeline (Data Quality → Education → Experience → Thinking Quality → Scorer → Profiler) that turns a messy prospect list into a ranked, explainable ICP score - with AI-assisted outreach email drafting and multi-model failover.",
    category: "data",
    tech: ["TypeScript", "Express", "Drizzle/SQLite", "Groq", "Gemini"],
    image: "/projects/lumen.svg",
    gallery: ["/projects/lumen.svg", "/projects/lumen-detail.svg"],
    url: "https://lead-scoring-engine-three.vercel.app",
    repo: "https://github.com/Vikrant038/lead-scoring-engine",
    year: "2026",
    accent: "#e8c98e",
    metrics: ["317 tests passing", "90% per-file coverage floor", "3× faster evaluation"],
    challenge:
      "A spreadsheet of 500 prospects isn't a pipeline - it's 500 unanswered questions about who's actually worth a call, answered inconsistently by whoever reads the list that morning.",
    approach:
      "A hybrid deterministic-semantic architecture: objective math for tenure/experience/recency, LLMs used only for entity classification and outreach generation, with automatic multi-model failover so scoring never goes down.",
    impact:
      "317 automated tests with a 90% per-file coverage floor (not just an average); multi-user web app with per-user storage isolation, deployed live on Vercel.",
  },
  {
    id: "ecommerce-analytics",
    title: "E-Commerce Sales Performance Analysis",
    tagline: "Raw sales data → an interactive decision-making dashboard",
    description:
      "A full Medallion (Bronze → Silver → Gold) data warehouse in T-SQL and Python, served through a 7-tab Streamlit dashboard with RFM segmentation, cohort retention, market-basket cross-sell analysis, and a conversational 'ask the data' AI assistant.",
    category: "data",
    tech: ["T-SQL", "Python", "Streamlit", "Plotly", "Docker"],
    image: "/projects/pulse.svg",
    gallery: ["/projects/pulse.svg", "/projects/pulse-detail.svg"],
    url: "https://e-commerce-sales-performance-analysis.streamlit.app/",
    repo: "https://github.com/Vikrant038/E-Commerce-Sales-Performance-Analysis",
    year: "2025",
    accent: "#7c6cff",
    metrics: ["€29.4M revenue analyzed", "72 CI-gated tests", "98.2% on-time fulfillment"],
    challenge:
      "~27,700 orders, 18,500 customers and 296 products lived in six raw source tables - useful, but unusable for answering where revenue actually comes from.",
    approach:
      "Built a complete Medallion ETL pipeline (T-SQL DDL/stored procedures plus a parallel Python implementation) feeding a 7-tab dashboard: executive KPIs, dynamic RFM scoring, cohort retention, logistics fulfillment, and market-basket cross-sell.",
    impact:
      "Found that 37% of repeat buyers generate 77% of revenue and that accessories carry 62.8% margin versus 39% on the flagship line - a clear cross-sell opportunity. 72 tests, CI-gated via GitHub Actions.",
  },
  {
    id: "socialsync",
    title: "SocialSync AI Agent",
    tagline: "YouTube transcript → publish-ready social posts",
    description:
      "An AI content-repurposing tool converting YouTube transcripts into platform-tailored, publish-ready posts for LinkedIn, Instagram, X and Facebook - engineered from first principles with strict platform isolation and JSON-mode generation.",
    category: "ai",
    tech: ["Python", "Streamlit", "Gemini API"],
    image: "/projects/orbit.svg",
    gallery: ["/projects/orbit.svg", "/projects/orbit-detail.svg"],
    url: "https://social-media-ai-agent-zv.streamlit.app/",
    repo: "https://github.com/Vikrant038/social-media-AI-agent",
    year: "2025",
    accent: "#ff5c7a",
    metrics: ["~90% less creation time", "4 platforms supported"],
    challenge:
      "Creators spend hours manually reformatting long-form video content for each platform's distinct algorithm, audience and character limits.",
    approach:
      "Dynamic per-platform prompt schemas, native JSON-mode generation with defensive post-filtering, and runtime model discovery with a fallback hierarchy so it never breaks when a model ID is deprecated.",
    impact:
      "~90% reduction in content-repurposing time, with an adaptive light/dark UI built to WCAG AA contrast standards.",
  },
  {
    id: "churn-predictor",
    title: "Customer Churn Predictor",
    tagline: "End-to-end ML pipeline for retention targeting",
    description:
      "An end-to-end scikit-learn pipeline (ColumnTransformer, SMOTE, GridSearchCV) predicting customer churn and surfacing the top 10% at-risk accounts for targeted retention outreach.",
    category: "ml",
    tech: ["Python", "scikit-learn", "XGBoost"],
    image: "/projects/mono.svg",
    gallery: ["/projects/mono.svg", "/projects/mono-detail.svg"],
    url: "#",
    repo: "#",
    year: "2025",
    accent: "#ffd166",
    metrics: ["80.5% accuracy", "Top-10% risk targeting"],
    challenge:
      "Predicting churn on a severely imbalanced dataset without hiding the real signal behind a misleading accuracy number.",
    approach:
      "A scikit-learn Pipeline with ColumnTransformer for consistent preprocessing, SMOTE to correct class imbalance, and GridSearchCV for hyperparameter tuning - with full precision/recall reporting instead of accuracy alone.",
    impact:
      "80.5% accuracy with the top 10% highest-risk customers surfaced for retention outreach. Caught and fixed a train/test leakage bug along the way.",
  },
];

export const localSkillGroups: SkillGroup[] = [
  {
    category: "Agentic Workflows & Multi-Agent Systems",
    tagline: "Stateful agents, cyclical graphs & autonomous swarms",
    icon: "code",
    accent: "neon",
    items: [
      {
        name: "LangGraph",
        tag: "Orchestration",
        blurb: "Stateful cyclical graphs, human-in-the-loop checkpoints, and branching decision logic",
      },
      {
        name: "LangChain & LCEL",
        tag: "Composition",
        blurb: "Declarative chain composition, document loaders, prompt schemas, and output parsers",
      },
      {
        name: "Multi-Agent Swarms",
        tag: "Autonomous",
        blurb: "Supervisor-worker hierarchies, contract-driven code execution, and parallel agent flows",
      },
      {
        name: "Tool Calling & Structured Output",
        tag: "Deterministic",
        blurb: "Function calling with strict Pydantic/Zod schemas, JSON mode, and dynamic retry gates",
      },
    ],
  },
  {
    category: "AI-Native Engineering & Dev Tools",
    tagline: "Modern agentic IDEs & accelerated workflows",
    icon: "terminal",
    accent: "neon2",
    items: [
      {
        name: "Claude Code",
        tag: "CLI Agent",
        blurb: "Terminal agent for deep codebase exploration, autonomous multi-file edits, and test-driven fixes",
      },
      {
        name: "Cursor (Composer & Agents)",
        tag: "Daily Driver",
        blurb: "Multi-file contextual generation, composer loop, semantic codebase indexing, and fast prototyping",
      },
      {
        name: "Windsurf & Agentic IDEs",
        tag: "Accelerated",
        blurb: "Cascade flows, deep repo context mapping, and prompt-driven rapid iteration",
      },
      {
        name: "Git Worktrees & CI Gates",
        tag: "Workflows",
        blurb: "Parallel agent branch development with tamper-proof automated testing gates",
      },
    ],
  },
  {
    category: "RAG & Retrieval Architecture",
    tagline: "Accurate, grounded, production-grade retrieval systems",
    icon: "server",
    accent: "gold",
    items: [
      {
        name: "Corrective RAG (CRAG)",
        tag: "Architecture",
        blurb: "Self-grading relevance gates, document transform fallbacks, and web search augmentation",
      },
      {
        name: "Hybrid Retrieval",
        tag: "Dense + Sparse",
        blurb: "Combining dense vector embeddings (BGE-M3, OpenAI) with sparse BM25 keyword matching",
      },
      {
        name: "pgvector & Supabase",
        tag: "Vector DB",
        blurb: "High-scale HNSW indexing, Cosine/L2 distance search, and metadata pre-filtering",
      },
      {
        name: "Cohere Rerank & Chunking",
        tag: "Relevance",
        blurb: "Semantic chunking, parent-document retrieval, and cross-encoder rerankers",
      },
    ],
  },
  {
    category: "Evaluation, Observability & Guardrails",
    tagline: "Rigorous quality gates, metrics & production safety",
    icon: "shield",
    accent: "neon",
    items: [
      {
        name: "RAG Triad (Ragas & TruLens)",
        tag: "Evaluation",
        blurb: "Automated scoring of Faithfulness, Answer Relevance, and Context Precision",
      },
      {
        name: "LangSmith",
        tag: "Observability",
        blurb: "Distributed LLM execution tracing, latency/token usage monitoring, and regression benchmarking",
      },
      {
        name: "Guardrails & Safety",
        tag: "Defense",
        blurb: "Prompt injection detection, PII masking, schema validation, and hallucination gating",
      },
      {
        name: "Golden Datasets & Benchmarks",
        tag: "Testing",
        blurb: "Ground-truth test suites for regression testing prompt changes and model upgrades",
      },
    ],
  },
  {
    category: "Production Backend & Systems",
    tagline: "Scalable data engineering & microservice infrastructure",
    icon: "wrench",
    accent: "neon2",
    items: [
      {
        name: "Python (FastAPI, Pydantic v2)",
        tag: "Backend",
        blurb: "High-throughput asynchronous APIs, strict data validation, and data pipelines",
      },
      {
        name: "TypeScript & Next.js 14/15",
        tag: "Fullstack",
        blurb: "Strict typing across client/server boundaries, Server Components, and streaming UI",
      },
      {
        name: "PostgreSQL & Supabase",
        tag: "Database",
        blurb: "Relational data modeling, Row Level Security (RLS), ACID transactions, and pgvector",
      },
      {
        name: "Docker & Linux",
        tag: "DevOps",
        blurb: "Containerized microservices, reproducible runtime environments, and CI/CD pipelines",
      },
    ],
  },
];

export const localExperience: ExperienceItem[] = [
  {
    id: "dt-lead",
    role: "Team Lead",
    company: "Deep Thought Analytics",
    period: "Mar 2026 - May 2026",
    description:
      "Promoted to lead a 6-person team across two labs (MarTech + ICP) - shifted from building things myself to making the whole team more effective.",
    highlights: [
      "Defined workflows, removed bottlenecks, and structured accountability across the team",
      "Moderated an LDI session for 27 participants; trained 3–4 teammates on AI tooling",
      "Drove a founder-outreach initiative - converted 5 founders to a roundtable in one month",
    ],
  },
  {
    id: "dt-ai",
    role: "AI Generalist Specialist",
    company: "Deep Thought Analytics",
    period: "Feb 2026 - May 2026",
    description:
      "Built the AI and automation systems the whole team ran on - research tools, feedback loops, and infrastructure migrations.",
    highlights: [
      "Built 6+ AI tools (Gemini, Vertex AI, Perplexity), saving the team ~8–10 hours/day",
      "Cut a 15–18 hour/week call-analysis task down to ~30 minutes with an AI feedback system",
      "Migrated profiling to Vertex AI, unlocking 27,000 unused free credits",
    ],
  },
  {
    id: "dt-ba",
    role: "Business Analyst Intern",
    company: "Deep Thought Analytics",
    period: "Nov 2025 - Jan 2026",
    description:
      "Owned the lead-data pipeline end to end - turning messy raw data into clean, usable leads for the calling team.",
    highlights: [
      "Scraped, cleaned and structured 20,000+ lead records into a reliable pipeline",
      "Built an ICP Profiler for lead scoring - ~3× faster lead evaluation",
      "Automated phone-number cleaning - lifted data quality by 30–40%",
    ],
  },
];

/**
 * No fabricated testimonials - an empty list keeps the section honest until
 * real recommendations (Deep Thought manager/teammates, LinkedIn) come in.
 * The section's own "share feedback" form and LinkedIn CTA still work with
 * zero items, so nothing needs to be removed from the page.
 */
export const localTestimonials: Testimonial[] = [];

/** "Now" card - live status pulled from Supabase when configured. */
export const localNow = {
  role: "IIT Madras BS (Data Science) · Diploma stage",
  focus: "Multi-agent orchestration & RAG systems",
  learning: "MLOps, PyTorch, DSA, German (A1 → B1)",
};

/* ------------------------------------------------------------------ */
/*  Data access - Supabase first, local fallback.                      */
/* ------------------------------------------------------------------ */

export async function getProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, title, tagline, description, category, tech, image, gallery, url, repo, year, accent, metrics, challenge, approach, impact"
        )
        .order("year", { ascending: false });
      if (!error && data && data.length > 0) return data as Project[];
    } catch {
      /* fall through */
    }
  }
  return localProjects;
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("category, icon, accent, items, sort")
        .order("sort", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          category: row.category,
          icon: row.icon,
          accent: row.accent,
          items: row.items,
        })) as SkillGroup[];
      }
    } catch {
      /* fall through */
    }
  }
  return localSkillGroups;
}

export async function getExperience(): Promise<ExperienceItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("id, role, company, period, description, highlights, current, sort")
        .order("sort", { ascending: true });
      if (!error && data && data.length > 0) return data as ExperienceItem[];
    } catch {
      /* fall through */
    }
  }
  return localExperience;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select(
          "id, name, role, company, quote, rating, avatar, project, linkedin, video, status, created_at"
        )
        .in("status", ["approved", "pending"])
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data as Testimonial[];
    } catch {
      /* fall through */
    }
  }
  return localTestimonials;
}

export async function getNow() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("now")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) {
        const row = data[0] as any;
        return {
          role: row.role ?? localNow.role,
          focus: row.focus ?? localNow.focus,
          learning: row.learning ?? localNow.learning,
        };
      }
    } catch {
      /* fall through */
    }
  }
  return localNow;
}
