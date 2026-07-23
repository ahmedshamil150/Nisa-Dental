import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { scryptSync, timingSafeEqual } from "crypto"

export async function POST(request: Request) {
  const { username, password } = await request.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: user } = await supabase
    .from("admin_users")
    .select("password_hash")
    .eq("username", username)
    .single()

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const [salt, storedHash] = user.password_hash.split(":")
  const hash = scryptSync(password, salt, 64).toString("hex")
  const valid = timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash))

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
}
