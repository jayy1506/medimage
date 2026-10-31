"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  alias: string;
  xp: number;
  missionsCompleted: number;
  streakDays: number;
}

export const ALL_BADGES: Badge[] = [
  {
    id: "badge-hounsfield",
    name: "Hounsfield Calibrator",
    description: "Earn 3 stars on any CT Windowing clinical mission.",
    icon: "Sliders"
  },
  {
    id: "badge-pipeline",
    name: "Pipeline Architect",
    description: "Chain a 4-step image processing pipeline and export Python code.",
    icon: "Layers"
  },
  {
    id: "badge-fourier",
    name: "Fourier Sorcerer",
    description: "Isolate and suppress periodic RF interference in the frequency domain.",
    icon: "Radio"
  },
  {
    id: "badge-artifact",
    name: "Artifact Sleuth",
    description: "Spot and diagnose all medical imaging artifacts with 100% accuracy.",
    icon: "ShieldAlert"
  },
  {
    id: "badge-otsu",
    name: "Otsu Optimizer",
    description: "Maximize inter-class variance to delineate tumor boundary.",
    icon: "Scissors"
  },
  {
    id: "badge-streak",
    name: "Clinical Dedication",
    description: "Maintain a 3-day active clinical learning streak.",
    icon: "Flame"
  }
];

interface GamificationContextType {
  xp: number;
  streakDays: number;
  bestScores: Record<string, number>; // missionId -> best score
  unlockedBadges: string[]; // badgeIds
  recordMissionScore: (missionId: string, score: number) => { isNewBest: boolean; xpEarned: number };
  unlockBadge: (badgeId: string) => boolean;
  leaderboard: LeaderboardEntry[];
  dailyChallengeCompleted: boolean;
  completeDailyChallenge: () => void;
  resetGamification: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY = "mtip_gamification_state_v2";

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState<boolean>(false);

  // Load from local storage on mount (browser session)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Purge legacy mock data with pre-filled dummy scores
        localStorage.removeItem("mtip_gamification_state");
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.xp === "number") setXp(parsed.xp);
          if (typeof parsed.streakDays === "number") setStreakDays(parsed.streakDays);
          if (parsed.bestScores) setBestScores(parsed.bestScores);
          if (parsed.unlockedBadges) setUnlockedBadges(parsed.unlockedBadges);
          if (parsed.dailyChallengeCompleted !== undefined) {
            setDailyChallengeCompleted(parsed.dailyChallengeCompleted);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveState = (
    newXp: number,
    newStreak: number,
    newBests: Record<string, number>,
    newBadges: string[],
    newDaily: boolean
  ) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          xp: newXp,
          streakDays: newStreak,
          bestScores: newBests,
          unlockedBadges: newBadges,
          dailyChallengeCompleted: newDaily
        })
      );
    } catch (e) {
      // ignore
    }
  };

  const recordMissionScore = (missionId: string, score: number) => {
    const prev = bestScores[missionId] || 0;
    const isNewBest = score > prev;
    const newBests = { ...bestScores, [missionId]: Math.max(score, prev) };
    setBestScores(newBests);

    // Calculate XP: 1 XP per point, plus 50 bonus for passing (>75)
    let xpEarned = Math.round(score * 0.8);
    if (score >= 75) xpEarned += 40;
    if (score >= 90) xpEarned += 60; // 3-star bonus

    const nextStreak = streakDays === 0 ? 1 : streakDays;
    setStreakDays(nextStreak);

    const newXp = xp + xpEarned;
    setXp(newXp);

    const newBadges = [...unlockedBadges];
    if (score >= 90 && !newBadges.includes("badge-hounsfield")) {
      newBadges.push("badge-hounsfield");
    }
    setUnlockedBadges(newBadges);

    saveState(newXp, nextStreak, newBests, newBadges, dailyChallengeCompleted);
    return { isNewBest, xpEarned };
  };

  const unlockBadge = (badgeId: string) => {
    if (unlockedBadges.includes(badgeId)) return false;
    const next = [...unlockedBadges, badgeId];
    setUnlockedBadges(next);
    const nextXp = xp + 100;
    setXp(nextXp);
    saveState(nextXp, streakDays, bestScores, next, dailyChallengeCompleted);
    return true;
  };

  const completeDailyChallenge = () => {
    if (dailyChallengeCompleted) return;
    setDailyChallengeCompleted(true);
    const nextStreak = streakDays === 0 ? 1 : streakDays;
    setStreakDays(nextStreak);
    const nextXp = xp + 150;
    setXp(nextXp);
    saveState(nextXp, nextStreak, bestScores, unlockedBadges, true);
  };

  const resetGamification = () => {
    setXp(0);
    setStreakDays(0);
    setBestScores({});
    setUnlockedBadges([]);
    setDailyChallengeCompleted(false);
    try {
      localStorage.removeItem("mtip_gamification_state");
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  // Anonymized institutional class leaderboard
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, alias: "Roentgen-07", xp: 1250, missionsCompleted: 5, streakDays: 7 },
    { rank: 2, alias: "Curie-42", xp: 1120, missionsCompleted: 5, streakDays: 6 },
    { rank: 3, alias: "Hounsfield-99", xp: 980, missionsCompleted: 4, streakDays: 4 },
    { rank: 4, alias: "You (Student)", xp: xp, missionsCompleted: Object.keys(bestScores).length, streakDays: streakDays },
    { rank: 5, alias: "Lauterbur-18", xp: 640, missionsCompleted: 3, streakDays: 2 },
    { rank: 6, alias: "Cormack-33", xp: 520, missionsCompleted: 2, streakDays: 3 },
    { rank: 7, alias: "Mansfield-51", xp: 480, missionsCompleted: 2, streakDays: 1 }
  ].sort((a, b) => b.xp - a.xp).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return (
    <GamificationContext.Provider
      value={{
        xp,
        streakDays,
        bestScores,
        unlockedBadges,
        recordMissionScore,
        unlockBadge,
        leaderboard,
        dailyChallengeCompleted,
        completeDailyChallenge,
        resetGamification
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
}
