"use client";

import Link from "next/link";
import { Download, ArrowUpRight } from "lucide-react";
import NeumorphicButton from "@/components/ui/NeumorphicButton";
import Reveal from "@/components/ui/Reveal";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Client shell for the About section's action buttons.
 * Wraps the download resume button and career page link in Reveal
 * for scroll-triggered animation. Uses Next.js Link with prefetch
 * for instant 1-click navigation.
 */
export default function AboutButtons() {
  return (
    <Reveal delay={0.45}>
      <div className="mt-9 flex flex-wrap items-center gap-4">
        <NeumorphicButton
          href={SITE_CONFIG.resumePath}
          download={SITE_CONFIG.resumeFileName}
          icon={<Download size={16} />}
        >
          Download Resume
        </NeumorphicButton>
        <Link
          href="/career"
          prefetch={true}
          className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-mist transition-colors hover:text-paper"
        >
          View career page
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </Reveal>
  );
}
