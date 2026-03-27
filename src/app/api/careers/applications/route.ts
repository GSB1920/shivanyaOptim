import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

type CareerApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  resumeLink: string;
  coverLetter: string;
  positionId: string;
  status: "new" | "reviewed" | "rejected";
  createdAt: string;
  updatedAt: string;
};

const MEMORY_KEY = "__careers_applications__";
const REDIS_LEGACY_LIST_KEY = "careers:applications";
const REDIS_APPLICATION_IDS_KEY = "careers:applications:ids";
const REDIS_APPLICATION_DATA_KEY = "careers:applications:data";

function getMemoryStore() {
  const globalStore = globalThis as unknown as Record<string, CareerApplication[] | undefined>;
  if (!globalStore[MEMORY_KEY]) {
    globalStore[MEMORY_KEY] = [];
  }
  return globalStore[MEMORY_KEY] as CareerApplication[];
}

function normalizeApplication(item: CareerApplication) {
  return {
    ...item,
    status: item.status || "new",
    updatedAt: item.updatedAt || item.createdAt,
  };
}

function parseApplication(raw: string | null) {
  if (!raw) return null;
  try {
    return normalizeApplication(JSON.parse(raw) as CareerApplication);
  } catch {
    return null;
  }
}

async function getRedisApplications(redis: Redis) {
  const ids = await redis.lrange<string>(REDIS_APPLICATION_IDS_KEY, 0, 199);
  if (ids.length > 0) {
    const items = await Promise.all(
      ids.map((id) => redis.hget<string>(REDIS_APPLICATION_DATA_KEY, id))
    );
    return items
      .map((item) => parseApplication(item))
      .filter((item): item is CareerApplication => item !== null);
  }

  const legacyItems = await redis.lrange<string>(REDIS_LEGACY_LIST_KEY, 0, 199);
  const applications = legacyItems
    .map((item) => parseApplication(item))
    .filter((item): item is CareerApplication => item !== null);

  if (applications.length > 0) {
    for (let i = applications.length - 1; i >= 0; i -= 1) {
      const application = applications[i];
      await redis.lpush(REDIS_APPLICATION_IDS_KEY, application.id);
      await redis.hset(
        REDIS_APPLICATION_DATA_KEY,
        { [application.id]: JSON.stringify(application) }
      );
    }
  }

  return applications;
}

export async function GET() {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    const isProd = process.env.NODE_ENV === "production";

    if (url && token) {
      const redis = new Redis({ url, token });
      const applications = await getRedisApplications(redis);
      return NextResponse.json({ applications }, { status: 200 });
    }

    if (isProd) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 500 });
    }

    const normalized = getMemoryStore().map((item) => normalizeApplication(item));
    return NextResponse.json({ applications: normalized }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
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

    if (!fullName || !email || !resumeLink) {
      return NextResponse.json(
        { error: "Full name, email, and resume URL are required" },
        { status: 400 }
      );
    }

    const application: CareerApplication = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      fullName,
      email,
      phone,
      resumeLink,
      coverLetter,
      positionId,
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    const isProd = process.env.NODE_ENV === "production";

    if (url && token) {
      const redis = new Redis({ url, token });
      await redis.lpush(REDIS_APPLICATION_IDS_KEY, application.id);
      await redis.hset(
        REDIS_APPLICATION_DATA_KEY,
        { [application.id]: JSON.stringify(application) }
      );
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (isProd) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 500 });
    }

    const memoryStore = getMemoryStore();
    memoryStore.unshift(application);
    return NextResponse.json({ success: true, local: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body?.id || "");
    const status = String(body?.status || "") as CareerApplication["status"];
    if (!id || !["new", "reviewed", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    const isProd = process.env.NODE_ENV === "production";

    if (url && token) {
      const redis = new Redis({ url, token });
      await getRedisApplications(redis);
      const existing = parseApplication(
        await redis.hget<string>(REDIS_APPLICATION_DATA_KEY, id)
      );
      if (!existing) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
      }
      const updated = {
        ...existing,
        status,
        updatedAt: new Date().toISOString(),
      };
      await redis.hset(REDIS_APPLICATION_DATA_KEY, { [id]: JSON.stringify(updated) });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (isProd) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 500 });
    }

    const memoryStore = getMemoryStore();
    const index = memoryStore.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    memoryStore[index] = {
      ...normalizeApplication(memoryStore[index]),
      status,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, local: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 });
  }
}
