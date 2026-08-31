"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  Share2,
  Send,
  Loader2,
  Play,
  X,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CountUp from "@/components/ui/CountUp";
import AmbientGlow from "@/components/ui/AmbientGlow";
import GlassCard from "@/components/ui/GlassCard";
import type { Testimonial } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";

const CARD_W = 336;
const GAP = 24;

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fb, setFb] = useState({ name: "", quote: "" });
  const [sending, setSending] = useState(false);
  const [video, setVideo] = useState<string | null>(null);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setMaxScroll(Math.max(0, track.scrollWidth - track.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items, measure]);

  const pages = Math.max(1, items.length);

  const goTo = useCallback(
    (p: number) => {
      const clamped = Math.min(Math.max(p, 0), maxScroll > 0 ? pages - 1 : 0);
      setPage(clamped);
      animate(x, -clamped * (CARD_W + GAP), {
        type: "spring",
        stiffness: 260,
        damping: 28,
      });
    },
    [x, maxScroll, pages]
  );

  // autoplay (paused on hover/drag)
  useEffect(() => {
    if (paused || maxScroll === 0) return;
    const t = window.setInterval(() => {
      goTo((page + 1) % pages);
    }, 5000);
    return () => window.clearInterval(t);
  }, [paused, page, pages, goTo, maxScroll]);

  // mouse wheel over the carousel slides it horizontally
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      const next = Math.min(Math.max(x.get() - delta * 1.15, -maxScroll), 0);
      animate(x, next, { type: "spring", stiffness: 320, damping: 36 });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [x, maxScroll]);

  // snap to the nearest card when a drag ends
  const onDragEnd = (_: unknown, info: PanInfo) => {
    setPaused(false);
    const target =
      -(x.get() + info.velocity.x * 0.12) / (CARD_W + GAP);
    const idx = Math.round(target);
    goTo(Math.max(0, Math.min(idx, pages - 1)));
  };

  const share = (t: Testimonial) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`"${t.quote}" - ${t.name}, ${t.role}`);
      toast.success("Quote copied to clipboard!");
    }
  };

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!fb.quote.trim()) {
      toast.error("Please add a short quote first.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fb),
      });
      // Always parse JSON — even errors return JSON now
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = json?.error ?? `Server error (${res.status})`;
        throw new Error(msg);
      }
      toast.success("Thank you! Your feedback has been submitted for review.");
      setFb({ name: "", quote: "" });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Couldn't submit feedback right now — please try again.";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  }

  const avg = items.length
    ? (items.reduce((s, t) => s + t.rating, 0) / items.length).toFixed(1)
    : "5.0";

  return (
    <section id="testimonials" className="relative scroll-mt-24 py-24 sm:py-32 overflow-hidden">
      <AmbientGlow className="inset-x-0 top-1/2 mx-auto -translate-y-1/2" size="100%" blur={120} />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Recommendations"
          title="Feedback from"
          highlight="collaborators."
          ghost="05"
        />

        {/* aggregate rating */}
        {items.length > 0 ? (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-4xl font-bold text-paper">{avg}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
            </div>
            <p className="text-[12px] uppercase tracking-[0.22em] text-mist">
              from {items.length} recommendations
            </p>
            <a
              href={SITE_CONFIG.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-semibold text-neon underline-offset-4 hover:underline"
            >
              Recommend me on LinkedIn →
            </a>
          </div>
        ) : (
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="mt-2 text-sm text-mist max-w-md">
              Gathering peer reviews from Deep Thought Analytics and project collaborators.
            </p>
            <a
              href={SITE_CONFIG.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-xs font-semibold text-neon underline-offset-4 hover:underline"
            >
              Write a recommendation on LinkedIn →
            </a>
          </div>
        )}

        {items.length > 0 && (
          <div
            ref={carouselRef}
            className="relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            {/* arrows */}
            <div className="absolute -top-16 right-0 hidden gap-3 sm:flex">
              {[
                { icon: ChevronLeft, dir: -1 as const, label: "Previous", act: () => goTo(page - 1) },
                { icon: ChevronRight, dir: 1 as const, label: "Next", act: () => goTo(page + 1) },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={b.act}
                  aria-label={b.label}
                  className="neo grid h-11 w-11 place-items-center rounded-xl bg-ink text-mist transition-colors hover:text-neon active:neo-inset"
                >
                  <b.icon className="h-4 w-4" />
                </button>
              ))}
            </div>

          {/* edge masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-[rgb(var(--bg))] to-transparent md:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-[rgb(var(--bg))] to-transparent md:block" />

          <motion.div
            ref={trackRef}
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -maxScroll, right: 0 }}
            dragElastic={0.08}
            dragMomentum={false}
            onDragStart={() => setPaused(true)}
            onDragEnd={onDragEnd}
            className="flex cursor-grab gap-6 active:cursor-grabbing"
          >
            {items.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -6 }}
                className="w-[300px] shrink-0 sm:w-[336px]"
              >
                <GlassCard className="flex h-full flex-col p-7">
                  {video === t.video && t.video && (
                    <div className="relative mb-4 aspect-video overflow-hidden rounded-xl border border-neon/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <video
                        src={t.video}
                        controls
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => setVideo(null)}
                        aria-label="Close video"
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-void/70 text-paper backdrop-blur"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Quote className="h-8 w-8 text-neon/70" />
                    {t.video && video !== t.video && (
                      <button
                        onClick={() => setVideo(t.video ?? null)}
                        aria-label="Play video testimonial"
                        className="grid h-8 w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-full border border-neon/40 bg-neon/10 text-neon transition-transform hover:scale-110"
                      >
                        <Play className="h-3.5 w-3.5 fill-neon" />
                      </button>
                    )}
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>

                  <p className="mt-5 flex-1 font-serif text-[15px] italic leading-relaxed text-paper/90">
                    “{t.quote}”
                  </p>

                  <div className="mt-7 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border border-neon/30">
                      <Image src={t.avatar} alt={t.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-paper">{t.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-mist">
                        {t.role}
                      </p>
                    </div>
                    <button
                      onClick={() => share(t)}
                      aria-label="Share quote"
                      className="grid h-9 w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 place-items-center rounded-xl border border-white/10 text-mist transition-colors hover:border-neon/40 hover:text-neon"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* dots */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={
                  "h-2 rounded-full transition-all duration-300 " +
                  (i === page
                    ? "w-8 bg-neon shadow-[0_0_10px_rgb(var(--neon)/0.8)]"
                    : "w-2 bg-mist/30 hover:bg-mist/60")
                }
              />
            ))}
          </div>
        </div>
        )}

        {/* feedback form */}
        <div className="glass mx-auto mt-14 max-w-xl rounded-3xl p-6 sm:p-8">
          <p className="text-center font-serif text-xl font-bold text-paper">
            Worked with me?
          </p>
          <p className="mt-1 text-center text-[12.5px] text-mist">
            Leave a short testimonial - it may appear on this page.
          </p>
          <form onSubmit={submitFeedback} className="mt-5 space-y-3">
            <input
              value={fb.name}
              onChange={(e) => setFb((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name (optional)"
              className="glass-input"
              maxLength={60}
            />
            <textarea
              value={fb.quote}
              onChange={(e) => setFb((f) => ({ ...f, quote: e.target.value }))}
              placeholder="What was it like working together?"
              className="glass-input resize-none"
              rows={3}
              maxLength={400}
            />
            <button
              type="submit"
              disabled={sending}
              className="neo flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:text-neon active:neo-inset disabled:opacity-60"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Submit feedback
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
