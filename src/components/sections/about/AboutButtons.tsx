"use client";

import { Download, ArrowUpRight } from "lucide-react";
import NeumorphicButton from "@/components/ui/NeumorphicButton";
import Reveal from "@/components/ui/Reveal";
import { downloadResume } from "@/lib/utils";

/**
 * Client shell for the About section's action buttons.
 * Wraps the download resume button and career page link in Reveal
 * for scroll-triggered animation. The download handler is the only
 * genuinely interactive piece — everything else is static markup.
 */
export default function AboutButtons() {
  return (
    <Reveal delay={0.45}>
      <div className="mt-9 flex flex-wrap items-center gap-4">
        <NeumorphicButton
          icon={<Download size={16} />}
          onClick={downloadResume}
        >
          Download Resume
        </NeumorphicButton>
        <a
          href="/career"
          className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-mist transition-colors hover:text-paper"
        >
          View career page
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </Reveal>
  );
}
