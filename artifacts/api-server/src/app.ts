import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Behind the platform router. Without this every request looks like it came
// from the proxy, so the rate limiter would throttle all visitors as one.
// `1` trusts only the last hop, so X-Forwarded-For cannot be spoofed past it.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// The site is served from the same origin as this API, so cross-origin
// access is only needed for local development against a separate dev server.
// Anything else is another site posting to these forms.
const allowedOrigins = (
  process.env["ALLOWED_ORIGINS"] ??
  "https://www.tapiwanashegrace.com,https://tapiwanashegrace.com"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header: same-origin, curl, or a health check.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (process.env["NODE_ENV"] !== "production" && /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
  }),
);

// Every payload here is a short form. Cap it well below the 100kb default.
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));

app.use("/api", router);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Express 5 forwards rejected async handlers here. Keep internals off the
// wire: the detail goes to the log, the client gets a bare 500.
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  req.log.error({ err }, "Unhandled error");
  if (res.headersSent) {
    return;
  }
  res.status(500).json({ error: "Internal server error" });
});

export default app;
