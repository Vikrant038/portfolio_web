"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModal } from "@/lib/use-modal";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
}

const MAX_WIDTHS = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

/**
 * Single canonical Modal primitive for all modals in the application.
 * Centralizes body scroll lock, focus trap, backdrop transition,
 * 120Hz native touch scrolling, and responsive full-screen mobile reader.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  ariaLabel,
  children,
  maxWidth = "2xl",
  className,
  contentClassName,
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useModal<HTMLDivElement>({
    isOpen,
    onClose,
    lockScroll: true,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className={cn(
            "fixed inset-0 z-[90] flex items-center justify-center bg-void/85 p-0 sm:p-4 backdrop-blur-xl overflow-hidden",
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel || title || "Dialog"}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "glass-strong relative flex flex-col h-full max-h-[100dvh] sm:h-auto sm:max-h-[88vh] w-full overflow-hidden rounded-none sm:rounded-3xl shadow-glass pb-safe",
              MAX_WIDTHS[maxWidth]
            )}
          >
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 z-50 grid h-10 w-10 min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px] place-items-center rounded-full border border-white/20 bg-void/85 text-paper backdrop-blur-2xl transition-all hover:border-neon/60 hover:text-neon active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <div
              data-lenis-prevent="true"
              className={cn(
                "flex-1 overflow-y-auto overscroll-contain touch-pan-y",
                contentClassName
              )}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
