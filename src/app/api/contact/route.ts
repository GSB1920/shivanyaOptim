import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName = "",
      lastName = "",
      email = "",
      specialist = "",
      date = "",
      time = "",
    } = body || {};

    if (!email || !firstName) {
      return NextResponse.json({ error: "First name and email are required" }, { status: 400 });
    }

    const submission = {
      firstName,
      lastName,
      email,
      specialist,
      date,
      time,
      createdAt: new Date().toISOString(),
    };

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    const isProd = process.env.NODE_ENV === "production";

    if (url && token) {
      const redis = new Redis({ url, token });
      await redis.lpush("contact:submissions", JSON.stringify(submission));
      return NextResponse.json({ success: true });
    }

    if (isProd) {
      console.warn("Missing Upstash Redis configuration for /api/contact");
      return NextResponse.json(
        { error: "Database is not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, local: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 });
  }
}
