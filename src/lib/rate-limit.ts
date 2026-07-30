import { NextResponse } from "next/server"

type RateLimitEntry = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

type RateLimitConfig = {
  maxAttempts: number
  windowMs: number
}

const DEFAULTS: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
}

function getKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || "unknown"
}

export function checkRateLimit(request: Request, config?: Partial<RateLimitConfig>): NextResponse | null {
  const { maxAttempts, windowMs } = { ...DEFAULTS, ...config }
  const key = getKey(request)
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  if (entry.count >= maxAttempts) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    )
  }

  entry.count++
  return null
}

/*
 * Production note:
 * The in-memory Map resets on server restart and doesn't work across
 * serverless instances. For production on Vercel, replace with Vercel KV:
 *
 *   import { kv } from "@vercel/kv"
 *
 *   export async function checkRateLimit(request: Request): Promise<Response | null> {
 *     const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
 *     const key = `rl:${ip}:login`
 *     const current = await kv.get<number>(key) ?? 0
 *     if (current >= 5) return NextResponse.json({ error: "...", status: 429 })
 *     await kv.incr(key)
 *     await kv.expire(key, 900)
 *     return null
 *   }
 */
