import { NextResponse } from "next/server"

function getAllowedOrigins(): string[] {
  const origins: string[] = []
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (siteUrl) origins.push(siteUrl.replace(/\/$/, ""))
  if (process.env.NODE_ENV === "development") origins.push("http://localhost:3000")
  return origins
}

export function csrfGuard(request: Request): NextResponse | null {
  const allowed = getAllowedOrigins()
  if (allowed.length === 0) return null

  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")

  const source = origin || (referer ? new URL(referer).origin : null)

  if (!source) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (!allowed.includes(source)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return null
}
