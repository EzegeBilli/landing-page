import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { AuthUser, PublicProfile } from "../../types";
import {
  getSessionUserId,
  getUsers,
  hashPassword,
  saveUsers,
  setSessionUserId,
} from "./authStorage";
import { AuthContext, type ActionResult, type AuthContextValue } from "./authContextDef";
import { toast } from "../../components/toast/toast";
import { AuthApiError, getCurrentUser, loginAccount, logoutAccount, type BackendUser } from "../../api/auth";
import { SESSION_EXPIRED_EVENT } from "../../api/client";
import {
  updateMyMentorSettings,
  updateMyProfile,
  uploadMyAvatar,
} from "../../api/profile";
import { profilePatch } from "../../api/profilePatch";

function backendProfile(user: BackendUser): PublicProfile {
  const id = user.id || user._id;
  if (!id || !user.email || !user.fullName) throw new Error("Invalid login response. Please try again.");
  return {
    id,
    fullName: user.fullName,
    email: user.email,
    memberType: user.userType === "staff" ? "Staff" : "Alumnus",
    // Backend `department` is shown as the frontend's "discipline".
    discipline: user.department || "",
    graduationYear: user.graduationYear ? String(user.graduationYear) : "",
    phone: user.phone ?? undefined,
    currentRole: user.currentRole ?? undefined,
    company: user.company ?? undefined,
    location: user.location ?? undefined,
    bio: user.bio ?? undefined,
    avatar: user.avatarUrl ?? undefined,
    isMentor: user.isMentor ?? false,
    mentorExpertise: user.mentorExpertise ?? [],
    createdAt: user.createdAt || "",
  };
}

function toPublicProfile(user: AuthUser): PublicProfile {
  const publicProfile: Partial<AuthUser> = { ...user };
  delete publicProfile.passwordHash;
  return publicProfile as PublicProfile;
}

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [backendUser, setBackendUser] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let active = true;
    getCurrentUser().then(value => { if (active) setBackendUser(backendProfile(value)); })
      .catch(() => { /* No active backend session; demo login remains available. */ })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);
  const [users, setUsers] = useState<AuthUser[]>(() => getUsers());
  const [sessionUserId, setSessionUserIdState] = useState<string | null>(() =>
    getSessionUserId()
  );

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  // Any API call that still gets 401 after a token refresh lands here.
  const backendUserRef = useRef(backendUser);
  useEffect(() => { backendUserRef.current = backendUser; }, [backendUser]);
  useEffect(() => {
    const onExpired = () => {
      if (!backendUserRef.current) return;
      backendUserRef.current = null;
      setBackendUser(null);
      toast.error("Your session has expired. Please log in again.");
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const user = useMemo(() => {
    const found = users.find((u) => u.id === sessionUserId);
    return backendUser || (found ? toPublicProfile(found) : null);
  }, [users, sessionUserId, backendUser]);

  const register: AuthContextValue["register"] = ({
    fullName,
    email,
    password,
    memberType,
    graduationYear,
    discipline,
  }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const newUser: AuthUser = {
      id: `u${Date.now()}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      memberType,
      graduationYear,
      discipline,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setSessionUserId(newUser.id);
    setSessionUserIdState(newUser.id);

    return { ok: true };
  };

  const login: AuthContextValue["login"] = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== "demo@nmualumni.org") {
      try {
        const response = await loginAccount({ email: normalizedEmail, password });
        if (!response.data) throw new Error("Invalid login response. Please try again.");
        const profile = await getCurrentUser().catch(() => response.data!);
        setBackendUser(backendProfile(profile));
        setSessionUserId(null); setSessionUserIdState(null);
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "Login failed. Please try again.",
          needsVerification: error instanceof AuthApiError && error.status === 403 && error.message === "Please verify your email before logging in",
          awaitingApproval: error instanceof AuthApiError && error.status === 403 && /awaiting (admin )?approval/i.test(error.message) };
      }
    }
    const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!found || found.passwordHash !== hashPassword(password)) {
      return { ok: false, error: "Incorrect email or password." };
    }

    setSessionUserId(found.id);
    setBackendUser(null);
    setSessionUserIdState(found.id);
    return { ok: true };
  };

  const logout = () => {
    if (backendUser) {
      void logoutAccount().then(() => {
        setBackendUser(null); setSessionUserId(null); setSessionUserIdState(null);
        toast.success("You’ve been logged out.");
      }).catch(() => toast.error("Could not log out. Please check your connection and try again."));
      return;
    }
    setSessionUserId(null);
    setSessionUserIdState(null);
  };

  const updateProfile: AuthContextValue["updateProfile"] = (updates) => {
    if (!sessionUserId) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === sessionUserId ? { ...u, ...updates } : u))
    );
  };

  const refreshUser = useCallback(async () => {
    const profile = await getCurrentUser();
    setBackendUser(backendProfile(profile));
  }, []);

  /** Runs a backend write, then reloads the profile so the UI shows what was persisted. */
  const persist = async (write: () => Promise<unknown>, fallback: string): Promise<ActionResult> => {
    try {
      await write();
    } catch (error) {
      return { ok: false, error: errorMessage(error, fallback) };
    }
    try {
      await refreshUser();
    } catch {
      // The write succeeded; a failed reload only means the view may lag until the next load.
    }
    return { ok: true };
  };

  const saveProfile: AuthContextValue["saveProfile"] = async (values) => {
    if (!backendUser) {
      updateProfile({ ...values, fullName: values.fullName.trim() });
      return { ok: true };
    }
    if (values.fullName.trim().length < 2) {
      return { ok: false, error: "Full name must be at least 2 characters." };
    }
    const patch = profilePatch(backendUser, values);
    if (Object.keys(patch).length === 0) return { ok: true };
    return persist(() => updateMyProfile(patch), "Could not save your profile. Please try again.");
  };

  const saveAvatar: AuthContextValue["saveAvatar"] = async (dataUrl) => {
    if (!backendUser) {
      updateProfile({ avatar: dataUrl });
      return { ok: true };
    }
    return persist(() => uploadMyAvatar(dataUrl), "Could not upload your photo. Please try again.");
  };

  const saveMentorSettings: AuthContextValue["saveMentorSettings"] = async (settings) => {
    if (!backendUser) {
      updateProfile(settings);
      return { ok: true };
    }
    return persist(() => updateMyMentorSettings(settings), "Could not save your mentor settings. Please try again.");
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isDemo: !!user && !backendUser,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    refreshUser,
    saveProfile,
    saveAvatar,
    saveMentorSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
