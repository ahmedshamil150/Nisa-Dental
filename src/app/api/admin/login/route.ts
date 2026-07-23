import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { scryptSync } from "crypto"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: user, error } = await supabase
      .from("admin_users")
      .select("password_hash")
      .eq("username", username)
      .single()

    if (error || !user) {
      console.error("Login user lookup error:", error?.message || "user not found")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const [salt, storedHash] = user.password_hash.split(":")
    if (!salt || !storedHash) {
      console.error("Invalid password_hash format for user:", username)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const hash = scryptSync(password, salt, 64).toString("hex")
    const valid = hash === storedHash

    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_session", "authenticated", {
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
