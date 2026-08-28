"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings2, Gauge, Volume2, VolumeX } from "lucide-react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useSettings } from "@/lib/settings";
import { SECTIONS, useScrollSpy } from "@/lib/use-scroll-spy";
import { playTick, playWhoosh } from "@/lib/sound";

export default function SiteChrome() {
  const { scrollTo } = useSmoothScroll();
  const { motion: motionPref, setMotion, sound, setSound } = useSettings();
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(SECTIONS);
  const prevSection = useRef(active);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // click outside to close settings
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  // whoosh when the active section changes (only if sound on)
  useEffect(() => {
    if (prevSection.current !== active && sound) playWhoosh();
    prevSection.current = active;
  }, [active, sound]);

  // global click tick
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!sound) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select")) playTick();
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [sound]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        target?.isContentEditable ||
        e.metaKey ||
        e.ctrlKey
      ) {
        return;
      }

      if (window.location.pathname === "/") {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          const i = SECTIONS.findIndex((id) => {
            const el = document.getElementById(id);
            return el ? el.getBoundingClientRect().top > 80 : false;
          });
          const next = i === -1 ? SECTIONS.length - 1 : Math.max(0, i);
          scrollTo(`#${SECTIONS[next]}`);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          const i = SECTIONS.findIndex((id) => {
            const el = document.getElementById(id);
            return el ? el.getBoundingClientRect().top > 80 : false;
          });
          const prev = i === -1 ? SECTIONS.length - 1 : Math.max(0, i - 1);
          scrollTo(`#${SECTIONS[prev]}`);
        }
      }

      if (e.key.toLowerCase() === "r" && !e.altKey) {
        const a = document.createElement("a");
        a.href = "/Vikrant_Resume_2026.docx";
        a.download = "Vikrant_Resume_2026.docx";
        a.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollTo]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        aria-label="Settings - motion and sound"
        className="neo fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-20 z-[70] grid h-12 w-12 place-items-center rounded-2xl bg-ink text-mist transition-colors hover:text-neon active:neo-inset sm:right-24"
      >
        <Gauge className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="glass-strong fixed bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4rem))] right-5 z-[70] w-72 rounded-2xl p-4 shadow-glass sm:right-8"
            role="dialog"
            aria-label="Settings"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-paper">
              <Settings2 className="h-4 w-4 text-neon" />
              Settings
            </div>

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
              Motion intensity
            </p>
            <div className="glass flex rounded-xl p-1">
              {(["full", "reduced"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMotion(m)}
                  className={
                    "flex-1 rounded-lg px-3 py-2 text-[12px] font-semibold capitalize transition-all " +
                    (motionPref === m
                      ? "bg-neon/15 text-neon"
                      : "text-mist hover:text-paper")
                  }
                >
                  {m}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-mist">
              Sound design
            </p>
            <button
              onClick={() => setSound(!sound)}
              aria-pressed={sound}
              className="glass flex w-full items-center justify-between rounded-xl px-4 py-3 transition-colors hover:border-neon/30"
            >
              <span className="flex items-center gap-2.5 text-[13px] font-medium text-paper">
                {sound ? (
                  <Volume2 className="h-4 w-4 text-neon" />
                ) : (
                  <VolumeX className="h-4 w-4 text-mist" />
                )}
                UI sounds
              </span>
              <span
                className={
                  "relative h-6 w-11 rounded-full transition-colors duration-300 " +
                  (sound ? "bg-neon/40" : "bg-white/10")
                }
              >
                <span
                  className={
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 " +
                    (sound ? "left-[22px]" : "left-0.5")
                  }
                />
              </span>
            </button>

            <p className="mt-3 text-[11px] leading-relaxed text-mist">
              Reduced motion disables the custom cursor, preloader morph and
              heavy parallax. Sound adds subtle clicks, section whooshes and a
              quiet ambient hum behind the 3D scene.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
