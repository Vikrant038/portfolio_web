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
    <div ref={ref} className="group flex flex-col items-center text-center">
      <div className="relative h-20 w-20 sm:h-22 sm:w-22">
        <TickRing
          progress={progress}
          color={color}
          className="h-full w-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-sm font-bold text-paper transition-colors duration-300 group-hover:text-neon"
            style={{ textShadow: "0 0 12px rgb(var(--neon) / 0.35)" }}
          >
            {progress}%
          </span>
        </div>
      </div>
      <div className="mt-2.5 w-full">
        <span className="block text-[12px] font-bold uppercase tracking-wider text-paper transition-colors duration-300 group-hover:text-neon">
          {label}
        </span>
        {blurb && (
          <p className="mt-1 text-[11px] leading-snug text-mist transition-colors duration-200 group-hover:text-paper">
            {blurb}
          </p>
        )}
      </div>
    </div>
  );
}
