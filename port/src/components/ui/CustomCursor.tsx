"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 35, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 500, damping: 35, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-on");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, [role='button'], input, textarea, select, [data-hover]"
      );
      setHovering(Boolean(interactive));
    };

    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      document.documentElement.classList.remove("custom-cursor-on");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden>
      {/* trailing glow ring */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute top-0 left-0"
      >
        <motion.div
          animate={{
            width: hovering ? 64 : 34,
            height: hovering ? 64 : 34,
            opacity: hovering ? 0.9 : 0.55,
            scale: pressed ? 0.8 : 1,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-neon/70 bg-neon/[0.07]"
          style={{ boxShadow: "0 0 24px -4px rgb(var(--neon) / 0.7)" }}
        />
      </motion.div>
      {/* center dot */}
      <motion.div style={{ x, y }} className="absolute top-0 left-0">
        <motion.div
          animate={{ scale: pressed ? 0.5 : hovering ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_12px_rgb(var(--neon)/1)]"
        />
      </motion.div>
    </div>
  );
}
