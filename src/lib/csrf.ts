import { NextResponse } from "next/server"

function selfOrigin(request: Request): string | null {
  const host = request.headers.get("host")
  if (!host) return null
  const proto = request.headers.get("x-forwarded-proto") || "http"
  return `${proto}://${host}`
}

export function csrfGuard(request: Request): NextResponse | null {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")
  const source = origin || (referer ? new URL(referer).origin : null)

  // No Origin/Referer sent — allow (curl, health checks, etc.)
  // Browsers always send Origin on cross-origin & same-origin POSTs.
  if (!source) return null

  // Same-origin: source matches the Host header
  const hostOrigin = selfOrigin(request)
  if (hostOrigin && source === hostOrigin) return null

  // Explicitly configured site URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (siteUrl && source === siteUrl.replace(/\/$/, "")) return null

  // Localhost in development
  if (process.env.NODE_ENV === "development" && source === "http://localhost:3000") return null

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
