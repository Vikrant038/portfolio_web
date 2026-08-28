import type { Metadata } from "next";
import Link from "next/link";
import { FileDown } from "lucide-react";
import { getExperience, getSkillGroups, getNow, getProjects } from "@/lib/data";
import { formatYear } from "@/lib/utils";
import "./career.css";

import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Career & CV",
  description:
    `${SITE_CONFIG.name} - Curriculum Vitae, experience, technical skills, and projects.`,
};

export const revalidate = 3600;

export default async function CareerPage() {
  const [experience, skills, now, projects] = await Promise.all([
    getExperience(),
    getSkillGroups(),
    getNow(),
    getProjects(),
  ]);

  return (
    <main className="career-page">
      <div className="career-toolbar">
        <Link href="/#about" className="career-back-btn">
          ← Back to Portfolio
        </Link>
        <a
          href={SITE_CONFIG.resumePath}
          download={SITE_CONFIG.resumeFileName}
          className="career-download-btn inline-flex items-center gap-2 rounded-xl border border-white/15 bg-ink px-4 py-2 text-xs font-semibold text-paper shadow-sm transition-all hover:border-neon/50 hover:text-neon"
        >
          <FileDown className="h-3.5 w-3.5 text-neon" />
          <span>Download CV (.docx)</span>
        </a>
      </div>

      <header className="career-header">
        <h1>{SITE_CONFIG.name}</h1>
        <p className="career-role">{SITE_CONFIG.title} · {SITE_CONFIG.tagline}</p>
        <p className="career-contact">
          <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-neon transition-colors">
            {SITE_CONFIG.email}
          </a>
          {" "}· {SITE_CONFIG.location} ·{" "}
          <a
            href={SITE_CONFIG.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neon transition-colors"
          >
            LinkedIn
          </a>
          {" "}·{" "}
          <a
            href={SITE_CONFIG.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neon transition-colors"
          >
            GitHub
          </a>
        </p>
        <p className="career-now">
          Current Focus: {now.role} - {now.focus} (Learning: {now.learning})
        </p>
      </header>

      <section className="career-section">
        <h2>Experience</h2>
        {experience.map((e) => (
          <article key={e.id} className="career-item">
            <div className="career-item-head">
              <h3>{e.role}</h3>
              <span className="career-period">{e.period}</span>
            </div>
            <p className="career-company">{e.company}</p>
            <p className="career-desc">{e.description}</p>
            <ul className="career-highlights">
              {e.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="career-section">
        <h2>Flagship Projects</h2>
        <div className="career-projects">
          {projects.slice(0, 4).map((p) => (
            <article key={p.id} className="career-item">
              <div className="career-item-head">
                <h3>{p.title}</h3>
                <span className="career-period">{p.year}</span>
              </div>
              <p className="career-company">{p.tagline}</p>
              <p className="career-desc">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.tech.map((t) => (
                  <span key={t} className="career-tag">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="career-section">
        <h2>Skills</h2>
        <div className="career-skills">
          {skills.map((g) => (
            <div key={g.category} className="career-skill-group">
              <h3>{g.category}</h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s.name}>
                    <span>{s.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="career-section">
        <h2>Education &amp; Certifications</h2>
        <ul className="career-certs">
          <li>
            <strong>BS in Data Science &amp; Applications</strong> - Indian Institute of Technology Madras ({formatYear("2025")}–2028 · CGPA: 8.67)
          </li>
          <li>
            <strong>Senior Secondary (Class XII &amp; X)</strong> - Kendriya Vidyalaya (92%)
          </li>
          <li>Oracle Generative AI Professional Certificate</li>
          <li>Oracle Data Science Certificate</li>
          <li>Oracle AI Foundations Associate</li>
          <li>McKinsey Forward Program</li>
        </ul>
      </section>
    </main>
  );
}
