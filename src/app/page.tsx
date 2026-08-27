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
    name: "Vikrant Yadav",
    jobTitle: "AI Systems Engineer",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vikrant-yadav.vercel.app",
    email: "mailto:yadavvikrant3006@gmail.com",
    address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
    knowsAbout: ["Python", "TypeScript", "RAG", "Large Language Models", "Data Engineering", "Machine Learning"],
    worksFor: { "@type": "Organization", name: "Deep Thought Analytics" },
    sameAs: [
      "https://github.com/Vikrant038",
      "https://linkedin.com/in/vikrant-yadav3012",
      "https://x.com/VikrantY_30",
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
