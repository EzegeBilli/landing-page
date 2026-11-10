import { ApiError, apiRequest, baseUrl } from "./client";

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
interface ApiResponse {
  success: boolean;
  message: string;
  data?: BackendUser;
}

export { ApiError as AuthApiError };

async function postAuth(path: string, payload: object): Promise<ApiResponse> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/auth/${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection and try again.", 0);
  }
  const body: unknown = await response.json().catch(() => null);
  const result = body && typeof body === "object" ? body as Partial<ApiResponse> : null;
  if (!response.ok || result?.success !== true) {
    throw new ApiError(typeof result?.message === "string" ? result.message : `Request failed (${response.status}). Please try again.`, response.status);
  }
  return result as ApiResponse;
}

export const registerAccount = (payload: RegistrationPayload) => postAuth("register", payload);
export const verifyEmail = (payload: { email: string; otp: string }) => postAuth("verify-email", payload);
export const resendOtp = (payload: { email: string }) => postAuth("resend-otp", payload);
export const loginAccount = (payload: { email: string; password: string }) => postAuth("login", payload);
export const logoutAccount = () => postAuth("logout", {});
/** Current session profile. Refreshes an expired access token once before giving up. */
export async function getCurrentUser(): Promise<BackendUser> {
  const { data } = await apiRequest<BackendUser | undefined>("/auth/me");
  if (!data) throw new ApiError("Session unavailable", 401);
  return data;
}
