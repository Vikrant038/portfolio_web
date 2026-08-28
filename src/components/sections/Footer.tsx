"use client";

import { ArrowUp, FileDown, ArrowRight } from "lucide-react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { usePathname, useRouter } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import NeumorphicButton from "@/components/ui/NeumorphicButton";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { SITE_CONFIG } from "@/lib/constants";

const LINKS = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Writing", id: "blogs" },
  { label: "Contact", id: "contact" },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollTo } = useSmoothScroll();

  const go = (id: string) => {
    if (pathname !== "/") {
      router.push(id === "top" ? "/" : `/#${id}`);
      return;
    }
    scrollTo(id === "top" ? "#top" : `#${id}`);
  };

  return (
    <>
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <AmbientGlow color="neon" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={500} opacity={0.05} />
        <div className="section-shell">
          <Reveal>
            <div className="glass-strong relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12">
              <span className="eyebrow mx-auto mb-4 inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_rgb(var(--neon)/0.9)]" />
                Available for New Roles & Contracts
              </span>
              <h2 className="font-serif text-3xl font-bold leading-tight text-paper sm:text-4xl md:text-5xl">
                Have a project or opportunity?{" "}
                <span className="text-gradient">Let&apos;s connect.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[14px] text-mist">
                Whether you need a RAG pipeline, workflow automation, or an AI engineer on your team.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <NeumorphicButton
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4 text-neon" />}
                  onClick={() => scrollTo("#contact")}
                >
                  Start a project
                </NeumorphicButton>
                <NeumorphicButton
                  variant="ghost"
                  size="lg"
                  icon={<FileDown className="h-4 w-4" />}
                  href={SITE_CONFIG.resumePath}
                  download={SITE_CONFIG.resumeFileName}
                >
                  Grab my resume
                </NeumorphicButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="relative border-t border-white/[0.06] py-10 overflow-hidden">
        <div className="section-shell flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[12px] tracking-wide text-mist">
            © {new Date().getFullYear()} Vikrant Yadav. Designed &amp; engineered
            with <span className="text-neon">craft</span>.
          </p>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="text-[12px] text-mist transition-colors hover:text-neon"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
