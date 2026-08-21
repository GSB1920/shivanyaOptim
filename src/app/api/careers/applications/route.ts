import { NextResponse } from "next/server";
import {
  APPLICATION_STATUSES,
  normalizeCareerApplication,
} from "@/lib/careerApplications";
import { supabase } from "@/lib/supabaseClient";
import { mirrorUrlToStorage } from "@/lib/mirrorUrlToStorage";

const TABLE = "career_applications";
const SELECT_COLUMNS =
  "id, fullName:full_name, email, phone, resumeLink:resume_link, resumeSourceLink:resume_source_link, coverLetter:cover_letter, positionId:position_id, status, createdAt:created_at, updatedAt:updated_at";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select(SELECT_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);

    const applications = (data || []).map((item) =>
      normalizeCareerApplication(item.id, item)
    );
    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch applications";
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications", details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName = "",
      email = "",
      phone = "",
      resumeLink = "",
      coverLetter = "",
      positionId = "",
    } = body || {};

    const safeFullName = String(fullName).trim();
    const safeEmail = String(email).trim();
    const safeResumeLink = String(resumeLink).trim();

    if (!safeFullName || !safeEmail || !safeResumeLink) {
      return NextResponse.json(
        { error: "Full name, email, and resume URL are required" },
        { status: 400 }
      );
    }

    const mirroredResumeUrl = await mirrorUrlToStorage(safeResumeLink, {
      bucket: "career-resumes",
      folder: "resumes",
    });

    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        full_name: safeFullName,
        email: safeEmail,
        phone: String(phone || "").trim(),
        resume_link: mirroredResumeUrl || safeResumeLink,
        resume_source_link: safeResumeLink,
        cover_letter: String(coverLetter || "").trim(),
        position_id: String(positionId || "").trim(),
        status: "new",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, id: data.id }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit application";
    console.error("Failed to submit application:", error);
    return NextResponse.json(
      { error: "Failed to submit application", details: message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body?.id || "");
    const status = String(body?.status || "");
    if (!id || !APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { data: existing, error: readError } = await supabase
      .from(TABLE)
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const { error: writeError } = await supabase
      .from(TABLE)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (writeError) throw new Error(writeError.message);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update application status";
    console.error("Failed to update application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status", details: message },
      { status: 500 }
    );
  }
}
