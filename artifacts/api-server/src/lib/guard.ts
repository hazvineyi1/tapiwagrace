import type { Request, Response } from "express";

import { logger } from "./logger";
import { checkRateLimit } from "./rate-limit";

/**
 * Shared front door for the public form endpoints: rate limit first, then the
 * honeypot. Returns false when the caller has already been answered.
 */
export async function allowSubmission({
  route,
  req,
  res,
  limit,
  windowMs,
}: {
  route: string;
  req: Request;
  res: Response;
  limit: number;
  windowMs: number;
}): Promise<boolean> {
  const { allowed, retryAfterSeconds } = await checkRateLimit({
    route,
    ip: req.ip ?? "unknown",
    limit,
    windowMs,
  });

  if (!allowed) {
    res.setHeader("Retry-After", String(retryAfterSeconds));
    res.status(429).json({
      error: "That is a lot of messages in a short time. Please try again shortly.",
    });
    return false;
  }

  return true;
}

/**
 * True when the hidden field was filled in, which only automation does.
 *
 * The caller should answer as though the submission succeeded: telling a bot
 * it was caught just teaches whoever wrote it to try something else.
 */
export function isBot(body: { website?: string | undefined }, route: string): boolean {
  if (!body.website || body.website.trim() === "") return false;
  logger.info({ route }, "Discarded a submission that filled the honeypot");
  return true;
}
