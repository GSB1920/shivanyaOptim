import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CONFIG } from "@/lib/defaultConfig";
import { supabase } from "@/lib/supabaseClient";

const CONFIG_ROW_ID = "current";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("data")
      .eq("id", CONFIG_ROW_ID)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return NextResponse.json({ ...DEFAULT_CONFIG, ...(data?.data || {}) }, { status: 200 });
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
    const { data: existing, error: readError } = await supabase
      .from("site_config")
      .select("data")
      .eq("id", CONFIG_ROW_ID)
      .maybeSingle();
    if (readError) throw new Error(readError.message);

    const merged = { ...DEFAULT_CONFIG, ...(existing?.data || {}), ...incoming };

    const { data: saved, error: writeError } = await supabase
      .from("site_config")
      .upsert({ id: CONFIG_ROW_ID, data: merged, updated_at: new Date().toISOString() })
      .select("data")
      .single();
    if (writeError) throw new Error(writeError.message);

    return NextResponse.json({ ...DEFAULT_CONFIG, ...saved.data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Config update failed";
    console.error("Config update failed:", error);
    return NextResponse.json({ error: "Config update failed", details: message }, { status: 500 });
  }
}
