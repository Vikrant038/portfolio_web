"use client";

import { useMemo } from "react";

interface TickRingProps {
  /** 0–100 - controls how many ticks are filled */
  progress: number;
  /** css color for filled ticks */
  color: string;
  /** svg viewBox size (scales with container via className) */
  size?: number;
  ticks?: number;
  strokeWidth?: number;
  className?: string;
}

export default function TickRing({
  progress,
  color,
  size = 100,
  ticks = 40,
  strokeWidth = 3,
  className,
}: TickRingProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth * 3) / 2;
  const filled = Math.round(
    (Math.min(100, Math.max(0, progress)) / 100) * ticks
  );
  // darker theme: the filled portion is bright and glowing, the rest is
  // barely-there so how much is completed reads at a glance
  const dim = "rgb(var(--line) / 0.07)";

  const marks = useMemo(() => {
    const arr: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    for (let i = 0; i < ticks; i++) {
      const angle = (i / ticks) * Math.PI * 2 - Math.PI / 2;
      const x1 = cx + Math.cos(angle) * (r - strokeWidth);
      const y1 = cy + Math.sin(angle) * (r - strokeWidth);
      const x2 = cx + Math.cos(angle) * r;
      const y2 = cy + Math.sin(angle) * r;
      arr.push({ x1, y1, x2, y2 });
    }
    return arr;
  }, [cx, cy, r, strokeWidth, ticks]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden
    >
      {marks.map((m, i) => {
        const on = i < filled;
        return (
          <line
            key={i}
            x1={m.x1}
            y1={m.y1}
            x2={m.x2}
            y2={m.y2}
            stroke={on ? color : dim}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={
              on
                ? {
                    filter: `drop-shadow(0 0 4px ${color})`,
                    transition: "stroke 0.2s ease",
                  }
                : undefined
            }
          />
        );
      })}
    </svg>
  );
}
