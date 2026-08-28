import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Blogs from "@/components/sections/Blogs";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import {
  getProjects,
  getSkillGroups,
  getExperience,
  getTestimonials,
  getNow,
} from "@/lib/data";
import { SITE_CONFIG } from "@/lib/constants";

// ISR - content updates propagate without full rebuilds
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
    name: SITE_CONFIG.name,
    jobTitle: SITE_CONFIG.title,
    url: SITE_CONFIG.url,
    email: `mailto:${SITE_CONFIG.email}`,
    address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
    knowsAbout: SITE_CONFIG.skills,
    worksFor: { "@type": "Organization", name: SITE_CONFIG.organization },
    sameAs: [
      SITE_CONFIG.socials.github,
      SITE_CONFIG.socials.linkedin,
      SITE_CONFIG.socials.twitter,
    ],
  };

  return (
    <main id="main" className="relative w-full max-w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <About />
      <Projects projects={projects} />
      <Skills groups={skills} now={now} />
      <Experience items={experience} />
      <Blogs />
      <Testimonials items={testimonials} />
      <Contact />
    </main>
  );
}
