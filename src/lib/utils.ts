/** Join class names. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Format a date like "2024" or "Mar 2024". */
export function formatYear(input?: string | null) {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(d);
}
