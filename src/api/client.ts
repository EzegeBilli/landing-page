// Shared HTTP client for the NMU Alumni backend.
//
// Auth model (backend API_DOCUMENTATION.md, "Login response and refresh/logout details"):
// - Login and refresh return a short-lived JWT in `data.accessToken`. It is kept
//   only in this module's memory (never in Web Storage, IndexedDB or URLs) and sent
//   as `Authorization: Bearer <token>` on authenticated requests to this API.
// - The refresh token lives in an HttpOnly cookie, so only login, refresh and
//   logout send credentials. Refresh tokens are single-use (rotated on each
//   refresh), so refreshes are serialised: one shared promise per tab, and a
//   Web Lock across tabs where the browser supports it.
// - A 401 triggers one refresh and one retry. If that fails, the token is cleared
//   and a session-expired event is broadcast so the auth context signs the user out.

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

const NETWORK_ERROR = "Could not reach the server. Check your connection and try again.";

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

// ---------------------------------------------------------------------------
// Access token (memory only)
// ---------------------------------------------------------------------------

let accessToken: string | null = null;

/** Stores (or clears, with `null`) the in-memory access token. */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function hasAccessToken(): boolean {
  return accessToken !== null;
}

// ---------------------------------------------------------------------------
// Refresh
// ---------------------------------------------------------------------------

/** `ok`: new token stored. `rejected`: no valid refresh session. `network`: server unreachable. */
export type RefreshResult = "ok" | "rejected" | "network";

let refreshing: Promise<RefreshResult> | null = null;

async function requestNewAccessToken(): Promise<RefreshResult> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    return "network";
  }
  const body = (await response.json().catch(() => null)) as Envelope<{ accessToken?: unknown }> | null;
  const token = body?.data?.accessToken;
  if (response.ok && body?.success === true && typeof token === "string" && token) {
    accessToken = token;
    return "ok";
  }
  accessToken = null;
  return "rejected";
}

/** Runs `task` while holding a cross-tab lock, so tabs never spend the same refresh cookie. */
function withRefreshLock(task: () => Promise<RefreshResult>): Promise<RefreshResult> {
  const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
  return locks ? locks.request("nmu-auth-refresh", task) : task();
}

/** Gets a new access token from the refresh cookie. Concurrent callers share one request. */
export function refreshSession(): Promise<RefreshResult> {
  refreshing ??= withRefreshLock(requestNewAccessToken).finally(() => { refreshing = null; });
  return refreshing;
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

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
  /**
   * Send the Bearer token and refresh on 401 (default true). Public endpoints and
   * the auth endpoints themselves (login, register, …) pass false, so a wrong
   * password never triggers a refresh.
   */
  auth?: boolean;
  /** Send cookies. Only login and logout need this (refresh is handled above). */
  withCredentials?: boolean;
}

async function send(path: string, { method = "GET", body, query, auth = true, withCredentials = false }: RequestOptions): Promise<Response> {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  try {
    // Every request goes to our own API base URL, so the token never reaches third parties.
    return await fetch(`${baseUrl}/api${path}${qs ? `?${qs}` : ""}`, {
      method,
      credentials: withCredentials ? "include" : "same-origin",
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new ApiError(NETWORK_ERROR, 0);
  }
}

function expireSession(): never {
  accessToken = null;
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  throw new ApiError("Your session has expired. Please log in again.", 401);
}

/** Sends a request and returns the `{ message, data }` of the backend's success envelope. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<{ message: string; data: T }> {
  const auth = options.auth ?? true;
  const tokenUsed = accessToken;
  let response = await send(path, options);

  if (response.status === 401 && auth) {
    // Another request may already have refreshed while this one was in flight.
    let retry = accessToken !== null && accessToken !== tokenUsed;
    if (!retry) {
      const result = await refreshSession();
      if (result === "network") throw new ApiError(NETWORK_ERROR, 0);
      retry = result === "ok";
    }
    if (!retry) expireSession();
    response = await send(path, options); // retried once only
    if (response.status === 401) expireSession();
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
