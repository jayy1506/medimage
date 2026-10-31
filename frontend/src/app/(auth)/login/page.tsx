"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldAlert, CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BrandLogo } from "@/components/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, resetPassword, updateUserPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // First-time password change modal state
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [pendingUserRole, setPendingUserRole] = useState<string>("student");
  const [changeError, setChangeError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (isResetMode) {
        await resetPassword(email);
        setResetSent(true);
      } else {
        const userProf = await signIn(email, password);
        const norm = email.trim().toLowerCase();

        // Root Super-Admin routes directly without password change prompt
        if (norm === "jthakre62@gmail.com" || norm === "jthakr62@gmail.com") {
          router.push("/admin");
          return;
        }

        // If user logged in with default Feat@123 or has force_password_change flag
        if (userProf?.force_password_change) {
          setPendingUserRole(userProf.role);
          setShowFirstTimeModal(true);
          return;
        }

        // Regular login destination
        if (userProf?.role === "admin") {
          router.push("/admin");
        } else if (userProf?.role === "faculty") {
          router.push("/faculty");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setErrorMessage("Invalid institutional email or password. Default initial password is Feat@123.");
      } else if (err.code === "auth/user-not-found") {
        setErrorMessage("No account exists for this email. Contact your course administrator for an invite.");
      } else if (err.code === "auth/too-many-requests") {
        setErrorMessage("Access temporarily locked due to multiple failed attempts. Please reset your password or try again later.");
      } else {
        setErrorMessage(err.message || "Failed to authenticate.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirstTimePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError("");

    if (newPassword.length < 6) {
      setChangeError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword === "Feat@123") {
      setChangeError("New password must be different from the default password (Feat@123).");
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const success = await updateUserPassword(email, newPassword);
    setIsLoading(false);

    if (success) {
      setShowFirstTimeModal(false);
      if (pendingUserRole === "admin") {
        router.push("/admin");
      } else if (pendingUserRole === "faculty") {
        router.push("/faculty");
      } else {
        router.push("/dashboard");
      }
    } else {
      setChangeError("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <BrandLogo className="w-16 h-16" size={64} />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-adani-cyan">
          Faculty of Engineering and Technology
        </h2>
        <h1 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">
          GyaanLab
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-mono">Academic Workstation</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          {/* Strict Invite-Only Notice */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
            <ShieldAlert className="w-4 h-4 text-adani-purple flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Invite-Only Access: </span>
              Registration is provisioned exclusively by course administrators. Default initial password is <code className="text-adani-purple font-bold">Feat@123</code>.
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
              {errorMessage}
            </div>
          )}

          {resetSent ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-sm">Activation / Reset Link Sent</h3>
              <p className="text-xs text-emerald-700">
                If an active account exists for <span className="font-semibold">{email}</span>, a secure password setup link has been dispatched.
              </p>
              <button
                type="button"
                onClick={() => {
                  setResetSent(false);
                  setIsResetMode(false);
                }}
                className="text-xs font-bold text-adani-cyan hover:underline block mx-auto pt-2"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Email
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@adani.edu.in"
                    className="block w-full pl-10 pr-3 py-2.5 sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-adani-cyan focus:border-adani-cyan bg-white text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              {!isResetMode && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsResetMode(true)}
                      className="text-xs font-semibold text-adani-cyan hover:text-adani-purple transition-colors"
                    >
                      First time / Forgot password?
                    </button>
                  </div>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="block w-full pl-10 pr-10 py-2.5 sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-adani-cyan focus:border-adani-cyan bg-white text-slate-900 placeholder-slate-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-adani-navy hover:bg-adani-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adani-cyan transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  "Authenticating..."
                ) : isResetMode ? (
                  "Send Password Setup Link"
                ) : (
                  <>
                    Sign In to Workstation
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>

              {isResetMode && (
                <button
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel and return to sign in
                </button>
              )}

              {/* DPDP Act 2023 Statutory Privacy & Age Confirmation */}
              <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-500 text-center leading-relaxed">
                By accessing this portal, you affirm you are 18+ or enrolled with verified institutional guardian consent under the <strong>DPDP Act, 2023 (Sec 9)</strong>. Telemetry is processed solely for academic grading with zero keystroke recording or commercial tracking.
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center space-y-1 text-xs text-slate-500">
          <p>
            Enrolled student or faculty without access?{" "}
            <span className="font-semibold text-slate-700">Contact Course Faculty or Dept Admin</span>
          </p>
          <p className="text-[10px] text-slate-400">
            Adani University (AIHER) • Accredited Academic Workstation
          </p>
        </div>
      </div>

      {/* FIRST TIME LOGIN PASSWORD CHANGE MODAL */}
      {showFirstTimeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-adani-purple flex items-center justify-center mx-auto mb-2 border border-purple-200">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                First-Time Login Activation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Welcome <span className="font-bold text-adani-cyan">{email}</span>. You signed in using the common default password (<code className="font-bold text-adani-purple">Feat@123</code>). Please choose a new secure password to proceed.
              </p>
            </div>

            {changeError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
                {changeError}
              </div>
            )}

            <form onSubmit={handleFirstTimePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Enter new password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-adani-cyan font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-adani-cyan font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-adani-cyan hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                {isLoading ? "Saving New Password..." : "Set Password & Enter Workstation"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
