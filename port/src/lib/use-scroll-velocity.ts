"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns a smoothed 0..1 velocity value based on recent scroll deltas.
 * Used to drift the ambient glow orbs as the user scrolls.
 */
export function useScrollVelocity() {
  const [vel, setVel] = useState(0);
  const smooth = useRef(0);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;

    const loop = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      const target = Math.min(1, Math.abs(dy) / 60);
      smooth.current += (target - smooth.current) * 0.08;
      setVel(smooth.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return vel;
}
