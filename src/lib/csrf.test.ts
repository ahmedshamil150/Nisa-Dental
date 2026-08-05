import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { csrfGuard } from "./csrf"

describe("csrfGuard", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://nisadental.com"
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("allows requests with no origin or referer header", () => {
    const req = new Request("https://nisadental.com/api/checkout", { method: "POST" })
    expect(csrfGuard(req)).toBeNull()
  })

  it("allows same-origin requests via Host header", () => {
    const req = new Request("https://nisadental.com/api/checkout", {
      method: "POST",
      headers: { origin: "https://nisadental.com", host: "nisadental.com" },
    })
    expect(csrfGuard(req)).toBeNull()
  })

  it("allows requests from the configured site URL", () => {
    const req = new Request("https://nisadental.com/api/checkout", {
      method: "POST",
      headers: { origin: "https://nisadental.com" },
    })
    expect(csrfGuard(req)).toBeNull()
  })

  it("blocks cross-origin requests", () => {
    const req = new Request("https://nisadental.com/api/checkout", {
      method: "POST",
      headers: { origin: "https://evil.com", host: "nisadental.com" },
    })
    const res = csrfGuard(req)
    expect(res).not.toBeNull()
    expect(res!.status).toBe(403)
  })

  it("allows localhost in development", () => {
    vi.stubEnv("NODE_ENV", "development")
    const req = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { origin: "http://localhost:3000", host: "localhost:3000" },
    })
    expect(csrfGuard(req)).toBeNull()
  })
})
