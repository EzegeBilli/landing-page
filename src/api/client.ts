// Shared HTTP client for the NMU Alumni backend.
// Auth is the backend's httpOnly `access_token` cookie, so every request is sent
// with credentials. A 401 triggers one refresh attempt (POST /api/auth/refresh)
// and a retry; if that also fails, a session-expired event is broadcast so the
// auth context can sign the user out.

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const SESSION_EXPIRED_EVENT = "nmu:session-expired";

// Accept an origin or a base URL already ending in /api.
// Never fall back to localhost in production builds: browsers treat that as a
// local-network request (permission prompt + CORS failure) on the live site.
export const baseUrl = (import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? "http://localhost:5000" : "https://alumni-backend-y1vu.onrender.com"))
  .replace(/\/+$/, "").replace(/\/api$/, "");

interface Envelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  details?: unknown;
}

let refreshing: Promise<boolean> | null = null;

/** Rotates the access token using the refresh cookie. Concurrent callers share one request. */
export function refreshSession(): Promise<boolean> {
  refreshing ??= fetch(`${baseUrl}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
    signal: AbortSignal.timeout(20000),
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => { refreshing = null; });
  return refreshing;
}

/** Turns the backend's flattened Zod errors ({ formErrors, fieldErrors }) into one readable line. */
function describeDetails(details: unknown): string | null {
  if (!details || typeof details !== "object") return null;
  const { formErrors, fieldErrors } = details as {
    formErrors?: string[];
    fieldErrors?: Record<string, string[] | undefined>;
  };
  const messages = [
    ...(Array.isArray(formErrors) ? formErrors : []),
    ...Object.entries(fieldErrors ?? {}).flatMap(([field, errors]) => (errors ?? []).map((e) => `${field}: ${e}`)),
  ];
  return messages.length ? messages.join("; ") : null;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  /** Skip the refresh-and-retry step (used by auth endpoints themselves). */
  noRefresh?: boolean;
}

async function send(path: string, { method = "GET", body, query }: RequestOptions): Promise<Response> {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  try {
    return await fetch(`${baseUrl}/api${path}${qs ? `?${qs}` : ""}`, {
      method,
      credentials: "include",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection and try again.", 0);
  }
}

/** Sends a request and returns the full `{ success, message, data }` envelope. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<{ message: string; data: T }> {
  let response = await send(path, options);
  if (response.status === 401 && !options.noRefresh) {
    if (await refreshSession()) response = await send(path, options);
    if (response.status === 401) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      throw new ApiError("Your session has expired. Please log in again.", 401);
    }
  }

  const body: unknown = await response.json().catch(() => null);
  const result = body && typeof body === "object" ? (body as Envelope<T>) : null;
  if (!response.ok || result?.success !== true) {
    const message = typeof result?.message === "string" ? result.message : `Request failed (${response.status}). Please try again.`;
    const detail = describeDetails(result?.details);
    throw new ApiError(detail ? `${message}: ${detail}` : message, response.status, result?.details);
  }
  return { message: result.message ?? "", data: result.data as T };
}
