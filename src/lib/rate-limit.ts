import { NextResponse } from "next/server"

type RateLimitEntry = {
  failures: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const DEFAULTS = {
  maxFailures: 5,
  windowMs: 15 * 60 * 1000,
}

function getKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || "unknown"
}

// Returns a 429 response if the client has too many FAILED attempts.
export function checkRateLimit(request: Request): NextResponse | null {
  const key = getKey(request)
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() > entry.resetAt) {
    store.delete(key)
    return null
  }
  if (entry.failures >= DEFAULTS.maxFailures) {
    const retryAfter = Math.ceil((entry.resetAt - Date.now()) / 1000)
    return NextResponse.json(
      { error: "Too many failed attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    )
  }
  return null
}

// Record a failed attempt (only called when credentials are wrong).
export function recordRateLimitFailure(request: Request): void {
  const key = getKey(request)
  const now = Date.now()
  const entry = store.get(key)
  if (!entry || now > entry.resetAt) {
    store.set(key, { failures: 1, resetAt: now + DEFAULTS.windowMs })
    return
  }
  entry.failures++
}

// Clear the counter after a successful login.
export function resetRateLimit(request: Request): void {
  const key = getKey(request)
  store.delete(key)
}

/*
 * Production note:
 * The in-memory Map resets on restart and doesn't work across serverless
 * instances. For production on Vercel, replace with Vercel KV:
 *
 *   import { kv } from "@vercel/kv"
 *   const key = `rl:${ip}`
 *
 *   checkRateLimit: const f = await kv.get(key); return f >= 5 ? 429 : null
 *   recordRateLimitFailure: incr + expire(key, 900)
 *   resetRateLimit: del(key)
 */
