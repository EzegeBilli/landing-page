import type { ProfileUpdatePayload } from "./profile";

/** Profile values as the frontend holds them (discipline = backend `department`, year as text). */
export interface ProfileSnapshot {
  fullName: string;
  discipline: string;
  graduationYear: string;
  currentRole?: string;
  company?: string;
  location?: string;
  phone?: string;
  bio?: string;
}

export type ProfileFormInput = Required<ProfileSnapshot>;

/**
 * Builds a PATCH /api/users/me body with only the fields that changed.
 * Converts discipline → department and graduationYear text → number, and sends
 * `null` to clear an emptied optional field. Protected fields can't appear here.
 */
export function profilePatch(current: ProfileSnapshot, values: ProfileFormInput): ProfileUpdatePayload {
  const patch: ProfileUpdatePayload = {};
  const text = (value: string) => value.trim() || null;

  const fullName = values.fullName.trim();
  if (fullName !== current.fullName) patch.fullName = fullName;
  if (text(values.discipline) !== (current.discipline || null)) patch.department = text(values.discipline);
  if (values.graduationYear !== (current.graduationYear || "")) {
    patch.graduationYear = values.graduationYear ? Number(values.graduationYear) : null;
  }
  const optional = ["currentRole", "company", "location", "phone", "bio"] as const;
  optional.forEach((field) => {
    if (text(values[field]) !== (current[field] || null)) patch[field] = text(values[field]);
  });
  return patch;
}
