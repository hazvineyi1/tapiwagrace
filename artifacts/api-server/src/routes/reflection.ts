import { Router, type IRouter } from "express";
import { CreateReflectionBody } from "@workspace/api-zod";

import {
  isCompanionConfigured,
  reflect,
  type Framework,
} from "../lib/reflection-companion";
import { createRateLimit } from "../lib/rate-limit";
import { parseBody } from "../lib/validation";

const router: IRouter = Router();

// Anonymous visitors drive a paid model here, so cap each one.
const limiter = createRateLimit({ limit: 30, windowMs: 15 * 60 * 1000 });

router.post("/reflection", async (req, res) => {
  if (!isCompanionConfigured()) {
    res.status(503).json({
      error: "The reflection companion is not available right now.",
    });
    return;
  }

  const visitor = req.ip ?? "unknown";
  const { allowed, retryAfterSeconds } = limiter.check(visitor);
  if (!allowed) {
    res.setHeader("Retry-After", String(retryAfterSeconds));
    res.status(429).json({
      error:
        "That is a lot of reflecting in one sitting. Rest a moment and come back.",
    });
    return;
  }

  const body = parseBody(CreateReflectionBody, req.body, res);
  if (!body) return;

  const reflection = await reflect({
    framework: body.framework as Framework,
    turns: body.turns,
  });

  // The contract leaves these out rather than sending nulls.
  res.json({
    reply: reflection.reply,
    ...(reflection.scripture ? { scripture: reflection.scripture } : {}),
    ...(reflection.voice ? { voice: reflection.voice } : {}),
    ...(reflection.invitation ? { invitation: reflection.invitation } : {}),
    closing: reflection.closing,
    care: reflection.care,
  });
});

export default router;
