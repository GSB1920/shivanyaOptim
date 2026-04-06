import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { DEFAULT_CONFIG } from "@/lib/defaultConfig";

const KEY = "site:config";
const hasRedisEnv = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);
const redis = hasRedisEnv ? Redis.fromEnv() : null;
let fallbackConfig: Record<string, unknown> | null = null;

export async function GET() {
  if (!redis) {
    return NextResponse.json(fallbackConfig || DEFAULT_CONFIG, { status: 200 });
  }
  try {
    const data = await redis.get<Record<string, unknown>>(KEY);
    return NextResponse.json(data || fallbackConfig || DEFAULT_CONFIG, { status: 200 });
  } catch {
    return NextResponse.json(fallbackConfig || DEFAULT_CONFIG, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const contentLengthRaw = req.headers.get("content-length");
  const contentLength = contentLengthRaw ? Number(contentLengthRaw) : undefined;
  if (typeof contentLength === "number" && Number.isFinite(contentLength) && contentLength > 2_000_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let incoming: Record<string, unknown>;
  try {
    incoming = (await req.json()) as Record<string, unknown>;
  } catch (e) {
    const isInvalidJson =
      e instanceof SyntaxError ||
      (e instanceof Error && /json/i.test(e.message));
    if (isInvalidJson) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
    return NextResponse.json({ error: "Config update failed" }, { status: 500 });
  }

  const mergedWithoutRedis = { ...DEFAULT_CONFIG, ...(fallbackConfig || {}), ...incoming };
  if (!redis) {
    fallbackConfig = mergedWithoutRedis;
    return NextResponse.json(mergedWithoutRedis, { status: 200 });
  }

  try {
    const current = (await redis.get<Record<string, unknown>>(KEY)) || {};
    const merged = { ...DEFAULT_CONFIG, ...current, ...incoming };
    await redis.set(KEY, merged);
    fallbackConfig = merged;
    return NextResponse.json(merged, { status: 200 });
  } catch {
    fallbackConfig = mergedWithoutRedis;
    return NextResponse.json(mergedWithoutRedis, { status: 200 });
  }
}
