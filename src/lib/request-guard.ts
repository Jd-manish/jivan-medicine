import { NextRequest, NextResponse } from "next/server";

type Bucket = { count: number; resetsAt: number };

type GuardGlobal = typeof globalThis & {
  __jivanRateBuckets?: Map<string, Bucket>;
};

const globalForGuard = globalThis as GuardGlobal;
const buckets = globalForGuard.__jivanRateBuckets ?? new Map<string, Bucket>();

if (process.env.NODE_ENV !== "production") {
  globalForGuard.__jivanRateBuckets = buckets;
}

function visitorKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}

/**
 * Small per-instance throttle for abuse bursts. This has zero external
 * dependency and protects each running instance. A deployment behind a WAF
 * should additionally configure an edge-level rate rule.
 */
export function rateLimit(
  request: NextRequest,
  scope: string,
  maxRequests = 6,
  windowMs = 10 * 60 * 1000,
): NextResponse | null {
  const now = Date.now();
  const key = `${scope}:${visitorKey(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetsAt <= now) {
    buckets.set(key, { count: 1, resetsAt: now + windowMs });
    return null;
  }

  if (current.count >= maxRequests) {
    const retryAfter = Math.max(1, Math.ceil((current.resetsAt - now) / 1000));
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  current.count += 1;
  return null;
}

/** Hidden honeypot fields should always stay empty for human visitors. */
export function isHoneypotFilled(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

/** Reject unexpectedly large payloads before JSON parsing. */
export function rejectLargeBody(request: NextRequest, maxBytes = 16_384): NextResponse | null {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > maxBytes) {
    return NextResponse.json({ ok: false, message: "Request is too large." }, { status: 413 });
  }
  return null;
}
