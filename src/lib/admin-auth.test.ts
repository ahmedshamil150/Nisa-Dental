import { describe, it, expect, beforeAll } from "vitest"
import { requireAdmin } from "./admin-auth"
import { signSession } from "./session"

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-that-is-exactly-32-bytes!"
})

function mockRequest(cookie?: string): Request {
  const headers: Record<string, string> = {}
  if (cookie) headers["cookie"] = cookie
  return new Request("http://localhost", { headers })
}

describe("requireAdmin", () => {
  it("returns 401 when no cookie is present", async () => {
    const res = await requireAdmin(mockRequest())
    expect(res).not.toBeNull()
    expect(res!.status).toBe(401)
  })

  it("returns 401 when cookie has an invalid value", async () => {
    const res = await requireAdmin(mockRequest("admin_session=garbage"))
    expect(res).not.toBeNull()
    expect(res!.status).toBe(401)
  })

  it("returns null when session is valid", async () => {
    const token = await signSession()
    const res = await requireAdmin(mockRequest(`admin_session=${token}`))
    expect(res).toBeNull()
  })
})
