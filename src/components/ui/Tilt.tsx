"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useSettings } from "@/lib/settings";
import type { ReactNode } from "react";

interface TiltProps {
  children: ReactNode;
  max?: number;
  className?: string;
  scale?: number;
}

export default function Tilt({
  children,
  max = 8,
  className,
  scale = 1.015,
}: TiltProps) {
  const { reducedMotion } = useSettings();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sX = useSpring(rotateX, { stiffness: 220, damping: 18 });
  const sY = useSpring(rotateY, { stiffness: 220, damping: 18 });

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * max);
    rotateX.set(-py * max);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale }}
      style={{ rotateX: sX, rotateY: sY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
