import { describe, it, expect, beforeAll } from "vitest"
import { signSession, verifySession } from "./session"

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-that-is-exactly-32-bytes!"
})

describe("signSession / verifySession", () => {
  it("signs and verifies a valid token", async () => {
    const token = await signSession()
    expect(token).toContain(".")
    expect(await verifySession(token)).toBe(true)
  })

  it("rejects a tampered token", async () => {
    const token = await signSession()
    const [ts] = token.split(".")
    const fake = `${ts}.0000000000000000000000000000000000000000000000000000000000000000`
    expect(await verifySession(fake)).toBe(false)
  })

  it("rejects garbage input", async () => {
    expect(await verifySession("")).toBe(false)
    expect(await verifySession("not-a-valid-token")).toBe(false)
    expect(await verifySession("a.b.c")).toBe(false)
  })

  it("rejects expired tokens", async () => {
    const past = String(Date.now() - 25 * 60 * 60 * 1000)
    const token = await signSession()
    const [, sig] = token.split(".")
    const expired = `${past}.${sig}`
    expect(await verifySession(expired)).toBe(false)
  })
})
