# 📱 Mobile, Responsiveness & Performance Guidelines

This document specifies the optimization principles and mobile considerations implemented across the Luxe Portfolio.

---

## 1. 120Hz Native Touch Scrolling vs. Smooth Scroll

* **Desktop**: Uses Lenis smooth scrolling with inertial physics (`lerp: 0.09`).
* **Mobile / Touch Devices**: All virtual wheel emulation is bypassed via `if (isTouchDevice()) return;` in `SmoothScrollProvider`. This guarantees:
  * 100% native 120Hz ProMotion / High-Refresh scroll performance on iOS and Android.
  * Zero rubber-banding lag or scroll stutter.
  * Native browser gesture navigation (swipe-back, pull-to-refresh).

---

## 2. WebGL & 3D Canvas Low-Power Profiling (`PortfolioScene.tsx`)

The 3D background scene dynamically tunes its rendering budget according to device capability:
1. **Device Pixel Ratio**:
   * Desktop: `dpr={[1, 2]}`.
   * Mobile / Low-Power: `dpr={[1, 1]}` (prevents 4x pixel shading on high-DPI phone screens).
2. **Particle Count**:
   * Desktop: 600 particles with depth fading.
   * Low-Power: Reduced to 140 particles.
3. **Viewport Intersection Throttling**:
   * The scene monitors visibility via `IntersectionObserver`. When scrolled out of the viewport, `frameloop="never"` halts the render loop completely, reducing GPU and CPU usage to 0%.
4. **Touch Drag Rotation**:
   * Drag-to-rotate is disabled on touch screens to avoid hijacking vertical scroll swipes.

---

## 3. Responsive Touch Targets & Viewport Safe Areas

* All buttons and interactive elements have a minimum accessible hit area of **44×44px** (using `min-h-[44px]` or `min-w-[44px]` on mobile).
* Mobile modals use `100dvh` (Dynamic Viewport Height) rather than `100vh` to avoid clipping under the browser URL bar or bottom navigation dock.
* Bottom navigation bars and floating buttons include `pb-safe` / `env(safe-area-inset-bottom)` spacing to prevent overlap with the iOS home indicator.

---

## 4. Reduced Motion & Battery Preservation

* The application auto-detects `prefers-reduced-motion: reduce` as well as user preference selected in the Quick Settings toolbar.
* On mobile touch devices, initial motion preference defaults to `reduced` to ensure instant responsiveness and maximum battery longevity, while desktop defaults to `full`.
* When reduced motion is active:
  * Complex 3D floating meshes switch to static subtle geometric representations.
  * Framer Motion layout springs are replaced with instant or fast fade transitions.
  * Heavy particle effects are disabled.
