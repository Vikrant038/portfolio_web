"use client";

import type { ReactNode } from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

interface Props {
  children: ReactNode;
}

const sceneFallback = (
  <div className="relative h-full w-full overflow-hidden" aria-hidden>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgb(var(--neon)/0.12)_0%,transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgb(var(--neon2)/0.1)_0%,transparent_55%)]" />
    <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.06] blur-[80px]" />
  </div>
);

export default function SceneErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      name="3D Canvas"
      fallback={sceneFallback}
      onError={(err) => console.warn("[SceneErrorBoundary] 3D scene failed, showing fallback:", err.message)}
    >
      {children}
    </ErrorBoundary>
  );
}
