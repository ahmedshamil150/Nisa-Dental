import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const ext = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const bucket = "product-images"

    let { error } = await supabase.storage.from(bucket).upload(fileName, file, {
      contentType: file.type,
      cacheControl: "3600",
    })

    if (error?.message?.includes("bucket") || error?.message?.includes("not found")) {
      const { error: createErr } = await supabase.storage.createBucket(bucket, { public: true })
      if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 })
      const { error: retryErr } = await supabase.storage.from(bucket).upload(fileName, file, {
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
