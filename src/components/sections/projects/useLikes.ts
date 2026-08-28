"use client";

import { useCallback, useEffect, useState } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";

const LIKES_KEY = "luxe-likes";

/** Persists project likes to localStorage. */
export function useLikes() {
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLikes(getStorageItem<Record<string, boolean>>(LIKES_KEY, {}));
  }, []);

  const toggleLike = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setLikes((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        setStorageItem(LIKES_KEY, next);
        return next;
      });
    },
    [],
  );

  return { likes, toggleLike } as const;
}
