import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import NeumorphicButton from "@/components/ui/NeumorphicButton";
import AmbientGlow from "@/components/ui/AmbientGlow";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 py-24 text-center">
      <AmbientGlow className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={450} opacity={0.08} />
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
          <NeumorphicButton
            href="/"
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Return to Portfolio
          </NeumorphicButton>
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
