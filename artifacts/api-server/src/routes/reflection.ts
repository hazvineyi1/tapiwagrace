import { Router, type IRouter } from "express";
import { CreateReflectionBody } from "@workspace/api-zod";

import {
  isAuthFailure,
  isCompanionConfigured,
  reflect,
  type Framework,
} from "../lib/reflection-companion";
import { allowSubmission } from "../lib/guard";
import { parseBody } from "../lib/validation";

const router: IRouter = Router();

router.post("/reflection", async (req, res) => {
  if (!isCompanionConfigured()) {
    res.status(503).json({
      error: "The reflection companion is not available right now.",
    });
    return;
  }

  // Anonymous visitors drive a paid model here, so cap each one.
  if (!(await allowSubmission({ route: "reflection", req, res, limit: 30, windowMs: 15 * 60 * 1000 }))) return;

  const body = parseBody(CreateReflectionBody, req.body, res);
  if (!body) return;

  let reflection;
  try {
    reflection = await reflect({
      framework: body.framework as Framework,
      turns: body.turns,
    });
  } catch (cause) {
    // A rejected key is a configuration fault, not a passing glitch. Answer
    // 503 like an unset key so the page runs the scripted reflection instead
    // of showing a visitor an error we caused.
    if (isAuthFailure(cause)) {
      req.log.error({ err: cause }, "ANTHROPIC_API_KEY rejected by the API");
      res.status(503).json({
        error: "The reflection companion is not available right now.",
      });
      return;
    }
    throw cause;
  }

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
