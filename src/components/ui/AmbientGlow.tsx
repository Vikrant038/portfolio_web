"use client";

import { cn } from "@/lib/utils";

interface AmbientGlowProps {
  color?: "neon" | "neon2" | "gold";
  className?: string;
  size?: number | string;
  opacity?: number;
  blur?: number;
}

/**
 * Single canonical background ambient glow orb with GPU texture caching.
 * Provides soft background glow without mobile frame drops or layout shift.
 */
export default function AmbientGlow({
  color = "neon",
  className = "",
  size = 480,
  opacity = 0.05,
  blur = 140,
}: AmbientGlowProps) {
  const sizeStyle = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -z-10 rounded-full transform-gpu",
        className
      )}
      style={{
        width: sizeStyle,
        height: sizeStyle,
        background: `rgb(var(--${color}) / ${opacity})`,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}
