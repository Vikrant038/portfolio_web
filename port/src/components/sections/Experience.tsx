"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronRight, Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import CountUp from "@/components/ui/CountUp";
import type { ExperienceItem } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function Experience({ items }: { items: ExperienceItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // scrub: drag along the spine to select + expand the nearest role
  const scrub = (clientY: number) => {
    const el = wrapRef.current;
    if (!el || items.length === 0) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const idx = Math.min(items.length - 1, Math.floor(ratio * items.length));
    setOpenId(items[idx].id);
  };

  return (
    <section id="experience" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Career"
          title="A timeline of"
          highlight="compound growth."
          ghost="04"
        />

        {/* years counter */}
        <div className="mb-14 text-center">
          <p className="font-serif text-5xl font-bold text-gradient sm:text-6xl">
            <CountUp value={8} suffix="+" />
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-mist">
            Years shipping products
          </p>
        </div>

        <div
          ref={wrapRef}
          className="relative mx-auto max-w-4xl"
          onPointerDown={(e) => scrub(e.clientY)}
          onPointerMove={(e) => e.buttons === 1 && scrub(e.clientY)}
        >
          {/* gradient spine — draggable to scrub through the career */}
          <div
            className="absolute left-5 top-0 bottom-0 w-10 cursor-pointer -translate-x-1/2 md:left-1/2"
            aria-hidden
            title="Drag to scrub"
          >
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full origin-top bg-gradient-to-b from-[var(--grad-a)] via-[var(--grad-c)] to-gold"
                style={{ boxShadow: "0 0 18px rgb(var(--neon) / 0.5)" }}
              />
            </div>
          </div>

          <div className="space-y-10 md:space-y-0">
            {items.map((item, i) => {
              const left = i % 2 === 0;
              const open = openId === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "relative pl-14 md:w-1/2 md:py-6",
                    left ? "md:pr-14 md:pl-0 md:text-right" : "md:ml-auto md:pl-14"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-5 top-2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border border-neon bg-void md:top-6",
                      left
                        ? "md:left-auto md:right-0 md:translate-x-1/2"
                        : "md:left-0 md:-translate-x-1/2"
                    )}
                    style={{ boxShadow: "0 0 16px rgb(var(--neon) / 0.8)" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                  </span>

                  <GlassCard hover={false} rounded="2xl" className="p-6 sm:p-7">
                    <button
                      onClick={() => setOpenId(open ? null : item.id)}
                      className="w-full text-left"
                      aria-expanded={open}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gold",
                          left && "md:justify-end"
                        )}
                      >
                        <Briefcase className="h-3.5 w-3.5" />
                        {item.period}
                      </div>
                      <h3 className="mt-2 font-serif text-xl font-bold text-paper sm:text-2xl">
                        {item.role}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-neon">
                        {item.company}
                      </p>
                      <p className="mt-3 text-[13.5px] leading-relaxed text-mist">
                        {item.description}
                      </p>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className={cn("pt-3", left && "md:flex md:flex-col md:items-end")}>
                            {item.highlights.map((h) => (
                              <li
                                key={h}
                                className="mt-2 flex items-center gap-1.5 text-[12.5px] text-mist/90"
                              >
                                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-neon" />
                                <span className={left ? "md:text-right" : ""}>{h}</span>
                              </li>
                            ))}
                          </div>
                        </motion.ul>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={() => setOpenId(open ? null : item.id)}
                      className={cn(
                        "mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist transition-colors hover:text-neon",
                        left && "md:flex-row-reverse md:gap-1.5 md:text-left"
                      )}
                    >
                      <Plus
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-300",
                          open && "rotate-45"
                        )}
                      />
                      {open ? "Hide details" : "Show details"}
                    </button>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
