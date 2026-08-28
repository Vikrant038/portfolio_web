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
import { isTouchDevice } from "@/lib/device";

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
    // On all mobile touch devices, use 100% native 120Hz GPU hardware scrolling
    if (isTouchDevice()) {
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      lerp: motion === "reduced" ? 1 : 0.09,
      smoothWheel: motion !== "reduced",
      wheelMultiplier: 1,
      touchMultiplier: 1,
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

  const scrollTo = useCallback((target: string | HTMLElement, offset = -72) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.1 });
    } else if (typeof window !== "undefined") {
      if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      } else if (target instanceof HTMLElement) {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, []);

  return <Ctx.Provider value={{ scrollTo }}>{children}</Ctx.Provider>;
}
