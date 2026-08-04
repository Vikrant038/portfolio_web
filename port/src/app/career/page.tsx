import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/ui/PrintButton";
import { getExperience, getSkillGroups, getNow } from "@/lib/data";
import { formatYear } from "@/lib/utils";
import "./career.css";

export const metadata: Metadata = {
  title: "Career",
  description:
    "Ariadne Voss — full career history, skills and certifications. Print-friendly.",
};

export const revalidate = 3600;

export default async function CareerPage() {
  const [experience, skills, now] = await Promise.all([
    getExperience(),
    getSkillGroups(),
    getNow(),
  ]);

  return (
    <main className="career-page">
      <nav className="career-nav">
        <div className="career-nav-inner">
          <span className="career-brand">Ariadne Voss — CV</span>
          <PrintButton />
          <Link href="/#about" className="career-link">
            Back to site
          </Link>
        </div>
      </nav>

      <header className="career-header">
        <h1>Ariadne Voss</h1>
        <p className="career-role">Product Engineer · Creative Technologist</p>
        <p className="career-contact">
          hello@luxe.work · Berlin, Germany · Remote worldwide · luxe-portfolio
        </p>
        <p className="career-now">
          Now: {now.role} — learning {now.learning}
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
        <h2>Skills</h2>
        <div className="career-skills">
          {skills.map((g) => (
            <div key={g.category} className="career-skill-group">
              <h3>{g.category}</h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s.name}>
                    <span>{s.name}</span>
                    <em>{s.level}%</em>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="career-section">
        <h2>Education & Certifications</h2>
        <ul className="career-certs">
          <li>B.Sc. Computer Science — TU Berlin ({formatYear("2017")})</li>
          <li>AWS Solutions Architect</li>
          <li>Meta Frontend Professional</li>
          <li>Figma Advanced</li>
        </ul>
      </section>

      <footer className="career-footer">
        <p>Generated from the portfolio data layer — content edits flow here automatically.</p>
      </footer>
    </main>
  );
}
