"use client";

import Reveal from "@/components/ui/Reveal";
import Tilt from "@/components/ui/Tilt";

/**
 * Client shell for the About section's left-side monogram frame.
 * Wraps the static SVG + gradient content in Reveal (scroll animation)
 * and Tilt (hover parallax). The SVG itself is server-rendered markup
 * passed as `children`.
 */
export default function TiltMonogram({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="relative mx-auto w-full max-w-md">
      <Tilt max={10} className="group relative">
        {children}
      </Tilt>
    </Reveal>
  );
}
