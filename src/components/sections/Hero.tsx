"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, Sparkles, Send } from "lucide-react";
import NeumorphicButton from "@/components/ui/NeumorphicButton";
import Magnetic from "@/components/ui/Magnetic";
import CountUp from "@/components/ui/CountUp";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useAppReady } from "@/lib/app-ready";

const PortfolioScene = dynamic(
  () => import("@/components/three/PortfolioScene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-mist">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-neon/30 border-t-neon" />
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Rendering scene…
          </span>
        </div>
      </div>
    ),
  }
);

const ROLES = [
  "AI Systems Engineer",
  "Data Scientist",
  "RAG / LLM Engineer",
  "Automation Specialist",
];

function useTypewriter(words: string[], start: boolean) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!start) return;
    const word = words[index % words.length];
    const speed = deleting ? 38 : 85;

    const t = window.setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) window.setTimeout(() => setDeleting(true), 1600);
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }
      }
    }, speed);

    return () => window.clearTimeout(t);
  }, [text, deleting, index, words, start]);

  return text;
}

/* click-burst particles on the hero */
function useClickBurst(containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 10; i++) {
        const s = document.createElement("span");
        const ang = (i / 10) * Math.PI * 2;
        const dist = 40 + Math.random() * 70;
        s.className = "pointer-events-none absolute h-1.5 w-1.5 rounded-full";
        s.style.background =
          i % 2 === 0 ? "rgb(var(--neon))" : "rgb(var(--neon2))";
        s.style.boxShadow = "0 0 8px rgb(var(--neon) / 0.9)";
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        s.style.setProperty("--bx", `${Math.cos(ang) * dist}px`);
        s.style.setProperty("--by", `${Math.sin(ang) * dist}px`);
        s.style.animation = "burst 0.85s ease-out forwards";
        frag.appendChild(s);
      }
      el.appendChild(frag);
      window.setTimeout(
        () => frag.querySelectorAll("span").forEach((n) => n.remove()),
        950
      );
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [containerRef]);
}

export default function Hero() {
  const { scrollTo } = useSmoothScroll();
  const ready = useAppReady();
  const typed = useTypewriter(ROLES, ready);
  const sectionRef = useRef<HTMLElement>(null);
  useClickBurst(sectionRef);

  // pointer tilt on the content block
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const sX = useSpring(tiltX, { stiffness: 120, damping: 18 });
  const sY = useSpring(tiltY, { stiffness: 120, damping: 18 });

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 26, filter: "blur(10px)" },
    animate: ready
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 26, filter: "blur(10px)" },
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        tiltY.set(px * 5);
        tiltX.set(-py * 4);
      }}
      onPointerLeave={() => {
        tiltX.set(0);
        tiltY.set(0);
      }}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* 3D scene + cyber grid + glows */}
      <div className="absolute inset-0" aria-hidden>
        <PortfolioScene />
      </div>
      <span className="sr-only">
        Animated 3D field of floating geometric shapes in the background.
      </span>
      <div className="cyber-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)]" />
      <div
        className="absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: "rgb(var(--neon) / 0.09)" }}
      />
      <div
        className="absolute -right-40 bottom-1/4 h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: "rgb(var(--neon2) / 0.08)" }}
      />

      <motion.div
        style={{ rotateX: sX, rotateY: sY, transformStyle: "preserve-3d" }}
        className="section-shell relative z-10 flex flex-col items-center pb-28 pt-32 text-center"
      >
        <motion.h1
          {...fadeUp(0.22)}
          className="font-serif text-5xl font-bold leading-[1.02] tracking-tight text-paper sm:text-7xl md:text-[86px]"
        >
          Vikrant <span className="text-gradient font-bold drop-shadow-[0_0_24px_rgb(var(--neon)/0.4)]">Yadav</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.45)}
          className="mt-6 min-h-[2rem] text-lg font-medium text-mist sm:text-xl"
        >
          I&apos;m a{" "}
          <span className="text-gradient font-semibold drop-shadow-[0_0_18px_rgb(var(--neon)/0.35)]">
            {typed}
          </span>
          <span
            className="ml-0.5 inline-block w-[2px] animate-pulse bg-neon align-middle"
            style={{ height: "1.1em" }}
          />
        </motion.p>

        <motion.p
          {...fadeUp(0.58)}
          className="mt-6 max-w-2xl text-[16px] leading-relaxed text-mist sm:text-[17.5px] sm:leading-8"
        >
          IIT Madras BS (Data Science) candidate who builds AI systems that turn
          manual workflows into measurable outcomes - RAG pipelines, multi-agent
          automation, and data engineering that ships.
        </motion.p>

        {/* stat counters */}
        <motion.div
          {...fadeUp(0.66)}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {[
            { value: 6, suffix: "+", label: "AI Tools Shipped" },
            { value: 6, suffix: "", label: "Projects" },
            { value: 6, suffix: "", label: "Team Led" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-2xl font-bold text-paper sm:text-3xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-mist">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          {...fadeUp(0.78)}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <NeumorphicButton
              size="lg"
              icon={<Sparkles className="h-4 w-4" />}
              onClick={() => scrollTo("#projects")}
            >
              View Work
            </NeumorphicButton>
          </Magnetic>
          <Magnetic strength={0.25}>
            <NeumorphicButton
              size="lg"
              variant="ghost"
              icon={<Send className="h-4 w-4" />}
              onClick={() => scrollTo("#contact")}
            >
              Get in Touch
            </NeumorphicButton>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        onClick={() => scrollTo("#about")}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-mist transition-colors hover:text-neon"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.button>
    </section>
  );
}
