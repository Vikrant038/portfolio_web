"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab focus inside `ref` while active and restores it on cleanup.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement>,
  active: boolean
) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handle = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // move focus into the dialog
    const firstNode = container.querySelector<HTMLElement>(FOCUSABLE);
    if (firstNode && !container.contains(document.activeElement)) {
      firstNode.focus();
    }

    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
      previouslyFocused?.focus();
    };
  }, [ref, active]);
}
