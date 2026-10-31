"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ALL_MODULES } from "@/data/curriculumData";

interface UserProgressData {
  email: string;
  completed_topics: string[];
  module_scores: Record<string, number>;
  attempts: Record<string, number>;
  cleared_modules: string[];
  last_updated: string;
}

export interface COAttainment {
  code: string;
  title: string;
  score: number;
  target: number;
  status: "Met" | "In Progress" | "Pending";
}

interface ProgressContextType {
  completedTopics: string[];
  moduleScores: Record<string, number>;
  attempts: Record<string, number>;
  clearedModules: string[];
  isLoading: boolean;
  isTopicCompleted: (topicSlug: string) => boolean;
  toggleTopicCompletion: (topicSlug: string, isCompleted?: boolean) => Promise<boolean>;
  recordAssessmentScore: (moduleId: string, scorePct: number) => Promise<void>;
  resetProgress: () => Promise<void>;
  totalTopicsCount: number;
  completedTopicsCount: number;
  clearedModulesCount: number;
  completionPct: number;
  coAttainments: COAttainment[];
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType>({
  completedTopics: [],
  moduleScores: {},
  attempts: {},
  clearedModules: [],
  isLoading: true,
  isTopicCompleted: () => false,
  toggleTopicCompletion: async () => false,
  recordAssessmentScore: async () => {},
  resetProgress: async () => {},
  totalTopicsCount: 0,
  completedTopicsCount: 0,
  clearedModulesCount: 0,
  completionPct: 0,
  coAttainments: [],
  refreshProgress: async () => {}
});

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [moduleScores, setModuleScores] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [clearedModules, setClearedModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeEmail = useMemo(() => {
    return (profile?.email || user?.email || "").trim().toLowerCase();
  }, [profile, user]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // Total topics across all 6 accredited curriculum modules
  const totalTopicsCount = useMemo(() => {
    return ALL_MODULES.reduce((acc, m) => acc + m.topics.length, 0);
  }, []);

  // Hydrate progress when active user changes
  const loadUserProgress = useCallback(async () => {
    if (!activeEmail) {
      setCompletedTopics([]);
      setModuleScores({});
      setAttempts({});
      setClearedModules([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // 1. Try local storage cache for instant rendering
    const cacheKey = `medimage_progress_${activeEmail}`;
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed: UserProgressData = JSON.parse(cached);
          setCompletedTopics(parsed.completed_topics || []);
          setModuleScores(parsed.module_scores || {});
          setAttempts(parsed.attempts || {});
          setClearedModules(parsed.cleared_modules || []);
        } catch (e) {}
      } else {
        // Brand new user with zero local cache: start at 0
        setCompletedTopics([]);
        setModuleScores({});
        setAttempts({});
        setClearedModules([]);
      }
    }

    // 2. Fetch from Upstash Redis API
    try {
      const res = await fetch(`${API_BASE}/course/user-progress?email=${encodeURIComponent(activeEmail)}`);
      if (res.ok) {
        const data: UserProgressData = await res.json();
        setCompletedTopics(data.completed_topics || []);
        setModuleScores(data.module_scores || {});
        setAttempts(data.attempts || {});
        setClearedModules(data.cleared_modules || []);

        if (typeof window !== "undefined") {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn("[PROGRESS] Backend fetch fallback to local cache:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeEmail, API_BASE]);

  useEffect(() => {
    loadUserProgress();
  }, [loadUserProgress]);

  const isTopicCompleted = useCallback((topicSlug: string): boolean => {
    if (!topicSlug) return false;
    return completedTopics.includes(topicSlug);
  }, [completedTopics]);

  const toggleTopicCompletion = useCallback(async (topicSlug: string, explicitComplete?: boolean): Promise<boolean> => {
    if (!activeEmail || !topicSlug) return false;

    const currentlyComplete = completedTopics.includes(topicSlug);
    const nextState = explicitComplete !== undefined ? explicitComplete : !currentlyComplete;

    // Optimistic UI update
    let nextList: string[];
    if (nextState) {
      nextList = Array.from(new Set([...completedTopics, topicSlug]));
    } else {
      nextList = completedTopics.filter((s) => s !== topicSlug);
    }
    setCompletedTopics(nextList);

    // Save locally
    const cacheKey = `medimage_progress_${activeEmail}`;
    if (typeof window !== "undefined") {
      const updatedObj = {
        email: activeEmail,
        completed_topics: nextList,
        module_scores: moduleScores,
        attempts: attempts,
        cleared_modules: clearedModules,
        last_updated: new Date().toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify(updatedObj));
    }

    // Persist to Upstash Redis
    try {
      await fetch(`${API_BASE}/course/user-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: activeEmail,
          topic_slug: topicSlug,
          is_completed: nextState
        })
      });
    } catch (e) {
      console.warn("Topic completion saved in local storage, syncing Redis in background");
    }

    return nextState;
  }, [activeEmail, completedTopics, moduleScores, attempts, clearedModules, API_BASE]);

  const recordAssessmentScore = useCallback(async (moduleId: string, scorePct: number): Promise<void> => {
    if (!activeEmail || !moduleId) return;

    const nextAttempts = { ...attempts, [moduleId]: (attempts[moduleId] || 0) + 1 };
    const prevBest = moduleScores[moduleId] || 0;
    const nextBest = Math.max(prevBest, scorePct);
    const nextScores = { ...moduleScores, [moduleId]: nextBest };
    
    let nextCleared = [...clearedModules];
    if (scorePct > 75.0 && !nextCleared.includes(moduleId)) {
      nextCleared.push(moduleId);
    }

    setAttempts(nextAttempts);
    setModuleScores(nextScores);
    setClearedModules(nextCleared);

    // Save locally
    const cacheKey = `medimage_progress_${activeEmail}`;
    if (typeof window !== "undefined") {
      const updatedObj = {
        email: activeEmail,
        completed_topics: completedTopics,
        module_scores: nextScores,
        attempts: nextAttempts,
        cleared_modules: nextCleared,
        last_updated: new Date().toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify(updatedObj));
    }

    // Persist to Upstash Redis
    try {
      await fetch(`${API_BASE}/course/user-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: activeEmail,
          module_id: moduleId,
          score_pct: scorePct
        })
      });
    } catch (e) {
      console.warn("Score saved locally, syncing Redis in background");
    }
  }, [activeEmail, attempts, moduleScores, clearedModules, completedTopics, API_BASE]);

  const resetProgress = useCallback(async (): Promise<void> => {
    if (!activeEmail) return;

    setCompletedTopics([]);
    setModuleScores({});
    setAttempts({});
    setClearedModules([]);

    const cacheKey = `medimage_progress_${activeEmail}`;
    if (typeof window !== "undefined") {
      localStorage.removeItem(cacheKey);
    }

    try {
      await fetch(`${API_BASE}/course/user-progress/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: activeEmail })
      });
    } catch (e) {}
  }, [activeEmail, API_BASE]);

  // Derived metrics
  const completedTopicsCount = completedTopics.length;
  const clearedModulesCount = clearedModules.length;
  
  // Dynamic blended course progress: reflects both topic study and assessment mastery
  const completionPct = useMemo(() => {
    const total = Math.max(totalTopicsCount, 36);
    const topicRatio = completedTopicsCount / total;
    const moduleRatio = clearedModulesCount / 6;
    // 60% weight on completing curriculum topics + 40% weight on cleared assessments
    const blended = Math.round(topicRatio * 60 + moduleRatio * 40);
    return Math.min(100, Math.max(0, blended));
  }, [completedTopicsCount, totalTopicsCount, clearedModulesCount]);

  // Dynamic Course Outcome (CO) Attainments calculated from user progress
  const coAttainments = useMemo((): COAttainment[] => {
    const coMap: Record<string, { title: string; target: number; topics: string[]; score: number }> = {
      CO1: { title: "Medical Image Sources & Physics", target: 75.0, topics: [], score: 0 },
      CO2: { title: "DICOM Standards & Protocols", target: 75.0, topics: [], score: 0 },
      CO3: { title: "2D Filtering & Transforms", target: 75.0, topics: [], score: 0 },
      CO4: { title: "3D Reconstruction & Segmentation", target: 75.0, topics: [], score: 0 },
      CO5: { title: "Clinical NLP & Diagnostics", target: 75.0, topics: [], score: 0 }
    };

    // Populate topics per CO tag
    for (const m of ALL_MODULES) {
      for (const t of m.topics) {
        for (const tag of t.co_tags || []) {
          if (coMap[tag]) {
            coMap[tag].topics.push(t.slug);
          }
        }
      }
    }

    return Object.entries(coMap).map(([code, meta]) => {
      const totalInCO = meta.topics.length || 1;
      const completedInCO = meta.topics.filter((slug) => completedTopics.includes(slug)).length;
      
      // Calculate score based on topics completed and module assessment if applicable
      const topicRatio = completedInCO / totalInCO;
      const score = Math.round(topicRatio * 100 * 10) / 10;

      let status: "Met" | "In Progress" | "Pending" = "Pending";
      if (score >= meta.target) {
        status = "Met";
      } else if (score > 0) {
        status = "In Progress";
      }

      return {
        code,
        title: meta.title,
        score,
        target: meta.target,
        status
      };
    });
  }, [completedTopics]);

  return (
    <ProgressContext.Provider
      value={{
        completedTopics,
        moduleScores,
        attempts,
        clearedModules,
        isLoading,
        isTopicCompleted,
        toggleTopicCompletion,
        recordAssessmentScore,
        resetProgress,
        totalTopicsCount,
        completedTopicsCount,
        clearedModulesCount,
        completionPct,
        coAttainments,
        refreshProgress: loadUserProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
