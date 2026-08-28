"use client";

import Reveal from "@/components/ui/Reveal";
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
        <Reveal delay={0} y={10}>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-neon">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_rgb(var(--neon)/0.9)]" />
            {eyebrow}
          </span>
        </Reveal>
      )}

      <Reveal delay={0.06} y={16}>
        <h2 className="relative font-serif text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl md:text-6xl">
          {title}{" "}
          {highlight && (
            <span className={cn("text-gradient", align === "center" && "block")}>
              {highlight}
            </span>
          )}
        </h2>
      </Reveal>

      <Reveal delay={0.12} y={0}>
        <div
          className={cn(
            "relative mt-6 h-px w-40 origin-left bg-gradient-to-r from-[var(--grad-a)] via-[var(--grad-c)] to-transparent",
            align === "center" && "mx-auto origin-center"
          )}
        />
      </Reveal>
    </div>
  );
}
