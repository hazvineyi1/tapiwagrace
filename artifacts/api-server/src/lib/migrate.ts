import path from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { logger } from "./logger";

/**
 * Postgres advisory lock id. Any constant works as long as nothing else in the
 * database uses the same one; this is the only advisory lock we take.
 */
const MIGRATION_LOCK = 31_2027;

/**
 * Brings the database up to date before the server starts answering.
 *
 * The bundle is a single file, so the SQL cannot be resolved through the db
 * package at runtime. build.mjs copies lib/db/drizzle next to the bundle and we
 * read it from there.
 *
 * Autoscale can start several instances at once, and two migrators running
 * together would race on the journal table, so the work happens inside a
 * session-level advisory lock. Whoever loses the race waits, then finds there
 * is nothing left to apply.
 */
export async function runMigrations(): Promise<void> {
  const migrationsFolder = path.join(__dirname, "drizzle");

  await db.execute(sql`select pg_advisory_lock(${MIGRATION_LOCK})`);
  try {
    await migrate(db, { migrationsFolder });
    logger.info({ migrationsFolder }, "Database schema is up to date");
  } finally {
    await db.execute(sql`select pg_advisory_unlock(${MIGRATION_LOCK})`);
  }
}
