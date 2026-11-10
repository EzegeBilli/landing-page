export interface RegistrationPayload {
  fullName: string;
  email: string;
  password: string;
  userType: "alumni" | "staff";
  membershipType: "full" | "associate";
  department?: string;
  graduationYear?: number;
}

export interface BackendUser {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  userType?: "alumni" | "staff";
  graduationYear?: number;
  department?: string;
  phone?: string;
  createdAt?: string;
}
interface ApiResponse {
  success: boolean;
  message: string;
  data?: BackendUser;
}

export class AuthApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

// Accept an origin or a base URL already ending in /api.
// Never fall back to localhost in production builds: browsers treat that as a
// local-network request (permission prompt + CORS failure) on the live site.
const baseUrl = (import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? "http://localhost:5000" : "https://alumni-backend-y1vu.onrender.com"))
  .replace(/\/+$/, "").replace(/\/api$/, "");

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
    throw new Error("Could not reach the server. Check your connection and try again.");
  }
  const body: unknown = await response.json().catch(() => null);
  const result = body && typeof body === "object" ? body as Partial<ApiResponse> : null;
  if (!response.ok || result?.success !== true) {
    throw new AuthApiError(typeof result?.message === "string" ? result.message : `Request failed (${response.status}). Please try again.`, response.status);
  }
  return result as ApiResponse;
}

export const registerAccount = (payload: RegistrationPayload) => postAuth("register", payload);
export const verifyEmail = (payload: { email: string; otp: string }) => postAuth("verify-email", payload);
export const resendOtp = (payload: { email: string }) => postAuth("resend-otp", payload);
export const loginAccount = (payload: { email: string; password: string }) => postAuth("login", payload);
export const logoutAccount = () => postAuth("logout", {});
export async function getCurrentUser(): Promise<BackendUser> {
  const response = await fetch(`${baseUrl}/api/auth/me`, { credentials: "include", signal: AbortSignal.timeout(20000) });
  const result = await response.json();
  if (!response.ok || !result.success || !result.data) throw new Error("Session unavailable");
  return result.data;
}
