import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { DEFAULT_CONFIG } from "@/lib/defaultConfig";

const redis = Redis.fromEnv();
const KEY = "site:config";

export async function GET() {
  try {
    const data = await redis.get<Record<string, unknown>>(KEY);
    return NextResponse.json(data || DEFAULT_CONFIG, { status: 200 });
  } catch {
    return NextResponse.json(DEFAULT_CONFIG, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const incoming = await req.json();
    const current = (await redis.get<Record<string, unknown>>(KEY)) || {};
    const merged = { ...DEFAULT_CONFIG, ...current, ...incoming };
    await redis.set(KEY, merged);
    return NextResponse.json(merged, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Config update failed:", e);
    return NextResponse.json(
      { error: "Config update failed", details: message },
      { status: 500 }
    );
  }
}
