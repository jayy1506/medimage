"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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
        // Role-based destination routing
        if (email.toLowerCase() === "jthakre62@gmail.com" || userProf?.role === "admin") {
          router.push("/admin");
        } else if (userProf?.role === "faculty") {
          router.push("/faculty");
        } else {
          router.push("/course");
        }
      }
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setErrorMessage("Invalid institutional email or password.");
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block relative h-16 w-64 mb-4">
          <Image
            src="/assets/logo.png"
            alt="Adani Institute of Higher Education and Research"
            fill
            priority
            className="object-contain"
          />
        </Link>
        <h2 className="text-xs font-bold uppercase tracking-widest text-adani-cyan">
          Faculty of Engineering and Technology
        </h2>
        <h1 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">
          Medical Text and Image Processing
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-mono">AIDS 12605.1 • Academic Workstation</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          {/* Strict Invite-Only Notice */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
            <ShieldAlert className="w-4 h-4 text-adani-purple flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Invite-Only Access: </span>
              Registration is provisioned exclusively by course administrators. No public signup.
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
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
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="block w-full pl-10 pr-3 py-2.5 sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-adani-cyan focus:border-adani-cyan bg-white text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adani-purple disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  "Verifying Credentials..."
                ) : isResetMode ? (
                  "Send Setup / Reset Link"
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
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Enrolled in Course AIDS 12605.1 without access?{" "}
          <span className="font-semibold text-slate-700">Contact Course Faculty or Dept Admin</span>
        </p>
      </div>
    </div>
  );
}
