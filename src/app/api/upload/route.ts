import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"
import { requireAdmin } from "@/lib/admin-auth"
import { csrfGuard } from "@/lib/csrf"

const ALLOWED_MIMES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const MAX_SIZE = 5 * 1024 * 1024

const MAGIC_BYTES: Record<string, Uint8Array[]> = {
  "image/jpeg": [new Uint8Array([0xFF, 0xD8, 0xFF])],
  "image/png": [new Uint8Array([0x89, 0x50, 0x4E, 0x47])],
  "image/gif": [new Uint8Array([0x47, 0x49, 0x46, 0x38])],
  "image/webp": [new Uint8Array([0x52, 0x49, 0x46, 0x46])],
}

function checkMagicBytes(buffer: ArrayBuffer, mime: string): boolean {
  const signatures = MAGIC_BYTES[mime]
  if (!signatures) return false
  const header = new Uint8Array(buffer, 0, 12)
  return signatures.some((sig) =>
    sig.every((byte, i) => byte === header[i])
  )
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const csrf = csrfGuard(req)
  if (csrf) return csrf

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    if (!ALLOWED_MIMES.has(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed" }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    if (!checkMagicBytes(buffer, file.type)) {
      return NextResponse.json({ error: "File content does not match its type" }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const ext = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const bucket = "product-images"

    const blob = new Blob([buffer], { type: file.type })
    let { error } = await supabase.storage.from(bucket).upload(fileName, blob, {
      contentType: file.type,
      cacheControl: "3600",
    })

    if (error?.message?.includes("bucket") || error?.message?.includes("not found")) {
      const { error: createErr } = await supabase.storage.createBucket(bucket, { public: true })
      if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 })
      const { error: retryErr } = await supabase.storage.from(bucket).upload(fileName, blob, {
        contentType: file.type,
        cacheControl: "3600",
      })
      if (retryErr) return NextResponse.json({ error: retryErr.message }, { status: 500 })
    } else if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
