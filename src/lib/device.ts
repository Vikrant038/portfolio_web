"use client";

import { useEffect, useState } from "react";

/**
 * Single canonical touch and mobile device detection utility.
 * Handles mobile phones, tablets, and hybrid laptops (iPad Pro, Surface).
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || window.matchMedia("(max-width: 767px)").matches;
}

export function isLowPowerDevice(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number };
  return (
    isTouchDevice() ||
    isMobileViewport() ||
    (nav.hardwareConcurrency ?? 8) < 4 ||
    (nav.deviceMemory ?? 8) < 4
  );
}

export function useDevice() {
  const [device, setDevice] = useState({
    isTouch: false,
    isMobile: false,
    isLowPower: false,
  });

  useEffect(() => {
    const update = () => {
      setDevice({
        isTouch: isTouchDevice(),
        isMobile: isMobileViewport(),
        isLowPower: isLowPowerDevice(),
      });
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return device;
}
