/**
 * A small in-memory sliding-window limiter.
 *
 * The reflection endpoint calls a paid model on behalf of anonymous visitors,
 * so it needs a ceiling or one script can run up the ministry's bill. This is
 * per-process and resets on restart — fine for a single instance, and the
 * right place to swap in a shared store if the site is ever scaled out.
 */
export interface RateLimit {
  check: (key: string) => { allowed: boolean; retryAfterSeconds: number };
}

export function createRateLimit({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}): RateLimit {
  const hits = new Map<string, number[]>();

  return {
    check(key) {
      const now = Date.now();
      const cutoff = now - windowMs;

      // Drop whole keys that have gone quiet so the map cannot grow forever.
      for (const [existingKey, times] of hits) {
        const live = times.filter((time) => time > cutoff);
        if (live.length === 0) {
          hits.delete(existingKey);
        } else {
          hits.set(existingKey, live);
        }
      }

      const recent = hits.get(key) ?? [];
      if (recent.length >= limit) {
        const oldest = recent[0];
        return {
          allowed: false,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((oldest + windowMs - now) / 1000),
          ),
        };
      }

      recent.push(now);
      hits.set(key, recent);
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}
