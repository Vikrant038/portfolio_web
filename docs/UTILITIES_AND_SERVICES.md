# 🛠️ Utilities & Services

This document details the utility libraries and service clients in `src/lib/`. All cross-cutting concerns (storage, device detection, API parsing, sound, email) are centralized here.

---

## 1. Storage Utility (`src/lib/storage.ts`)

Encapsulates all `localStorage` reads and writes with SSR safety guards and `try/catch` protection against Safari Private Browsing `QuotaExceededError` or `SecurityError`.

### API:
```ts
// Safe read with typed fallback
const visited = getStorageItem<boolean>("luxe-visited", false);

// Safe write (returns boolean success flag)
setStorageItem("luxe-theme", "dark");

// Safe removal
removeStorageItem("luxe-contact-draft");
```

---

## 2. Canonical Device Detection (`src/lib/device.ts`)

Provides unified heuristics for touch screens, mobile viewports, and low-power devices. Eliminates fragmented `matchMedia` or `ontouchstart` checks.

### API:
```ts
// Imperative check for touch support (phones, tablets, iPad Pro, Touch laptops)
if (isTouchDevice()) { ... }

// Viewport width check (< 768px)
if (isMobileViewport()) { ... }

// Composite check for low CPU/GPU devices (hardwareConcurrency, deviceMemory)
if (isLowPowerDevice()) { ... }

// React Hook (listens to resize/orientation dynamically)
const { isTouch, isMobile, isLowPower } = useDevice();
```

---

## 3. Standardized API Response & Parsing (`src/lib/api-utils.ts`)

Eliminates repetitive `try/catch req.json()` blocks and standardizes JSON responses across all Next.js API routes (`src/app/api/*`).

### API:
```ts
import { parseJsonBody, apiSuccess, apiError } from "@/lib/api-utils";

export async function POST(req: Request) {
  const { data, error: jsonError } = await parseJsonBody<{ name: string }>(req);
  if (jsonError) return jsonError; // Returns 400 "Invalid JSON body"

  if (!data?.name) {
    return apiError("Name is required", 422);
  }

  return apiSuccess({ user: data.name });
}
```

---

## 4. Email Service (`src/lib/plunk.ts`)

Connects to the Plunk REST API (`https://api.useplunk.com/v1/send`) for transactional notifications.

### Exports:
* `sendEmail({ to, subject, body, html?, from? })`: Generic sender for notifications, reports, or crons.
* `sendContactEmail(payload)`: Formatted HTML contact notification with auto-reply to the visitor and optional webhook dispatch.
* Degrades gracefully when `PLUNK_API_KEY` is not present in the environment (logs to console without throwing).

---

## 5. Web Audio Engine (`src/lib/sound.ts`)

Synthesizes high-tech UI feedback sounds using the Web Audio API (`AudioContext`). No audio asset files or network latency required.

### Functions:
* `playUiSound("tick" | "whoosh" | "bubble" | "pop" | "sweep")`: Triggers lightweight procedural waveforms.
* `setSoundEnabled(boolean)`: Global mute toggle hooked into `SettingsProvider`.
* `getAudioLevel()`: Real-time audio analyzer for reactive 3D visualizers.

---

## 6. Site Constants (`src/lib/constants.ts`)

Single source of truth for site-wide metadata:
* `SITE_CONFIG.name`: `"Vikrant Yadav"`
* `SITE_CONFIG.email`: `"vikrantyadav515151@gmail.com"`
* `SITE_CONFIG.resumePath`: `"/Vikrant_Yadav_Resume.pdf"`
* `SITE_CONFIG.resumeFileName`: `"Vikrant_Yadav_Resume.pdf"`
* `SITE_CONFIG.socials`: GitHub, LinkedIn, Twitter, Medium profile URLs.
