import type { BookingKind } from "@workspace/api-client-react";

/** Section ids on the home page that the header links to. */
export const HOME_SECTIONS = ["retreats", "about", "tools", "daily"] as const;

/**
 * Set when a section link is clicked from a page other than home. The home
 * page consumes it on mount and scrolls, so cross-page nav lands in the
 * right place instead of dumping the visitor at the top.
 */
let pendingSection: string | null = null;

export function setPendingSection(id: string): void {
  pendingSection = id;
}

export function consumePendingSection(): string | null {
  const section = pendingSection;
  pendingSection = null;
  return section;
}

export function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Labels shown in the booking flow, and the enum the API stores. */
export const BOOKING_KINDS = {
  Retreat: "retreat",
  Conversation: "conversation",
  "Meal Packaging": "meal",
} as const satisfies Record<string, BookingKind>;

export type BookingLabel = keyof typeof BOOKING_KINDS;

export function isBookingLabel(value: string): value is BookingLabel {
  return value in BOOKING_KINDS;
}

/** Today as YYYY-MM-DD, used as the minimum on preferred-date inputs. */
export function todayIso(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

/** Renders an ISO date as a British long date, e.g. "21 November 2026". */
export function formatUkDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Turns an API failure into something a visitor can act on. */
export function errorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === "object" && "details" in data) {
      const details = (data as { details?: unknown }).details;
      if (Array.isArray(details) && details.length > 0) {
        return String(details[0]);
      }
    }
  }
  return fallback;
}
