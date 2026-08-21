import { supabase } from "@/lib/supabaseClient";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

const MIRRORABLE_CONTENT_TYPE = /^(image\/|application\/pdf)/i;
const MAX_MIRROR_BYTES = 15 * 1024 * 1024;

const extensionFromContentType = (contentType: string) => {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
  };
  return map[contentType.toLowerCase()] || "bin";
};

const sanitizeSegment = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60) || "file";

/**
 * Downloads an externally-hosted file (image, PDF, etc.) and re-uploads it to
 * Supabase Storage so the app no longer depends on the original host staying up.
 * Returns the new public URL, or null if the source isn't a direct, mirrorable file
 * (e.g. an HTML share/profile page) or the download fails for any reason.
 */
export const mirrorUrlToStorage = async (
  sourceUrl: string,
  options: { bucket: string; folder: string; timeoutMs?: number }
): Promise<string | null> => {
  let parsed: URL;
  try {
    parsed = new URL(sourceUrl);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;

  try {
    const response = await fetchWithTimeout(
      parsed.toString(),
      { redirect: "follow" },
      options.timeoutMs ?? 10_000
    );
    if (!response.ok) return null;

    const contentType = (response.headers.get("content-type") || "").split(";")[0].trim();
    if (!MIRRORABLE_CONTENT_TYPE.test(contentType)) return null;

    const contentLength = Number(response.headers.get("content-length") || 0);
    if (contentLength && contentLength > MAX_MIRROR_BYTES) return null;

    const blob = await response.blob();
    if (blob.size === 0 || blob.size > MAX_MIRROR_BYTES) return null;

    const path = `${sanitizeSegment(options.folder)}/${Date.now()}-${sanitizeSegment(
      parsed.pathname.split("/").pop() || "file"
    )}.${extensionFromContentType(contentType)}`;

    const { error: uploadError } = await supabase.storage
      .from(options.bucket)
      .upload(path, blob, { contentType, upsert: true });
    if (uploadError) return null;

    const { data } = supabase.storage.from(options.bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
};
