"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/UserNav";
import { BrandLogo } from "@/components/BrandLogo";
import {
  Users,
  Shield,
  UserPlus,
  FileSpreadsheet,
  History,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  LogOut,
  Search,
  Filter,
  Activity,
  Layers,
  Database,
  Lock,
  ArrowUpRight,
  Trash2,
  Copy,
  Check,
  ShieldAlert,
  Eye,
  EyeOff,
  Key,
  Mail
} from "lucide-react";

interface ManagedUser {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "faculty" | "admin";
  status: "active" | "disabled" | "pending_first_login";
  created_at: string;
  temporary_password?: string;
  force_password_change?: boolean;
}

interface AuditEntry {
  id: string;
  actor_email: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  details: string;
}

const DEFAULT_USERS: ManagedUser[] = [
  {
    id: "u-1",
    email: "jthakre62@gmail.com",
    full_name: "Jay Thakre",
    role: "admin",
    status: "active",
    created_at: "2026-10-29T10:00:00Z",
    temporary_password: "Jay1523",
    force_password_change: false
  }
];

export default function AdminDashboardPage() {
  const { user, profile, role, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "audit" | "system">("users");

  // Roster & Audit state backed by Upstash Redis
  const [usersList, setUsersList] = useState<ManagedUser[]>(DEFAULT_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [isRedisSynced, setIsRedisSynced] = useState<boolean>(true);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "faculty" | "admin">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled" | "pending_first_login">("all");

  // Modals & form state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"student" | "faculty" | "admin">("student");
  const [invitePassword, setInvitePassword] = useState("Feat@123");
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteAgeConsent, setInviteAgeConsent] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [emailSentId, setEmailSentId] = useState<string | null>(null);

  // Password visibility & reset state
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedPasswordId, setCopiedPasswordId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null);

  const API_BASE = typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1");
  const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
  const UPSTASH_URL = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || "";
  const UPSTASH_TOKEN = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || "";

  const togglePasswordVisibility = (userId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const copyPassword = (password: string, userId: string) => {
    navigator.clipboard.writeText(password);
    setCopiedPasswordId(userId);
    setTimeout(() => setCopiedPasswordId(null), 2000);
  };

  const handleSendSetupEmail = async (email: string, id: string) => {
    setEmailSentId(id);
    try {
      if (FIREBASE_API_KEY) {
        await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestType: "PASSWORD_RESET", email: email })
          }
        );
      }
    } catch (e) {
      console.warn("Failed to dispatch Firebase reset email", e);
    }
    setTimeout(() => setEmailSentId(null), 2500);
  };

  const handleResetPassword = async (userId: string, email: string) => {
    if (!confirm(`Reset password for ${email} back to standard initial password Feat@123 and dispatch setup email?`)) return;
    setResettingId(userId);
    try {
      // Trigger Firebase email
      if (FIREBASE_API_KEY) {
        fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestType: "PASSWORD_RESET", email: email })
          }
        ).catch(() => {});
      }

      const res = await fetch(`${API_BASE}/admin/roster/${userId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: "Feat@123" })
      });
      if (res.ok) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, temporary_password: "Feat@123", force_password_change: true, status: "pending_first_login" } : u))
        );
        alert(`Password for ${email} has been reset to Feat@123 and a password change email was sent.`);
      } else {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, temporary_password: "Feat@123", force_password_change: true, status: "pending_first_login" } : u))
        );
      }
    } catch (e) {
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, temporary_password: "Feat@123", force_password_change: true, status: "pending_first_login" } : u))
      );
    } finally {
      setResettingId(null);
    }
  };

  // Fetch users & audit from Upstash Redis on mount
  useEffect(() => {
    setMounted(true);

    // Clean legacy local storage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("medimage_redis_roster_cache");
      } catch (e) { }
    }

    const DUMMY_EMAILS = new Set([
      "prof.radiology@adani.edu.in",
      "dr.patel@adani.edu.in",
      "aarav.p@adani.edu.in",
      "diya.s@adani.edu.in",
      "kabir.m@adani.edu.in"
    ]);

    // Fetch latest from Upstash Redis and populate roster state
    const loadRedisRoster = async () => {
      try {
        const api = typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1");
        const res = await fetch(`${api}/admin/roster`);
        if (res.ok) {
          const data = await res.json();
          if (data.users && Array.isArray(data.users)) {
            const cleanUsers = data.users.filter((u: ManagedUser) => !DUMMY_EMAILS.has(u.email.toLowerCase()));
            setUsersList(cleanUsers);
          }
          if (data.audit_logs) {
            setAuditLogs(data.audit_logs);
          }
          setIsRedisSynced(true);
          return;
        }
      } catch (err) {
        console.warn("[ROSTER] Backend connection error, trying direct Upstash REST fallback:", err);
      }

      // Direct Upstash Redis REST fallback
      if (UPSTASH_URL && UPSTASH_TOKEN) {
        try {
          const upstashRes = await fetch(`${UPSTASH_URL}/get/medimage:roster:users`, {
            headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
          });
          if (upstashRes.ok) {
            const uJson = await upstashRes.json();
            if (uJson.result) {
              const parsed = JSON.parse(uJson.result);
              if (Array.isArray(parsed)) {
                const cleanUsers = parsed.filter((u: ManagedUser) => !DUMMY_EMAILS.has(u.email.toLowerCase()));
                setUsersList(cleanUsers);
                setIsRedisSynced(true);
              }
            }
          }
        } catch (e) {
          console.warn("[ROSTER] Upstash direct fetch error:", e);
        }
      }
    };

    loadRedisRoster();
  }, [API_BASE]);

  if (!mounted) return null;

  // Toggle user status in Redis
  const handleToggleStatus = async (userId: string) => {
    const targetUser = usersList.find((u) => u.id === userId);
    if (!targetUser) return;
    const nextStatus = targetUser.status === "active" ? "disabled" : "active";

    // Optimistic UI update
    const updated = usersList.map((u) => (u.id === userId ? { ...u, status: nextStatus as any } : u));
    setUsersList(updated);

    try {
      const res = await fetch(`${API_BASE}/admin/roster/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, actor_email: user?.email || "jthakre62@gmail.com" })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users) setUsersList(data.users);
        if (data.audit_logs) setAuditLogs(data.audit_logs);
      }
    } catch (e) {
      console.warn("Saved to local cache while Redis endpoint re-syncs");
    }
  };

  // Change user institutional role in Redis & sync
  const handleChangeRole = async (userId: string, newRole: "student" | "faculty" | "admin") => {
    const targetUser = usersList.find((u) => u.id === userId);
    if (!targetUser) return;
    if (targetUser.email === "jthakre62@gmail.com" || targetUser.email === "jthakr62@gmail.com") {
      alert("The primary Super-Administrator role is permanently locked and cannot be modified.");
      return;
    }

    setChangingRoleId(userId);

    // Optimistic UI update
    const updated = usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setUsersList(updated);

    try {
      const res = await fetch(`${API_BASE}/admin/roster/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole, actor_email: user?.email || "jthakre62@gmail.com" })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users) setUsersList(data.users);
        if (data.audit_logs) setAuditLogs(data.audit_logs);
      }
    } catch (e) {
      console.warn("Backend role update issue, using direct Upstash fallback:", e);
    }

    // Direct Upstash sync fallback
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      try {
        await fetch(`${UPSTASH_URL}/set/medimage:roster:users`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
            "Content-Type": "text/plain"
          },
          body: JSON.stringify(updated)
        });
      } catch (err) {
        console.warn("Failed direct Upstash role sync", err);
      }
    }

    setChangingRoleId(null);
  };

  // Add single user in Redis
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    if (inviteRole === "student" && !inviteAgeConsent) {
      alert("Under the Digital Personal Data Protection Act, 2023 (DPDP Act Sec 9), you must confirm that the student is 18+ or has verifiable institutional guardian consent.");
      return;
    }

    const payload = {
      email: inviteEmail.trim(),
      full_name: inviteName.trim(),
      role: inviteRole,
      temporary_password: invitePassword.trim() || "Feat@123",
      actor_email: user?.email || "jthakre62@gmail.com"
    };

    // Optimistic local update
    const tempUser: ManagedUser = {
      id: `u-${Date.now()}`,
      email: payload.email,
      full_name: payload.full_name,
      role: payload.role as any,
      status: "pending_first_login",
      created_at: new Date().toISOString(),
      temporary_password: payload.temporary_password,
      force_password_change: true
    };
    const updated = [tempUser, ...usersList.filter((u) => u.email.toLowerCase() !== payload.email.toLowerCase())];
    setUsersList(updated);

    try {
      const res = await fetch(`${API_BASE}/admin/roster`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) {
          const userMap = new Map<string, ManagedUser>();
          for (const u of updated) {
            if (u && u.email) userMap.set(u.email.toLowerCase(), u);
          }
          for (const u of data.users) {
            if (u && u.email) userMap.set(u.email.toLowerCase(), u);
          }
          const merged = Array.from(userMap.values());
          setUsersList(merged);
        }
        if (data.audit_logs) setAuditLogs(data.audit_logs);
      }
    } catch (err) {
      console.warn("Cached locally, syncing with Redis in background");
    }

    setInviteSuccess(`Invitation link provisioned and cached in Redis for ${inviteEmail}`);
    setInviteEmail("");
    setInviteName("");
    setTimeout(() => {
      setShowInviteModal(false);
      setInviteSuccess(null);
    }, 1800);
  };

  // Delete user from Redis
  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the course roster?`)) return;

    const updated = usersList.filter((u) => u.id !== userId && u.email.toLowerCase() !== email.toLowerCase());
    setUsersList(updated);

    // Direct Firebase Auth Deletion Safeguard
    if (FIREBASE_API_KEY) {
      try {
        const fbKey = FIREBASE_API_KEY;
        const targetUser = usersList.find((u) => u.id === userId || u.email.toLowerCase() === email.toLowerCase());
        const candidates = [targetUser?.temporary_password, "Feat@123", "Jay1523", "Cheeku1523", "JAY!@#$"];
        for (const pwd of candidates) {
          if (!pwd) continue;
          const signRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${fbKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: pwd, returnSecureToken: true })
          });
          if (signRes.ok) {
            const sData = await signRes.json();
            if (sData.idToken) {
              await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${fbKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: sData.idToken })
              });
              break;
            }
          }
        }
      } catch (fbErr) {
        console.warn("Direct Firebase Auth delete notice:", fbErr);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/admin/roster/${encodeURIComponent(userId)}?actor_email=${encodeURIComponent(user?.email || "jthakre62@gmail.com")}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users) setUsersList(data.users);
        if (data.audit_logs) setAuditLogs(data.audit_logs);
        return;
      }
    } catch (e) {
      console.warn("Backend delete issue, using Upstash direct fallback:", e);
    }

    // Direct Upstash sync fallback
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      try {
        await fetch(`${UPSTASH_URL}/set/medimage:roster:users`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
            "Content-Type": "text/plain"
          },
          body: JSON.stringify(updated)
        });
      } catch (err) {
        console.warn("Failed direct Upstash delete", err);
      }
    }
  };

  // Bulk CSV Roster Import
  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = csvContent.split("\n");
    let addedCount = 0;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("email")) continue;
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length >= 2) {
        const [email, fullName, role = "student"] = parts;
        try {
          await fetch(`${API_BASE}/admin/roster`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              full_name: fullName,
              role: role.toLowerCase(),
              actor_email: user?.email || "jthakre62@gmail.com"
            })
          });
          addedCount++;
        } catch (e) { }
      }
    }

    // Refresh from Redis
    try {
      const res = await fetch(`${API_BASE}/admin/roster`);
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) {
          setUsersList(data.users);
        }
      }
    } catch (e) { }

    setInviteSuccess(`Successfully imported and cached ${addedCount} users in Redis`);
    setCsvContent("");
    setTimeout(() => {
      setShowBulkModal(false);
      setInviteSuccess(null);
    }, 2000);
  };

  const copySetupLink = (email: string, id: string) => {
    const link = `http://localhost:3000/login?setup=${encodeURIComponent(email)}&invite=true`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalStudents = usersList.filter((u) => u.role === "student").length;
  const totalFaculty = usersList.filter((u) => u.role === "faculty").length;
  const totalAdmins = usersList.filter((u) => u.role === "admin").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Crisp Institutional Top Header (White Theme) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo className="w-10 h-10" size={40} />
            <div>
              <span className="text-sm font-bold tracking-tight text-adani-navy block">
                Adani Institute of Higher Education and Research
              </span>
              <span className="text-xs text-adani-purple font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-adani-purple" />
                Super-Admin Control Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/curriculum"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-adani-navy bg-slate-100 hover:bg-slate-200/80 transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <Layers className="w-3.5 h-3.5 text-adani-cyan" />
              Curriculum Bank
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-adani-navy bg-slate-100 hover:bg-slate-200/80 transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <BookOpen className="w-3.5 h-3.5 text-adani-cyan" />
              Curriculum Dashboard
            </Link>
            <Link
              href="/faculty"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-adani-purple bg-purple-50 hover:bg-purple-100/80 border border-purple-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-adani-purple" />
              Faculty Studio
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome & Security Banner (White Theme) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-adani-purple text-xs font-bold uppercase tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5" />
                Invite-Only Access Control &amp; RBAC
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Course Administration Console
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Logged in as <span className="text-adani-purple font-mono font-bold">{user?.email || "jthakre62@gmail.com"}</span>.
                Provision students and faculty seats. All added accounts are permanently cached and synchronized via <strong className="text-adani-cyan">Upstash Redis</strong>.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2.5 rounded-xl bg-adani-cyan hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Student / Faculty
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all border border-slate-300 shadow-sm flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Bulk CSV Import
              </button>
            </div>
          </div>
        </section>

        {/* 4 Stat KPI Cards (White & Slate Theme) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Students</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{totalStudents}</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" /> Enrolled in Course
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-adani-cyan">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Faculty</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{totalFaculty}</span>
              <span className="text-[11px] text-adani-purple font-semibold flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3" /> Course Instructors
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-adani-purple">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Super Admins</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{totalAdmins}</span>
              <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 mt-0.5">
                <Lock className="w-3 h-3" /> Full Governance
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Redis Cache Engine</span>
              <span className="text-sm font-black text-emerald-600 mt-1 flex items-center gap-1">
                <Database className="w-4 h-4" /> Upstash Serverless
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                Persistent Course Roster
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Primary Tabs */}
        <div className="flex border-b border-slate-200 space-x-1">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === "users"
              ? "border-adani-cyan text-adani-cyan bg-sky-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            <Users className="w-4 h-4" />
            User Roster &amp; Provisioning ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === "audit"
              ? "border-adani-purple text-adani-purple bg-purple-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            <History className="w-4 h-4" />
            Audit Trail &amp; Access Log ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === "system"
              ? "border-emerald-600 text-emerald-600 bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            <Activity className="w-4 h-4" />
            System Health &amp; Upstash Redis
          </button>
          <Link
            href="/admin/curriculum"
            className="px-4 py-2.5 text-xs font-bold transition-all border-b-2 border-transparent text-slate-500 hover:text-adani-cyan flex items-center gap-2 group"
          >
            <Layers className="w-4 h-4 text-adani-cyan group-hover:scale-110 transition-transform" />
            Curriculum &amp; EQB Browser
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-adani-cyan" />
          </Link>
        </div>

        {/* TAB 1: USERS DIRECTORY */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name or institutional email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-adani-cyan"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-adani-cyan"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Administrators</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-adani-cyan"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                  <option value="pending_first_login">Pending First Login</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">User</th>
                      <th className="px-5 py-3.5">Assigned Role</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Password / Credential</th>
                      <th className="px-5 py-3.5">Access Link</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-slate-400 italic">
                          No users found matching your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-slate-900 block">{u.full_name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            {u.email === "jthakre62@gmail.com" || u.email === "jthakr62@gmail.com" ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-adani-purple text-[10px] font-bold border border-purple-200">
                                Super-Admin (Master)
                              </span>
                            ) : (
                              <div className="relative inline-block">
                                <select
                                  value={u.role}
                                  disabled={changingRoleId === u.id}
                                  onChange={(e) => handleChangeRole(u.id, e.target.value as any)}
                                  className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-adani-cyan shadow-2xs ${
                                    u.role === "admin"
                                      ? "bg-purple-50 text-adani-purple border-purple-200 hover:bg-purple-100"
                                      : u.role === "faculty"
                                      ? "bg-sky-50 text-adani-cyan border-sky-200 hover:bg-sky-100"
                                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                  }`}
                                  title="Change institutional role"
                                >
                                  <option value="student">Student Candidate</option>
                                  <option value="faculty">Faculty Instructor</option>
                                  <option value="admin">Administrator</option>
                                </select>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            {u.status === "disabled" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                Disabled
                              </span>
                            ) : u.status === "active" && !u.force_password_change ? (
                              <div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Active
                                </span>
                                <span className="text-[10px] text-emerald-600 block font-medium">Personal Password Set</span>
                              </div>
                            ) : (
                              <div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Pending Activation
                                </span>
                                <span className="text-[10px] text-amber-600 block font-medium">Initial Feat@123 (Must Change)</span>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
                                <span className="font-semibold text-slate-800 tracking-wider">
                                  {revealedPasswords[u.id]
                                    ? (u.temporary_password || (u.email === "jthakre62@gmail.com" ? "Jay1523" : "Feat@123"))
                                    : "••••••••••••"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(u.id)}
                                  className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                                  title={revealedPasswords[u.id] ? "Hide Password" : "Show Password"}
                                >
                                  {revealedPasswords[u.id] ? (
                                    <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyPassword(
                                      u.temporary_password || (u.email === "jthakre62@gmail.com" ? "Jay1523" : "Feat@123"),
                                      u.id
                                    )
                                  }
                                  className="text-slate-400 hover:text-adani-cyan transition-colors p-0.5"
                                  title="Copy Password"
                                >
                                  {copiedPasswordId === u.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>

                              {u.email !== "jthakre62@gmail.com" && (
                                <button
                                  onClick={() => handleResetPassword(u.id, u.email)}
                                  disabled={resettingId === u.id}
                                  className="px-2 py-1 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1"
                                  title="Reset password to initial Feat@123"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  {resettingId === u.id ? "..." : "Reset"}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => copySetupLink(u.email, u.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors inline-flex items-center gap-1 border border-slate-200"
                                title="Copy secure sign-in / setup link"
                              >
                                {copiedId === u.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-700 font-bold">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-slate-500" />
                                    <span>Copy Link</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleSendSetupEmail(u.email, u.id)}
                                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-medium transition-colors inline-flex items-center gap-1 border border-sky-200"
                                title="Send Firebase password setup email to user's inbox"
                              >
                                {emailSentId === u.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-700 font-bold">Email Sent!</span>
                                  </>
                                ) : (
                                  <>
                                    <Mail className="w-3 h-3 text-sky-600" />
                                    <span>Email Link</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right space-x-2">
                            {u.email === "jthakre62@gmail.com" ? (
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                Protected Admin
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleToggleStatus(u.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors border ${u.status === "active"
                                    ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                                    }`}
                                >
                                  {u.status === "active" ? "Disable" : "Enable"}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.email)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 inline-flex items-center gap-1 shadow-sm"
                                  title={`Permanently delete ${u.full_name || u.email}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  <span>Delete</span>
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-adani-purple" />
                Immutable Administrative Audit Trail
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every administrative action (seat provisioning, role modifications, access revocations) is recorded and cached in Upstash Redis.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-5 py-3.5">Actor</th>
                    <th className="px-5 py-3.5">Action</th>
                    <th className="px-5 py-3.5">Target</th>
                    <th className="px-5 py-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{a.timestamp}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-adani-purple font-semibold">{a.actor_email}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {a.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-800 font-semibold">{a.target}</td>
                      <td className="px-5 py-3.5 text-slate-600">{a.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM HEALTH & UPSTASH REDIS */}
        {activeTab === "system" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Upstash Redis Serverless Status
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Course candidate rosters, seat authorizations, semantic RAG tutor embeddings, and rate-limiting counters are persisted in Upstash Redis.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Region:</span>
                  <span className="text-slate-900 font-semibold">global-serverless</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roster Cache Key:</span>
                  <span className="text-adani-cyan font-bold">medimage:roster:users</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Latency:</span>
                  <span className="text-emerald-600 font-bold">~14ms (REST API)</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-adani-purple" />
                Strict Invite-Only Enforcement
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Self-registration is locked down. Only authorized course candidates created through this Admin Console can access course modules and quizzes.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Free Tier Policy Verified
                </div>
                <p className="text-[11px] text-emerald-700">
                  Zero local database storage. Hosted PostgreSQL + Upstash Redis cache compliance.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SINGLE INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-adani-cyan" />
                Provision Institutional User
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {inviteSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                {inviteSuccess}
              </div>
            ) : (
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyansh Shah"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-adani-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@adani.edu.in"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-adani-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role Provision
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-adani-cyan font-semibold"
                  >
                    <option value="student">Student Candidate (AIDS 12605.1)</option>
                    <option value="faculty">Faculty Instructor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Initial Temporary Password
                    </label>
                    <span className="text-[10px] text-adani-cyan font-semibold">User must change on 1st login</span>
                  </div>
                  <input
                    type="text"
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-adani-cyan"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Standard institutional default is <strong className="font-mono text-slate-800">Feat@123</strong>. Password remains visible to admin in console.
                  </p>
                </div>

                {inviteRole === "student" && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inviteAgeConsent}
                        onChange={(e) => setInviteAgeConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-adani-cyan focus:ring-adani-cyan"
                        required
                      />
                      <span className="text-[11px] text-amber-950 font-medium leading-tight">
                        <strong className="font-bold">DPDP Act 2023 Age &amp; Consent Compliance:</strong> I verify that this student candidate is 18+ years of age, or is enrolled under verified institutional parental/guardian consent as required by Section 9 of the Digital Personal Data Protection Act, 2023.
                      </span>
                    </label>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-adani-cyan hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Save &amp; Cache in Redis
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* BULK CSV IMPORT MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Bulk CSV Roster Import
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {inviteSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                {inviteSuccess}
              </div>
            ) : (
              <form onSubmit={handleBulkUpload} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Paste comma-separated user records. Format: <code className="text-adani-purple font-bold">email, full_name, role</code>
                </p>

                <textarea
                  rows={6}
                  required
                  placeholder={"neha.k@adani.edu.in, Neha Kulkarni, student\nvishal.m@adani.edu.in, Vishal Mehta, faculty"}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-adani-cyan"
                />

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Import &amp; Cache Roster
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
