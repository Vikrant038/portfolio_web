"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns a smoothed 0..1 velocity value based on recent scroll deltas.
 * Used to drift the ambient glow orbs as the user scrolls.
 */
export function useScrollVelocity() {
  const [vel, setVel] = useState(0);
  const smooth = useRef(0);
  const running = useRef(false);

  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    let raf = 0;
    let idleTimer = 0;
    let isScrolling = false;

    const step = () => {
      const currentY = window.scrollY;
      const dy = currentY - lastY;
      lastY = currentY;

      const target = isScrolling ? Math.min(1, Math.abs(dy) / 60) : 0;
      smooth.current += (target - smooth.current) * 0.08;

      if (smooth.current < 0.001 && !isScrolling) {
        smooth.current = 0;
        setVel(0);
        running.current = false;
        return;
      }

      setVel(smooth.current);
      raf = requestAnimationFrame(step);
    };

    const onScroll = () => {
      isScrolling = true;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        isScrolling = false;
      }, 150);

      if (!running.current) {
        running.current = true;
        lastY = window.scrollY;
        raf = requestAnimationFrame(step);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return vel;
}
