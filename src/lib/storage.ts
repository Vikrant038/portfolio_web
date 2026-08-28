/**
 * Safe local storage utility with SSR guards and try/catch protection
 * against Safari Private Browsing QuotaExceededError / SecurityError.
 */

export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return fallback;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  try {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`[storage] Failed to set key "${key}":`, err);
    return false;
  }
}

export function removeStorageItem(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
