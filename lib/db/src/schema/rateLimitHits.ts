import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * One row per accepted submission, used to rate limit the public forms.
 *
 * It lives in the database rather than in process memory because the site is
 * deployed on autoscale: instances come and go, and an in-memory counter is
 * both per-instance and lost on every scale-to-zero.
 *
 * `bucket` is "<route>:<hash>", where the hash is a salted SHA-256 of the
 * caller's IP. The raw address is never stored.
 */
export const rateLimitHitsTable = pgTable(
  "rate_limit_hits",
  {
    id: serial("id").primaryKey(),
    bucket: text("bucket").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("rate_limit_hits_bucket_created_idx").on(table.bucket, table.createdAt)],
);

export type RateLimitHit = typeof rateLimitHitsTable.$inferSelect;
