jest.mock("@upstash/redis", () => ({
  __esModule: true,
  Redis: {
    fromEnv: () => ({
      get: async () => null,
      set: async () => null,
    }),
  },
}));

import { POST } from "@/app/api/config/route";

describe("/api/config", () => {
  it("returns 400 for invalid JSON payload", async () => {
    const req = new Request("http://localhost/api/config", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"companyName": "Test"',
    });

    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  it("returns 413 for oversized payload", async () => {
    const req = new Request("http://localhost/api/config", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": String(2_000_001),
      },
      body: "{}",
    });

    const res = await POST(req as any);
    expect(res.status).toBe(413);
  });
});
