import { createHash } from "node:crypto";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { db, rateLimitHitsTable } from "@workspace/db";

import { logger } from "./logger";

/**
 * Rate limiting backed by the database.
 *
 * The site runs on autoscale, so an in-process counter would be per-instance
 * and lost on every scale-to-zero — which is to say, not a limit at all. This
 * counts accepted submissions in a shared table instead.
 *
 * The caller's IP is never stored: the bucket key is a salted SHA-256 of it.
 * Set RATE_LIMIT_SALT in production so the hashes are not guessable.
 */
const FALLBACK_SALT = "31-and-rooted";

function bucketFor(route: string, ip: string): string {
  const salt = process.env["RATE_LIMIT_SALT"] ?? FALLBACK_SALT;
  const hash = createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
  return `${route}:${hash}`;
}

/** Rows are only useful inside their window; drop anything long past it. */
const PRUNE_AFTER_MS = 24 * 60 * 60 * 1000;

async function prunePeriodically(): Promise<void> {
  // Cheap and rare: roughly one request in fifty pays for the cleanup.
  if (Math.random() > 0.02) return;
  try {
    await db
      .delete(rateLimitHitsTable)
      .where(lt(rateLimitHitsTable.createdAt, new Date(Date.now() - PRUNE_AFTER_MS)));
  } catch (err) {
    logger.warn({ err }, "Could not prune rate limit hits");
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export async function checkRateLimit({
  route,
  ip,
  limit,
  windowMs,
}: {
  route: string;
  ip: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  const bucket = bucketFor(route, ip);
  const since = new Date(Date.now() - windowMs);

  try {
    const [row] = await db
      .select({
        hits: sql<number>`count(*)::int`,
        oldest: sql<Date | null>`min(${rateLimitHitsTable.createdAt})`,
      })
      .from(rateLimitHitsTable)
      .where(and(eq(rateLimitHitsTable.bucket, bucket), gt(rateLimitHitsTable.createdAt, since)));

    if (row && row.hits >= limit) {
      const oldest = row.oldest ? new Date(row.oldest).getTime() : Date.now();
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - Date.now()) / 1000)),
      };
    }

    await db.insert(rateLimitHitsTable).values({ bucket });
    void prunePeriodically();
    return { allowed: true, retryAfterSeconds: 0 };
  } catch (err) {
    // A limiter that breaks must not take the form down with it.
    logger.error({ err, route }, "Rate limit check failed; allowing the request");
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
