import { describe, it, expect, beforeEach } from "vitest"
import { csrfGuard } from "./csrf"

describe("csrfGuard", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://nisadental.com"
  })

  it("returns 403 when no origin or referer header", () => {
    const req = new Request("https://nisadental.com/api/checkout", { method: "POST" })
    const res = csrfGuard(req)
    expect(res).not.toBeNull()
    expect(res!.status).toBe(403)
  })

  it("falls back to referer when origin is missing", () => {
    const req = new Request("https://nisadental.com/api/checkout", {
      method: "POST",
      headers: { referer: "https://nisadental.com/checkout" },
    })
    const res = csrfGuard(req)
    expect(res).toBeNull()
  })

  it("returns null when origin matches allowed origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://nisadental.com"
    const req = new Request("https://nisadental.com/api/checkout", {
      method: "POST",
      headers: { origin: "https://nisadental.com" },
    })
    const res = csrfGuard(req)
    expect(res).toBeNull()
  })

  it("returns 403 when origin does not match", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://nisadental.com"
    const req = new Request("https://nisadental.com/api/checkout", {
      method: "POST",
      headers: { origin: "https://evil.com" },
    })
    const res = csrfGuard(req)
    expect(res).not.toBeNull()
    expect(res!.status).toBe(403)
  })

  it("returns null for localhost in development", () => {
    process.env.NODE_ENV = "development"
    const req = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    })
    const res = csrfGuard(req)
    expect(res).toBeNull()
  })
})
