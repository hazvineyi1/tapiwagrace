import { Router, type IRouter } from "express";
import { CreateBookingBody, CreateBookingResponse } from "@workspace/api-zod";
import { bookingsTable, db } from "@workspace/db";
import { allowSubmission, isBot } from "../lib/guard";
import { notifyEnquiry } from "../lib/mailer";
import {
  normalizeEmail,
  nullableText,
  parseBody,
} from "../lib/validation";

const KIND_LABEL: Record<string, string> = {
  retreat: "Retreat booking",
  conversation: "Conversation booking",
  meal: "Meal programme enquiry",
};

const router: IRouter = Router();

router.post("/bookings", async (req, res) => {
  if (!(await allowSubmission({ route: "bookings", req, res, limit: 10, windowMs: 60 * 60 * 1000 }))) return;

  const body = parseBody(CreateBookingBody, req.body, res);
  if (!body) return;

  if (isBot(body, "bookings")) {
    res.status(201).json({ id: 0, kind: body.kind, status: "new" });
    return;
  }

  const [row] = await db
    .insert(bookingsTable)
    .values({
      kind: body.kind,
      name: body.name.trim(),
      email: normalizeEmail(body.email),
      preferredDate: nullableText(body.preferredDate),
      preferredTime: nullableText(body.preferredTime),
      message: nullableText(body.message),
    })
    .returning({
      id: bookingsTable.id,
      kind: bookingsTable.kind,
      status: bookingsTable.status,
    });

  // Fire and forget: the row is already saved, and notifyEnquiry never rejects.
  void notifyEnquiry({
    kind: KIND_LABEL[body.kind] ?? "Booking",
    fields: [
      ["Name", body.name.trim()],
      ["Email", normalizeEmail(body.email)],
      ["Preferred date", body.preferredDate ?? "Flexible"],
      ["Preferred time", body.preferredTime ?? "Not given"],
      ["Message", body.message?.trim() || "Not given"],
    ],
  });

  res.status(201).json(CreateBookingResponse.parse(row));
});

export default router;
