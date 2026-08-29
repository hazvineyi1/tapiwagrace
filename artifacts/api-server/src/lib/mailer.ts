import nodemailer, { type Transporter } from "nodemailer";

import { logger } from "./logger";

/**
 * Sends the founder a note whenever an enquiry arrives.
 *
 * Provider-agnostic SMTP, so this works with Gmail (an app password), or with
 * Resend / Postmark / Mailgun by pointing the same variables at their SMTP
 * endpoint. Unconfigured, it logs and does nothing — an enquiry is already
 * safely stored before we ever get here, so mail must never fail a request.
 */
const HOST = () => process.env["SMTP_HOST"];
const TO = () => process.env["ENQUIRY_TO"];

export function isMailConfigured(): boolean {
  return Boolean(HOST() && TO());
}

let cached: Transporter | null = null;

function transport(): Transporter {
  if (!cached) {
    const port = Number(process.env["SMTP_PORT"] ?? 587);
    cached = nodemailer.createTransport({
      host: HOST(),
      port,
      // 465 is implicit TLS; 587 upgrades with STARTTLS.
      secure: process.env["SMTP_SECURE"] === "true" || port === 465,
      auth: process.env["SMTP_USER"]
        ? {
            user: process.env["SMTP_USER"],
            pass: process.env["SMTP_PASS"] ?? "",
          }
        : undefined,
    });
  }
  return cached;
}

export interface Enquiry {
  /** Short label for the inbox, e.g. "Retreat booking". */
  kind: string;
  /** Ordered field name / value pairs shown in the body. */
  fields: [string, string][];
}

function textBody(enquiry: Enquiry): string {
  const width = Math.max(...enquiry.fields.map(([k]) => k.length));
  return [
    `A new ${enquiry.kind.toLowerCase()} came in through the 31 & Rooted site.`,
    "",
    ...enquiry.fields.map(([k, v]) => `${k.padEnd(width)}  ${v}`),
    "",
    "Reply straight to the sender's address above.",
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function htmlBody(enquiry: Enquiry): string {
  const rows = enquiry.fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6B645B;font:12px system-ui;text-transform:uppercase;letter-spacing:.12em;vertical-align:top">${escapeHtml(k)}</td>` +
        `<td style="padding:6px 0;color:#1C1A18;font:15px/1.6 system-ui;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  return `<div style="background:#F7F5F0;padding:28px;font-family:system-ui"><p style="color:#924026;font-size:12px;letter-spacing:.2em;text-transform:uppercase;margin:0 0 14px">31 &amp; Rooted</p><h1 style="font:400 22px Georgia,serif;color:#1C1A18;margin:0 0 20px">New ${escapeHtml(enquiry.kind.toLowerCase())}</h1><table style="border-collapse:collapse">${rows}</table></div>`;
}

/**
 * Never rejects: a failure here is logged, not surfaced. The enquiry row is
 * the record of truth; the email is a convenience on top of it.
 */
export async function notifyEnquiry(enquiry: Enquiry): Promise<void> {
  if (!isMailConfigured()) {
    logger.info(
      { kind: enquiry.kind },
      "Enquiry stored but not emailed: SMTP_HOST/ENQUIRY_TO not set",
    );
    return;
  }

  try {
    await transport().sendMail({
      to: TO(),
      from: process.env["ENQUIRY_FROM"] ?? TO(),
      // Replying in the mail client should reach the person who wrote in.
      replyTo: enquiry.fields.find(([k]) => k.toLowerCase() === "email")?.[1],
      subject: `31 & Rooted: new ${enquiry.kind.toLowerCase()}`,
      text: textBody(enquiry),
      html: htmlBody(enquiry),
    });
    logger.info({ kind: enquiry.kind }, "Enquiry notification sent");
  } catch (err) {
    logger.error({ err, kind: enquiry.kind }, "Could not send enquiry notification");
  }
}
