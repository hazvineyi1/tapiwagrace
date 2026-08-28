import { defineConfig } from "drizzle-kit";
import path from "path";

/**
 * `generate` only reads the schema, so it must work without a database.
 * `migrate` and `push` do connect, and drizzle-kit reports a missing or
 * empty connection string clearly enough on its own.
 */
export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  out: path.join(__dirname, "./drizzle"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
