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

/** Matches the scroll-margin-top on section targets in index.css. */
const HEADER_CLEARANCE_PX = 120;

/** Anything under this is invisible; anything over it is a mis-landing. */
const ACCEPTABLE_DRIFT_PX = 4;

/**
 * Scrolls a section to just under the fixed header, and checks that it got
 * there.
 *
 * A smooth scroll is aimed once, at the layout as it stands when the link is
 * clicked. If a photograph further up the page arrives while the scroll is
 * still running, everything below it moves and the scroll finishes somewhere
 * else entirely, which is how a click on "About" was landing hundreds of pixels
 * into the wrong section. Images now reserve their space, so this should not
 * happen, but a font swap or a late-rendering block can still shift things.
 *
 * So: aim, wait for the page to stop moving, and if the section is not where it
 * should be, aim again. Twice at most, which is enough for a settle and never
 * turns into a fight with the user's own scrolling.
 */
export function scrollToSection(id: string, attempt = 0): void {
  const element = document.getElementById(id);
  if (!element) return;

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });

  if (attempt >= 2) return;

  let lastY = window.scrollY;
  let stillFor = 0;
  let elapsed = 0;
  let abandoned = false;

  // The moment the visitor takes over, this stops. Correcting a scroll they
  // started themselves would drag the page out from under them.
  const abandon = () => {
    abandoned = true;
  };
  const events = ["wheel", "touchstart", "keydown"] as const;
  const stopListening = () => {
    for (const name of events) window.removeEventListener(name, abandon);
  };
  for (const name of events) {
    window.addEventListener(name, abandon, { passive: true, once: true });
  }

  const check = () => {
    if (abandoned) {
      stopListening();
      return;
    }

    elapsed += 100;
    const y = window.scrollY;
    stillFor = Math.abs(y - lastY) < 1 ? stillFor + 1 : 0;
    lastY = y;

    // Settled, or we have waited long enough to stop caring.
    if (stillFor < 2 && elapsed < 2000) {
      window.setTimeout(check, 100);
      return;
    }

    stopListening();
    const drift = element.getBoundingClientRect().top - HEADER_CLEARANCE_PX;
    if (Math.abs(drift) > ACCEPTABLE_DRIFT_PX) {
      scrollToSection(id, attempt + 1);
    }
  };

  window.setTimeout(check, 100);
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
