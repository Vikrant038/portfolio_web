"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

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
    <button
      onClick={handleClick}
      aria-label="Back to top"
      className={cn(
        "neo fixed bottom-6 right-5 z-[70] grid h-12 w-12 min-h-[44px] min-w-[44px] place-items-center rounded-2xl bg-ink text-mist transition-all duration-300 hover:text-neon active:neo-inset sm:right-8",
        show
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-75 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
