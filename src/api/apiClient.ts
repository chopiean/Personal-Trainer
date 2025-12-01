const API_BASE = import.meta.env.VITE_API_URL;

// === Generic GET request ===
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

// === Generic POST request ===
export async function apiPost<TRequest, TResponse = unknown>(
  path: string,
  body: TRequest
): Promise<TResponse> {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<TResponse>;
}

// === Generic PUT request ===
export async function apiPut<TRequest, TResponse = unknown>(
  path: string,
  body: TRequest
): Promise<TResponse> {
  const res = await fetch(API_BASE + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<TResponse>;
}

// === Generic DELETE request ===
export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(API_BASE + path, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
