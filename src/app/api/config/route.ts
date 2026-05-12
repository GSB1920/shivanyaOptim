import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CONFIG } from "@/lib/defaultConfig";
import { getFirestoreDocument, setFirestoreDocument } from "@/lib/firestoreRest";

const CONFIG_COLLECTION = "siteConfig";
const CONFIG_DOCUMENT = "current";
const CONFIG_PATH = `${CONFIG_COLLECTION}/${CONFIG_DOCUMENT}`;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getFirestoreDocument(CONFIG_PATH);
    return NextResponse.json({ ...DEFAULT_CONFIG, ...(data || {}) }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Config fetch failed";
    console.error("Config fetch failed:", error);
    return NextResponse.json({ error: "Config fetch failed", details: message }, { status: 500 });
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

  try {
    const current = (await getFirestoreDocument(CONFIG_PATH)) || {};
    const merged = { ...DEFAULT_CONFIG, ...current, ...incoming };
    const saved = await setFirestoreDocument(CONFIG_PATH, merged);
    return NextResponse.json({ ...DEFAULT_CONFIG, ...saved }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Config update failed";
    console.error("Config update failed:", error);
    return NextResponse.json({ error: "Config update failed", details: message }, { status: 500 });
  }
}
