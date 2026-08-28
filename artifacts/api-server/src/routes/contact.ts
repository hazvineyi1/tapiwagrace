import { Router, type IRouter } from "express";
import {
  SendContactMessageBody,
  SendContactMessageResponse,
} from "@workspace/api-zod";
import { contactMessagesTable, db } from "@workspace/db";
import { allowSubmission, isBot } from "../lib/guard";
import { notifyEnquiry } from "../lib/mailer";
import {
  normalizeEmail,
  nullableText,
  parseBody,
} from "../lib/validation";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  if (!(await allowSubmission({ route: "contact", req, res, limit: 10, windowMs: 60 * 60 * 1000 }))) return;

  const body = parseBody(SendContactMessageBody, req.body, res);
  if (!body) return;

  if (isBot(body, "contact")) {
    res.status(201).json({ id: 0 });
    return;
  }

  const [row] = await db
    .insert(contactMessagesTable)
    .values({
      name: body.name.trim(),
      email: normalizeEmail(body.email),
      subject: nullableText(body.subject),
      message: body.message.trim(),
    })
    .returning({ id: contactMessagesTable.id });

  void notifyEnquiry({
    kind: "Contact message",
    fields: [
      ["Name", body.name.trim()],
      ["Email", normalizeEmail(body.email)],
      ["Subject", body.subject?.trim() || "—"],
      ["Message", body.message.trim()],
    ],
  });

  res.status(201).json(SendContactMessageResponse.parse(row));
});

export default router;
