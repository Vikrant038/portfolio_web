"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

export default function BackToTop() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollTo } = useSmoothScroll();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.1);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    if (pathname !== "/") {
      router.push("/");
      return;
    }
    scrollTo("#top");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          onClick={handleClick}
          aria-label="Back to top"
          className="neo fixed bottom-6 right-5 z-[70] grid h-12 w-12 place-items-center rounded-2xl bg-ink text-mist transition-colors duration-300 hover:text-neon active:neo-inset sm:right-8"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
