"use client";

import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { useScrollSpy, SECTIONS } from "@/lib/use-scroll-spy";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  top: "Hero",
  about: "About",
  projects: "Projects",
  skills: "Skills",
  experience: "Experience",
  blogs: "Writing",
  contact: "Contact",
};

export default function SectionStepper() {
  const pathname = usePathname();
  const active = useScrollSpy(SECTIONS);
  const { scrollTo } = useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  if (pathname !== "/") return null;

  return (
    <div className="fixed right-5 top-1/2 z-[60] hidden -translate-y-1/2 xl:block" aria-hidden>
      <div className="flex flex-col items-center gap-4">
        {SECTIONS.map((id) => {
          const on = active === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(`#${id}`)}
              aria-label={LABELS[id]}
              className="group relative flex items-center justify-end"
            >
              <span
                className={cn(
                  "mr-3 text-[10px] font-semibold uppercase tracking-[0.25em] opacity-0 transition-all duration-300",
                  on ? "text-neon opacity-100" : "group-hover:text-mist group-hover:opacity-100"
                )}
              >
                {LABELS[id]}
              </span>
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  on
                    ? "bg-neon shadow-[0_0_12px_rgb(var(--neon)/0.9)]"
                    : "bg-mist/30 group-hover:bg-mist/70"
                )}
              />
            </button>
          );
        })}
        <span className="mt-1 h-16 w-px overflow-hidden bg-mist/20">
          <motion.span
            style={{ scaleY }}
            className="block h-full w-full origin-top bg-gradient-to-b from-[var(--grad-a)] to-[var(--grad-c)]"
          />
        </span>
      </div>
    </div>
  );
}
