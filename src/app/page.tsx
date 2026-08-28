import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Blogs from "@/components/sections/Blogs";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import SectionErrorBoundary from "@/components/ui/SectionErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
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

/* ------------------------------------------------------------------ */
/*  Async Server Components — each fetches its own data so Suspense    */
/*  boundaries can stream independently instead of blocking on a       */
/*  single Promise.all.                                               */
/* ------------------------------------------------------------------ */

async function ProjectsSection() {
  const projects = await getProjects();
  return <Projects projects={projects} />;
}

async function SkillsSection() {
  const [groups, now] = await Promise.all([getSkillGroups(), getNow()]);
  return <Skills groups={groups} now={now} />;
}

async function ExperienceSection() {
  const experience = await getExperience();
  return <Experience items={experience} />;
}

async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  return <Testimonials items={testimonials} />;
}

/* ------------------------------------------------------------------ */

export default async function Home() {
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
      <SectionErrorBoundary name="Hero"><Hero /></SectionErrorBoundary>
      <SectionErrorBoundary name="About"><About /></SectionErrorBoundary>
      <Suspense fallback={<SectionSkeleton />}>
        <SectionErrorBoundary name="Projects"><ProjectsSection /></SectionErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <SectionErrorBoundary name="Skills"><SkillsSection /></SectionErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <SectionErrorBoundary name="Experience"><ExperienceSection /></SectionErrorBoundary>
      </Suspense>
      <SectionErrorBoundary name="Blogs"><Blogs /></SectionErrorBoundary>
      <Suspense fallback={<SectionSkeleton />}>
        <SectionErrorBoundary name="Testimonials"><TestimonialsSection /></SectionErrorBoundary>
      </Suspense>
      <SectionErrorBoundary name="Contact"><Contact /></SectionErrorBoundary>
    </main>
  );
}
