"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  sendPasswordResetEmail,
  getIdToken
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export type UserRole = "student" | "faculty" | "admin";
export type UserStatus = "active" | "disabled" | "pending_first_login";

export interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  force_password_change: boolean;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  token: string | null;
  signIn: (email: string, pass: string) => Promise<UserProfile | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (email: string, newPass: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  isLoading: true,
  token: null,
  signIn: async () => null,
  signOut: async () => {},
  resetPassword: async () => {},
  updateUserPassword: async () => false,
  refreshProfile: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const fetchBackendProfile = async (idToken: string): Promise<UserProfile | null> => {
    try {
      const res = await fetch(`${API_BASE}/auth/session`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setRole(data.user.role);
        return data.user;
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    // Check persistent session storage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("medimage_active_session");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
          setRole(parsed.role);
          setToken("active-roster-jwt-token");
          setIsLoading(false);
        } catch (e) {}
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const idToken = await getIdToken(firebaseUser);
        setToken(idToken);
        const backendProf = await fetchBackendProfile(idToken);
        const emailLower = firebaseUser.email?.toLowerCase() || "";
        
        // Permanent admin session check
        if (!backendProf && (emailLower === "jthakre62@gmail.com" || emailLower === "jthakr62@gmail.com")) {
          const adminProf: UserProfile = {
            id: firebaseUser.uid,
            firebase_uid: firebaseUser.uid,
            email: "jthakre62@gmail.com",
            full_name: "Jay Thakre",
            role: "admin",
            status: "active",
            force_password_change: false
          };
          setProfile(adminProf);
          setRole("admin");
          if (typeof window !== "undefined") {
            sessionStorage.setItem("medimage_active_session", JSON.stringify(adminProf));
          }
        }
      } else {
        if (typeof window !== "undefined" && !sessionStorage.getItem("medimage_active_session")) {
          setProfile(null);
          setRole(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [API_BASE]);

  const signIn = async (email: string, pass: string): Promise<UserProfile | null> => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Strict Super-Admin Authentication (Permanent Admin: jthakre62@gmail.com / Jay1523)
    if (
      (normalizedEmail === "jthakre62@gmail.com" || normalizedEmail === "jthakr62@gmail.com") &&
      pass === "Jay1523"
    ) {
      const adminProf: UserProfile = {
        id: "admin-jay-thakre-master-uid",
        firebase_uid: "admin-jay-thakre-master-uid",
        email: "jthakre62@gmail.com",
        full_name: "Jay Thakre",
        role: "admin",
        status: "active",
        force_password_change: false
      };
      setProfile(adminProf);
      setRole("admin");
      setToken("master-admin-jwt-token");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("medimage_active_session", JSON.stringify(adminProf));
      }
      setIsLoading(false);
      return adminProf;
    }

    // 2. Check Course Roster (Upstash Redis & local cache) for common password Feat@123 or user's custom password
    try {
      let rosterList: any[] = [];
      try {
        const res = await fetch(`${API_BASE}/admin/roster`);
        if (res.ok) {
          const data = await res.json();
          if (data.users) rosterList = data.users;
        }
      } catch (e) {
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem("medimage_redis_roster_cache");
          if (cached) rosterList = JSON.parse(cached);
        }
      }

      const found = rosterList.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (found) {
        const isCommonDefault = pass === "Feat@123";
        const isCustomMatch = found.temporary_password && pass === found.temporary_password;

        if (isCommonDefault || isCustomMatch) {
          const mustChange = found.force_password_change !== false && (isCommonDefault || found.status === "pending_first_login");
          const userProf: UserProfile = {
            id: found.id,
            firebase_uid: found.id,
            email: found.email,
            full_name: found.full_name,
            role: found.role,
            status: found.status === "disabled" ? "disabled" : "active",
            force_password_change: mustChange
          };

          if (userProf.status === "disabled") {
            throw new Error("This institutional account has been disabled by the administrator.");
          }

          setProfile(userProf);
          setRole(userProf.role);
          setToken("user-roster-session-token");
          if (typeof window !== "undefined") {
            sessionStorage.setItem("medimage_active_session", JSON.stringify(userProf));
          }
          setIsLoading(false);
          return userProf;
        }
      }
    } catch (e: any) {
      if (e.message && e.message.includes("disabled")) {
        throw e;
      }
    }

    // 3. Fallback to Firebase Authentication
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const idToken = await getIdToken(cred.user);
      setToken(idToken);
      let userProf = await fetchBackendProfile(idToken);
      if (!userProf) {
        userProf = {
          id: cred.user.uid,
          firebase_uid: cred.user.uid,
          email: email,
          full_name: email.split("@")[0],
          role: "student",
          status: "active",
          force_password_change: false
        };
        setProfile(userProf);
        setRole("student");
        if (typeof window !== "undefined") {
          sessionStorage.setItem("medimage_active_session", JSON.stringify(userProf));
        }
      }
      return userProf;
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPassword = async (email: string, newPass: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/admin/roster/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, new_password: newPass })
      });

      // Update in active session
      if (profile) {
        const updated = { ...profile, force_password_change: false, status: "active" as const };
        setProfile(updated);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("medimage_active_session", JSON.stringify(updated));
        }
      }

      // Also update local cache
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("medimage_redis_roster_cache");
        if (cached) {
          try {
            const list = JSON.parse(cached);
            const nextList = list.map((u: any) =>
              u.email.toLowerCase() === email.toLowerCase()
                ? { ...u, temporary_password: newPass, force_password_change: false, status: "active" }
                : u
            );
            localStorage.setItem("medimage_redis_roster_cache", JSON.stringify(nextList));
          } catch (e) {}
        }
      }

      return res.ok;
    } catch (e) {
      return false;
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {}
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("medimage_active_session");
      localStorage.removeItem("medimage_active_session");
    }
    setUser(null);
    setProfile(null);
    setRole(null);
    setToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshProfile = async () => {
    if (user) {
      const idToken = await getIdToken(user, true);
      setToken(idToken);
      await fetchBackendProfile(idToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isLoading,
        token,
        signIn,
        signOut,
        resetPassword,
        updateUserPassword,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
