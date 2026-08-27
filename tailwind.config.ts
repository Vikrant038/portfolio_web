import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "rgb(var(--bg) / <alpha-value>)",
        ink: "rgb(var(--surface) / <alpha-value>)",
        surface: "rgb(var(--card) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
        neon: "rgb(var(--neon) / <alpha-value>)",
        neon2: "rgb(var(--neon2) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        neo: "6px 6px 14px var(--sh-dark), -6px -6px 14px var(--sh-light)",
        "neo-inset":
          "inset 3px 3px 8px var(--sh-dark), inset -3px -3px 8px var(--sh-light)",
        glass: "0 24px 60px -24px var(--sh-dark)",
        glow: "0 0 40px -6px rgb(var(--neon) / 0.45)",
        "glow-2": "0 0 44px -6px rgb(var(--neon2) / 0.45)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.9" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        burst: {
          "0%": { transform: "translate(var(--bx), var(--by)) scale(1)", opacity: "1" },
          "100%": { transform: "translate(calc(var(--bx) * 3), calc(var(--by) * 3)) scale(0)", opacity: "0" },
        },
      },
      animation: {
        floaty: "floaty 5s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.2,0.6,0.4,1) infinite",
        shimmer: "shimmer 6s linear infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
