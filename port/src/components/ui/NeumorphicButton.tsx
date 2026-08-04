"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeumorphicButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}

export default function NeumorphicButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  href,
  onClick,
  type = "button",
  className,
  ariaLabel,
}: NeumorphicButtonProps) {
  const base = cn(
    "group relative inline-flex select-none items-center justify-center gap-2.5 rounded-2xl font-medium tracking-wide transition-colors duration-300",
    size === "lg" ? "px-8 py-4 text-[15px]" : "px-6 py-3 text-sm",
    variant === "primary"
      ? "text-paper hover:text-neon"
      : "text-mist hover:text-paper"
  );

  const inner = (
    <>
      {variant === "primary" ? (
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 0%, rgb(var(--neon) / 0.18), transparent 55%)",
          }}
        />
      ) : null}
      <span className="relative z-10 flex items-center gap-2.5">
        {icon && <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>}
        {children}
      </span>
    </>
  );

  const classes = cn(
    "neo",
    "bg-ink active:neo-inset active:translate-y-[1px]",
    variant === "primary"
      ? "shadow-[6px_6px_14px_var(--sh-dark),-6px_-6px_14px_var(--sh-light),0_0_30px_-10px_rgb(var(--neon)/0.4)]"
      : "shadow-[6px_6px_14px_var(--sh-dark),-6px_-6px_14px_var(--sh-light)]",
    className
  );

  if (href) {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel}
        whileTap={{ scale: 0.97 }}
        className={cn(base, classes)}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.97 }}
      className={cn(base, classes)}
    >
      {inner}
    </motion.button>
  );
}
