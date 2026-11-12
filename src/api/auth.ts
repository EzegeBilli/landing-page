import { ApiError, apiRequest, refreshSession, setAccessToken } from "./client";

export interface RegistrationPayload {
  fullName: string;
  email: string;
  password: string;
  userType: "alumni" | "staff";
  membershipType: "full" | "associate";
  department?: string;
  graduationYear?: number;
}

/** Shape returned by GET /api/auth/me (nullable fields are `null` when unset). */
export interface BackendUser {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  userType?: "alumni" | "staff";
  membershipType?: string;
  graduationYear?: number | null;
  department?: string | null;
  faculty?: string | null;
  phone?: string | null;
  currentRole?: string | null;
  company?: string | null;
  location?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  isMentor?: boolean;
  mentorExpertise?: string[];
  createdAt?: string;
}

/**
 * POST /api/auth/login `data`: the account under `user`, the access JWT, its
 * lifetime in seconds, and (for compatibility) the same account fields flat.
 */
interface LoginData extends Partial<BackendUser> {
  user?: BackendUser;
  accessToken?: unknown;
  expiresIn?: number;
}

interface AuthResponse<T> {
  success: true;
  message: string;
  data?: T;
}

export { ApiError as AuthApiError };

/** Unauthenticated auth call: no Bearer token and no refresh on 401 (e.g. wrong password). */
async function postAuth<T = BackendUser>(path: string, payload: object, withCredentials = false): Promise<AuthResponse<T>> {
  const { message, data } = await apiRequest<T | undefined>(`/auth/${path}`, {
    method: "POST",
    body: payload,
    auth: false,
    withCredentials,
  });
  return { success: true, message, data };
}

export const registerAccount = (payload: RegistrationPayload) => postAuth("register", payload);
export const verifyEmail = (payload: { email: string; otp: string }) => postAuth("verify-email", payload);
export const resendOtp = (payload: { email: string }) => postAuth("resend-otp", payload);

/**
 * Logs in, keeps the access token in memory and returns the account. Sent with
 * credentials so the browser stores the HttpOnly refresh cookie.
 */
export async function loginAccount(payload: { email: string; password: string }): Promise<AuthResponse<BackendUser>> {
  const response = await postAuth<LoginData>("login", payload, true);
  const data = response.data;
  if (typeof data?.accessToken !== "string" || !data.accessToken) {
    throw new ApiError("Login failed: the server did not return an access token. Please try again.", 500);
  }
  setAccessToken(data.accessToken);
  const user = data.user ?? (data as BackendUser);
  return { ...response, data: user };
}

/**
 * Revokes the refresh session server-side and clears cookies. The in-memory
 * access token is cleared whether or not the server could be reached.
 */
export async function logoutAccount(): Promise<AuthResponse<unknown>> {
  try {
    return await postAuth<unknown>("logout", {}, true);
  } finally {
    setAccessToken(null);
  }
}

/** Current session profile (Bearer). Refreshes an expired access token once before giving up. */
export async function getCurrentUser(): Promise<BackendUser> {
  const { data } = await apiRequest<BackendUser | undefined>("/auth/me");
  if (!data) throw new ApiError("Session unavailable", 401);
  return data;
}

/**
 * Restores a session after a page load: trades the HttpOnly refresh cookie for a
 * new access token, then loads the user. Returns null when there's no session.
 */
export async function restoreSession(): Promise<BackendUser | null> {
  const result = await refreshSession();
  if (result !== "ok") return null;
  return getCurrentUser();
}
