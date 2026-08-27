"use client";

import { useEffect, useState } from "react";

let ready = false;
const listeners = new Set<(v: boolean) => void>();

/** Called by the Preloader once it starts sliding away. */
export function markAppReady() {
  ready = true;
  listeners.forEach((l) => l(true));
}

/**
 * True once the preloader has resolved. Includes a safety timeout so the
 * site never stays hidden even if the preloader is removed.
 */
export function useAppReady() {
  const [r, setR] = useState(ready);

  useEffect(() => {
    listeners.add(setR);
    const t = window.setTimeout(() => setR(true), 2600);
    return () => {
      listeners.delete(setR);
      window.clearTimeout(t);
    };
  }, []);

  return r;
}
