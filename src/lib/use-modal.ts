"use client";

import { useEffect, useRef } from "react";
import { useFocusTrap } from "./use-focus-trap";

interface UseModalOptions {
  isOpen: boolean;
  onClose?: () => void;
  lockScroll?: boolean;
}

export function useModal<T extends HTMLElement = HTMLDivElement>({
  isOpen,
  onClose,
  lockScroll = true,
}: UseModalOptions) {
  const modalRef = useRef<T>(null);

  // Focus trap
  useFocusTrap(modalRef, isOpen);

  // Escape key & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    let prevOverflow = "";
    if (lockScroll && typeof document !== "undefined") {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      if (lockScroll && typeof document !== "undefined") {
        document.body.style.overflow = prevOverflow;
      }
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, lockScroll]);

  return modalRef;
}
