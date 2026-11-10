import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthUser, PublicProfile } from "../../types";
import {
  getSessionUserId,
  getUsers,
  hashPassword,
  saveUsers,
  setSessionUserId,
} from "./authStorage";
import { AuthContext, type AuthContextValue } from "./authContextDef";
import { toast } from "../../components/toast/toast";
import { AuthApiError, getCurrentUser, loginAccount, logoutAccount, type BackendUser } from "../../api/auth";

function backendProfile(user: BackendUser): PublicProfile {
  const id = user.id || user._id;
  if (!id || !user.email || !user.fullName) throw new Error("Invalid login response. Please try again.");
  return { id, fullName: user.fullName, email: user.email, memberType: user.userType === "staff" ? "Staff" : "Alumnus",
    graduationYear: user.graduationYear ? String(user.graduationYear) : "", discipline: user.department || "",
    phone: user.phone, createdAt: user.createdAt || "" };
}

function toPublicProfile(user: AuthUser): PublicProfile {
  const publicProfile: Partial<AuthUser> = { ...user };
  delete publicProfile.passwordHash;
  return publicProfile as PublicProfile;
}

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

  const getMentorUsers = () =>
    users.filter((u) => u.isMentor).map(toPublicProfile);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    getMentorUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
