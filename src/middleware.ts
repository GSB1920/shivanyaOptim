import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const hasEnv =
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN;
  const isProd = process.env.NODE_ENV === "production";
  const pathname = req.nextUrl.pathname;
  const isApi = pathname.startsWith("/api/");
  const isStatic =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/favicon") ||
    pathname === "/_not-found";
  if (isApi || isStatic) return NextResponse.next();
  if (!isProd || !hasEnv) return NextResponse.next();
  try {
    const res = await fetch(new URL("/api/health", req.url), {
      cache: "no-store",
    });
    if (!res.ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/_not-found";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/_not-found";
    return NextResponse.rewrite(url);
  }
}
