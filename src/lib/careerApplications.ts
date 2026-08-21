export type ApplicationStatus = "new" | "reviewed" | "rejected";

export type CareerApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  resumeLink: string;
  resumeSourceLink: string;
  coverLetter: string;
  positionId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export const CAREER_APPLICATIONS_COLLECTION = "careerApplications";

export const APPLICATION_STATUSES: ApplicationStatus[] = ["new", "reviewed", "rejected"];

const stringField = (value: unknown) => (typeof value === "string" ? value : "");

const normalizeDateValue = (value: unknown, fallback: string) => {
  if (typeof value === "string" && value) return value;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object" && "toDate" in value) {
    const toDate = (value as { toDate?: () => Date }).toDate;
    if (typeof toDate === "function") {
      return toDate.call(value).toISOString();
    }
  }
  return fallback;
};

export const normalizeCareerApplication = (
  id: string,
  data: Record<string, unknown>
): CareerApplication => {
  const now = new Date().toISOString();
  const createdAt = normalizeDateValue(data.createdAt, now);
  const status = stringField(data.status);

  return {
    id,
    fullName: stringField(data.fullName),
    email: stringField(data.email),
    phone: stringField(data.phone),
    resumeLink: stringField(data.resumeLink),
    resumeSourceLink: stringField(data.resumeSourceLink),
    coverLetter: stringField(data.coverLetter),
    positionId: stringField(data.positionId),
    status: APPLICATION_STATUSES.includes(status as ApplicationStatus)
      ? (status as ApplicationStatus)
      : "new",
    createdAt,
    updatedAt: normalizeDateValue(data.updatedAt, createdAt),
  };
};
