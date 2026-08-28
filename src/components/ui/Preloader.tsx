"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { markAppReady } from "@/lib/app-ready";
import { useSettings } from "@/lib/settings";

const VISITED_KEY = "luxe-visited";

export default function Preloader() {
  const { reducedMotion } = useSettings();
  const [done, setDone] = useState(false);
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    const visited = window.localStorage.getItem(VISITED_KEY) === "1";
    setReturning(visited);
    try {
      window.localStorage.setItem(VISITED_KEY, "1");
    } catch {
      /* ignore */
    }
    const dur = reducedMotion || visited ? 700 : 1700;
    const t = window.setTimeout(() => {
      markAppReady();
      setDone(true);
    }, dur);
    return () => window.clearTimeout(t);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          exit={{
            y: "-100%",
            transition: { duration: returning ? 0.4 : 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void"
          aria-hidden
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
              style={{ background: "rgb(var(--neon) / 0.08)" }}
            />
          </div>

          <motion.div
            animate={
              reducedMotion
                ? { opacity: [0.4, 1, 0.4] }
                : {
                    borderRadius: ["50%", "24%", "18% 50% 18% 50%"],
                    rotate: [0, 45, 0],
                    scale: [1, 1.08, 1],
                  }
            }
            transition={{ duration: returning ? 0.6 : 1.4, ease: "easeInOut" }}
            className="relative h-20 w-20 border"
            style={{
              borderColor: "rgb(var(--neon) / 0.6)",
              boxShadow: "0 0 60px -6px rgb(var(--neon) / 0.6)",
              background:
                "radial-gradient(circle at 30% 30%, rgb(var(--neon) / 0.28), rgb(var(--neon2) / 0.14) 60%, transparent)",
            }}
          >
            <span className="absolute inset-2 border" style={{ borderColor: "rgb(var(--neon2) / 0.4)" }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-[16%] left-1/2 -translate-x-1/2 text-center"
          >
            <p className="font-serif text-sm tracking-[0.35em] text-paper/90 uppercase">
              VIKRANT YADAV
            </p>
            <div className="mx-auto mt-3 h-px w-24 overflow-hidden bg-white/10">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: returning ? 0.45 : 1.1, ease: "easeInOut", repeat: Infinity }}
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-[var(--grad-a)] to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
