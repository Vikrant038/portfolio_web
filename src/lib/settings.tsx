"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { setSoundEnabled } from "@/lib/sound";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { isMobileViewport, isTouchDevice } from "@/lib/device";

export type Theme = "dark" | "light";
export type MotionPref = "full" | "reduced";

interface SettingsCtx {
  theme: Theme;
  toggleTheme: () => void;
  motion: MotionPref;
  setMotion: (m: MotionPref) => void;
  reducedMotion: boolean;
  sound: boolean;
  setSound: (v: boolean) => void;
}

const Ctx = createContext<SettingsCtx>({
  theme: "dark",
  toggleTheme: () => {},
  motion: "full",
  setMotion: () => {},
  reducedMotion: false,
  sound: false,
  setSound: () => {},
});

const THEME_KEY = "luxe-theme";
const MOTION_KEY = "luxe-motion";
const SOUND_KEY = "luxe-sound";

export function useSettings() {
  return useContext(Ctx);
}

/** Inline script - applies the stored/system theme before first paint. */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=t||(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.dataset.theme=d;}catch(e){document.documentElement.dataset.theme="dark";}})();`;

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [motion, setMotionState] = useState<MotionPref>("full");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sound, setSoundState] = useState(false);

  // hydrate from DOM/localStorage once mounted
  useEffect(() => {
    const sysTheme =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    const storedTheme = getStorageItem<Theme>(THEME_KEY, sysTheme);
    setTheme(storedTheme);

    const isMobile = isMobileViewport() || isTouchDevice();
    const storedMotion = getStorageItem<MotionPref | null>(MOTION_KEY, null);

    if (storedMotion === "full" || storedMotion === "reduced") {
      setMotionState(storedMotion);
      const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setReducedMotion(rm || storedMotion === "reduced");
    } else {
      // Default to reduced motion on mobile for instant snappy responsiveness & battery preservation
      const initialMotion: MotionPref = isMobile ? "reduced" : "full";
      setMotionState(initialMotion);
      const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setReducedMotion(rm || initialMotion === "reduced");
    }

    setSoundState(getStorageItem<string>(SOUND_KEY, "0") === "1");
  }, []);

  useEffect(() => {
    setSoundEnabled(sound);
    setStorageItem(SOUND_KEY, sound ? "1" : "0");
  }, [sound]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setStorageItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    setStorageItem(MOTION_KEY, motion);
    const isReduced =
      motion === "reduced" ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    setReducedMotion(isReduced);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.motion = motion;
    }
  }, [motion]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );
  const setMotion = useCallback((m: MotionPref) => setMotionState(m), []);
  const setSound = useCallback((v: boolean) => setSoundState(v), []);

  const value = useMemo(
    () => ({ theme, toggleTheme, motion, setMotion, reducedMotion, sound, setSound }),
    [theme, toggleTheme, motion, setMotion, reducedMotion, sound, setSound]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
