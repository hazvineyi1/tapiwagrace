import type { Response } from "express";
import type { z, ZodError, ZodType } from "zod";

/**
 * Shapes a Zod failure into the ValidationProblem the OpenAPI spec promises,
 * so clients get field-level detail instead of an opaque 400.
 */
function toProblem(error: ZodError): { error: string; details: string[] } {
  return {
    error: "Invalid request",
    details: error.issues.map((issue) => {
      const path = issue.path.join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    }),
  };
}

/**
 * Trims every top-level string in a JSON body. Applied before validation so a
 * pasted email with a stray space is accepted rather than 400'd, while
 * whitespace-only values still fail the schema's own minimum-length checks.
 */
function trimStringValues(body: unknown): unknown {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return body;
  }
  return Object.fromEntries(
    Object.entries(body as Record<string, unknown>).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  );
}

/**
 * Validates a request body. Returns the parsed value, or writes a 400 and
 * returns undefined — callers should `return` as soon as they get undefined.
 */
export function parseBody<TSchema extends ZodType>(
  schema: TSchema,
  body: unknown,
  res: Response,
): z.infer<TSchema> | undefined {
  const result = schema.safeParse(trimStringValues(body));
  if (!result.success) {
    res.status(400).json(toProblem(result.error));
    return undefined;
  }
  return result.data;
}

/** Trims a string and collapses an empty result to null for nullable columns. */
export function nullableText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Emails are stored lowercased so the newsletter unique index behaves. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}
