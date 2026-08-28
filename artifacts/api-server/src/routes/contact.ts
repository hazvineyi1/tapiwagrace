import { Router, type IRouter } from "express";
import {
  SendContactMessageBody,
  SendContactMessageResponse,
} from "@workspace/api-zod";
import { contactMessagesTable, db } from "@workspace/db";
import {
  normalizeEmail,
  nullableText,
  parseBody,
} from "../lib/validation";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const body = parseBody(SendContactMessageBody, req.body, res);
  if (!body) return;

  const [row] = await db
    .insert(contactMessagesTable)
    .values({
      name: body.name.trim(),
      email: normalizeEmail(body.email),
      subject: nullableText(body.subject),
      message: body.message.trim(),
    })
    .returning({ id: contactMessagesTable.id });

  res.status(201).json(SendContactMessageResponse.parse(row));
});

export default router;
