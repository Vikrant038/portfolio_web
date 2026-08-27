"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, FileDown, Mail, Github, Sun, Moon } from "lucide-react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useSettings } from "@/lib/settings";
import { useProjectsStore } from "@/lib/palette-store";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  run: () => void;
}

export default function CommandPalette() {
  const { scrollTo } = useSmoothScroll();
  const { theme, toggleTheme } = useSettings();
  const projects = useProjectsStore((p) => p);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const base: Item[] = [
      { id: "sec-about", label: "About", hint: "Section", run: () => scrollTo("#about") },
      { id: "sec-projects", label: "Projects", hint: "Section", run: () => scrollTo("#projects") },
      { id: "sec-skills", label: "Skills", hint: "Section", run: () => scrollTo("#skills") },
      { id: "sec-experience", label: "Experience", hint: "Section", run: () => scrollTo("#experience") },
      { id: "sec-contact", label: "Contact", hint: "Section", run: () => scrollTo("#contact") },
      ...projects.map((p) => ({
        id: `proj-${p.id}`,
        label: p.title,
        hint: "Project",
        run: () => scrollTo("#projects"),
      })),
      {
        id: "act-resume",
        label: "Download resume",
        hint: "Action",
        icon: <FileDown className="h-4 w-4" />,
        run: () => {
          const a = document.createElement("a");
          a.href = "/resume.pdf";
          a.download = "Vikrant-Yadav-Resume.pdf";
          a.click();
        },
      },
      {
        id: "act-mail",
        label: "Copy email address",
        hint: "Action",
        icon: <Mail className="h-4 w-4" />,
        run: () => navigator.clipboard?.writeText("yadavvikrant3006@gmail.com"),
      },
      {
        id: "act-github",
        label: "Open GitHub",
        hint: "Action",
        icon: <Github className="h-4 w-4" />,
        run: () => window.open("https://github.com", "_blank"),
      },
      {
        id: "act-theme",
        label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        hint: "Action",
        icon: theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
        run: toggleTheme,
      },
    ];
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (i) => i.label.toLowerCase().includes(q) || (i.hint ?? "").toLowerCase().includes(q)
    );
  }, [query, projects, theme, toggleTheme, scrollTo]);

  useEffect(() => setIndex(0), [query]);
  useEffect(() => setIndex((i) => Math.min(i, Math.max(0, items.length - 1))), [items.length]);

  const run = (item: Item) => {
    setOpen(false);
    item.run();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[95] flex items-start justify-center bg-void/70 p-4 pt-[14vh] backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            ref={dialogRef}
            className="glass-strong w-full max-w-lg overflow-hidden rounded-3xl shadow-glass"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search className="h-4 w-4 text-mist" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIndex((i) => Math.min(i + 1, items.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter" && items[index]) {
                    run(items[index]);
                  }
                }}
                placeholder="Jump to a section, project or action…"
                className="w-full bg-transparent text-sm text-paper outline-none placeholder:text-mist/60"
              />
              <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-mist">
                ESC
              </kbd>
            </div>

            <ul className="max-h-[46vh] overflow-y-auto p-2">
              {items.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-mist">
                  No results for “{query}”
                </li>
              )}
              {items.map((item, i) => (
                <li key={item.id}>
                  <button
                    onClick={() => run(item)}
                    onMouseEnter={() => setIndex(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm transition-colors",
                      i === index ? "text-paper" : "text-mist"
                    )}
                    style={
                      i === index
                        ? { background: "rgb(var(--neon) / 0.12)" }
                        : undefined
                    }
                  >
                    {item.icon ?? <Search className="h-4 w-4 opacity-60" />}
                    <span className="flex-1">{item.label}</span>
                    {item.hint && (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-mist/70">
                        {item.hint}
                      </span>
                    )}
                    {i === index && (
                      <CornerDownLeft className="h-3.5 w-3.5 text-neon" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
