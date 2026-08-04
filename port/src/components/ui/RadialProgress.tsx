"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import TickRing from "@/components/ui/TickRing";

interface RadialProgressProps {
  label: string;
  value: number; // 0-100
  color: string; // css color
  blurb?: string;
}

export default function RadialProgress({
  label,
  value,
  color,
  blurb,
}: RadialProgressProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="group relative flex flex-col items-center gap-2">
      {/* tooltip */}
      {blurb && (
        <div className="pointer-events-none absolute -top-2 left-1/2 z-20 w-44 -translate-x-1/2 -translate-y-full scale-90 rounded-xl border border-white/10 bg-ink/95 px-3 py-2 text-center text-[11px] leading-snug text-mist opacity-0 shadow-glass backdrop-blur-xl transition-all duration-200 group-hover:-translate-y-[calc(100%+8px)] group-hover:opacity-100">
          {blurb}
          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-ink/95" />
        </div>
      )}

      <div className="relative h-20 w-20 sm:h-24 sm:w-24">
        <TickRing
          progress={progress}
          color={color}
          className="h-full w-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-sm font-semibold text-paper transition-colors duration-300 group-hover:text-neon"
            style={{ textShadow: "0 0 12px rgb(var(--neon) / 0.35)" }}
          >
            {progress}%
          </span>
        </div>
      </div>
      <span className="text-center text-[11px] font-medium uppercase tracking-widest text-mist transition-colors duration-300 group-hover:text-paper">
        {label}
      </span>
    </div>
  );
}
