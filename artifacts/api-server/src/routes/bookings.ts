import { Router, type IRouter } from "express";
import { CreateBookingBody, CreateBookingResponse } from "@workspace/api-zod";
import { bookingsTable, db } from "@workspace/db";
import {
  normalizeEmail,
  nullableText,
  parseBody,
} from "../lib/validation";

const router: IRouter = Router();

router.post("/bookings", async (req, res) => {
  const body = parseBody(CreateBookingBody, req.body, res);
  if (!body) return;

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

  res.status(201).json(CreateBookingResponse.parse(row));
});

export default router;
