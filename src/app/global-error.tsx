"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Root Error caught]:", error);
  }, [error]);

  return (
    <html lang="en" className="bg-[#090B13]">
      <body className="flex min-h-screen items-center justify-center bg-[#090B13] p-4 text-[#F2F4FC]">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#151928]/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/10 text-rose-400">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h2 className="mt-6 font-serif text-2xl font-bold text-white">
            Application Error
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#A4ACC8]">
            An unhandled runtime error occurred. Please refresh or try again.
          </p>

          <button
            onClick={() => reset()}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0F121E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:text-[#FF8F40] shadow-md border border-white/10"
          >
            <RefreshCw className="h-4 w-4" />
            Reload application
          </button>
        </div>
      </body>
    </html>
  );
}
