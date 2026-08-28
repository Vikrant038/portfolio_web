"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string = string> {
  key: T;
  label: string;
  count?: number;
}

interface FilterTabsProps<T extends string = string> {
  tabs: Array<TabItem<T>>;
  active: T;
  onChange: (key: T) => void;
  layoutId?: string;
  className?: string;
}

export default function FilterTabs<T extends string = string>({
  tabs,
  active,
  onChange,
  layoutId = "filter-pill",
  className,
}: FilterTabsProps<T>) {
  return (
    <div
      className={cn(
        "flex w-full overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap items-center gap-1.5 sm:gap-2 overscroll-x-contain touch-pan-x",
        className
      )}
      style={{ WebkitOverflowScrolling: "touch" }}
      role="tablist"
      aria-label="Filter options"
    >
      {tabs.map((t) => {
        const on = active === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.key)}
            className={cn(
              "relative shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors duration-200 min-h-[44px] sm:min-h-0",
              on
                ? "text-paper"
                : "text-mist hover:text-paper hover:bg-white/[0.04]"
            )}
          >
            {on && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className="absolute inset-0 rounded-full bg-neon/[0.12] border border-neon/40 shadow-[0_0_20px_-4px_rgb(var(--neon)/0.5)]"
              />
            )}
            <span className="relative z-10">{t.label}</span>
            {typeof t.count === "number" && (
              <span
                className={cn(
                  "relative z-10 text-[10px] rounded-full px-1.5 py-0.5 font-mono",
                  on ? "bg-neon/20 text-neon" : "bg-white/5 text-mist"
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
