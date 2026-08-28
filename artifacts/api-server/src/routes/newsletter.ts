import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  SubscribeToNewsletterBody,
  SubscribeToNewsletterResponse,
} from "@workspace/api-zod";
import { db, newsletterSubscribersTable } from "@workspace/db";
import { notifyEnquiry } from "../lib/mailer";
import { normalizeEmail, parseBody } from "../lib/validation";

const router: IRouter = Router();

router.post("/newsletter", async (req, res) => {
  const body = parseBody(SubscribeToNewsletterBody, req.body, res);
  if (!body) return;

  const email = normalizeEmail(body.email);

  // onConflictDoNothing keeps a repeat sign-up idempotent even under a race,
  // rather than surfacing a unique-violation as a 500.
  const inserted = await db
    .insert(newsletterSubscribersTable)
    .values({ email })
    .onConflictDoNothing({ target: newsletterSubscribersTable.email })
    .returning({ id: newsletterSubscribersTable.id });

  if (inserted.length > 0) {
    // Only for a genuinely new subscriber; repeats stay quiet.
    void notifyEnquiry({
      kind: "Newsletter sign-up",
      fields: [["Email", email]],
    });
    res.status(201).json(
      SubscribeToNewsletterResponse.parse({
        id: inserted[0].id,
        alreadySubscribed: false,
      }),
    );
    return;
  }

  const [existing] = await db
    .select({ id: newsletterSubscribersTable.id })
    .from(newsletterSubscribersTable)
    .where(eq(newsletterSubscribersTable.email, email))
    .limit(1);

  if (!existing) {
    // The conflicting row disappeared between the insert and the read.
    throw new Error(`Newsletter subscriber vanished for ${email}`);
  }

  res.status(201).json(
    SubscribeToNewsletterResponse.parse({
      id: existing.id,
      alreadySubscribed: true,
    }),
  );
});

export default router;
