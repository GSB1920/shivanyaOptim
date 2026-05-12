const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gsba-991b0";
const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA7EguaeCLlu-jVEmZM4RsoqB4uHbyl7Bw";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

type FirestoreValue =
  | { nullValue: null }
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

const documentUrl = (path: string) =>
  `${FIRESTORE_BASE_URL}/${path}?key=${encodeURIComponent(FIREBASE_API_KEY)}`;

const collectionUrl = (path: string, params?: URLSearchParams) => {
  const search = params || new URLSearchParams();
  search.set("key", FIREBASE_API_KEY);
  return `${FIRESTORE_BASE_URL}/${path}?${search.toString()}`;
};

const toFirestoreValue = (value: unknown): FirestoreValue | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value
          .map((item) => toFirestoreValue(item))
          .filter((item): item is FirestoreValue => Boolean(item)),
      },
    };
  }
  if (typeof value === "object") {
    return { mapValue: { fields: toFirestoreFields(value as Record<string, unknown>) } };
  }
  return { stringValue: String(value) };
};

const fromFirestoreValue = (value: FirestoreValue): unknown => {
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if ("mapValue" in value) return fromFirestoreFields(value.mapValue.fields || {});
  return undefined;
};

export const toFirestoreFields = (data: Record<string, unknown>) => {
  return Object.entries(data).reduce<Record<string, FirestoreValue>>((acc, [key, value]) => {
    const firestoreValue = toFirestoreValue(value);
    if (firestoreValue) acc[key] = firestoreValue;
    return acc;
  }, {});
};

export const fromFirestoreFields = (fields: Record<string, FirestoreValue>) => {
  return Object.entries(fields).reduce<Record<string, unknown>>((acc, [key, value]) => {
    acc[key] = fromFirestoreValue(value);
    return acc;
  }, {});
};

const parseErrorResponse = async (response: Response) => {
  const body = await response.json().catch(async () => ({ error: await response.text() }));
  const message =
    typeof body?.error?.message === "string"
      ? body.error.message
      : typeof body?.error === "string"
        ? body.error
        : response.statusText;
  throw new Error(`Firestore REST ${response.status}: ${message}`);
};

export const getFirestoreDocument = async (path: string) => {
  const response = await fetch(documentUrl(path), { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) await parseErrorResponse(response);
  const document = (await response.json()) as FirestoreDocument;
  return fromFirestoreFields(document.fields || {});
};

export const setFirestoreDocument = async (path: string, data: Record<string, unknown>) => {
  const response = await fetch(documentUrl(path), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });
  if (!response.ok) await parseErrorResponse(response);
  const document = (await response.json()) as FirestoreDocument;
  return fromFirestoreFields(document.fields || {});
};

export const patchFirestoreDocument = async (path: string, data: Record<string, unknown>) => {
  const params = new URLSearchParams();
  params.set("key", FIREBASE_API_KEY);
  Object.keys(data).forEach((field) => params.append("updateMask.fieldPaths", field));

  const response = await fetch(`${FIRESTORE_BASE_URL}/${path}?${params.toString()}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });
  if (!response.ok) await parseErrorResponse(response);
  const document = (await response.json()) as FirestoreDocument;
  return fromFirestoreFields(document.fields || {});
};

export const addFirestoreDocument = async (
  collectionPath: string,
  data: Record<string, unknown>
) => {
  const response = await fetch(collectionUrl(collectionPath), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });
  if (!response.ok) await parseErrorResponse(response);
  const document = (await response.json()) as FirestoreDocument;
  return document.name.split("/").pop() || "";
};

export const listFirestoreDocuments = async (
  collectionPath: string,
  options: { pageSize?: number; orderBy?: string } = {}
) => {
  const params = new URLSearchParams();
  if (options.pageSize) params.set("pageSize", String(options.pageSize));
  if (options.orderBy) params.set("orderBy", options.orderBy);

  const response = await fetch(collectionUrl(collectionPath, params), { cache: "no-store" });
  if (!response.ok) await parseErrorResponse(response);
  const body = (await response.json()) as { documents?: FirestoreDocument[] };
  return (body.documents || []).map((document) => ({
    id: document.name.split("/").pop() || "",
    data: fromFirestoreFields(document.fields || {}),
  }));
};
