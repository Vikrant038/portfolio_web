import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{ background: "rgb(var(--neon) / 0.08)" }}
      />
      <div className="glass-strong relative mx-auto max-w-lg rounded-3xl p-8 sm:p-12 shadow-glass">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-neon/10 text-neon shadow-[0_0_24px_-4px_rgb(var(--neon)/0.7)]">
          <Compass className="h-8 w-8 animate-pulse" />
        </span>

        <p className="mt-6 font-serif text-5xl font-bold tracking-tight text-paper sm:text-6xl">
          404
        </p>

        <h1 className="mt-3 font-serif text-2xl font-bold text-paper sm:text-3xl">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-mist">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="neo inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-paper transition-all hover:text-neon active:neo-inset"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </Link>
          <Link
            href="/career"
            className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-mist transition-colors hover:text-paper"
          >
            View Career / CV
          </Link>
        </div>
      </div>
    </main>
  );
}
