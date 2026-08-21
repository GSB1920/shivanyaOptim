import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

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

    const { error } = await supabase.from("contact_submissions").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      specialist,
      date,
      time,
    });
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit contact form";
    console.error("Failed to submit contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form", details: message },
      { status: 500 }
    );
  }
}
