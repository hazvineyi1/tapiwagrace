import fs from "node:fs";
import path from "node:path";
import express, { type Express, type Response } from "express";
import { logger } from "./logger";

/**
 * Where the built site lives relative to this bundle. The API is bundled to
 * artifacts/api-server/dist/index.mjs, and the site builds to
 * artifacts/thirty-one-rooted/dist/public, so it is two levels up and across.
 * WEB_ROOT overrides it if the layout ever changes.
 */
function resolveWebRoot(): string {
  const override = process.env["WEB_ROOT"];
  if (override) return path.resolve(override);
  return path.resolve(__dirname, "..", "..", "thirty-one-rooted", "dist", "public");
}

/**
 * The whole policy for the site, in one place.
 *
 * Everything the page needs is same-origin: the bundle, the stylesheet, the
 * self-hosted fonts, the films, and this API under /api. `data:` covers the few
 * images Vite inlines. frame-ancestors is the one that has to be a real header
 * -- it is ignored inside a meta tag -- which is why this moved out of the
 * document and into the server.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

function setSiteHeaders(res: Response): void {
  res.setHeader("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  if (process.env["NODE_ENV"] === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
}

/**
 * Serves the built site from this same process, so the page and the API share
 * an origin: no CORS, one deployment, one certificate, and response headers we
 * actually control.
 *
 * Call after the /api routes are mounted. Does nothing if the site has not been
 * built, which keeps the API usable on its own.
 */
export function mountSite(app: Express): void {
  const webRoot = resolveWebRoot();
  const indexFile = path.join(webRoot, "index.html");

  if (!fs.existsSync(indexFile)) {
    logger.warn(
      { webRoot },
      "No built site found; serving the API only. Run the web build first.",
    );
    return;
  }

  app.use(
    express.static(webRoot, {
      // index.html is written by hand and always revalidated; the SPA fallback
      // below serves it.
      index: false,
      setHeaders(res, filePath) {
        setSiteHeaders(res);
        // Vite fingerprints everything under /assets, so those URLs can never
        // go stale. The fonts, films and og image keep stable names, so they
        // get a day rather than a year.
        res.setHeader(
          "Cache-Control",
          filePath.includes(`${path.sep}assets${path.sep}`)
            ? "public, max-age=31536000, immutable"
            : "public, max-age=86400",
        );
      },
    }),
  );

  // Client-side routing: /retreats and friends are not files on disk.
  // Registered with `use` rather than `get` because Express 5 no longer routes
  // HEAD to a GET handler, and crawlers and uptime checks do send HEAD.
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    setSiteHeaders(res);
    // Never cache the shell, or a deploy leaves people on the old bundle.
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(indexFile);
  });

  logger.info({ webRoot }, "Serving the built site");
}
