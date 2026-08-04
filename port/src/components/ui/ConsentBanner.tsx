"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";

export const CONSENT_KEY = "luxe-consent";
export type Consent = "accepted" | "declined" | null;

export function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "accepted" || v === "declined" ? v : null;
}

export default function ConsentBanner() {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    setConsent(readConsent());
  }, []);

  const choose = (c: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(CONSENT_KEY, c);
    } catch {
      /* ignore */
    }
    setConsent(c);
    window.dispatchEvent(new CustomEvent("luxe:consent"));
  };

  return (
    <AnimatePresence>
      {consent === null && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="glass-strong fixed bottom-5 left-1/2 z-[80] w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 rounded-2xl p-5 shadow-glass sm:left-6 sm:translate-x-0"
          role="dialog"
          aria-label="Privacy consent"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neon/10 text-neon">
              <Cookie className="h-5 w-5" />
            </span>
            <p className="text-[13px] leading-relaxed text-mist">
              I use privacy-friendly analytics (Microsoft Clarity) to
              understand how the site is used — no personal data is sold.
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => choose("accepted")}
              className="neo flex-1 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:text-neon active:neo-inset"
            >
              Accept
            </button>
            <button
              onClick={() => choose("declined")}
              className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-mist transition-colors hover:text-paper"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
