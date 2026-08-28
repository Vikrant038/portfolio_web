"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "year" | "tech" | "title";
type ViewMode = "grid" | "list";

interface ProjectToolbarProps {
  query: string;
  onQueryChange: (q: string) => void;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}

export default function ProjectToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: ProjectToolbarProps) {
  return (
    <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
      <div className="glass flex w-full max-w-xs items-center gap-2 rounded-2xl px-4 py-2.5">
        <Search className="h-4 w-4 text-mist" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search projects or tech…"
          aria-label="Search projects"
          className="w-full bg-transparent text-sm text-paper outline-none placeholder:text-mist/60"
        />
      </div>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        aria-label="Sort projects"
        className="glass rounded-2xl px-4 py-2.5 text-sm text-mist outline-none"
      >
        <option value="year">Newest first</option>
        <option value="tech">Most tech</option>
        <option value="title">A → Z</option>
      </select>
      <div className="glass flex gap-1 rounded-2xl p-1.5">
        {([
          { key: "grid" as const, icon: LayoutGrid, label: "Grid view" },
          { key: "list" as const, icon: List, label: "List view" },
        ]).map((v) => (
          <button
            key={v.key}
            onClick={() => onViewChange(v.key)}
            aria-label={v.label}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl transition-colors",
              view === v.key ? "bg-neon/15 text-neon" : "text-mist hover:text-paper",
            )}
          >
            <v.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
