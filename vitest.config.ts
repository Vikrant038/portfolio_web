import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// Minimal vitest baseline so the orchestrator's Phase 2 verifier has teeth:
// `npm test` must actually exercise code in a clean checkout. jsdom + the
// React plugin support the .tsx component tests the planner's frozen tests
// use; node environment is enough for pure-util tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "port/src/**/*.test.{ts,tsx}"],
  },
})
