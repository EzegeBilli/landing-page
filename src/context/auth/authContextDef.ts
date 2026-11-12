import { createContext } from "react";
import type { AuthUser, PublicProfile, RegisterInput } from "../../types";

/** Editable profile fields as the form holds them (all strings). */
export interface ProfileFormValues {
  fullName: string;
  discipline: string;
  graduationYear: string;
  currentRole: string;
  company: string;
  location: string;
  phone: string;
  bio: string;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export interface AuthContextValue {
  user: PublicProfile | null;
  isAuthenticated: boolean;
  /** True for the browser-only demo account, which has no backend session. */
  isDemo: boolean;
  register: (input: RegisterInput) => { ok: boolean; error?: string };
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; needsVerification?: boolean; awaitingApproval?: boolean }>;
  isLoading: boolean;
  logout: () => void;
  /** Demo-only local update (e.g. demo membership). Real accounts use the save* actions. */
  updateProfile: (updates: Partial<AuthUser>) => void;
  /** Re-reads the signed-in user from GET /api/auth/me. */
  refreshUser: () => Promise<void>;
  saveProfile: (values: ProfileFormValues) => Promise<ActionResult>;
  saveAvatar: (dataUrl: string) => Promise<ActionResult>;
  saveMentorSettings: (settings: { isMentor: boolean; mentorExpertise: string[] }) => Promise<ActionResult>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
