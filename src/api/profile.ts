import { apiRequest } from "./client";

/**
 * Fields accepted by PATCH /api/users/me. The backend rejects anything else
 * (email, userType, membershipType, role, chapter, avatar, mentor settings).
 * Nullable fields are cleared by sending `null`.
 */
export interface ProfileUpdatePayload {
  fullName?: string;
  department?: string | null;
  graduationYear?: number | null;
  currentRole?: string | null;
  company?: string | null;
  location?: string | null;
  phone?: string | null;
  bio?: string | null;
}

export interface MentorSettingsPayload {
  isMentor?: boolean;
  mentorExpertise?: string[];
}

export const updateMyProfile = (payload: ProfileUpdatePayload) =>
  apiRequest<unknown>("/users/me", { method: "PATCH", body: payload });

/** `dataUrl` must be a base64 PNG, JPEG or WEBP data URL, at most 1.5 MB decoded. */
export const uploadMyAvatar = (dataUrl: string) =>
  apiRequest<{ avatarUrl: string }>("/users/me/avatar", { method: "POST", body: { data: dataUrl } });

export const updateMyMentorSettings = (payload: MentorSettingsPayload) =>
  apiRequest<{ isMentor: boolean; mentorExpertise: string[] }>("/users/me/mentor", { method: "PATCH", body: payload });
