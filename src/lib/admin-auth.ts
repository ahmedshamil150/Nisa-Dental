import { NextResponse } from "next/server"
import { verifySession } from "@/lib/session"

export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=")
      return [k, v.join("=")]
    })
  )

  const token = cookies["admin_session"]
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}
