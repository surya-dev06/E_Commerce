import { trackedFetch } from "./loading";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export async function api<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  const h = new Headers(options.headers);
  h.set("Content-Type", "application/json");
  if (accessToken) h.set("Authorization", `Bearer ${accessToken}`);
  const r = await trackedFetch(`${API_BASE_URL}${path}`, { ...options, headers: h });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.message || "Request failed");
  return data;
}
