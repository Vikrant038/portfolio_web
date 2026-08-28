"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useSettings } from "@/lib/settings";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

export default function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  once = true,
}: RevealProps) {
  const { reducedMotion } = useSettings();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y }}
      animate={reducedMotion ? { opacity: 1, y: 0, filter: "none" } : undefined}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
