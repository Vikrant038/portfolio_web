export const SITE_CONFIG = {
  name: "Vikrant Yadav",
  title: "AI Systems Engineer",
  tagline: "AI Automation, RAG Pipelines & Data Systems",
  description:
    "AI automation, RAG pipelines, and data systems that turn manual workflows into measurable outcomes.",
  email: "yadavvikrant3006@gmail.com",
  location: "New Delhi, India · Remote Worldwide",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vikrant-yadav.vercel.app",
  resumePath: "/Vikrant_Resume_2026.pdf",
  resumeFileName: "Vikrant_Resume_2026.pdf",
  socials: {
    github: "https://github.com/Vikrant038",
    linkedin: "https://linkedin.com/in/vikrant-yadav3012",
    twitter: "https://x.com/VikrantY_30",
  },
  skills: [
    "LangGraph & LangChain",
    "Multi-Agent Orchestration",
    "Claude Code & Cursor",
    "RAG & Corrective RAG (CRAG)",
    "LLM Evaluation & LangSmith",
    "Python & FastAPI",
    "TypeScript & Next.js",
    "pgvector & PostgreSQL",
  ],
  organization: "Deep Thought Analytics",
} as const;
