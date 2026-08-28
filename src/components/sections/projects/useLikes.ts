"use client";

import { useCallback, useEffect, useState } from "react";

const LIKES_KEY = "luxe-likes";

function readLikes(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LIKES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Persists project likes to localStorage. */
export function useLikes() {
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  useEffect(() => setLikes(readLikes()), []);

  const toggleLike = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setLikes((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        try {
          window.localStorage.setItem(LIKES_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  return { likes, toggleLike } as const;
}
