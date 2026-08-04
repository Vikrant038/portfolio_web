"use client";

import { ArrowUp, FileDown, ArrowRight } from "lucide-react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

const LINKS = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  return (
    <>
      {/* end card */}
      <section className="relative py-20">
        <div className="section-shell">
          <Reveal>
            <div className="glass-strong relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12">
              <div
                className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full blur-[90px]"
                style={{ background: "rgb(var(--neon) / 0.1)" }}
              />
              <div
                className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full blur-[90px]"
                style={{ background: "rgb(var(--neon2) / 0.1)" }}
              />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-neon">
                Let&apos;s talk
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight text-paper sm:text-5xl">
                Have a project in mind?{" "}
                <span className="text-gradient">Let&apos;s make it real.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[14px] text-mist">
                I&apos;m currently booking projects for early 2026. Tell me
                about your idea and I&apos;ll reply within 48 hours.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollTo("#contact")}
                  className="neo inline-flex items-center gap-2 rounded-2xl bg-ink px-7 py-4 text-[15px] font-semibold text-paper transition-colors hover:text-neon active:neo-inset"
                >
                  Start a project
                  <ArrowRight className="h-4 w-4 text-neon" />
                </motion.button>
                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = "/resume.pdf";
                    a.download = "Ariadne-Voss-Resume.pdf";
                    a.click();
                  }}
                  className="glass inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-[15px] font-semibold text-mist transition-colors hover:text-paper"
                >
                  <FileDown className="h-4 w-4" />
                  Grab my resume
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="relative border-t border-white/[0.06] py-10">
        <div className="section-shell flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[12px] tracking-wide text-mist">
            © {new Date().getFullYear()} Ariadne Voss. Designed &amp; engineered
            with <span className="text-neon">craft</span>.
          </p>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(`#${l.id}`)}
                className="text-[12px] text-mist transition-colors hover:text-neon"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollTo("#top")}
            aria-label="Back to top"
            className="neo grid h-11 w-11 place-items-center rounded-xl bg-ink text-mist transition-all duration-300 hover:-translate-y-1 hover:text-neon active:neo-inset"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </>
  );
}
