import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getServiceSupabase } from "@/lib/supabase"
import { scryptSync } from "crypto"
import { signSession } from "@/lib/session"
import { csrfGuard } from "@/lib/csrf"
import {
  checkRateLimit,
  recordRateLimitFailure,
  resetRateLimit,
} from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const rl = checkRateLimit(request)
    if (rl) return rl

    const csrf = csrfGuard(request)
    if (csrf) return csrf

    let username: string
    let password: string
    try {
      const body = await request.json()
      username = typeof body?.username === "string" ? body.username.trim() : ""
      password = typeof body?.password === "string" ? body.password : ""
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    if (!username || !password) {
      recordRateLimitFailure(request)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const supabase = getServiceSupabase()
    if (!supabase) {
      console.error("Login: Supabase server configuration missing")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const { data: user, error } = await supabase
      .from("admin_users")
      .select("password_hash")
      .eq("username", username)
      .single()

    if (error || !user) {
      recordRateLimitFailure(request)
      console.error("Login user lookup error:", error?.message || "user not found")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const [salt, storedHash] = user.password_hash.split(":")
    if (!salt || !storedHash) {
      recordRateLimitFailure(request)
      console.error("Invalid password_hash format for user:", username)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const hash = scryptSync(password, salt, 64).toString("hex")
    const valid = hash === storedHash

    if (!valid) {
      recordRateLimitFailure(request)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    resetRateLimit(request)

    const cookieStore = await cookies()
    cookieStore.set("admin_session", await signSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
}
