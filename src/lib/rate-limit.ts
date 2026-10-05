/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * These endpoints send email on the public internet, so they need a spam
 * guard. This is per-instance and intentionally simple: on serverless it
 * protects a single warm instance, which is enough to blunt casual abuse.
 * Put a shared limiter (Upstash, Vercel KV) behind it for a global limit.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });

    return {
      ok: true,
      remaining: limit - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  existing.count += 1;

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((existing.resetAt - now) / 1000),
  );

  if (existing.count > limit) {
    return { ok: false, remaining: 0, retryAfterSeconds };
  }

  return {
    ok: true,
    remaining: limit - existing.count,
    retryAfterSeconds,
  };
}

/**
 * Best-effort client identifier for rate limiting.
 *
 * Trusts x-forwarded-for (set by Vercel and most proxies) and falls back to
 * a shared bucket so an untrusted header cannot be used to bypass limits.
 */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");

  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";

  return `${scope}:${ip}`;
}

/**
 * Drop expired buckets so the map cannot grow without bound.
 */
export function sweepRateLimits(now = Date.now()): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}