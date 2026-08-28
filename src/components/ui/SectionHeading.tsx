"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  align?: "left" | "center";
  className?: string;
  /** Large faded serif number behind the heading, e.g. "01" */
  ghost?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  align = "center",
  className,
  ghost,
}: SectionHeadingProps) {
  const { reducedMotion } = useSettings();

  return (
    <div
      className={cn(
        "relative mb-14 sm:mb-20",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {ghost && (
        <span
          aria-hidden
          className="ghost-num -top-8 left-1/2 -translate-x-1/2 sm:-top-14"
        >
          {ghost}
        </span>
      )}

      {eyebrow && (
        <motion.span
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.4 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-neon"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_rgb(var(--neon)/0.9)]" />
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative font-serif text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl md:text-6xl"
      >
        {title}{" "}
        {highlight && (
          <span className={cn("text-gradient", align === "center" && "block")}>
            {highlight}
          </span>
        )}
      </motion.h2>

      <motion.div
        initial={reducedMotion ? false : { scaleX: 0 }}
        animate={reducedMotion ? { scaleX: 1 } : undefined}
        whileInView={reducedMotion ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative mt-6 h-px w-40 origin-left bg-gradient-to-r from-[var(--grad-a)] via-[var(--grad-c)] to-transparent",
          align === "center" && "mx-auto origin-center"
        )}
      />
    </div>
  );
}
