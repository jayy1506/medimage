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
  refreshProfile: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBackendProfile = async (idToken: string): Promise<UserProfile | null> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${apiUrl}/auth/session`, {
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
      } else {
        console.error("Backend session validation rejected user:", res.status);
        setProfile(null);
        setRole(null);
        return null;
      }
    } catch (err) {
      console.error("Failed to sync backend profile:", err);
      return null;
    }
  };

  useEffect(() => {
    // Check local session storage for Super-Admin fallback session
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("medimage_admin_session");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
          setRole(parsed.role);
          setToken("master-admin-jwt-token");
          setIsLoading(false);
        } catch (e) {
          // ignore corrupted session
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const idToken = await getIdToken(firebaseUser);
        setToken(idToken);
        const backendProf = await fetchBackendProfile(idToken);
        const emailLower = firebaseUser.email?.toLowerCase() || "";
        // Special provisioning fallback for primary administrator
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
            sessionStorage.setItem("medimage_admin_session", JSON.stringify(adminProf));
          }
        }
      } else {
        if (typeof window !== "undefined" && !sessionStorage.getItem("medimage_admin_session")) {
          setProfile(null);
          setRole(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string): Promise<UserProfile | null> => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    // Direct Super-Admin credential validation for institutional administrator
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
        sessionStorage.setItem("medimage_admin_session", JSON.stringify(adminProf));
      }
      setIsLoading(false);
      return adminProf;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const idToken = await getIdToken(cred.user);
      setToken(idToken);
      let userProf = await fetchBackendProfile(idToken);
      if (!userProf && (normalizedEmail === "jthakre62@gmail.com" || normalizedEmail === "jthakr62@gmail.com")) {
        userProf = {
          id: cred.user.uid,
          firebase_uid: cred.user.uid,
          email: "jthakre62@gmail.com",
          full_name: "Jay Thakre",
          role: "admin",
          status: "active",
          force_password_change: false
        };
        setProfile(userProf);
        setRole("admin");
        if (typeof window !== "undefined") {
          sessionStorage.setItem("medimage_admin_session", JSON.stringify(userProf));
        }
      }
      return userProf;
    } catch (err: any) {
      // If Firebase Auth returned invalid credentials but email and pass match master admin
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
          sessionStorage.setItem("medimage_admin_session", JSON.stringify(adminProf));
        }
        return adminProf;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("medimage_admin_session");
    }
    setUser(null);
    setProfile(null);
    setRole(null);
    setToken(null);
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
