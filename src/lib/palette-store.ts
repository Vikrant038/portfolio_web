"use client";

import { useSyncExternalStore } from "react";
import type { Project } from "@/lib/supabase";

let projects: Project[] = [];
const listeners = new Set<() => void>();

export function setPaletteProjects(p: Project[]) {
  projects = p;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useProjectsStore<T>(selector: (p: Project[]) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(projects),
    () => selector(projects)
  );
}
