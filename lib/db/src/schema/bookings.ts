import { date, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/** The three things a visitor can make room for on the site. */
export const bookingKindEnum = pgEnum("booking_kind", [
  "retreat",
  "conversation",
  "meal",
]);

/** Where an enquiry sits in the founder's follow-up flow. */
export const bookingStatusEnum = pgEnum("booking_status", [
  "new",
  "contacted",
  "confirmed",
  "closed",
]);

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  kind: bookingKindEnum("kind").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  // Nullable: the visitor may enquire without committing to a date.
  preferredDate: date("preferred_date"),
  preferredTime: text("preferred_time"),
  message: text("message"),
  status: bookingStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Booking = typeof bookingsTable.$inferSelect;
export type InsertBooking = typeof bookingsTable.$inferInsert;
