import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from "./lib/migrate";
import { verifyCompanionKey } from "./lib/reflection-companion";

// The host assigns this. 8080 is only the fallback for running it by hand.
const rawPort = process.env["PORT"] ?? "8080";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start(): Promise<void> {
  // Before the first request, not after. A server that accepts enquiries
  // against a database with no tables loses them one 500 at a time.
  await runMigrations();

  // The companion is optional, so this never blocks the boot. It exists so the
  // logs answer "is the key working?" without anyone having to try the form.
  void verifyCompanionKey().then(({ state, detail }) => {
    if (state === "ready") {
      logger.info("Reflection companion: ANTHROPIC_API_KEY accepted, live replies enabled");
    } else if (state === "missing") {
      logger.warn("Reflection companion: no ANTHROPIC_API_KEY set, the site will use the scripted reflection");
    } else if (state === "rejected") {
      logger.error({ detail }, "Reflection companion: ANTHROPIC_API_KEY was REJECTED. Check the key and its billing; the site will use the scripted reflection");
    } else {
      logger.warn({ detail }, "Reflection companion: could not reach the Anthropic API to check the key");
    }
  });

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

start().catch((err) => {
  // Refusing to start is the point: the platform health check fails, the
  // deployment does not go live, and the previous version keeps serving.
  logger.error({ err }, "Startup failed");
  process.exit(1);
});
