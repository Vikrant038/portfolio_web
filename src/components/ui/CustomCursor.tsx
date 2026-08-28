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
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!fine || isTouch) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-on");

    const disableOnTouch = () => {
      setEnabled(false);
      document.documentElement.classList.remove("custom-cursor-on");
    };
    window.addEventListener("touchstart", disableOnTouch, { passive: true, once: true });

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
      {/* Concentric cursor container locked at exact mouse coordinates */}
      <motion.div
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        className="absolute top-0 left-0 flex items-center justify-center pointer-events-none"
      >
        {/* Outer glowing focus circle */}
        <motion.div
          animate={{
            width: hovering ? 44 : 28,
            height: hovering ? 44 : 28,
            opacity: hovering ? 0.9 : 0.65,
            scale: pressed ? 0.8 : 1,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
          className="absolute rounded-full border border-neon/80 bg-neon/[0.08]"
          style={{ boxShadow: "0 0 20px -2px rgb(var(--neon) / 0.7)" }}
        />
        {/* Red / tangerine center dot - precisely in the middle */}
        <motion.div
          animate={{ scale: pressed ? 0.6 : hovering ? 0.85 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="h-2 w-2 rounded-full bg-neon shadow-[0_0_12px_rgb(var(--neon)/1)]"
        />
      </motion.div>
    </div>
  );
}
