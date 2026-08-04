"use client";

import { motion } from "framer-motion";
import { useScrollVelocity } from "@/lib/use-scroll-velocity";

interface AmbientGlowProps {
  color?: "neon" | "neon2";
  className?: string;
  size?: number;
}

export default function AmbientGlow({
  color = "neon",
  className = "",
  size = 420,
}: AmbientGlowProps) {
  const vel = useScrollVelocity();

  return (
    <motion.div
      aria-hidden
      animate={{ x: vel * 40, y: vel * -26, scale: 1 + vel * 0.08 }}
      transition={{ type: "spring", stiffness: 60, damping: 20 }}
      className={`pointer-events-none absolute -z-10 rounded-full blur-[130px] ${className}`}
      style={{
        width: size,
        height: size,
        background: `rgb(var(--${color}) / 0.07)`,
      }}
    />
  );
}
