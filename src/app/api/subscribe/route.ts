import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const getRedis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || "").toString().trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const client = getRedis();
    if (client) {
      await client.sadd("site:subscribers", email);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true, local: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Subscribe failed", details: message }, { status: 500 });
  }
}
