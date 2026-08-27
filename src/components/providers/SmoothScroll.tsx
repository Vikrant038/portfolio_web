"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Lenis from "lenis";
import type { ReactNode } from "react";
import { useSettings } from "@/lib/settings";

interface SmoothScrollCtx {
  scrollTo: (target: string | HTMLElement, offset?: number) => void;
}

const Ctx = createContext<SmoothScrollCtx>({ scrollTo: () => {} });

export function useSmoothScroll() {
  return useContext(Ctx);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { motion } = useSettings();
  const lenisRef = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: motion === "reduced" ? 1 : 0.09,
      smoothWheel: motion !== "reduced",
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    setReady(true);

    // deep-link on load (e.g. /#projects)
    if (typeof window !== "undefined" && window.location.hash) {
      window.setTimeout(() => {
        lenis.scrollTo(window.location.hash, { offset: -72, duration: 1.2 });
      }, 400);
    }

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [motion]);

  const scrollTo = useCallback(
    (target: string | HTMLElement, offset = -72) => {
      if (!lenisRef.current || !ready) return;
      lenisRef.current.scrollTo(target as any, {
        offset,
        duration: motion === "reduced" ? 0.2 : 1.4,
      });
    },
    [ready, motion]
  );

  return <Ctx.Provider value={{ scrollTo }}>{children}</Ctx.Provider>;
}
