import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import {
  getProjects,
  getSkillGroups,
  getExperience,
  getTestimonials,
  getNow,
} from "@/lib/data";

// ISR — content updates propagate without full rebuilds
export const revalidate = 3600;

export default async function Home() {
  const [projects, skills, experience, testimonials, now] = await Promise.all([
    getProjects(),
    getSkillGroups(),
    getExperience(),
    getTestimonials(),
    getNow(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ariadne Voss",
    jobTitle: "Product Engineer & Creative Technologist",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://luxe-portfolio.vercel.app",
    email: "mailto:hello@luxe.work",
    address: { "@type": "PostalAddress", addressLocality: "Berlin", addressCountry: "DE" },
    knowsAbout: ["React", "TypeScript", "Three.js", "WebGL", "Design Systems", "Product Engineering"],
    worksFor: { "@type": "Organization", name: "Northstar Studio" },
    sameAs: ["https://github.com", "https://linkedin.com", "https://x.com"],
  };

  return (
    <main id="main" className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <About />
      <Projects projects={projects} />
      <Skills groups={skills} now={now} />
      <Experience items={experience} />
      <Testimonials items={testimonials} />
      <Contact />
    </main>
  );
}
