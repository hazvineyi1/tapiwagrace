import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const newsletterSubscribersTable = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  // Unique so re-subscribing is a no-op rather than a duplicate row.
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type NewsletterSubscriber =
  typeof newsletterSubscribersTable.$inferSelect;
export type InsertNewsletterSubscriber =
  typeof newsletterSubscribersTable.$inferInsert;
