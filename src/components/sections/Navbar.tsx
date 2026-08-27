"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Sun, Moon } from "lucide-react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useSettings } from "@/lib/settings";
import { SECTIONS, useScrollSpy } from "@/lib/use-scroll-spy";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Writing", id: "blogs" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const { scrollTo } = useSmoothScroll();
  const { theme, toggleTheme } = useSettings();
  const active = useScrollSpy(SECTIONS);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // mobile menu: scroll lock + Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollTo(`#${id}`));
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass border-b backdrop-blur-2xl"
          : "bg-transparent"
      )}
    >
      <nav className="section-shell flex h-16 items-center justify-between sm:h-[72px]">
        <button
          onClick={() => go("top")}
          className="group flex items-center gap-2.5"
          aria-label="Back to top"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-neon/40 bg-neon/[0.06] font-serif text-lg font-bold text-neon shadow-[0_0_24px_-6px_rgb(var(--neon)/0.8)] transition-transform duration-300 group-hover:rotate-6">
            V
          </span>
          <span className="hidden text-sm font-semibold tracking-[0.22em] text-paper sm:block">
            VIKRANT <span className="font-bold text-neon">YADAV</span>
          </span>
        </button>

        {/* desktop links */}
        <div className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1.5 backdrop-blur-xl md:flex">
          {LINKS.map((l) => {
            const on = active === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                  on ? "text-paper" : "text-mist hover:text-paper"
                )}
              >
                {on && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-neon/[0.12]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="neo grid h-10 w-10 place-items-center rounded-xl bg-ink text-mist transition-all duration-300 hover:rotate-12 hover:text-neon active:neo-inset"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => go("contact")}
            className="neo hidden items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-all duration-300 hover:text-neon active:neo-inset md:inline-flex"
          >
            <Sparkles className="h-4 w-4 text-neon" />
            Hire Me
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="neo grid h-10 w-10 place-items-center rounded-xl bg-ink text-paper md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-white/[0.06] bg-void/90 backdrop-blur-2xl md:hidden"
          >
            <div className="section-shell flex flex-col gap-1 py-4">
              {LINKS.map((l, i) => {
                const on = active === l.id;
                return (
                  <motion.button
                    key={l.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => go(l.id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                      on
                        ? "bg-neon/[0.08] text-neon"
                        : "text-mist hover:bg-white/[0.05] hover:text-paper"
                    )}
                  >
                    {l.label}
                    {on && (
                      <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_rgb(var(--neon)/0.9)]" />
                    )}
                  </motion.button>
                );
              })}
              <button
                onClick={() => go("contact")}
                className="mt-2 rounded-xl bg-neon/10 px-4 py-3 text-left text-sm font-semibold text-neon"
              >
                ✦ Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
