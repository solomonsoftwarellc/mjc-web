import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes a Firestore `releaseDate` value into a Date.
 * Older docs store an ISO string; some were saved as Firestore Timestamps.
 * Accept both so a date never silently renders as "N/A".
 */
export function parseReleaseDate(value: unknown): Date | null {
  if (!value) return null;
  let date: Date | null = null;
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else if (
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    date = (value as { toDate: () => Date }).toDate();
  }
  return date && !Number.isNaN(date.getTime()) ? date : null;
}
