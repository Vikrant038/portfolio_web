"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import NeumorphicButton from "@/components/ui/NeumorphicButton";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Route Error Boundary caught unhandled error]:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="glass-strong mx-auto max-w-lg rounded-3xl p-8 text-center shadow-glass sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/10 text-rose-400">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h2 className="mt-6 font-serif text-2xl font-bold text-paper sm:text-3xl">
          Something went wrong
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-mist">
          An unexpected runtime error occurred while loading this page.
        </p>

        {error.message && (
          <div className="mt-4 rounded-xl border border-white/10 bg-void/50 p-3 text-left">
            <p className="font-mono text-xs text-rose-300/90 break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NeumorphicButton
            onClick={() => reset()}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Try again
          </NeumorphicButton>

          <Link
            href="/"
            className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-mist transition-colors hover:text-paper"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
