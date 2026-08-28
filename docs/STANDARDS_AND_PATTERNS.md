# 📐 Standards, Conventions & Agent Guidelines

This document outlines the engineering standards and patterns required when modifying or extending this codebase.

---

## 1. Zero-Duplication (DRY) Commandments

Whenever you build a new feature, section, or endpoint, follow these mandatory conventions:

1. **Buttons**: Always use `<NeumorphicButton>` from `@/components/ui/NeumorphicButton`. Never write raw `.neo` or `.neo-inset` class strings on `<button>` or `<a>` elements.
2. **Modals & Dialogs**: Always wrap dialogs in `<Modal>` from `@/components/ui/Modal`. Never build custom backdrop overlays or manual scroll locks.
3. **Background Blur Orbs**: Always use `<AmbientGlow>` from `@/components/ui/AmbientGlow`. Never copy-paste raw `div` blur layers.
4. **Touch & Device Checks**: Always import from `@/lib/device` (`isTouchDevice()`, `isMobileViewport()`, `useDevice()`). Never write ad-hoc `window.innerWidth < 768` or `ontouchstart` checks inline.
5. **Storage**: Always import from `@/lib/storage` (`getStorageItem`, `setStorageItem`, `removeStorageItem`). Never call `window.localStorage` directly.
6. **API Route Handlers**: Always use `parseJsonBody`, `apiSuccess`, and `apiError` from `@/lib/api-utils`. Never write manual `try { req.json() } catch {}` blocks.
7. **Email Dispatch**: Always call `sendEmail` or `sendContactEmail` from `@/lib/plunk`. Never write raw `fetch("https://api.useplunk.com/...")` in route files.
8. **Error Boundaries**: Always use `<ErrorBoundary>` from `@/components/ui/ErrorBoundary`. Never write duplicate React error boundary class components.
9. **Scroll Entrance Animations**: Always use `<Reveal>` from `@/components/ui/Reveal` or `<SectionHeading>` from `@/components/ui/SectionHeading`.

---

## 2. Accessibility (a11y) Rules

* Ensure all interactive icon buttons specify `aria-label` or `title`.
* Decorative elements must have `aria-hidden="true"`.
* Dialogs must maintain focus traps and announce themselves with `role="dialog"`.
* Form inputs must be linked to accessible `<label>` elements and have `id` attributes.

---

## 3. Hydration & Client Component Rules

* Always guard browser-only globals (`window`, `localStorage`, `document`) against SSR execution.
* Ensure server-rendered HTML matches initial client hydration state.
* Use `useEffect` or client-side mounting state when rendering content that depends on local storage or window dimensions.
