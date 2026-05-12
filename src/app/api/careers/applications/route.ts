import { NextResponse } from "next/server";
import {
  APPLICATION_STATUSES,
  CAREER_APPLICATIONS_COLLECTION,
  normalizeCareerApplication,
} from "@/lib/careerApplications";
import {
  addFirestoreDocument,
  getFirestoreDocument,
  listFirestoreDocuments,
  patchFirestoreDocument,
} from "@/lib/firestoreRest";

export async function GET() {
  try {
    const documents = await listFirestoreDocuments(CAREER_APPLICATIONS_COLLECTION, {
      pageSize: 200,
      orderBy: "createdAt desc",
    });
    const applications = documents.map((item) =>
      normalizeCareerApplication(item.id, item.data)
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

    const application = {
      fullName: safeFullName,
      email: safeEmail,
      phone: String(phone || "").trim(),
      resumeLink: safeResumeLink,
      coverLetter: String(coverLetter || "").trim(),
      positionId: String(positionId || "").trim(),
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const id = await addFirestoreDocument(CAREER_APPLICATIONS_COLLECTION, application);
    return NextResponse.json({ success: true, id }, { status: 200 });
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

    const applicationPath = `${CAREER_APPLICATIONS_COLLECTION}/${id}`;
    const existing = await getFirestoreDocument(applicationPath);
    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    await patchFirestoreDocument(applicationPath, {
      status,
      updatedAt: new Date().toISOString(),
    });
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
