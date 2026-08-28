"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const doc = document.documentElement;
          const total = doc.scrollHeight - window.innerHeight;
          const p = total > 0 ? window.scrollY / total : 0;
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[var(--grad-a)] via-[var(--grad-b)] to-[var(--grad-c)] transition-transform duration-75 ease-out will-change-transform"
      style={{ transform: "scaleX(0)" }}
      aria-hidden
    />
  );
}
