# 🧩 UI Components & Design System Primitives

This document documents the canonical UI primitives and design system components in `src/components/ui/`. Every UI component in the codebase is unified to prevent duplicate styling or conflicting behavioral logic.

---

## 1. `<Modal>` (`src/components/ui/Modal.tsx`)

The universal dialog / overlay container across the application. Used for reading blog articles, viewing project technical breakdowns, and custom modal flows.

### Key Capabilities:
* **Static Fixed Close Button (Never Scrolls Away)**:
  * The close (`X`) button is anchored directly on the outer card container (`absolute right-3.5 top-3.5 sm:right-5 sm:top-5 z-50`) while content scrolls inside a sibling `<div className="flex-1 overflow-y-auto ...">`.
  * As the user scrolls down through 5,000+ words of article or technical breakdown, the cross button remains **100% physically stationary and accessible** on both mobile and desktop.
* **Mobile-First Scroll Architecture**:
  * On mobile (`< sm`): Top-aligned full-screen reader (`h-full max-h-[100dvh]`) with iOS momentum touch scrolling (`-webkit-overflow-scrolling: touch`) and `data-lenis-prevent="true"`.
  * On desktop (`>= sm`): Centered floating dialog (`sm:max-h-[88vh] sm:rounded-3xl`).
* **Accessible Focus Management**:
  * Captures initial focus inside the dialog and traps tab cycles.
  * Closes on Escape key press.
  * Restores focus back to the triggering element on unmount.
  * Locks `document.body` scroll while open.

### Usage Example:
```tsx
import Modal from "@/components/ui/Modal";

<Modal
  isOpen={Boolean(activeItem)}
  onClose={() => setActiveItem(null)}
  title={activeItem?.title}
  eyebrow="Technical Breakdown"
>
  <div className="prose">{activeItem?.content}</div>
</Modal>
```

---

## 2. `<NeumorphicButton>` (`src/components/ui/NeumorphicButton.tsx`)

The standard button and link primitive. Replaces all ad-hoc `.neo` class button combinations.

### Props:
* `variant`: `"primary"` (default, bright neon glow) | `"ghost"` (subtle border and mist text).
* `size`: `"sm"` | `"md"` (default) | `"lg"` | `"icon"`.
* `icon`: Optional `ReactNode` (auto-scaled on hover).
* `href`: When provided, renders as an accessible `<motion.a>` link.
* `download`: Supported for declarative file downloads (e.g. CV / Resume).
* `onClick`: Click handler with tactile spring tap feedback (`whileTap={{ scale: 0.97 }}`).

### Usage Example:
```tsx
import NeumorphicButton from "@/components/ui/NeumorphicButton";
import { Download, Send } from "lucide-react";

// Button
<NeumorphicButton onClick={handleSubmit} icon={<Send className="h-4 w-4" />}>
  Submit
</NeumorphicButton>

// Declarative Download Link
<NeumorphicButton
  href="/Vikrant_Yadav_Resume.pdf"
  download="Vikrant_Yadav_Resume.pdf"
  icon={<Download className="h-4 w-4" />}
>
  Download Resume
</NeumorphicButton>
```

---

## 3. `<ErrorBoundary>` (`src/components/ui/ErrorBoundary.tsx`)

The centralized React Error Boundary class. Protects the application against client-side crashes in sections, forms, 3D WebGL scenes, and widgets.

### Props:
* `name`: Component name for logs and error heading (e.g., `"Contact Form"`, `"3D Canvas"`).
* `fallback`: Optional static `ReactNode` or dynamic render function `(error, reset) => ReactNode`.
* `onError`: Optional telemetry or logging callback.

### Usage Example:
```tsx
import ErrorBoundary from "@/components/ui/ErrorBoundary";

<ErrorBoundary name="Projects Section">
  <ProjectsList />
</ErrorBoundary>
```

---

## 4. `<AmbientGlow>` (`src/components/ui/AmbientGlow.tsx`)

A GPU-accelerated blurred radial orb that provides atmospheric background illumination without causing layout shifts, battery drain, or frame drops.

### Props:
* `color`: `"neon"` (default) | `"neon2"` | `"gold"`.
* `size`: `number` (pixels) or `string` (e.g. `500` or `"100%"`).
* `opacity`: Number between 0 and 1 (default `0.05`).
* `blur`: Blur radius in pixels (default `140`).
* `className`: Positioning classes (e.g. `left-1/2 top-1/2 -translate-x-1/2`).

---

## 5. `<Reveal>` (`src/components/ui/Reveal.tsx`) & `<SectionHeading>` (`src/components/ui/SectionHeading.tsx`)

Standardizes all scroll-triggered entrance animations across sections.

* `<Reveal>` respects `useSettings().reducedMotion` and renders static content instantly when motion is disabled or on mobile devices (`animate={{ opacity: 1, y: 0 }}`).
* `<SectionHeading>` wraps section eyebrow badges, title headers, gradient underlines, and background ghost numbers in `<Reveal>` tags.

---

## 6. `<GlassCard>` (`src/components/ui/GlassCard.tsx`)

The foundational card container with backdrop blur, subtle neumorphic borders, and flexible vertical container expansion (`h-full flex flex-col flex-1`).

---

## 7. `<FilterTabs>` (`src/components/ui/FilterTabs.tsx`)

Horizontal category selection tabs with layout spring animations and momentum touch swiping on mobile devices without scrollbar clipping.
