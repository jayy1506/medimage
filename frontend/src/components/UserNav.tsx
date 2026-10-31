"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  LogOut, 
  HelpCircle, 
  User, 
  Shield, 
  GraduationCap, 
  ChevronDown, 
  ExternalLink,
  Mail,
  Building,
  KeyRound,
  Sparkles,
  BookOpen,
  Wrench,
  X
} from "lucide-react";

export function UserNav() {
  const { user, profile, role, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fullName = profile?.full_name || user?.displayName || "Jay Thakre";
  const email = profile?.email || user?.email || "jay.thakre@adani.edu.in";
  const userRole = profile?.role || role || "student";

  // Compute initials for the avatar logo
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(fullName);

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-adani-cyan via-purple-600 to-adani-purple hover:opacity-90 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white border border-slate-200 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-adani-cyan/40 touch-manipulation cursor-pointer"
          title={`${fullName} (${email})`}
        >
          {initials}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            {/* User Identity Section */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-adani-cyan to-adani-purple flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white flex-shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{fullName}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{email}</p>
                <div className="mt-1">
                  {userRole === "admin" ? (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-purple-50 text-adani-purple text-[10px] font-bold border border-purple-200">
                      Super-Admin
                    </span>
                  ) : userRole === "faculty" ? (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-sky-50 text-adani-cyan text-[10px] font-bold border border-sky-200">
                      Faculty Instructor
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                      Student Candidate
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation links inside menu */}
            <div className="py-1 text-xs text-slate-700 border-b border-slate-100">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4 text-adani-cyan" />
                Course Dashboard
              </Link>

              <Link
                href="/medical-imaging-tools"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 hover:bg-sky-50 font-medium text-slate-700 transition-colors"
              >
                <Wrench className="w-4 h-4 text-adani-cyan" />
                Medical Imaging Tools
              </Link>

              <Link
                href="/tutor"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-adani-purple" />
                MedAI Clinical Tutor
              </Link>

              {userRole === "faculty" && (
                <Link
                  href="/faculty"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium text-adani-purple transition-colors"
                >
                  <Shield className="w-4 h-4 text-adani-purple" />
                  Faculty Studio
                </Link>
              )}

              {userRole === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 font-medium text-adani-purple transition-colors"
                >
                  <Shield className="w-4 h-4 text-adani-purple" />
                  Admin Console
                </Link>
              )}
            </div>

            {/* Help & Support Option */}
            <div className="py-1">
              <Link
                href="/help"
                onClick={() => setIsOpen(false)}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-adani-navy transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-adani-cyan" />
                Help &amp; Documentation
              </Link>
            </div>

            <div className="border-t border-slate-100 pt-1">
              {/* Sign Out Option */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Institutional Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-adani-cyan">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Institutional Help &amp; Support</h3>
                  <p className="text-[11px] text-slate-500">AIDS 12605.1 • Medical Image &amp; Text Processing</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-adani-cyan" />
                  Course &amp; Academic Assistance
                </p>
                <p className="text-[11px]">
                  <strong>Instructor:</strong> Dr. R. K. Sharma (Radiology &amp; AI Department)
                </p>
                <p className="text-[11px] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>Email:</span>
                  <a href="mailto:prof.radiology@adani.edu.in" className="text-adani-cyan hover:underline font-mono">
                    prof.radiology@adani.edu.in
                  </a>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-adani-purple" />
                  Credentials &amp; Access Support
                </p>
                <p className="text-[11px]">
                  Platform accounts are invite-only and provisioned directly by the course administrator.
                  New candidates receive the standard initial password <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-slate-900">Feat@123</code> which can be updated upon first sign-in.
                </p>
                <p className="text-[11px] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>Admin Contact:</span>
                  <a href="mailto:jthakre62@gmail.com" className="text-adani-purple hover:underline font-mono">
                    jthakre62@gmail.com
                  </a>
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 text-emerald-900">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Quick Tips &amp; Workstations
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-emerald-800">
                  <li><strong>Medical Imaging Sandbox:</strong> Test DICOM contrast windows (Bone, Soft Tissue, Lung) in real-time.</li>
                  <li><strong>Interactive Diagrams:</strong> Click diagram nodes to trigger localized clinical explanations.</li>
                  <li><strong>Module Assessments:</strong> Take 5-question clinical evaluations at the conclusion of each unit.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-adani-navy hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Close Support Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
