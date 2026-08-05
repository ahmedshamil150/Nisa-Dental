const SESSION_TTL = 24 * 60 * 60 * 1000
const encoder = new TextEncoder()

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (secret) return secret
  const derived = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  if (!derived) throw new Error("No session secret or Supabase key configured")
  return `derived:${derived}`
}

function hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function hmacSign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  return hex(sig)
}

export async function signSession(): Promise<string> {
  const payload = String(Date.now())
  const signature = await hmacSign(payload)
  return `${payload}.${signature}`
}

export async function verifySession(token: string): Promise<boolean> {
  const parts = token.split(".")
  if (parts.length !== 2) return false

  const [timestamp, signature] = parts
  const age = Date.now() - Number(timestamp)
  if (isNaN(age) || age > SESSION_TTL || age < 0) return false

  const expected = await hmacSign(timestamp)

  if (signature.length !== expected.length) return false
  return constantTimeEqual(signature, expected)
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
