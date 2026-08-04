"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Neon glow color for the hover border (css color) */
  glow?: string;
  /** Lift + glow on hover */
  hover?: boolean;
  /** Rounded size */
  rounded?: "2xl" | "3xl";
}

export default function GlassCard({
  children,
  className,
  glow = "#22d3ee",
  hover = true,
  rounded = "3xl",
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? { y: -6, scale: 1.012, transition: { type: "spring", stiffness: 300, damping: 22 } }
          : undefined
      }
      className={cn(
        "group glass relative overflow-hidden shadow-glass",
        rounded === "3xl" ? "rounded-3xl" : "rounded-2xl",
        className
      )}
      style={{ ["--glow" as string]: glow }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
      }}
    >
      {/* hover glow that follows the cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--gx,50%) var(--gy,50%), color-mix(in srgb, var(--glow) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
