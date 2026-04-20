import { http } from "@/app/api/http";

/**
 * Chuẩn hoá URL ảnh để hiển thị trên mobile:
 * - Map http://localhost/... sang baseURL hiện tại (ngrok / IP thật)
 * - Map path tương đối như "posts/xxx.jpg" hoặc "/storage/posts/xxx.jpg"
 *   sang `${baseURL}/storage/...`
 * - Giữ nguyên các URL đầy đủ khác (https://..., http://domain...)
 */
export const resolveImageUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;

  const base = (http.defaults.baseURL || "").replace(/\/+$/, "");

  // localhost → thay host bằng baseURL
  if (url.startsWith("http://localhost") || url.startsWith("https://localhost")) {
    const path = url.replace(/^https?:\/\/localhost(:\d+)?/, "");
    return `${base}${path}`;
  }

  // Path tương đối (không có http/https)
  if (!url.startsWith("http")) {
    // Nếu đã có /storage ở đầu thì giữ, còn lại thì prefix /storage/
    const hasStoragePrefix = url.startsWith("/storage/") || url.startsWith("storage/");
    const normalizedPath = hasStoragePrefix ? url.replace(/^\/?/, "/") : `/storage/${url.replace(/^\/?/, "")}`;
    return `${base}${normalizedPath}`;
  }

  // URL đầy đủ khác
  return url;
};

