import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || "").toString().trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { error } = await supabase.from("subscribers").insert({ email });
    if (error && error.code !== "23505") throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Subscribe failed";
    console.error("Subscribe failed:", error);
    return NextResponse.json({ error: "Subscribe failed", details: message }, { status: 500 });
  }
}
